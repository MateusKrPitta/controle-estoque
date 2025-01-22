import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Label from '../../../../components/label';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const Dependentes = ({ contrato }) => {
  // Verifica se o contrato e a propriedade Dependentes estão definidos
  if (!contrato || !Array.isArray(contrato.Dependentes) || contrato.Dependentes.length === 0) {
    return <div>Contrato não encontrado ou não há dependentes.</div>;
  }

  return (
    <div className='flex flex-wrap gap-1 p-3'>
      <Label 
        marginBottom={'10px'} 
        fontWeight={'700'} 
        width={'100%'} 
        icon={<NoteAddIcon />} 
        conteudo={'Dependentes'} 
        fontSize={'13px'} 
        color={'#006b33'} 
      />
      {contrato.Dependentes.map((dependente, index) => (
        <div key={index} className='flex flex-wrap gap-1'>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Nome"
            autoComplete="off"
            sx={{ width: '30%', marginBottom: '16px', fontSize: '12px' }}
            value={dependente.nome || ''} // Adiciona fallback para evitar undefined
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
            sx={{ width: '30%', marginBottom: '16px', fontSize: '12px' }}
            value={dependente.cpf || ''} // Adiciona fallback para evitar undefined
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
            sx={{ width: '30%', marginBottom: '16px', fontSize: '12px' }}
            value={dependente.parentesco || ''} // Adiciona fallback para evitar undefined
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
            sx={{ width: '30%', marginBottom: '16px', fontSize: '12px' }}
            value={dependente.dataNascimento || ''} // Adiciona fallback para evitar undefined
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
            sx={{ width: '30%', marginBottom: '16px', fontSize: '12px' }}
            value={dependente.optouPorCremação ? 'Sim ' : 'Não'} // Supondo que você tenha essa informação
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default Dependentes;