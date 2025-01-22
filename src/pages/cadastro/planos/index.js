import React, { useState } from "react";
import Navbar from '../../../components/navbars/header';
import HeaderPerfil from '../../../components/navbars/perfil';
import { InputAdornment, TextField } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ButtonComponent from '../../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HeaderCadastro from '../../../components/navbars/cadastro';
import TableComponent from '../../../components/table';
import { headerPlanos } from '../../../entities/headers/header-cadastro/header-planos';
import { planos } from '../../../entities/class/cadastro/planos';
import { ArticleOutlined, DocumentScanner, LocationOnOutlined, Save } from "@mui/icons-material";
import CentralModal from "../../../components/modal-central";
import SelectTextFields from "../../../components/select";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ModalLateral from "../../../components/modal-lateral";
import EditIcon from '@mui/icons-material/Edit';
import MenuMobile from "../../../components/menu-mobile";

const Planos = () => {
  const [cadastrarPlano, setCadastrarPlano] = useState(false);
  const [selectedUnidade, setSelectedUnidade] = useState(""); // Estado para a unidade selecionada
  const [selectedUnidades, setSelectedUnidades] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const userOptionsUnidade = [
    { value: "Dourados", label: "Dourados" },
    { value: "Itaporã", label: "Itaporã" },
    { value: "Ponta Porã", label: "Ponta Porã" },
  ];

  const handleCadastroPlano = () => setCadastrarPlano(true);
  const handleCloseCadastroPlano = () => setCadastrarPlano(false);

  const handleUnidadeChange = (event) => {
    setSelectedUnidade(event.target.value); // Atualiza a unidade selecionada
  };

  const addUnidade = () => {
    if (selectedUnidade && !selectedUnidades.includes(selectedUnidade)) {
      setSelectedUnidades([...selectedUnidades, selectedUnidade]);
      setSelectedUnidade(""); // Limpa a seleção após adicionar
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
        <h1 className='flex gap-2 items-center justify-center text-base sm:ml-1  md:text-2xl  font-bold text-primary w-full md:justify-start   '><AssignmentIcon />Cadastro Planos</h1>
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
                label="Buscar plano"
                autoComplete="off"
                sx={{ width: '40%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ArticleOutlined />
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
                onClick={handleCadastroPlano}
              />
            </div>
            <TableComponent
              headers={headerPlanos}
              rows={planos}
              actionsLabel={"Ações"}
              actionCalls={{
                edit: () => setModalEditar(true),
              }}
            />
            <CentralModal tamanhoTitulo={'82%'} maxHeight={'90vh'} top={'20%'} left={'28%'} width={'620px'} icon={<AddCircleOutlineIcon fontSize="small" />} open={cadastrarPlano} onClose={handleCloseCadastroPlano} title="Cadastrar Plano">
              <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                <div className='mt-4 flex gap-3 flex-wrap'>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome do Plano"
                    autoComplete="off"
                    sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '47%' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DocumentScanner />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <SelectTextFields
                    width={'150px'}
                    icon={<LocationOnOutlined OnOutlined fontSize="small" />}
                    label={'Unidade'}
                    backgroundColor={"#D9D9D9"}
                    name={"Unidade"}
                    fontWeight={500}
                    options={userOptionsUnidade}
                    onChange={handleUnidadeChange}
                    value={selectedUnidade} // Adiciona o valor selecionado
                  />
                  <ButtonComponent
                    startIcon={<AddCircleOutlineIcon fontSize='small' />}
                    title={'Adicionar'}
                    subtitle={'Adicionar'}
                    buttonSize="large"
                    onClick={addUnidade} // Chama a função para adicionar a unidade
                  />
                  <div className='mt-4 w-[96%]'>
                    <h3 className="text-xs">Unidades Selecionadas:</h3>
                    <ul className="flex flex-col gap-1">
                      {selectedUnidades.map((unidade, index) => (
                        <li key={index} className="flex flex-col gap-4 justify-between border-[1px] p-2 rounded-lg text-xs flex-wrap ">
                          <div className="flex items-center p-1 rounded-md" style={{ backgroundColor: '#006b33' }}>
                            <label className="text-xs w-[95%] flex gap-1 items-center" style={{ color: 'white' }}><LocationOnOutlined fontSize="small" />{unidade}</label>
                            <button style={{ color: 'red', backgroundColor: 'white' }} onClick={() => removeUnidade(unidade)} className="text-red-500 p-1 rounded-lg "><HighlightOffIcon fontSize="small" /></button>
                          </div>
                          <div>
                            <div className="flex gap-3 flex-wrap ">
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Valor Adesão"
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '32%' } }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <DocumentScanner />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Valor Mensalidade"
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '32%' } }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <DocumentScanner />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Valor Transferência"
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '31%' } }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <DocumentScanner />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Valor Adicional"
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '32%' } }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <DocumentScanner />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Carência Novo(Dias)"
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '32%' } }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <DocumentScanner />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Carência Atraso(Dias)"
                                autoComplete="off"
                                sx={{ width: { xs: '48%', sm: '50%', md: '40%', lg: '32%' } }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <DocumentScanner />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </div>

                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

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
              tituloModal={'Editar Plano'}
              tamanhoTitulo={'73%'}
              conteudo={
                <>
                  <div>
                    <div className='mt-4 flex gap-3 flex-wrap'>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Nome do Plano"
                        autoComplete="off"
                        sx={{ width: '100%' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DocumentScanner />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <SelectTextFields
                        width={'188px'}
                        icon={<LocationOnOutlined OnOutlined fontSize="small" />}
                        label={'Unidade'}
                        backgroundColor={"#D9D9D9"}
                        name={"Unidade"}
                        fontWeight={500}
                        options={userOptionsUnidade}
                        onChange={handleUnidadeChange}
                        value={selectedUnidade} // Adiciona o valor selecionado
                      />
                      <ButtonComponent
                        startIcon={<AddCircleOutlineIcon fontSize='small' />}
                        title={'Adicionar'}
                        subtitle={'Adicionar'}
                        buttonSize="large"
                        onClick={addUnidade} // Chama a função para adicionar a unidade
                      />
                      <div className='mt-4 w-[100%]'>
                        <h3 className="text-xs">Unidades Selecionadas:</h3>
                        <ul className="flex flex-col gap-1">
                          {selectedUnidades.map((unidade, index) => (
                            <li key={index} className="flex flex-col gap-4 justify-between border-[1px] p-2 rounded-lg text-xs flex-wrap ">
                              <div className="flex items-center p-1 rounded-md" style={{ backgroundColor: '#006b33' }}>
                                <label className="text-xs w-[95%] flex gap-1 items-center" style={{ color: 'white' }}><LocationOnOutlined fontSize="small" />{unidade}</label>
                                <button style={{ color: 'red', backgroundColor: 'white' }} onClick={() => removeUnidade(unidade)} className="text-red-500 p-1 rounded-lg "><HighlightOffIcon fontSize="small" /></button>
                              </div>
                              <div>
                                <div className="flex gap-3 flex-wrap ">
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Valor Adesão"
                                    autoComplete="off"
                                    sx={{ width: '47.5%' }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <DocumentScanner />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Valor Mensalidade"
                                    autoComplete="off"
                                    sx={{ width: '48%' }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <DocumentScanner />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Valor Transferência"
                                    autoComplete="off"
                                    sx={{ width: '47.5%' }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <DocumentScanner />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Valor Adicional"
                                    autoComplete="off"
                                    sx={{ width: '48%' }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <DocumentScanner />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Carência Novo(Dias)"
                                    autoComplete="off"
                                    sx={{ width: '47.5%' }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <DocumentScanner />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Carência Atraso(Dias)"
                                    autoComplete="off"
                                    sx={{ width: '48%' }}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <DocumentScanner />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </div>

                              </div>
                            </li>
                          ))}
                        </ul>
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
                  </div>
                </>} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Planos;