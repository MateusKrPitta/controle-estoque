import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Label from '../../../../components/label';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const DadosCobranca = ({ contrato }) => {
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
        sx={{ width: { xs: '52%', sm: '50%', md: '40%', lg: '35%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.tipoLogradouro || contrato?.Dados_Cobranca?.logradouro_Residencial || ''}

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
        sx={{ width: { xs: '46%', sm: '50%', md: '40%', lg: '64%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.logradouro || contrato.Dados_Cobranca.logradouro_Residencial || ''} 
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
        sx={{ width: { xs: '39%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.numero || contrato?.Dados_Cobranca?.['Número Residencial'] || ''}
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
        sx={{ width: { xs: '30%', sm: '50%', md: '40%', lg: '32%' },  marginBottom: '16px', fontSize: '12px' }}
        value={ contrato?.dadosEndereco?.quadraResidencial ||  contrato?.Dados_Cobranca?.['Quadra Residencial'] || ''}
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
        sx={{ width: { xs: '28%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.loteResidencial || contrato?.Dados_Cobranca?.['Lote Residencial'] || ''}
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
        sx={{ width: { xs: '43%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.complementoResidencial || contrato?.Dados_Cobranca?.['Complemento Residencial'] || ''}
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
        sx={{ width: { xs: '55%', sm: '50%', md: '40%', lg: '32%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.bairro || contrato?.Dados_Cobranca?.['Bairro Residencial'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.cidadeResidencial || contrato?.dadosEndereco?.cidadeAtual2 || contrato?.Dados_Cobranca?.['Cidade Residencial'] || ''} 
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '40%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.estado2 || contrato?.Dados_Cobranca?.['Estado Residencial'] || ''} 
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '25%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.CEP || contrato?.Dados_Cobranca?.['CEP Residencial'] || ''} 
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.tipoLogradouroCobranca || contrato?.Dados_Cobranca?.['Tipo Residencial'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.logradouroCobranca || contrato?.Dados_Cobranca?.['Logradouro Residencial'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '32%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.numeroCobranca || contrato?.Dados_Cobranca?.['Número Residencial'] || ''} 
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
        value={contrato?.dadosEndereco?.quadraCobranca || contrato?.Dados_Cobranca?.['Quadra Cobranca'] || ''}
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
        value={contrato?.dadosEndereco?.loteCobranca || contrato?.Dados_Cobranca?.['Lote Cobranca'] || ''}
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
        sx={{ width: { xs: '31%', sm: '50%', md: '40%', lg: '32%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.complementoCobranca || contrato?.Dados_Cobranca?.['Complemento Cobranca'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.bairroCobranca || contrato?.Dados_Cobranca?.['Bairro Cobranca'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.cidadeCobranca || contrato?.Dados_Cobranca?.['Cidade Cobranca'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.estadoCobranca || contrato?.Dados_Cobranca?.['Estado Cobranca'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '32%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.cepCobranca || contrato?.Dados_Cobranca?.['CEP Cobranca'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.crecamacao || contrato?.Dados_Cobranca?.['Optou por cremação'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.tipoCobranca || contrato?.Dados_Cobranca?.['Tipo de Cobranca'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '32%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.empresaFilial || contrato?.Dados_Cobranca?.['Empresa Antiga/Filial'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.primeiraMensalidade || contrato?.Dados_Cobranca?.['Primeira Mensalidade'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '33%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.melhorHorario || contrato?.Dados_Cobranca?.['Melhor Horário'] || ''}
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
        sx={{ width: { xs: '49%', sm: '50%', md: '40%', lg: '32%' },  marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosEndereco?.diaVencimento || contrato?.Dados_Cobranca?.['Dia de Vencimento Novo Horário'] || ''}
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

export default DadosCobranca;