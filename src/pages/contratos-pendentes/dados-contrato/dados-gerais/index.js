import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArticleIcon from '@mui/icons-material/Article';
import Label from '../../../../components/label';

const DadosGerais = ({ contrato }) => {
    console.log(contrato);
    if (!contrato) {
        return <div>Contrato não encontrado.</div>;
    }

    return (
        <div className='flex flex-wrap gap-1 p-3 w-full items-center justify-center'>

            <Label marginBottom={'10px'} fontWeight={'700'} width={'100%'} icon={<ArticleIcon />} conteudo={'Dados Gerais'} fontSize={'13px'} color={'#006b33'} />
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Vendedor"
                autoComplete="off"
                sx={{ width: '99%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
                value={contrato.Vendedor || "Administrador"}
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
                label="Data do Contrato"
                autoComplete="off"
                sx={{ width: '49%', marginBottom: '16px' }} // Added margin for spacing
                value={contrato?.dadosGerais?.dataContrato || contrato['Data do Contrato']}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <CalendarMonthIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Unidade Pax"
                autoComplete="off"
                sx={{ width: '49%', marginBottom: '16px' }} // Added margin for spacing
                value={contrato?.dadosGerais?.unidadePax || contrato['Unidade Pax']}
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
                label="Tipo de Contrato"
                autoComplete="off"
                sx={{ width: '49%', marginBottom: '16px' }} // Added margin for spacing
                value={contrato?.dadosGerais?.tipoContrato || contrato['Tipo de Contrato']}
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
                label="Contrato"
                autoComplete="off"
                sx={{ width: '49%', marginBottom: '16px' }} // Added margin for spacing
                value={contrato?.dadosGerais?.contrato || contrato['Plano Pax']}
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
                autoComplete="off"
                sx={{ width: '49%', marginBottom: '16px' }} // Added margin for spacing
                value={contrato?.contratoNome || contrato['Plano Pax']}
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
                autoComplete="off"
                sx={{ width: '49%', marginBottom: '16px' }} // Added margin for spacing
                value={contrato?.dadosGerais?.dataContratoAntigo || contrato['Plano Pax']}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <CalendarMonthIcon />
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
}

export default DadosGerais;