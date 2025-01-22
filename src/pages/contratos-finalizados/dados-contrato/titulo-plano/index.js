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
import HeaderPerfil from '../../../../components/navbars/perfil';
const TituloPlanoFinalizado = ({ contrato }) => {
  if (!contrato) {
    return <div>Contrato não encontrado.</div>;
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
        sx={{ width: '100%', marginBottom: '16px', fontSize: '12px' }} // Added margin for spacing
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
        label="CPF"
        autoComplete="off"
        sx={{ width: '32%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular.CPF}
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
        sx={{ width: '33%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular.RG}
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
        sx={{ width: '33%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular['Data de Nascimento']}
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
        sx={{ width: '32%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular['Estado Civil']}
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
        sx={{ width: '33%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular.Sexo}
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
        sx={{ width: '33%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular['Religião']}
        InputProps={{
          startAdornment: (
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
        sx={{ width: '32%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular['Profissão']}
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
        sx={{ width: '33%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular.Naturalidade}
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
        sx={{ width: '33%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular.Nacionalidade}
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
        sx={{ width: '49%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular["Telefone 1"]}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AddIcCallIcon />
            </InputAdornment>
          ),
        }}
      /> <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Telefone 2"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular["Telefone 2"]}
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
        sx={{ width: '49%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular["Email 1"]}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailIcon />
            </InputAdornment>
          ),
        }}
      /> <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Email 2"
        autoComplete="off"
        sx={{ width: '49%', marginBottom: '16px' }} // Added margin for spacing
        value={contrato.Titular["Email 2"]}
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

export default TituloPlanoFinalizado;