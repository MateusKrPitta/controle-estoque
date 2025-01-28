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
            <div className='flex flex-col gap-3 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='justify-center  sm:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
                    <AssignmentIcon /> Lista de Compra
                </h1>

                <div className=' md:w-full mt-7 p-3 flex gap-2 items-start'>
                    <HeaderRelatorio/>
                    <div className='flex flex-col w-[90%]'>
                    <div>
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
    );
}

export default ListaCompra;