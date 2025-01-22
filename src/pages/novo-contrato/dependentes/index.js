import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { InputAdornment, TextField } from "@mui/material";
import HeaderPerfil from "../../../components/navbars/perfil";
import Navbar from "../../../components/navbars/header";
import HeaderNovoContrato from "../../../components/navbars/novo-contrato";
import ButtonComponent from "../../../components/button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MenuMobile from "../../../components/menu-mobile";
import { ArticleOutlined, CloseRounded } from "@mui/icons-material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import SelectTextFields from "../../../components/select";
import { formatCPF } from "../../../utils/formatCPF";
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DateRangeIcon from '@mui/icons-material/DateRange';

const Dependentes = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const contratoNome = location.state?.contratoNome || "Novo Contrato";
    const [nome, setNome] = useState("");
    const [parentesco, setParentesco] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [numero, setNumero] = useState("");
    const [cremacao, setCremacao] = useState("");
    const [cpf, setCPF] = useState('');
    const [dependentes, setDependentes] = useState([]); // Estado para armazenar dependentes

    const filtroParentesco = [
        { value: "Pai", label: "Pai" },
        { value: "Filho(a)", label: "Filho(a)" },
        { value: "Mãe", label: "Mãe" },
    ];

    const filtroCremacao = [
        { value: "Sim", label: "Sim" },
        { value: "Não", label: "Não" },
    ];

    const handleVoltar = () => {
        // Salvar os dados no localStorage antes de voltar
        localStorage.setItem(
            "dadosDependentes",
            JSON.stringify({
                numero,
                dependentes,
            })
        );
        navigate("/novo-contrato/endereco");
    };

    const handleAvancar = () => {
        // Salvar os dados no sessionStorage para a próxima página (Assinatura)
        localStorage.setItem(
            "dadosDependentes",
            JSON.stringify({
                numero,
                dependentes, // Adicionando dependentes ao sessionStorage
            })
        );
        navigate("/novo-contrato/dependente-pet", { state: { contratoNome } }); // Passando o contratoNome
    };

    // Função para atualizar o CPF com a formatação
    const handleCPFChange = (event) => {
        const cpfFormat = event.target.value;
        const cpfFinal = formatCPF(cpfFormat);
        setCPF(cpfFinal);
    };

    useEffect(() => {
        // Recuperar dados do localStorage ao montar o componente
        const savedData = JSON.parse(localStorage.getItem("dadosDependentes"));
        if (savedData) {
            setNumero(savedData.numero || "");
            setDependentes(savedData.dependentes || []); // Recuperando dependentes do localStorage
        }
    }, []);

    const isEnderecoValid = numero;

    const handleParentesco = (event) => {
        setParentesco(event.target.value);
    };

    const handleCremacao = (event) => {
        setCremacao(event.target.value);
    };

    const handleAddDependente = () => {
        if (cpf && parentesco && dataNascimento && nome) { // Verifique se todos os campos estão preenchidos
            const newDependente = { cpf, parentesco, dataNascimento, nome }; // Adicione a data de nascimento aqui
            const updatedDependentes = [...dependentes, newDependente];
            setDependentes(updatedDependentes);
            localStorage.setItem("dadosDependentes", JSON.stringify({ dependentes: updatedDependentes, numero })); // Salvar dependentes // no localStorage
            setCPF(''); // Limpar o campo de CPF
            setParentesco(''); // Limpar o campo de parentesco
            setNome(''); // Limpar o campo de nome
            setDataNascimento(''); // Limpar o campo de data de nascimento
        }
    };

    const handleRemoveDependente = (index) => {
        const newDependentes = dependentes.filter((_, i) => i !== index);
        setDependentes(newDependentes);
        localStorage.setItem("dadosDependentes", JSON.stringify({ dependentes: newDependentes, numero })); // Atualizar o localStorage
    };

    const isDependenteValid = dependentes.length > 0;
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
                            activeSection="dependentes"
                            disabledSections={['dependentePet','assinatura']} // Apenas a seção 'assinatura' deve estar desabilitada
                            handleNavigation={(section) => navigate(`/novo-contrato/${section}`)}
                        />
                    </div>

                    <div className=" w-[100%] p-3 flex flex-col gap-3 md:w-[70%] ">
                        <div className="w-[100%] flex gap-2 p-5 rounded-xl flex-wrap" style={{ border: "1px solid #d9d9d9" }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Nome"
                                required
                                autoComplete="off"
                                sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '30%' }, marginBottom: '16px', fontSize: '12px' }}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)} // Added margin for spacing
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
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
                                sx={{ width: { xs: '40%', sm: '50%', md: '40%', lg: '30%' }, marginBottom: '16px', fontSize: '12px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ContactEmergencyIcon />
                                        </InputAdornment>
                                    ),
                                    maxLength: 14
                                }}
                            />

                            <SelectTextFields
                                width="210px"
                                icon={<PersonAddAlt1Icon fontSize="small" />}
                                label="Parentesco"
                                value={parentesco || ""}
                                onChange={handleParentesco}
                                options={filtroParentesco}
                                fullWidth={false}
                                size="medium"
                                fontSize="1rem"
                                optionFontSize="0.75rem"
                            />

                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Data de Nascimento"
                                type="date"
                                autoComplete="off"
                                sx={{ width: { xs: '40%', sm: '50%', md: '40%', lg: '30%' }, fontSize: '12px' }}
                                value={dataNascimento}
                                required
                                onChange={(e) => setDataNascimento(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRangeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <SelectTextFields
                                width="210px"
                                icon={<PersonAddAlt1Icon fontSize="small" />}
                                label="Optou por cremação"
                                value={cremacao || ""}
                                onChange={handleCremacao}
                                options={filtroCremacao}
                                fullWidth={false}
                                size="medium"
                                fontSize="1rem"
                                optionFontSize="0.75rem"
                            />

                            <ButtonComponent
                                endIcon={<AddCircleOutlineIcon fontSize="small" />}
                                title="Adicionar"
                                subtitle="Adicionar"
                                buttonSize="large"
                                onClick={handleAddDependente}
                            />
                        </div>

                        {/* Lista de Dependentes */}
                        <div className="w-full flex  gap-2 flex-wrap">
                            {dependentes.map((dependente, index) => (
                                <div key={index} className="flex flex-col w-[40%] md:w-[24%] gap-1 items-start p-2 border rounded">
                                    <div className="w-full flex ">
                                        <label className="w-[90%] text-xs flex items-center font-semibold gap-1"> <PersonIcon style={{ color: '#006b33' }} fontSize="small" />{dependente.nome}</label>
                                        <button onClick={() => handleRemoveDependente(index)} >
                                            <CloseRounded />
                                        </button>
                                    </div>
                                    <div className="gap-2 flex flex-col">
                                        <label className="w-[100%] text-xs flex items-center gap-1"> CPF: {dependente.cpf}</label>
                                        <label className="w-[100%] text-xs flex items-center gap-1"> Parentesco: {dependente.parentesco}</label>
                                        <label className="w-[100%] text-xs flex items-center gap-1"> Data de Nascimento: {dependente.dataNascimento}</label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="w-full flex gap-2 items-end justify-end">
                            <ButtonComponent title="Voltar" subtitle={"Voltar"} startIcon={<ArrowBackIosNewIcon fontSize="small" />} onClick={handleVoltar} />
                            <ButtonComponent
                                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                                title="Avançar"
                                subtitle="Avançar"
                                buttonSize="large"
                                disabled={!isDependenteValid}
                                onClick={handleAvancar}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dependentes;