import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from "@mui/icons-material/Menu";
import PostAddIcon from '@mui/icons-material/PostAdd';
import GradingIcon from '@mui/icons-material/Grading';
import ArticleIcon from '@mui/icons-material/Article';
import { ExitToApp } from '@mui/icons-material';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { ProductionQuantityLimitsTwoTone } from '@mui/icons-material';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import AddchartIcon from '@mui/icons-material/Addchart';

import Estoque from '../../assets/png/logo.png';
const MenuMobile = ({ user }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (route) => {
        navigate(route);
        handleClose(); // Fecha o menu após a navegação
    };

    return (
        <div className='w-[100%] sm:hidden flex items-center p-3 justify-center z-30 md:hidden lg:hidden' style={{ backgroundColor: 'black' }}>
            <div className='flex items-start w-[90%]'>
                <img style={{ width: '35%', marginRight: '150px' }} src={Estoque} alt="Total de Produtos" />
            </div>
            <div className='flex items-start w-[10%]'>
                <button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    style={{ backgroundColor: '#ffff', color: '#BCDA72', borderRadius: '5px', width: '100%' }}
                >
                    <MenuIcon fontSize='small' />
                </button>
            </div>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => handleNavigate("/dashboard")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <DashboardIcon style={{ color: '#BCDA72' }} fontSize='small' />Dashboard
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/cmv")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <AddToQueueIcon style={{ color: '#BCDA72' }} fontSize='small' />CMV
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/produtos")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <ProductionQuantityLimitsTwoTone style={{ color: '#BCDA72' }} fontSize='small' />Produtos
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/ficha-tecnica")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <ContentPasteSearchIcon style={{ color: '#BCDA72' }} fontSize='small' />Ficha Técnica
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/relatorios")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <DataThresholdingIcon style={{ color: '#BCDA72' }} fontSize='small' />Relatório
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/cadastro")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <AddchartIcon style={{ color: '#BCDA72' }} fontSize='small' />Entrada/Saída
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/cadastro")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <MiscellaneousServicesIcon style={{ color: '#BCDA72' }} fontSize='small' />Cadastro
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/sair")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <ExitToApp style={{ color: '#BCDA72' }} fontSize='small' />Sair
                </MenuItem>
            </Menu>
        </div>
    );
}

export default MenuMobile;