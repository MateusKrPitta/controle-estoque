import React, { useState } from "react";
import Navbar from '../../../components/navbars/header'
import HeaderPerfil from '../../../components/navbars/perfil'
import { InputAdornment, TextField } from '@mui/material'
import ButtonComponent from '../../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HeaderCadastro from '../../../components/navbars/cadastro';
import TableComponent from '../../../components/table';
import { headerUnidade } from '../../../entities/headers/header-cadastro/header-unidade';
import { unidades } from '../../../entities/class/cadastro/unidades';
import CentralModal from '../../../components/modal-central';
import EditIcon from '@mui/icons-material/Edit';
import { Article, Assignment, GpsFixed, LocalActivityOutlined, LocationCity, LocationOn, LocationOnOutlined, Phone, Save } from "@mui/icons-material";
import ModalLateral from "../../../components/modal-lateral";
import MenuMobile from "../../../components/menu-mobile";

const Unidades = () => {
  const [cadastrarUnidade, setCadastrarUnidade] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  const handleCadastroUnidade = () => setCadastrarUnidade(true);
  const handleCloseCadastroUnidade = () => setCadastrarUnidade(false);

  return (
    <div className="container-contratos-pendentes ">
      <Navbar />
      <div className='flex flex-col gap-2 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='flex gap-2 items-center justify-center text-base sm:ml-1  md:text-2xl  font-bold text-primary w-full md:justify-start   '><LocationOnOutlined />Cadastro Unidades</h1>
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
                label="Buscar unidade"
                autoComplete="off"
                sx={{ width: '40%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlined />
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
                buttonSize="large"
                onClick={handleCadastroUnidade}
              />

            </div>
            <TableComponent
              headers={headerUnidade} // Mantenha os headers como contratosMapeados
              rows={unidades} // Corrigido para usar contratosMapeados
              actionsLabel={"Ações"}
              actionCalls={{
                edit: () => setModalEditar(true), // Adiciona a função de visualização aqui
              }}
            />

            <CentralModal tamanhoTitulo={'82%'} maxHeight={'90vh'} top={'20%'} left={'28%'} width={'620px'} icon={<AddCircleOutlineIcon fontSize="small" />} open={cadastrarUnidade} onClose={handleCloseCadastroUnidade} title="Cadastrar Unidade">
              <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                <div className='mt-4 flex gap-3 flex-wrap'>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome da Unidade"
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Razão Social"
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Article />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="CNPJ"
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '30%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Assignment />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Telefone"
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '30%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="CEP"
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '32%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GpsFixed />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="UF"
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '20%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Município"
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '35%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Bairro"
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '37%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Rua"
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Número"
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <div className="flex w-[96%] items-end justify-end ">
                    <ButtonComponent
                      startIcon={<AddCircleOutlineIcon fontSize='small' />}
                      title={'Cadastrar'}
                      subtitle={'Cadastrar'}
                      buttonSize="large"

                    />
                  </div>


                </div>

              </div>

            </CentralModal>

            <ModalLateral
              open={modalEditar}
              handleClose={() => setModalEditar(false)}
              icon={<EditIcon fontSize={"small"} />}
              tituloModal={'Editar Unidade'}
              tamanhoTitulo={'73%'}
              conteudo={
                <>
                  <div className="">
                    <div className='mt-4 flex gap-3 flex-wrap'>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Nome da Unidade"
                        autoComplete="off"
                        sx={{ width: '100%', }} // Added margin for spacing
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Razão Social"
                        autoComplete="off"
                        sx={{ width: '48%', }} // Added margin for spacing
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Article />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="CNPJ"
                        autoComplete="off"
                        sx={{ width: '48%', }} // Added margin for spacing
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Assignment />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Telefone"
                        autoComplete="off"
                        sx={{ width: '48%', }} // Added margin for spacing
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="CEP"
                        autoComplete="off"
                        sx={{ width: '48%', }} // Added margin for spacing
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <GpsFixed />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="UF"
                        autoComplete="off"
                        sx={{ width: '48%', }} // Added margin for spacing
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Município"
                        autoComplete="off"
                        sx={{ width: '48%', }} // Added margin for spacing
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Bairro"
                        autoComplete="off"
                        sx={{ width: '48%', }} // Added margin for spacing
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Rua"
                        autoComplete="off"
                        sx={{ width: '48%', }} // Added margin for spacing
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Número"
                        autoComplete="off"
                        sx={{ width: '48%', }} // Added margin for spacing
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <div className="flex w-[100%] items-end justify-end ">
                        <ButtonComponent
                          startIcon={<Save fontSize='small' />}
                          title={'Salvar'}
                          subtitle={'Salvar'}
                          buttonSize="large"

                        />
                      </div>


                    </div>

                  </div>
                </>} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unidades