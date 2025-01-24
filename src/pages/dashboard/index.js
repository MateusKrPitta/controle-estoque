import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil';
import MenuMobile from '../../components/menu-mobile';
import Estoque from '../../assets/png/estoque.png';
import Produtos from '../../assets/png/produtos.png';
import Dinheiro from '../../assets/png/dinheiro.png';
import Dados from '../../assets/png/dados.png';

const Dashboard = () => {
    const [totalProdutos, setTotalProdutos] = useState(0);
    const [itensEmEstoque, setItensEmEstoque] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);
    const [cmv, setCmv] = useState(0); // CMV pode ser calculado se você tiver a lógica

    useEffect(() => {
        const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
        const entradasSaidasSalvas = JSON.parse(localStorage.getItem('entradasSaidas')) || [];

        // Calcular total de produtos
        const total = produtosSalvos.length;
        setTotalProdutos(total);

        // Calcular itens em estoque
        const totalEntradas = entradasSaidasSalvas.filter(item => item.tipo === 'entrada').reduce((acc, item) => acc + parseInt(item.quantidade), 0);
        const totalSaidas = entradasSaidasSalvas.filter(item => item.tipo === 'saida').reduce((acc, item) => acc + parseInt(item.quantidade), 0);
        setItensEmEstoque(totalEntradas - totalSaidas);

        // Calcular valor total
        const valor = produtosSalvos.reduce((acc, produto) => {
            const entradas = entradasSaidasSalvas.filter(item => item.produto === produto.nome && item.tipo === 'entrada').reduce((sum, item) => sum + (parseFloat(produto.preco) * parseInt(item.quantidade)), 0);
            const saidas = entradasSaidasSalvas.filter(item => item.produto === produto.nome && item.tipo === 'saida').reduce((sum, item) => sum + (parseFloat(produto.preco) * parseInt(item.quantidade)), 0);
            return acc + (entradas - saidas);
        }, 0);
        setValorTotal(valor);
    }, []);

    return (
        <div className="md:flex w-[100%] h-[100%]">
            <MenuMobile />
            <Navbar />
            <div className='flex flex-col gap-2 w-full items-end'>
                <HeaderPerfil />
                <h1 className='ml-3 text-2xl font-bold text-primary w-[95%]'>Dashboard</h1>
                <div className='w-full mt-8 flex-col p-3'>
                    <div className='flex gap-8'>
                        <div className='p-5 border-[2px] rounded-lg w-[20%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>Total de Produtos</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Estoque} alt="Total de Produtos" />
                                <label className='text-black font-semibold w-full'>{totalProdutos}</label>
                            </div>
                        </div>
                        <div className='p-5 border-[2px] rounded-lg w-[20%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>Itens em Estoque</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Produtos} alt="Itens em Estoque" />
                                <label className='text-black font-semibold w-full'>{itensEmEstoque}</label>
                            </div>
                        </div>
                        <div className='p-5 border-[2px] rounded-lg w-[20%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>Valor Total</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Dinheiro} alt="Valor Total" />
                                <label className='text-black font-semibold w-full'>R$ {valorTotal.toFixed(2).replace('.', ',')}</label>
                            </div>
                        </div>
                        <div className='p-5 border-[2px] rounded-lg w-[20%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>CMV</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Dados} alt="CMV" />
                                <label className='text-black font-semibold w-full'>{cmv}%</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;