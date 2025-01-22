import React from 'react'
import Navbar from '../../components/navbars/header'
import HeaderPerfil from '../../components/navbars/perfil'
import MenuMobile from '../../components/menu-mobile'
import Estoque from '../../assets/png/estoque.png'
import Produtos from '../../assets/png/produtos.png'
import Dinheiro from '../../assets/png/dinheiro.png'
import Dados from '../../assets/png/dados.png'

const Dashboard = () => {
    return (
        <div className="md:flex w-[100%] h-[100%]">
            <MenuMobile />
            <Navbar />

            <div className='flex flex-col gap-2 w-full items-end'>
                <HeaderPerfil />

                <h1 className='ml-3 text-2xl font-bold text-primary w-[95%]  '>Dashboard</h1>
                <div className='w-full mt-8 flex-col p-3'>
                    <div className='flex gap-8'>
                        <div className='p-5 border-[2px] rounded-lg w-[20%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold '>Total de Produtos</label>
                            <div className=' flex items-center justify-center gap-6 '>
                                <img src={Estoque}></img>
                                <label className='text-black  font-semibold   w-full '> 10</label>
                            </div>

                        </div>
                        <div className='p-5 border-[2px] rounded-lg w-[20%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold '>Itens em Estoque</label>
                            <div className=' flex items-center justify-center gap-6 '>
                                <img src={Produtos}></img>
                                <label className='text-black  font-semibold   w-full '> 32</label>
                            </div>

                        </div>
                        <div className='p-5 border-[2px] rounded-lg w-[20%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold '>Valor ToTal</label>
                            <div className=' flex items-center justify-center gap-6 '>
                                <img src={Dinheiro}></img>
                                <label className='text-black  font-semibold   w-full '>R$ 250,00</label>
                            </div>

                        </div>
                        <div className='p-5 border-[2px] rounded-lg w-[20%] flex-col gap-2 flex items-center justify-center'>
                            <label className='text-black text-xs font-semibold '>CMV</label>
                            <div className=' flex items-center justify-center gap-6 '>
                                <img src={Dados}></img>
                                <label className='text-black  font-semibold   w-full '> 25%</label>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Dashboard