import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import logoPaxVerde from "../../../assets/svg/logos/logo-pax-verde.svg";
import './visualizar-contrato.css';
import ButtonComponent from "../../../components/button";
import SaveIcon from '@mui/icons-material/Save';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import TableLoading from "../../../components/loading/loading-table/loading";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CustomToast from "../../../components/toast"; // Importa o CustomToast

const VisualizarContrato = () => {
    const [contrato, setContrato] = useState(null);
    const [signature, setSignature] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ type: '', message: '', visible: false });
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

    const showToast = (type, message) => {
        setToast({ type, message, visible: true });
        setTimeout(() => setToast({ ...toast, visible: false }), 3000); // O toast ficará visível por 3 segundos
    };

    const saveSignature = () => {
        if (sigCanvasRef.current.isEmpty()) {
            CustomToast({ type: "alert", message: "Por favor, faça a assinatura antes de salvar!" });
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
                    status: "Assinado",
                };
            }
            return c;
        });
    
        localStorage.setItem("contratosPendentes", JSON.stringify(updatedContratos));
    
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            CustomToast({ type: "success", message: "Contrato assinado com sucesso!" });
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
    
        CustomToast({ type: "error", message: "Contrato recusado com sucesso!" });
    };

    return (
        <div className="w-full fundo-sistema">
            <div className="w-full flex flex-col justify-center items-center">
                <div className="flex justify-center mb-5 cursor-pointer mt-4">
                    <img src={logoPaxVerde} alt="Logo" className="w-24 " />
                </div>
                {loading ? (
                    <TableLoading />
                ) : contrato ? (
                    <div className="contrato-detalhes">
                        <h2>Contrato</h2>
                        <p>Template: {contrato.nomeContrato}</p>
                        <p>Nome: {contrato.dadosTitular?.nome || "Nome não disponível"}</p>
                        <p>CPF: {contrato.dadosTitular?.cpf || "CPF não disponível"}</p>
                        <p>RG: {contrato.dadosTitular?.rg || "RG não disponível" }</p>
                        <h2>Endereço</h2>
                        <p>CEP: {contrato.dadosEndereco?.CEP || "CEP não disponível"}</p>
                        <p>Rua: {contrato.dadosEndereco?.logradouro || "Logradouro não disponível"}</p>
                        <p>Bairro: {contrato.dadosEndereco?.bairro || "Bairro não disponível"}</p>
                        <p>Cidade: {contrato.dadosEndereco?.cidadeAtual2 || "Cidade não disponível"}</p>
                        <p>Estado: {contrato.dadosEndereco?.estado2 || "Estado não disponível"}</p>
                        <p>Número: {contrato.dadosEndereco?.numero || "Número não disponível"}</p>

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
            {toast.visible && <CustomToast type={toast.type} message={toast.message} />} {/* Exibe o CustomToast */}
        </div>
    );
};

export default VisualizarContrato;