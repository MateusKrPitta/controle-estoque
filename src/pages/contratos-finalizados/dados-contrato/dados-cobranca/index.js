import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Label from '../../../../components/label';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import HeaderPerfil from '../../../../components/navbars/perfil';

const DadosCobrancaFinalizado = ({ contrato }) => {
  if (!contrato) {
    return <div>Contrato não encontrado.</div>;
  }

  return (
    <div className='flex flex-wrap gap-1 p-3'>
      <Label marginBottom={'10px'} fontWeight={'700'} width={'100%'} icon={<AssignmentIndIcon />} conteudo={'Dados Cobrança'} fontSize={'13px'} color={'#006b33'} />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Tipo Logradouro Residencial"
        autoComplete="off"
        sx={{ width: '35%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca.logradouro_Residencial}
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
        label="Logradouro Residencial"
        autoComplete="off"
        sx={{ width: '64%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Logradouro Residencial']}
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
        label="Número Residencial"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Número Residencial']}
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
        label="Quadra Residencial"
        autoComplete="off"
        sx={{ width: '32%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Quadra Residencial']}
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
        label="Lote Residencial"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Lote Residencial']}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <OtherHousesIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Complemento Residencial"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Complemento Residencial']}
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
        label="Bairro Residencial"
        autoComplete="off"
        sx={{ width: '32%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Bairro Residencial']}
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
        label="Cidade Residencial"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Cidade Residencial']}
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
        label="Estado Residencial"
        autoComplete="off"
        sx={{ width: '40%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Estado Residencial']}
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
        label="CEP Residencial"
        autoComplete="off"
        sx={{ width: '25%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['CEP Residencial']}
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
        label="Tipo Logradouro Cobrança"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Tipo Logradouro Cobranca']}
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
        label="Logradouro Cobrança"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Logradouro Cobrança']}
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
        label="Número Cobrança"
        autoComplete="off"
        sx={{ width: '32%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Número Cobrança']}
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
        label="Quadra Cobrança"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Quadra Cobrança']}
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
        label="Lote Cobrança"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Lote Cobrança']}
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
        label="Complemento Cobrança"
        autoComplete="off"
        sx={{ width: '32%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Complemento Cobrança']}
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
        label="Bairro Cobrança"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Bairro Cobrança']}
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
        label="Cidade Cobrança"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Cidade Cobrança']}
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
        label="Estado Cobrança"
        autoComplete="off"
        sx={{ width: '32%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Estado Cobrança']}
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
        label="CEP Cobrança"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['CEP Cobrança']}
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
        label="Optou por cremação"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Optou por cremação']}
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
        label="Tipo de Cobrança"
        autoComplete="off"
        sx={{ width: '32%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Tipo de Cobrança']}
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
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Empresa Antiga/Filial']}
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
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Primeira Mensalidade']}
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
        label="Melhor Horário"
        autoComplete="off"
        sx={{ width: '32%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Melhor Horário']}
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
        label="Dia de Vencimento Novo"
        autoComplete="off"
        sx={{ width: '33%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
        value={contrato.Dados_Cobranca['Dia de Vencimento Novo']}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          ),
        }}
      />

    </div>
  );
}

export default DadosCobrancaFinalizado;