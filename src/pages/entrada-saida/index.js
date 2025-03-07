import React, { useEffect, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import ButtonComponent from '../../components/button';
import { AddCircleOutline, Save, DateRange } from '@mui/icons-material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CentralModal from '../../components/modal-central/index.js';
import ArticleIcon from '@mui/icons-material/Article';
import ScaleIcon from '@mui/icons-material/Scale';
import SelectTextFields from '../../components/select/index.js';
import TableComponent from '../../components/table/index.js';
import { headerEntradaSaida } from '../../entities/headers/header-entrada-saida.js';
import { formatValor } from '../../utils/functions.js';
import CustomToast from '../../components/toast/index.js';
import Saida from '../../assets/icones/saida.png';
import Desperdicio from '../../assets/icones/desperdicio.png';
import Entradas from '../../assets/icones/entradas.png';
import Valor from '../../assets/icones/valor.png';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../services/api.js';
import { useNavigate } from 'react-router-dom';
import { useUnidade } from '../../components/unidade-context/index.js';
import TableLoading from '../../components/loading/loading-table/loading.js';
import moment from 'moment';

const EntradaSaida = () => {
  const [isDesativa, setDesativa] = useState(false);
  const { unidadeId } = useUnidade();
  const [cadastro, setCadastro] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [entradasSaidas, setEntradasSaidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState(false);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [uniqueCategoriesCount, setUniqueCategoriesCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [observacao, setObservacao] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [entradasSaidasOriginais, setEntradasSaidasOriginais] = useState([]);

  const handlePesquisarProduto = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEntradasSaidas = entradasSaidas.filter((registro) => {
    return registro.produtoNome && registro.produtoNome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalDesperdicio = entradasSaidas
    .filter(registro => registro.tipo === 'desperdicio')
    .reduce((acc, registro) => acc + Number(registro.quantidade), 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Delay para a transição

    return () => clearTimeout(timer);
  }, []);



  const handleCadastro = () => setCadastro(true);
  const handleCloseCadastro = () => setCadastro(false);

  const handleFiltro = () => setFiltro(true);
  const handleCloseFiltro = () => setFiltro(false);

  const handleProdutoChange = (value) => {
    const produtoSelecionado = produtos.find(prod => prod.nome === value);
    setProdutoSelecionado(produtoSelecionado);
    setProduto(value);
  };

  const handleCadastrarRegistro = async () => {
    setDesativa(true);
    const quantidadeNumerica = parseFloat(quantidade) || 0; // Converte a quantidade para número
    const valorTotal = produtoSelecionado ? produtoSelecionado.precoPorcao * quantidadeNumerica : 0; // Calcule o valor total

    // Crie o objeto com os dados a serem enviados
    const novoRegistro = {
      data: new Date().toISOString().split('T')[0], // Data atual
      movTipo: tipo === 'entrada' ? 1 : tipo === 'saida' ? 2 : 3, // Mapeia o tipo para 1, 2 ou 3
      quantidade: quantidadeNumerica,
      produtoId: produtoSelecionado ? produtoSelecionado.id : null, // ID do produto selecionado
      observacao: observacao // Observação do campo
    };

    try {
      // Envie os dados para a API
      const response = await api.post('/movimentacao', novoRegistro);

      // Atualize o estado local
      const updatedEntradasSaidas = [...entradasSaidas, { ...novoRegistro, valorTotal }];
      setEntradasSaidas(updatedEntradasSaidas);

      // Resetar os campos
      setProduto('');
      setQuantidade('');
      setTipo('entrada');
      setProdutoSelecionado(null);
      setObservacao(''); // Limpa o campo de observação
      handleCloseCadastro();

      // Recarregar os dados da tabela
      fetchEntradasSaidas(); // Chame a função para buscar os dados novamente
    } catch (error) {
      CustomToast({ type: "error", message: "Erro ao cadastrar registro!" });
    } finally {
      setDesativa(false); // Reabilita o botão
    }
  };

  // Calcular o valor total de entradas
  const valorTotalEntradas = entradasSaidas
    .filter(registro => registro.tipo === 'entrada')
    .reduce((acc, registro) => acc + Number(registro.valorTotal), 0);

  const valorTotalDesperdicio = entradasSaidas
    .filter(registro => registro.tipo === 'desperdicio')
    .reduce((acc, registro) => acc + Number(registro.valorTotal), 0);

  // Calcular o valor total de saídas
  const valorTotalSaidas = entradasSaidas
    .filter(registro => registro.tipo === 'saida')
    .reduce((acc, registro) => acc + Number(registro.valorTotal), 0);

  const totalMovimentacoes = entradasSaidas.length;
  const totalEntradas = entradasSaidas
    .filter(registro => registro.tipo === 'entrada')
    .reduce((acc, registro) => acc + Number(registro.quantidade), 0);
  const totalSaidas = entradasSaidas
    .filter(registro => registro.tipo === 'saida')
    .reduce((acc, registro) => acc + Number(registro.quantidade), 0);

  // Calcular o valor total em estoque
  const valorTotalEstoque = entradasSaidas.reduce((acc, registro) => {
    const valorRegistro = registro.valorTotal; // O valor total já calculado ao cadastrar
    return acc + (registro.tipo === 'entrada' ? valorRegistro : -valorRegistro);
  }, 0);

  const fetchProdutos = async () => {
    try {
      const response = await api.get(`/produto?unidadeId=${unidadeId}`);

      // Filtra os produtos pela unidadeId no frontend
      const produtosFiltrados = response.data.data.filter(produto => produto.unidadeId === unidadeId);

      setProdutos(produtosFiltrados);
    } catch (error) {
      CustomToast({ type: "error", message: "Erro ao carregar produtos!" });
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await api.get(`/categoria?unidade=${unidadeId}`); // Busca todas as categorias

      // Filtra as categorias com base na unidadeId no frontend
      const categoriasFiltradas = response.data.data.filter(categoria => categoria.unidadeId === unidadeId);

      setCategorias(categoriasFiltradas);
    } catch (error) {
      CustomToast({ type: "error", message: "Erro ao carregar categorias!" });
    }
  };

  const fetchEntradasSaidas = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/movimentacao?unidade=${unidadeId}`);
      const movimentacoes = response.data.data;

      // Formatar as movimentações
      const formattedMovimentacoes = movimentacoes.map(mov => {
        const valorTotal = mov.precoPorcao * mov.quantidade; // Calcule o valor total
        return {
          id: mov.id,
          tipo: mov.tipo === "1" ? 'entrada' : mov.tipo === "2" ? 'saida' : 'desperdicio',
          produtoNome: mov.produtoNome,
          quantidade: mov.quantidade,
          categoria: mov.categoriaNome,
          precoPorcao: mov.precoPorcao,
          valorTotal: valorTotal,
          observacao: mov.observacao,
          dataCadastro: moment(mov.data).format('DD/MM/YYYY'), // Formatação para DD/MM/YYYY
          dataISO: mov.data // Armazena a data original em formato ISO para comparação
        };
      });

      setEntradasSaidas(formattedMovimentacoes);
      setEntradasSaidasOriginais(formattedMovimentacoes);
    } catch (error) {
      CustomToast({ type: "error", message: "Erro ao carregar as movimentações!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];
    const categoriasUnicas = Array.from(new Set(categoriasSalvas.map(cat => cat.nome)))
      .map(nome => categoriasSalvas.find(cat => cat.nome === nome));

    setCategorias(categoriasUnicas);
    setUniqueCategoriesCount(categoriasUnicas.length);
    fetchProdutos();
    // Atualiza o estado com o número de categorias únicas
  }, []);

  const handlePesquisar = () => {
    const filteredData = entradasSaidasOriginais.filter((registro) => {
      const matchesSearchTerm = registro.produtoNome && registro.produtoNome.toLowerCase().includes(searchTerm.toLowerCase());

      // Converte as datas inicial e final para objetos Moment
      const dataInicialMoment = dataInicial ? moment(dataInicial) : null;
      const dataFinalMoment = dataFinal ? moment(dataFinal) : null;

      // Converte a data do registro para um objeto Moment
      const registroDataMoment = moment(registro.dataISO); // Usando a data original em formato ISO

      // Verifica se a data do registro está dentro do intervalo
      const matchesDataInicial = dataInicialMoment ? registroDataMoment.isSameOrAfter(dataInicialMoment) : true;
      const matchesDataFinal = dataFinalMoment ? registroDataMoment.isSameOrBefore(dataFinalMoment) : true;

      const matchesCategoria = selectedCategoria ? registro.categoria === selectedCategoria : true;
      const matchesTipo = selectedTipo ? registro.tipo === selectedTipo : true;

      return matchesSearchTerm && matchesDataInicial && matchesDataFinal && matchesCategoria && matchesTipo;
    });

    setEntradasSaidas(filteredData);
    handleCloseFiltro();
  };
  useEffect(() => {
    if (unidadeId) {
      fetchProdutos();
      fetchCategorias();
    }
  }, [unidadeId]);

  useEffect(() => {
    if (unidadeId) {
      fetchCategorias();
      fetchEntradasSaidas();
    }
  }, [unidadeId]);

  return (
    <div className="flex w-full ">
      <Navbar />
      <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='flex justify-center items-center gap-2 sm: md:text-2xl font-bold w-full md:justify-start'>
          <AddchartIcon /> Entrada e Saída
        </h1>
        <div className={`w-[99%] justify-center flex-wrap mt-4 mb-4 flex items-center gap-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          {/* Card Entradas */}
          <div className='w-[80%] md:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
            <label className='text-xs font-bold'>Entradas</label>
            <div className='flex items-center justify-center gap-5'>
              <img src={Entradas} alt="Entradas" />
              <label>{formatValor(valorTotalEntradas)}</label>
            </div>
          </div>

          {/* Card Saídas */}
          <div className='w-[80%] md:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
            <label className='text-xs font-bold'>Saídas</label>
            <div className='flex items-center justify-center gap-5'>
              <img src={Saida} alt="Saídas" />
              <label>{formatValor(valorTotalSaidas)}</label> {/* Exibe o valor total das saídas */}
            </div>
          </div>

          {/* Card Desperdício */}
          <div className='w-[80%] md:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
            <label className='text-xs font-bold'>Desperdício</label>
            <div className='flex items-center justify-center gap-5'>
              <img src={Desperdicio} alt="Desperdício" />
              <label>{formatValor(valorTotalDesperdicio)}</label> {/* Exibe o valor total do desperdício */}
            </div>
          </div>

          {/* Card Valor Total em Estoque */}
          <div className='w-[80%] md:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
            <label className='text-xs font-bold'>Valor total em estoque</label>
            <div className='flex items-center justify-center gap-5'>
              <img src={Valor} alt="Valor Total em Estoque" />
              <label>{formatValor(valorTotalEstoque)}</label>
            </div>
          </div>
        </div>
        <div className={`ml-0 flex flex-col w-[98%] md:ml-2 mr-3 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          <div className='flex gap-2 justify-center flex-wrap md:justify-start items-center md:items-start'>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Entrada e Saída"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AddchartIcon />
                  </InputAdornment>
                ),
              }}
              value={searchTerm} // Adiciona o valor do termo de pesquisa
              onChange={handlePesquisarProduto}
              autoComplete="off"
              sx={{ width: { xs: '95%', sm: '50%', md: '40%', lg: '40%' } }}
            />

            <ButtonComponent
              startIcon={<AddCircleOutline fontSize='small' />}
              title={'Cadastrar'}
              subtitle={'Cadastrar'}
              buttonSize="large"
              onClick={handleCadastro}
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
              <div className="flex w-full flex-col items-center justify-center gap-5 h-96">
                <TableLoading />
                <label className="text-sm">Carregando...</label>
              </div>
            ) : filteredEntradasSaidas.length === 0 ? (
              <div className="flex w-full flex-col items-center justify-center gap-5 h-96">
                <TableLoading />
                <label className="text-sm">Nenhum resultado encontrado!</label>
              </div>
            ) : (
              <TableComponent
                headers={headerEntradaSaida}
                rows={filteredEntradasSaidas} // Usa filteredEntradasSaidas para a pesquisa
                actionsLabel={"Ações"}
              />
            )}
          </div>
        </div>
        <CentralModal
          tamanhoTitulo={'81%'}
          maxHeight={'90vh'}
          top={'20%'}
          left={'28%'}
          width={'500px'}
          icon={<AddCircleOutline fontSize="small" />}
          open={cadastro}
          onClose={handleCloseCadastro}
          title="Cadastrar Entrada/Saída"
        >
          <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
            <div className='mt-4 flex gap-3 flex-wrap'>
              <SelectTextFields
                width={'285px'}
                icon={<ArticleIcon fontSize="small" />}
                label={'Produto'}
                backgroundColor={"#D9D9D9"}
                name={"produto"}
                fontWeight={500}
                options={produtos.map(produto => ({
                  value: produto.nome, // O valor que será armazenado
                  label: `${produto.nome} - ${formatValor(produto.valorPorcao)}` // Exibe o nome e o preço por porção formatado
                }))}
                value={produto} // Preenche o campo com o produto atual
                onChange={(e) => handleProdutoChange(e.target.value)} // Passando o valor correto
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Quantidade"
                type='number'
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                autoComplete="off"
                sx={{ width: { xs: '30%', sm: '50%', md: '40%', lg: '30%' }, }}
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
                label="Observação"
                value={observacao} // Adicione um estado para armazenar a observação
                sx={{ width: { xs: '30%', sm: '50%', md: '40%', lg: '96%' }, }}
                onChange={(e) => setObservacao(e.target.value)} // Função para atualizar a observação
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ArticleIcon fontSize="small" /> {/* Ícone para o campo de observação */}
                    </InputAdornment>
                  ),
                }}
              />
              <SelectTextFields
                width={'185px'}
                icon={<AddchartIcon fontSize="small" />}
                label={'Tipo'}
                backgroundColor={"#D9D9D9"}
                name={"tipo"}
                fontWeight={500}
                options={[
                  { value: 'entrada', label: 'Entrada' },
                  { value: 'saida', label: 'Saída' },
                  { value: 'desperdicio', label: 'Desperdício' }, // Nova opção adicionada
                ]}
                onChange={(e) => setTipo(e.target.value)} // Passando o valor correto
              />
            </div>

            <div className='w-[95%] mt-2 flex items-end justify-end'>
              <ButtonComponent
                title={'Cadastrar'}
                subtitle={'Cadastrar'}
                startIcon={<Save />}
                disabled={isDesativa}
                onClick={handleCadastrarRegistro} // Chama a função para cadastrar
              />
            </div>
          </div>
        </CentralModal>

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
          <div>
            <div className='mt-4 flex gap-3 flex-wrap'>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Data Inicial"
                value={dataInicial}
                type='date'
                onChange={(e) => setDataInicial(e.target.value)}
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
                onChange={(e) => setDataFinal(e.target.value)}
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
                width={'170px'}
                icon={<CategoryIcon fontSize="small" />}
                label={'Categorias'}
                backgroundColor={"#D9D9D9"}
                name={"categoria"}
                fontWeight={500}
                options={categorias.map(categoria => ({ label: categoria.nome, value: categoria.nome }))}
                onChange={(e) => setSelectedCategoria(e.target.value)}
                value={selectedCategoria}
              />
              <SelectTextFields
                width={'155px'}
                icon={<AddchartIcon fontSize="small" />}
                label={'Tipo'}
                backgroundColor={"#D9D9D9"}
                name={"tipo"}
                fontWeight={500}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'entrada', label: 'Entrada' },
                  { value: 'saida', label: 'Saída' },
                  { value: 'desperdicio', label: 'Desperdício' },
                ]}
                onChange={(e) => setSelectedTipo(e.target.value)}
                value={selectedTipo}
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
  );
}

export default EntradaSaida; 