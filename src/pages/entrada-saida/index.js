import React, { useEffect, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import ButtonComponent from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import { AddCircleOutline, Edit, Save, Delete } from '@mui/icons-material'; // Importando o ícone de exclusão
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CentralModal from '../../components/modal-central/index.js';
import ArticleIcon from '@mui/icons-material/Article';
import ScaleIcon from '@mui/icons-material/Scale';
import SelectTextFields from '../../components/select/index.js';
import TableComponent from '../../components/table/index.js';
import { headerEntradaSaida } from '../../entities/headers/header-entrada-saida.js';
import ModalLateral from '../../components/modal-lateral/index.js';

const EntradaSaida = () => {
  const [cadastro, setCadastro] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [entradasSaidas, setEntradasSaidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  
  // Estados para o registro atual
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [tipo, setTipo] = useState('entrada'); // ou 'saida'
  const [preco, setPreco] = useState('');
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

  const handleCadastrarRegistro = () => {
    const novoRegistro = {
      produto: produtoSelecionado ? produtoSelecionado.nome : produto,
      quantidade,
      tipo,
      preco,
      categoria: produtoSelecionado ? produtoSelecionado.categoria : '',
    };

    const updatedEntradasSaidas = [...entradasSaidas, novoRegistro];
    setEntradasSaidas(updatedEntradasSaidas);
    localStorage.setItem('entradasSaidas', JSON.stringify(updatedEntradasSaidas));

    // Resetar os campos
    setProduto('');
    setQuantidade('');
    setTipo('entrada');
    setPreco('');
    setProdutoSelecionado(null);
    handleCloseCadastro();
  };

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
    setPreco(registro.preco);
    setProdutoSelecionado(produtos.find(prod => prod.nome === registro.produto)); // Define o produto selecionado
    setEditando(true); // Abre a modal de edição
  };

  const handleCloseEditar = () => {
    setEditando(false);
    setRegistroEditado(null); // Limpa o registro editado
  };

  const handleSaveEdit = () => {
    const updatedEntradasSaidas = entradasSaidas.map((registro) =>
      registro === registroEditado
        ? {
            ...registro,
            produto: produtoSelecionado ? produtoSelecionado.nome : produto,
            quantidade,
            tipo,
            preco,
            categoria: produtoSelecionado ? produtoSelecionado.categoria : '',
          }
        : registro
    );

    setEntradasSaidas(updatedEntradasSaidas);
    localStorage.setItem('entradasSaidas', JSON.stringify(updatedEntradasSaidas));
    handleCloseEditar(); // Fecha a modal de edição
  };

  const handleDelete = (registro) => {
    const updatedEntradasSaidas = entradasSaidas.filter((item) => item !== registro);
    setEntradasSaidas(updatedEntradasSaidas);
    localStorage.setItem('entradasSaidas', JSON.stringify(updatedEntradasSaidas));
  };

  return (
    <div className="flex w-full ">
      <Navbar />
      <div className='flex flex-col gap-3 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='sm:items-center md:text-2xl font-bold text-black w-[99%] flex items-center gap-2 '>
          <AddchartIcon /> Entrada e Saída
        </h1>
        <div className="mt-2 sm:mt-2 md:mt-9 flex flex-col w-full">
          <div className='flex gap-2'>
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
              onClick={handleCadastro}
            />
            <IconButton title="Filtro"
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
                headers={headerEntradaSaida}
                rows={entradasSaidas}
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
          tamanhoTitulo={'82%'}
          maxHeight={'90vh'}
          top={'20%'}
          left={'28%'}
          width={'620px'}
          icon={<AddCircleOutline fontSize="small" />}
          open={cadastro}
          onClose={handleCloseCadastro}
          title="Cadastrar Entrada/Saída"
        >
          <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
            <div className='mt-4 flex gap-3 flex-wrap'>
              <SelectTextFields
                width={'260px'}
                icon={<ArticleIcon fontSize="small" />}
                label={'Produto'}
                backgroundColor={"#D9D9D9"}
                name={"produto"}
                fontWeight={500}
                options={produtos.map(produto => ({ value: produto.nome, label: produto.nome }))}
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
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Preço"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
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
                width={'260px'}
                icon={<AddchartIcon fontSize="small" />}
                label={'Tipo'}
                backgroundColor={"#D9D9D9"}
                name={"tipo"}
                fontWeight={500}
                options={[
                  { value: 'entrada', label: 'Entrada' },
                  { value: 'saida', label: 'Saída' },
                ]}
                onChange={(e) => setTipo(e.target.value)} // Passando o valor correto
              />
            </div>

            <div className='w-[95%] mt-2 flex items-end justify-end'>
              <ButtonComponent
                title={'Cadastrar'}
                subtitle={'Cadastrar'}
                startIcon={<Save />}
                onClick={handleCadastrarRegistro}
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
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Preço"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
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
      </div>
    </div>
  );
}

export default EntradaSaida;