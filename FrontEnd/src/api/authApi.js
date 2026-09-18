// Make sure this points to your unified single config file instance configuration!
import api from "./axiosConfig"; 

export const registerUser = async (userData) => {
    // Resolved endpoint link context: http://localhost:8080/api/auth/register
    const response = await api.post("/auth/register", userData);
    return response.data;
};

export const loginUser = async (loginData) => {
    // Resolved endpoint link context: http://localhost:8080/api/auth/login
    const response = await api.post("/auth/login", loginData);
    return response.data;
};