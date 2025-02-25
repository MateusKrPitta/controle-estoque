import React, { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/header";
import HeaderPerfil from "../../../components/navbars/perfil";
import { InputAdornment, TextField } from "@mui/material";
import ButtonComponent from "../../../components/button";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HeaderCadastro from "../../../components/navbars/cadastro";
import TableComponent from "../../../components/table";
import CentralModal from "../../../components/modal-central";
import EditIcon from "@mui/icons-material/Edit";
import { LocationOnOutlined, Save } from "@mui/icons-material";
import ModalLateral from "../../../components/modal-lateral";
import MenuMobile from "../../../components/menu-mobile";
import { headerUnidade } from "../../../entities/headers/header-unidades";
import CustomToast from "../../../components/toast";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

const Unidades = () => {
  const [cadastrarUnidade, setCadastrarUnidade] = useState(false);
  const [unidades, setUnidades] = useState([]);
  const [filtroNome, setFiltroNome] = useState(""); // Estado para o filtro de busca
  const [unidadesFiltradas, setUnidadesFiltradas] = useState([]); // Estado para as unidades filtradas
  const navigate = useNavigate();
  const [unidadeEditando, setUnidadeEditando] = useState(null);
  const [nomeUnidade, setNomeUnidade] = useState(""); // Estado para o nome da unidade
  const [editandoUnidade, setEditandoUnidade] = useState(false);
  const [unidadeEditada, setUnidadeEditada] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Delay para a transição

    return () => clearTimeout(timer);
  }, []);

  const handleCadastroUnidade = () => {
    setCadastrarUnidade(true);
    setUnidadeEditando(null);
    setNomeUnidade(""); // Limpa o nome da unidade ao abrir o modal
  };

  const handleCloseCadastroUnidade = () => {
    setCadastrarUnidade(false);
  };

  const carregarUnidades = async () => {
    try {
      const response = await api.get("/unidade");
      setUnidades(response.data.data);
      setUnidadesFiltradas(response.data.data); // Inicializa as unidades filtradas
    } catch (error) {
  
      if (
        error.response &&
        error.response.data.message === "Credenciais inválidas" &&
        error.response.data.data === "Token de acesso inválido"
      ) {
        CustomToast({ type: "error", message: "Sessão expirada. Faça login novamente." });
        navigate("/");
      } else {
        CustomToast({ type: "error", message: "Erro ao carregar as unidades!" });
      }
    }
  };

  useEffect(() => {
    carregarUnidades();
  }, []);

  useEffect(() => {
    // Filtra as unidades sempre que filtroNome mudar
    const unidadesFiltradas = unidades.filter(unidade =>
      unidade.nome.toLowerCase().includes(filtroNome.toLowerCase())
    );
    setUnidadesFiltradas(unidadesFiltradas);
  }, [filtroNome, unidades]);

  const handleSalvarUnidade = async () => {
    if (!nomeUnidade.trim()) {
      alert("O nome da unidade é obrigatório.");
      return;
    }

    try {
      const novaUnidade = { nome: nomeUnidade };
      const response = await api.post("/unidade", novaUnidade);
    
      if (response.status === 201) {
        CustomToast({ type: "success", message: "Unidade cadastrada com sucesso!" });
        setNomeUnidade("");
        setCadastrarUnidade(false);
        await carregarUnidades(); // Recarrega as unidades após a criação
      }
    } catch (error) {
      console.log("Erro completo:", error);
    }
  };

  const handleSaveEdit = async () => {
    if (unidadeEditada) {
      if (!unidadeEditada.nome.trim()) {
        CustomToast({ type: "error", message: "O nome da unidade é obrigatório!" });
        return;
      }
  
      // Fecha a modal antes da requisição assíncrona
      setEditandoUnidade(false);
  
      try {
        // Envia a solicitação PUT para editar a unidade na API
        const response = await api.put(`/unidade/${unidadeEditada.id}`, unidadeEditada);
  
        CustomToast({ type: "success", message: "Unidade editada com sucesso!" });
        carregarUnidades();
        if (response.status === 200) {
          // Atualiza o estado local das unidades com a unidade editada
          setUnidades((prevUnidades) => {
            return prevUnidades.map((unidade) =>
              unidade.id === unidadeEditada.id ? { ...unidade, nome: unidadeEditada.nome } : unidade
            );
          });
        }
      } catch (error) {
        CustomToast({ type: "error", message: "Erro ao editar a unidade!" });
      }
    }
  };

  const handleEditUnidade = (unidade) => {
    setUnidadeEditada({ ...unidade }); // Clona a unidade para edição
    setEditandoUnidade(true);
  };

  const handleDeleteUnidade = async (unidade) => {
    try {
      // Faz a requisição DELETE para a API
      const response = await api.delete(`/unidade/${unidade.id}`);
      
      if (response.status === 200) {
        // Atualiza o estado local removendo a unidade deletada
        const updatedUnidades = unidades.filter((cat) => cat.id !== unidade.id);
        setUnidades(updatedUnidades);
        CustomToast({ type: "success", message: "Unidade deletada com sucesso!" });
      } else {
        CustomToast({ type: "error", message: "Erro ao excluir a unidade!" });
      }
    } catch (error) {
      CustomToast({ type: "error", message: "Erro ao excluir a unidade!" });
    }
  };

  return (
    <div className="flex w-full ">
      <Navbar />
      <div className="flex ml-0 flex-col gap-3 w-full items-end md:ml-2">
        <MenuMobile />
        <HeaderPerfil />
        <h1 className="flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start   ">
          <LocationOnOutlined />
          Cadastro Unidades
        </h1>
        <div
          className={` items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="hidden md:w-[14%] md:flex ">
            <HeaderCadastro />
          </div>
          <div className="w-[100%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col md:w-[80%]">
            <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Buscar unidade"
                autoComplete="off"
                value={filtroNome} // Adiciona o valor do filtro
                onChange={(e) => setFiltroNome(e.target.value)} // Atualiza o estado ao digitar
                sx={{ width: { xs: "90%", sm: "50%", md: "40%", lg: "40%" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlined />
                    </InputAdornment>
                  ),
                }}
              />
             
              <ButtonComponent
                startIcon={<AddCircleOutlineIcon fontSize="small" />}
                title={"Cadastrar"}
                subtitle={"Cadastrar"}
                buttonSize="large"
                onClick={handleCadastroUnidade}
              />
            </div>

            <TableComponent
              headers={headerUnidade}
              actionsLabel={"Ações"}
              rows={unidadesFiltradas} // Usa a lista filtrada
              actionCalls={{
                edit: handleEditUnidade,
                delete: handleDeleteUnidade,
              }}
            />

            <CentralModal
              tamanhoTitulo={"81%"}
              maxHeight={"90vh"}
              top={"20%"}
              left={"28%"}
              width={"400px"}
              icon={<AddCircleOutlineIcon fontSize="small" />}
              open={cadastrarUnidade}
              onClose={handleCloseCadastroUnidade}
              title="Cadastrar Unidade"
            >
              <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                <div className="mt-4 flex gap-3 flex-wrap">
                  <TextField
                    id="nomeUnidade"
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome da Unidade"
                    autoComplete="off"
                    value={nomeUnidade} // Use o estado para o valor
                    onChange={(e) => setNomeUnidade(e.target.value)} // Atualiza o estado ao digitar
                    sx={{ width: { xs: "95%", sm: "50%", md: "40%", lg: "95%" } }}
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
                      startIcon={<AddCircleOutlineIcon fontSize="small" />}
                      title={"Cadastrar"}
                      subtitle={"Cadastrar"}
                      buttonSize="large"
                      onClick={handleSalvarUnidade}
                    />
                  </div>
                </div>
              </div>
            </CentralModal>

            <ModalLateral
              open={editandoUnidade}
              handleClose={() => setEditandoUnidade(false)}
              icon={<EditIcon fontSize={"small"} />}
              tituloModal={"Editar Unidade"}
              tamanhoTitulo={"73%"}
              conteudo={
                <>
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Nome da Unidade"
                      autoComplete="off"
                      value={unidadeEditada ? unidadeEditada.nome : ""}
                      onChange={(e) =>
                        setUnidadeEditada({ ...unidadeEditada, nome: e.target.value })
                      } // Atualiza o estado corretamente
                      sx={{ width: "100%" }}
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
                        startIcon={<Save fontSize="small" />}
                        title={"Salvar"}
                        subtitle={"Salvar"}
                        buttonSize="large"
                        onClick={handleSaveEdit}
                      />
                    </div>
                  </div>
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unidades;