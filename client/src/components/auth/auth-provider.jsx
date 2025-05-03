import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [isAuth, setAuth] = useState(!!localStorage.getItem('token') || null)
    const [currentUser, setCurrentUser] = useState(null)

    const handleLogin = async (credentials) => {
        // login logic here
    }

    const handleLogout = (credentials) => {
        // logout logic here
    }

    return (
        <AuthContext.Provider value={{ isAuth, currentUser, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}