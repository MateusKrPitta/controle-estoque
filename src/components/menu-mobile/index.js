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
        <div className='w-[100%] sm:hidden flex items-center p-3 justify-center z-30 md:hidden lg:hidden' style={{ backgroundColor: '#006b33' }}>
           
            <button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                style={{ backgroundColor: '#ffff', color: '#006b33', borderRadius: '5px', width: '10%' }}
            >
                <MenuIcon fontSize='small' />
            </button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => handleNavigate("/dashboard")} style={{ color: '#006b33', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <DashboardIcon fontSize='small' />Dashboard
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/contratos-pendentes")} style={{ color: '#006b33', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <PostAddIcon fontSize='small' />Contratos Pendentes
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/contratos-finalizados")} style={{ color: '#006b33', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <GradingIcon fontSize='small' />Contratos Finalizados
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/novo-contrato")} style={{ color: '#006b33', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <ArticleIcon fontSize='small' />Novo Contrato
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/cadastro")} style={{ color: '#006b33', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <MiscellaneousServicesIcon fontSize='small' />Cadastro
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/sair")} style={{ color: '#006b33', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <ExitToApp fontSize='small' />Sair
                </MenuItem>
            </Menu>
        </div>
    );
}

export default MenuMobile;