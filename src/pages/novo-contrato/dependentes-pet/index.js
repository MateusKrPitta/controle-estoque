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
import { ArticleOutlined, CloseRounded, PetsOutlined, PetsRounded } from "@mui/icons-material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import SelectTextFields from "../../../components/select";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DateRangeIcon from '@mui/icons-material/DateRange';

const DependentePet = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const contratoNome = location.state?.contratoNome || "Novo Contrato";
    const [nome, setNome] = useState("");
    const [especie, setEspecie] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [numero, setNumero] = useState("");
    const [cremacao, setCremacao] = useState("");
    const [raca, setRaca] = useState('');
    const [porte, setPorte] = useState("");
    const [dependentePet, setDependentePet] = useState([]); // Estado para armazenar dependentes

    const filtroPorte = [
        { value: "Grande", label: "Grande" },
        { value: "Pequeno", label: "Pequeno" },
    ];

    const filtroEspecie = [
        { value: "Gato", label: "Gato" },
        { value: "Cachorro", label: "Cachorro" },
    ];

    const filtroCremacao = [
        { value: "Sim", label: "Sim" },
        { value: "Não", label: "Não" },
    ];

    const filtroRaca = [
        { value: "Pintcher", label: "Pintcher" },
        { value: "Buldog", label: "Buldog" },
        { value: "Golden", label: "Golden" },
    ];

    const handleVoltar = () => {
        // Salvar os dados no localStorage antes de voltar
        localStorage.setItem(
            "dadosDependentePet",
            JSON.stringify({
                numero,
                dependentePet,
            })
        );
        navigate("/novo-contrato/dependentes");
    };

    const handleAvancar = () => {
        // Salvar os dados no sessionStorage para a próxima página (Assinatura)
        localStorage.setItem(
            "dadosDependentePet",
            JSON.stringify({
                numero,
                dependentePet, // Adicionando dependentes ao sessionStorage
            })
        );
        navigate("/novo-contrato/assinatura", { state: { contratoNome } }); // Passando o contratoNome
    };



    useEffect(() => {
        // Recuperar dados do sessionStorage ao montar o componente
        const savedData = JSON.parse(localStorage.getItem("dadosDependentePet"));
        if (savedData) {
            setNumero(savedData.numero || "");
            setDependentePet(savedData.dependentePet || []); // Corrigido para 'dependentePet'
        }
    }, []);

    const handleEspecie = (event) => {
        setEspecie(event.target.value);
    };

    const handleRaca = (event) => {
        setRaca(event.target.value);
    };

    const handlePorte = (event) => {
        setPorte(event.target.value);
    };

    const handleCremacao = (event) => {
        setCremacao(event.target.value);
    };

    const handleAddDependente = () => {
        if (raca && especie && dataNascimento && nome && porte) { // Verifique se todos os campos estão preenchidos
            const newDependentePet = { raca, especie, dataNascimento, nome, porte }; // Adicione a data de nascimento aqui
            const updatedDependentes = [...dependentePet, newDependentePet];
            setDependentePet(updatedDependentes);
            localStorage.setItem("dadosDependentePet", JSON.stringify({ dependentePet: updatedDependentes, numero })); // Salvar dependentes // no localStorage
            setRaca('');
            setEspecie(''); // Limpar o campo de parentesco
            setNome(''); // Limpar o campo de nome
            setDataNascimento(''); // Limpar o campo de data de nascimento
            setPorte('')
        }
    };

    const handleRemoveDependente = (index) => {
        const newDependentePet = dependentePet.filter((_, i) => i !== index);
        setDependentePet(newDependentePet);
        localStorage.setItem("dadosDependentePet", JSON.stringify({ dependentePet: newDependentePet, numero })); // Atualizar o localStorage
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
                            activeSection="dependentePet"
                            disabledSections={['assinatura']} // Apenas a seção 'assinatura' deve estar desabilitada
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
                            <SelectTextFields
                                width="178px"
                                icon={<PetsOutlined fontSize="small" />}
                                label="Raça"
                                value={raca || ""}
                                onChange={handleRaca}
                                options={filtroRaca}
                                fullWidth={false}
                                size="medium"
                                fontSize="1rem"
                                optionFontSize="0.75rem"
                            />

                            <SelectTextFields
                                width="178px"
                                icon={<PetsOutlined fontSize="small" />}
                                label="Espécie"
                                value={especie || ""}
                                onChange={handleEspecie}
                                options={filtroEspecie}
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

                            <SelectTextFields
                                width="210px"
                                icon={<PetsRounded fontSize="small" />}
                                label="Porte"
                                value={porte || ""}
                                onChange={handlePorte}
                                options={filtroPorte}
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
                            {dependentePet.map((dependentesPet, index) => (
                                <div key={index} className="flex flex-col w-[40%] md:w-[24%] gap-1 items-start p-2 border rounded">
                                    <div className="w-full flex ">
                                        <label className="w-[90%] text-xs flex items-center font-semibold gap-1"> <PetsOutlined style={{ color: '#006b33' }} fontSize="small" />{dependentesPet.nome}</label>
                                        <button onClick={() => handleRemoveDependente(index)} >
                                            <CloseRounded />
                                        </button>
                                    </div>
                                    <div className="gap-2 flex flex-col">
                                        <label className="w-[100%] text-xs flex items-center gap-1"> Raça: {dependentesPet.raca}</label>
                                        <label className="w-[100%] text-xs flex items-center gap-1"> Espécie: {dependentesPet.especie}</label>
                                        <label className="w-[100%] text-xs flex items-center gap-1"> Data de Nascimento: {dependentesPet.dataNascimento}</label>
                                        <label className="w-[100%] text-xs flex items-center gap-1"> Porte: {dependentesPet.porte}</label>
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
                                onClick={handleAvancar}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DependentePet;