import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableComponent from '../../../components/table'; // Supondo que você tenha um componente de tabela
import { formatValor } from '../../../utils/functions'; // Função para formatar valores
import HeaderRelatorio from '../../../components/navbars/relatorios';
import ButtonComponent from '../../../components/button';
import { DateRange, FilterAlt, Print } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ScaleIcon from '@mui/icons-material/Scale';
import Objeto from '../../../assets/icones/objetos.png';
import Baixo from '../../../assets/icones/abaixo.png';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CentralModal from '../../../components/modal-central';
import SelectTextFields from '../../../components/select';
import CategoryIcon from '@mui/icons-material/Category';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Logo from '../../../assets/png/logo_preta.png'

const EstoqueReal = () => {
    const [produtos, setProdutos] = useState([]);
    const [entradasSaidas, setEntradasSaidas] = useState([]);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [filtro, setFiltro] = useState(false);
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [uniqueCategoriesCount, setUniqueCategoriesCount] = useState(0);
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
        const saídas = entradasSaidas.filter(registro => registro.produto === produtoNome && (registro.tipo === 'saida' || registro.tipo === 'desperdicio'));

        const totalEntradas = entradas.reduce((total, registro) => total + parseInt(registro.quantidade, 10), 0);
        const totalSaidas = saídas.reduce((total, registro) => total + parseInt(registro.quantidade, 10), 0);

        const estoqueAtual = totalEntradas - totalSaidas;

        console.log(`Produto: ${produtoNome}, Entradas: ${totalEntradas}, Saídas: ${totalSaidas}, Estoque Atual: ${estoqueAtual}`);

        return estoqueAtual;
    };
    // Calcular total de itens em estoque e quantidade abaixo da mínima
    const totalItensEmEstoque = produtos.reduce((total, produto) => total + calcularEstoqueAtual(produto.nome), 0);
    const totalAbaixoMinimo = produtos.reduce((total, produto) => {
        const estoqueAtual = calcularEstoqueAtual(produto.nome);
        return estoqueAtual < produto.quantidadeMinima ? total + 1 : total;
    }, 0);
    const totalProdutos = produtos.length;

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

            // Aqui, utilize o precoPorcao para o preço unitário
            const precoUnitario = produto.precoPorcao; // Certifique-se de que o produto tem essa propriedade
            const valorTotal = estoqueAtual * precoUnitario; // Calcule o valor total corretamente

            return {
                categoria,
                produto: produto.nome,
                unidade: produto.unidade,
                quantidadeMinima: produto.quantidadeMinima,
                estoqueAtual,
                precoUnitario: formatValor(precoUnitario), // Formate o preço unitário
                valorTotal: formatValor(valorTotal), // Formate o valor total
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
        printWindow.document.close();
        printWindow.print();
    };


    const handleFiltro = () => setFiltro(true);
    const handleCloseFiltro = () => setFiltro(false);


    useEffect(() => {
        const categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];
        const categoriasUnicas = Array.from(new Set(categoriasSalvas.map(cat => cat.nome)))
            .map(nome => categoriasSalvas.find(cat => cat.nome === nome));

        setCategorias(categoriasUnicas);
        setUniqueCategoriesCount(categoriasUnicas.length); // Atualiza o estado com o número de categorias únicas
    }, []);
    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start   '>
                    <BarChartIcon /> Estoque Real
                </h1>
                <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                    <div className="hidden md:w-[14%] md:flex ">
                        <HeaderRelatorio />
                    </div>
                    <div className={`w-[90%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col md:w-[80%] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div className='w-[99%] justify-center flex-wrap  mb-4 flex items-center gap-4' >

                            <div className='w-[80%] md:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                <label className='text-xs font-bold'>Itens em Estoque</label>
                                <div className='flex items-center justify-center gap-5'>
                                    <img src={Objeto} alt="Total Movimentações" />
                                    <label>{totalItensEmEstoque}</label> {/* Total de itens em estoque */}
                                </div>
                            </div>
                            <div className='w-[80%] md:w-[30%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                <label className='text-xs font-bold'>Quantidade Itens Mínimo</label>
                                <div className='flex items-center justify-center gap-5'>
                                    <img src={Baixo} alt="Entradas" />
                                    <label>{totalAbaixoMinimo}</label> {/* Total de itens abaixo da quantidade mínima */}
                                </div>
                            </div>

                        </div>
                        <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                type='date'
                                label="Data Início"
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '40%', sm: '50%', md: '40%', lg: '20%' } }}
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
                                sx={{ width: { xs: '40%', sm: '50%', md: '40%', lg: '20%' } }}
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
                            <IconButton title="Filtro"
                                onClick={() => setFiltro(true)}
                                className='view-button w-10 h-10 '
                                sx={{
                                    color: 'black',
                                    border: '1px solid black',
                                    '&:hover': {
                                        color: '#fff',
                                        backgroundColor: '#BCDA72',
                                        border: '1px solid black'
                                    }
                                }} >

                                <FilterAlt fontSize={"small"} />

                            </IconButton>
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
            <CentralModal
                tamanhoTitulo={'81%'}
                maxHeight={'100vh'}
                top={'20%'}
                left={'28%'}
                width={'400px'}
                icon={<FilterAltIcon fontSize="small" />}
                open={filtro}
                onClose={handleCloseFiltro}
                title="Filtro"
            >
                <div >
                    <div className='mt-4 flex gap-3 flex-wrap'>

                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Data Inicial"
                            value={dataInicial}
                            type='date'
                            // onChange={handleInputChange}
                            autoComplete="off"
                            sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '49%' } }}
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
                            value={dataFinal}
                            //onChange={handleInputChange}
                            autoComplete="off"
                            sx={{ width: { xs: '42%', sm: '50%', md: '40%', lg: '43%' } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DateRange />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <SelectTextFields
                            width={'175px'}
                            icon={<CategoryIcon fontSize="small" />}
                            label={'Categoria'}
                            backgroundColor={"#D9D9D9"}
                            name={"categoria"}
                            fontWeight={500}
                            options={categorias.map(categoria => ({ label: categoria.nome, value: categoria.id }))}
                            onChange={(e) => setSelectedCategoria(e.target.value)} // Atualiza o estado
                            value={selectedCategoria} // Reflete o estado atual no componente
                        />



                    </div>
                    <div className='w-[95%] mt-2 flex items-end justify-end'>
                        <ButtonComponent
                            title={'Pesquisar'}
                            subtitle={'Pesquisar'}
                            startIcon={<SearchIcon />}
                        //onClick={handleCadastrarProduto}
                        />
                    </div>
                </div>
            </CentralModal>
        </div>
    );
}

export default EstoqueReal;