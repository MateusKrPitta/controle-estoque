import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header';
import MenuMobile from '../../components/menu-mobile';
import HeaderPerfil from '../../components/navbars/perfil';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { InputAdornment, TextField } from '@mui/material';
import { AddCircleOutline, MoneySharp, Save } from '@mui/icons-material';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import SelectTextFields from '../../components/select';
import ArticleIcon from '@mui/icons-material/Article';
import ScaleIcon from '@mui/icons-material/Scale';
import ButtonComponent from '../../components/button';
import FlatwareIcon from '@mui/icons-material/Flatware';
import ButtonClose from '../../components/buttons/button-close';
import TabelaProdutos from '../../components/table-expanded';
import CustomToast from '../../components/toast';

// Função de formatação
export const formatValor = (valor) => {
    const parsedValor = parseFloat(valor); // Converte o valor para número
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(parsedValor);
};

const FichaTecnica = () => {
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [precoPorcao, setPrecoPorcao] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [nomePrato, setNomePrato] = useState('');
    const [unidade, setUnidade] = useState('');
    const [valorUtilizado, setValorUtilizado] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [produtosAdicionados, setProdutosAdicionados] = useState([]);
    const [custoTotal, setCustoTotal] = useState(0);
    const [valorVenda, setValorVenda] = useState('');
    const [lucroReal, setLucroReal] = useState(0);
    const [produtosCadastrados, setProdutosCadastrados] = useState([]);
    const [rendimento, setRendimento] = useState('');
    const [valorRendimento, setValorRendimento] = useState(0); // Novo estado para o valor do rendimento
    const [cmvReal, setCmvReal] = useState(0); // Novo estado para o CMV Real

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
        setProdutos(produtosSalvos);
    }, []);

    useEffect(() => {
        const produtosCadastradosSalvos = JSON.parse(localStorage.getItem('produtosCadastrados')) || [];
        setProdutosCadastrados(produtosCadastradosSalvos);
    }, []);

    useEffect(() => {
        if (quantidade && precoPorcao) {
            const valor = parseFloat(quantidade) * parseFloat(precoPorcao.replace('R$', '').replace(',', '.'));
            setValorUtilizado(formatValor(valor));
        } else {
            setValorUtilizado('');
        }
    }, [quantidade, precoPorcao]);

    useEffect(() => {
        const total = produtosAdicionados.reduce((acc, produto) => {
            const valor = parseFloat(produto.valorUtilizado.replace('R$', '').replace(',', '.'));
            return acc + (isNaN(valor) ? 0 : valor);
        }, 0);
        setCustoTotal(total);
    }, [produtosAdicionados]);

    useEffect(() => {
        const valorVendaNumerico = parseFloat(valorVenda.replace('R$', '').replace(',', '.'));
        if (!isNaN(valorVendaNumerico)) {
            const lucro = valorVendaNumerico - custoTotal;
            setLucroReal(lucro);
        } else {
            setLucroReal(0);
        }
    }, [valorVenda, custoTotal]);

    // Novo useEffect para calcular o valor do rendimento
    useEffect(() => {
        if (custoTotal && rendimento) {
            const valorRendimentoCalculado = (custoTotal / parseFloat(rendimento)) * 1000; // Cálculo do valor do rendimento
            setValorRendimento(valorRendimentoCalculado);
        } else {
            setValorRendimento(0);
        }
    }, [custoTotal, rendimento]);

    // Novo useEffect para calcular o CMV Real
    useEffect(() => {
        if (custoTotal && valorVenda) {
            const valorVendaNumerico = parseFloat(valorVenda.replace('R$', '').replace(',', '.'));
            if (!isNaN(valorVendaNumerico) && valorVendaNumerico > 0) {
                const cmvCalculado = custoTotal / valorVendaNumerico;
                setCmvReal(cmvCalculado);
            } else {
                setCmvReal(0);
            }
        } else {
            setCmvReal(0);
        }
    }, [custoTotal, valorVenda]);

    const handleProdutoChange = (value) => {
        const produto = produtos.find(prod => prod.id === value);
        setProdutoSelecionado(produto);
        if (produto) {
            setUnidade(produto.unidade);
            setPrecoPorcao(produto.precoPorcaoFormatado);
        } else {
            setUnidade('');
            setPrecoPorcao('');
        }
    };

    const handleAdicionarProduto = () => {
        if (!produtoSelecionado) {
            CustomToast({ type: "error", message: "Selecione o produto!" });
            return;
        }
        if (!quantidade) {
            CustomToast({ type: "error", message: "Informe a quantidade utilizada!" });
            return;
        }

        const novoProduto = {
            nome: produtoSelecionado.nome,
            unidade,
            quantidade,
            precoPorcao,
            valorUtilizado,
        };
        setProdutosAdicionados([...produtosAdicionados, novoProduto]);
        setQuantidade('');
        setValorUtilizado('');
        setProdutoSelecionado(null);
        setUnidade('');
        setPrecoPorcao('');
    };

    const handleRemoveProduto = (index) => {
        const novosProdutos = produtosAdicionados.filter((_, i) => i !== index);
        setProdutosAdicionados(novosProdutos);
    };

    const handleCadastrar = () => {
        if (!nomePrato) {
            CustomToast({ type: "error", message: "Informe o nome do prato!" });
            return;
        }
    
        if (produtosAdicionados.length === 0) {
            CustomToast({ type: "error", message: "Adicione pelo menos um prato!" });
            return;
        }
    
        // Verifica se o valor de venda está preenchido
        if (!valorVenda) {
            CustomToast({ type: "error", message: "Informe o valor de venda!" });
            return;
        }
    
        const pratoCadastrado = {
            nomePrato,
            produtos: produtosAdicionados,
            custoTotal,
            valorVenda,
            cmvReal,
            lucroReal,
        };
    
        // Atualiza o estado local
        const novosProdutosCadastrados = [...produtosCadastrados, pratoCadastrado];
        setProdutosCadastrados(novosProdutosCadastrados);
    
        // Salva no localStorage
        localStorage.setItem('produtosCadastrados', JSON.stringify(novosProdutosCadastrados));
    
        // Limpa os campos
        setProdutosAdicionados([]);
        setNomePrato('');
        setValorVenda('');
        setCustoTotal(0);
        setLucroReal(0);
        setCmvReal(0); // Resetar o CMV Real
    };

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex flex-col gap-3 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='justify-center sm:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex gap-2 '>
                    <ContentPasteSearchIcon /> Ficha Técnica
                </h1>
                <div className='w-[100%] mt-5 h-[800px] max-h-[800px] overflow-auto flex-wrap flex items-center justify-center'>
                    <div className={`p-7 w-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div className='p-6 flex flex-wrap gap-2' style={{ border: '1px solid black', borderRadius: '10px' }}>
                            <SelectTextFields
                                width={'280px'}
                                icon={<ArticleIcon fontSize="small" />}
                                label={'Produto'}
                                backgroundColor={"#D9D9D9"}
                                name={"produto"}
                                fontWeight={500}
                                options={produtos.map(produto => ({ label: produto.nome, value: produto.id }))}
                                onChange={(e) => handleProdutoChange(e.target.value)}
                            />

                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Unidade"
                                name="unidadeMedida"
                                value={unidade}
                                disabled
                                autoComplete="off"
                                sx={{
                                    width: { xs: '60%', sm: '50%', md: '40%', lg: '10%' },
                                    '& .MuiInputLabel-root': {
                                        color: 'black',
                                        fontWeight: 700
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'black',
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ScaleIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Preço Porção"
                                name="precoPorcao"
                                value={precoPorcao}
                                autoComplete="off"
                                sx={{
                                    width: { xs: '60%', sm: '50%', md: '40%', lg: '10%' },
                                    '& .MuiInputLabel-root': {
                                        color: 'black',
                                        fontWeight: 700
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'black',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'black',
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MoneySharp />
                                        </InputAdornment>
                                    ),
                                }}
                                disabled
                            />

                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label={`Quantidade Utilizada`}
                                name="quantidade"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '60%', sm: '50%', md: '40%', lg: '15%' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ScaleIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Valor Utilizado"
                                name="valorUtilizado"
                                value={valorUtilizado}
                                autoComplete="off"
                                sx={{ width: { xs: '60%', sm: '50%', md: '40%', lg: '14%' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MoneySharp />
                                        </InputAdornment>
                                    ),
                                }}
                                disabled
                            />

                            <ButtonComponent
                                startIcon={<AddCircleOutline fontSize='small' />}
                                title={'Adicionar'}
                                subtitle={'Adicionar'}
                                buttonSize="large"
                                onClick={handleAdicionarProduto}
                            />
                        </div>
                    </div>

                    <div className={`w-[95%] p-4 border border-gray-300 rounded-lg transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <div>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Nome do Prato"
                                value={nomePrato}
                                onChange={(e) => setNomePrato(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocalDiningIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                autoComplete="off"
                                sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '20%' } }}
                            />
                            <h2 className="font-bold text-xs mt-2">Produtos Adicionados:</h2>
                            <div className='flex gap-4 w-full'>
                                <div className='w-[70%]'>
                                    {produtosAdicionados.map((produto, index) => (
                                        <div key={index} className="flex justify-between items-center border-black py-2 w-full">
                                            <div style={{ border: '1px solid black', borderRadius: '10px' }} className='w-[100%] flex items-center p-1'>
                                                <label className='text-xs w-[95%] items-center flex gap-2'>
                                                    <FlatwareIcon />
                                                    <p className='w-[15%]'>{produto.nome}</p>
                                                    <p style={{ backgroundColor: '#006b33', color: 'white', padding: '5px', borderRadius: '5px', fontWeight: '700' }}> {produto.quantidade}</p>
                                                    Valor Porção:
                                                    <p style={{ width: '13%', display: 'flex', justifyContent: "center", backgroundColor: '#d9d9d9', color: 'black', fontWeight: '700', padding: '5px', borderRadius: '5px' }}>{produto.precoPorcao}</p>
                                                    Valor Utilizado:
                                                    <p style={{ width: '15%', display: 'flex', justifyContent: "center", backgroundColor: '#b0d847', color: 'black', fontWeight: '700', padding: '5px', borderRadius: '5px' }}>{produto.valorUtilizado}</p>
                                                </label>
                                                <ButtonClose
                                                    onClick={() => handleRemoveProduto(index)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='w-[30%] p-2 flex flex-col gap-2' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                    <div className='flex items-center w-full '>
                                        <label className='text-xs font-bold w-[60%]'>Custo Total: </label>
                                        <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#b0d847', borderRadius: '10px', marginLeft: '10px', paddingLeft: '10px' }}>
                                            {formatValor(custoTotal)}
                                        </label>
                                    </div>
                                    <div className='flex items-center w-full '>
                                        <label className='text-xs font-bold w-[60%]'>Quantidade de Rendimento: </label>
                                        <input
                                            type="text"
                                            value={rendimento} // Evita NaN
                                            onChange={(e) => setRendimento(e.target.value)}
                                            style={{
                                                backgroundColor: "yellow",
                                                color: 'black',
                                                borderRadius: '10px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                marginLeft: '10px',
                                                paddingLeft: '10px',
                                                width: '40%',
                                                padding: '2px',
                                                border: '1px solid #ccc',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div className='flex items-center w-full '>
                                        <label className='text-xs font-bold w-[60%]'>Valor do Rendimento(Kg/Ml/Uni): </label>
                                        <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#006b33', borderRadius: '10px', marginLeft: '10px', paddingLeft: '10px' }}>
                                            {formatValor((custoTotal / (parseFloat(rendimento) || 1)) * 1000)} {/* Cálculo do valor do rendimento */}
                                        </label>
                                    </div>
                                    <div className='flex items-center w-full '>
                                        <label className='text-xs font-bold w-[60%]'>Valor Venda: </label>
                                        <input
                                            type="text"
                                            value={valorVenda ? formatValor(valorVenda) : ''} // Evita NaN
                                            onChange={(e) => {
                                                const valor = e.target.value.replace('R$', '').replace('.', '').replace(',', '.').trim();
                                                setValorVenda(valor);
                                            }}
                                            style={{
                                                backgroundColor: "#FC6D26",
                                                color: 'black',
                                                borderRadius: '10px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                marginLeft: '10px',
                                                paddingLeft: '10px',
                                                width: '40%',
                                                padding: '2px',
                                                border: '1px solid #ccc',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div className='flex items-center w-full '>
                                        <label className='text-xs font-bold w-[60%]'>CMV Real: </label>
                                        <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#d9d9d9', borderRadius: '10px', marginLeft: '10px', paddingLeft: '10px' }}>
                                            {formatValor(cmvReal)} {/* Cálculo do CMV Real */}
                                        </label>
                                    </div>
                                    <div className='flex items-center w-full '>
                                        <label className='text-xs font-bold w-[60%]'>Lucro Real: </label>
                                        <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#0173E5', borderRadius: '10px', marginLeft: '10px', paddingLeft: '10px' }}>
                                            {formatValor(lucroReal)}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex items-end justify-end mt-2'>
                                <ButtonComponent
                                    startIcon={<Save fontSize='small' />}
                                    title={'Cadastrar'}
                                    subtitle={'Cadastrar'}
                                    buttonSize="large"
                                    onClick={handleCadastrar}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`mr-3 sm: md:mr-11 flex flex-wrap w-[95%]  p-4 gap-3 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <TabelaProdutos
                            pratos={produtosCadastrados}
                            onRowClick={(index) => {
                                console.log(produtosCadastrados[index]);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FichaTecnica;