import React, { useState } from 'react'
import Navbar from '../../../components/navbars/header'
import HeaderPerfil from '../../../components/navbars/perfil'
import { InputAdornment, TextField } from '@mui/material'
import ButtonComponent from '../../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HeaderCadastro from '../../../components/navbars/cadastro';
import TableComponent from '../../../components/table';
import { headerRacas } from '../../../entities/headers/header-cadastro/header-racas';
import { racas } from '../../../entities/class/cadastro/racas';
import CentralModal from '../../../components/modal-central';
import ModalLateral from '../../../components/modal-lateral';
import EditIcon from '@mui/icons-material/Edit';
import { Pets, PetsOutlined, Save } from '@mui/icons-material';
import Checkbox from '@mui/material/Checkbox';
import MenuMobile from '../../../components/menu-mobile';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Racas = () => {
  const [cadastroRacas, setCadastroRacas] = useState(false);
  const handleCadastroRacas = () => setCadastroRacas(true);
  const handleCloseCadastroRacas = () => setCadastroRacas(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="container-contratos-pendentes ">
      <Navbar />
      <div className='flex flex-col gap-2 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='flex gap-2 items-center justify-center text-base sm:ml-1  md:text-2xl  font-bold text-primary w-full md:justify-start   '><PetsOutlined />Cadastro Raças</h1>
        <div className='flex w-full gap-1 mt-9 '>
          <div className="hidden sm:hidden md:block w-[13%]">
            <HeaderCadastro />
          </div>

          <div class="mt-2 ml-2 sm:mt-0 md: flex flex-col w-[97%]">
            <div className='flex gap-2'>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Buscar raça"
                autoComplete="off"
                sx={{ width: '40%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Pets />
                    </InputAdornment>
                  ),
                }}
              />
              <ButtonComponent
                startIcon={<SearchIcon fontSize='small' />}
                title={'Pesquisar'}
                subtitle={'Pesquisar'}
                buttonSize="large"

              />
              <ButtonComponent
                startIcon={<AddCircleOutlineIcon fontSize='small' />}
                title={'Cadastrar'}
                subtitle={'Cadastrar'}
                onClick={handleCadastroRacas}
                buttonSize="large"
              />

            </div>
            <TableComponent
              headers={headerRacas}
              rows={racas}
              actionsLabel={"Ações"}
              actionCalls={{
                edit: () => setModalEditar(true), // Passando a referência da função
              }}
            />

            <CentralModal tamanhoTitulo={'82%'} maxHeight={'90vh'} top={'20%'} left={'28%'} width={'620px'} icon={<AddCircleOutlineIcon fontSize="small" />} open={cadastroRacas} onClose={handleCloseCadastroRacas} title="Cadastrar Raças">
              <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                <div className='mt-4 flex gap-3 flex-wrap'>

                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome da Raça"
                    autoComplete="off"
                    sx={{ width: '96%', }} // Added margin for spacing
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Pets />
                        </InputAdornment>
                      ),
                    }}
                  />

                </div>


                <div className="flex w-[96%] items-end justify-end mt-2 ">
                  <ButtonComponent
                    startIcon={<AddCircleOutlineIcon fontSize='small' />}
                    title={'Cadastrar'}
                    subtitle={'Cadastrar'}
                    buttonSize="large"

                  />
                </div>
              </div>

            </CentralModal>

            <ModalLateral
              open={modalEditar}
              handleClose={() => setModalEditar(false)}
              icon={<EditIcon fontSize={"small"} />}
              tituloModal={'Editar Raça'}
              tamanhoTitulo={'73%'}
              conteudo={
                <>
                  <div className=' w-full flex-col gap-3 flex flex-wrap'>

                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Nome da Raça"
                      autoComplete="off"
                      sx={{ width: '100%', }} // Added margin for spacing
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Pets />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <div className="flex flex-col w-[35%] text-xs mr-4">
                      <label >Status</label>
                      <div className="flex items-center">
                        <Checkbox checked={isActive} onChange={() => setIsActive(!isActive)} />
                        <label className="text-xs">{isActive ? "Ativo" : "Inativo"}</label>

                      </div>


                    </div>

                    <div className='flex w-full items-end justify-end'>
                      <ButtonComponent
                        startIcon={<Save fontSize='small' />}
                        title={'Salvar'}
                        subtitle={'Salvar'}
                        buttonSize="large"

                      />
                    </div>



                  </div>



                </>} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Racas