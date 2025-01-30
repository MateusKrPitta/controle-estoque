import React, { useEffect, useState, useRef } from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import TableComponent from '../../../components/table';
import { formatValor } from '../../../utils/functions'; // Função para formatar valores
import ButtonComponent from '../../../components/button';
import { Print } from '@mui/icons-material';
import HeaderRelatorio from '../../../components/navbars/relatorios';

const ListaCompra = () => {
    const [produtos, setProdutos] = useState([]);
    const [entradasSaidas, setEntradasSaidas] = useState([]);
    const tableRef = useRef(null); // Ref para a tabela
    const [isVisible, setIsVisible] = useState(false);

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

    const produtosAbaixoMinimo = produtos.filter(produto => {
        const estoqueAtual = calcularEstoqueAtual(produto.nome);
        return estoqueAtual < produto.quantidadeMinima;
    });

    const rows = produtosAbaixoMinimo.map(produto => {
        const estoqueAtual = calcularEstoqueAtual(produto.nome);
        return {
            produto: produto.nome,
            unidade: produto.unidade,
            quantidadeMinima: produto.quantidadeMinima,
            estoqueAtual,
            precoUnitario: formatValor(produto.preco),
            valorTotal: formatValor((produto.preco * estoqueAtual)),
        };
    });

    const headers = [
        { label: 'Produto', key: 'produto' },
        { label: 'Unidade', key: 'unidade' },
        { label: 'Quantidade Mínima', key: 'quantidadeMinima' },
        { label: 'Estoque Atual', key: 'estoqueAtual' },
    ];

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Imprimir Tabela</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>Lista de Compra</h1>
                    ${tableRef.current.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start   '>
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
                            </div>
                            <div className='w-[90%] flex flex-col' ref={tableRef}>
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
            </div>
        </div>
    );
}

export default ListaCompra;