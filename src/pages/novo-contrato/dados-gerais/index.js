import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbars/header';
import HeaderPerfil from '../../../components/navbars/perfil';
import HeaderNovoContrato from '../../../components/navbars/novo-contrato';
import { InputAdornment, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ButtonComponent from '../../../components/button';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuMobile from '../../../components/menu-mobile';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ArticleOutlined } from '@mui/icons-material';
import SelectTextFields from '../../../components/select';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ArticleIcon from '@mui/icons-material/Article';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const DadosGerais = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dataContrato, setDataContrato] = useState('');
    const [unidadePax, setUnidadePax] = useState('');
    const [contrato, setContrato] = useState(''); // Novo estado para o campo "Contrato"
    const [plano, setPlano] = useState(''); // Novo estado para o campo "Plano"
    const [dataContratoAntigo, setDataContratoAntigo] = useState(''); // Novo estado para o campo "Data Contrato Antigo"
    const contratoNome = location.state?.contratoNome || "Novo Contrato";
    const [tipoContrato, setTipoContrato] = useState({});

    const filtroOptions = [
        { value: "Contrato Novo", label: "Contrato Novo" },
        { value: "Termo de Inclusão", label: "Termo de Inclusão" },
    ];

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('dadosGerais'));
        if (savedData) {
            setUnidadePax(savedData.unidadePax || '');
            setDataContrato(savedData.dataContrato || new Date().toISOString().split('T')[0]);
            setTipoContrato(savedData.tipoContrato || '');
            setContrato(savedData.contrato || ''); // Recupera o contrato salvo
            setPlano(savedData.plano || ''); // Recupera o plano salvo
            setDataContratoAntigo(savedData.dataContratoAntigo || ''); // Recupera a data do contrato antigo
        } else {
            setDataContrato(new Date().toISOString().split('T')[0]);
        }
    }, [location.key]);

    useEffect(() => {
        localStorage.setItem('dadosGerais', JSON.stringify({ dataContrato, tipoContrato, unidadePax, contrato, plano, dataContratoAntigo }));
    }, [dataContrato, tipoContrato, unidadePax, contrato, plano, dataContratoAntigo]);

    const isFormValid = unidadePax && dataContrato && tipoContrato && contrato && dataContratoAntigo;

    const handleAvancar = () => {
        if (isFormValid) {
            const contratoNome = location.state?.contratoNome || localStorage.getItem('nomeContrato');

            if (contratoNome) {
                localStorage.setItem('nomeContrato', contratoNome);
                navigate('/novo-contrato/dados-titular', { replace: true, state: { contratoNome } });
            } else {
                console.error("contratoNome não está definido");
                alert("Erro: Nome do contrato não encontrado.");
            }
        }
    };

    const handleUserChange = (event) => {
        setTipoContrato(event.target.value);
    };


    return (
        <div className="container-contratos-pendentes ">
            <Navbar />
            <div className='flex flex-col gap-2 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex gap-2 items-center justify-center text-base sm:ml-1  md:text-2xl  font-bold text-primary w-full md:justify-start   '><ArticleOutlined />{contratoNome}</h1>

                <div className="w-full flex mt-[40px] gap-2 flex-wrap ">
                    <div className='hidden md:block'>
                        <HeaderNovoContrato
                            activeSection="dadosGerais"
                            disabledSections={['dadosTitular', 'endereco', 'dependentes', 'dependentePet', 'assinatura']}
                            handleNavigation={(section) => navigate(`/novo-contrato/${section}`)}
                        />
                    </div>

                    <div className=" w-[100%] p-3 flex flex-col gap-3 md:w-[70%] ">
                        <div
                            className="w-[100%] flex gap-2 p-5 rounded-xl flex-wrap"
                            style={{ border: '1px solid #d9d9d9' }}
                        >
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Vendedor"
                                autoComplete="off"
                                sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '47%' }, marginBottom: '10px' }}
                                value={"Administrador"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <SelectTextFields
                                width="190px"
                                icon={<ContentPasteIcon fontSize="small" />}
                                label="Tipo do contrato"
                                value={tipoContrato || ""}
                                onChange={handleUserChange}
                                options={filtroOptions}
                                fullWidth={false}
                                size="medium"
                                fontSize="1rem"
                                optionFontSize="0.75rem"
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Data do Contrato"
                                type="date"
                                disabled
                                value={dataContrato}
                                onChange={(e) => setDataContrato(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '45%', sm: '50%', md: '40%', lg: '22%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRangeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Unidade Pax"
                                type="text"
                                value={unidadePax}
                                onChange={(e) => setUnidadePax(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '25%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Contrato"
                                type='text'
                                autoComplete="off"
                                sx={{ width: { xs: '47%', sm: '50%', md: '40%', lg: '25%' }, marginBottom: '10px' }}
                                value={contrato}
                                onChange={(e) => setContrato(e.target.value)} // Atualiza o estado com o valor do contrato
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
                                label="Plano"
                                type='text'
                                autoComplete="off"
                                sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '25%' }, marginBottom: '10px' }}
                                value={contratoNome}
                                disabled
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Data Contrato Antigo"
                                type="date"
                                value={dataContratoAntigo}
                                onChange={(e) => setDataContratoAntigo(e.target.value)} // Atualiza o estado com a data do contrato antigo
                                autoComplete="off"
                                sx={{ width: { xs: '47%', sm: '50%', md: '40%', lg: '21%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarMonthIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <div className="w-full flex items-end justify-end">
                            <ButtonComponent
                                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                                title="Avançar"
                                subtitle="Avançar"
                                buttonSize="large"
                                disabled={!isFormValid}
                                onClick={handleAvancar}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DadosGerais;
