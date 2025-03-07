import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbars/header/index.js';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CentralModal from '../../../components/modal-central/index.js';
import TableLoading from '../../../components/loading/loading-table/loading.js';
import HeaderPerfil from '../../../components/navbars/perfil/index.js';
import ModalLateral from '../../../components/modal-lateral/index.js';
import SelectTextFields from '../../../components/select/index.js';
import { NumericFormat } from 'react-number-format';
import { formatValor } from '../../../utils/functions.js';
import CustomToast from '../../../components/toast/index.js';
import Caixa from '../../../assets/icones/caixa.png';
import HeaderCadastro from '../../../components/navbars/cadastro/index.js';
import api from '../../../services/api.js';
import { useUnidade } from '../../../components/unidade-context/index.js';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../../components/button/index.js';
import SearchIcon from '@mui/icons-material/Search';
import TableComponent from '../../../components/table/index.js';
import MenuMobile from '../../../components/menu-mobile/index.js';
import { headerProdutos } from '../../../entities/headers/header-produtos.js';
import moment from 'moment';
import { AddCircleOutline, DateRange, Edit, ProductionQuantityLimitsTwoTone, Save } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, } from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import ScaleIcon from '@mui/icons-material/Scale';
import { MoneyOutlined } from '@mui/icons-material';




