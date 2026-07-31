import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
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

// Queue-based silent refresh: if multiple requests 401 at once, only one
// refresh call fires; the rest wait for it and retry with the new token.
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
    localStorage.removeItem("user");
    window.location.href = "/login";
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Don't attempt refresh on auth endpoints themselves (login/register/refresh)
        if (originalRequest.url?.includes("/api/auth/")) {
            forceLogout();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            }).then((newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            });
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
            // Use plain axios here, NOT the `api` instance, to avoid re-triggering these interceptors
            const res = await axios.post("http://localhost:8080/api/auth/refresh-token", {
                refreshToken: storedRefreshToken,
            });

            const newAccessToken = res.data?.data?.token;
            const newRefreshToken = res.data?.data?.refreshToken;

            if (!newAccessToken) throw new Error("Refresh response missing access token");

            localStorage.setItem("token", newAccessToken);
            if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

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