// unidade-context.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UnidadeContext = createContext();

export const UnidadeProvider = ({ children }) => {
    const [unidadeId, setUnidadeId] = useState(() => {
        return localStorage.getItem('unidadeId') ? JSON.parse(localStorage.getItem('unidadeId')) : null;
    });
    const [unidadeNome, setUnidadeNome] = useState(() => {
        return localStorage.getItem('unidadeNome') || '';
    });
    const [unidades, setUnidades] = useState(() => {
        return localStorage.getItem('unidades') ? JSON.parse(localStorage.getItem('unidades')) : [];
    });

    const atualizarUnidade = (id, nome) => {
        setUnidadeId(id);
        setUnidadeNome(nome);
        localStorage.setItem('unidadeId', JSON.stringify(id));
        localStorage.setItem('unidadeNome', nome);
    };

    const atualizarUnidades = (unidades) => {
        setUnidades(unidades);
        localStorage.setItem('unidades', JSON.stringify(unidades)); // Armazena as unidades no localStorage
    };

    return (
        <UnidadeContext.Provider value={{ unidadeId, unidadeNome, unidades, setUnidadeId: atualizarUnidade, setUnidadeNome, atualizarUnidades }}>
            {children}
        </UnidadeContext.Provider>
    );
};

// Hook para usar o contexto
export const useUnidade = () => {
    return useContext(UnidadeContext);
};