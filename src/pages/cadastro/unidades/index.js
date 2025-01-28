import React, { useState, useEffect } from "react";
import Navbar from '../../../components/navbars/header';
import HeaderPerfil from '../../../components/navbars/perfil';
import { InputAdornment, TextField } from '@mui/material';
import ButtonComponent from '../../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HeaderCadastro from '../../../components/navbars/cadastro';
import TableComponent from '../../../components/table';
import CentralModal from '../../../components/modal-central';
import EditIcon from '@mui/icons-material/Edit';
import { LocationOnOutlined, Phone, Save } from "@mui/icons-material";
import ModalLateral from "../../../components/modal-lateral";
import MenuMobile from "../../../components/menu-mobile";
import estadosJSON from "../../../utils/json/estados.json";
import { headerUnidade } from "../../../entities/headers/header-unidades";
import CustomToast from "../../../components/toast";

const Unidades = () => {
  const [cadastrarUnidade, setCadastrarUnidade] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [estadosList, setEstadosList] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [unidadeEditando, setUnidadeEditando] = useState(null);
  const [nomeUnidade, setNomeUnidade] = useState(""); // Estado para o nome da unidade
  const [editandoUnidade, setEditandoUnidade] = useState(false);
  const [unidadeEditada, setUnidadeEditada] = useState(null);

  const handleCadastroUnidade = () => {
    setCadastrarUnidade(true);
    setUnidadeEditando(null);
    setNomeUnidade(""); // Limpa o nome da unidade ao abrir o modal
  };

  const handleCloseCadastroUnidade = () => {
    setCadastrarUnidade(false);
  };

  const carregarUnidades = () => {
    const unidadesSalvas = JSON.parse(localStorage.getItem("unidades")) || [];
    setUnidades(unidadesSalvas);
  };
  const handleSalvarUnidade = () => {
    if (!nomeUnidade.trim()) {
      alert("O nome da unidade é obrigatório.");
      return;
    }

    const novaUnidade = {
      cnpj: unidadeEditando ? unidadeEditando.cnpj : Date.now(), // Identificador único
      nome: nomeUnidade,
    };

    let unidadesSalvas = JSON.parse(localStorage.getItem("unidades")) || [];

    if (unidadeEditando) {
      // Atualizar unidade existente
      unidadesSalvas = unidadesSalvas.map((unidade) =>
        unidade.cnpj === unidadeEditando.cnpj ? novaUnidade : unidade
      );
      setModalEditar(false); // Fecha o modal de edição
    } else {
      // Adicionar nova unidade
      unidadesSalvas.push(novaUnidade);
      setCadastrarUnidade(false); // Fecha o modal de cadastro
    }

    localStorage.setItem("unidades", JSON.stringify(unidadesSalvas));
    setUnidades(unidadesSalvas);

    // Limpar os estados
    setNomeUnidade("");
    setUnidadeEditando(null);
    CustomToast({ type: "success", message: "Unidade cadastrada com sucesso!" });
  };


  useEffect(() => {
    setEstadosList(estadosJSON.estados);
    carregarUnidades();
  }, []);

  const handleEditarUnidade = (unidade) => {
    setUnidadeEditando(unidade);
    setNomeUnidade(unidade.nome); // Carrega o nome da unidade no estado
    setModalEditar(true); // Abre o modal de edição
  };

  const handleSaveEdit = () => {
    if (unidadeEditada) {
      if (!unidadeEditada.nome.trim()) {
        CustomToast({ type: "error", message: "O nome da unidade é obrigatório!" });
        return;
      }

      const updatedUnidades = unidades.map((unidade) =>
        unidade.cnpj === unidadeEditada.cnpj
          ? { ...unidade, nome: unidadeEditada.nome } // Atualiza apenas a unidade correspondente
          : unidade
      );

      setUnidades(updatedUnidades);
      localStorage.setItem("unidades", JSON.stringify(updatedUnidades));
      setEditandoUnidade(false);
      setUnidadeEditada(null);
      CustomToast({ type: "success", message: "Unidade editada com sucesso!" });
    }
  };


  const handleEditUnidade = (unidade) => {
    setUnidadeEditada({ ...unidade }); // Clona a categoria para edição
    setEditandoUnidade(true);

  };


  const handleDeleteUnidade = (unidade) => {
    const updatedUnidades = unidades.filter(cat => cat.cnpj !== unidade.cnpj); // Corrigido para usar cnpj
    setUnidades(updatedUnidades);
    localStorage.setItem('unidades', JSON.stringify(updatedUnidades));
    CustomToast({ type: "success", message: "Unidade deletada com sucesso!" });
  };

  const handleSelectUnidade = (event) => {
    const selectedCnpj = event.target.value;
    // Aqui você pode fazer algo com a unidade selecionada, como armazenar em um estado
    console.log("Unidade selecionada:", selectedCnpj);
  };

  return (
    <div className="flex w-full ">
      <Navbar />
      <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start   '><LocationOnOutlined />Cadastro Unidades</h1>
        <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
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
                sx={{ width: { xs: '90%', sm: '50%', md: '40%', lg: '40%' }, }}
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
              headers={headerUnidade}
              actionsLabel={"Ações"}
              rows={unidades}
              actionCalls={{
                edit: handleEditUnidade,
                delete: handleDeleteUnidade,
              }}
            />

            <CentralModal tamanhoTitulo={'81%'} maxHeight={'90vh'} top={'20%'} left={'28%'} width={'400px'} icon={<AddCircleOutlineIcon fontSize="small" />} open={cadastrarUnidade} onClose={handleCloseCadastroUnidade} title="Cadastrar Unidade">
              <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                <div className='mt-4 flex gap-3 flex-wrap'>
                  <TextField
                    id="nomeUnidade"
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome da Unidade"
                    autoComplete="off"
                    value={nomeUnidade} // Use o estado para o valor
                    onChange={(e) => setNomeUnidade(e.target.value)} // Atualiza o estado ao digitar
                    sx={{ width: { xs: '95%', sm: '50%', md: '40%', lg: '95%' } }}
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
              tituloModal={'Editar Unidade'}
              tamanhoTitulo={'73%'}
              conteudo={
                <>
                  <div className="mt-4 flex gap-3 flex-wrap">

                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Nome da Unidade"
                      autoComplete="off"
                      value={unidadeEditada ? unidadeEditada.nome : ''}
                      onChange={(e) => setUnidadeEditada({ ...unidadeEditada, nome: e.target.value })} // Atualiza o estado corretamente
                      sx={{ width: '100%' }}
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