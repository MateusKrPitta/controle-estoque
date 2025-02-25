import React, { useState, useEffect } from "react";
import Navbar from '../../../components/navbars/header';
import HeaderPerfil from '../../../components/navbars/perfil';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ButtonComponent from '../../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HeaderCadastro from '../../../components/navbars/cadastro';
import TableComponent from '../../../components/table/index';
import CentralModal from '../../../components/modal-central';
import SelectTextFields from "../../../components/select";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Checkbox from '@mui/material/Checkbox';
import NotesIcon from '@mui/icons-material/Notes';
import { LocationOnOutlined, Password } from "@mui/icons-material";
import MenuMobile from "../../../components/menu-mobile";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { headerUsuario } from "../../../entities/headers/header-usuarios";
import ModalLateral from "../../../components/modal-lateral";
import { Edit } from '@mui/icons-material';
import { formatCPF } from "../../../utils/functions";
import CustomToast from "../../../components/toast";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from '@mui/icons-material';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Usuario = () => {
  const navigate = useNavigate();
  const [cadastroUsuario, setCadastroUsuario] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUnidades, setSelectedUnidades] = useState([]);
  const [cpf, setCpf] = useState('')
  const [userOptionsUnidade, setUserOptionsUnidade] = useState([]);
  const [editandoUsuario, setEditandoUsuario] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    }, 300); // Delay para a transição

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCheckboxChange = (permissao) => {
    // Cria um novo objeto de permissões, definindo todas como false
    const updatedPermissoes = {
      administrador: false,
      basico: false,
    };

    // Define apenas a permissão selecionada como true
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
    setSelectedUnidades([]); // Limpa as unidades selecionadas
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
    setSelectedUnidades([]); // Limpa as unidades selecionadas
  };

  const removeUnidade = (unidade) => {
    setSelectedUnidades(selectedUnidades.filter(item => item !== unidade));
  };

  const handleSubmit = async () => {
    try {
      // Validação dos campos obrigatórios
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

      // Validação do CPF
      const cpfExistente = users.find(user => user.cpf === newUser.cpf);
      if (cpfExistente) {
        CustomToast({ type: "error", message: "CPF já cadastrado. Não é possível cadastrar outro." });
        return; // Retorna para evitar o envio
      }

      // Validação da senha
      if (newUser.senha.length < 6) {
        CustomToast({ type: "error", message: "A senha deve conter pelo menos 6 dígitos." });
        return; // Retorna para evitar o envio
      }

      // Prepara os dados do usuário
      const userData = {
        nome: newUser.nome,
        cpf: newUser.cpf,
        senha: newUser.senha,
        tipo: newUser.permissoes.administrador ? 1 : (newUser.permissoes.basico ? 2 : 0), // 1 para administrador, 2 para básico
        unidadeId: selectedUnidades.map(unidade => {
          const unidadeObj = userOptionsUnidade.find(option => option.label === unidade);
          return unidadeObj ? unidadeObj.value : null; // Aqui você pega o ID da unidade
        }).filter(id => id !== null),
      };

      // Envia os dados para a API usando a instância configurada
      const response = await api.post('/usuario', userData); // Use a instância 'api'

      // Atualiza a lista de usuários com as unidades
      const updatedUsers = [...users, { ...userData, unidades: selectedUnidades }];
      setUsers(updatedUsers);

      handleCloseCadastroUsuario();
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
      CustomToast({ type: "success", message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      // Verifica se o erro é devido a um token expirado
      if (
        error.response &&
        error.response.data.message === "Credenciais inválidas" &&
        error.response.data.data === "Token de acesso inválido"
      ) {
        CustomToast({ type: "error", message: "Sessão expirada. Faça login novamente." });
        navigate("/login"); // Redireciona para a tela de login
      } else {
        CustomToast({ type: "error", message: "Erro ao cadastrar usuário!" });
      }
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user); // Preenche o estado com os dados do usuário a ser editado
    setNewUser({
      nome: user.nome,
      cpf: formatCPF(user.cpf), // Formata o CPF aqui
      senha: user.senha,
      funcao: user.funcao || '',
      unidade: user.unidade || '',
      permissoes: {
        administrador: user.tipo === "1", // Se tipo for 1, administrador deve ser true
        basico: user.tipo === "2", // Se tipo for 2, basico deve ser true
      },
    });

    setSelectedUnidades(
      user.unidadeId.map((id) => {
        const unidadeObj = userOptionsUnidade.find((option) => option.value === id);
        return unidadeObj ? unidadeObj.label : null; // Aqui você pega o nome da unidade
      }).filter((label) => label !== null)
    );
    setEditandoUsuario(true); // Abre a modal de edição
  };

  const handleUpdateUser = async () => {
    try {
      // Validação dos campos obrigatórios
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

      // Validação do CPF
      const cpfExistente = users.find(user => user.cpf === newUser.cpf && user.cpf !== editUser.cpf);
      if (cpfExistente) {
        CustomToast({ type: "error", message: "CPF já cadastrado. Não é possível cadastrar outro." });
        return; // Retorna para evitar o envio
      }

      // Validação da senha
      if (newUser.senha.length < 6) {
        CustomToast({ type: "error", message: "A senha deve conter pelo menos 6 dígitos." });
        return; // Retorna para evitar o envio
      }

      // Prepara os dados do usuário
      const userData = {
        nome: newUser.nome,
        cpf: newUser.cpf,
        senha: newUser.senha,
        tipo: newUser.permissoes.administrador ? 1 : (newUser.permissoes.basico ? 2 : 0), // 1 para administrador, 2 para básico
        unidadeId: selectedUnidades.map(unidade => {
          const unidadeObj = userOptionsUnidade.find(option => option.label === unidade);
          return unidadeObj ? unidadeObj.value : null; // Aqui você pega o ID da unidade
        }).filter(id => id !== null),
      };

      // Envia os dados para a API usando a instância configurada
      const response = await api.put(`/usuario/${editUser.id}`, userData); // Use o ID do usuário que está sendo editado

      if (response.status === 200) {
        // Atualiza os dados do usuário
        const updatedUsers = users.map(user => {
          if (user.id === editUser.id) {
            return { ...userData, unidades: selectedUnidades }; // Atualiza os dados do usuário editado
          }
          return user; // Retorna o usuário não editado
        });

        // Atualiza o estado local
        setUsers(updatedUsers);
        // Limpa o estado e fecha a modal
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
        fetchUsers();
        CustomToast({ type: "success", message: "Usuário atualizado com sucesso!" });
        setEditandoUsuario(false)
      } else {
        CustomToast({ type: "success", message: "Usuário atualizado com sucesso!" });
        fetchUsers();
        setEditandoUsuario(false)
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      CustomToast({ type: "success", message: "Usuário atualizado com sucesso!" });
    }
  };
  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setCpf(formattedCPF); // Atualiza o estado do CPF
    setNewUser({ ...newUser, cpf: formattedCPF }); // Atualiza o CPF no objeto newUser  
  };


  const fetchUsers = async () => {
    try {
      const response = await api.get('/usuario'); // Chame a rota correta para buscar usuários
      console.log(response.data); // Inspecione a resposta aqui
      setUsers(response.data.data || []); // Ajuste conforme a estrutura da resposta
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);

      // Verifica se o erro é devido a um token expirado
      if (
        error.response &&
        error.response.data.message === "Credenciais inválidas" &&
        error.response.data.data === "Token de acesso inválido"
      ) {
        CustomToast({ type: "error", message: "Sessão expirada. Faça login novamente." });
        navigate("/login"); // Redireciona para a tela de login
      } else {
        CustomToast({ type: "error", message: "Erro ao buscar usuários!" });
      }
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => user.nome.toLowerCase().includes(searchTerm.toLowerCase())) : [];





  const handleUnidadeChange = (event) => {
    const selectedValue = event.target.value;
    const unidadeObj = userOptionsUnidade.find(option => option.value === selectedValue);
    if (unidadeObj && !selectedUnidades.includes(unidadeObj.label)) {
      setSelectedUnidades([...selectedUnidades, unidadeObj.label]); // Armazena o nome da unidade
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const response = await api.delete(`/usuario/${user.id}`); // Use o ID do usuário que está sendo excluído
      if (response.status === 200) {
        // Atualiza a lista de usuários após a exclusão
        const updatedUsers = users.filter(u => u.id !== user.id); // Filtra o usuário excluído
        setUsers(updatedUsers);
        CustomToast({ type: "success", message: "Usuário excluído com sucesso!" });
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      CustomToast({ type: "error", message: "Erro ao excluir usuário!" });
    }
  };

  const carregarUnidades = async () => {
    try {
      const response = await api.get("/unidade");
      console.log(response.data); // Inspecione a resposta aqui
      const unidadesOptions = response.data.data.map(unidade => ({
        value: unidade.id, // ID da unidade
        label: unidade.nome // Nome da unidade
      }));
      setUserOptionsUnidade(unidadesOptions); // Armazena as unidades como um array de objetos
    } catch (error) {
      console.error("Erro ao carregar as unidades:", error);
    }
  };

  const rows = filteredUsers.map(user => {
    const unidadeNames = user.unidadeId.map(id => {
      const unidadeObj = userOptionsUnidade.find(option => option.value === id);
      return unidadeObj ? unidadeObj.label : "Unidade Desconhecida";
    });

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
    // Aqui você pode fazer algo para atualizar a tabela de usuários, se necessário
  }, [userOptionsUnidade]);

  useEffect(() => {
    fetchUsers(); // Chama a função para buscar usuários quando o componente é montado
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

              <TableComponent
                headers={headerUsuario}
                rows={rows}
                actionsLabel={"Ações"}
                actionCalls={{
                  edit: (user) => handleEditUser(user), // Chama a função de edição
                  delete: (user) => handleDeleteUser(user), // Chama a função de exclusão
                }}
              />
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
                        maxLength: 11, // Adiciona o limite de comprimento aqui
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Senha"
                    name="senha"
                    type={showPassword ? "text" : "password"} // Alterna entre "text" e "password"
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
                    options={userOptionsUnidade} // Deve ser um array de objetos
                    onChange={handleUnidadeChange}
                  />
                </div>
                <div className='mt-4 w-[96%]'>
                  <h3 className="text-xs">Unidades Selecionadas:</h3>
                  <ul className="flex flex-col gap-1">
                    {selectedUnidades.map((unidade, index) => (
                      <li key={index} className="flex justify-between border-[1px] p-2 rounded-lg text-xs ">
                        {unidade} {/* Aqui você está exibindo o nome da unidade */}
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
                    onClick={handleSubmit} // Chama a função de cadastro
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
                        inputProps: {
                          maxLength: 11, // Adiciona o limite de comprimento aqui
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Senha"
                      name="senha"
                      type={showPassword ? "text" : "password"} // Alterna entre "text" e "password"
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
                      options={userOptionsUnidade} // Passa as unidades carregadas
                      onChange={handleUnidadeChange}
                    />
                  </div>
                  <div className='mt-4 w-[96%]'>
                    <h3 className="text-xs">Unidades Selecionadas:</h3>
                    <ul className="flex flex-col gap-1">
                      {selectedUnidades.map((unidade, index) => (
                        <li key={index} className="flex justify-between border-[1px] p-2 rounded-lg text-xs ">
                          {unidade} {/* Aqui você está exibindo o nome da unidade */}
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
                            checked={newUser.permissoes[permissao]} // Verifica se a permissão está ativa
                            onChange={() => handleCheckboxChange(permissao)} // Chama a função de mudança
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