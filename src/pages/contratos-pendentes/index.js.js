import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbars/header';
import './contratos-pendentes.css';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import ButtonComponent from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import TableComponent from '../../components/table';
import { headerContratosPendentes } from '../../entities/headers/header-contratos-pendentes';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useNavigate } from 'react-router-dom';
import { contratosPendentesMapeados } from '../../entities/class/contratos-pendents.js';
import CentralModal from '../../components/modal-central/index.js';
import SelectTextFields from '../../components/select/index.js';
import TableLoading from '../../components/loading/loading-table/loading.js';
import HeaderPerfil from '../../components/navbars/perfil/index.js';
import MenuMobile from '../../components/menu-mobile/index.js';
import PostAddIcon from '@mui/icons-material/PostAdd';

const ContratosPendentes = () => {
    const [cliente, setCliente] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredRows, setFilteredRows] = useState(contratosPendentesMapeados);
    const navigate = useNavigate();
    const [criarOportunidade, setCriarOportunidade] = useState(false);

    const handleOportunidade = () => setCriarOportunidade(true);
    const handleCloseOportunidade = () => setCriarOportunidade(false);

    const filtroOptions = [
        { value: "Todos", label: "Todos" },
        { value: "Novo", label: "Novo" },
        { value: "Transferência de Filial", label: "Transferência de Filial" },
        { value: "Exclusão Pax", label: "Exclusão Pax" }
    ];

    const handleView = (row) => {
        console.log("ID do contrato selecionado:", row.ID); // Verifica o ID
        setLoading(true);

        setTimeout(() => {
            navigate(`/contratos-pendentes/dados-contrato/${row.ID}`);
        }, 1000);
    };



    const handleSearch = () => {
        setLoading(true); // Ativa o loading
        setTimeout(() => {
            const results = contratosPendentesMapeados.filter(item =>
                item.nome?.toLowerCase().includes(searchValue.toLowerCase()) // Verifica se item.nome existe
            );
            setFilteredRows(results); // Atualiza as linhas filtradas
            setLoading(false); // Desativa o loading
        }, 1000); // Simula um tempo de carregamento de 1 segundo
    };


    const handleUserChange = (event) => {
        setCliente({ ...cliente, tipo: event.target.value });
    };

    const loadContratosFromLocalStorage = () => {
        const savedContratos = JSON.parse(localStorage.getItem("contratosPendentes")) || [];
        console.log("Contratos carregados do localStorage:", savedContratos);

        return savedContratos.map(contrato => {
            console.log("Contrato processado:", contrato.ID); // Adicionando log para depuração
            return {
                ID: contrato.ID,
                TitularNome: contrato.dadosTitular?.nome || "Nome não disponível",
                Vendedor: contrato.dadosTitular?.vendedor || "Administrador",
                DataContrato: contrato.dadosGerais?.dataContrato || "Data não disponível",
                Unidade: contrato.dadosGerais?.unidadePax || "Unidade não disponível",
                Tipo: contrato.dadosGerais?.tipoContrato || "Tipo não disponível",
                Status: contrato.status || "Status não disponível",
            };
        });
    };


    // Continue com o restante do código

    useEffect(() => {
        const localStorageContratos = loadContratosFromLocalStorage();
        console.log("Contratos após combinação:", [...contratosPendentesMapeados, ...localStorageContratos]);

        setFilteredRows([...contratosPendentesMapeados, ...localStorageContratos]);
    }, []);

    useEffect(() => {
        const localStorageContratos = JSON.parse(localStorage.getItem("contratosPendentes")) || [];
        console.log("Contratos do LocalStorage:", localStorageContratos);
    }, []);


    return (
        <div className="container-contratos-pendentes ">
            <Navbar />

            <div className='flex flex-col gap-2 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='sm:items-center md:text-2xl font-bold text-primary w-[99%] flex items-center gap-2 '><PostAddIcon />Contratos Pendentes</h1>

                <div class="mt-2 sm:mt-2 md:mt-9 flex flex-col w-full">
                    <div className='flex gap-2'>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Buscar cliente"
                            autoComplete="off"
                            sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '40%' }, marginLeft: '10px' }}
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
                            startIcon={< SearchIcon fontSize='small' />}
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

                    <div className="tamanho-tabela">
                        {loading ? (
                            <div className='flex items-center justify-center h-96'>
                                <TableLoading />
                            </div>
                            // Renderiza o componente de loading se estiver carregando
                        ) : (
                            <TableComponent
                                headers={headerContratosPendentes}
                                rows={filteredRows} // Atualizado para usar filteredRows
                                actionsLabel={"Ações"}
                                actionCalls={{
                                    view: handleView,
                                }}
                            />
                        )}
                    </div>
                </div>

            </div>
            <CentralModal tamanhoTitulo={'79%'} maxHeight={'90vh'} top={'20%'} left={'35%'} width={'350px'} icon={<FilterAltIcon fontSize="small" />} open={criarOportunidade} onClose={handleCloseOportunidade} title="Filtro de Pesquisa"
                children={<>
                    <SelectTextFields
                        width="290px"
                        icon={<FilterAltIcon fontSize="small" />}
                        label="Tipo"
                        value={cliente.tipo} // valor padrão vazio
                        onChange={handleUserChange}
                        options={filtroOptions}
                        fullWidth={false}
                        size="medium"
                        fontSize="1rem"
                        optionFontSize="0.75rem"
                    />
                    <div className='w-[97%] mt-3  flex gap-2 items-center justify-end'>
                        <ButtonComponent
                            startIcon={<SearchIcon fontSize='small' />}
                            title={'Pesquisar'}
                            subtitle={'Pesquisar'}
                            buttonSize="large"
                        />
                    </div>
                </>}>

            </CentralModal>
        </div>
    );
}

export default ContratosPendentes;