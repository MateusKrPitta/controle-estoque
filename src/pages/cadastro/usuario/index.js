import React, { useState, useEffect } from "react";
import Navbar from '../../../components/navbars/header';
import HeaderPerfil from '../../../components/navbars/perfil';
import { InputAdornment, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ButtonComponent from '../../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HeaderCadastro from '../../../components/navbars/cadastro';
import TableComponent from '../../../components/table/index';
import CentralModal from '../../../components/modal-central';
import SelectTextFields from "../../../components/select";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Checkbox from '@mui/material/Checkbox';
import NotesIcon from '@mui/icons-material/Notes';
import { LocationOnOutlined, Password } from "@mui/icons-material";
import MenuMobile from "../../../components/menu-mobile";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TableLoading from "../../../components/loading/loading-table/loading";
import { headerUsuario } from "../../../entities/headers/header-usuarios";
import ModalLateral from "../../../components/modal-lateral";
import { Edit } from '@mui/icons-material';
import { formatCPF } from "../../../utils/functions";
import CustomToast from "../../../components/toast";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Usuario = () => {
  const [cadastroUsuario, setCadastroUsuario] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUnidades, setSelectedUnidades] = useState([]);
  const [cpf, setCpf] = useState('')
  const [userOptionsUnidade, setUserOptionsUnidade] = useState([]);
  const [users, setUsers] = useState([]);
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null); // Estado para o usuário a ser editado
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    nome: '',
    cpf: '',
    senha: '',
    funcao: '',
    unidade: '',
    permissoes: {
      dashboard: { ler: false, gravar: false },
      cmv: { ler: false, gravar: false },
      produtos: { ler: false, gravar: false },
      fichaTecnica: { ler: false, gravar: false },
      relatorios: { ler: false, gravar: false },
      cadastro: { ler: false, gravar: false },
    },
  });
      const [isVisible, setIsVisible] = useState(false);
  
      useEffect(() => {
          const timer = setTimeout(() => {
              setIsVisible(true);
          }, 300); // Delay para a transição
  
          return () => clearTimeout(timer);
      }, []);

  const userOptionsFuncao = [
    { value: "Recepcionista", label: "Recepcionista" },
    { value: "Suporte", label: "Suporte" },
    { value: "TI", label: "TI" },
  ];

  useEffect(() => {
    // Carregar unidades do localStorage
    const unidadesSalvas = JSON.parse(localStorage.getItem("unidades")) || [];
    const unidadesOptions = unidadesSalvas.map(unidade => ({
      value: unidade.nome,
      label: unidade.nome,
    }));
    setUserOptionsUnidade(unidadesOptions);

    // Carregar usuários do localStorage
    const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || [];
    setUsers(usuariosSalvos);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCheckboxChange = (permissao, tipo) => {
    setNewUser({
      ...newUser,
      permissoes: {
        ...newUser.permissoes,
        [permissao]: {
          ...newUser.permissoes[permissao],
          [tipo]: !newUser.permissoes[permissao][tipo],
        },
      },
    });
  };

  const handleUnidadeChange = (event) => {
    const selectedValue = event.target.value;
    if (!selectedUnidades.includes(selectedValue)) {
      setSelectedUnidades([...selectedUnidades, selectedValue]);
    }
  };

  const handleFuncaoChange = (event) => {
    const selectedValue = event.target.value;
    setNewUser({ ...newUser, funcao: selectedValue }); // Atualiza a função no estado
  };

  const handleCadastroUsuario = () => setCadastroUsuario(true);
  const handleCloseCadastroUsuario = () => setCadastroUsuario(false);

  const removeUnidade = (unidade) => {
    setSelectedUnidades(selectedUnidades.filter(item => item !== unidade));
  };

  const handleSubmit = () => {
    const updatedUsers = [...users, { ...newUser, unidades: selectedUnidades }];
    setUsers(updatedUsers);
    localStorage.setItem("usuarios", JSON.stringify(updatedUsers));
    handleCloseCadastroUsuario();
    setNewUser({
      nome: '',
      cpf: '', // Aqui, o CPF é parte do objeto newUser 
      senha: '',
      funcao: '',
      unidade: '',
      permissoes: {
        dashboard: { ler: false, gravar: false },
        cmv: { ler: false, gravar: false },
        produtos: { ler: false, gravar: false },
        fichaTecnica: { ler: false, gravar: false },
        relatorios: { ler: false, gravar: false },
        cadastro: { ler: false, gravar: false },
      },
    });
    setSelectedUnidades([]);
    CustomToast({ type: "success", message: "Usuário cadastrado com sucesso!" });
  };

  const handleEditUser = (user) => {
    setEditUser(user); // Preenche o estado com os dados do usuário a ser editado
    setNewUser(user); // Preenche o estado de criação com os dados do usuário a ser editado
    setSelectedUnidades(user.unidades || []); // Preenche as unidades selecionadas
    setEditandoUsuario(true); // Abre a modal de edição
  };

  const handleUpdateUser = () => {
    const updatedUsers = users.map(user =>
      user.cpf === editUser.cpf ? newUser : user // Atualiza o usuário editado
    );
    setUsers(updatedUsers);
    localStorage.setItem("usuarios", JSON.stringify(updatedUsers));
    setEditandoUsuario(false);
    setEditUser(null); // Limpa o estado do usuário a ser editado
    setNewUser({ // Reseta o estado de criação
      nome: '',
      cpf: '', // Aqui, o CPF é parte do objeto newUser 
      senha: '',
      funcao: '',
      unidade: '',
      permissoes: {
        dashboard: { ler: false, gravar: false },
        cmv: { ler: false, gravar: false },
        produtos: { ler: false, gravar: false },
        fichaTecnica: { ler: false, gravar: false },
        relatorios: { ler: false, gravar: false },
        cadastro: { ler: false, gravar: false },
      },
      
    });
    CustomToast({ type: "success", message: "Usuário atualizado com sucesso!" });
  };

  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setCpf(formattedCPF);
  };


  const filteredUsers = users.filter(user => user.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex w-full ">
      <Navbar />
      <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start   '>
          <AccountCircleIcon />Cadastro Usuários
        </h1>
        <div className={`items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          <div className="hidden md:w-[14%] md:flex ">
            <HeaderCadastro />
          </div>
          <div className="w-[100%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col md:w-[80%]">
            <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Buscar usuário"
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: { xs: '90%', sm: '50%', md: '40%', lg: '40%' }, }}
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
                  rows={filteredUsers.map(user => ({
                    ...user,
                    edit: () => handleEditUser(user), // Adiciona a função de edição
                  }))}
                  actionsLabel={"Ações"}
                  actionCalls={{
                    edit: (user) => handleEditUser(user), // Chama a função de edição
                  }}
                />
              )}
            </div>

            <CentralModal
              tamanhoTitulo={'81%'}
              maxHeight={'90vh'}
              top={'20%'}
              left={'28%'}
              width={'620px'}
              icon={<AddCircleOutlineIcon fontSize="small" />}
              open={cadastroUsuario}
              onClose={handleCloseCadastroUsuario}
              title="Cadastrar Usuário"
            >
              <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                <div className='mt-4 flex gap-3 flex-wrap'>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome Completo"
                    name="nome"
                    value={newUser.nome}
                    onChange={handleInputChange}
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
                    name="cpf"
                    value={cpf}
                    onChange={handleCPFChange}
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
                    name="senha"
                    type="password"
                    value={newUser.senha}
                    onChange={handleInputChange}
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
                    name={"funcao"}
                    fontWeight={500}
                    options={userOptionsFuncao}
                    onChange={handleFuncaoChange} // Atualiza a função no estado
                  />
                  <SelectTextFields
                    width={'260px'}
                    icon={<LocationOnOutlined fontSize="small" />}
                    label={'Unidade'}
                    backgroundColor={"#D9D9D9"}
                    name={"unidade"}
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
                  {Object.keys(newUser.permissoes).map((permissao) => (
                    <div className="w-full flex items-center" key={permissao}>
                      <label className="text-xs w-[73%]">{permissao.charAt(0).toUpperCase() + permissao.slice(1)}</label>
                      <div className="w-[12%]">
                        <Checkbox
                          checked={newUser.permissoes[permissao].ler}
                          onChange={() => handleCheckboxChange(permissao, 'ler')}
                        />
                      </div>
                      <div>
                        <Checkbox
                          checked={newUser.permissoes[permissao].gravar}
                          onChange={() => handleCheckboxChange(permissao, 'gravar')}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex w-[96%] items-end justify-end mt-2 ">
                  <ButtonComponent
                    startIcon={<AddCircleOutlineIcon fontSize='small' />}
                    title={'Cadastrar'}
                    subtitle={'Cadastrar'}
                    buttonSize="large"
                    onClick={handleSubmit} // Chama a função de cadastro
                  />
                </div>
              </div>
            </CentralModal>

            <ModalLateral
              open={editandoUsuario}
              handleClose={() => setEditandoUsuario(false)}
              tituloModal="Editar Usuário"
              icon={<Edit />}
              tamanhoTitulo="75%"
              conteudo={
                <div className="">
                  <div className='mt-4 flex gap-3 flex-wrap'>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Nome Completo"
                      name="nome"
                      value={newUser.nome} // Use newUser  para edição
                      onChange={handleInputChange}
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
                      name="cpf"
                      value={newUser.cpf} // Use newUser  para edição
                      onChange={handleCPFChange} // Certifique-se de que o CPF está sendo atualizado no objeto newUser 
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
                      name="senha"
                      type="password"
                      value={newUser.senha} // Use newUser  para edição
                      onChange={handleInputChange}
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
                      name={"funcao"}
                      fontWeight={500}
                      options={userOptionsFuncao}
                      value={newUser.funcao} // Use newUser  para edição
                      onChange={handleFuncaoChange}
                    />
                    <SelectTextFields
                      width={'260px'}
                      icon={<LocationOnOutlined fontSize="small" />}
                      label={'Unidade'}
                      backgroundColor={"#D9D9D9"}
                      name={"unidade"}
                      fontWeight={500}
                      options={userOptionsUnidade.filter(option => !selectedUnidades.includes(option.value))}
                      value={newUser.unidade} // Use newUser  para edição
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
                    {Object.keys(newUser.permissoes).map((permissao) => (
                      <div className="w-full flex items-center" key={permissao}>
                        <label className="text-xs w-[73%]">{permissao.charAt(0).toUpperCase() + permissao.slice(1)}</label>
                        <div className="w-[12%]">
                          <Checkbox
                            checked={newUser.permissoes[permissao].ler} // Use newUser  para verificar se a permissão "ler" está marcada
                            onChange={() => handleCheckboxChange(permissao, 'ler')}
                          />
                        </div>
                        <div>
                          <Checkbox
                            checked={newUser.permissoes[permissao].gravar} // Use newUser  para verificar se a permissão "gravar" está marcada
                            onChange={() => handleCheckboxChange(permissao, 'gravar')}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex w-[96%] items-end justify-end mt-2 ">
                    <ButtonComponent
                      startIcon={<AddCircleOutlineIcon fontSize='small' />}
                      title={'Salvar'}
                      subtitle={'Salvar'}
                      buttonSize="large"
                      onClick={handleUpdateUser} // Chama a função de atualização
                    />
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usuario;