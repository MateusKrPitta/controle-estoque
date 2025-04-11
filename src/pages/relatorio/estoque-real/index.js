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
import { FormControlLabel, IconButton, Switch } from '@mui/material';
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
    const [limparCampos, setLimparCampos] = useState(false);
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

    const handleLimparCampos = () => {
        setDataInicio('');
        setDataFim('');
        setSelectedCategoria('');
        
        setProdutosFiltrados(produtos);
        
        handleCloseFiltro();
        
        CustomToast({ type: "success", message: "Filtros limpos com sucesso!" });
    };


    const fetchEntradasSaidas = async () => {
        try {
            const response = await api.get('/movimentacao');
            const movimentacoes = response.data.data;
    

    
            const formattedMovimentacoes = movimentacoes.map(mov => {
                const valorTotal = mov.precoPorcao * mov.quantidade;
    
                const dataUTC = new Date(mov.data);
                const dataLocal = new Date(dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000);
    
                return {
                    tipo: mov.tipo === "1" ? 'entrada' : mov.tipo === '2' ? 'saida' : 'desperdicio',
                    produtoNome: mov.produtoNome,
                    quantidade: mov.quantidade,
                    categoria: categorias.find(cat => cat.id === mov.categoria_id)?.nome || 'Desconhecida',
                    precoPorcao: mov.precoPorcao,
                    valorTotal: valorTotal,
                    observacao: mov.observacao,
                    dataCadastro: dataLocal.toLocaleDateString('pt-BR'),
                    dataOriginal: mov.data,
                    id: mov.id
                };
            });
    
            setEntradasSaidas(formattedMovimentacoes);
            setEntradasSaidasOriginais(formattedMovimentacoes);
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao carregar movimentações!" });
        }
    };

    const mostrarResumoMovimentacoes = () => {
        const resumo = {};
    
        entradasSaidas.forEach(mov => {
            const { produtoNome, quantidade, tipo } = mov;
    
            if (!resumo[produtoNome]) {
                resumo[produtoNome] = {
                    entradas: 0,
                    saidas: 0,
                    desperdicios: 0
                };
            }
    
            if (tipo === 'entrada') {
                resumo[produtoNome].entradas += quantidade;
            } else if (tipo === 'saida') {
                resumo[produtoNome].saidas += quantidade;
            } else if (tipo === 'desperdicio') {
                resumo[produtoNome].desperdicios += quantidade;
            }
        });

    };
    
    useEffect(() => {
        if (entradasSaidas.length > 0) {
            mostrarResumoMovimentacoes();
        }
    }, [entradasSaidas]);


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
    const calcularEstoqueAtual = () => {
        const estoque = {};
    
        produtos.forEach(produto => {
            estoque[produto.nome] = {
                totalEntradas: 0,
                totalSaidas: 0,
                totalDesperdicio: 0,
                estoqueAtual: 0
            };
        });
    
        entradasSaidas.forEach(mov => {
            const { produtoNome, quantidade, tipo } = mov;
    
            if (!estoque[produtoNome]) return;
    
            if (tipo === 'entrada') {
                estoque[produtoNome].totalEntradas += quantidade;
                estoque[produtoNome].estoqueAtual += quantidade;
            } else if (tipo === 'saida') {
                estoque[produtoNome].totalSaidas += quantidade;
                estoque[produtoNome].estoqueAtual -= quantidade;
            } else if (tipo === 'desperdicio') {
                estoque[produtoNome].totalDesperdicio += quantidade;
                estoque[produtoNome].estoqueAtual -= quantidade;
            }
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
        const estoqueData = calcularEstoqueAtual();
        const produtoEstoque = estoqueData[produto.nome] || {
            estoqueAtual: produto.quantidade || 0,
            totalEntradas: 0,
            totalSaidas: 0,
            totalDesperdicio: 0
        };
    
        const estoqueAtual = produtoEstoque.estoqueAtual;
        const isBelowMin = estoqueAtual < (produto.qtdMin || 0);
        const precoUnitario = produto.valorPorcao || 0;
        const valorTotal = estoqueAtual * precoUnitario;
    
        return {
            categoria: produto.categoriaNome || 'Sem Categoria',
            produto: produto.nome,
            unidade: unidades[produto.unidadeMedida] || 'Desconhecida',
            quantidadeMinima: produto.qtdMin || 0,
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
        try {
            const movimentacoesFiltradas = entradasSaidasOriginais.filter(mov => {
                const dataMov = moment(mov.dataOriginal);
                const dataInicioValida = dataInicio ? moment(dataInicio).startOf('day') : null;
                const dataFimValida = dataFim ? moment(dataFim).endOf('day') : null;
                
                const dataMatch = 
                    (!dataInicioValida && !dataFimValida) ||
                    (dataInicioValida && dataFimValida && dataMov.isBetween(dataInicioValida, dataFimValida, null, '[]')) || 
                    (dataInicioValida && !dataFimValida && dataMov.isSameOrAfter(dataInicioValida)) || 
                    (!dataInicioValida && dataFimValida && dataMov.isSameOrBefore(dataFimValida)) 
    
                const categoriaMatch = !selectedCategoria || 
                    produtos.some(prod => 
                        prod.nome === mov.produtoNome && 
                        prod.categoriaId == selectedCategoria
                    );
    
                return dataMatch && categoriaMatch;
            });
    
            setEntradasSaidas(movimentacoesFiltradas);
    
            const produtosComMovimentacao = produtos.filter(produto => {
                const categoriaMatch = !selectedCategoria || produto.categoriaId == selectedCategoria;
                
                const temMovimentacao = movimentacoesFiltradas.some(mov => mov.produtoNome === produto.nome);
                
                return categoriaMatch && (!dataInicio || !dataFim || temMovimentacao);
            });
    
            setProdutosFiltrados(produtosComMovimentacao);
            handleCloseFiltro();
    
            if (produtosComMovimentacao.length === 0) {
                CustomToast({ type: "info", message: "Nenhum produto encontrado com os critérios de pesquisa." });
            } else {
                CustomToast({ type: "success", message: "Filtro aplicado com sucesso!" });
            }
        } catch (error) {
            console.error("Erro ao filtrar:", error);
            CustomToast({ type: "error", message: "Erro ao aplicar filtro." });
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

    
    useEffect(() => {
        const loadData = async () => {
            try {
                const categoriasResponse = await api.get(`/categoria?unidadeId=${unidadeId}`);
                const categoriasFiltradas = categoriasResponse.data.data.filter(c => c.unidadeId === unidadeId);
                setCategorias(categoriasFiltradas);
                
                const produtosResponse = await api.get(`/produto?unidadeId=${unidadeId}`);
                const produtosCadastrados = produtosResponse.data.data.filter(p => p.unidadeId === unidadeId);
                setProdutos(produtosCadastrados);
                setProdutosFiltrados(produtosCadastrados);
                
                const movimentacoesResponse = await api.get('/movimentacao');
                const movimentacoes = movimentacoesResponse.data.data;
                
                const movimentacoesFiltradas = movimentacoes.filter(mov => {
                    return produtosCadastrados.some(prod => prod.nome === mov.produtoNome);
                });
                
                const formattedMovimentacoes = movimentacoesFiltradas.map(mov => {
                    const valorTotal = mov.precoPorcao * mov.quantidade;
                    return {
                        tipo: mov.tipo === "1" ? 'entrada' : mov.tipo === '2' ? 'saida' : 'desperdicio',
                        produtoNome: mov.produtoNome,
                        quantidade: mov.quantidade,
                        categoria: categoriasFiltradas.find(cat => cat.id === mov.categoria_id)?.nome || 'Desconhecida',
                        precoPorcao: mov.precoPorcao,
                        valorTotal: valorTotal,
                        observacao: mov.observacao,
                        dataCadastro: new Date(mov.data).toLocaleDateString('pt-BR'),
                        id: mov.id
                    };
                });
                
                setEntradasSaidas(formattedMovimentacoes);
                setEntradasSaidasOriginais(formattedMovimentacoes);
            } catch (error) {
                CustomToast({ type: "error", message: "Erro ao carregar dados!" });
            }
        };
        
        if (unidadeId) {
            loadData();
        }
    }, [unidadeId]);




    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-0 lg:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='justify-center  md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
                    <BarChartIcon /> Estoque Real
                </h1>
                <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                    <div className="hidden lg:w-[14%] lg:flex  ">
                        <HeaderRelatorio />
                    </div>
                    <div className={`w-[100%] lg:w-[80%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col  transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div className='w-[99%] justify-center flex-wrap  mb-4 flex items-center gap-4' >
                            <div className='w-[80%] md:w-[30%] lg:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                <label className='text-xs font-bold'>Itens em Estoque</label>
                                <div className='flex items-center justify-center gap-5'>
  <img src={Objeto} alt="Total Movimentações" />
  <label>{rows.reduce((total, row) => total + row.estoqueAtual, 0).toFixed(2)}</label>
</div>
                            </div>
                            <div className='w-[80%] md:w-[30%] lg:w-[30%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
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
                            sx={{ width: { xs: '42%', sm: '43%', md: '40%', lg: '43%' } }}
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
                        <FormControlLabel
                            control={
                                <Switch
                                    style={{ marginLeft: '5px' }}
                                    size="small"
                                    checked={limparCampos}
                                    onChange={handleLimparCampos}
                                    color="primary"
                                />
                            }
                            label="Limpar Filtro"
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