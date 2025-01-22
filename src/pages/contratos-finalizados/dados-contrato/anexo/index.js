import React from 'react'
import Label from '../../../../components/label'
import SaveIcon from '@mui/icons-material/Save';
import HeaderPerfil from '../../../../components/navbars/perfil';

const AnexosFinalizado = () => {
  return (
    <div className='flex flex-wrap gap-1 p-3'>
      <Label marginBottom={'10px'} fontWeight={'700'} width={'100%'} icon={<SaveIcon />} conteudo={'Anexos'} fontSize={'13px'} color={'#006b33'} />
    </div>
  )
}

export default AnexosFinalizado