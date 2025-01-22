import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../../components/navbars/header";
import HeaderPerfil from "../../../components/navbars/perfil";
import HeaderNovoContrato from "../../../components/navbars/novo-contrato";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ButtonComponent from "../../../components/button";
import CustomToast from "../../../components/toast";
import './assinatura.css';
import MenuMobile from "../../../components/menu-mobile";
import { ArticleOutlined } from "@mui/icons-material";

const Assinatura = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const contratoNome = location.state?.contratoNome || "Novo Contrato";
    const [dadosGerais, setDadosGerais] = useState({});
    const [dadosTitular, setDadosTitular] = useState({});
    const [dadosEndereco, setDadosEndereco] = useState({});
    const [dadosDependentes, setDadosDependentes] = useState([]);
    const [dadosDependentePet, setDadosDependentePet] = useState([]);
    const [nomeContrato, setNomeContrato] = useState('');
    const contratoRef = useRef();
    const [isPdfGenerated, setIsPdfGenerated] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [contratoData, setContratoData] = useState(null); // Novo estado para contratoData

    useEffect(() => {
        const savedGerais = JSON.parse(localStorage.getItem("dadosGerais"));
        const savedTitular = JSON.parse(localStorage.getItem("dadosTitular"));
        const savedEndereco = JSON.parse(localStorage.getItem("dadosEndereco"));
        const savedDependentes = JSON.parse(localStorage.getItem("dadosDependentes"));
        const savedDependentePet = JSON.parse(localStorage.getItem("dadosDependentePet"));
        const savedContrato = localStorage.getItem("nomeContrato");

        if (savedGerais) {
            setDadosGerais(savedGerais);
        }

        if (savedTitular) {
            setDadosTitular(savedTitular);
        }

        if (savedEndereco) {
            setDadosEndereco(savedEndereco);
        }

        if (savedDependentes) {
            setDadosDependentes(savedDependentes.dependentes || []); // Certifique-se de acessar a propriedade correta
        }

        if (savedDependentePet) {
            setDadosDependentePet(savedDependentePet.dependentePet || []); // Certifique-se de acessar a propriedade correta
        }

        if (savedContrato) {
            setNomeContrato(savedContrato);
        }
    }, []);

    const handleGeneratePdf = () => {
        const doc = new jsPDF();
        doc.setFontSize(10);
        doc.html(contratoRef.current, {
            callback: function (doc) {
                doc.save("contrato.pdf");
                setIsPdfGenerated(true);
            },
            margin: [10, 10, 10, 10],
            x: 10,
            y: 10,
            html2canvas: { scale: 0.3 },
        });
    };

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const handleSave = () => {
        const newContratoData = {
            ID: new Date().getTime(), // Gera um ID único baseado no timestamp
            nomeContrato,
            dadosGerais,
            dadosTitular,
            dadosEndereco,
            dadosDependentes,
            dadosDependentePet,
            dataContrato: new Date().toLocaleDateString("pt-BR"),
            status: "Assinatura Pendente",
        };

        // Atualiza o estado do contratoData
        setContratoData(newContratoData);

        // Recupera os contratos existentes do localStorage
        const existingContratos = JSON.parse(localStorage.getItem("contratosPendentes")) || [];

        // Adiciona o novo contrato ao array existente
        existingContratos.push(newContratoData);

        // Salva o array atualizado no localStorage
        localStorage.setItem("contratosPendentes", JSON.stringify(existingContratos));

        CustomToast({ type: "success", message: "Contrato salvo com sucesso!" });
        setIsSaved(true);
    };

    const handleCopyLink = (contratoId) => {
        const link = `${window.location.origin}/visualizar-contrato/${contratoId}`; // Inclui o ID do contrato no link
        navigator.clipboard.writeText(link);
        CustomToast({ type: "success", message: "Link copiado!" });
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
                            activeSection="assinatura"
                            disabledSections={[]}
                            handleNavigation={(section) => navigate(`/novo-contrato/${section}`)}
                        />
                    </div>
                    <div className="w-[75%] flex flex-col gap-3">
                        <div className="w-[100%] flex gap-2 p-5 rounded-xl flex-wrap justify-center flex-col pdf-content" style={{ border: "1px solid #d9d9d9" }} ref={contratoRef}>
                            <h2>Contrato</h2>
                            <p>Template: {nomeContrato}</p>
                            <p>Tipo do Contrato: {dadosGerais.tipoContrato}</p>
                            <p>Data do Contrato: {dadosGerais.dataContrato}</p>
                            <p>Unidade Pax: {dadosGerais.unidadePax}</p>
                            <p>Contrato: {dadosGerais.contrato}</p>
                            <p>Plano: {dadosGerais.nomeContrato}</p>
                            <p>Data Contrato: {dadosGerais.dataContrato}</p>
                            

                            <h2>Dados do Titular</h2>
                            <p>Nome: {dadosTitular.nome}</p>
                            <p>CPF: {dadosTitular.cpf}</p>
                            <p>RG: {dadosTitular.rg}</p>
                            <p>Data de Nascimento: {dadosTitular.dataNascimento}</p>
                            <p>Estado Civil: {dadosTitular.estadoCivil}</p>
                            <p>Sexo: {dadosTitular.sexo}</p>
                            <p>Religiao: {dadosTitular.religiao}</p>
                            <p>Profissão: {dadosTitular.profissao}</p>
                            <p>Naturalidade: {dadosTitular.naturalidade}</p>
                            <p>Nacionalidade: {dadosTitular.nacionalidade}</p>
                            <p>Telefone 1: {dadosTitular.telefone1}</p>
                            <p>Telefone 2: {dadosTitular.telefone2}</p>
                            <p>Email 1: {dadosTitular.email1}</p>
                            <p>Email 2: {dadosTitular.email2}</p>

                            <h2>Endereço</h2>
                            <p>CEP: {dadosEndereco.CEP}</p>
                            <p>Rua: {dadosEndereco.logradouro}</p>
                            <p>Bairro: {dadosEndereco.bairro}</p>
                            <p>Cidade: {dadosEndereco.cidadeAtual2}</p>
                            <p>Estado: {dadosEndereco.estado2}</p>
                            <p>Número: {dadosEndereco.numero}</p>
                            <p>CEP: {dadosEndereco.CEP}</p>
                            <p>Rua: {dadosEndereco.logradouro}</p>
                            <p>Bairro: {dadosEndereco.bairro}</p>
                            <p>Cidade: {dadosEndereco.cidadeAtual2}</p>
                            <p>Estado: {dadosEndereco.estado2}</p>
                            <p>Número: {dadosEndereco.numero}</p>


                            <h2>Dependentes</h2>
                            {dadosDependentes.length > 0 ? (
                                dadosDependentes.map((dependente, index) => (
                                    <div key={index}>
                                        <p>Nome: {dependente.nome}</p>
                                        <p>CPF: {dependente.cpf}</p>
                                        <p>Parentesco: {dependente.parentesco}</p>
                                        <p>Data de Nascimento: {dependente.dataNascimento}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Não há dependentes cadastrados.</p>
                            )}

                            <h2>Dependentes Pets</h2>
                            {dadosDependentePet.length > 0 ? (
                                dadosDependentePet.map((pet, index) => (
                                    <div key={index}>
                                        <p>Nome: {pet.nome}</p>
                                        <p>Espécie: {pet.especie}</p>
                                        <p>Raça : {pet.raca}</p>
                                        <p>Data de Nascimento: {pet.dataNascimento}</p>
                                        <p>Porte: {pet.porte}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Não há dependentes pets cadastrados.</p>
                            )}
                        </div>
                        <div className="w-full flex gap-2 items-end justify-end mb-[50px]">
                            <ButtonComponent
                                endIcon={<PictureAsPdfIcon fontSize="small" />}
                                title="Gerar PDF"
                                subtitle="Gerar PDF"
                                onClick={handleGeneratePdf}
                            />
                            {isPdfGenerated && (
                                <ButtonComponent
                                    endIcon={<SaveIcon fontSize="small" />}
                                    title="Salvar"
                                    subtitle="Salvar"
                                    onClick={handleSave}
                                />
                            )}
                            {isSaved && contratoData && (
                                <ButtonComponent
                                    endIcon={<ContentCopyIcon fontSize="small" />}
                                    title="Copiar Link"
                                    subtitle="Copiar Link"
                                    onClick={() => handleCopyLink(contratoData.ID)} // Passa o ID do contrato
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {toastVisible && <CustomToast message={toastMessage} />}
        </div>
    );
};

export default Assinatura;