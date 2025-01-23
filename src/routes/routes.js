import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/login';
import Dashboard from '../pages/dashboard';
import Produtos from '../pages/produtos/index.js';
import Cadastro from '../pages/cadastro/index.js';
import Categoria from '../pages/cadastro/categoria/index.js';
import EntradaSaida from '../pages/entrada-saida/index.js';
import CMV from '../pages/cmv/index.js';
import Relatorio from '../pages/relatorio/index.js';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/login" element={<LoginPage /> }/>
            <Route path="/entrada-saida" element={<EntradaSaida /> }/>
            <Route path="/cmv" element={<CMV /> }/>
            <Route path="/relatorios" element={<Relatorio /> }/>

            <Route path="/cadastro" element={<Cadastro /> }/>
           <Route path="/cadastro/categoria" element={<Categoria /> }/>
        </Routes>
    );
};

export default AppRoutes;
