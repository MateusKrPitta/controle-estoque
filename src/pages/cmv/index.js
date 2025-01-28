import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import ButtonComponent from '../../components/button';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Print, FilterAlt } from '@mui/icons-material';
import TableComponent from '../../components/table/index.js';
import { headerCmv } from '../../entities/headers/header-cmv.js';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import NumbersIcon from '@mui/icons-material/Numbers';
const CMV = () => {
  const [produtos, setProdutos] = useState([]);
  const [totals, setTotals] = useState({ totalEntradas: 0, estoqueInicial: 0, estoqueFinal: 0 });

  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    console.log("Produtos carregados do localStorage:", produtosSalvos);
    setProdutos(calculateUtilizado(produtosSalvos));
    calculateTotals(produtosSalvos);
  }, []);

  const calculateUtilizado = (rows) => {
    return rows.map((row) => {
      const estoqueInicial = Number(row.estoqueInicial || 0);
      const estoqueFinal = Number(row.estoqueFinal || 0);
      const entradas = Number(row.entradas || 0);
      const preco = Number(row.preco || 0);

      // Calcular utilizado
      const utilizado = estoqueInicial + estoqueFinal;

      // Calcular valor total
      const valorTotal = ((estoqueInicial + entradas + estoqueFinal) * preco).toFixed(2);

      return {
        ...row,
        utilizado, // Quantidade sem máscara
        valorUtilizado: formatCurrency(valorTotal), // Valor com máscara de moeda
      };
    });
  };


  const calculateTotals = (rows) => {
    const newTotals = rows.reduce((acc, row) => {
      const preco = Number(row.preco || 0);
      const entradas = Number(row.entradas || 0);

      acc.totalEntradas += entradas * preco;
      acc.estoqueInicial += (Number(row.estoqueInicial || 0) * preco);
      acc.estoqueFinal += (Number(row.estoqueFinal || 0) * preco);

      return acc;
    }, { totalEntradas: 0, estoqueInicial: 0, estoqueFinal: 0 });

    console.log("Total Entradas:", newTotals.totalEntradas);
    setTotals(newTotals);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };


  const handleRowChange = (updatedRows) => {
    const updatedWithUtilizado = calculateUtilizado(updatedRows);
    setProdutos(updatedWithUtilizado);
    calculateTotals(updatedWithUtilizado);
  };

  return (
    <div className="flex w-full ">
      <Navbar />
      <div className='flex flex-col gap-3 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='justify-center  sm:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
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
              <div className='w-[90%] flex items-center justify-end'>
                <div className='w-[70%] md:w-[15%] p-5' style={{ backgroundColor: '#BCDA72', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="large"
                    label="CMV"
                    name="CMV"
                    autoComplete="off"
                    sx={{
                      width: { xs: '100%', sm: '50%', md: '40%', lg: '100%' },
                      fontSize: '20px',
                      backgroundColor: '#ffffff', // Fundo branco para o campo
                      borderRadius: '8px', // Arredondar bordas
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#1a894f', // Cor da borda padrão
                        },
                        '&:hover fieldset': {
                          borderColor: '#2563eb', // Cor da borda ao passar o mouse
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1a894f', // Cor da borda quando em foco
                        },
                        backgroundColor: '#f3f4f6', // Fundo interno do campo
                      },
                      '& .MuiInputLabel-root': {
                        color: '#1a894f', // Cor do texto do label
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2563eb', // Cor do label quando em foco
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#006b33', // Cor do ícone
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersIcon fontSize="large" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
            <TableComponent
              headers={headerCmv}
              rows={produtos}
              onRowChange={handleRowChange}
            />
            <div className='w-full flex items-center gap-5'>
              <label className='w-[23%] flex items-center justify-end mr-3 font-bold text-sm'>Total:</label>
              <div className=' md:flex flex-wrap items-center w-[60%]'>
                <span
                  className=' w-[80%] md:w-[20%] flex items-center text-sm font-bold justify-center p-2 mr-28'
                  style={{ backgroundColor: '#1a894f', borderRadius: '10px', color: 'white' }}>
                  {formatCurrency(totals.estoqueInicial)}
                </span>

                <span
                  className='w-[80%] md:w-[20%] flex items-center text-sm font-bold justify-center  mr-28 p-2'
                  style={{ backgroundColor: '#2563eb', borderRadius: '10px', color: 'white' }}>
                  {formatCurrency(totals.totalEntradas)}
                </span>

                <span
                  className='w-[80%] md:w-[20%] flex items-center text-sm font-bold justify-center p-2 '
                  style={{ backgroundColor: '#69706c', borderRadius: '10px', color: 'white' }}>
                  {formatCurrency(totals.estoqueFinal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMV;
