import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableComponent from '../../../components/table'; // Supondo que você tenha um componente de tabela
import { formatValor } from '../../../utils/functions'; // Função para formatar valores

const EstoqueReal = () => {
    const [produtos, setProdutos] = useState([]);
    const [entradasSaidas, setEntradasSaidas] = useState([]);

    useEffect(() => {
        const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
        setProdutos(produtosSalvos);

        const entradasSaidasSalvas = JSON.parse(localStorage.getItem('entradasSaidas')) || [];
        setEntradasSaidas(entradasSaidasSalvas);
    }, []);

    // Calcular a quantidade total de entradas para cada produto
    const calcularEstoqueAtual = (produtoNome) => {
        const entradas = entradasSaidas.filter(registro => registro.produto === produtoNome && registro.tipo === 'entrada');
        const saídas = entradasSaidas.filter(registro => registro.produto === produtoNome && registro.tipo === 'saida');

        const totalEntradas = entradas.reduce((total, registro) => total + parseInt(registro.quantidade, 10), 0);
        const totalSaidas = saídas.reduce((total, registro) => total + parseInt(registro.quantidade, 10), 0);

        return totalEntradas - totalSaidas; // Retorna a quantidade atual em estoque
    };

    const rows = produtos.map(produto => {
        const estoqueAtual = calcularEstoqueAtual(produto.nome);
        const isBelowMin = estoqueAtual < produto.quantidadeMinima; // Verifica se está abaixo da quantidade mínima

        return {
            produto: produto.nome,
            unidade: produto.unidade,
            quantidadeMinima: produto.quantidadeMinima,
            estoqueAtual, // Chama a função para calcular o estoque atual
            precoUnitario: formatValor(produto.preco),
            valorTotal: formatValor((produto.preco * estoqueAtual)), // Calcula o valor total
            isBelowMin // Adiciona a informação se está abaixo da quantidade mínima
        };
    });

    const headers = [
        { label: 'Produto', key: 'produto' },
        { label: 'Unidade', key: 'unidade' },
        { label: 'Quantidade Mínima', key: 'quantidadeMinima' },
        { label: 'Estoque Atual', key: 'estoqueAtual' },
        { label: 'Preço Unitário', key: 'precoUnitario' },
        { label: 'Valor Total', key: 'valorTotal' },
    ];

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex flex-col gap-3 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='sm:items-center md:text-2xl font-bold text-black w-[99%] flex items-center gap-2 '>
                    <BarChartIcon /> Estoque Real
                </h1>
                <div className='w-full mt-7 p-3 flex gap-2 items-start'>
                    <div className='w-[90%] flex flex-col'>
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
    );
}

export default EstoqueReal;