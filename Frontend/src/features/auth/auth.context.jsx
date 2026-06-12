import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dynamic backend engine configuration tracking
    const API_BASE_URL = "https://interview-ai-yt-main-zmlp.onrender.com/api/auth";

    // App load hote hi user auth state validation automatic verify hogi
    useEffect(() => {
        const checkUserAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`${API_BASE_URL}/get-me`);
                if (res.data && res.data.user) {
                    setUser(res.data.user);
                }
            } catch (err) {
                console.error("Auth initialization check error:", err.message);
                localStorage.removeItem("token"); // Invalid token clear karenge
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUserAuth();
    }, []);

    // Production login controller wrapper context handler
    const loginUser = async (email, password) => {
        try {
            setLoading(true);
            const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
            
            if (res.data && res.data.token) {
                localStorage.setItem("token", res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (err) {
            console.error("Context Login handler crash tracking:", err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Production registration controller wrapper context handler
    const registerUser = async (username, email, password) => {
        try {
            setLoading(true);
            const res = await axios.post(`${API_BASE_URL}/register`, { username, email, password });
            
            if (res.data && res.data.token) {
                localStorage.setItem("token", res.data.token);
                setUser(res.data.user);
                return { success: true };
            }
        } catch (err) {
            console.error("Context Registration handler crash tracking:", err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Production logout handler wrapper
    const logoutUser = async () => {
        try {
            await axios.post(`${API_BASE_URL}/logout`);
        } catch (err) {
            console.error("Logout request tracking error:", err.message);
        } finally {
            localStorage.removeItem("token");
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, loginUser, registerUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};