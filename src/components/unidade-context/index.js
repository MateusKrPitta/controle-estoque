// unidade-context.js
import React, { createContext, useContext, useState } from 'react';

const UnidadeContext = createContext();

export const UnidadeProvider = ({ children }) => {
    const [unidadeId, setUnidadeId] = useState(() => {
        // Recupera o valor do localStorage ou define como null
        return localStorage.getItem('unidadeId') ? JSON.parse(localStorage.getItem('unidadeId')) : null;
    });
    const [unidadeNome, setUnidadeNome] = useState(() => {
        return localStorage.getItem('unidadeNome') || '';
    });
    const [unidades, setUnidades] = useState([]);

    const atualizarUnidade = (id, nome) => {
        setUnidadeId(id);
        setUnidadeNome(nome);
        localStorage.setItem('unidadeId', JSON.stringify(id)); // Armazena como string
        localStorage.setItem('unidadeNome', nome);
    };

    const atualizarUnidades = (unidades) => {
        setUnidades(unidades);
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