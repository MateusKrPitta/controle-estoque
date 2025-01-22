import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { contratos } from '../../../utils/json/contratos-pendentes';
import Navbar from '../../../components/navbars/header';
import ButtonComponent from '../../../components/button';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PetsIcon from '@mui/icons-material/Pets';
import SaveIcon from '@mui/icons-material/Save';
import DifferenceIcon from '@mui/icons-material/Difference';
import { InputAdornment, TextField } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Label from '../../../components/label';
import HeaderPerfil from '../../../components/navbars/perfil';
import DadosGeraisFinalizado from './dados-gerais';
import TituloPlanoFinalizado from './titulo-plano';
import DadosCobrancaFinalizado from './dados-cobranca';
import DependentesFinalizado from './dependentes';
import CremacaoFinalizado from './cremacao';
import AnexosFinalizado from './anexo';
import AdesaoFinalizado from './adesao';
import Contrato from './contrato';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import MenuMobile from '../../../components/menu-mobile';
const DadosContratoFinalizado = () => {
    const { id } = useParams();
    const contrato = contratos.find(c => c.ID === Number(id));


    const [activeSection, setActiveSection] = useState('dadosGerais');

    if (!contrato) {
        return (
            <div>
                <h1>Contrato não encontrado</h1>
                <p>Verifique se o ID fornecido é válido.</p>
            </div>
        );
    }

    return (
        <div className="container-contratos-pendentes ">
            <Navbar />
            <div className='flex flex-col gap-1.5  w-full'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base sm:ml-1  md:text-2xl  font-bold text-primary w-full md:justify-start   '>Dados Contrato Finalizados</h1>

                <div className='flex flex-wrap items-start mt-2 sm:mt-10 p-3 md:p-0 gap-2  w-full md:mt-10'>
                    <div className="w-[100%] flex items-center justify-center  sm:w-[16%] flex-wrap md:w-43 gap-1 md:gap-1 mb-18">
                        <ButtonComponent
                            startIcon={<ArticleIcon fontSize='small' />}
                            title={'Dados Gerais'}
                            subtitle={'Dados Gerais'}
                            buttonSize="large"
                            onClick={() => setActiveSection('dadosGerais')} className="w-[46%] sm:w-[50%] md:w-[100%]"
                        />
                        <ButtonComponent
                            startIcon={<DescriptionIcon fontSize='small' />}
                            title={'Título do Plano'}
                            subtitle={'Título do Plano'}
                            buttonSize="large"
                            onClick={() => setActiveSection('tituloPlano')} className="w-[46%] sm:w-[50%] md:w-[100%]"
                        />
                        <ButtonComponent
                            startIcon={<NoteAddIcon fontSize='small' />}
                            title={'Dados Cobrança'}
                            subtitle={'Dados Cobrança'}
                            buttonSize="large"
                            onClick={() => setActiveSection('dadosCobranca')} className="w-[46%] sm:w-[50%] md:w-[100%]"
                        />
                        <ButtonComponent
                            startIcon={<AssignmentIndIcon fontSize='small' />}
                            title={'Dependentes (PAX)'}
                            subtitle={'Dependentes (PAX)'}
                            buttonSize="large"
                            onClick={() => setActiveSection('dependentes')} className="w-[46%] sm:w-[50%] md:w-[100%]"
                        />
                        <ButtonComponent
                            startIcon={<PetsIcon fontSize='small' />}
                            title={'Cremação (PET)'}
                            subtitle={'Cremação (PET)'}
                            buttonSize="large"
                            onClick={() => setActiveSection('cremacao')} className="w-[46%] sm:w-[50%] md:w-[100%]"
                        />
                        <ButtonComponent
                            startIcon={<SaveIcon fontSize='small' />}
                            title={'Anexos'}
                            subtitle={'Anexos'}
                            buttonSize="large"
                            onClick={() => setActiveSection('anexos')} className="w-[46%] sm:w-[50%] md:w-[100%]"
                        />
                        <ButtonComponent
                            startIcon={<DifferenceIcon fontSize='small' />}
                            title={'Adesão'}
                            subtitle={'Adesão'}
                            buttonSize="large"
                            onClick={() => setActiveSection('adesao')} className="w-[46%] sm:w-[50%] md:w-[100%]"
                        />
                        <ButtonComponent
                            startIcon={<FolderSharedIcon fontSize='small' />}
                            title={'Contrato'}
                            subtitle={'Contrato'}
                            buttonSize="large"
                            onClick={() => setActiveSection('contrato')} className="w-[46%] sm:w-[50%] md:w-[100%]"
                        />
                    </div>

                    <div className='mt-3 sm:-mt-0 md:w-3/5 overflow-auto border border-[#d9d9d9] rounded-[10px] p-2.5 '>
                        {activeSection === 'dadosGerais' && contrato && (
                            <div>
                                <DadosGeraisFinalizado contrato={contrato} />
                            </div>

                        )}
                        {activeSection === 'tituloPlano' && (
                            <div >
                                <TituloPlanoFinalizado contrato={contrato} />
                            </div>
                        )}
                        {activeSection === 'dadosCobranca' && (
                            <div >
                                <DadosCobrancaFinalizado contrato={contrato} />
                            </div>
                        )}
                        {activeSection === 'dependentes' && (
                            <div>
                                <DependentesFinalizado contrato={contrato} />
                            </div>
                        )}
                        {activeSection === 'cremacao' && (
                            <div >
                                <CremacaoFinalizado contrato={contrato} />
                            </div>
                        )}
                        {activeSection === 'anexos' && (
                            <div>
                                <AnexosFinalizado contrato={contrato} />
                            </div>
                        )}
                        {activeSection === 'adesao' && (
                            <div >
                                <AdesaoFinalizado contrato={contrato} />
                            </div>
                        )}
                        {activeSection === 'contrato' && (
                            <div >
                                <Contrato contrato={contrato} />
                            </div>
                        )}

                    </div>
                    <div className='w-[100%] p-2 border border-[#d9d9d9] rounded-[10px] sm:w-56 md:w-56'>
                        <Label marginBottom={'10px'} fontWeight={'700'} width={'100%'} icon={<AutorenewIcon />} conteudo={'Status'} fontSize={'13px'} color={'#006b33'} />
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Contrato"
                            autoComplete="off"
                            sx={{ width: '100%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
                            // value={contrato.Dados_Gerais.contrato}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DadosContratoFinalizado;