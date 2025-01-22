import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbars/header';
import { AddCircleOutline, Edit, ProductionQuantityLimitsTwoTone, Save } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import ButtonComponent from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import TableComponent from '../../components/table';
import MenuMobile from '../../components/menu-mobile/index.js';
import { headerProdutos } from '../../entities/headers/header-produtos.js';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CentralModal from '../../components/modal-central/index.js';
import AddchartIcon from '@mui/icons-material/Addchart';
import TableLoading from '../../components/loading/loading-table/loading.js';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import ScaleIcon from '@mui/icons-material/Scale';
import ModalLateral from '../../components/modal-lateral/index.js';
import SelectTextFields from '../../../components/select' // Importando o componente SelectTextFields

const Produtos = () => {
    const [cadastroAdicionais, setCadastroAdicionais] = useState(false);
    const [filtro, setFiltro] = useState(false);
    const [editandoCategoria, setEditandoCategoria] = useState(false);
    const [loading, setLoading] = useState(false);
    const [produtoEditado, setProdutoEditado] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        quantidadeMinima: '',
        rendimento: '',
        categoria: '',
        unidadeMedida: ''
    });
    const [categorias, setCategorias] = useState([]);
    const [userOptionsUnidade, setUserOptionsUnidade] = useState([
        { value: 'kg', label: 'Kilograma' },
        { value: 'g', label: 'Grama' },
        { value: 'l', label: 'Litro' },
        { value: 'ml', label: 'Mililitro' },
        // Adicione mais opções conforme necessário
    ]);

    useEffect(() => {
        const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
        setProdutos(produtosSalvos);

        const categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];
        setCategorias(categoriasSalvas);
    }, []);

    const handleCadastroProdutos = () => setCadastroAdicionais(true);
    const handleCloseCadastroProdutos = () => setCadastroAdicionais(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoProduto({ ...novoProduto, [name]: value });
    };

    const handleCadastrarProduto = () => {
        const updatedProdutos = [...produtos, novoProduto];
        setProdutos(updatedProdutos);
        localStorage.setItem('produtos', JSON.stringify(updatedProdutos));
        setNovoProduto({ nome: '', quantidadeMinima: '', rendimento: '', categoria: '', unidadeMedida: '' });
        handleCloseCadastroProdutos();
    };

    const handleEditCategoria = (produto) => {
        setProdutoEditado(produto);
        setEditandoCategoria(true);
    };

    const handleSaveEdit = () => {
        const updatedProdutos = produtos.map(produto =>
            produto.nome === produtoEditado.nome ? produtoEditado : produto
        );
        setProdutos(updatedProdutos);
        localStorage.setItem('produtos', JSON.stringify(updatedProdutos));
        setEditandoCategoria(false);
        setProdutoEditado(null);
    };

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex flex-col gap-3 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='sm:items-center md:text-2xl font-bold text-black w-[99%] flex items-center gap-2 '>
                    <ProductionQuantityLimitsTwoTone /> Produtos
                </h1>
                <div className="mt-2 sm:mt-2 md:mt-9 flex flex-col w-full">
                    <div className='flex gap-2'>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Buscar Produto"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ProductionQuantityLimitsTwoTone />
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="off"
                            sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '40%' }, marginLeft: '10px' }}
                        />
                        <ButtonComponent
                            startIcon={<SearchIcon fontSize='small' />}
                            title={'Pesquisar'}
                            subtitle={'Pesquisar'}
                            buttonSize="large"
                        />
                        <ButtonComponent
                            startIcon={<AddCircleOutline fontSize='small' />}
                            title={'Cadastrar'}
                            subtitle={'Cadastrar'}
                            buttonSize="large"
                            onClick={handleCadastroProdutos}
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
                            <FilterAltIcon fontSize={"small"} />
                        </IconButton>
                    </div>

                    <div className="tamanho-tabela">
                        {loading ? (
                            <div className='flex items-center justify-center h-96'>
                                <TableLoading />
                            </div>
                        ) : (
                            <TableComponent
                                headers={headerProdutos}
                                rows={produtos}
                                actionsLabel={"Ações"}
                                actionCalls={{
                                    edit: handleEditCategoria,
                                    delete: handleDeleteCategoria,
                                }}
                            />
                        )}
                    </div>

                    <CentralModal
                        tamanhoTitulo={'82%'}
                        maxHeight={'90vh'}
                        top={'20%'}
                        left={'28%'}
                        width={'620px'}
                        icon={<AddCircleOutline fontSize="small" />}
                        open={cadastroAdicionais}
                        onClose={handleCloseCadastroProdutos}
                        title="Cadastrar Produtos"
                    >
                        <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                            <div className='mt-4 flex gap-3 flex-wrap'>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Nome do Produto"
                                    name="nome"
                                    value={novoProduto.nome}
                                    onChange={handleInputChange}
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '45%' }, marginLeft: '10px' }}
                                    autoComplete="off"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ArticleIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Quantidade Mínima"
                                    name="quantidadeMinima"
                                    value={novoProduto.quantidadeMinima}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '43%' }, marginLeft: '10px' }}
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
                                    label="Rendimento"
                                    name="rendimento"
                                    value={novoProduto.rendimento}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '45%' }, marginLeft: '10px' }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AddchartIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <SelectTextFields
                                    width={'260px'}
                                    icon={<CategoryIcon fontSize="small" />}
                                    label={'Categoria'}
                                    backgroundColor={"#D9D9D9"}
                                    name={"categoria"}
                                    fontWeight={500}
                                    options={categorias.map(categoria => ({ value: categoria.nome, label: categoria.nome }))}
                                    onChange={(value) => setNovoProduto({ ...novoProduto, categoria: value })}
                                />
                                <SelectTextFields
                                    width={'260px'}
                                    icon={<ScaleIcon fontSize="small" />}
                                    label={'Unidade'}
                                    backgroundColor={"#D9D9D9"}
                                    name={"unidadeMedida"}
                                    fontWeight={500}
                                    options={userOptionsUnidade}
                                    onChange={(value) => setNovoProduto({ ...novoProduto, unidadeMedida: value })}
                                />
                            </div>
                            <div className='w-[95%] mt-2 flex items-end justify-end'>
                                <ButtonComponent
                                    title={'Cadastrar'}
                                    subtitle={'Cadastrar'}
                                    startIcon={<Save />}
                                    onClick={handleCadastrarProduto}
                                />
                            </div>
                        </div>
                    </CentralModal>

                    <ModalLateral
                        open={editandoCategoria}
                        handleClose={() => setEditandoCategoria(false)}
                        tituloModal="Editar Produto"
                        icon={<Edit />}
                        tamanhoTitulo={'75%'}
                        conteudo={
                            <div className='flex gap-2 flex-wrap items-end justify-end w-full mt-2'>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Nome do Produto"
                                    name="nome"
                                    value={produtoEditado?.nome || ''}
                                    onChange={(e) => setProdutoEditado({ ...produtoEditado, nome: e.target.value })}
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '45%' }, marginLeft: '10px' }}
                                    autoComplete="off"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ArticleIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Quantidade Mínima"
                                    name="quantidadeMinima"
                                    value={produtoEditado?.quantidadeMinima || ''}
                                    onChange={(e) => setProdutoEditado({ ...produtoEditado, quantidadeMinima: e.target.value })}
                                    autoComplete="off"
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '43%' }, marginLeft: '10px' }}
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
                                    label="Rendimento"
                                    name="rendimento"
                                    value={produtoEditado?.rendimento || ''}
                                    onChange={(e) => setProdutoEditado({ ...produtoEditado, rendimento: e.target.value })}
                                    autoComplete="off"
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '45%' }, marginLeft: '10px' }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AddchartIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <SelectTextFields
                                    width={'260px'}
                                    icon={<CategoryIcon fontSize="small" />}
                                    label={'Categoria'}
                                    backgroundColor={"#D9D9D9"}
                                    name={"categoria"}
                                    fontWeight={500}
                                    options={categorias.map(categoria => ({ value: categoria.nome, label: categoria.nome }))}
                                    onChange={(value) => setProdutoEditado({ ...produtoEditado, categoria: value })}
                                />
                                <SelectTextFields
                                    width={'260px'}
                                    icon={<ScaleIcon fontSize="small" />}
                                    label={'Unidade'}
                                    backgroundColor={"#D9D9D9"}
                                    name={"unidadeMedida"}
                                    fontWeight={500}
                                    options={userOptionsUnidade}
                                    onChange={(value) => setProdutoEditado({ ...produtoEditado, unidadeMedida: value })}
                                />
                                <div className='w-[95%] mt-2 flex items-end justify-end'>
                                    <ButtonComponent
                                        title={'Salvar'}
                                        subtitle={'Salvar'}
                                        startIcon={<Save />}
                                        onClick={handleSaveEdit}
                                    />
                                </div>
                            </div>
                        } />
                </div>
            </div>
        </div>
    );
}

export default Produtos;