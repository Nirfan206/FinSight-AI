import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse corrupted user session data:", e);
                logout(); // Self-heal by clearing broken configurations
            }
        }
        setLoading(false);
    }, []);

    const login = (newToken, userData, newRefreshToken) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
        if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
        }
        setToken(newToken);
        setUser(userData);
        navigate("/dashboard");
    };

    const logout = () => {
        // Clear all potential auth namespace indicators from storage arrays
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        
        // Wipe local component memory context instantly
        setToken(null);
        setUser(null);
        
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary me-2" role="status"></div>
                <span>Loading Session Matrix...</span>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};