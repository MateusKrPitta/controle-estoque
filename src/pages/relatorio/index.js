import React from 'react'
import Navbar from '../../components/navbars/header'
import MenuMobile from '../../components/menu-mobile'
import HeaderPerfil from '../../components/navbars/perfil'
import Relatorios from '../../assets/png/relatorio.png'
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import HeaderRelatorio from '../../components/navbars/relatorios'

const Relatorio = () => {
    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex flex-col gap-3 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='justify-center  sm:justify-start items-center md:text-2xl font-bold text-black w-[99%] flex  gap-2 '>
                    <DataThresholdingIcon /> Relatórios
                </h1>
                <div className='flex-wrap md:w-full mt-7 p-3 flex gap-2 items-start'>
                    <HeaderRelatorio />
                    <div className='w-100% md:w-[90%] items-center flex justify-center flex-col'>
                        <img style={{width:'20%'}} src={Relatorios}></img>
                        <h1 className='text-primary font-bold'>Selecione uma opção do menu!</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Relatorio