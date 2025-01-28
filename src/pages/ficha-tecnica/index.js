import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header';
import MenuMobile from '../../components/menu-mobile';
import HeaderPerfil from '../../components/navbars/perfil';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { InputAdornment, TextField, Button } from '@mui/material';
import { AddCircleOutline, Save } from '@mui/icons-material';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import SelectTextFields from '../../components/select';
import ArticleIcon from '@mui/icons-material/Article';
import ScaleIcon from '@mui/icons-material/Scale';
import ButtonComponent from '../../components/button';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TableComponent from '../../components/table';
import { headerFichaTecnica } from '../../entities/headers/header-ficha-tecnica';
import '../cadastro/unidades/unidades.css'

const FichaTecnica = () => {
    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [selectedUnidade, setSelectedUnidade] = useState('');
    const [produtosAdicionados, setProdutosAdicionados] = useState([]);
    const [nomePrato, setNomePrato] = useState('');


    const handleProdutoChange = (value) => {
        const produtoSelecionado = produtos.find(prod => prod.nome === value);
        setProduto(value);
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
    ];

    const handleUnidadeChange = (event) => {
        setSelectedUnidade(event.target.value);
    };

    const handleAdicionarProduto = () => {
        if (produto && quantidade && selectedUnidade) {
            const novoProduto = {
                nome: produto,
                quantidade,
                unidade: selectedUnidade,
            };
            setProdutosAdicionados([...produtosAdicionados, novoProduto]);
            setProduto('');
            setQuantidade('');
            setSelectedUnidade('');
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
                    className="p-7 w-full"

                >
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
                            width={'280px'}
                            icon={<ScaleIcon fontSize="small" />}
                            label={'Unidade'}
                            backgroundColor={"#D9D9D9"}
                            name={"unidadeMedida"}
                            fontWeight={500}
                            options={userOptionsUnidade}
                            onChange={handleUnidadeChange}
                            value={selectedUnidade}
                        />

                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Quantidade"
                            name="quantidade"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            autoComplete="off"
                            sx={{ width: { xs: '60%', sm: '50%', md: '40%', lg: '10%' } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ScaleIcon />
                                    </InputAdornment>
                                ),
                            }}
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

                <div className="mr-3 md:mr-11 w-[95%]  p-4 border border-gray-300 rounded-lg">
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
                    <h2 className="font-bold text-sm mt-2">Produtos Adicionados:</h2>
                    {produtosAdicionados.length === 0 ? (
                        <label className='text-sm'>Nenhum produto adicionado.</label>
                    ) : (
                        produtosAdicionados.map((item, index) => (
                            <div key={index} className="flex justify-between items-center border-black py-2 w-full">
                                <div style={{ border: '1px solid black', borderRadius: '10px' }} className='w-[100%] flex items-center p-3' >
                                    <label className='text-sm w-[95%]'>{item.nome} - {item.quantidade} {item.unidade}</label>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<HighlightOffIcon />}
                                        onClick={() => handleExcluirProduto(index)}
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                    <div className='w-full flex items-end justify-end'>
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
                <div className="mr-3 sm: md:mr-11 flex flex-wrap w-[95%]  p-4 gap-3">
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