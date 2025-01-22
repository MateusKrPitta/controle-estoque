import React, { useState } from 'react';
import Navbar from '../../components/navbars/header';
import './contratos-finalizados.css';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import ButtonComponent from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import TableComponent from '../../components/table';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useNavigate } from 'react-router-dom';
import { contratosFinalizados } from '../../utils/json/contratos-finalizados.js';
import CentralModal from '../../components/modal-central/index.js';
import SelectTextFields from '../../components/select/index.js';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { headerContratosFinalizados } from '../../entities/headers/header-contratos-finalizados.js';
import TableLoading from '../../components/loading/loading-table/loading.js';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import GradingIcon from '@mui/icons-material/Grading';

const ContratosFinalizados = () => {
  const [cliente, setCliente] = useState({}); // Definindo o estado cliente
  const [loading, setLoading] = useState(false); // Estado de loading
  const [searchValue, setSearchValue] = useState(''); // Estado para o valor da busca
  const navigate = useNavigate();
  const [criarOportunidade, setCriarOportunidade] = useState(false);

  const handleOportunidade = () => setCriarOportunidade(true);
  const handleCloseOportunidade = () => setCriarOportunidade(false);

  const unidadeOptions = [
    { value: "Dourados", label: "Dourados" },
    { value: "Itaporã", label: "Itaporã" },
    { value: "Ponta Porã", label: "Ponta Porã" },
  ];

  const filtroOptions = [
    { value: "Todos", label: "Todos" },
    { value: "Novo", label: "Novo" },
    { value: "Transferência de Filial", label: "Transferência de Filial" },
    { value: "Exclusão Pax", label: "Exclusão Pax" }
  ];

  const statusOptions = [
    { value: "Cadastrado", label: "Cadastrado" },
    { value: "Recusado", label: "Recusado" },
  ];

  // Mapeamento e remoção de duplicatas
  const uniqueContratos = Array.from(new Set(contratosFinalizados.map(a => a.ID)))
    .map(id => {
      return contratosFinalizados.find(a => a.ID === id);
    }).map(contrato => ({
      ID: contrato.ID,
      Titular: contrato.Titular.Nome,
      Vendedor: contrato.Vendedor,
      "Data do Contrato": contrato["Data do Contrato"],
      Unidade: contrato["Unidade Pax"],
      Tipo: contrato["Tipo de Contrato"],
      Contrato: contrato.Contrato,
      Status: contrato.Status || "Status não definido" // Preenchendo a coluna Status
    }));

  // Atualiza o estado para usar contratos únicos
  const [filteredRows, setFilteredRows] = useState(uniqueContratos);

  const handleView = (row) => {
    setLoading(true); // Ativa o loading
    setTimeout(() => {
      navigate(`/contratos-finalizados/dados-contrato-finalizado/${row.ID}`); // Redireciona após o loading
    }, 1000); // Simula um tempo de carregamento de 1 segundo
  };

  const handleSearch = () => {
    setLoading(true); // Ativa o loading
    setTimeout(() => {
      const results = uniqueContratos.filter(item =>
        item.Titular.toLowerCase().includes(searchValue.toLowerCase()) // Verifica se item.Titular existe
      );
      setFilteredRows(results); // Atualiza as linhas filtradas
      setLoading(false); // Desativa o loading
    }, 1000); // Simula um tempo de carregamento de 1 segundo
  };

  const handleUserChange = (event) => {
    setCliente({ ...cliente, tipo: event.target.value });
  };

  const handleStatus = (event) => {
    setCliente({ ...cliente, status: event.target.value });
  };

  const handleUnidade = (event) => {
    setCliente({ ...cliente, unidade: event.target.value });
  };

  return (
    <div className="container-contratos-pendentes ">
      <Navbar />
      <div className='flex flex-col gap-2 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='sm:items-center md:text-2xl font-bold text-primary w-[99%] flex items-center gap-2 '><GradingIcon />Contratos Finalizados</h1>

        <div class="mt-2 sm:mt-2 md:mt-9 flex flex-col w-full">
        <div className='flex gap-2'>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Buscar cliente"
              autoComplete="off"
              sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '40%' }, marginLeft:'10px' }}
              value={searchValue} // Adiciona o valor do campo de busca
              onChange={(e) => setSearchValue(e.target.value)} // Atualiza o estado do valor da busca
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <ButtonComponent
              startIcon={<SearchIcon fontSize='small' />}
              title={'Pesquisar'}
              subtitle={'Pesquisar'}
              buttonSize="large"
              onClick={handleSearch} // Chama a função de busca ao clicar
            />
            <IconButton title="Filtro"
              onClick={handleOportunidade}
              className='view-button w-10 h-10 '
              sx={{
                color: '#006b33',
                border: '1px solid #006b33',
                '&:hover': {
                  color: '#fff',
                  backgroundColor: '#006b33',
                  border: '1px solid #005a2a'
                }
              }} >
              <FilterAltIcon fontSize={"small"} />
            </IconButton>
          </div>

          <div className="w-[95%] sm: ml-3 ">
            {loading ? (
              <div className='flex items-center justify-center h-96'>
                <TableLoading />
              </div>
            ) : (
              <TableComponent
                headers={headerContratosFinalizados} // Mantenha os headers como contratosMapeados
                rows={filteredRows} // Corrigido para usar contratosMapeados
                actionsLabel={"Ações"}
                actionCalls={{
                  view: handleView, // Adiciona a função de visualização aqui
                }}
              />
            )}
          </div>
        </div>

      </div>
      <CentralModal tamanhoTitulo={'81%'} maxHeight={'90vh'} top={'20%'} left={'35%'} width={'350px'} icon={<FilterAltIcon fontSize="small" />} open={criarOportunidade} onClose={handleCloseOportunidade} title="Filtro de Pesquisa"
        children={
          <div className='flex mt-4 flex-wrap gap-2 items-center justify-center'>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              type='date'
              label="De"
              autoComplete="off"
              sx={{ width: { xs: '43%', sm: '50%', md: '40%', lg: '49%' }, }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              type='date'
              label="Até"
              autoComplete="off"
              sx={{ width: { xs: '43%', sm: '50%', md: '40%', lg: '48%' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon />
                  </InputAdornment>
                ),
              }}
            />

            <SelectTextFields
              width="146px"
              icon={<FilterAltIcon fontSize="small" />}
              label="Unidade"
              value={cliente.Unidade || ""} // valor padrão vazio
              onChange={handleUnidade}
              options={unidadeOptions}
              fullWidth={false}
              size="medium"
              fontSize="1rem"
              optionFontSize="0.75rem"
            />
            <SelectTextFields
              width="146px"
              icon={<FilterAltIcon fontSize="small" />}
              label="Status"
              value={cliente.Tipo || ""} // valor padrão vazio
              onChange={handleStatus}
              options={statusOptions}
              fullWidth={false}
              size="medium"
              fontSize="1rem"
              optionFontSize="0.75rem"
            />
            <SelectTextFields
              width="300px"
              icon={<FilterAltIcon fontSize="small" />}
              label="Tipo"
              value={cliente.Tipo || ""} // valor padrão vazio
              onChange={handleUserChange}
              options={filtroOptions}
              fullWidth={false}
              size="medium"
              fontSize="1rem"
              optionFontSize="0.75rem"
            />
            <div className='w-[90%] mt-3 flex gap-2 items-center justify-end'>
              <ButtonComponent
                startIcon={<SearchIcon fontSize='small' />}
                title={'Pesquisar'}
                subtitle={'Pesquisar'}
                buttonSize="large"
              />
            </div>
          </div>
        }
      >
      </CentralModal>
    </div>
  );
}

export default ContratosFinalizados;