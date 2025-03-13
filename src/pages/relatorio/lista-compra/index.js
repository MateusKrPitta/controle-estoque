import React, { useEffect, useState } from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import TableComponent from '../../../components/table';
import { formatValor } from '../../../utils/functions'; 
import ButtonComponent from '../../../components/button';
import { Category, Print,  Search } from '@mui/icons-material';
import HeaderRelatorio from '../../../components/navbars/relatorios';
import CentralModal from '../../../components/modal-central/index';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SelectTextFields from '../../../components/select';
import Logo from '../../../assets/png/logo_preta.png';
import api from '../../../services/api'; 
import { useUnidade } from '../../../components/unidade-context';
import CustomToast from '../../../components/toast';
import { InputAdornment, TextField } from '@mui/material';

const ListaCompra = () => {
    const { unidadeId } = useUnidade();
    const [produtos, setProdutos] = useState([]);
    const [entradasSaidas, setEntradasSaidas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [cadastroAdicionais, setCadastroAdicionais] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null); 
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [filtroNome, setFiltroNome] = useState('');


    const calcularEstoqueAtual = (produtoNome) => {
        const estoque = {
            totalEntradas: 0,
            totalSaidas: 0,
            quantidadeInicial: 0
        };

        const produto = produtos.find(p => p.nome === produtoNome);
        if (produto) {
            estoque.quantidadeInicial = produto.quantidade;
        }

        entradasSaidas.forEach(registro => {
            if (registro.produtoNome === produtoNome) {
                if (registro.tipo === 'entrada') {
                    estoque.totalEntradas += registro.quantidade;
                } else if (registro.tipo === 'saida' || registro.tipo === 'desperdicio') {
                    estoque.totalSaidas += registro.quantidade;
                }
            }
        });

        return estoque.quantidadeInicial + estoque.totalEntradas - estoque.totalSaidas;
    };

    const carregarCategorias = async () => {
        try {
            const response = await api.get(`/categoria?unidade=${unidadeId}`);
            if (Array.isArray(response.data.data)) {
                setCategorias(response.data.data);
            } else {
                setCategorias([]);
            }
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const unidades = {
        1: 'Kilograma',
        2: 'Grama',
        3: 'Litro',
        4: 'Mililitro',
        5: 'Unidade',
    };

    const rows = produtosFiltrados 
        .map(produto => {
            const estoqueAtual = calcularEstoqueAtual(produto.nome);
            const abaixoMinimo = estoqueAtual < produto.qtdMin;

            return {
                selecionado: abaixoMinimo,
                produto: produto.nome,
                categoria: produto.categoriaNome,
                unidade: unidades[produto.unidadeMedida] || 'Desconhecida',
                quantidadeMinima: produto.qtdMin,
                quantidade: estoqueAtual,
                precoUnitario: formatValor(produto.valor),
                valorTotal: formatValor((produto.valor * estoqueAtual)),
                comprar: Math.max(produto.qtdMin - estoqueAtual, 0),
                isAbaixoMinimo: abaixoMinimo
            };
        })
        .sort((a, b) => {
            if (a.isAbaixoMinimo && !b.isAbaixoMinimo) return -1;
            if (!a.isAbaixoMinimo && b.isAbaixoMinimo) return 1;
            return 0;
        });

    const headers = [
        { label: '', key: 'selecionado', type: 'checkbox' }, 
        { label: 'Produto', key: 'produto' },
        { label: 'Categoria', key: 'categoria' },
        { label: 'Unidade', key: 'unidade' },
        { label: 'Quantidade Mínima', key: 'quantidadeMinima' },
        { label: 'Estoque Atual', key: 'quantidade' },
        { label: 'Preço Unitário', key: 'precoUnitario' },
        { label: 'Comprar', key: 'comprar' },
    ];

    const handlePrint = () => {
        const selectedRows = rows.filter(row => row.selecionado); 
        if (selectedRows.length === 0) {
            CustomToast({ type: "warning", message: "Nenhum item selecionado para imprimir!" });
            return; 
        }

        const printWindow = window.open('', '_blank');
        const tableContent = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Categoria</th>
                        <th>Unidade</th>
                        <th>Quantidade Mínima</th>
                        <th>Estoque Atual</th>
                        <th>Preço Unitário</th>
                        <th>Comprar</th>
                    </tr>
                </thead>
                <tbody>
                    ${selectedRows.map(row => `
                        <tr>
                            <td>${row.produto}</td>
                            <td>${row.categoria}</td>
                            <td>${row.unidade}</td>
                            <td>${row.quantidadeMinima}</td>
                            <td>${row.quantidade}</td>
                            <td>${row.precoUnitario}</td>
                            <td>${row.comprar}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Imprimir Tabela</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            background-color: white;
                            color: black;
                            text-align: center;
                        }
                        th, td { 
                            border: 1px solid #000;
                            padding: 8px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #f2f2f2;
                        }
                        img { 
                            width: 100px; 
                            height: auto; 
                            display: block;
                            margin: 0 auto;
                            background-color: black; 
                        }
                    </style>
                </head>
                <body>
                    <img src="${Logo}" alt="Logo" />
                    <h1>Lista de Compra</h1>
                    ${tableContent}
                </body>
            </html>
        `);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    const handleCadastroProdutos = () => setCadastroAdicionais(true);
    const handleCloseCadastroProdutos = () => setCadastroAdicionais(false);

    const handlePesquisar = () => {
        if (categoriaSelecionada) {
            const filtrados = produtos.filter(produto =>
                produto.categoriaId === parseInt(categoriaSelecionada)
            );
            setProdutosFiltrados(filtrados);
        } else {
            setProdutosFiltrados(produtos); 
        }
        handleCloseCadastroProdutos(true);
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
        if (unidadeId) {
            fetchProdutos();
        }
    }, [unidadeId]);

    useEffect(() => {
        if (unidadeId) {
            carregarCategorias(unidadeId); 
        }
    }, [unidadeId]);

    useEffect(() => {
        setProdutosFiltrados(produtos); 
    }, [produtos]);

    useEffect(() => {
        const filtrados = produtos.filter(produto =>
            produto.nome.toLowerCase().includes(filtroNome.toLowerCase())
        );
        setProdutosFiltrados(filtrados);
    }, [filtroNome, produtos]);

    
    useEffect(() => {
        fetchProdutos();
        carregarCategorias();
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
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-0 lg:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='justify-center  md:justify-center lg:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
                    <AssignmentIcon /> Lista de Compra
                </h1>

                <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                    <div className="hidden lg:w-[14%] lg:flex  ">
                        <HeaderRelatorio />
                    </div>
                    <div className={`w-[100%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[80%] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                            <div className='flex items-center gap-2'>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Buscar produto"
                                    value={filtroNome}
                                    onChange={(e) => setFiltroNome(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                    }}
                                    autoComplete="off"
                                    sx={{ width: { xs: '95%', sm: '50%', md: '40%', lg: '80%' }, }}
                                />
                                <ButtonComponent
                                    title="Imprimir"
                                    subtitle="Imprimir"
                                    startIcon={<Print />}
                                    onClick={handlePrint}
                                />
                                <ButtonComponent
                                    title="Filtrar"
                                    subtitle="Filtrar"
                                    startIcon={<FilterAltIcon />}
                                    onClick={handleCadastroProdutos}
                                />
                            </div>
                            <div className=' sm:w-[100%] lg:w-[95%] flex flex-col' >
                                <TableComponent
                                    headers={headers}
                                    rows={rows}
                                    actionsLabel={'Ações'}
                                    actionCalls={{}}
                                    rowStyle={(row) => row.isAbaixoMinimo ? { backgroundColor: '#ffcccc' } : {}} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <CentralModal
                    tamanhoTitulo={'81%'}
                    maxHeight={'90vh'}
                    top={'20%'}
                    left={'28%'}
                    width={'350px'}
                    icon={<FilterAltIcon fontSize="small" />}
                    open={cadastroAdicionais}
                    onClose={handleCloseCadastroProdutos}
                    title="Filtro de Categorias"
                >
                    <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                        <div className='mt-4 flex gap-3 flex-wrap'>
                            <SelectTextFields
                                width={'285px'}
                                icon={<Category fontSize="small" />}
                                label={'Categorias'}
                                backgroundColor={"#D9D9D9"}
                                options={categorias.map(categoria => ({ label: categoria.nome, value: categoria.id }))}
                                onChange={(e) => setCategoriaSelecionada(e.target.value)} 
                                value={categoriaSelecionada}
                            />
                        </div>
                        <div className='w-[95%] mt-2 flex items-end justify-end'>
                            <ButtonComponent
                                title={'Pesquisar'}
                                subtitle={'Pesquisar'}
                                startIcon={<Search />}
                                onClick={handlePesquisar}
                            />
                        </div>
                    </div>
                </CentralModal>
            </div>
        </div>
    );
}

export default ListaCompra;