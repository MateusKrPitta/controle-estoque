
import React, { createContext, useContext, useState } from 'react';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [unidadeId, setUnidadeId] = useState(null); 

    const login = () => {
        setIsAuthenticated(true);

    };

    const logout = () => {
        setIsAuthenticated(false);
        setUnidadeId(null); 
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, unidadeId, setUnidadeId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};