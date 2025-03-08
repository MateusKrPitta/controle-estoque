import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import ButtonComponent from '../../components/button';
import TableComponent from '../../components/table/index.js';
import { headerCmv } from '../../entities/headers/header-cmv.js';
import CentralModal from '../../components/modal-central/index.js';
import { useUnidade } from '../../components/unidade-context/index.js';
import api from '../../services/api.js';
import { formatValor } from '../../utils/functions.js';
import CustomToast from '../../components/toast/index.js';
import { headerCmv2 } from '../../entities/headers/header-cmv2.js';

import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import NumbersIcon from '@mui/icons-material/Numbers';
import { InputAdornment, TextField } from '@mui/material';
import { Edit, Save } from '@mui/icons-material';
import PercentIcon from '@mui/icons-material/Percent';
import TopicIcon from '@mui/icons-material/Topic';
import { NumericFormat } from 'react-number-format';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CMV = () => {
  const { unidadeId } = useUnidade();
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [totals, setTotals] = useState({ totalEntradas: 0, estoqueInicial: 0, estoqueFinal: 0, totalUtilizado: 0 });
  const [cadastro, setCadastro] = useState(false);
  const [editar, setEditar] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [lista, setLista] = useState([]);
  const [uniqueCategoriesCount, setUniqueCategoriesCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [faturamento, setFaturamento] = useState('');
  const [produtosOriginais, setProdutosOriginais] = useState([]);
  const [cmv, setCmv] = useState(0);

  const userOptionsUnidade = [
    { value: 1, label: 'Kilograma' },
    { value: 2, label: 'Grama' },
    { value: 3, label: 'Litro' },
    { value: 4, label: 'Mililitro' },
    { value: 5, label: 'Unidade' },
  ];

  const calculateUtilizado = (rows) => {
    return rows.map((row) => {
      const estoqueInicial = Number(row.estoqueInicial || 0);
      const estoqueFinal = Number(row.estoqueFinal || 0);
      const entradas = Number(row.entradas || 0);
      const preco = Number(row.preco || 0);

      const utilizado = estoqueInicial + entradas - estoqueFinal;

      if (utilizado < 0) {
        CustomToast({ type: "error", message: "O valor da coluna utilizado não pode ser negativo!" });

        return {
          ...row,
          utilizado: 0,
          valorUtilizado: formatCurrency(0),
        };
      }

      const valorTotal = ((estoqueInicial + entradas + estoqueFinal) * preco).toFixed(2);

      return {
        ...row,
        utilizado,
        valorUtilizado: formatCurrency(valorTotal),
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


    newTotals.totalUtilizado = newTotals.estoqueInicial + newTotals.totalEntradas - newTotals.estoqueFinal;

    setTotals(newTotals);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };


  const handleCadastro = () => {
    setCadastro(true);
    carregaProdutos(unidadeId);
  };

  const handleEditar = () => setEditar(true);
  const handleCloseEditar = () => setEditar(false);
  const handleCloseCadastro = () => setCadastro(false);

  const handleRowChange = (updatedRows) => {
    const updatedWithUtilizado = calculateUtilizado(updatedRows);
    setProdutos(updatedWithUtilizado);
    calculateTotals(updatedWithUtilizado);
  };

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


  const carregaProdutos = async (unidadeId) => {
    setLoading(true);
    try {
      const response = await api.get(`/produto?unidadeId=${unidadeId}`);
      if (Array.isArray(response.data.data)) {
        const produtosFiltrados = response.data.data.filter(produto => produto.unidadeId === unidadeId);
        const mappedProdutos = produtosFiltrados.map(produto => {
          const unidade = userOptionsUnidade.find(unit => unit.value === parseInt(produto.unidadeMedida));
          const valorFormatado = formatValor(produto.valorReajuste || produto.valor);

          return {
            id: produto.id,
            nome: produto.nome,
            rendimento: produto.rendimento,
            unidadeMedida: unidade ? unidade.label : 'N/A',
            categoria: produto.categoriaNome,
            valorPorcao: formatValor(produto.valorPorcao),
            valor: formatValor(produto.valorReajuste || produto.valor),
            preco: produto.valorReajuste || produto.valor,
            valorFormatado: valorFormatado,
            qtdMin: produto.qtdMin,
            categoriaId: produto.categoriaId,
            createdAt: new Date(produto.createdAt).toLocaleDateString('pt-BR'),
            categoriaNome: produto.categoriaNome
          };
        });
        setProdutos(mappedProdutos);
        setProdutosOriginais(mappedProdutos);
      } else {
        setProdutos([]);
        setProdutosOriginais([]);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!nome || !faturamento || produtos.length === 0) {
      CustomToast({ type: "error", message: "Por favor, preencha todos os campos obrigatórios!" });
      return;
    }

    const cmvData = {
      cmv: {
        unidadeId,
        nome,
        faturamento: Number(faturamento.replace('R$', '').replace('.', '').replace(',', '.')),
        valorCMV: cmv,
      },
      produtos: produtos.map(produto => ({
        estoqueInicial: produto.estoqueInicial,
        valorInicial: produto.valorInicial,
        entrada: produto.entradas,
        valorEntrada: produto.valorEntrada,
        estoqueFinal: produto.estoqueFinal,
        valorEstoqueFinal: produto.valorEstoqueFinal,
        utilizado: produto.utilizado,
        valorUtilizado: produto.valorUtilizado,
        produtoId: produto.id,
      })),
    };

    try {
      const response = await api.post('/cmv', cmvData);
      if (response.data.status) {
        CustomToast({ type: "success", message: response.data.message });
        handleCloseCadastro();
        fetchCMVData();
        clearFields();
      } else {
        CustomToast({ type: "error", message: "Erro ao cadastrar CMV." });
      }
    } catch (error) {
      console.error('Erro ao cadastrar CMV:', error);
      CustomToast({ type: "error", message: "Erro ao cadastrar CMV." });
    }
  };

  const clearFields = () => {
    setNome('');
    setFaturamento('');
    setProdutos([]);
    setTotals({ totalEntradas: 0, estoqueInicial: 0, estoqueFinal: 0, totalUtilizado: 0 });
    setCmv(0);
  };
  const handleDelete = (rowIndex) => {
    const updatedRows = produtos.filter((_, index) => index !== rowIndex);
    setProdutos(updatedRows);
    calculateTotals(updatedRows);
    CustomToast({ type: "success", message: "Produto excluído com sucesso!" });
  };

  const handleApagar = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/cmv/${id}`);
      if (response.data.status) {
        CustomToast({ type: "success", message: "CMV deletado com sucesso!" });
        fetchCMVData();
      } else {
        CustomToast({ type: "error", message: response.data.message });
      }
    } catch (error) {
      console.error('Erro ao deletar CMV:', error);
      CustomToast({ type: "error", message: "Erro ao deletar CMV." });
    } finally {
      setLoading(false);
    }
  };

  const fetchCMVData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/cmv?unidade_id=${unidadeId}`);
      if (response.data.status) {
        setLista(response.data.data);
      } else {
        CustomToast({ type: "error", message: response.data.message });
      }
    } catch (error) {
      console.error('Erro ao buscar CMV:', error);
      CustomToast({ type: "error", message: "Erro ao buscar CMV." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unidadeId && typeof unidadeId === 'number') {
      fetchCMVData();
    }
  }, [unidadeId]);

  const calculateCmv = () => {
    const totalUtilizado = totals.totalUtilizado;
    const faturamentoValue = Number(faturamento.replace('R$', '').replace('.', '').replace(',', '.')) || 1;
    if (faturamentoValue === 0) {
      setCmv(0);
      return;
    }
    const cmvValue = (totalUtilizado / faturamentoValue) * 100;
    setCmv(cmvValue);
  };

  useEffect(() => {
    const categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];
    const categoriasUnicas = Array.from(new Set(categoriasSalvas.map(cat => cat.nome)))
      .map(nome => categoriasSalvas.find(cat => cat.nome === nome));

    setCategorias(categoriasUnicas);
    setUniqueCategoriesCount(categoriasUnicas.length);
  }, []);

  useEffect(() => {
    calculateCmv();
  }, [faturamento, totals]);

  useEffect(() => {
    if (faturamento) {
      calculateCmv();
    }
  }, [faturamento, totals]);

  useEffect(() => {
    if (unidadeId) {
      carregaProdutos();
      fetchCMVData(unidadeId);
    }
  }, [unidadeId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-full ">
      <Navbar />
      <div className='flex flex-col gap-3 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='justify-center  md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2  lg:w-[98%]'>
          <AddToQueueIcon /> CMV
        </h1>
        <div className={`mt-2 sm:mt-2 md:mt-9 flex flex-col w-full  transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          <div className='flex gap-2 flex-col ml-4 w-[95%]'>
            <div className='flex items-center gap-3'>
              <ButtonComponent
                startIcon={<AddCircleOutlineIcon fontSize='small' />}
                title={'Cadastrar'}
                subtitle={'Cadastrar'}
                buttonSize="large"
                onClick={handleCadastro}
              />

            </div>
            <div className='mt-2 w-[95%]'>
              <TableComponent
                headers={headerCmv2}
                rows={lista}
                actionCalls={{
                  edit: handleEditar,
                  delete: (row) => handleApagar(row.id),
                  print: handlePrint,
                }}
              />
            </div>
          </div>
        </div>
      </div>


      <CentralModal
        tamanhoTitulo={'82%'}
        maxHeight={'100vh'}
        top={'5%'}
        left={'5%'}
        width={'1200px'}
        icon={<AddToQueueIcon fontSize="small" />}
        open={cadastro}
        onClose={handleCloseCadastro}
        title="Cadastro de CMV"
      >
        <>
          <div className='flex items-center gap-3'>

            <div className=' w-[100%] md:w-[100%] lg:w-[100%] mt-5 md:mt-0 flex justify-center md:justify-start items-end gap-3 flex-wrap '>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Nome do CMV"
                sx={{ width: { xs: '100%', sm: '40%', md: '10%', lg: '30%' }, }}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TopicIcon />
                    </InputAdornment>
                  ),
                }}
                autoComplete="off"
              />
              <div className=' w-[70%] md:w-[28%] lg:ml-[250px] flex justify-end'>
                <div className='w-[100%] sm:ml-0 md:w-[100%] lg:w-[60%] lg:first-letter: p-5 ' style={{ backgroundColor: '#BCDA72', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="large"
                    label="CMV"
                    name="CMV"
                    value={`${cmv.toFixed(2)}%`}
                    autoComplete="off"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon fontSize="large" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' },
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
                        fontWeight: 700
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
              <div className='w-[70%] md:w-[28%] lg:w-[18%] p-5' style={{ backgroundColor: '#BCDA72', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                <NumericFormat
                  fullWidth
                  variant="outlined"
                  size="large"
                  label="Faturamento"
                  name="Faturamento"
                  value={faturamento}
                  onValueChange={(values) => {
                    const { formattedValue, value } = values;
                    setFaturamento(value);
                  }}
                  autoComplete="off"
                  customInput={TextField}
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
                    width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' },
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
            actionCalls={{
              tirar: handleDelete,
            }}
          />
          <div className='w-full flex items-center mt-3'>
            <label className='w-[22%] flex items-center justify-end mr-3  font-bold text-sm'>Total:</label>
            <div className=' md:flex flex-wrap items-center w-[70%] '>
              <span
                className=' w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center p-2 mr-12'
                style={{ backgroundColor: '#1a894f', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.estoqueInicial)}
              </span>

              <span
                className='w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center  mr-12 p-2'
                style={{ backgroundColor: '#2563eb', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.totalEntradas)}
              </span>

              <span
                className='w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center p-2 md:mr-12 lg:mr-5 '
                style={{ backgroundColor: '#69706c', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.estoqueFinal)}
              </span>
              <span
                className='w-[80%] md:w-[45%] lg:w-[15%] flex items-center text-sm font-bold justify-center p-2 '
                style={{ backgroundColor: '#BCDA72', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.totalUtilizado)} {/* Exibe o total utilizado formatado */}
              </span>
            </div>
          </div>
          <div className='flex justify-center w-[100%] mt-10'>
            <ButtonComponent
              title={'Cadastrar'}
              subtitle={'Cadastrar'}
              startIcon={<Save />}
              onClick={handleSubmit}
            />
          </div>
        </>
      </CentralModal>

      <CentralModal
        tamanhoTitulo={'84%'}
        maxHeight={'100vh'}
        top={'5%'}
        left={'5%'}
        width={'1200px'}
        icon={<Edit fontSize="small" />}
        open={editar}
        onClose={handleCloseEditar}
        title="Editar CMV"
      >
        <>
          <div className='flex items-center gap-3'>

            <div className=' w-[100%] md:w-[100%] lg:w-[100%] mt-5 md:mt-0 flex justify-center md:justify-start items-end gap-3 flex-wrap '>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Nome do CMV"
                sx={{ width: { xs: '100%', sm: '40%', md: '10%', lg: '30%' }, }}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TopicIcon />
                    </InputAdornment>
                  ),
                }}
                autoComplete="off"
              />
              <div className=' w-[70%] md:w-[28%] lg:ml-[250px] flex justify-end'>
                <div className='w-[100%] sm:ml-0 md:w-[100%] lg:w-[60%] lg:first-letter: p-5 ' style={{ backgroundColor: '#BCDA72', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="large"
                    label="CMV"
                    name="CMV"
                    value={`${cmv.toFixed(2)}%`}
                    autoComplete="off"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon fontSize="large" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' },
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
                        fontWeight: 700
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
              <div className='w-[70%] md:w-[28%] lg:w-[18%] p-5' style={{ backgroundColor: '#BCDA72', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                <NumericFormat
                  fullWidth
                  variant="outlined"
                  size="large"
                  label="Faturamento"
                  name="Faturamento"
                  value={faturamento}
                  onValueChange={(values) => {
                    const { formattedValue, value } = values;
                    setFaturamento(value);
                  }}
                  autoComplete="off"
                  customInput={TextField}
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
                    width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' },
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
            actionCalls={{
              tirar: handleDelete,
            }}
          />
          <div className='w-full flex items-center mt-3'>
            <label className='w-[22%] flex items-center justify-end mr-3  font-bold text-sm'>Total:</label>
            <div className=' md:flex flex-wrap items-center w-[70%] '>
              <span
                className=' w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center p-2 mr-12'
                style={{ backgroundColor: '#1a894f', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.estoqueInicial)}
              </span>

              <span
                className='w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center  mr-12 p-2'
                style={{ backgroundColor: '#2563eb', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.totalEntradas)}
              </span>

              <span
                className='w-[80%] md:w-[45%] lg:w-[20%] flex items-center text-sm font-bold justify-center p-2 md:mr-12 lg:mr-5 '
                style={{ backgroundColor: '#69706c', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.estoqueFinal)}
              </span>
              <span
                className='w-[80%] md:w-[45%] lg:w-[15%] flex items-center text-sm font-bold justify-center p-2 '
                style={{ backgroundColor: '#BCDA72', borderRadius: '10px', color: 'white' }}>
                {formatCurrency(totals.totalUtilizado)} {/* Exibe o total utilizado formatado */}
              </span>
            </div>
          </div>
          <div className='flex justify-center w-[100%] mt-10'>
            <ButtonComponent
              title={'Cadastrar'}
              subtitle={'Cadastrar'}
              startIcon={<Save />}
              onClick={handleSubmit}
            />
          </div>
        </>
      </CentralModal>
    </div>
  );
};

export default CMV;