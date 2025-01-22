import React from 'react'
import Label from '../../../../components/label'
import PetsIcon from '@mui/icons-material/Pets';
const Cremacao = () => {
  return (
    <div className='flex flex-wrap gap-1 p-3'>
      <Label marginBottom={'10px'} fontWeight={'700'} width={'100%'} icon={<PetsIcon />} conteudo={'Cremação(PET)'} fontSize={'13px'} color={'#006b33'} />
      </div>
  )
}

export default Cremacao