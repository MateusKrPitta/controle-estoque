import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbars/header/index.js';
import { AddCircleOutline, DateRange, Edit, ProductionQuantityLimitsTwoTone, Save } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import ButtonComponent from '../../../components/button/index.js';
import SearchIcon from '@mui/icons-material/Search';
import TableComponent from '../../../components/table/index.js';
import MenuMobile from '../../../components/menu-mobile/index.js';
import { headerProdutos } from '../../../entities/headers/header-produtos.js';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CentralModal from '../../../components/modal-central/index.js';
import AddchartIcon from '@mui/icons-material/Addchart';
import TableLoading from '../../../components/loading/loading-table/loading.js';
import HeaderPerfil from '../../../components/navbars/perfil/index.js';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import ScaleIcon from '@mui/icons-material/Scale';
import ModalLateral from '../../../components/modal-lateral/index.js';
import SelectTextFields from '../../../components/select/index.js';
import { NumericFormat } from 'react-number-format';
import { formatPrecoPorcao, formatValor } from '../../../utils/functions.js';
import CustomToast from '../../../components/toast/index.js';
import { MoneyOutlined } from '@mui/icons-material';
import Caixa from '../../../assets/icones/caixa.png';
import HeaderCadastro from '../../../components/navbars/cadastro/index.js';
import api from '../../../services/api.js';
import { useUnidade } from '../../../components/unidade-context/index.js';

