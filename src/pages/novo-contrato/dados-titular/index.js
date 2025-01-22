import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbars/header';
import HeaderPerfil from '../../../components/navbars/perfil';
import HeaderNovoContrato from '../../../components/navbars/novo-contrato';
import { InputAdornment, TextField } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { formatCPF } from '../../../utils/formatCPF';
import { formatPhoneNumber } from '../../../utils/functions';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ButtonComponent from '../../../components/button';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuMobile from '../../../components/menu-mobile';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import { ArticleOutlined } from '@mui/icons-material';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChurchIcon from '@mui/icons-material/Church';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import FlagIcon from '@mui/icons-material/Flag';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import MailIcon from '@mui/icons-material/Mail';
import SelectTextFields from '../../../components/select';

const DadosTitular = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Estados para armazenar os valores dos campos
    const [cpf, setCPF] = useState('');
    const [nome, setNome] = useState('');
    const [rg, setRg] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('');
    const [sexo, setSexo] = useState('');
    const [religiao, setReligiao] = useState('');
    const [profissao, setProfissao] = useState('');
    const [naturalidade, setNaturalidade] = useState('');
    const [nacionalidade, setNacionalidade] = useState('');
    const [telefone1, setTelefone1] = useState('');
    const [telefone2, setTelefone2] = useState('');
    const [email1, setEmail1] = useState('');
    const [email2, setEmail2] = useState('');

    const contratoNome = location.state?.contratoNome || "Novo Contrato";

    const filtroEstadoCivil = [
        { value: "Solteiro", label: "Solteiro" },
        { value: "Casado", label: "Casado" },
    ];

    const filtroSexo = [
        { value: "Masculino", label: "Masculino" },
        { value: "Feminino", label: "Feminino" },
    ];

    const filtroReligiao = [
        { value: "Evangélica", label: "Evangélica" },
        { value: "Católica", label: "Católica" },
        { value: "Espírita", label: "Espírita" },
    ];

    // Recuperar dados do sessionStorage ao montar o componente
    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('dadosTitular'));
        if (savedData) {
            setNome(savedData.nome || '');
            setCPF(savedData.cpf || '');
            setRg(savedData.rg || '');
            setDataNascimento(savedData.dataNascimento || '');
            setEstadoCivil(savedData.estadoCivil || '');
            setSexo(savedData.sexo || '');
            setReligiao(savedData.religiao || '');
            setProfissao(savedData.profissao || '');
            setNaturalidade(savedData.naturalidade || '');
            setNacionalidade(savedData.nacionalidade || '');
            setTelefone1(savedData.telefone1 || '');
            setTelefone2(savedData.telefone2 || '');
            setEmail1(savedData.email1 || '');
            setEmail2(savedData.email2 || '');
        }
    }, [location.key]);

    // Salvar os dados no sessionStorage ao alterar os estados
    useEffect(() => {
        localStorage.setItem('dadosTitular', JSON.stringify({
            nome, cpf, rg, dataNascimento, estadoCivil, sexo, religiao, profissao, naturalidade, nacionalidade, telefone1, telefone2, email1, email2
        }));
    }, [nome, cpf, rg, dataNascimento, estadoCivil, sexo, religiao, profissao, naturalidade, nacionalidade, telefone1, telefone2, email1, email2]);

    // Função para atualizar o CPF com a formatação
    const handleCPFChange = (event) => {
        const cpfFormat = event.target.value;
        const cpfFinal = formatCPF(cpfFormat);
        setCPF(cpfFinal);
    };

    // Funções para formatar os números de telefone
    const handleTelefone1Change = (event) => {
        const formattedPhone = formatPhoneNumber(event.target.value);
        setTelefone1(formattedPhone);
    };

    const handleTelefone2Change = (event) => {
        const formattedPhone = formatPhoneNumber(event.target.value);
        setTelefone2(formattedPhone);
    };

    const isFormValid = nome && cpf && rg && dataNascimento && estadoCivil && sexo && religiao && profissao && naturalidade && nacionalidade && telefone1 && email1;

    const handleAvancar = () => {
        if (isFormValid) {
            const contratoNome = location.state?.contratoNome || localStorage.getItem('nomeContrato');

            if (contratoNome) {
                localStorage.setItem('nomeContrato', contratoNome);
                navigate('/novo-contrato/endereco', { replace: true, state: { contratoNome } });
            } else {
                console.error("contratoNome não está definido");
                alert("Erro: Nome do contrato não encontrado.");
            }
        }
    };

    const handleVoltar = () => navigate("/novo-contrato/dados-gerais");

    const handleEstadoCivil = (event) => {
        setEstadoCivil(event.target.value);
    };

    const handleSexo = (event) => {
        setSexo(event.target.value);
    };

    const handleReligiao = (event) => {
        setReligiao(event.target.value);
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
                            activeSection="dadosTitular"
                            disabledSections={['endereco', 'dependentes', 'dependentePet', 'assinatura']}
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
                                label="Titular do Plano"
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '37%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircleIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="CPF"
                                value={cpf}
                                size="small"
                                onChange={handleCPFChange}
                                placeholder="xxx.xxx.xxx-xx"
                                required
                                sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '30%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ContactEmergencyIcon />
                                        </InputAdornment>
                                    ),
                                    maxLength: 14
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="RG"
                                value={rg}
                                onChange={(e) => setRg(e.target.value)}
                                type="text"
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '50%', md : '40%', lg: '30%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AssignmentIndIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Data de Nascimento"
                                type="date"
                                value={dataNascimento}
                                onChange={(e) => setDataNascimento(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '64%', sm: '50%', md : '40%', lg: '22%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarMonthIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <SelectTextFields
                                width="120px"
                                icon={<PersonIcon fontSize="small" />}
                                label="Estado Civil"
                                value={estadoCivil || ""}
                                onChange={handleEstadoCivil}
                                options={filtroEstadoCivil}
                                fullWidth={false}
                                size="medium"
                                fontSize="1rem"
                                optionFontSize="0.75rem"
                            />
                            <SelectTextFields
                                width="150px"
                                icon={<PersonIcon fontSize="small" />}
                                label="Sexo"
                                value={sexo || ""}
                                onChange={handleSexo}
                                options={filtroSexo}
                                fullWidth={false}
                                size="medium"
                                fontSize="1rem"
                                optionFontSize="0.75rem"
                            />
                            <SelectTextFields
                                width="205px"
                                icon={<ChurchIcon fontSize="small" />}
                                label="Religião"
                                value={religiao || ""}
                                onChange={handleReligiao}
                                options={filtroReligiao}
                                fullWidth={false}
                                size="medium"
                                fontSize="1rem"
                                optionFontSize="0.75rem"
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Profissão"
                                value={profissao}
                                onChange={(e) => setProfissao(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '50%', md : '40%', lg: '37%' }, marginBottom: '10px', marginTop:{xs:'3%', sm: '0%', md : '0%', lg: '0%' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <WorkHistoryIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Naturalidade"
                                value={naturalidade}
                                onChange={(e) => setNaturalidade(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '49%', sm: '50%', md : '40%', lg: '30%' }, marginBottom: '10px', marginTop:{xs:'3%', sm: '0%', md : '0%', lg: '0%' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MapsHomeWorkIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Nacionalidade"
                                value={nacionalidade}
                                onChange={(e) => setNacionalidade(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '49%', sm: '50%', md : '40%', lg: '30%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FlagIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Telefone 1"
                                value={telefone1}
                                onChange={handleTelefone1Change}
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '50%', md : '40%', lg: '49.5%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AddIcCallIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Telefone 2"
                                value={telefone2}
                                onChange={handleTelefone2Change}
                                autoComplete="off"
                                sx={{ width: { xs: '43%', sm: '50%', md : '40%', lg: '49%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AddIcCallIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Email 1"
                                value={email1}
                                onChange={(e) => setEmail1(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '54%', sm: '50%', md : '40%', lg: '49.5%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            < MailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Email 2"
                                value={email2}
                                onChange={(e) => setEmail2(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '100%', sm: '50%', md : '40%', lg: '49%' }, marginBottom: '10px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <div className="w-full flex gap-2 items-end justify-end">
                            <ButtonComponent title="Voltar" subtitle={"Voltar"} startIcon={<ArrowBackIosNewIcon fontSize="small" />} onClick={handleVoltar} />
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

export default DadosTitular;