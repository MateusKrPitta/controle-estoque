import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChurchIcon from '@mui/icons-material/Church';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import FlagIcon from '@mui/icons-material/Flag';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import MailIcon from '@mui/icons-material/Mail';
import DescriptionIcon from '@mui/icons-material/Description';
import Label from '../../../../components/label';

const TituloPlano = ({ contrato }) => {
  if (!contrato || !contrato.dadosTitular) {
    return <div>Contrato não encontrado.</div>;
  }

  const titular = contrato.Titular || contrato.dadosTitular;

  // Check if titular is defined before accessing its properties
  if (!titular) {
    return <div>Dados do titular não encontrados.</div>;
  }

  return (
    <div className='flex flex-wrap gap-1 p-3'>
      <Label marginBottom={'10px'} fontWeight={'700'} width={'100%'} icon={<DescriptionIcon />} conteudo={'Título do Plano'} fontSize={'13px'} color={'#006b33'} />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Titular do Plano"
        autoComplete="off"
        sx={{ width: '100%', marginBottom: '16px', fontSize: '12px' }}
        value={contrato?.dadosTitular?.nome || contrato.Titular.Nome }
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
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.cpf || titular.CPF || ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SubjectIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="RG"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.rg || titular.RG || ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SubjectIcon />
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
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.dataNascimento || titular['Data de Nascimento']}
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
        label="Estado Civil"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.estadoCivil || titular['Estado Civil']}
       
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
        label="Sexo"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.sexo || titular.Sexo}
        
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
        label="Religião"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.religiao || titular['Religião']}
        InputProps={{
          startAdornment : (
              <InputAdornment position="start">
                <ChurchIcon />
              </InputAdornment>
            ),
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Profissão"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.profissao || titular['Profissao']}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <WorkHistoryIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Naturalidade"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.naturalidade || titular.Naturalidade}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MapsHomeWorkIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Nacionalidade"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.nacionalidade || titular.Nacionalidade}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FlagIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Telefone 1"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.telefone1 || titular["Telefone 1"]}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AddIcCallIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Telefone 2"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.telefone2 || titular["Telefone 2"]}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AddIcCallIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Email 1"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.email1 || titular["Email 1"]}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Email 2"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }}
        value={contrato?.dadosTitular?.email2 || titular["Email 2"]}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

export default TituloPlano;