const Produtos = () => {
    const { unidadeId } = useUnidade();
    const [cadastroAdicionais, setCadastroAdicionais] = useState(false);
    const [filtro, setFiltro] = useState(false);
    const [editandoCategoria, setEditandoCategoria] = useState(false);
    const [quantidadeTotal, setQuantidadeTotal] = useState('');
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [qtdMin, setQtdMin] = useState('');
    const [rendimento, setRendimento] = useState('');
    const [produtoEditado, setProdutoEditado] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [selectedUnidade, setSelectedUnidade] = useState("");
    const [uniqueCategoriesCount, setUniqueCategoriesCount] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [preco, setPreco] = useState('');
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroDataInicial, setFiltroDataInicial] = useState('');
    const [filtroDataFinal, setFiltroDataFinal] = useState('');

    const userOptionsUnidade = [
        { value: 1, label: 'Kilograma' },
        { value: 2, label: 'Grama' },
        { value: 3, label: 'Litro' },
        { value: 4, label: 'Mililitro' },
        { value: 5, label: 'Unidade' },
    ];
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    // Fetch products from the API


    const handleUnidadeChange = (event) => {
        setSelectedUnidade(event.target.value);
    };

    const handleCadastroProdutos = () => setCadastroAdicionais(true);
    const handleCloseCadastroProdutos = () => setCadastroAdicionais(false);

    const handleFiltro = () => setFiltro(true);
    const handleCloseFiltro = () => setFiltro(false);

    const handleCadastrarProduto = async () => {
        const quantidadeNumerica = parseFloat(quantidadeTotal) || 0;
        const precoNumerico = preco ? parseFloat(preco.replace(",", ".").replace("R$ ", "")) : 0;
        const rendimentoNumerico = parseFloat(rendimento) || 0;
        const qtdMinNumerica = parseFloat(qtdMin) || 0; // Converte qtdMin para número

        const precoPorcao = rendimentoNumerico > 0 ? precoNumerico / rendimentoNumerico : 0;

        const novoProduto = {
            nome,
            qtdMin: qtdMinNumerica, // Envia qtdMin como número
            quantidade: quantidadeNumerica,
            rendimento: rendimentoNumerico,
            valor: precoNumerico,
            unidadeMedida: selectedUnidade,
            unidadeId,
            categoriaId: selectedCategoria,
        };

        try {
            const response = await api.post('/produto', novoProduto);
            console.log('Produto cadastrado com sucesso:', response.data);

            setProdutos(prevProdutos => [
                ...prevProdutos,
                {
                    ...novoProduto,
                    id: response.data.id,
                    precoPorcao,
                    precoPorcaoFormatado: formatPrecoPorcao(precoPorcao),
                    dataCriacao: new Date().toLocaleDateString('pt-BR'),
                    precoFormatado: formatValor(precoNumerico),
                }
            ]);

            handleCloseCadastroProdutos();
            CustomToast({ type: "success", message: "Produto cadastrado com sucesso!" });
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);

            if (error.response && error.response.data) {
                CustomToast({ type: "error", message: `Erro: ${error.response.data.message || 'Erro ao cadastrar produto!'}` });
            } else {
                CustomToast({ type: "error", message: "Erro ao cadastrar produto!" });
            }
        }
    };

    const carregaProdutos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/produto');
            if (Array.isArray(response.data.data)) {
                const mappedProdutos = response.data.data.map(produto => {
                    const categoria = categorias.find(cat => cat.id === parseInt(produto.categoriaId, 10));
                    const unidade = userOptionsUnidade.find(unit => unit.value === parseInt(produto.unidadeMedida));
                
                    return {
                        id: produto.id,
                        nome: produto.nome,
                        rendimento: produto.rendimento,
                        unidadeMedida: unidade ? unidade.label : 'N/A',
                        categoriaNome: categoria ? categoria.nome : 'N/A', // Aqui está o problema
                        valorPorcao: formatValor(produto.valorPorcao),
                        valor: formatValor(produto.valor),
                        createdAt: new Date(produto.createdAt).toLocaleDateString('pt-BR'),
                    };
                });
                
                setProdutos(mappedProdutos);
                console.log(mappedProdutos); // Verifique se os produtos estão sendo mapeados corretamente
            } else {
                console.error("A resposta da API não é um array:", response.data.data);
                setProdutos([]);
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            CustomToast({ type: "error", message: "Erro ao carregar produtos!" });
        } finally {
            setLoading(false);
        }
    };

    const handlePesquisar = () => {
        const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];

        const produtosFiltrados = produtosSalvos.filter(produto => {
            const nomeMatch = produto.nome.toLowerCase().includes(filtroNome.toLowerCase());
            const dataMatch = (!filtroDataInicial || new Date(produto.dataCriacao) >= new Date(filtroDataInicial)) &&
                (!filtroDataFinal || new Date(produto.dataCriacao) <= new Date(filtroDataFinal));
            const categoriaMatch = !selectedCategoria || produto.categoria === categorias.find(cat => cat.id === selectedCategoria)?.nome;

            return nomeMatch && dataMatch && categoriaMatch;
        });

        setProdutos(produtosFiltrados);
        handleCloseFiltro();
        CustomToast({ type: "success", message: "Resultados filtrados com sucesso!" });
    };

    const handleSaveEdit = () => {
        const novosProdutos = produtos.map((produto) =>
            produto.id === produtoEditado.id
                ? {
                    ...produtoEditado,
                    // Certifique-se de usar as chaves corretas
                    categoriaId: produtoEditado.categoriaId,
                    unidadeId: produtoEditado.unidadeId,
                    // Adicione outros campos que você precisa atualizar
                }
                : produto
        );

        setProdutos(novosProdutos);
        setEditandoCategoria(false);
        CustomToast({ type: "success", message: "Produto editado com sucesso!" });
    };

    const handleDeleteProduto = async (produtoId) => {
        try {
            // Chama a API para deletar o produto
            await api.delete(`/produto/${produtoId}`);

            // Atualiza o estado local para remover o produto deletado
            const produtosAtualizados = produtos.filter((produto) => produto.id !== produtoId);
            setProdutos(produtosAtualizados);

            CustomToast({ type: "success", message: "Produto deletado com sucesso!" });
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            CustomToast({ type: "error", message: "Erro ao deletar produto!" });
        }
    };

    const carregaCategorias = async () => {
        try {
            const response = await api.get('/categoria');
            console.log('Categorias recebidas:', response.data);

            if (Array.isArray(response.data.data)) {
                setCategorias(response.data.data);
            } else {
                console.error('A resposta não contém um array de categorias:', response.data);
                CustomToast({ type: "error", message: "Erro ao carregar categorias!" });
            }
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            CustomToast({ type: "error", message: "Erro ao carregar categorias!" });
        }
    };

    const quantidadeProdutosCadastrados = produtos.length;

    useEffect(() => {
        carregaProdutos(); // Fetch products when the component mounts
        carregaCategorias(); // Fetch categories when the component mounts
    }, []);

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start   '>
                    <ProductionQuantityLimitsTwoTone /> Produtos
                </h1>
                <div className={` items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                    <div className="hidden md:w-[14%] md:flex ">
                        <HeaderCadastro />
                    </div>
                    <div className="w-[100%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col md:w-[80%]">
                        <div className={`w-[99%] justify-center flex-wrap mt-4 mb-4 flex items-center gap-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                            <div className='w-[80%] md:w-[20%] p-2  bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
                                <label className='text-xs font-bold'>Produtos Cadastrados</label>
                                <div className='flex items-center justify-center gap-5'>
                                    <img src={Caixa} alt="Caixa" />
                                    <label>{quantidadeProdutosCadastrados}</label>
                                </div>
                            </div>
                        </div>
                        <div className={`ml-0 flex flex-col w-[98%] md:ml-2 mr-3 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                            <div className='flex gap-2 justify-center  flex-wrap md:justify-start items-center md:items-start'>
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
                                    sx={{ width: { xs: '95%', sm: '50%', md: '40%', lg: '30%' } }}
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
                                                setProdutoEditado(produto);
                                                setEditandoCategoria(true);
                                            },
                                            delete: (produto) => handleDeleteProduto(produto.id), // Chama a função de deletar
                                        }}
                                    />
                                )}
                            </div>

                            <CentralModal
                                tamanhoTitulo={'81%'}
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
                                            sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '40%' } }}
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
                                            type='number'
                                            label="Quantidade Mínima"
                                            name="quantidadeMinima"
                                            value={qtdMin}
                                            onChange={(e) => setQtdMin(e.target.value)}
                                            autoComplete="off"
                                            sx={{ width: { xs: '45%', sm: '50%', md: '40%', lg: '23%' } }}
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
                                            sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '27%' } }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AddchartIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        <NumericFormat
                                            customInput={TextField}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Preço"
                                            sx={{ width: { xs: '45%', sm: '50%', md: '40%', lg: '25%' }, }}
                                            value={preco}
                                            onValueChange={(values) => setPreco(values.value)}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="R$ "
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MoneyOutlined />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <SelectTextFields
                                            width={'150px'}
                                            icon={<CategoryIcon fontSize="small" />}
                                            label={'Categoria'}
                                            backgroundColor={"#D9D9D9"}
                                            name={"categoria"}
                                            fontWeight={500}
                                            options={Array.isArray(categorias) ? categorias.map(categoria => ({ label: categoria.nome, value: categoria.id })) : []}
                                            onChange={(e) => setSelectedCategoria(e.target.value)}
                                            value={selectedCategoria}
                                        />

                                        <SelectTextFields
                                            width={'140px'}
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
                                            value={produtoEditado?.nome || ''} // Use optional chaining
                                            onChange={(e) => setProdutoEditado({ ...produtoEditado, nome: e.target.value })}
                                            sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '50%' } }}
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
                                            value={produtoEditado?.qtdMin || ''} // Certifique-se de que isso corresponde à chave nos dados do produto
                                            onChange={(e) => setProdutoEditado({ ...produtoEditado, qtdMin: e.target.value })} // Certifique-se de que você está atualizando o campo correto
                                            sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '47%' } }}
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
                                            value={produtoEditado?.rendimento || ''} // Use optional chaining
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
                                            value={produtoEditado?.categoriaId || ''} // Use optional chaining
                                            onChange={(e) =>
                                                setProdutoEditado({
                                                    ...produtoEditado,
                                                    categoriaId: e.target.value // Ensure you're updating the correct field
                                                })
                                            }
                                        />
                                        <SelectTextFields
                                            width="300px"
                                            icon={<ScaleIcon fontSize="small" />}
                                            label="Unidade Medida"
                                            backgroundColor="#D9D9D9"
                                            name="unidadeMedida"
                                            fontWeight={500}
                                            options={userOptionsUnidade} // Certifique-se de que isso é a lista correta de opções
                                            value={produtoEditado?.unidadeMedida || ''} // Use optional chaining para evitar erros
                                            onChange={(e) => setProdutoEditado({ ...produtoEditado, unidadeMedida: e.target.value })}
                                        />
                                        <NumericFormat
                                            customInput={TextField}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Preço"
                                            sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '48%' }, }}
                                            value={produtoEditado?.valor || ''} // Use optional chaining
                                            onValueChange={(values) => setProdutoEditado({ ...produtoEditado, valor: values.value })}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="R$ "
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MoneyOutlined />
                                                    </InputAdornment>
                                                ),
                                            }}
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
                                tamanhoTitulo={'81%'}
                                maxHeight={'90vh'}
                                top={'20%'}
                                left={'28%'}
                                width={'400px'}
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
                                            value={filtroNome}
                                            onChange={(e) => setFiltroNome(e.target.value)}
                                            sx={{ width: { xs: '95%', sm: '50%', md: '40%', lg: '95%' } }}
                                            autoComplete="off"
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
                                            label="Data Inicial"
                                            value={filtroDataInicial}
                                            type='date'
                                            onChange={(e) => setFiltroDataInicial(e.target.value)}
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
                                            value={filtroDataFinal}
                                            onChange={(e) => setFiltroDataFinal(e.target.value)}
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
                                            onChange={(e) => setSelectedCategoria(e.target.value)}
                                            value={selectedCategoria}
                                        />
                                    </div>
                                    <div className='w-[95%] mt-2 flex items-end justify-end'>
                                        <ButtonComponent
                                            title={'Pesquisar'}
                                            subtitle={'Pesquisar'}
                                            startIcon={<SearchIcon />}
                                            onClick={handlePesquisar}
                                        />
                                    </div>
                                </div>
                            </CentralModal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Produtos;