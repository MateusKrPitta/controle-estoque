import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import logoPaxBranco from "../../../assets/svg/logos/logo-pax-branco.svg";
import './visualizar-contrato.css';
import ButtonComponent from "../../../components/button";
import SaveIcon from '@mui/icons-material/Save';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import TableLoading from "../../../components/loading/loading-table/loading";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const VisualizarContrato = () => {
    const [contrato, setContrato] = useState(null);
    const [signature, setSignature] = useState(null);
    const [photos, setPhotos] = useState([null, null, null]); // Estado para as fotos
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const sigCanvasRef = useRef();
    const { contratoId } = useParams();

    useEffect(() => {
        const savedContratos = JSON.parse(localStorage.getItem("contratosPendentes")) || [];
        const contratoEncontrado = savedContratos.find(c => c.ID === Number(contratoId));
        if (contratoEncontrado) {
            setContrato(contratoEncontrado);
        } else {
            console.log("Contrato não encontrado.");
        }
    }, [contratoId]);

    const clearSignature = () => {
        sigCanvasRef.current.clear();
        setSignature(null);
    };

    const handlePhotoChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhotos = [...photos];
                newPhotos[index] = reader.result; // Armazena a imagem em base64
                setPhotos(newPhotos);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveSignature = () => {
        if (sigCanvasRef.current.isEmpty()) {
            alert("Por favor, faça a assinatura antes de salvar!");
            return;
        }

        const signatureData = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
        setSignature(signatureData);

        const savedContratos = JSON.parse(localStorage.getItem("contratosPendentes")) || [];
        const updatedContratos = savedContratos.map(c => {
            if (c.ID === contrato.ID) {
                return {
                    ...c,
                    assinatura: signatureData,
                    fotos: photos, // Salva as fotos
                    status: "Assinado",
                };
            }
            return c;
        });

        localStorage.setItem("contratosPendentes", JSON.stringify(updatedContratos));

        setLoading(true);
        setSuccessMessage("");

        setTimeout(() => {
            setLoading(false);
            setSuccessMessage("Contrato assinado com sucesso!");
        }, 2000);
    };

    const handleRecusarContrato = () => {
        const savedContratos = JSON.parse(localStorage.getItem("contratosPendentes")) || [];
        const updatedContratos = savedContratos.map(c => {
            if (c.ID === contrato.ID) {
                return {
                    ...c,
                    status: "Cancelado",
                };
            }
            return c;
        });

        localStorage.setItem("contratosPendentes", JSON.stringify(updatedContratos));
        alert("Contrato recusado com sucesso!");
    };

    return (
        <div className="container-visualizar-contrato w-full">
            <div className="w-full flex flex-col justify-center items-center">
                <div className="flex w-full justify-center cursor-pointer p-5 " style={{ backgroundColor: '#006b33' }}>
                    <img src={logoPaxBranco} alt="Logo" className="w-24 " />
                </div>
                {loading ? (
                    <div className="mt-5">
                        <TableLoading />
                    </div>
                ) : successMessage ? (
                    <p style={{ color: 'white', marginTop: '100px' }}>{successMessage}</p>
                ) : contrato ? (
                    <div className="contrato-detalhes" style={{ marginTop: '50px' }}>
                        <h2>Contrato</h2>
                        <p>Template: {contrato.nomeContrato}</p>
                        <p>Tipo Contrato: {contrato.dadosGerais?.tipoContrato || "Tipo Contrato não disponível"}</p>
                        <p>Unidade Pax: {contrato.dadosGerais?.unidadePax || "Unidade Pax não disponível"}</p>
                        <p>Data Contrato: {contrato.dadosGerais?.dataContrato || "Data Contrato não disponível"}</p>
                        <p>Contrato: {contrato.dadosGerais?.contrato}</p>
                        <p>Plano: {contrato.dadosGerais?.plano}</p>

                        <h2>Dados do Titular</h2>
                        <p>Nome: {contrato.dadosTitular?.nome || "Nome não disponível"}</p>
                        <p>CPF: {contrato.dadosTitular?.cpf || "CPF não disponível"}</p>
                        <p>RG: {contrato.dadosTitular?.rg || "RG não disponível"}</p>

                        <h2>Endereço</h2>
                        <p>CEP: {contrato.dadosEndereco?.CEP || "CEP não disponível"}</p>
                        <p>Rua: {contrato.dadosEndereco?.logradouro || "Logradouro não disponível"}</p>
                        <p>Bairro: {contrato.dadosEndereco?.bairro || "Bairro não disponível"}</p>
                        <p>Cidade: {contrato.dadosEndereco?.cidadeAtual2 || "Cidade não disponível"}</p>
                        <p>Estado: {contrato.dadosEndereco?.estado2 || "Estado não disponível"}</p>
                        <p>Número: {contrato.dadosEndereco?.numero || "Número não disponível"}</p>

                        <h2>Dependentes</h2>
                        {contrato.dadosDependentes && contrato.dadosDependentes.length > 0 ? (
                            contrato.dadosDependentes.map((dependente, index) => (
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
                        {contrato.dadosDependentePet && contrato.dadosDependentePet.length > 0 ? (
                            contrato.dadosDependentePet.map((pet, index) => (
                                <div key={index}>
                                    <p>Nome: {pet.nome}</p>
                                    <p>Espécie: {pet.especie}</p>
                                    <p>Raça: {pet.raca}</p>
                                    <p>Data de Nascimento: {pet.dataNascimento}</p>
                                    <p>Porte: {pet.porte}</p>
                                </div>
                            ))
                        ) : (
                            <p>Não há dependentes pets cadastrados.</p>
                        )}
                        <h2>Assinatura</h2>
                        <SignatureCanvas
                            ref={sigCanvasRef}
                            penColor="black"
                            canvasProps={{
                                width: 500,
                                height: 200,
                                className: "signature-canvas",
                            }}
                        />

                        <h2 className="mt-10 text-bold">Adicionar Fotos</h2>
                        <div className="flex w-[50%] gap-4 mt-6">
                            {photos.map((photo, index) => (
                                <div key={index} className="photo-upload border border-gray-300 p-4 rounded-md shadow-md flex flex-col items-center">
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => handlePhotoChange(index, event)}
                                        className="mb-2"
                                    />
                                    {photo ? (
                                        <img src={photo} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} alt={`Foto ${index + 1}`} className="photo-thumbnail" />
                                    ) : (
                                        <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-md">
                                            <p className="text-gray-500">Nenhuma foto selecionada</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="w-full flex items-center justify-center gap-2 mt-4 mb-5">
                            <ButtonComponent endIcon={<CleaningServicesIcon fontSize="small" />}
                                title="Limpar"
                                subtitle="Limpar"
                                onClick={clearSignature}
                            />
                            <ButtonComponent
                                endIcon={<HighlightOffIcon fontSize="small" />}
                                title="Recusar Contrato"
                                subtitle="Recusar Contrato"
                                onClick={handleRecusarContrato}
                            />
                            <ButtonComponent
                                endIcon={<SaveIcon fontSize="small" />}
                                title="Salvar Assinatura"
                                subtitle="Salvar Assinatura"
                                onClick={saveSignature}
                            />
                        </div>

                    </div>
                ) : (
                    <p>Nenhum contrato encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default VisualizarContrato;