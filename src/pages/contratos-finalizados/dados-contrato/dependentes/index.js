import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Label from '../../../../components/label';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import HeaderPerfil from '../../../../components/navbars/perfil';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const DependentesFinalizado = ({ contrato }) => {
  if (!contrato) {
    return <div>Contrato não encontrado.</div>;
  }

  return (
    <div className='flex flex-wrap gap-1 p-3'>
      <Label marginBottom={'10px'} fontWeight={'700'} width={'100%'} icon={<NoteAddIcon />} conteudo={'Dependentes'} fontSize={'13px'} color={'#006b33'} />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Nome"
        autoComplete="off"
        sx={{ width: '30%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dependentes['Nome']}
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
        label="CPF"
        autoComplete="off"
        sx={{ width: '30%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca.logradouro_Residencial}
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
        label="Parentesco"
        autoComplete="off"
        sx={{ width: '30%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca.logradouro_Residencial}
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
        label="Data de Nascimento"
        autoComplete="off"
        sx={{ width: '30%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca.logradouro_Residencial}
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
        label="Optou por cremação"
        autoComplete="off"
        sx={{ width: '30%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca.logradouro_Residencial}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />
      </div>
  );
}

export default DependentesFinalizado;