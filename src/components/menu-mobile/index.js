import React, { useEffect, useState } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from "@mui/icons-material/Menu";
import { ExitToApp } from '@mui/icons-material';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import AddchartIcon from '@mui/icons-material/Addchart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Estoque from '../../assets/png/logo.png';
import SelectTextFields from '../select';
import api from '../../services/api';

const MenuMobile = () => {
    const [userOptionsUnidade, setUserOptionsUnidade] = useState([]);
    const [selectedUnidade, setSelectedUnidade] = useState('');
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
        handleClose();
    };

    const handleUnidadeChange = (event) => {
        const selectedValue = event.target.value;
        const unidadeObj = userOptionsUnidade.find(option => option.value === selectedValue);
        if (unidadeObj) {
          setSelectedUnidade(unidadeObj.value);
        }
      };

      
    const carregarUnidades = async () => {
        try {
            const response = await api.get("/unidade");
            const unidadesOptions = response.data.data.map(unidade => ({
                value: unidade.id,
                label: unidade.nome
            }));
            setUserOptionsUnidade(unidadesOptions);
        } catch (error) {
            console.error("Erro ao carregar as unidades:", error);
        }
    };

    useEffect(() => {
        carregarUnidades();
    }, []);

    return (
        <div className='w-[100%]  flex items-center justify-center p-3 gap-10  z-30  lg:hidden' style={{ backgroundColor: 'black' }}>
            <div className='flex items-start w-[30%]'>
                <img style={{ width: '100%', marginRight: '150px', padding:'10px' }} src={Estoque} alt="Total de Produtos" />
            </div>
            <div className='flex items-start w-[30%]'>
                <SelectTextFields
                    width={'150px'}
                    icon={<LocationOnIcon fontSize="small" />}
                    label={'Unidades'}
                    backgroundColor={"#D9D9D9"}
                    name={"Unidades"}
                    fontWeight={500}
                    options={userOptionsUnidade}
                    value={selectedUnidade}
                    onChange={handleUnidadeChange}
                />
            </div>
            <div className='flex items-start w-[15%] sm:w-[10%] md:w-[10%] ml-7'>
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

                <MenuItem onClick={() => handleNavigate("/ficha-tecnica")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <ContentPasteSearchIcon style={{ color: '#BCDA72' }} fontSize='small' />Ficha Técnica
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/relatorios")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
                    <DataThresholdingIcon style={{ color: '#BCDA72' }} fontSize='small' />Relatório
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/entrada-saida")} style={{ color: 'black', gap: '8px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '12px' }}>
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