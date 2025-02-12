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
import { useNavigate } from 'react-router-dom';
import { formatValor } from '../../utils/functions';

const Dashboard = () => {
    const navigate = useNavigate();
    const [totalProdutos, setTotalProdutos] = useState(0);
    const [itensEmEstoque, setItensEmEstoque] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);
    const [cmv, setCmv] = useState(0);
    const [produtosAbaixoMinimo, setProdutosAbaixoMinimo] = useState(0);
    const [estoquePorCategoria, setEstoquePorCategoria] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [entradasSaidas, setEntradasSaidas] = useState([]);
    const [dataGrafico, setDataGrafico] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [produtosOriginais, setProdutosOriginais] = useState([]);
    const [entradasSaidasOriginais, setEntradasSaidasOriginais] = useState([]);
    const userOptionsUnidade = [
        { value: 1, label: 'Kilograma' },
        { value: 2, label: 'Grama' },
        { value: 3, label: 'Litro' },
        { value: 4, label: 'Mililitro' },
        { value: 5, label: 'Unidade' },
    ];

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

    const carregaProdutos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/produto');
            console.log(response.data);
            if (Array.isArray(response.data.data)) {
                const mappedProdutos = response.data.data.map(produto => {
                    const unidade = userOptionsUnidade.find(unit => unit.value === parseInt(produto.unidadeMedida));
                    const valorFormatado = formatValor(produto.valorReajuste || produto.valor); // Valor formatado

                    return {
                        id: produto.id,
                        nome: produto.nome,
                        rendimento: produto.rendimento,
                        unidadeMedida: unidade ? unidade.label : 'N/A',
                        categoria: produto.categoriaNome, // Aqui você pode usar a categoriaNome
                        valorPorcao: formatValor(produto.valorPorcao),
                        valor: formatValor(produto.valorReajuste || produto.valor), // Mantém para uso na tabela
                        valorFormatado: valorFormatado, // Novo campo com valor formatado
                        qtdMin: produto.qtdMin,
                        categoriaId: produto.categoriaId,
                        createdAt: new Date(produto.createdAt).toLocaleDateString('pt-BR'),
                        categoriaNome: produto.categoriaNome // Adicione esta linha
                    };
                });
                setProdutos(mappedProdutos);
                setProdutosOriginais(mappedProdutos); // Armazena a lista original
            } else {
                console.error("A resposta da API não é um array:", response.data.data);
                setProdutos([]);
                setProdutosOriginais([]); // Limpa a lista original se não for um array
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);

            // Verifica se o erro é devido a um token expirado
            if (error.response && error.response.data.message === "Credenciais inválidas" && error.response.data.data === "Token de acesso inválido") {
                CustomToast({ type: "error", message: "Sessão expirada. Faça login novamente." });
                navigate("/login"); // Redireciona para a página de login
            } else {
                CustomToast({ type: "error", message: "Erro ao carregar produtos!" });
            }
        } finally {
            setLoading(false);
        }
    };


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
        } catch (err) {
            console.error('Erro ao buscar dados do dashboard:', err);
            CustomToast({ type: "error", message: "Erro ao carregar os dados!" });
            if (err.response) {
                if (err.response.data.message === "Credenciais inválidas" && err.response.data.data === "Token de acesso inválido") {
                    CustomToast({ type: "error", message: "Sessão expirada. Faça login novamente." });
                    navigate("/login");
                } else {
                    CustomToast({ type: "error", message: err.response.data.message || "Erro ao carregar as unidades!" });
                }
            }
        }
    };

    const fetchEntradasSaidas = async () => {
        try {
            const response = await api.get('/movimentacao');
            const movimentacoes = response.data.data;

            // Agrupar movimentações por produtoNome e calcular entradas, saídas e desperdícios
            const agrupadas = movimentacoes.reduce((acc, mov) => {
                if (!acc[mov.produtoNome]) {
                    acc[mov.produtoNome] = { nome: mov.produtoNome, entradas: 0, saidas: 0, desperdicio: 0 };
                }
                if (mov.tipo === "1") acc[mov.produtoNome].entradas += mov.quantidade;
                if (mov.tipo === "2") acc[mov.produtoNome].saidas += mov.quantidade;
                if (mov.tipo === "3") acc[mov.produtoNome].desperdicio += mov.quantidade;
                return acc;
            }, {});

            // Converter o objeto em um array para o gráfico
            const data = Object.values(agrupadas);
            setDataGrafico(data);
            setEntradasSaidas(movimentacoes); // Armazenar movimentações completas, se precisar usar
        } catch (error) {
            console.error('Erro ao buscar movimentações:', error);
            CustomToast({ type: "error", message: "Erro ao carregar movimentações!" });
        }
    };




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
        const categoriasContagem = produtos.reduce((acc, produto) => {
            const categoria = produto.categoriaNome || 'Sem Categoria';

            if (!acc[categoria]) {
                acc[categoria] = 0;
            }

            acc[categoria] += 1; // Conta a quantidade de produtos na categoria
            return acc;
        }, {});

        const categoriasData = Object.keys(categoriasContagem).map(categoria => ({
            name: categoria,
            quantidade: categoriasContagem[categoria],
        }));

        setEstoquePorCategoria(categoriasData);
    }, [produtos]);

    useEffect(() => {
    const data = produtos.map(produto => {
        const entradas = entradasSaidas
            .filter(item => item.produtoNome === produto.nome && item.tipo === '1') // Tipo 1 = entrada
            .reduce((acc, item) => acc + parseInt(item.quantidade), 0);
        
        const saidas = entradasSaidas
            .filter(item => item.produtoNome === produto.nome && item.tipo === '2') // Tipo 2 = saída
            .reduce((acc, item) => acc + parseInt(item.quantidade), 0);
        
        const desperdicio = entradasSaidas
            .filter(item => item.produtoNome === produto.nome && item.tipo === '3') // Tipo 3 = desperdício
            .reduce((acc, item) => acc + parseInt(item.quantidade), 0);

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
        carregaProdutos();
        fetchEntradasSaidas();
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