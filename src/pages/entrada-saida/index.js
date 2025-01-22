import React, { useEffect, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import ButtonComponent from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import { AddCircleOutline, Save } from '@mui/icons-material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CentralModal from '../../components/modal-central/index.js';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import ScaleIcon from '@mui/icons-material/Scale';
import SelectTextFields from '../../components/select/index.js';
import TableComponent from '../../components/table/index.js';
import { headerEntradaSaida } from '../../entities/headers/header-entrada-saida.js';

const EntradaSaida = () => {
  const [cadastro, setCadastro] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [entradasSaidas, setEntradasSaidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState({
    produto: '',
    quantidade: '',
    tipo: 'entrada', // ou 'saida'
  });

  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    setProdutos(produtosSalvos);

    const categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];
    setCategorias(categoriasSalvas);
  }, []);

  const handleCadastro = () => setCadastro(true);
  const handleCloseCadastro = () => setCadastro(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoRegistro({ ...novoRegistro, [name]: value });
  };

  const handleCadastrarRegistro = () => {
    const updatedEntradasSaidas = [...entradasSaidas, novoRegistro];
    setEntradasSaidas(updatedEntradasSaidas);
    localStorage.setItem('entradasSaidas', JSON.stringify(updatedEntradasSaidas));
    setNovoRegistro({ produto: '', quantidade: '', tipo: 'entrada' });
    handleCloseCadastro();
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
                  // Define actions if needed
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
                onChange={(value) => setNovoRegistro({ ...novoRegistro, produto: value })}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Quantidade"
                name="quantidade"
                value={novoRegistro.quantidade}
                onChange={handleInputChange}
                autoComplete="off"
                sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '45%' }, marginLeft: '10px' }}
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
                onChange={(value) => setNovoRegistro({ ...novoRegistro, tipo: value })}
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
      </div>
    </div>
  );
}

export default EntradaSaida;