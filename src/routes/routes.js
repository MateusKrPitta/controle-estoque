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
import FichaTecnica from '../pages/ficha-tecnica/index.js';
import EstoqueReal from '../pages/relatorio/estoque-real/index.js'
import Usuario from '../pages/cadastro/usuario/index.js';
import Unidades from '../pages/cadastro/unidades/index.js';
import ListaCompra from '../pages/relatorio/lista-compra/index.js';

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
            <Route path="/relatorios/estoque-real" element={<EstoqueReal /> }/>
            <Route path="/relatorios/lista-compra" element={<ListaCompra /> }/>
            <Route path="/ficha-tecnica" element={<FichaTecnica /> }/>
            <Route path="/cadastro" element={<Cadastro /> }/>
           <Route path="/cadastro/categoria" element={<Categoria /> }/>
           <Route path="/cadastro/usuarios" element={<Usuario /> }/>
           <Route path="/cadastro/unidades" element={<Unidades /> }/>
        </Routes>
    );
};

export default AppRoutes;
