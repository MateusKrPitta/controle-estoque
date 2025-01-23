import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import ButtonComponent from '../../components/button';
import { IconButton } from '@mui/material';
import { Print, FilterAlt } from '@mui/icons-material';
import TableComponent from '../../components/table/index.js';
import { headerCmv } from '../../entities/headers/header-cmv.js';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
const CMV = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const entradasSaidasSalvas = JSON.parse(localStorage.getItem('entradasSaidas')) || [];
    // Filtra apenas os registros de entrada
    const produtosEntrada = entradasSaidasSalvas.filter(registro => registro.tipo === 'entrada');
    setProdutos(produtosEntrada);
  }, []);

  

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
          <div className='flex gap-2 flex-col ml-4 w-[95%]'>
            <div className='flex items-center gap-3'>
              <ButtonComponent
                startIcon={<Print fontSize='small' />}
                title={'Imprimir'}
                subtitle={'Imprimir'}
                buttonSize="large"
              />
              <IconButton title="Filtro"
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
                <FilterAlt fontSize={"small"} />
              </IconButton>
            </div>
            <TableComponent
              headers={headerCmv}
              rows={produtos}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CMV;