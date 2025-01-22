import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormControl, FormControlLabel, InputAdornment, InputLabel, ListItemIcon, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { fetchCidadesPorEstado } from "../../../services/api";
import { buscarEnderecoPorCEP, formatCEP, primeiraLetraMaiuscula } from "../../../utils/functions";
import CustomToast from "../../../components/toast";
import estadosJSON from "../../../utils/json/estados.json";
import HeaderPerfil from "../../../components/navbars/perfil";
import Navbar from "../../../components/navbars/header";
import HeaderNovoContrato from "../../../components/navbars/novo-contrato";
import ButtonComponent from "../../../components/button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MenuMobile from "../../../components/menu-mobile";
import { AccessTime, ArticleOutlined, DataArray, DateRange, LockClock, MoneyOffCsred, MoneyOutlined, PunchClock } from "@mui/icons-material";
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import PersonIcon from '@mui/icons-material/Person';
import SelectTextFields from "../../../components/select";
import AddRoadIcon from '@mui/icons-material/AddRoad';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';

const Endereco = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [CEP, setCEP] = useState("");
    const [bairro, setBairro] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [estado2, setEstado2] = useState("");
    const [cidades2, setCidades2] = useState([]);
    const [cidadesCobranca, setCidadesCobranca] = useState([]);
    const [cidadeAtual2, setCidadeAtual2] = useState("");
    const [numero, setNumero] = useState("");
    const [estadosCobrancaList, setEstadosCobrancaList] = useState([]);
    const [estadosList, setEstadosList] = useState([]);
    const [tipoLogradouro, setTipoLogradouro] = useState('');
    const [tipoLogradouroCobranca, setTipoLogradouroCobranca] = useState('');
    const [logradouroCobranca, setLogradouroCobranca] = useState('');
    const [quadraResidencial, setQuadraResidencial] = useState('');
    const [loteResidencial, setLoteResidencial] = useState('');
    const [complementoResidencial, setComplementoResidencial] = useState('');
    const [quadraCobranca, setQuadraCobranca] = useState('');
    const [complementoCobranca, setComplementoCobranca] = useState('');
    const [loteCobranca, setLoteCobranca] = useState('');
    const [numeroCobranca, setNumeroCobranca] = useState('');
    const [bairroCobranca, setBairroCobranca] = useState('');
    const [cidadeCobranca, setCidadeCobranca] = useState('');
    const [estadoCobranca, setEstadoCobranca] = useState('');
    const [cepCobranca, setCepCobranca] = useState('');
    const [crecamacao, setCrecamacao] = useState('');
    const [tipoCobranca, setTipoCobranca] = useState('');
    const [empresaFilial, setEmpresaFilial] = useState('');
    const [primeiraMensalidade, setPrimeiraMensalidade] = useState('');
    const [melhorHorario, setMelhorHorario] = useState('');
    const [diaVencimento, setDiaVencimento] = useState('');
    const [isMesmoEndereco, setIsMesmoEndereco] = useState(false); // Novo estado para controlar o RadioButton


    const contratoNome = location.state?.contratoNome || "Novo Contrato";
    const filtroLogradouro = [
        { value: "Rua", label: "Rua" },
        { value: "Estrada", label: "Estrada" },
    ];

    const filtroCremacao = [
        { value: "Sim", label: "Sim" },
        { value: "Não", label: "Não" },
    ];

    const filtroLogradouroCobranca = [
        { value: "Rua", label: "Rua" },
        { value: "Estrada", label: "Estrada" },
    ];

    const buscarEndereco = async (cep) => {
        if (cep.length === 8) {
            try {
                const endereco = await buscarEnderecoPorCEP(cep);
                if (endereco) {
                    setEstado2(endereco.estado || "");
                    setLogradouro(endereco.rua || "");
                    setBairro(endereco.bairro || "");
                    setCidadeAtual2(endereco.cidade || "");

                    const estadoSelecionado = estadosJSON.estados.find(
                        (estado) => estado.sigla === endereco.estado
                    );
                    setCidades2(estadoSelecionado ? estadoSelecionado.cidades : []);
                } else {
                    CustomToast({ type: "error", message: "CEP não encontrado ou inválido." });
                }
            } catch (error) {
                CustomToast({ type: "error", message: "Erro ao buscar o endereço." });
            }
        }
    };

    const buscarEnderecoCobranca = async (cep) => {
        if (cep.length === 8) {
            try {
                const endereco = await buscarEnderecoPorCEP(cep);
                if (endereco) {
                    setEstadoCobranca(endereco.estado || "");
                    setLogradouroCobranca(endereco.rua || "");
                    setBairroCobranca(endereco.bairro || "");
                    setCidadeCobranca(endereco.cidade || "");

                    // Atualiza a lista de cidades com base no estado retornado
                    const estadoCobrancaSelecionado = estadosJSON.estados.find(
                        (estado) => estado.sigla === endereco.estado
                    );
                    setCidadesCobranca(estadoCobrancaSelecionado ? estadoCobrancaSelecionado.cidades : []);
                } else {
                    CustomToast({ type: "error", message: "CEP não encontrado ou inválido." });
                }
            } catch (error) {
                CustomToast({ type: "error", message: "Erro ao buscar o endereço." });
            }
        }
    };

    const handleEstado2Change = async (event) => {
        const uf = event.target.value;
        setEstado2(uf);

        try {
            const cidadesOrdenadas = await fetchCidadesPorEstado(uf);
            setCidades2(cidadesOrdenadas);
        } catch (error) {
            CustomToast({ type: "warning", message: error.message });
        }
    };

    const handleVoltar = () => navigate("/novo-contrato/dados-titular");

    const handleAvancar = () => {

            const contratoNome = location.state?.contratoNome || localStorage.getItem('nomeContrato');

            if (contratoNome) {
                localStorage.setItem('nomeContrato', contratoNome);
                localStorage.setItem('mesmoEndereco', isMesmoEndereco);
                navigate('/novo-contrato/dependentes', { replace: true, state: { contratoNome } });
            } else {
                console.error("contratoNome não está definido");
                alert("Erro: Nome do contrato não encontrado.");
            }
    };

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem("dadosEndereco"));
        if (savedData) {
            setCEP(savedData.CEP || "");
            setBairro(savedData.bairro || "");
            setLogradouro(savedData.logradouro || "");
            setEstado2(savedData.estado2 || "");
            setCidadeAtual2(savedData.cidadeAtual2 || "");
            setNumero(savedData.numero || "");
            setQuadraResidencial(savedData.quadraResidencial || "");
            setLoteResidencial(savedData.loteResidencial || "");
            setComplementoResidencial(savedData.complementoResidencial || "");
            setTipoLogradouroCobranca(savedData.tipoLogradouroCobranca || "");
            setLogradouroCobranca(savedData.logradouroCobranca || "");
            setNumeroCobranca(savedData.numeroCobranca || "");
            setQuadraCobranca(savedData.quadraCobranca || "");
            setLoteCobranca(savedData.loteCobranca || "");
            setComplementoCobranca(savedData.complementoCobranca || "");
            setBairroCobranca(savedData.bairroCobranca || "");
            setCidadeCobranca(savedData.cidadeCobranca || "");
            setEstadoCobranca(savedData.estadoCobranca || "");
            setCepCobranca(savedData.cepCobranca || "");
            setCrecamacao(savedData.crecamacao || "");
            setTipoCobranca(savedData.tipoCobranca || "");
            setEmpresaFilial(savedData.empresaFilial || "");
            setPrimeiraMensalidade(savedData.primeiraMensalidade || "");
            setMelhorHorario(savedData.melhorHorario || "");
            setDiaVencimento(savedData.diaVencimento || "");
        }

        setEstadosList(estadosJSON.estados);
        setEstadosCobrancaList(estadosJSON.estados);
    }, [location.key]);

    useEffect(() => {
        localStorage.setItem('dadosEndereco', JSON.stringify({
            CEP, bairro, logradouro, estado2, cidadeAtual2, numero, quadraResidencial, loteResidencial, complementoResidencial, tipoLogradouroCobranca, logradouroCobranca, numeroCobranca, quadraCobranca, loteCobranca, complementoCobranca, bairroCobranca, cidadeCobranca, estadoCobranca, cepCobranca, crecamacao, tipoCobranca, empresaFilial, primeiraMensalidade, melhorHorario, diaVencimento
        }));
    }, [CEP, bairro, logradouro, estado2, cidadeAtual2, numero, quadraResidencial, loteResidencial, complementoResidencial, tipoLogradouroCobranca, logradouroCobranca, numeroCobranca, quadraCobranca, loteCobranca, complementoCobranca, bairroCobranca, cidadeCobranca, estadoCobranca, cepCobranca, crecamacao, tipoCobranca, empresaFilial, primeiraMensalidade, melhorHorario, diaVencimento]);

    const isEnderecoValid = CEP && logradouro && tipoLogradouro && primeiraMensalidade && bairro && estado2 && cidadeAtual2 && numero && tipoCobranca && primeiraMensalidade && melhorHorario && diaVencimento;

    const handleLogradouro = (event) => {
        setTipoLogradouro(event.target.value);
    };

    const handleLogradouroCobranca = (event) => {
        setTipoLogradouroCobranca(event.target.value);
    };

    const handleCremacao = (event) => {
        setCrecamacao(event.target.value);
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
                            activeSection="endereco"
                            disabledSections={['dependentes', 'dependentePet', 'assinatura']}
                            handleNavigation={(section) => navigate(`/novo-contrato/${section}`)}
                        />
                    </div>

                    <div className=" w-[100%] p-3 flex flex-col gap-3 md:w-[70%] ">
                        <div className="w-[100%] flex gap-2 p-5 rounded-xl flex-wrap" style={{ border: "1px solid #d9d9d9" }}>
                            <TextField
                                label="CEP Residencial"
                                value={formatCEP(CEP)}
                                size="small"
                                onChange={(e) => {
                                    const newCEP = e.target.value;
                                    setCEP(newCEP);
                                    buscarEndereco(newCEP);
                                }}
                                placeholder="CEP"
                                required
                                inputProps={{ maxLength: 9 }}
                                sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '24%' }, marginBottom: '16px', fontSize: '12px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <SelectTextFields
                                width="180px"
                                icon={<AddRoadIcon fontSize="small" />}
                                label="Tipo Logradouro Residencial"
                                value={tipoLogradouro || ""}
                                onChange={handleLogradouro}
                                options={filtroLogradouro}
                                fullWidth={false}
                                size="medium"
                                fontSize="1rem"
                                optionFontSize="0.75rem"
                            />

                            <TextField
                                size="small"
                                label="Logradouro"
                                placeholder="Logradouro"
                                type="text"
                                value={logradouro}
                                required
                                onChange={(e) => setLogradouro(primeiraLetraMaiuscula(e.target.value))}
                                sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '35%' }, marginBottom: '16px', fontSize: '12px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                size="small"
                                label="Número"
                                placeholder="Número"
                                type="number"
                                value={numero}
                                required
                                onChange={(e) => setNumero(e.target.value)}
                                sx={{ width: { xs: '23%', sm: '50%', md: '40%', lg: '15%' }, marginBottom: '16px', fontSize: '12px' }}
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
                                label="Complemento Residencial"
                                value={complementoResidencial}
                                onChange={(e) => setComplementoResidencial(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '35%' }, marginBottom: '16px', fontSize: '12px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                size="small"
                                label="Bairro"
                                placeholder="Bairro Residencial"
                                required
                                type="text"
                                value={bairro}
                                onChange={(e) => setBairro(primeiraLetraMaiuscula(e.target.value))}
                                sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '42%' }, marginBottom: '16px', fontSize: '12px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <FormControl size="small" sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' }, marginBottom: '16px', fontSize: '12px' }} variant="outlined" required>
                                <InputLabel>Cidade </InputLabel>
                                <Select
                                    value={cidadeAtual2}
                                    onChange={(e) => setCidadeAtual2(e.target.value)}
                                    label="Cidade"
                                    renderValue={(selected) => (
                                        <div className="flex items-center">
                                            <EmojiFlagsIcon sx={{ color: "red" }} className="mr-2" />
                                            {selected}
                                        </div>
                                    )}
                                >
                                    {cidades2.map((cidade, index) => (
                                        <MenuItem key={index} value={cidade}>
                                            <ListItemIcon>
                                                <LocationOnIcon />
                                            </ListItemIcon>
                                            {cidade}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '40%' }, marginBottom: '16px', fontSize: '12px' }} variant="outlined" required>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={estado2}
                                    onChange={handleEstado2Change}
                                    label="Estado"
                                    renderValue={(selected) => (
                                        <div className="flex items-center">
                                            <FlagCircleIcon sx={{ color: "red" }} className="mr-2" />
                                            {estadosList.find((estado) => estado.sigla === selected)?.nome}
                                        </div>
                                    )}
                                >
                                    {estadosList.map((estado, index) => (
                                        <MenuItem key={index} value={estado.sigla}>
                                            <ListItemIcon>
                                                <LocationOnIcon sx={{ color: "blue" }} />
                                            </ListItemIcon>
                                            {estado.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Quadra Residencial"
                                autoComplete="off"
                                type="number"
                                value={quadraResidencial}
                                onChange={(e) => setQuadraResidencial(e.target.value)}
                                sx={{ width: { xs: '35%', sm: '50%', md: '40%', lg: '19%' }, marginBottom: ' 16px', fontSize: '12px' }}
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
                                type="number"
                                size="small"
                                label="Lote Residencial"
                                autoComplete="off"
                                value={loteResidencial}
                                onChange={(e) => setLoteResidencial(e.target.value)}
                                sx={{ width: { xs: '37%', sm: '50%', md: '40%', lg: '20%' }, marginBottom: '16px', fontSize: '12px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <OtherHousesIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />


<div className="w-[100%]">
                                <FormControl component="fieldset">
                                    <RadioGroup row value={isMesmoEndereco} onChange={(e) => setIsMesmoEndereco(e.target.value === 'true')}>
                                        <FormControlLabel value={true} control={<Radio />} label="Mesmo endereço comercial" />
                                        <FormControlLabel value={false} control={<Radio />} label="Endereço diferente" />
                                    </RadioGroup>
                                </FormControl>
                            </div>

                            <div className="w-[100%] flex gap-2 rounded-xl flex-wrap">
                                {!isMesmoEndereco && (
                                    <>
                                        <TextField
                                            label="CEP Comercial"
                                            value={formatCEP(cepCobranca)}
                                            size="small"
                                            onChange={(e) => {
                                                const newCEPComercial = e.target.value;
                                                setCepCobranca(newCEPComercial);
                                                buscarEnderecoCobranca(newCEPComercial);
                                            }}
                                            placeholder="CEP Comercial"
                                            inputProps={{ maxLength: 9 }}
                                            sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '24%' }, marginBottom: '16px', fontSize: '12px' }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocationOnIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        <SelectTextFields
                                            width="180px"
                                            icon={<AddRoadIcon fontSize="small" />}
                                            label="Tipo Logradouro Comercial"
                                            value={tipoLogradouroCobranca || ""}
                                            onChange={handleLogradouroCobranca}
                                            options={filtroLogradouroCobranca}
                                            fullWidth={false}
                                            size="medium"
                                            fontSize="1rem"
                                            optionFontSize="0.75rem"
                                        />

                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Logradouro Comercial"
                                            autoComplete="off"
                                            value={logradouroCobranca}
                                            required
                                            onChange={(e) => setLogradouroCobranca(primeiraLetraMaiuscula(e.target.value))}
                                            sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '35%' }, marginBottom: '16px', fontSize: '12px' }}
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
                                            type="number"
                                            label="Número Comercial"
                                            value={numeroCobranca}
                                            onChange={(e) => setNumeroCobranca(e.target.value)}
                                            autoComplete="off"
                                            sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '15%' }, marginBottom: '16px', fontSize: '12px' }}
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
                                            label="Complemento Comercial"
                                            value={complementoCobranca}
                                            onChange={(e) => setComplementoCobranca(e.target.value)}
                                            autoComplete="off"
                                            sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '35%' }, marginBottom: '16px', fontSize: '12px' }}
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
                                            label="Bairro Comercial"
                                            autoComplete="off"
                                            value={bairroCobranca}
                                            onChange={(e) => setBairroCobranca(primeiraLetraMaiuscula(e.target.value))}
                                            sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '42%' }, marginBottom: '16px', fontSize: '12px' }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <FormControl size="small" sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' }, marginBottom: '16px', fontSize: '12px' }} variant="outlined" required>
                                            <InputLabel>Cidade Comercial</InputLabel>
                                            <Select
                                                value={cidadeCobranca}
                                                onChange={(e) => setCidadeCobranca(e.target.value)}
                                                label="Cidade Comercial"
                                                renderValue={(selected) => (
                                                    <div className="flex items-center">
                                                        <EmojiFlagsIcon sx={{ color: "red" }} className="mr-2" />
                                                        {selected}
                                                    </div>
                                                )}
                                            >
                                                {cidadesCobranca.map((cidadesCobrancas, index) => (
                                                    <MenuItem key={index} value={cidadesCobrancas}>
                                                        <ListItemIcon>
                                                            <LocationOnIcon />
                                                        </ListItemIcon>
                                                        {cidadesCobrancas}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl size="small" sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '40%' }, marginBottom: '16px', fontSize: '12px' }} variant="outlined" required>
                                            <InputLabel>Estado</InputLabel>
                                            <Select
                                                value={estadoCobranca}
                                                onChange={handleEstado2Change}
                                                label="Estado"
                                                renderValue={(selected) => (
                                                    <div className="flex items-center">
                                                        <FlagCircleIcon sx={{ color: "red" }} className="mr-2" />
                                                        {estadosCobrancaList.find((estadoCobranca) => estadoCobranca.sigla === selected)?.nome}
                                                    </div>
                                                )}
                                            >
                                                {estadosCobrancaList.map((estadoCobranca, index) => (
                                                    <MenuItem key={index} value={estadoCobranca.sigla}>
                                                        <ListItemIcon>
                                                            <LocationOnIcon sx={{ color: "blue" }} />
                                                        </ListItemIcon>
                                                        {estadoCobranca.nome}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>



                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Quadra Comercial"
                                            type="number"
                                            value={quadraCobranca}
                                            onChange={(e) => setQuadraCobranca(e.target.value)}
                                            autoComplete="off"
                                            sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '18%' }, marginBottom: '16px', fontSize: '12px' }}
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
                                            label="Lote Comercial"
                                            autoComplete="off"
                                            value={loteCobranca}
                                            onChange={(e) => setLoteCobranca(e.target.value)}
                                            type="number"
                                            sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '20%' }, marginBottom: '16px', fontSize: '12px' }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocationOnIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </>
                                )}
                            </div>

                            <div className="w-[100%] flex gap-2 rounded-xl flex-wrap">
                                

                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Tipo de Cobrança"
                                    autoComplete="off"
                                    value={tipoCobranca}
                                    onChange={(e) => setTipoCobranca(e.target.value)}
                                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '33%' }, marginBottom: '16px', fontSize: '12px' }}
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
                                    label="Empresa Antiga/Filial"
                                    autoComplete="off"
                                    value={empresaFilial}
                                    onChange={(e) => setEmpresaFilial(e.target.value)}
                                    sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '32%' }, marginBottom: '16px', fontSize: '12px' }}
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
                                    label="Primeira Mensalidade"
                                    autoComplete="off"
                                    type="date"
                                    value={primeiraMensalidade}
                                    onChange={(e) => setPrimeiraMensalidade(e.target.value)}
                                    sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '32%' }, marginBottom: '16px', fontSize: '12px' }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MoneyOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Melhor Horário"
                                    autoComplete="off"
                                    value={melhorHorario}
                                    onChange={(e) => setMelhorHorario(e.target.value)}
                                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '33%' }, marginBottom: '16px', fontSize: '12px' }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccessTime />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Dia de Vencimento Novo"
                                    autoComplete="off"
                                    type="date"
                                    value={diaVencimento}
                                    onChange={(e) => setDiaVencimento(e.target.value)}
                                    sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '32%' }, marginBottom: '16px', fontSize: '12px' }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DateRange />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>
                        <div className="w-full flex gap-2 items-end justify-end">
                            <ButtonComponent title="Voltar" subtitle={"Voltar"} startIcon={<ArrowBackIosNewIcon fontSize="small" />} onClick={handleVoltar} />
                            <ButtonComponent
                                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                                title="Avançar"
                                subtitle="Avançar"
                                buttonSize="large"
                                disabled={!isEnderecoValid}
                                onClick={handleAvancar}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Endereco;