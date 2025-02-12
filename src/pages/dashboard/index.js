import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil';
import MenuMobile from '../../components/menu-mobile';
import Estoque from '../../assets/png/estoque.png';
import Produtos from '../../assets/png/produtos.png';
import Dinheiro from '../../assets/png/dinheiro.png';
import Dados from '../../assets/png/dados.png';
import Compra from '../../assets/png/compra.png';
import CustomTooltip from '../../components/grafico';
import CustomToast from '../../components/toast';
import api from '../../services/api';

const Dashboard = () => {
    const [totalProdutos, setTotalProdutos] = useState(0);
    const [itensEmEstoque, setItensEmEstoque] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);
    const [cmv, setCmv] = useState(0);
    const [produtosAbaixoMinimo, setProdutosAbaixoMinimo] = useState(0);
    const [estoquePorCategoria, setEstoquePorCategoria] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [entradasSaidas, setEntradasSaidas] = useState([]);
    const [dataGrafico, setDataGrafico] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const getColor = (index) => {
        const colors = [
            '#BCDA72', '#FF8042', '#006b33', '#FFBB28', '#FF4444',
            '#8A2BE2', '#00CED1', '#FFD700', '#ADFF2F', '#FF69B4'
        ];
        return colors[index % colors.length];
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);



    const fetchDashboardData = async (unidade = 1) => {
        try {
            const response = await api.post(`/dashboard?unidade=${unidade}`);
            if (response.data.status) {
                setTotalProdutos(response.data.data.totalProduto);
                setItensEmEstoque(response.data.data.totalItens);
                setValorTotal(response.data.data.valorTotalItens);
                setProdutosAbaixoMinimo(response.data.data.produtosQtdMin);
                setProdutos(response.data.data.produtos || []);
                setEntradasSaidas(response.data.data.entradasSaidas || []);
            } else {
                CustomToast({ type: "error", message: response.data.message || "Erro ao carregar os dados!" });
            }
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
            CustomToast({ type: "error", message: "Erro ao carregar os dados!" });
        }
    };
    

    const calcularEstoqueAtual = (produtoNome) => {
        const entradas = entradasSaidas.filter(registro => registro.produto === produtoNome && registro.tipo === 'entrada');
        const saídas = entradasSaidas.filter(registro => registro.produto === produtoNome && (registro.tipo === 'saida' || registro.tipo === 'desperdicio'));

        const totalEntradas = entradas.reduce((total, registro) => total + parseInt(registro.quantidade, 10), 0);
        const totalSaidas = saídas.reduce((total, registro) => total + parseInt(registro.quantidade, 10), 0);

        return totalEntradas - totalSaidas;
    };

    useEffect(() => {
        const estoquePorCategoriaData = produtos.reduce((acc, produto) => {
            const estoqueAtual = calcularEstoqueAtual(produto.nome);
            const categoria = produto.categoria || 'Sem Categoria';

            if (!acc[categoria]) {
                acc[categoria] = 0;
            }
            acc[categoria] += estoqueAtual;

            return acc;
        }, {});

        const estoqueData = Object.keys(estoquePorCategoriaData).map(categoria => ({
            name: categoria,
            quantidade: estoquePorCategoriaData[categoria],
        }));

        setEstoquePorCategoria(estoqueData);
    }, [produtos, entradasSaidas]);

    useEffect(() => {
        const data = produtos.map(produto => {
            const entradas = entradasSaidas.filter(item => item.produto === produto.nome && item.tipo === 'entrada').reduce((acc, item) => acc + parseInt(item.quantidade), 0);
            const saidas = entradasSaidas.filter(item => item.produto === produto.nome && item.tipo === 'saida').reduce((acc, item) => acc + parseInt(item.quantidade), 0);
            const desperdicio = entradasSaidas.filter(item => item.produto === produto.nome && item.tipo === 'desperdicio').reduce((acc, item) => acc + parseInt(item.quantidade), 0);

            return {
                nome: produto.nome,
                entradas,
                saidas,
                desperdicio
            };
        });

        setDataGrafico(data);
    }, [produtos, entradasSaidas]);

    useEffect(() => {
        fetchDashboardData();
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

                <div className={`w-full mt-8 flex-col p-3 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                    <div className='w-full flex gap-6 md:flex-wrap items-center justify-center'>
                        {/* Cards de informações */}
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
                        <div className='w-[50%] p-5 border-[2px] rounded-lg md:w-[18%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold'>Itens para comprar</label>
                            <div className='flex items-center justify-center gap-6'>
                                <img src={Compra} alt="Produtos Abaixo do Mínimo" />
                                <label className='text-black font-semibold w-full'>{produtosAbaixoMinimo}</label>
                            </div>
                        </div>
                    </div>

                    <div className='flex w-full items-end h-[70%] justify-center flex-wrap'>
                        <div className="mt-8 w-[30%] h-64">
                            <h2 className="text-lg text-center font-bold text-primary mb-7">Estoque por Categoria</h2>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={estoquePorCategoria}
                                        dataKey="quantidade"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {estoquePorCategoria.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getColor(index)} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 w-[50%] h-64">
                            <h2 className="text-lg text-center font-bold text-primary mb-7">Entradas, Saídas e Desperdícios por Produto</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dataGrafico}>
                                    <XAxis dataKey="nome" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="entradas" fill="#BCDA72" />
                                    <Bar dataKey="saidas" fill="#FF0000" />
                                    <Bar dataKey="desperdicio" fill="#000000" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;