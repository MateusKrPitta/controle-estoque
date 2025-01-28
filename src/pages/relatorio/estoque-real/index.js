import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableComponent from '../../../components/table'; // Supondo que você tenha um componente de tabela
import { formatValor } from '../../../utils/functions'; // Função para formatar valores
import HeaderRelatorio from '../../../components/navbars/relatorios';
import ButtonComponent from '../../../components/button';
import { DateRange, Print } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ScaleIcon from '@mui/icons-material/Scale';

const EstoqueReal = () => {
    const [produtos, setProdutos] = useState([]);
    const [entradasSaidas, setEntradasSaidas] = useState([]);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [quantidade, setQuantidade] = useState('');

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

    // Filtrar produtos por data
    const produtosFiltrados = produtos.filter(produto => {
        const dataAdicionado = new Date(produto.dataAdicionado);
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);

        return (!dataInicio || dataAdicionado >= inicio) && (!dataFim || dataAdicionado <= fim);
    });

    // Agrupar produtos por categoria
    const produtosPorCategoria = produtosFiltrados.reduce((acc, produto) => {
        const categoria = produto.categoria || 'Sem Categoria'; // Define uma categoria padrão se não houver
        if (!acc[categoria]) {
            acc[categoria] = [];
        }
        acc[categoria].push(produto);
        return acc;
    }, {});

    const rows = Object.entries(produtosPorCategoria).flatMap(([categoria, produtos]) => {
        return produtos.map(produto => {
            const estoqueAtual = calcularEstoqueAtual(produto.nome);
            const isBelowMin = estoqueAtual < produto.quantidadeMinima;

            return {
                categoria,
                produto: produto.nome,
                unidade: produto.unidade,
                quantidadeMinima: produto.quantidadeMinima,
                estoqueAtual,
                precoUnitario: formatValor(produto.preco),
                valorTotal: formatValor((produto.preco * estoqueAtual)),
                isBelowMin
            };
        });
    });

    const headers = [
        { label: 'Categoria', key: 'categoria' },
        { label: 'Produto', key: 'produto' },
        { label: 'Unidade', key: 'unidade' },
        { label: 'Quantidade Mínima', key: 'quantidadeMinima' },
        { label: 'Estoque Atual', key: 'estoqueAtual' },
        { label: 'Preço Unitário', key: 'precoUnitario' },
        { label: 'Valor Total', key: 'valorTotal' },
    ];

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const tableHTML = `
            <html>
                <head>
                    <title>Imprimir Estoque</title>
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
        printWindow.document.close ();
        printWindow.print();
    };

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex flex-col gap-3 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='justify-center  sm:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
                    <BarChartIcon /> Estoque Real
                </h1>
                <div className=' md:w-full mt-7 p-3 flex gap-2 items-start'>
                    
                    <HeaderRelatorio />
                    <div className='flex flex-col w-[90%]'>
                        
                       
                        <div className='flex w-full gap-2'>
                        <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                type='date'
                                label="Data Início"
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '15%' } }}
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
                                name="quantidade"
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '15%' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRange />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <ButtonComponent
                                title="Imprimir"
                                subtitle="Imprimir"
                                startIcon={<Print />}
                                onClick={handlePrint} // Adiciona a função de impressão
                            />
                        </div>
                        <div className='w-[100%] flex flex-col ml-3 md:ml-0'>
                            <TableComponent
                                headers={headers}
                                rows={rows}
                                actionsLabel={"Ações"} // Se você quiser adicionar ações
                                actionCalls={{}} // Se você quiser adicionar ações
                                rowStyle={(row) => row.isBelowMin ? { backgroundColor: 'rgba(255, 0, 0, 0.2)' } : {}} // Aplica o estilo se abaixo da quantidade mínima
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EstoqueReal;