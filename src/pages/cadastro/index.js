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
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start   '><MiscellaneousServicesIcon />Cadastro</h1>
                <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                    <div className='w-[100%] md:w-[14%]'>
                    <HeaderCadastro />
                    </div>
                   
                    <div className='w-[100%] md:w-[80%] flex-col flex items-center justify-center'>
                        <img className='w-[30%]' src={CadastroImagem}></img>
                        <h1 className='font-bold text-primary '>Selecione uma opção do menu!</h1>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Cadastro