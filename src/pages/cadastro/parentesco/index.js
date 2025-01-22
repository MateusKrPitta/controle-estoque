import React, { useState } from "react";
import Navbar from '../../../components/navbars/header'
import HeaderPerfil from '../../../components/navbars/perfil'
import { InputAdornment, TextField } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import ButtonComponent from '../../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HeaderCadastro from '../../../components/navbars/cadastro';
import TableComponent from '../../../components/table';
import { headerParentesco } from "../../../entities/headers/header-cadastro/header-parentesco";
import { cadastrosParentescos } from "../../../utils/json/cadastro/parentescos";
import CentralModal from "../../../components/modal-central";
import ArticleIcon from '@mui/icons-material/Article';
import SelectTextFields from "../../../components/select";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ModalLateral from "../../../components/modal-lateral";
import EditIcon from '@mui/icons-material/Edit';
import { Save } from "@mui/icons-material";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import MenuMobile from "../../../components/menu-mobile";
const Parentesco = () => {
  const [cadastroParentesco, setCadastroParentesco] = useState(false);
  const [cadastro, setCadastro] = useState(false);
  const [selectedUnidades, setSelectedUnidades] = useState([]);
  const handleCadastroParentesco = () => setCadastroParentesco(true);
  const handleCloseCadastroParentesco = () => setCadastroParentesco(false);
  const [modalEditar, setModalEditar] = useState(false);

  const userOptionsUnidade = [
    { value: "Dourados", label: "Dourados" },
    { value: "Itaporã", label: "Itaporã" },
    { value: "Ponta Porã", label: "Ponta Porã" },
  ];

  const handleUnidadeChange = (event) => {
    const selectedValue = event.target.value;
    if (!selectedUnidades.includes(selectedValue)) {
      setSelectedUnidades([...selectedUnidades, selectedValue]);
    }
  };

  const removeUnidade = (unidade) => {
    setSelectedUnidades(selectedUnidades.filter(item => item !== unidade));
  };

  return (
    <div className="container-contratos-pendentes ">
      <Navbar />
      <div className='flex flex-col gap-2 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='flex gap-2 items-center justify-center text-base sm:ml-1  md:text-2xl  font-bold text-primary w-full md:justify-start   '><SupervisedUserCircleIcon/>Cadastro Parentesco</h1>
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
                label="Buscar parentesco"
                autoComplete="off"
                sx={{ width: '40%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
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
                onClick={handleCadastroParentesco}
              />

            </div>
            <TableComponent
              headers={headerParentesco}
              rows={cadastrosParentescos}
              actionsLabel={"Ações"}
              actionCalls={{
                edit: () => setModalEditar(true), // Passando a referência da função
              }}
            />

            <CentralModal tamanhoTitulo={'82%'} maxHeight={'90vh'} top={'20%'} left={'28%'} width={'620px'} icon={<AddCircleOutlineIcon fontSize="small" />} open={cadastroParentesco} onClose={handleCloseCadastroParentesco} title="Cadastrar Parentescos">
              <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                <div className='mt-4 flex gap-3 flex-wrap'>

                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome do Parentesco"
                    autoComplete="off"
                    sx={{ width: { xs: '96%', sm: '50%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ArticleIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <SelectTextFields
                    width={'260px'}
                    icon={<AccountTreeIcon fontSize="small" />}
                    label={'Unidade'}
                    backgroundColor={"#D9D9D9"}
                    name={"Unidade"}
                    fontWeight={500}
                    options={userOptionsUnidade.filter(option => !selectedUnidades.includes(option.value))}
                    onChange={handleUnidadeChange}
                  />
                </div>
                <div className='mt-4 w-[96%]'>
                  <h3 className="text-xs">Unidades Selecionadas:</h3>
                  <ul className="flex flex-col gap-1">
                    {selectedUnidades.map((unidade, index) => (
                      <li key={index} className="flex justify-between border-[1px] p-2 rounded-lg text-xs ">
                        {unidade}
                        <button style={{ color: 'red' }} onClick={() => removeUnidade(unidade)} className="text-red-500 "><HighlightOffIcon fontSize="small" /></button>
                      </li>
                    ))}
                  </ul>
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
              tituloModal={'Editar Parentesco '}
              tamanhoTitulo={'73%'}
              conteudo={
                <>
                  <div >
                <div className='mt-4 flex gap-3 flex-wrap'>

                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome do Parentesco"
                    autoComplete="off"
                    sx={{ width: '100%', }} // Added margin for spacing
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ArticleIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <SelectTextFields
                    width={'305px'}
                    icon={<AccountTreeIcon fontSize="small" />}
                    label={'Unidade'}
                    backgroundColor={"#D9D9D9"}
                    name={"Unidade"}
                    fontWeight={500}
                    options={userOptionsUnidade.filter(option => !selectedUnidades.includes(option.value))}
                    onChange={handleUnidadeChange}
                  />
                </div>
                <div className='mt-4 w-[100%]'>
                  <h3 className="text-xs">Unidades Selecionadas:</h3>
                  <ul className="flex flex-col gap-1">
                    {selectedUnidades.map((unidade, index) => (
                      <li key={index} className="flex justify-between border-[1px] p-2 rounded-lg text-xs ">
                        {unidade}
                        <button style={{ color: 'red' }} onClick={() => removeUnidade(unidade)} className="text-red-500 "><HighlightOffIcon fontSize="small" /></button>
                      </li>
                    ))}
                  </ul>
                </div>


                <div className="flex w-[100%] items-end justify-end mt-2 ">
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

export default Parentesco