import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contratos } from '../../../utils/json/contratos-pendentes'; // Certifique-se de que o caminho está correto
import Navbar from '../../../components/navbars/header';
import ButtonComponent from '../../../components/button';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PetsIcon from '@mui/icons-material/Pets';
import SaveIcon from '@mui/icons-material/Save';
import DifferenceIcon from '@mui/icons-material/Difference';
import DadosGerais from './dados-gerais';
import TituloPlano from './titulo-plano';
import DadosCobranca from './dados-cobranca';
import Dependentes from './dependentes';
import Cremacao from './cremacao';
import Anexos from './anexo';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import Adesao from './adesao';
import { InputAdornment, TextField } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Label from '../../../components/label';
import HeaderPerfil from '../../../components/navbars/perfil';
import Contrato from './contrato';
import MenuMobile from '../../../components/menu-mobile';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const DadosContrato = () => {
    const { id } = useParams();
    
    const idNumber = Number(id);

    const [contrato, setContrato] = useState(null);
    const [activeSection, setActiveSection] = useState('dadosGerais');

    useEffect(() => {
        const localStorageContratos = JSON.parse(localStorage.getItem("contratosPendentes")) || [];
        let contratoEncontrado = localStorageContratos.find(c => Number(c.ID) === idNumber);
    
        if (!contratoEncontrado) {
            contratoEncontrado = contratos.find(c => Number(c.ID) === idNumber);
        }
    
        if (contratoEncontrado) {
            console.log('Contrato encontrado:', contratoEncontrado); // Adicione esta linha
            setContrato(contratoEncontrado);
        }
    }, [idNumber]);

    if (!contrato) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-red-600">Contrato não encontrado</h1>
                <p className="text-gray-700">Verifique se o ID fornecido é válido.</p>
            </div>
        );
    }

    return (
        <div className="container-contratos-pendentes">
            <Navbar />
            <div className='flex flex-col gap-1.5 w-full'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base sm:ml-1 md:text-2xl font-bold text-primary w-full md:justify-start'>
                    Dados Contrato Pendentes
                </h1>
    
                <div className='flex flex-wrap items-start mt-2 sm:mt-10 p-3 md:p-0 gap-2 w-full md:mt-10'>
                    
                    {/* Botões de navegação */}
                    <div className="w-[100%] flex items-center justify-center sm:w-[16%] flex-wrap md:w-43 gap-1 md:gap-1 mb-18">
                        {[
                            { icon: <ArticleIcon fontSize='small' />, title: 'Dados Gerais', section: 'dadosGerais' },
                            { icon: <DescriptionIcon fontSize='small' />, title: 'Título do Plano', section: 'tituloPlano' },
                            { icon: <NoteAddIcon fontSize='small' />, title: 'Dados Cobrança', section: 'dadosCobranca' },  
                            { icon: <AssignmentIndIcon fontSize='small' />, title: 'Dependentes (PAX)', section: 'dependentes' },
                            { icon: <PetsIcon fontSize='small' />, title: 'Cremação (PET)', section: 'cremacao' },
                            { icon: <SaveIcon fontSize='small' />, title: 'Anexos', section: 'anexos' },
                            { icon: <DifferenceIcon fontSize='small' />, title: 'Adesão', section: 'adesao' },
                            { icon: <FolderSharedIcon fontSize='small' />, title: 'Contrato', section: 'contrato' }
                        ].map(({ icon, title, section }) => (
                            <ButtonComponent
                                key={section}
                                startIcon={icon}
                                title={title}
                                subtitle={title}
                                buttonSize="large"
                                onClick={() => setActiveSection(section)}
                                className="w-[46%] sm:w-[45%] md:w-[100%]"
                            />
                        ))}
                    </div>
    
                    {/* Conteúdo das seções */}
                    <div className='mt-3 sm:-mt-0 md:w-3/5 overflow-auto border border-[#d9d9d9] rounded-[10px] p-2.5'>
                        {activeSection === 'dadosGerais' && <DadosGerais dadosGerais={contrato.dadosGerais} contrato={contrato} />}
                        {activeSection === 'tituloPlano' && <TituloPlano tituloPlano={contrato.dadosTitular} contrato={contrato} />}
                        {activeSection === 'dadosCobranca' && <DadosCobranca dadosEndereco={contrato.dadosEndereco} contrato={contrato} />}
                        {activeSection === 'dependentes' && <Dependentes dependentes={contrato.dadosDependentes} contrato={contrato} />}
                        {activeSection === 'cremacao' && <Cremacao cremacao={contrato.cremacao} contrato={contrato} />}
                        {activeSection === 'anexos' && <Anexos anexos={contrato.anexos} contrato={contrato} />}
                        {activeSection === 'adesao' && <Adesao adesao={contrato.adesao} contrato={contrato} />}
                        {activeSection === 'contrato' && <Contrato contrato={contrato}  />}
                    </div>
    
                    {/* Informações do contrato */}
                    <div className='w-[100%] p-2 border border-[#d9d9d9] rounded-[10px] sm:w-56 md:w-56'>
                        <Label 
                            marginBottom={'10px'} 
                            fontWeight={'700'} 
                            width={'100%'} 
                            icon={< AutorenewIcon />} 
                            conteudo={'Status'} 
                            fontSize={'13px'} 
                            color={'#006b33'} 
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Contrato"
                            autoComplete="off"
                            sx={{ width: '100%', marginBottom: '16px', fontSize: '12px' }}
                            value={contrato?.dadosGerais?.contrato || ''}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"></InputAdornment>,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
    };
    
    export default DadosContrato;