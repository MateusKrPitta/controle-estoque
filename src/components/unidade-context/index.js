// src/context/UnidadeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const UnidadeContext = createContext();

export const UnidadeProvider = ({ children }) => {
  const [unidadeId, setUnidadeId] = useState(null);
  const [unidadeNome, setUnidadeNome] = useState('');
  useEffect(() => {
    const storedUnidadeId = localStorage.getItem('unidadeId');
    const storedUnidadeNome = localStorage.getItem('unidadeNome');
  
    if (storedUnidadeId) setUnidadeId(Number(storedUnidadeId));
    if (storedUnidadeNome) setUnidadeNome(storedUnidadeNome);
  }, []);
  
  return (
    <UnidadeContext.Provider value={{ unidadeId, setUnidadeId, unidadeNome, setUnidadeNome }}>
      {children}
    </UnidadeContext.Provider>
  );
};

export const useUnidade = () => {
  return useContext(UnidadeContext);
};
