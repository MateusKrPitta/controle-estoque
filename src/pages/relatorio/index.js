import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbars/header'
import MenuMobile from '../../components/menu-mobile'
import HeaderPerfil from '../../components/navbars/perfil'
import Relatorios from '../../assets/png/relatorio.png'
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import HeaderRelatorio from '../../components/navbars/relatorios'

const Relatorio = () => {
        const [isVisible, setIsVisible] = useState(false);
    
        useEffect(() => {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 300); // Delay para a transição
    
            return () => clearTimeout(timer);
        }, []);

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start   '>
                    <DataThresholdingIcon /> Relatórios
                </h1>
                <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                    <div className='w-[100%] md:w-[14%]'>
                        <HeaderRelatorio />
                    </div>
                    <div className={`w-[100%] md:w-[80%] flex-col flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <img className='w-[20%]' src={Relatorios}></img>
                        <h1 className='text-primary font-bold'>Selecione uma opção do menu!</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Relatorio