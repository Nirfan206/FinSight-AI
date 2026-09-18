import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true, // Crucial for security context propagation & session management
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach the current access token to every outgoing request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Queue-based silent refresh pipeline configurations
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    refreshQueue = [];
};

const forceLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Fall through immediately if not a 401, or if this request is already a retry instance
        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Prevent infinite loops if authentication routing fails
        if (originalRequest.url?.includes("/auth/")) {
            forceLogout();
            return Promise.reject(error);
        }

        // If a refresh is already in-flight, queue up subsequent requests
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            })
                .then((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (!storedRefreshToken) {
            isRefreshing = false;
            forceLogout();
            return Promise.reject(error);
        }

        try {
            // Use a clean, plain Axios instance to completely sidestep global interceptor loops
            const res = await axios.post("http://localhost:8080/api/auth/refresh-token", {
                refreshToken: storedRefreshToken,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            // FIXED: Defensive fallback mapping matching nested data structures or standard responses
            const newAccessToken = res.data?.data?.token || res.data?.token || res.data?.data?.accessToken || res.data?.accessToken;
            const newRefreshToken = res.data?.data?.refreshToken || res.data?.refreshToken;

            if (!newAccessToken) {
                throw new Error("Token extraction failed: Target value not present in payload mapping blueprint.");
            }

            localStorage.setItem("token", newAccessToken);
            if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
            }

            processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            forceLogout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;