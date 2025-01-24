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
  const [totals, setTotals] = useState({ entradas: 0, estoqueInicial: 0, estoqueFinal: 0 });

  useEffect(() => {
    const entradasSaidasSalvas = JSON.parse(localStorage.getItem('entradasSaidas')) || [];
    const produtosEntrada = entradasSaidasSalvas.filter(registro => registro.tipo === 'entrada');
    setProdutos(produtosEntrada);
    calculateTotals(produtosEntrada);
  }, []);

  const calculateTotals = (rows) => {
    const newTotals = rows.reduce((acc, row) => {
      acc.entradas += Number(row.entradas || 0);
      acc.estoqueInicial += Number(row.estoqueInicial || 0);
      acc.estoqueFinal += Number(row.estoqueFinal || 0);
      return acc;
    }, { entradas: 0, estoqueInicial: 0, estoqueFinal: 0 });
    setTotals(newTotals);
  };

  const handleRowChange = (updatedRows) => {
    setProdutos(updatedRows);
    calculateTotals(updatedRows);
  };

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
              onRowChange={handleRowChange} // Passa a função para lidar com mudanças nas linhas
            />
            <div className='w-full flex items-center gap-5'>
              <label className='w-[23%] flex items-center justify-end mr-3 font-bold text-sm'>Total:</label>
              <span className='w-[15%] flex items-center text-sm font-bold justify-center p-2' style={{backgroundColor:'#2563eb', borderRadius:'10px', color:'white'}}> {totals.entradas}</span><br />
              <span className='w-[15%] flex items-center text-sm font-bold justify-center p-2' style={{backgroundColor:'#1a894f', borderRadius:'10px', color:'white'}}>{totals.estoqueInicial}</span><br />
              <span className='w-[15%] flex items-center text-sm font-bold justify-center p-2 -ml-2' style={{backgroundColor:'#69706c', borderRadius:'10px', color:'white'}}> {totals.estoqueFinal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CMV;