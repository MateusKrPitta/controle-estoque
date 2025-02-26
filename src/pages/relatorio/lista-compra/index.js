import React, { useEffect, useState, useRef } from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import TableComponent from '../../../components/table';
import { formatValor } from '../../../utils/functions'; // Função para formatar valores
import ButtonComponent from '../../../components/button';
import { Print, Save } from '@mui/icons-material';
import HeaderRelatorio from '../../../components/navbars/relatorios';
import CentralModal from '../../../components/modal-central/index';
import { AddCircleOutline } from '@mui/icons-material';
import SelectTextFields from '../../../components/select';
import ArticleIcon from '@mui/icons-material/Article';
import Logo from '../../../assets/png/logo_preta.png';
import api from '../../../services/api'; // Importa a API
import { useUnidade } from '../../../components/unidade-context';
import CustomToast from '../../../components/toast';

const ListaCompra = () => {
    const { unidadeId } = useUnidade();
    const [produtos, setProdutos] = useState([]);
    const [entradasSaidas, setEntradasSaidas] = useState([]);
    const [produtosSelecionados, setProdutosSelecionados] = useState([]);
    const tableRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [cadastroAdicionais, setCadastroAdicionais] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

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

    const produtosAbaixoMinimo = produtos.filter(produto => {
        const estoqueAtual = calcularEstoqueAtual(produto.nome);
        return estoqueAtual < produto.qtdMin; // Filtra produtos com estoque atual abaixo da quantidade mínima
    });
    
    const unidades = {
        1: 'Kilograma',
        2: 'Grama',
        3: 'Litro',
        4: 'Mililitro',
        5: 'Unidade',
    };

    const rows = produtosAbaixoMinimo.map(produto => {
        const estoqueAtual = calcularEstoqueAtual(produto.nome);
        return {
            produto: produto.nome,
            categoria: produto.categoriaNome,
             unidade: unidades[produto.unidadeMedida] || 'Desconhecida',
            quantidadeMinima: produto.qtdMin,
            quantidade: produto.quantidade,
            precoUnitario: formatValor(produto.valor),
            valorTotal: formatValor((produto.valor * estoqueAtual)),
            comprar: produto.qtdMin - estoqueAtual > 0 ? produto.qtdMin - estoqueAtual : 0,
        };
    });

    const headers = [
        { label: 'Produto', key: 'produto' },
        { label: 'Categoria', key: 'categoria' },
        { label: 'Unidade', key: 'unidade' },
        { label: 'Quantidade Mínima', key: 'quantidadeMinima' },
        { label: 'Estoque Atual', key: 'quantidade' },
        { label: 'Preço Unitário', key: 'precoUnitario' },
        { label: 'Comprar', key: 'comprar' },
    ];

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
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
                    <div>${tableRef.current.innerHTML}</div>
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

    const handleAddProduto = () => {
        if (produtoSelecionado) {
            const produto = produtos.find(p => p.nome === produtoSelecionado);
            if (produto) {
                setProdutosSelecionados([...produtosSelecionados, produto]);
            }
            setProdutoSelecionado(null);
            handleCloseCadastroProdutos();
        }
    };

    const fetchProdutos = async () => {
        try {
            const response = await api.get(`/produto?unidadeId=${unidadeId}`);
            const produtosCadastrados = response.data.data.filter(produto => produto.unidadeId === unidadeId);
            setProdutos(produtosCadastrados);
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao carregar produtos!" });
        }
    };

    useEffect(() => {
        if (unidadeId) {
            fetchProdutos();        }
    }, [unidadeId]);


    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start'>
                    <AssignmentIcon /> Lista de Compra
                </h1>

                <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                    <div className="hidden md:w-[14%] md:flex ">
                        <HeaderRelatorio />
                    </div>
                    <div className={`w-[100%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col md:w-[80%] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                            <div className='flex items-center gap-2'>
                                <ButtonComponent
                                    title="Imprimir"
                                    subtitle="Imprimir"
                                    startIcon={<Print />}
                                    onClick={handlePrint}
                                />
                                <ButtonComponent
                                    title="Adicionar"
                                    subtitle="Adicionar"
                                    startIcon={<AddCircleOutline />}
                                    onClick={handleCadastroProdutos}
                                />
                            </div>
                            <div className='w-[95%] flex flex-col' ref={tableRef}>
                                <TableComponent
                                    headers={headers}
                                    rows={rows}
                                    actionsLabel={"Ações"}
                                    actionCalls={{}}
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
                    width={'500px'}
                    icon={<AddCircleOutline fontSize="small" />}
                    open={cadastroAdicionais}
                    onClose={handleCloseCadastroProdutos}
                    title="Adicionar Produtos"
                >
                    <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                        <div className='mt-4 flex gap-3 flex-wrap'>
                            <SelectTextFields
                                width={'285px'}
                                icon={<ArticleIcon fontSize="small" />}
                                label={'Produto'}
                                backgroundColor={"#D9D9D9"}
                                name={"produto"}
                                fontWeight={500}
                                options={produtos.map(produto => ({ label: produto.nome, value: produto.nome }))}
                                onChange={(e) => setProdutoSelecionado(e.target.value)}
                                value={produtoSelecionado}
                            />
                        </div>
                        <div className='w-[95%] mt-2 flex items-end justify-end'>
                            <ButtonComponent
                                title={'Cadastrar'}
                                subtitle={'Cadastrar'}
                                startIcon={<Save />}
                                onClick={handleAddProduto}
                            />
                        </div>
                    </div>
                </CentralModal>
            </div>
        </div>
    );
}

export default ListaCompra;