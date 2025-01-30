import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header';
import MenuMobile from '../../components/menu-mobile';
import HeaderPerfil from '../../components/navbars/perfil';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { InputAdornment, TextField, Button } from '@mui/material';
import { AddCircleOutline, MoneySharp, Save } from '@mui/icons-material';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import SelectTextFields from '../../components/select';
import ArticleIcon from '@mui/icons-material/Article';
import ScaleIcon from '@mui/icons-material/Scale';
import ButtonComponent from '../../components/button';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TableComponent from '../../components/table';
import { headerFichaTecnica } from '../../entities/headers/header-ficha-tecnica';
import '../cadastro/unidades/unidades.css';
import ButtonClose from '../../components/buttons/button-close';
import FlatwareIcon from '@mui/icons-material/Flatware';
import CustomToast from '../../components/toast';

const FichaTecnica = () => {
    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState('');
    const [precoBruto, setPrecoBruto] = useState('');
    const [valorVenda, setValorVenda] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [selectedUnidade, setSelectedUnidade] = useState('');
    const [produtosAdicionados, setProdutosAdicionados] = useState([]);
    const [nomePrato, setNomePrato] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [quantidadeError, setQuantidadeError] = useState('');
    const [valorUtilizado, setValorUtilizado] = useState('');
    const [custoTotal, setCustoTotal] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300); // Delay para a transição

        return () => clearTimeout(timer);
    }, []);

    const handleProdutoChange = (value) => {
        const produtoSelecionado = produtos.find(prod => prod.nome === value);
        setProduto(value);
        setPrecoBruto(produtoSelecionado ? produtoSelecionado.precoPorcaoFormatado : ''); // Atualiza o preço bruto para o preço por porção
        setSelectedUnidade(produtoSelecionado ? produtoSelecionado.unidade : ''); // Atualiza a unidade
    };

    useEffect(() => {
        const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
        setProdutos(produtosSalvos);
    }, []);

    const userOptionsUnidade = [
        { value: 'kg', label: 'Kilograma' },
        { value: 'g', label: 'Grama' },
        { value: 'l', label: 'Litro' },
        { value: 'ml', label: 'Mililitro' },
        { value: 'unidade', label: 'Unidade' },
    ];

    const handleUnidadeChange = (event) => {
        setSelectedUnidade(event.target.value);
        setQuantidade(''); // Reseta a quantidade ao mudar a unidade
    };


