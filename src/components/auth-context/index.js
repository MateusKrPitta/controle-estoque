// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Cria o contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [unidadeId, setUnidadeId] = useState(null); // Inicializa o estado

    const login = () => {
        setIsAuthenticated(true);
        // Aqui você pode definir a lógica para definir o unidadeId, se necessário
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUnidadeId(null); // Limpa o unidadeId ao sair
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, unidadeId, setUnidadeId }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar o contexto
export const useAuth = () => {
    return useContext(AuthContext);
};