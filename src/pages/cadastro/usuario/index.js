import React, { useState, useEffect } from "react";
import Navbar from '../../../components/navbars/header';
import HeaderPerfil from '../../../components/navbars/perfil';
import ButtonComponent from '../../../components/button';
import HeaderCadastro from '../../../components/navbars/cadastro';
import TableComponent from '../../../components/table/index';
import CentralModal from '../../../components/modal-central';
import SelectTextFields from "../../../components/select";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Checkbox from '@mui/material/Checkbox';
import MenuMobile from "../../../components/menu-mobile";
import { headerUsuario } from "../../../entities/headers/header-usuarios";
import ModalLateral from "../../../components/modal-lateral";
import { Edit } from '@mui/icons-material';
import { formatCPF } from "../../../utils/functions";
import CustomToast from "../../../components/toast";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import TableLoading from "../../../components/loading/loading-table/loading";

import { IconButton, InputAdornment, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotesIcon from '@mui/icons-material/Notes';
import { LocationOnOutlined, Password } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Usuario = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cadastroUsuario, setCadastroUsuario] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnidades, setSelectedUnidades] = useState([]);
  const [cpf, setCpf] = useState('')
  const [userOptionsUnidade, setUserOptionsUnidade] = useState([]);
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    nome: '',
    cpf: '',
    senha: '',
    funcao: '',
    unidade: '',
    permissoes: {
      administrador: false,
      basico: false,
    },
  });



  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCheckboxChange = (permissao) => {
    const updatedPermissoes = {
      administrador: false,
      basico: false,
    };


    updatedPermissoes[permissao] = true;

    setNewUser({
      ...newUser,
      permissoes: updatedPermissoes,
    });
  };


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCadastroUsuario = () => setCadastroUsuario(true);
  const handleCloseCadastroUsuario = () => {
    setCadastroUsuario(false);
    setNewUser({
      nome: '',
      cpf: '',
      senha: '',
      funcao: '',
      unidade: '',
      permissoes: {
        administrador: false,
        basico: false,
      },
    });
    setSelectedUnidades([]);
  };

  const handleCloseEditUser = () => {
    setEditandoUsuario(false);
    setEditUser(null);
    setNewUser({
      nome: '',
      cpf: '',
      senha: '',
      unidade: '',
      permissoes: {
        administrador: false,
        basico: false,
      },
    });
    setSelectedUnidades([]);
  };

  const removeUnidade = (unidade) => {
    setSelectedUnidades(selectedUnidades.filter(item => item !== unidade));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Desabilita o botão

    try {
        // Validações dos campos
        if (!newUser .nome) {
            CustomToast({ type: "error", message: "O nome é obrigatório." });
            return;
        }
        if (!newUser .cpf) {
            CustomToast({ type: "error", message: "O CPF é obrigatório." });
            return;
        }
        if (!newUser .senha) {
            CustomToast({ type: "error", message: "A senha é obrigatória." });
            return;
        }
        if (selectedUnidades.length === 0) {
            CustomToast({ type: "error", message: "Pelo menos uma unidade deve ser selecionada." });
            return;
        }

        // Verifica se o CPF já está cadastrado
        const cpfExistente = users.find(user => user.cpf === newUser .cpf);
        if (cpfExistente) {
            CustomToast({ type: "error", message: "CPF já cadastrado. Não é possível cadastrar outro." });
            return;
        }

        // Verifica se a senha tem pelo menos 6 dígitos
        if (newUser .senha.length < 6) {
            CustomToast({ type: "error", message: "A senha deve conter pelo menos 6 dígitos." });
            return;
        }

        // Prepara os dados do usuário para enviar ao backend
        const userData = {
            nome: newUser .nome,
            cpf: newUser .cpf,
            senha: newUser .senha,
            tipo: newUser .permissoes.administrador ? 1 : (newUser .permissoes.basico ? 2 : 0),
            unidadeId: selectedUnidades.map(unidade => {
                const unidadeObj = userOptionsUnidade.find(option => option.label === unidade);
                return unidadeObj ? unidadeObj.value : null;
            }).filter(id => id !== null),
        };

        // Faz a chamada à API para cadastrar o usuário
        const response = await api.post('/usuario', userData);

        if (response.status === 201) {
            // Atualiza a lista de usuários
            const updatedUsers = [...users, response.data];
            setUsers(updatedUsers);

            // Fecha o modal de cadastro e limpa os campos
            handleCloseCadastroUsuario();
            CustomToast({ type: "success", message: "Usuário cadastrado com sucesso!" });
        } else {
            CustomToast({ type: "error", message: "Erro ao cadastrar usuário!" });
        }
    } catch (error) {
        if (
            error.response &&
            error.response.data.message === "Credenciais inválidas" &&
            error.response.data.data === "Token de acesso inválido"
        ) {
            CustomToast({ type: "error", message: "Sessão expirada. Faça login novamente." });
            navigate("/");
        } else {
            CustomToast({ type: "error", message: "Erro ao cadastrar usuário!" });
        }
    } finally {
        setIsSubmitting(false); // Reabilita o botão
    }
};

  const handleEditUser = (user) => {
    setEditUser(user);
    setNewUser({
      nome: user.nome,
      cpf: formatCPF(user.cpf),
      senha: user.senha,
      funcao: user.funcao || '',
      unidade: user.unidade || '',
      permissoes: {
        administrador: user.tipo === "1",
        basico: user.tipo === "2",
      },
    });

    setSelectedUnidades(
      user.unidadeId.map((id) => {
        const unidadeObj = userOptionsUnidade.find((option) => option.value === id);
        return unidadeObj ? unidadeObj.label : null;
      }).filter((label) => label !== null)
    );
    setEditandoUsuario(true);
  };

  const handleUpdateUser = async () => {
    try {
      // Validações dos campos
      if (!newUser.nome) {
        CustomToast({ type: "error", message: "O nome é obrigatório." });
        return;
      }
      if (!newUser.cpf) {
        CustomToast({ type: "error", message: "O CPF é obrigatório." });
        return;
      }
      if (!newUser.senha) {
        CustomToast({ type: "error", message: "A senha é obrigatória." });
        return;
      }
      if (selectedUnidades.length === 0) {
        CustomToast({ type: "error", message: "Pelo menos uma unidade deve ser selecionada." });
        return;
      }

      const cpfExistente = users.find(user => user.cpf === newUser.cpf && user.cpf !== editUser.cpf);
      if (cpfExistente) {
        CustomToast({ type: "error", message: "CPF já cadastrado. Não é possível cadastrar outro." });
        return;
      }

      if (newUser.senha.length < 6) {
        CustomToast({ type: "error", message: "A senha deve conter pelo menos 6 dígitos." });
        return;
      }

      const userData = {
        nome: newUser.nome,
        cpf: newUser.cpf,
        senha: newUser.senha,
        tipo: newUser.permissoes.administrador ? 1 : (newUser.permissoes.basico ? 2 : 0),
        unidadeId: selectedUnidades.map(unidade => {
          const unidadeObj = userOptionsUnidade.find(option => option.label === unidade);
          return unidadeObj ? unidadeObj.value : null;
        }).filter(id => id !== null),
      };

      const response = await api.put(`/usuario/${editUser.id}`, userData);

      if (response.status === 200) {
        const updatedUsers = users.map(user => {
          if (user.id === editUser.id) {
            return { ...userData, unidades: selectedUnidades };
          }
          return user;
        });

        setUsers(updatedUsers);
        setEditandoUsuario(false);
        setEditUser(null);
        setNewUser({
          nome: '',
          cpf: '',
          senha: '',
          unidade: '',
          permissoes: {
            administrador: false,
            basico: false,
          },
        });
        handleCloseEditUser();
        fetchUsers();

        CustomToast({ type: "success", message: response.data.message || "Usuário atualizado com sucesso!" });
      } else {
        CustomToast({ type: "success", message: "Usuário atualizado com sucesso!" });
        handleCloseEditUser();
        fetchUsers();

      }
    } catch (error) {
      CustomToast({ type: "error", message: error.response?.data?.message || "Erro ao atualizar usuário!" });
    }
  };



  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setCpf(formattedCPF);
    setNewUser({ ...newUser, cpf: formattedCPF });
  };


  const fetchUsers = async () => {
    try {
      const response = await api.get('/usuario');
      setUsers(response.data.data || []);
    } catch (error) {
      ;

      if (
        error.response &&
        error.response.data.message === "Credenciais inválidas" &&
        error.response.data.data === "Token de acesso inválido"
      ) {
        CustomToast({ type: "error", message: "Sessão expirada. Faça login novamente." });
        navigate("/");
      } else {
        CustomToast({ type: "error", message: "Erro ao buscar usuários!" });
      }
    }
  };

  const handleInactiveUser = async (user) => {
    console.log("Marking user as inactive with ID:", user.id);
    try {
      const response = await api.delete(`/usuario/${user.id}`);
      if (response.status === 200) {
        // Update the user state to mark as inactive
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            return { ...u, isActive: false }; // Mark user as inactive
          }
          return u;
        });
        setUsers(updatedUsers);
        CustomToast({ type: "success", message: response.data.message || "Usuário inativado com sucesso!" });
      } else {
        CustomToast({ type: "error", message: "Erro ao inativar usuário!" });
      }
    } catch (error) {
      CustomToast({ type: "error", message: error.response?.data?.message || "Erro ao inativar usuário!" });
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
      user && typeof user === 'object' && (user.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];


  const handleUnidadeChange = (event) => {
    const selectedValue = event.target.value;
    const unidadeObj = userOptionsUnidade.find(option => option.value === selectedValue);
    if (unidadeObj && !selectedUnidades.includes(unidadeObj.label)) {
      setSelectedUnidades([...selectedUnidades, unidadeObj.label]);
    }
  };

  const handleDeleteUser = async (user) => {
    console.log("Deleting user with ID:", user.id);
    try {
      const response = await api.delete(`/usuario/${user.id}`);
      if (response.status === 200) {
        const updatedUsers = users.filter(u => u.id !== user.id);
        setUsers(updatedUsers);
        CustomToast({ type: "success", message: response.data.message || "Usuário excluído com sucesso!" });
      } else {
        CustomToast({ type: "error", message: "Erro ao excluir usuário!" });
      }
    } catch (error) {
      CustomToast({ type: "error", message: error.response?.data?.message || "Erro ao excluir usuário!" });
    }
  };

  const carregarUnidades = async () => {
    try {
      const response = await api.get("/unidade");
      const unidadesOptions = response.data.data.map(unidade => ({
        value: unidade.id,
        label: unidade.nome
      }));
      setUserOptionsUnidade(unidadesOptions);
    } catch (error) {
      console.error("Erro ao carregar as unidades:", error);
    }
  };

  const rows = filteredUsers.map(user => {
    const unidadeNames = Array.isArray(user.unidadeId) ? user.unidadeId.map(id => {
      const unidadeObj = userOptionsUnidade.find(option => option.value === id);
      return unidadeObj ? unidadeObj.label : "Unidade Desconhecida";
    }) : [];
    return {
      ...user,
      unidade: unidadeNames.join(", ") || "Unidade Desconhecida",
      edit: () => handleEditUser(user),
      delete: () => handleDeleteUser(user),
    };
  });
  useEffect(() => {
    carregarUnidades();
  }, []);

  useEffect(() => {

  }, [userOptionsUnidade]);

  useEffect(() => {
    fetchUsers();
  }, []);

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
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
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
              {filteredUsers.length === 0 ? (
                <div className="flex w-full flex-col items-center justify-center gap-5 h-96">
                  <TableLoading />
                  <label className="text-sm">Não foi encontrado um usuário com esse nome!</label>
                </div>
              ) : (
                <TableComponent
                  headers={headerUsuario}
                  rows={rows}
                  actionsLabel={"Ações"}
                  actionCalls={{
                    edit: (user) => handleEditUser(user),
                    inactivate: (user) => handleInactiveUser(user),
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
                      inputProps: {
                        maxLength: 11,
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Senha"
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    value={newUser.senha}
                    onChange={handleInputChange}
                    autoComplete="off"
                    sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Password />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <SelectTextFields
                    width={'260px'}
                    icon={< LocationOnOutlined fontSize="small" />}
                    label={'Unidade'}
                    backgroundColor={"#D9D9D9"}
                    name={"unidade"}
                    fontWeight={500}
                    options={userOptionsUnidade}
                    onChange={handleUnidadeChange}
                  />
                </div>
                <div className='mt-4 w-[96%]'>
                  <h3 className="text-xs">Unidades Selecionadas:</h3>
                  <ul className="flex flex-col gap-1">
                    {selectedUnidades.map((unidade, index) => (
                      <li key={index} className="flex justify-between border-[1px] p-2 rounded-lg text-xs ">
                        {unidade}
                        <button style={{ color: 'red' }} onClick={() => removeUnidade(unidade)} className="text-red-500 ">
                          <HighlightOffIcon fontSize="small" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full flex items-center mt-4 ml-2 font-bold mb-1">
                  <label className="w-[70%] text-xs">Permissão</label>
                </div>

                <div className="w-[96%] border-[1px] p-2 rounded-lg">
                  {Object.keys(newUser.permissoes).map((permissao) => (
                    <div className="w-full flex items-center" key={permissao}>
                      <div className="w-[12%]">
                        <Checkbox
                          checked={newUser.permissoes[permissao].ler}
                          onChange={() => handleCheckboxChange(permissao, 'ler')}
                        />
                      </div>
                      <label className="text-xs w-[73%]">{permissao.charAt(0).toUpperCase() + permissao.slice(1)}</label>


                    </div>
                  ))}
                </div>
                <div className="flex w-[96%] items-end justify-end mt-2 ">
                  <ButtonComponent
                    startIcon={<AddCircleOutlineIcon fontSize='small' />}
                    title={'Cadastrar'}
                    subtitle={'Cadastrar'}
                    buttonSize="large"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CentralModal>

            <ModalLateral
              open={editandoUsuario}
              handleClose={handleCloseEditUser}
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
                      value={newUser.cpf}
                      onChange={handleCPFChange}
                      autoComplete="off"
                      sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '47%' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NotesIcon />
                          </InputAdornment>
                        ),
                        inputProps: {
                          maxLength: 11,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Senha"
                      name="senha"
                      type={showPassword ? "text" : "password"}
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
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <SelectTextFields
                      width={'260px'}
                      icon={<LocationOnOutlined fontSize="small" />}
                      label={'Unidade'}
                      backgroundColor={"#D9D9D9"}
                      name={"unidade"}
                      fontWeight={500}
                      options={userOptionsUnidade}
                      onChange={handleUnidadeChange}
                    />
                  </div>
                  <div className='mt-4 w-[96%]'>
                    <h3 className="text-xs">Unidades Selecionadas:</h3>
                    <ul className="flex flex-col gap-1">
                      {selectedUnidades.map((unidade, index) => (
                        <li key={index} className="flex justify-between border-[1px] p-2 rounded-lg text-xs ">
                          {unidade}
                          <button style={{ color: 'red' }} onClick={() => removeUnidade(unidade)} className="text-red-500 ">
                            <HighlightOffIcon fontSize="small" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-full flex items-center mt-4 ml-2 font-bold mb-1">
                    <label className="w-[70%] text-xs">Permissão</label>
                  </div>

                  <div className="w-[96%] border-[1px] p-2 rounded-lg">
                    {Object.keys(newUser.permissoes).map((permissao) => (
                      <div className="w-full flex  items-center" key={permissao}>
                        <div className="w-[12%]">
                          <Checkbox
                            checked={newUser.permissoes[permissao]}
                            onChange={() => handleCheckboxChange(permissao)}
                          />
                        </div>
                        <label className="text-xs w-[73%]">{permissao.charAt(0).toUpperCase() + permissao.slice(1)}</label>
                      </div>
                    ))}
                  </div>
                  <div className="flex w-[96%] items-end justify-end mt-2 ">
                    <ButtonComponent
                      startIcon={<AddCircleOutlineIcon fontSize='small' />}
                      title={'Salvar'}
                      subtitle={'Salvar'}
                      buttonSize="large"
                      onClick={handleUpdateUser}
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