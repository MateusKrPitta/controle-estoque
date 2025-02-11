import React, { useEffect, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import ButtonComponent from '../../components/button';
import { AddCircleOutline, Edit, Save, DateRange } from '@mui/icons-material'; // Importando o ícone de exclusão
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CentralModal from '../../components/modal-central/index.js';
import ArticleIcon from '@mui/icons-material/Article';
import ScaleIcon from '@mui/icons-material/Scale';
import SelectTextFields from '../../components/select/index.js';
import TableComponent from '../../components/table/index.js';
import { headerEntradaSaida } from '../../entities/headers/header-entrada-saida.js';
import ModalLateral from '../../components/modal-lateral/index.js';
import { formatValor } from '../../utils/functions.js';
import CustomToast from '../../components/toast/index.js';
import Entrada from '../../assets/icones/entradas-saidas.png'
import Saida from '../../assets/icones/saida.png'
import Entradas from '../../assets/icones/entradas.png'
import Valor from '../../assets/icones/valor.png'
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../services/api.js';

const EntradaSaida = () => {
  const [cadastro, setCadastro] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [entradasSaidas, setEntradasSaidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [filtro, setFiltro] = useState(false);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [uniqueCategoriesCount, setUniqueCategoriesCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [observacao, setObservacao] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Delay para a transição

    return () => clearTimeout(timer);
  }, []);

  // Estados para o registro atual
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [tipo, setTipo] = useState('entrada'); // ou 'saida'

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [registroEditado, setRegistroEditado] = useState(null); // Novo estado para o registro a ser editado

  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    setProdutos(produtosSalvos);

    const categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];
    setCategorias(categoriasSalvas);

    const entradasSaidasSalvas = JSON.parse(localStorage.getItem('entradasSaidas')) || [];
    setEntradasSaidas(entradasSaidasSalvas);
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

  const handleEditar = (registro) => {
    setRegistroEditado(registro); // Armazena o registro a ser editado
    setProduto(registro.produto);
    setQuantidade(registro.quantidade);
    setTipo(registro.tipo);
    setProdutoSelecionado(produtos.find(prod => prod.nome === registro.produto)); // Define o produto selecionado
    setEditando(true); // Abre a modal de edição
  };

  const handleCloseEditar = () => {
    setEditando(false);
    setRegistroEditado(null); // Limpa o registro editado
  };
  
  const handleCadastrarRegistro = async () => {
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
      const response = await api.post('/movimentacao', novoRegistro); // Altere a rota conforme necessário
      console.log('Registro cadastrado com sucesso:', response.data);

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
    } catch (error) {
      console.error('Erro ao cadastrar registro:', error);
      CustomToast({ type: "error", message: "Erro ao cadastrar registro!" });
    }
  };


  const handleSaveEdit = () => {
    const quantidadeNumerica = parseFloat(quantidade) || 0; // Converte a quantidade para número
    const valorTotal = produtoSelecionado ? produtoSelecionado.precoPorcao * quantidadeNumerica : 0; // Calcule o valor total

    const updatedEntradasSaidas = entradasSaidas.map((registro) =>
      registro === registroEditado
        ? {
          ...registro,
          produto: produtoSelecionado ? produtoSelecionado.nome : produto,
          quantidade,
          tipo, // Armazena como string formatada
          categoria: produtoSelecionado ? produtoSelecionado.categoria : '',
          precoPorcao: produtoSelecionado ? produtoSelecionado.precoPorcao : 0, // Atualiza precoPorcao
          valorTotal // Atualiza o valor total
        }
        : registro
    );

    setEntradasSaidas(updatedEntradasSaidas);
    localStorage.setItem('entradasSaidas', JSON.stringify(updatedEntradasSaidas));
    handleCloseEditar(); // Fecha a modal de edição
  };

  const handleDelete = (registro) => {
    const updatedEntradasSaidas = entradasSaidas.filter((item) => item.id !== registro.id);
    setEntradasSaidas(updatedEntradasSaidas);
    localStorage.setItem('entradasSaidas', JSON.stringify(updatedEntradasSaidas));
    CustomToast({ type: "success", message: "Deletado com sucesso!" });
  };

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
      const response = await api.get('/produto'); // Altere a rota conforme necessário
      const produtosCadastrados = response.data.data; // Ajuste conforme a estrutura da resposta

      // Mapeie os produtos para incluir o valorPorcao
      const produtosComPreco = produtosCadastrados.map(produto => ({
        id: produto.id,
        nome: produto.nome,
        valorPorcao: produto.valorPorcao, // Certifique-se de que este campo existe na resposta
        // Adicione outros campos que você precisa
      }));

      setProdutos(produtosComPreco);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      CustomToast({ type: "error", message: "Erro ao carregar produtos!" });
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

          <div className='w-[80%] md:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
            <label className='text-xs font-bold'>Total de Movimentações</label>
            <div className='flex items-center justify-center gap-5'>
              <img src={Entrada} alt="Total Movimentações" />
              <label>{totalMovimentacoes}</label>
            </div>
          </div>
          <div className='w-[80%] md:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
            <label className='text-xs font-bold'>Entradas</label>
            <div className='flex items-center justify-center gap-5'>
              <img src={Entradas} alt="Entradas" />
              <label>{totalEntradas}</label>
            </div>
          </div>
          <div className='w-[80%] md:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
            <label className='text-xs font-bold'>Saídas</label>
            <div className='flex items-center justify-center gap-5'>
              <img src={Saida} alt="Saídas" />
              <label>{totalSaidas}</label>
            </div>
          </div>
          <div className='w-[80%] md:w-[20%] p-2 bg-primary flex flex-col gap-3 justify-center items-center' style={{ border: '1px solid black', borderRadius: '10px' }}>
            <label className='text-xs font-bold'>Valor total em estoque</label>
            <div className='flex items-center justify-center gap-5'>
              <img src={Valor} alt="Valor Total em Estoque" />
              <label>{formatValor(valorTotalEstoque)}</label> {/* Formata o valor total */}
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
              autoComplete="off"
              sx={{ width: { xs: '95%', sm: '50%', md: '40%', lg: '40%' } }}
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
              <div className='flex items-center justify-center h-96'>
                {/* Loading Component */}
              </div>
            ) : (
              <TableComponent
                headers={[
                  ...headerEntradaSaida,
                  { label: 'Data', key: 'dataCadastro' } // Adiciona o cabeçalho da nova coluna
                ]}
                rows={entradasSaidas.map(registro => ({
                  ...registro,
                  valorTotal: formatValor(registro.valorTotal), // Formata o valor total
                  precoPorcao: formatValor(registro.precoPorcao), // Formata o precoPorcao
                  dataCadastro: new Date(registro.dataCadastro).toLocaleDateString('pt-BR'), // Formata a data para o formato desejado
                  backgroundColor: registro.tipo === 'entrada' ? '#006b33' :
                    registro.tipo === 'saida' ? '#ff0000' :
                      '#000000' // Define a cor de fundo como #d9d9d9 para desperdício
                }))}
                actionsLabel={"Ações"}
                actionCalls={{
                  edit: handleEditar,
                  delete: (registro) => handleDelete(registro)
                }}
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
                onClick={handleCadastrarRegistro} // Chama a função para cadastrar
              />
            </div>
          </div>
        </CentralModal>

        <ModalLateral
          open={editando}
          handleClose={handleCloseEditar}
          tituloModal="Editar Entrada/Saída"
          icon={<Edit />}
          tamanhoTitulo="75%"
          conteudo={
            <div className="flex gap-2 flex-wrap items-end justify-end w-full mt-2">
              <SelectTextFields
                width={'150px'}
                icon={<ArticleIcon fontSize="small" />}
                label={'Produto'}
                backgroundColor={"#D9D9D9"}
                name={"produto"}
                fontWeight={500}
                options={produtos.map(produto => ({ value: produto.nome, label: produto.nome }))}
                value={produto} // Preenche o campo com o produto atual
                onChange={(e) => handleProdutoChange(e.target.value)} // Passando o valor correto
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                autoComplete="off"
                sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '48%' }, }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScaleIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <SelectTextFields
                width={'150px'}
                icon={<AddchartIcon fontSize="small" />}
                label={'Tipo'}
                backgroundColor={"#D9D9D9"}
                name={"tipo"}
                fontWeight={500}
                options={[
                  { value: 'entrada', label: 'Entrada' },
                  { value: 'saida', label: 'Saída' },
                ]}
                value={tipo} // Preenche o campo com o tipo atual
                onChange={(e) => setTipo(e.target.value)} // Passando o valor correto
              />
              <div className="w-[95%] mt-2 flex items-end justify-end">
                <ButtonComponent
                  title="Salvar"
                  subtitle="Salvar"
                  startIcon={<Save />}
                  onClick={handleSaveEdit} // Chama a função para salvar as alterações
                />
              </div>
            </div>
          }
        />

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
    </div>
  );
}

export default EntradaSaida;