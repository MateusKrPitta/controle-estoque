import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableComponent from '../../../components/table';
import { formatValor } from '../../../utils/functions';
import HeaderRelatorio from '../../../components/navbars/relatorios';
import ButtonComponent from '../../../components/button';
import { DateRange, FilterAlt, Print } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Objeto from '../../../assets/icones/objetos.png';
import Baixo from '../../../assets/icones/abaixo.png';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CentralModal from '../../../components/modal-central';
import SelectTextFields from '../../../components/select';
import CategoryIcon from '@mui/icons-material/Category';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Logo from '../../../assets/png/logo_preta.png';
import api from '../../../services/api';
import CustomToast from '../../../components/toast';
import moment from 'moment';
import { useUnidade } from '../../../components/unidade-context';

const EstoqueReal = () => {
    const { unidadeId } = useUnidade();
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [entradasSaidas, setEntradasSaidas] = useState([]);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [filtro, setFiltro] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [entradasSaidasOriginais, setEntradasSaidasOriginais] = useState([]);
    const [logoLoaded, setLogoLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const fetchEntradasSaidas = async () => {
        try {
            const response = await api.get('/movimentacao');
            const movimentacoes = response.data.data;
    
            const movimentacoesFiltradas = movimentacoes.filter(mov => {
                const produto = produtos.find(prod => prod.nome === mov.produtoNome);
                return produto && produto.unidadeId === unidadeId;
            });
    
            const formattedMovimentacoes = await Promise.all(movimentacoesFiltradas.map(async (mov) => {
                const valorTotal = mov.precoPorcao * mov.quantidade;
    
                return {
                    tipo: mov.tipo === "1" ? 'entrada' : mov.tipo === '2' ? 'saida' : 'desperdicio',
                    produtoNome: mov.produtoNome,
                    quantidade: mov.quantidade,
                    categoria: categorias.find(cat => cat.id === mov.categoria_id)?.nome || 'Desconhecida',
                    precoPorcao: mov.precoPorcao,
                    valorTotal: valorTotal,
                    observacao: mov.observacao,
                    dataCadastro: new Date(mov.data).toLocaleDateString('pt-BR'),
                    id: mov.id
                };
            }));
    
            setEntradasSaidas(formattedMovimentacoes);
            setEntradasSaidasOriginais(formattedMovimentacoes);
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao carregar movimentações!" });
        }
    };

    const fetchProdutos = async () => {
        try {
            const response = await api.get(`/produto?unidadeId=${unidadeId}`);
            const produtosCadastrados = response.data.data.filter(produto => produto.unidadeId === unidadeId);
            setProdutos(produtosCadastrados);
            setProdutosFiltrados(produtosCadastrados);
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao carregar produtos!" });
        }
    };

    useEffect(() => {
        fetchProdutos();
        fetchEntradasSaidas();
    }, []);

    const calcularEstoqueAtual = () => {
        const estoque = {};

        produtos.forEach(produto => {
            estoque[produto.nome] = {
                totalEntradas: 0,
                totalSaidas: 0,
                quantidadeInicial: produto.quantidade
            };
        });

        entradasSaidas.forEach(registro => {
            const { produtoNome, quantidade, tipo } = registro;

            if (estoque[produtoNome]) {
                if (tipo === 'entrada') {
                    estoque[produtoNome].totalEntradas += quantidade;
                } else if (tipo === 'saida' || tipo === 'desperdicio') {
                    estoque[produtoNome].totalSaidas += quantidade;
                }
            }
        });

        Object.keys(estoque).forEach(produtoNome => {
            const { totalEntradas, totalSaidas, quantidadeInicial } = estoque[produtoNome];
            estoque[produtoNome].estoqueAtual = quantidadeInicial + totalEntradas - totalSaidas;
        });

        return estoque;
    };

    const fetchCategorias = async () => {
        try {
            const response = await api.get(`/categoria?unidadeId=${unidadeId}`);
            const categoriasFiltradas = response.data.data.filter(categoria => categoria.unidadeId === unidadeId);
            setCategorias(categoriasFiltradas);
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao carregar categorias!" });
        }
    };

    const unidades = {
        1: 'Kilograma',
        2: 'Grama',
        3: 'Litro',
        4: 'Mililitro',
        5: 'Unidade',
    };

    const rows = produtosFiltrados.map(produto => {
        const estoqueAtualData = calcularEstoqueAtual();
        const estoqueAtual = estoqueAtualData[produto.nome]?.estoqueAtual || 0;
        const isBelowMin = estoqueAtual < produto.qtdMin;

        const precoUnitario = produto.valorPorcao;
        const valorTotal = estoqueAtual * precoUnitario;

        return {
            categoria: produto.categoriaNome || 'Sem Categoria',
            produto: produto.nome,
            unidade: unidades[produto.unidadeMedida] || 'Desconhecida',
            quantidadeMinima: produto.qtdMin,
            estoqueAtual,
            precoUnitario: formatValor(precoUnitario),
            valorTotal: formatValor(valorTotal),
            isBelowMin,
        };
    });

    const headers = [
        { label: 'Produto', key: 'produto' },
        { label: 'Categoria', key: 'categoria' },
        { label: 'Unidade', key: 'unidade' },
        { label: 'Quantidade Mínima', key: 'quantidadeMinima' },
        { label: 'Estoque Atual', key: 'estoqueAtual' },
        { label: 'Preço Unitário', key: 'precoUnitario' },
        { label: 'Valor Total', key: 'valorTotal' },
    ];


    const handlePesquisar = () => {
        const produtosFiltrados = produtos.filter(produto => {
            const categoriaMatch = selectedCategoria ? produto.categoriaId === selectedCategoria : true;
            const dataCriacaoProduto = moment(produto.createdAt);
            const dataInicioFiltro = moment(dataInicio).startOf('day'); 
            const dataFimFiltro = moment(dataFim).endOf('day');   
            const dataMatch = (dataInicio && dataFim) ?
                dataCriacaoProduto.isBetween(dataInicioFiltro, dataFimFiltro, null, '[]') : true;

    
            return categoriaMatch && dataMatch;
        });
    
        setProdutosFiltrados(produtosFiltrados);
        handleCloseFiltro();
    
        if (produtosFiltrados.length === 0) {
            CustomToast({ type: "error", message: "Nenhum produto encontrado com os critérios de pesquisa." });
        } else {
            CustomToast({ type: "success", message: "Resultados filtrados com sucesso!" });
        }
    };

    useEffect(() => {
        if (unidadeId) {
            fetchProdutos();
            fetchEntradasSaidas();
            fetchCategorias();
        }
    }, [unidadeId]);

    const handlePrint = () => {
        if (!logoLoaded) {
            CustomToast({ type: "info", message: "Aguarde o carregamento da logo antes de imprimir." });
            return;
        }

        const printWindow = window.open('', '_blank');
        const tableHTML = `
            <html>
                <head>
                    <title>Imprimir Estoque</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            background-color: white;
                            color: black;
                            text-align: center;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px;
                        }
                        th, td { 
                            border: 1px solid #000;
                            padding: 8px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <img src="${Logo}" alt="Logo" />
                    <h1>Relatório de Estoque</h1>
                    <table>
                        <thead>
                            <tr>
                                ${headers.map(header => `<th>${header.label}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.map(row => `
                                <tr style="background-color: ${row.isBelowMin ? 'rgba(255, 0, 0, 0.2)' : 'white'};">
                                    ${headers.map(header => `<td>${row[header.key]}</td>`).join('')}
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

    const handleCloseFiltro = () => setFiltro(false);

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start'>
                    <BarChartIcon /> Estoque Real
                </h1>
                <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                    <div className="hidden md:w-[14%] md:flex ">
                        <HeaderRelatorio />
                    </div>
                    <div className={`w-[90%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col md:w-[80%] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div className='w-[99%] justify-center flex-wrap  mb-4 flex items-center gap-4' >
                            <div className='w-[80%] md:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                <label className='text-xs font-bold'>Itens em Estoque</label>
                                <div className='flex items-center justify-center gap-5'>
                                    <img src={Objeto} alt="Total Movimentações" />
                                    <label>{rows.reduce((total, row) => total + row.estoqueAtual, 0)}</label>
                                </div>
                            </div>
                            <div className='w-[80%] md:w-[30%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                <label className='text-xs font-bold'>Quantidade Itens Mínimo</label>
                                <div className='flex items-center justify-center gap-5'>
                                    <img src={Baixo} alt="Entradas" />
                                    <label>{rows.filter(row => row.isBelowMin).length}</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                            <ButtonComponent
                                title="Imprimir"
                                subtitle="Imprimir"
                                startIcon={<Print />}
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
                        </div>
                        <div className='w-[100%] flex flex-col ml-3 md:ml-0'>
                            <TableComponent
                                headers={headers}
                                rows={rows}
                                actionsLabel={"Ações"}
                                actionCalls={{}}
                                rowStyle={(row) => row.isBelowMin ? { backgroundColor: 'rgba(255, 0, 0, 0.2)' } : {}}
                            />
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
                <div>
                    <div className='mt-4 flex gap-3 flex-wrap'>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Data Inicial"
                            value={dataInicio}
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
                            onChange={(e) => setDataInicio(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Data Final"
                            type='date'
                            value={dataFim}
                            autoComplete="off"
                            sx={{ width: { xs: '42%', sm: '50%', md: '40%', lg: '43%' } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DateRange />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => setDataFim(e.target.value)}
                        />
                        <SelectTextFields
                            width={'175px'}
                            icon={<CategoryIcon fontSize="small" />}
                            label={'Categoria'}
                            backgroundColor={"#D9D9D9"}
                            name={"categoria"}
                            fontWeight={500}
                            options={categorias.map(categoria => ({ label: categoria.nome, value: categoria.id }))}
                            onChange={(e) => setSelectedCategoria(e.target.value)}
                            value={selectedCategoria}
                        />
                    </div>
                    <div className='w-[95%] mt-2 flex items-end justify-end'>
                        <ButtonComponent
                            title={'Pesquisar'}
                            subtitle={'Pesquisar'}
                            startIcon={<SearchIcon />}
                            onClick={handlePesquisar}
                        />
                    </div>
                </div>
            </CentralModal>
            <img src={Logo} alt="Logo" onLoad={() => setLogoLoaded(true)} style={{ display: 'none' }} />
        </div>
    );
}

export default EstoqueReal;