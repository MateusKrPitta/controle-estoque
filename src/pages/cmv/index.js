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
  const [totals, setTotals] = useState({ totalEntradas: 0, estoqueInicial: 0, estoqueFinal: 0 });

  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    console.log("Produtos carregados do localStorage:", produtosSalvos);
    setProdutos(calculateUtilizado(produtosSalvos));
    calculateTotals(produtosSalvos);
  }, []);

  // Recalcula a coluna "Valor Utilizado" para todas as linhas
  const calculateUtilizado = (rows) => {
    return rows.map((row) => {
      const estoqueInicial = Number(row.estoqueInicial || 0);
      const entradas = Number(row.quantidadeMinima || 0); // "Entradas"
      const estoqueFinal = Number(row.estoqueFinal || 0);
      const faturamento = Number(row.faturamento || 1); // Faturamento com valor padrão de 1 para evitar divisão por zero

      const valorUtilizado = ((estoqueInicial + entradas - estoqueFinal) / faturamento).toFixed(2); // Fórmula ajustada
      return {
        ...row,
        valorUtilizado, // Atualiza a coluna "Valor Utilizado"
      };
    });
  };

  const handleRowChange = (updatedRows) => {
    const updatedWithUtilizado = calculateUtilizado(updatedRows); // Atualiza o valor de "Valor Utilizado"
    setProdutos(updatedWithUtilizado);
    calculateTotals(updatedWithUtilizado); // Recalcula os totais com os novos valores
  };

  // A função calculateTotals já está correta, pois ela soma os valores de cada linha
  const calculateTotals = (rows) => {
    const newTotals = rows.reduce((acc, row) => {
      const preco = Number(row.preco || 1); // Define um preço padrão como 1 caso o campo não exista

      // Somente soma se a quantidade mínima for maior que zero
      const entradas = Number(row.quantidadeMinima || 0);
      if (entradas > 0) {
        acc.totalEntradas += entradas * preco; // Entradas multiplicadas pelo preço
      }

      acc.estoqueInicial += (Number(row.estoqueInicial || 0) * preco); // Estoque inicial multiplicado pelo preço
      acc.estoqueFinal += (Number(row.estoqueFinal || 0) * preco); // Estoque final multiplicado pelo preço

      return acc;
    }, { totalEntradas: 0, estoqueInicial: 0, estoqueFinal: 0 });

    setTotals(newTotals);
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
              <div className='flex items-center w-[60%]'>
                <span
                  className='w-[20%] flex items-center text-sm font-bold justify-center p-2 mr-28'
                  style={{ backgroundColor: '#1a894f', borderRadius: '10px', color: 'white' }}>
                  R$ {totals.estoqueInicial.toFixed(2)}
                </span>

                <span
                  className='w-[20%] flex items-center text-sm font-bold justify-center  mr-28 p-2'
                  style={{ backgroundColor: '#2563eb', borderRadius: '10px', color: 'white' }}>
                  R$ {totals.totalEntradas > 0 ? totals.totalEntradas.toFixed(2) : '0.00'}
                </span>

                <span
                  className='w-[20%] flex items-center text-sm font-bold justify-center p-2 -ml-2'
                  style={{ backgroundColor: '#69706c', borderRadius: '10px', color: 'white' }}>
                  R$ {totals.estoqueFinal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CMV;