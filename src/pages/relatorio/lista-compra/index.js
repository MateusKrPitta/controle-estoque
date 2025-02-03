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

const ListaCompra = () => {
    const [produtos, setProdutos] = useState([]);
    const [entradasSaidas, setEntradasSaidas] = useState([]);
    const [produtosSelecionados, setProdutosSelecionados] = useState([]); // Estado para armazenar produtos selecionados
    const tableRef = useRef(null); // Ref para a tabela
    const [isVisible, setIsVisible] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [cadastroAdicionais, setCadastroAdicionais] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300); // Delay para a transição

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
        setProdutos(produtosSalvos);

        const entradasSaidasSalvas = JSON.parse(localStorage.getItem('entradasSaidas')) || [];
        setEntradasSaidas(entradasSaidasSalvas);
    }, []);

    const calcularEstoqueAtual = (produtoNome) => {
        const entradas = entradasSaidas.filter(registro => registro.produto === produtoNome && registro.tipo === 'entrada');
        const saídas = entradasSaidas.filter(registro => registro.produto === produtoNome && registro.tipo === 'saida');

        const totalEntradas = entradas.reduce((total, registro) => total + parseInt(registro.quantidade, 10), 0);
        const totalSaidas = saídas.reduce((total, registro) => total + parseInt(registro.quantidade, 10), 0);

        return totalEntradas - totalSaidas;
    };

    const calcularQuantidadeParaComprar = (produto) => {
        const estoqueAtual = calcularEstoqueAtual(produto.nome);
        return produto.quantidadeMinima - estoqueAtual > 0 ? produto.quantidadeMinima - estoqueAtual : 0;
    };

    const produtosAbaixoMinimo = produtos.filter(produto => {
        const estoqueAtual = calcularEstoqueAtual(produto.nome);
        return estoqueAtual < produto.quantidadeMinima;
    });

    const rows = produtosAbaixoMinimo.map(produto => {
        const estoqueAtual = calcularEstoqueAtual(produto.nome);
        const quantidadeParaComprar = calcularQuantidadeParaComprar(produto); // Calcula a quantidade para comprar
        return {
            produto: produto.nome,
            categoria: produto.categoria,
            unidade: produto.unidade,
            quantidadeMinima: produto.quantidadeMinima,
            estoqueAtual,
            precoUnitario: formatValor(produto.preco),
            valorTotal: formatValor((produto.preco * estoqueAtual)),
            comprar: quantidadeParaComprar, // Incluindo a quantidade para comprar
        };
    });
    
    // Adiciona os produtos selecionados à tabela
    const rowsCompletas = [...rows, ...produtosSelecionados.map(produto => ({
        produto: produto.nome,
        categoria: produto.categoria,
        unidade: produto.unidade,
        quantidadeMinima: produto.quantidadeMinima,
        estoqueAtual: calcularEstoqueAtual(produto.nome),
        precoUnitario: formatValor(produto.preco),
        valorTotal: formatValor(produto.preco * calcularEstoqueAtual(produto.nome)),
        comprar: calcularQuantidadeParaComprar(produto), // Incluindo a quantidade para comprar
    }))];

    const headers = [
        { label: 'Produto', key: 'produto' },
        { label: 'Categoria', key: 'categoria' },
        { label: 'Unidade', key: 'unidade' },
        { label: 'Quantidade Mínima', key: 'quantidadeMinima' },
        { label: 'Estoque Atual', key: 'estoqueAtual' },
        { label: 'Preço Unitário', key: 'precoUnitario' },
        { label: 'Comprar', key: 'comprar' }, // Novo cabeçalho para a coluna "Comprar"
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
                            background-color: black; /* Fundo preto na impressão */
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
            setProdutoSelecionado(null); // Limpa a seleção após adicionar
            handleCloseCadastroProdutos(); // Fecha o modal
        }
    };

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
                                    onClick={handlePrint} // Chama a função de impressão
                                />
                                <ButtonComponent
                                    title="Adicionar"
                                    subtitle="Adicionar"
                                    startIcon={<AddCircleOutline />}
                                    onClick={handleCadastroProdutos} // Chama a função de cadastro
                                />
                            </div>
                            <div className='w-[90%] flex flex-col' ref={tableRef}>
                                <TableComponent
                                    headers={headers}
                                    rows={rowsCompletas} // Adiciona produtos selecionados à tabela
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
                                options={produtos.map(produto => ({ label: produto.nome, value: produto.nome }))} // Preenche as opções com produtos cadastrados
                                onChange={(e) => setProdutoSelecionado(e.target.value)} // Atualiza o estado com o produto selecionado
                                value={produtoSelecionado} // Reflete o estado atual no componente
                            />
                        </div>
                        <div className='w-[95%] mt-2 flex items-end justify-end'>
                            <ButtonComponent
                                title={'Cadastrar'}
                                subtitle={'Cadastrar'}
                                startIcon={<Save />}
                                onClick={handleAddProduto} // Chama a função para adicionar o produto
                            />
                        </div>
                    </div>
                </CentralModal>
            </div>
        </div>
    );
}

export default ListaCompra;