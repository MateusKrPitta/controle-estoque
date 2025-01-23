import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbars/header';
import { AddCircleOutline, DateRange, Edit, ProductionQuantityLimitsTwoTone, Save } from '@mui/icons-material';
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
import SelectTextFields from '../../components/select/index.js';
import CustomToast from '../../components/toast/index.js';

const Produtos = () => {
    const [cadastroAdicionais, setCadastroAdicionais] = useState(false);
    const [filtro, setFiltro] = useState(false);
    const [editandoCategoria, setEditandoCategoria] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [nome, setNome] = useState('');
    const [quantidadeMinima, setQuantidadeMinima] = useState('');
    const [rendimento, setRendimento] = useState('');
    const [produtoEditado, setProdutoEditado] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [unidade, setUnidade] = useState('');
    const [selectedUnidade, setSelectedUnidade] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');

    const userOptionsUnidade = [
        { value: 'kg', label: 'Kilograma' },
        { value: 'g', label: 'Grama' },
        { value: 'l', label: 'Litro' },
        { value: 'ml', label: 'Mililitro' },
        // Adicione mais opções conforme necessário
    ];

    const handleUnidadeChange = (event) => {
        setSelectedUnidade(event.target.value);
    };

    const handleCadastroProdutos = () => setCadastroAdicionais(true);
    const handleCloseCadastroProdutos = () => setCadastroAdicionais(false);

    const handleFiltro = () => setFiltro(true);
    const handleCloseFiltro = () => setFiltro(false);

    const handleCadastrarProduto = () => {
        const novosProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
        const novoProduto = {
            id: Date.now(), // Cria um ID único baseado no timestamp atual
            nome,
            quantidadeMinima,
            rendimento,
            categoria: categorias.find(cat => cat.id === selectedCategoria)?.nome || "Não informado", // Salva o nome da categoria
            unidade: selectedUnidade,
            dataCriacao: new Date().toISOString(), // Adiciona a data de criação no formato ISO
        };
    
        novosProdutos.push(novoProduto);
        localStorage.setItem('produtos', JSON.stringify(novosProdutos));
        setProdutos(novosProdutos); // Atualiza o estado da tabela
        handleCloseCadastroProdutos(); // Fecha o modal
        setNome('');
        setQuantidadeMinima('');
        setRendimento('');
        setSelectedCategoria('');
        setSelectedUnidade('');
        CustomToast({ type: "success", message: "Produto cadastrado com sucesso!" });
    };
    
    const handleSaveEdit = () => {
        const novosProdutos = produtos.map((produto) =>
            produto.id === produtoEditado.id
                ? {
                    ...produtoEditado,
                    categoria: categorias.find(cat => cat.id === produtoEditado.categoria)?.nome || "Não informado", // Salva o nome da categoria
                }
                : produto
        );
    
        localStorage.setItem('produtos', JSON.stringify(novosProdutos));
        setProdutos(novosProdutos); // Atualiza o estado
        setEditandoCategoria(false); // Fecha o modal
        CustomToast({ type: "success", message: "Produto editado com sucesso!" });
    };
    const handleDeleteProduto = (produtoId) => {
        const produtosAtualizados = produtos.filter((produto) => produto.id !== produtoId); // Remove o produto pelo ID
        localStorage.setItem('produtos', JSON.stringify(produtosAtualizados)); // Atualiza o localStorage
        setProdutos(produtosAtualizados); // Atualiza o estado da tabela
        CustomToast({ type: "success", message: "Produto deletado com sucesso!" });
    };
    

    useEffect(() => {
        const categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];
        setCategorias(categoriasSalvas);
    }, []);

    useEffect(() => {
        const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
        setProdutos(produtosSalvos);
    }, []);


    const handleCategoriaChange = (value) => {
        setSelectedCategoria(value);
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
                                    edit: (produto) => {
                                        setProdutoEditado(produto); // Define o produto selecionado para edição
                                        setEditandoCategoria(true); // Abre o modal de edição
                                    },
                                    delete: (produto) => handleDeleteProduto(produto.id),
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
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '50%' } }}
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
                                    value={quantidadeMinima}
                                    onChange={(e) => setQuantidadeMinima(e.target.value)}
                                    autoComplete="off"
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '43%' } }}
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
                                    value={rendimento}
                                    onChange={(e) => setRendimento(e.target.value)}
                                    autoComplete="off"
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '50%' } }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AddchartIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <SelectTextFields
                                    width={'245px'}
                                    icon={<CategoryIcon fontSize="small" />}
                                    label={'Categoria'}
                                    backgroundColor={"#D9D9D9"}
                                    name={"categoria"}
                                    fontWeight={500}
                                    options={categorias.map(categoria => ({ label: categoria.nome, value: categoria.id }))}
                                    onChange={(e) => setSelectedCategoria(e.target.value)} // Atualiza o estado
                                    value={selectedCategoria} // Reflete o estado atual no componente
                                />

                                <SelectTextFields
                                    width={'260px'}
                                    icon={<ScaleIcon fontSize="small" />}
                                    label={'Unidade'}
                                    backgroundColor={"#D9D9D9"}
                                    name={"unidadeMedida"}
                                    fontWeight={500}
                                    options={userOptionsUnidade}
                                    onChange={handleUnidadeChange}
                                    value={selectedUnidade}
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
                        tamanhoTitulo="75%"
                        conteudo={
                            <div className="flex gap-2 flex-wrap items-end justify-end w-full mt-2">
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Nome do Produto"
                                    name="nome"
                                    value={produtoEditado?.nome || ''}
                                    onChange={(e) => setProdutoEditado({ ...produtoEditado, nome: e.target.value })}
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '50%' }}}
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
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '47%' }}}
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
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '50%' }, }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AddchartIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <SelectTextFields
                                    width="144px"
                                    icon={<CategoryIcon fontSize="small" />}
                                    label="Categoria"
                                    backgroundColor="#D9D9D9"
                                    name="categoria"
                                    fontWeight={500}
                                    options={categorias.map((categoria) => ({ label: categoria.nome, value: categoria.id }))}
                                    value={produtoEditado?.categoria || ''}
                                    onChange={(e) =>
                                        setProdutoEditado({
                                            ...produtoEditado,
                                            categoria: e.target.value // Salva o ID da categoria selecionada
                                        })
                                    }
                                />
                                <SelectTextFields
                                    width="300px"
                                    icon={<ScaleIcon fontSize="small" />}
                                    label="Unidade"
                                    backgroundColor="#D9D9D9"
                                    name="unidadeMedida"
                                    fontWeight={500}
                                    options={userOptionsUnidade}
                                    value={produtoEditado?.unidade || ''}
                                    onChange={(e) => setProdutoEditado({ ...produtoEditado, unidade: e.target.value })}
                                />
                                <div className="w-[95%] mt-2 flex items-end justify-end">
                                    <ButtonComponent
                                        title="Salvar"
                                        subtitle="Salvar"
                                        startIcon={<Save />}
                                        onClick={handleSaveEdit}
                                    />
                                </div>
                            </div>
                        }
                    />

                    <CentralModal
                        tamanhoTitulo={'82%'}
                        maxHeight={'90vh'}
                        top={'20%'}
                        left={'28%'}
                        width={'620px'}
                        icon={<FilterAltIcon fontSize="small" />}
                        open={filtro}
                        onClose={handleCloseFiltro}
                        title="Filtro"
                    >
                        <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                            <div className='mt-4 flex gap-3 flex-wrap'>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Nome do Produto"
                                    name="nome"
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '50%' }}}
                                    autoComplete="off"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DateRange />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <SelectTextFields
                                    width={'250px'}
                                    icon={<CategoryIcon fontSize="small" />}
                                    label={'Categoria'}
                                    backgroundColor={"#D9D9D9"}
                                    name={"categoria"}
                                    fontWeight={500}

                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Data Inicial"
                                    value={dataInicial}
                                    type='date'
                                    // onChange={handleInputChange}
                                    autoComplete="off"
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '50%' } }}
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
                                    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '43%' }}}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DateRange />
                                            </InputAdornment>
                                        ),
                                    }}
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
            </div>
        </div>
    );
}

export default Produtos;