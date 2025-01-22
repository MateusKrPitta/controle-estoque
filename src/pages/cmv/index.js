import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from '@mui/icons-material/Person';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CloseIcon from "@mui/icons-material/Close";
import BarChartIcon from '@mui/icons-material/BarChart';
import { Button, Drawer, List } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import { ProductionQuantityLimitsTwoTone } from '@mui/icons-material';
import AddchartIcon from '@mui/icons-material/Addchart';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import ButtonComponent from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import { AddCircleOutline, DateRange, Edit,  Save } from '@mui/icons-material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
const CMV = () => {
  return (
    <div className="flex w-full ">
      <Navbar />
      <div className='flex flex-col gap-3 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='sm:items-center md:text-2xl font-bold text-black w-[99%] flex items-center gap-2 '>
          <AddToQueueIcon /> CMV
        </h1>
        <div className="mt-2 sm:mt-2 md:mt-9 flex flex-col w-full">
          <div className='flex gap-2'>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Entrada e Saída"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AddchartIcon />
                  </InputAdornment>
                ),
              }}
              autoComplete="off"
              sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '40%' }, marginLeft: '10px' }}
            />
            <ButtonComponent
              startIcon={<SearchIcon fontSize='small' />}
              title={'Pesquisar'}
              subtitle={'Pesquisar'}
              buttonSize="large"
            />
            <ButtonComponent
              startIcon={<AddCircleOutline fontSize='small' />}
              title={'Cadastrar'}
              subtitle={'Cadastrar'}
              buttonSize="large"
              //onClick={handleCadastroProdutos}
            />
            <IconButton title="Filtro"
              //onClick={() => setFiltro(true)}
              className='view-button w-10 h-10 '
              sx={{
                color: 'black',
                border: '1px solid black',
                '&:hover': {
                  color: '#fff',
                  backgroundColor: '#BCDA72',
                  border: '1px solid black'
                }
              }} >
              <FilterAltIcon fontSize={"small"} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CMV