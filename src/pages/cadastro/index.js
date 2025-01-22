import React from 'react'
import MenuMobile from '../../components/menu-mobile'
import HeaderPerfil from '../../components/navbars/perfil'
import Navbar from '../../components/navbars/header'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import HeaderCadastro from '../../components/navbars/cadastro';
import CadastroImagem from '../../assets/png/cadas.png'
const Cadastro = () => {
    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex flex-col gap-3 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='sm:items-center md:text-2xl font-bold text-black w-[99%] flex items-center gap-2 '><MiscellaneousServicesIcon />Cadastro</h1>
                <div className='w-full mt-7 p-3 flex gap-2 items-start'>
                    <HeaderCadastro />
                    <div className='w-[90%] items-center flex justify-center flex-col'>
                        <img style={{width:'20%'}} src={CadastroImagem}></img>
                        <h1 className='text-primary font-bold'>Selecione uma opção do menu!</h1>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Cadastro