const handleAdicionarProduto = () => {
    if (produto && quantidade && selectedUnidade) {
        const quantidadeNum = parseFloat(quantidade);
        if (isNaN(quantidadeNum) || quantidadeNum <= 0) {
            setQuantidadeError('Por favor, insira uma quantidade válida.');
            return;
        } else {
            setQuantidadeError(''); // Limpa a mensagem de erro
        }

        // Cálculo do custo total
        const precoNum = parseFloat(precoBruto); // Aqui você pode mudar para pegar o preço por porção
        let precoPorUnidade = precoNum;

        // Ajuste de preço por unidade
        if (selectedUnidade === 'g') {
            precoPorUnidade = precoNum / 1000;
        } else if (selectedUnidade === 'ml') {
            precoPorUnidade = precoNum / 1000;
        }

        const custoProduto = (quantidadeNum * precoPorUnidade);
        const valorCalculado = custoProduto.toFixed(2); // Calcule o valor utilizado

        // Verifica se o valor utilizado é maior que o preço por porção
        if (parseFloat(valorCalculado) > precoNum) {
            CustomToast({ type: "error", message: "O valor utilizado não pode ser maior que o preço por porção!" });
            return;
        }

        const novoProduto = {
            nome: produto,
            quantidade: quantidadeNum,
            unidade: selectedUnidade,
            precoBruto: precoNum , // Aqui você pode mudar para armazenar o preço por porção
            valorUtilizado: valorCalculado // Use o valor calculado aqui
        };

        setCustoTotal(prevTotal => prevTotal + custoProduto); // Atualiza o custo total
        setProdutosAdicionados([...produtosAdicionados, novoProduto]);
        setProduto('');
        setQuantidade('');
        setSelectedUnidade('');
        setPrecoBruto('');
        setValorUtilizado('');
    }
};

    const handleExcluirProduto = (index) => {
        const novosProdutosAdicionados = produtosAdicionados.filter((_, i) => i !== index);
        setProdutosAdicionados(novosProdutosAdicionados);
    };

    const handleCadastrar = () => {
        if (nomePrato && produtosAdicionados.length > 0) {
            const fichaTecnica = {
                nome: nomePrato,
                itens: produtosAdicionados,
            };
            const fichasTecnicasSalvas = JSON.parse(localStorage.getItem('fichasTecnicas')) || [];
            fichasTecnicasSalvas.push(fichaTecnica);
            localStorage.setItem('fichasTecnicas', JSON.stringify(fichasTecnicasSalvas));
            setNomePrato('');
            setProdutosAdicionados([]);
        }
    };

    // Transformação dos dados para exibição na tabela
    const fichasTecnicas = JSON.parse(localStorage.getItem('fichasTecnicas')) || [];
    const rows = fichasTecnicas.map(ficha => ({
        ...ficha,
        itens: ficha.itens.map(item => `${item.nome} - ${item.quantidade} ${item.unidade}`).join(', '),
    }));

    const handleQuantidadeChange = (value) => {
        const quantidadeNum = parseFloat(value);
        if (isNaN(quantidadeNum) || quantidadeNum < 0) {
            setQuantidade('');
            setValorUtilizado('');
            return;
        }

        setQuantidade(value);

        // Cálculo do valor utilizado
        if (precoBruto) {
            const precoNum = parseFloat(precoBruto);
            let precoPorUnidade = precoNum;

            // Se a unidade selecionada for grama e o preço estiver em kg, ajusta o cálculo
            if (selectedUnidade === 'g') {
                precoPorUnidade = precoNum / 1000;
            }

            // Se a unidade selecionada for mililitro e o preço estiver em litro, ajusta o cálculo
            if (selectedUnidade === 'ml') {
                precoPorUnidade = precoNum / 1000;
            }

            const valorCalculado = (quantidadeNum * precoPorUnidade).toFixed(2);
            setValorUtilizado(valorCalculado);

            setValorUtilizado(valorCalculado);
        }
    };


    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex flex-col gap-3 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='justify-center  sm:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
                    <ContentPasteSearchIcon /> Ficha Técnica
                </h1>
                <div
                    className={`p-7 w-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                    <div className='p-6 flex flex-wrap gap-2' style={{ border: '1px solid black', borderRadius: '10px' }}>
                        <SelectTextFields
                            width={'280px'}
                            icon={<ArticleIcon fontSize="small" />}
                            label={'Produto'}
                            backgroundColor={"#D9D9D9"}
                            name={"produto"}
                            fontWeight={500}
                            options={produtos.map(produto => ({
                                label: produto.nome,
                                value: produto.nome,
                            }))}
                            value={produto}
                            onChange={(e) => handleProdutoChange(e.target.value)}
                        />

<SelectTextFields
                            width={'150px'}
                            icon={<ScaleIcon fontSize="small" />}
                            label={'Unidade'}
                            backgroundColor={"#D9D9D9"}
                            name={"unidadeMedida"}
                            fontWeight={500}
                            options={userOptionsUnidade}
                            value={selectedUnidade} // Exibe a unidade selecionada
                            disabled // Desabilita o campo
                        />

                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Preço Bruto"
                            name="precoBruto"
                            value={precoBruto}
                            onChange={(e) => setPrecoBruto(e.target.value)}
                            autoComplete="off"
                            sx={{
                                width: { xs: '60%', sm: '50%', md: '40%', lg: '10%' },

                                '& .MuiInputLabel-root': {
                                    color: 'black', // Cor do texto do label
                                    fontWeight: 700
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'black', // Cor do label quando em foco
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'black', // Cor do ícone
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MoneySharp />
                                    </InputAdornment>
                                ),
                            }}

                            disabled // Desabilita o campo
                        />

                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label={`Quantidade Utilizada (${selectedUnidade || 'Unidade'})`} // Exibe a unidade selecionada
                            name="quantidade"
                            value={quantidade}
                            onChange={(e) => handleQuantidadeChange(e.target.value)} // 🔥 Chamada correta da função
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

                <div className={`mr-3 md:mr-11 w-[95%]  p-4 border border-gray-300 rounded-lg transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
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
                                {produtosAdicionados.length === 0 ? (
                                    <label className='text-sm'>Nenhum produto adicionado.</label>
                                ) : (
                                    produtosAdicionados.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center border-black py-2 w-full">
                                            <div style={{ border: '1px solid black', borderRadius: '10px' }} className='w-[100%] flex items-center p-1'>
                                                <label className='text-xs w-[95%] items-center flex gap-2'>
                                                    <FlatwareIcon />
                                                    <p className='w-[15%]'> {item.nome} </p>
                                                    <p style={{ backgroundColor: '#006b33', color: 'white', padding: '5px', borderRadius: '5px', fontWeight: '700' }}>{item.quantidade} {item.unidade} </p>
                                                    <p className='w-[13%]'> Preço Bruto:
                                                    </p>
                                                    <p style={{ width: '13%', backgroundColor: '#d9d9d9', color: 'black', fontWeight: '700', padding: '5px', borderRadius: '5px' }}>R$ {item.precoBruto}
                                                    </p>  Valor Utilizado:
                                                    <p style={{ width: '15%', backgroundColor: '#b0d847', color: 'black', fontWeight: '700', padding: '5px', borderRadius: '5px' }}>R$ {item.valorUtilizado}</p>
                                                </label>
                                                <ButtonClose
                                                    onClick={() => handleExcluirProduto(index)}
                                                >

                                                </ButtonClose>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className='w-[30%] p-2 flex flex-col gap-2' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                <div className='flex items-center w-full '>
                                    <label className='text-xs font-bold w-[60%]'>Custo Total: </label>
                                    <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#b0d847', borderRadius: '10px', marginLeft: '10px', paddingLeft: '10px' }}>R$ {custoTotal.toFixed(2)}</label>

                                </div>
                                <div className='flex items-center w-full '>
                                    <label className='text-xs font-bold w-[60%]'>Valor Venda: </label>
                                    <input
                                        type="text"
                                        value={`${valorVenda}`} // Supondo que você tenha um estado para valorVenda
                                        onChange={(e) => setValorVenda(e.target.value)} // Manipulador de mudança se necessário
                                        style={{ backgroundColor: "#FC6D26", color: 'black', borderRadius: '10px', fontSize: '12px', fontWeight: '700', marginLeft: '10px', paddingLeft: '10px', width: '40%', padding: '2px', border: '1px solid #ccc', outline: 'none' }} // Estilos básicos

                                    />
                                </div>
                                <div className='flex items-center w-full '>
                                    <label className='text-xs font-bold w-[60%]'>CMV Real: </label>
                                    <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#d9d9d9', borderRadius: '10px', marginLeft: '10px', paddingLeft: '10px' }}>R$ {custoTotal.toFixed(2)}</label>

                                </div>
                                <div className='flex items-center w-full '>
                                    <label className='text-xs font-bold w-[60%]'>Lucro Real: </label>
                                    <label className='text-xs font-bold w-[40%] p-1 pl- items-center justify-start' style={{ backgroundColor: '#0173E5', borderRadius: '10px', marginLeft: '10px', paddingLeft: '10px' }}>R$ {custoTotal.toFixed(2)}</label>

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
                    <TableComponent
                        headers={headerFichaTecnica}
                        rows={rows}
                        actionsLabel={"Ações"}
                        actionCalls={{}}
                    />
                </div >

            </div>
        </div>
    );
}

export default FichaTecnica;