import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import ButtonComponent from '../../components/button';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Print, FilterAlt, DateRange } from '@mui/icons-material';
import TableComponent from '../../components/table/index.js';
import { headerCmv } from '../../entities/headers/header-cmv.js';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import NumbersIcon from '@mui/icons-material/Numbers';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CentralModal from '../../components/modal-central/index.js';
import SelectTextFields from '../../components/select/index.js';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import PercentIcon from '@mui/icons-material/Percent';
import { NumericFormat } from 'react-number-format';

const CMV = () => {
  const [produtos, setProdutos] = useState([]);
  const [totals, setTotals] = useState({ totalEntradas: 0, estoqueInicial: 0, estoqueFinal: 0, totalUtilizado: 0 });
  const [filtro, setFiltro] = useState(false);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [uniqueCategoriesCount, setUniqueCategoriesCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [faturamento, setFaturamento] = useState(''); // Mantenha como string para a máscara
  const [cmv, setCmv] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Delay para a transição

    return () => clearTimeout(timer);
  }, []);

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

      // Calcular utilizado com a fórmula correta
      const utilizado = estoqueInicial + entradas - estoqueFinal;

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

    // Calcular totalUtilizado
    newTotals.totalUtilizado = newTotals.estoqueInicial + newTotals.totalEntradas - newTotals.estoqueFinal;

    console.log("Total Entradas:", newTotals.totalEntradas);
    setTotals(newTotals);
  };
  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatValor = (valor) => {
    const parsedValor = parseFloat(valor); // Converte o valor para número
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parsedValor);
  };

  const handleFiltro = () => setFiltro(true);
  const handleCloseFiltro = () => setFiltro(false);

  const handleRowChange = (updatedRows) => {
    const updatedWithUtilizado = calculateUtilizado(updatedRows);
    setProdutos(updatedWithUtilizado);
    calculateTotals(updatedWithUtilizado);
  };

  useEffect(() => {
    const categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];
    const categoriasUnicas = Array.from(new Set(categoriasSalvas.map(cat => cat.nome)))
      .map(nome => categoriasSalvas.find(cat => cat.nome === nome));

    setCategorias(categoriasUnicas);
    setUniqueCategoriesCount(categoriasUnicas.length); // Atualiza o estado com o número de categorias únicas
  }, []);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const tableHTML = `
      <html>
        <head>
          <title>Imprimir CMV</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Relatório de CMV</h1>
          <table>
            <thead>
              <tr>
                ${headerCmv.map(header => `<th>${header.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${produtos.map(produto => `
                <tr>
                  ${headerCmv.map(header => `<td>${produto[header.key] !== undefined ? produto[header.key] : 0}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.print();
  };

  // Função para calcular o CMV
  // Função para calcular o CMV
  const calculateCmv = () => {
    const totalUtilizado = totals.totalUtilizado; // Use the total utilized from totals
    const faturamentoValue = Number(faturamento.replace('R$', '').replace('.', '').replace(',', '.')) || 1; // Evitar divisão por zero

    // Check if faturamentoValue is zero to avoid division by zero
    if (faturamentoValue === 0) {
      setCmv(0); // Set CMV to 0 if faturamento is 0
      return;
    }

    const cmvValue = (totalUtilizado / faturamentoValue) * 100; // Cálculo do CMV em porcentagem
    setCmv(cmvValue); // Store cmv as a number
  };

  // UseEffect to recalculate CMV when faturamento or totals change
  useEffect(() => {
    calculateCmv(); // Recalcula o CMV sempre que faturamento ou totals mudam
  }, [faturamento, totals]);

  useEffect(() => {
    if (faturamento) {
      calculateCmv(); // Recalcula o CMV somente quando o faturamento é alterado
    }
  }, [faturamento, totals]);

  return (
    <div className="flex w-full ">
      <Navbar />
      <div className='flex flex-col gap-3 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='justify-center  sm:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
          <AddToQueueIcon /> CMV
        </h1>
        <div className={`mt-2 sm:mt-2 md:mt-9 flex flex-col w-full  transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          <div className='flex gap-2 flex-col ml-4 w-[95%]'>
            <div className='flex items-center gap-3'>
              <ButtonComponent
                startIcon={<Print fontSize='small' />}
                title={'Imprimir'}
                subtitle={'Imprimir'}
                buttonSize="large"
                onClick={handlePrint}
              />
              <IconButton title="Filtro"
                onClick={() => setFiltro(true)}
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
              <div className='w-[90%] flex items-center gap-3 justify-end'>
                <div className='w-[70%] md:w-[20%] p-5' style={{ backgroundColor: '#BCDA72', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="large"
                    label="CMV"
                    name="CMV"
                    value={`${cmv.toFixed(2)}%`} // Exibe o CMV como fração
                    autoComplete="off"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon fontSize="large" />
                        </InputAdornment>
                      ),
                    }}
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
                        fontWeight: 700
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2563eb', // Cor do label quando em foco
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#006b33', // Cor do ícone
                      },
                    }}
                  />
                </div>
                <div className='w-[70%] md:w-[20%] p-5' style={{ backgroundColor: '#BCDA72', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                <NumericFormat
                    fullWidth
                    variant="outlined"
                    size="large"
                    label="Faturamento"
                    name="Faturamento"
                    value={faturamento} // Mantenha o valor como string
                    onValueChange={(values) => {
                      const { formattedValue, value } = values;
                      setFaturamento(value); // Atualiza o estado com o valor numérico
                    }}
                    autoComplete="off"
                    customInput={TextField} // Usando o TextField do MUI
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersIcon fontSize="large" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: { xs: '100%', sm: '50%', md: '40%', lg: '100%' },
                      fontSize: '20px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#1a894f',
                        },
                        '&:hover fieldset': {
                          borderColor: '#2563eb',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1a894f',
                        },
                        backgroundColor: '#f3f4f6',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#1a894f',
                        fontWeight: 700,
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#2563eb',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#006b33',
                      },
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
              <div className=' md:flex flex-wrap items-center w-[70%] '>
                <span
                  className=' w-[80%] md:w-[20%] flex items-center text-sm font-bold justify-center p-2 mr-12'
                  style={{ backgroundColor: '#1a894f', borderRadius: '10px', color: 'white' }}>
                  {formatCurrency(totals.estoqueInicial)}
                </span>

                <span
                  className='w-[80%] md:w-[20%] flex items-center text-sm font-bold justify-center  mr-12 p-2'
                  style={{ backgroundColor: '#2563eb', borderRadius: '10px', color: 'white' }}>
                  {formatCurrency(totals.totalEntradas)}
                </span>

                <span
                  className='w-[80%] md:w-[20%] flex items-center text-sm font-bold justify-center p-2 mr-5 '
                  style={{ backgroundColor: '#69706c', borderRadius: '10px', color: 'white' }}>
                  {formatCurrency(totals.estoqueFinal)}
                </span>
                <span
                  className='w-[80%] md:w-[15%] flex items-center text-sm font-bold justify-center p-2 '
                  style={{ backgroundColor: '#BCDA72', borderRadius: '10px', color: 'white' }}>
                  {formatCurrency(totals.totalUtilizado)} {/* Exibe o total utilizado formatado */}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CentralModal
        tamanhoTitulo={'81%'}
        maxHeight={'100vh'}
        top={'20%'}
        left={'28%'}
        width={'400px'}
        icon={<FilterAltIcon fontSize="small" />}
        open={filtro}
        onClose={handleCloseFiltro}
        title="Filtro"
      >
        <div >
          <div className='mt-4 flex gap-3 flex-wrap'>

            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Data Inicial"
              value={dataInicial}
              type='date'
              autoComplete="off"
              sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '49%' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Data Final"
              type='date'
              value={dataFinal}
              autoComplete="off"
              sx={{ width: { xs: '42%', sm: '50%', md: '40%', lg: '43%' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange />
                  </InputAdornment>
                ),
              }}
            />
            <SelectTextFields
              width={'175px'}
              icon={<CategoryIcon fontSize="small" />}
              label={'Categoria'}
              backgroundColor={"#D9D9D9"}
              name={"categoria"}
              fontWeight={500}
              options={categorias.map(categoria => ({ label: categoria.nome, value: categoria.id }))}
              onChange={(e) => setSelectedCategoria(e.target.value)} // Atualiza o estado
              value={selectedCategoria} // Reflete o estado atual no componente
            />
          </div>
          <div className='w-[95%] mt-2 flex items-end justify-end'>
            <ButtonComponent
              title={'Pesquisar'}
              subtitle={'Pesquisar'}
              startIcon={<SearchIcon />}
            />
          </div>
        </div>
      </CentralModal>
    </div>
  );
};

export default CMV;