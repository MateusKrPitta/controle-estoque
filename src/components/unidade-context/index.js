import React, { createContext, useContext, useState } from 'react';

// Cria o contexto
const UnidadeContext = createContext();

// Provedor do contexto
export const UnidadeProvider = ({ children }) => {
    const [unidadeId, setUnidadeId] = useState(null);
    const [unidadeNome, setUnidadeNome] = useState(''); // Adicionado unidadeNome e setUnidadeNome

    return (
        <UnidadeContext.Provider value={{ unidadeId, setUnidadeId, unidadeNome, setUnidadeNome }}>
            {children}
        </UnidadeContext.Provider>
    );
};

// Hook para usar o contexto
export const useUnidade = () => {
    return useContext(UnidadeContext);
};
