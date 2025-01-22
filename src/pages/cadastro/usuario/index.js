import React, { useState } from "react";
import Navbar from '../../../components/navbars/header';
import HeaderPerfil from '../../../components/navbars/perfil';
import { InputAdornment, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ButtonComponent from '../../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HeaderCadastro from '../../../components/navbars/cadastro';
import TableComponent from '../../../components/table/index';
import { headerUsuario } from '../../../entities/headers/header-cadastro/header-usuario';
import { usuario } from '../../../entities/class/cadastro/usuarios';
import CentralModal from '../../../components/modal-central';
import SelectTextFields from "../../../components/select";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import ModalLateral from "../../../components/modal-lateral";
import NotesIcon from '@mui/icons-material/Notes';
import { LocationOnOutlined, Password, Save } from "@mui/icons-material";
import MenuMobile from "../../../components/menu-mobile";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TableLoading from "../../../components/loading/loading-table/loading";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Usuario = () => {
  const [cadastroUsuario, setCadastroUsuario] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(usuario); // Inicializa com todos os usuários
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [selectedUnidades, setSelectedUnidades] = useState([]);
  const [selectedUser  , setSelectedUser  ] = useState("");
  const [modalEditar, setModalEditar] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const userOptionsUnidade = [
    { value: "Dourados", label: "Dourados" },
    { value: "Itaporã", label: "Itaporã" },
    { value: "Ponta Porã", label: "Ponta Porã" },
  ];

  const userOptionsFuncao = [
    { value: "Recepcionista", label: "Recepcionista" },
    { value: "Suporte", label: "Suporte" },
    { value: "TI", label: "TI" },
  ];

  const handleFuncaoChange = (event) => { setSelectedUser (event.target.value); };

  const handleUnidadeChange = (event) => {
    const selectedValue = event.target.value;
    if (!selectedUnidades.includes(selectedValue)) {
      setSelectedUnidades([...selectedUnidades, selectedValue]);
    }
  };

  const handleCadastroUsuario = () => setCadastroUsuario(true);
  const handleCloseCadastroUsuario = () => setCadastroUsuario(false);

  const removeUnidade = (unidade) => {
    setSelectedUnidades(selectedUnidades.filter(item => item !== unidade));
  };

  const handleSearch = () => {
    setLoading(true); // Inicia o carregamento
    setTimeout(() => {
      const filtered = usuario.filter(user =>
        user.Nome && user.Nome.toLowerCase().includes(searchTerm .toLowerCase()) // Verifica se user.Nome existe
      );
      setFilteredUsers(filtered);
      setLoading(false); // Finaliza o carregamento
    }, 2000); // 2 segundos de atraso
  };

  return (
    <div className="container-contratos-pendentes ">
      <Navbar />
      <div className='flex flex-col gap-2 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='flex gap-2 items-center justify-center text-base sm:ml-1  md:text-2xl  font-bold text-primary w-full md:justify-start   '>
          <AccountCircleIcon />Cadastro Usuários
        </h1>
        <div className='flex w-full gap-1 mt-9 '>
          <div className="hidden sm:hidden md:block w-[13%]">
            <HeaderCadastro />
          </div>

          <div className="mt-2 ml-2 sm:mt-0 md:flex flex-col w-[97%]">
            <div className='flex gap-2'>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Buscar usuário"
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '40%' }, }}
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
                onClick={handleSearch}
              />
              <ButtonComponent
                startIcon={<AddCircleOutlineIcon fontSize='small' />}
                title={'Cadastrar'}
                subtitle={'Cadastrar'}
                buttonSize="large"
                onClick={handleCadastroUsuario}
              />
            </div>
            <div className="w-[97%] ml-0 sm:ml-0 ">
              {loading ? (
                <div className='flex items-center justify-center h-96'>
                  <TableLoading />
                </div>
              ) : (
                <TableComponent
                  headers={headerUsuario}
                  rows={filteredUsers} // Atualiza para usar filteredUsers
                  actionsLabel={"Ações"}
                  actionCalls={{
                    edit: () => setModalEditar(true),
                  }}
                />
              )}
            </div>


            <CentralModal tamanhoTitulo={'82%'} maxHeight={'90vh'} top={'20%'} left={'28%'} width={'620px'} icon={<AddCircleOutlineIcon fontSize="small" />} open={cadastroUsuario} onClose={handleCloseCadastroUsuario} title="Cadastrar Usuário">
              <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                <div className='mt-4 flex gap-3 flex-wrap'>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome Completo"
                    autoComplete="off"
                    sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="CPF"
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NotesIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Senha"
                    autoComplete="off"
                    sx={{ width: { xs: '47%', sm: '50%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Password />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <SelectTextFields
                    width={'260px'}
                    icon={<AccountTreeIcon fontSize="small" />}
                    label={'Função'}
                    backgroundColor={"#D9D9D9"}
                    name={"Função"}
                    fontWeight={500}
                    options={userOptionsFuncao}
                    onChange={handleFuncaoChange}
                  />
                  <SelectTextFields
                    width={'260px'}
                    icon={<LocationOnOutlined fontSize="small" />}
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

                <div className="w-full flex items-center mt-4 ml-2 font-bold mb-1">
                  <label className="w-[70%] text-xs">Permissão</label>
                  <label className="w-[10%] text-xs">Ler</label>
                  <label className="w-[10%] text-xs">Gravar</label>
                </div>

                <div className="w-[96%] border-[1px] p-2 rounded-lg">
                  <div className="w-full flex items-center">
                    <label className="text-xs w-[73%]">Telemarketing</label>
                    <div className="w-[12%]">
                      <Checkbox {...label} />
                    </div>
                    <div>
                      <Checkbox {...label} />
                    </div>
                  </div>
                  <div className="w-full flex items-center">
                    <label className="text-xs w-[73%]">Cadastro</label>
                    <div className="w-[12%]">
                      <Checkbox {...label} />
                    </div>
                    <div>
                      <Checkbox {...label} />
                    </div>
                  </div>
                  <div className="w-full flex items-center">
                    <label className="text-xs w-[73%]">Web Vendedor</label>
                    <div className="w-[12%]">
                      <Checkbox {...label} />
                    </div>
                    <div>
                      <Checkbox {...label} />
                    </div>
                  </div>
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
              tituloModal={'Editar Usuário'}
              tamanhoTitulo={'73%'}
              conteudo={
                <>

                  <div className=' flex gap-3 flex-wrap'>
                    <div className="flex items-center">
                      <div className="flex flex-col w-[35%] text-xs mr-4">
                        <label >Status</label>
                        <div className="flex items-center">
                          <Checkbox checked={isActive} onChange={() => setIsActive(!isActive)} />
                          <label className="text-xs">{isActive ? "Ativo" : "Inativo"}</label>

                        </div>


                      </div>

                    </div>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Nome Completo"
                      autoComplete="off"
                      sx={{ width: '100%', }} // Added margin for spacing
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="CPF"
                      autoComplete="off"
                      sx={{ width: '49%', }} // Added margin for spacing
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NotesIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Senha"
                      type="password"
                      autoComplete="off"
                      sx={{ width: '47%', }} // Added margin for spacing
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Password />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <SelectTextFields
                      width={'150px'}
                      icon={<AccountTreeIcon fontSize="small" />}
                      label={'Função'}
                      backgroundColor={"#D9D9D9"}
                      name={"Função"}
                      fontWeight={500}
                      options={userOptionsFuncao}
                      onChange={handleFuncaoChange}
                    />
                    <SelectTextFields
                      width={'143px'}
                      icon={<LocationOnOutlined fontSize="small" />}
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

                  <div className="w-full flex items-center mt-4 ml-2 font-bold mb-1">
                    <label className="w-[73%] text-xs">Permissão</label>
                    <label className="w-[10%] text-xs">Ler</label>
                    <label className="w-[10%] text-xs">Gravar</label>
                  </div>

                  <div className="w-[100%] border-[1px] p-2 rounded-lg">
                    <div className="w-full flex items-center">
                      <label className="text-xs w-[73%]">Telemarketing</label>
                      <div className="w-[12%]">
                        <Checkbox {...label} />
                      </div>
                      <div>
                        <Checkbox {...label} />
                      </div>
                    </div>
                    <div className="w-full flex items-center">
                      <label className="text-xs w-[73%]">Cadastro</label>
                      <div className="w-[12%]">
                        <Checkbox {...label} />
                      </div>
                      <div>
                        <Checkbox {...label} />
                      </div>
                    </div>
                    <div className="w-full flex items-center">
                      <label className="text-xs w-[73%]">Web Vendedor</label>
                      <div className="w-[12%]">
                        <Checkbox {...label} />
                      </div>
                      <div>
                        <Checkbox {...label} />
                      </div>
                    </div>
                    <div className="flex w-[100%] items-end justify-end ">
                      <ButtonComponent
                        startIcon={<Save fontSize='small' />}
                        title={'Salvar'}
                        subtitle={'Salvar'}
                        buttonSize="large"
                      />
                    </div>
                  </div>
                </>}
            />

          </div>
        </div>
      </div>
    </div>
  )
}

export default Usuario