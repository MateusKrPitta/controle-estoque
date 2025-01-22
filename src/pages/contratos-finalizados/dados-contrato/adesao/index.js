import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Label from '../../../../components/label';
import DifferenceIcon from '@mui/icons-material/Difference';
import HeaderPerfil from '../../../../components/navbars/perfil';

const AdesaoFinalizado = ({ contrato }) => {
  if (!contrato) {
    return <div>Contrato não encontrado.</div>;
  }

  return (
    <div className='flex flex-wrap gap-1 p-3'>
      <Label marginBottom={'10px'} fontWeight={'700'} width={'100%'} icon={<DifferenceIcon />} conteudo={'Adesão'} fontSize={'13px'} color={'#006b33'} />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Pagou a Adesão"
        autoComplete="off"
        sx={{ width: '30%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Titular.Nome}
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
        label="Forma de Pagamento"
        autoComplete="off"
        sx={{ width: '30%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular.CPF}
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
        label="Comprovante"
        autoComplete="off"
        sx={{ width: '30%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular.RG}
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

export default AdesaoFinalizado;