const Produtos = () => {
    const navigate = useNavigate();
    const { unidadeId } = useUnidade();

    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [produtosOriginais, setProdutosOriginais] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cadastroAdicionais, setCadastroAdicionais] = useState(false);
    const [filtro, setFiltro] = useState(false);
    const [editandoCategoria, setEditandoCategoria] = useState(false);
    const [loading, setLoading] = useState(false);
    const [produtoEditado, setProdutoEditado] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const [quantidadeTotal, setQuantidadeTotal] = useState('');
    const [nome, setNome] = useState('');
    const [qtdMin, setQtdMin] = useState('');
    const [rendimento, setRendimento] = useState('');
    const [selectedUnidade, setSelectedUnidade] = useState("");
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [preco, setPreco] = useState('');
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroDataInicial, setFiltroDataInicial] = useState('');
    const [filtroDataFinal, setFiltroDataFinal] = useState('');
    const [valorReajuste, setValorReajuste] = useState('');
    const [dataReajuste, setDataReajuste] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');
    const quantidadeProdutosCadastrados = produtos.length;
    const userOptionsUnidade = [
        { value: 1, label: 'Kilograma' },
        { value: 2, label: 'Grama' },
        { value: 3, label: 'Litro' },
        { value: 4, label: 'Mililitro' },
        { value: 5, label: 'Unidade' },
    ];


    const clearCadastroFields = () => {
        setNome('');
        setQtdMin('');
        setRendimento('');
        setPreco('');
        setSelectedUnidade('');
        setSelectedCategoria('');
    };


    const clearEditFields = () => {
        setNome('');
        setQtdMin('');
        setRendimento('');
        setPreco('');
        setValorReajuste('');
        setDataReajuste('');
        setSelectedUnidade('');
        setSelectedCategoria('');
    };

    const handleUnidadeChange = (event) => {
        setSelectedUnidade(event.target.value);
    };

    const handleCadastroProdutos = () => setCadastroAdicionais(true);
    const handleCloseCadastroProdutos = () => {
        setCadastroAdicionais(false);
        clearCadastroFields();
    };


    const handleCloseFiltro = () => setFiltro(false);

    const handleCadastrarProduto = async () => {
        setIsSubmitting(true); // Desabilita o botão

        const quantidadeNumerica = parseFloat(quantidadeTotal) || 0;
        const precoNumerico = preco ? parseFloat(preco.replace(",", ".").replace("R$ ", "")) : 0;
        const rendimentoNumerico = parseFloat(rendimento) || 0;
        const qtdMinNumerica = parseFloat(qtdMin) || 0;
        const novoProduto = {
            nome,
            qtdMin: qtdMinNumerica,
            quantidade: quantidadeNumerica,
            rendimento: rendimentoNumerico,
            valor: precoNumerico,
            unidadeMedida: selectedUnidade,
            unidadeId,
            categoriaId: selectedCategoria,
        };

        try {
            const response = await api.post('/produto', novoProduto);
            await carregaProdutos(unidadeId);
            handleCloseCadastroProdutos();
            CustomToast({ type: "success", message: "Produto cadastrado com sucesso!" });
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao cadastrar produto!" });
        } finally {
            setIsSubmitting(false); // Reabilita o botão
        }
    };


    const carregaProdutos = async (unidadeId) => {
        setLoading(true);
        try {
            const response = await api.get(`/produto?unidadeId=${unidadeId}`);
            if (Array.isArray(response.data.data)) {
                const produtosFiltrados = response.data.data.filter(produto => produto.unidadeId === unidadeId);
                const mappedProdutos = produtosFiltrados.map(produto => {
                    const unidade = userOptionsUnidade.find(unit => unit.value === parseInt(produto.unidadeMedida));
                    const valorFormatado = formatValor(produto.valorReajuste || produto.valor);

                    return {
                        id: produto.id,
                        nome: produto.nome,
                        rendimento: produto.rendimento,
                        unidadeMedida: unidade ? unidade.label : 'N/A',
                        categoria: produto.categoriaNome,
                        valorPorcao: formatValor(produto.valorPorcao),
                        valor: formatValor(produto.valorReajuste || produto.valor),
                        valorFormatado: valorFormatado,
                        qtdMin: produto.qtdMin,
                        categoriaId: produto.categoriaId,
                        createdAt: new Date(produto.createdAt).toLocaleDateString('pt-BR'),
                        categoriaNome: produto.categoriaNome
                    };
                });
                setProdutos(mappedProdutos);
                setProdutosOriginais(mappedProdutos);
            } else {
                setProdutos([]);
                setProdutosOriginais([]);
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);

        } finally {
            setLoading(false);
        }
    };

    const handlePesquisar = () => {
        console.log("Produtos antes do filtro:", produtos); // Log dos produtos antes do filtro
    
        const produtosFiltrados = produtosOriginais.filter(produto => {
            // Filtro por nome
            const nomeMatch = produto.nome.toLowerCase().includes(filtroNome.toLowerCase());
    
            // Filtro por categoria
            const categoriaMatch = !selectedCategoria || produto.categoriaId === selectedCategoria;
    
            // Formata as datas
            const dataProduto = moment(produto.createdAt, "DD/MM/YYYY"); // A data do produto
            const dataInicial = filtroDataInicial ? moment(filtroDataInicial) : null;
            const dataFinal = filtroDataFinal ? moment(filtroDataFinal).endOf('day') : null;
    
            // Verifica se a data do produto está dentro do intervalo
            const dataInicialMatch = !dataInicial || dataProduto.isSameOrAfter(dataInicial);
            const dataFinalMatch = !dataFinal || dataProduto.isSameOrBefore(dataFinal);
    
            // Retorna true se todos os filtros forem atendidos
            return nomeMatch && categoriaMatch && dataInicialMatch && dataFinalMatch;
        });
    
        console.log("Produtos filtrados:", produtosFiltrados); // Log dos produtos após o filtro
        setProdutosFiltrados(produtosFiltrados);
        handleCloseFiltro();
    
        // Mensagem de erro se nenhum produto for encontrado
        if (produtosFiltrados.length === 0) {
            setMensagemErro('Nenhum produto encontrado com os critérios de pesquisa.');
            CustomToast({ type: "error", message: "Nenhum produto encontrado com os critérios de pesquisa." });
        } else {
            setMensagemErro('');
            CustomToast({ type: "success", message: "Resultados filtrados com sucesso!" });
        }
    };
    const handleDeleteProduto = async (produtoId) => {
        try {

            await api.delete(`/produto/${produtoId}`);


            const produtosAtualizados = produtos.filter((produto) => produto.id !== produtoId);
            setProdutos(produtosAtualizados);

            CustomToast({ type: "success", message: "Produto deletado com sucesso!" });
            carregaProdutos();
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao deletar produto!" });
        }
    };

    const handleEditProduto = (produto) => {
        setProdutoEditado(produto);
        setNome(produto.nome);
        setQtdMin(produto.qtdMin);
        setRendimento(produto.rendimento);


        setPreco(produto.valorFormatado);

        const unidadeSelecionada = userOptionsUnidade.find(unit => unit.label === produto.unidadeMedida);
        setSelectedUnidade(unidadeSelecionada ? unidadeSelecionada.value : "");
        setSelectedCategoria(produto.categoriaId);
        setEditandoCategoria(true);
    };

    const handleSalvarProduto = async () => {
        if (!preco || typeof preco !== 'string') {
            CustomToast({ type: "error", message: "Preço inválido!" });
            return;
        }

        let precoNumerico = parseFloat(preco.replace("R$ ", "").replace(/\./g, "").replace(",", "."));
        if (isNaN(precoNumerico)) {
            precoNumerico = 0;
        }

        const dataReajusteFormatada = dataReajuste ? new Date(dataReajuste).toISOString().split('T')[0] : '';

        if (!dataReajusteFormatada) {
            CustomToast({ type: "error", message: "Data de reajuste é inválida!" });
            return;
        }

        let valorReajusteNumerico = 0;
        if (valorReajuste) {
            valorReajusteNumerico = parseFloat(valorReajuste.replace("R$ ", "").replace(/\./g, "").replace(",", "."));
            if (isNaN(valorReajusteNumerico)) {
                valorReajusteNumerico = 0;
            }
        }

        const produtoAtualizado = {
            nome,
            qtdMin: parseFloat(qtdMin) || 0,
            quantidade: parseFloat(quantidadeTotal) || 0,
            rendimento: parseFloat(rendimento) || 0,
            valor: precoNumerico,
            dataReajuste: dataReajusteFormatada,
            valorReajuste: valorReajusteNumerico,
            unidadeMedida: selectedUnidade,
            unidadeId,
            categoriaId: selectedCategoria,
        };

        try {
            const response = await api.put(`/produto/${produtoEditado.id}`, produtoAtualizado);
            await carregaProdutos(unidadeId);
            setEditandoCategoria(false);
            clearEditFields();
            CustomToast({ type: "success", message: "Produto atualizado com sucesso!" });
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao atualizar produto!" });
        }
    };

    const carregaCategorias = async (unidadeId) => {
        if (!unidadeId) {
            console.error('unidadeId não está definido');
            return;
        }

        try {
            const response = await api.get(`/categoria?unidadeId=${unidadeId}`);
            if (Array.isArray(response.data.data)) {
                const categoriasFiltradas = response.data.data.filter(categoria => categoria.unidadeId === unidadeId);
                setCategorias(categoriasFiltradas);
            } else {
                CustomToast({ type: "error", message: "Erro ao carregar categorias!" });
            }
        } catch (error) {
            CustomToast({ type: "error", message: "Erro ao carregar categorias!" });
        }
    };

    useEffect(() => {
        if (unidadeId) {
            carregaProdutos(unidadeId);
        }
    }, [unidadeId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
        const produtosFiltrados = produtosOriginais.filter(produto =>
            produto.nome.toLowerCase().includes(filtroNome.toLowerCase())
        );
        setProdutosFiltrados(produtosFiltrados);
    }, [filtroNome, produtosOriginais]);

    useEffect(() => {
        const carregarDados = async () => {
            if (unidadeId) {
                await carregaCategorias(unidadeId);
                await carregaProdutos(unidadeId);
            }
        };
        carregarDados();
    }, [unidadeId]);



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
                                    sx={{ width: { xs: '90%', sm: '50%', md: '40%', lg: '40%' }, }}
                                    value={filtroNome} // Vincula o valor ao estado
                                    onChange={(e) => setFiltroNome(e.target.value)} // Atualiza o estado ao digitar
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ProductionQuantityLimitsTwoTone />
                                            </InputAdornment>
                                        ),
                                    }}
                                    autoComplete="off"
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
                                    <>
                                        {produtosFiltrados.length === 0 ? (
                                            <div className="flex w-full flex-col items-center justify-center gap-5 h-96">
                                                <TableLoading />
                                                <label className="text-sm">Não foi encontrado nenhum produto!</label>
                                            </div>
                                        ) : (
                                            <TableComponent
                                                headers={headerProdutos}
                                                rows={produtosFiltrados}
                                                actionsLabel={"Ações"}
                                                actionCalls={{
                                                    edit: (produto) => handleEditProduto(produto),
                                                    delete: (produto) => handleDeleteProduto(produto.id),
                                                }}
                                            />
                                        )}
                                    </>
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
                                            options={categorias.map(categoria => ({ label: categoria.nome, value: categoria.id }))} // Mapeia para o formato esperado
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
                                            disabled={isSubmitting} // Adicione esta linha
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
                                            label="Quantidade Mínima"
                                            name="quantidadeMinima"
                                            value={qtdMin}
                                            onChange={(e) => setQtdMin(e.target.value)}
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
                                            value={rendimento}
                                            onChange={(e) => setRendimento(e.target.value)}
                                            sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '50%' } }}
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
                                            sx={{ width: { xs: '45%', sm: '50%', md: '40%', lg: '50%' }, }}
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

                                        <NumericFormat
                                            customInput={TextField}
                                            full Width
                                            variant="outlined"
                                            size="small"
                                            label="Valor Reajuste"
                                            sx={{ width: { xs: '45%', sm: '50%', md: '40%', lg: '47%' }, }}
                                            value={valorReajuste}
                                            onValueChange={(values) => setValorReajuste(values.value)}
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
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Data Reajuste"
                                            type='date'
                                            value={dataReajuste}
                                            onChange={(e) => setDataReajuste(e.target.value)}
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
                                            width="155px"
                                            icon={<CategoryIcon fontSize="small" />}
                                            label="Categoria"
                                            backgroundColor="#D9D9D9"
                                            name="categoria"
                                            fontWeight={500}
                                            options={categorias.map(categoria => ({ label: categoria.nome, value: categoria.id }))}
                                            onChange={(e) => setSelectedCategoria(e.target.value)}
                                            value={selectedCategoria}
                                        />
                                        <SelectTextFields
                                            width="330px"
                                            icon={<ScaleIcon fontSize="small" />}
                                            label="Unidade Medida"
                                            backgroundColor="#D9D9D9"
                                            name="unidadeMedida"
                                            fontWeight={500}
                                            options={userOptionsUnidade}
                                            onChange={handleUnidadeChange}
                                            value={selectedUnidade}
                                        />
                                        <div className="w-[95%] mt-2 flex items-end justify-end">
                                            <ButtonComponent
                                                title="Salvar"
                                                subtitle="Salvar"
                                                startIcon={<Save />}
                                                onClick={handleSalvarProduto}
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
                label={'Categoria '}
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