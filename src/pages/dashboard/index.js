import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil';
import MenuMobile from '../../components/menu-mobile';
import Estoque from '../../assets/png/estoque.png';
import Produtos from '../../assets/png/produtos.png';
import Dinheiro from '../../assets/png/dinheiro.png';
import Dados from '../../assets/png/dados.png';
import Compra from '../../assets/png/compra.png';

const Dashboard = () => {
    const [totalProdutos, setTotalProdutos] = useState(0);
    const [itensEmEstoque, setItensEmEstoque] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);
    const [cmv, setCmv] = useState(0);
    const [produtosAbaixoMinimo, setProdutosAbaixoMinimo] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300); // Delay para a transição

        return () => clearTimeout(timer);
    }, []);
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

        // Calcular produtos abaixo do estoque mínimo
        const produtosAbaixoMinimoCount = produtosSalvos.filter(produto => {
            const entradas = entradasSaidasSalvas.filter(registro => registro.produto === produto.nome && registro.tipo === 'entrada');
            const saídas = entradasSaidasSalvas.filter(registro => registro.produto === produto.nome && registro.tipo === 'saida');

            const totalEntradas = entradas.reduce((total, registro) => total + parseInt(registro.quantidade, 10), 0);
            const totalSaidas = saídas.reduce((total, registro) => total + parseInt(registro.quantidade, 10), 0);

            const estoqueAtual = totalEntradas - totalSaidas;
            return estoqueAtual < produto.quantidadeMinima;
        }).length;

        setProdutosAbaixoMinimo(produtosAbaixoMinimoCount);

        // Processar dados para o gráfico
        const dataByDate = {};
        entradasSaidasSalvas.forEach(item => {
            console.log('Data do item:', item.data); // Debugging: Verifique o formato da data
            const date = new Date(item.data).toLocaleDateString(); // Formatar a data
            if (!dataByDate[date]) {
                dataByDate[date] = { entrada: 0, saida: 0 };
            }
            if (item.tipo === 'entrada') {
                dataByDate[date].entrada += parseInt(item.quantidade);
            } else {
                dataByDate[date].saida += parseInt(item.quantidade);
            }
        });

        const chartData = Object.keys(dataByDate).map(date => ({
            date,
            entrada: dataByDate[date].entrada,
            saida: dataByDate[date].saida,
        }));

        setChartData(chartData);
    }, []);

    return (
        <div className="md:flex w-[100%] h-[100%]">
            <MenuMobile />
            <Navbar />
            <div className='flex flex-col gap-2 w-full items-end'>
                <HeaderPerfil />
                <h1 className='flex items-center justify-center mt-6 md:mt-0 md:justify-start ml-3 text-2xl font-bold text-primary w-[95%]'>
                    Dashboard
                </h1>

                <div className= {`w-full mt-8 flex-col p-3 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                    <div className='w-full flex gap-6 md:flex-wrap items-center justify-center'>
                        <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[18%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>Total de Produtos</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Estoque} alt="Total de Produtos" />
                                <label className='text-black font-semibold w-full'>{totalProdutos}</label>
                            </div>
                        </div>
                        <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[18%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>Itens em Estoque</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Produtos} alt="Itens em Estoque" />
                                <label className='text-black font-semibold w-full'>{itensEmEstoque}</label>
                            </div>
                        </div>
                        <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[18%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>Valor Total</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Dinheiro} alt="Valor Total" />
                                <label className='text-black font-semibold w-full'>R$ {valorTotal.toFixed(2).replace('.', ',')}</label>
                            </div>
                        </div>
                        <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[18%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>CMV</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Dados} alt="CMV" />
                                <label className='text-black font-semibold w-full'>{cmv}%</label>
                            </div>
                        </div>
                        {/* Novo Card para Produtos Abaixo do Estoque Mínimo */}
                        <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[18%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>Itens para comprar</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Compra} alt="Produtos Abaixo do Mínimo" />
                                <label className='text-black font-semibold w-full'>{produtosAbaixoMinimo}</label>
                            </div>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
    );
}

export default Dashboard;