import React from 'react'
import Navbar from '../../components/navbars/header'
import HeaderPerfil from '../../components/navbars/perfil'
import MenuMobile from '../../components/menu-mobile'

const Dashboard = () => {
    return (
        <div className="md:flex w-[100%] h-[100%]">
            <MenuMobile />
            <Navbar />

            <div className='flex flex-col gap-2 w-full items-end'>
                <HeaderPerfil />

                <h1 className='ml-3 text-2xl font-bold text-primary w-[95%]  '>Dashboard</h1>
            </div>
        </div>
    )
}

export default Dashboard