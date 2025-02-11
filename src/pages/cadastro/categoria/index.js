import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import HeaderCadastro from '../../../components/navbars/cadastro';
import CategoryIcon from '@mui/icons-material/Category';
import { InputAdornment, TextField } from '@mui/material';
import ButtonComponent from '../../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import { AddCircleOutline, Edit, LocationOnOutlined, Save } from '@mui/icons-material';
import CentralModal from '../../../components/modal-central';
import ArticleIcon from '@mui/icons-material/Article';
import TableComponent from '../../../components/table';
import { headerCategoria } from '../../../entities/headers/header-categoria';
import ModalLateral from '../../../components/modal-lateral';
import CustomToast from '../../../components/toast';
import SelectTextFields from '../../../components/select';
import api from '../../../services/api';

const Categoria = () => {
    const [cadastroCategoria, setCadastroCategoria] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState({ nome: '', unidadeId: '' });
    const [editandoCategoria, setEditandoCategoria] = useState(false);
    const [categoriaEditada, setCategoriaEditada] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [userOptionsUnidade, setUserOptionsUnidade] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300); // Delay para a transição

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        carregarCategorias();
    }, []);

    const carregarCategorias = async () => {
        setLoading(true); // Inicia o loading
        try {
            const response = await api.get('/categoria');
            // Acesse a propriedade 'data' da resposta
            if (Array.isArray(response.data.data)) {
                setCategorias(response.data.data); // Atualiza o estado com o array de categorias
                console.log(response.data.data); // Verifique os dados aqui
            } else {
                console.error("A resposta da API não é um array:", response.data.data);
                setCategorias([]); // Defina como um array vazio se não for um array
            }
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        } finally {
            setLoading(false); // Finaliza o loading
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoria({ ...categoria, [name]: value });
    };

    const handleCadastroCategoria = () => setCadastroCategoria(true);
    const handleCloseCadastroCategoria = () => setCadastroCategoria(false);

    const handleCadastrarCategoria = async () => {
        try {
            const novaCategoria = { 
                nome: categoria.nome, 
                unidadeId: categoria.unidadeId 
            };

            // Enviar a nova categoria para a API
            await api.post('/categoria', novaCategoria); // A URL está correta

            // Recarregar as categorias após a criação
            await carregarCategorias();
            setCategoria({ nome: '', unidadeId: '' }); // Limpa os campos
            handleCloseCadastroCategoria();
            CustomToast({ type: "success", message: "Categoria cadastrada com sucesso!" });
        } catch (error) {
            console.error("Erro ao cadastrar categoria:", error);
            CustomToast({ type: "error", message: "Erro ao cadastrar categoria." });
        }
    };

    const handleEditCategoria = (categoria) => {
        setCategoriaEditada({ ...categoria }); // Clona a categoria para edição
        setEditandoCategoria(true);
    };

    const handleSaveEdit = async () => {
        if (categoriaEditada) {
            try {
                await api.put(`/categoria/${categoriaEditada.id}`, categoriaEditada); // A URL está correta
                await carregarCategorias(); // Recarrega as categorias após a edição
                setEditandoCategoria(false);
                setCategoriaEditada(null);
                CustomToast({ type: "success", message: "Categoria editada com sucesso!" });
            } catch (error) {
                console.error("Erro ao editar categoria:", error);
                CustomToast({ type: "error", message: "Erro ao editar categoria." });
            }
        }
    };

    const handleDeleteCategoria = async (categoria) => {
        try {
            await api.delete(`/categoria/${categoria.id}`); // A URL está correta
            await carregarCategorias(); // Recarrega as categorias após a exclusão
            CustomToast({ type: "success", message: "Categoria deletada com sucesso!" });
        } catch (error) {
            console.error("Erro ao deletar categoria:", error);
            CustomToast({ type: "error", message: "Erro ao deletar categoria." });
        }
    };

    const handleUnidadeChange = (event) => {
        const selectedValue = event.target.value;
        const unidadeObj = userOptionsUnidade.find(option => option.value === selectedValue);
        if (unidadeObj) {
            setCategoria({ ...categoria, unidadeId: unidadeObj.value }); // Armazena o ID da unidade
        }
    };

    const carregarUnidades = async () => {
        try {
            const response = await api.get("/unidade");
            const unidadesOptions = response.data.data.map(unidade => ({
                value: unidade.id, // ID da unidade
                label: unidade.nome // Nome da unidade
            }));
            setUserOptionsUnidade(unidadesOptions); // Armazena as unidades como um array de objetos
        } catch (error) {
            console.error("Erro ao carregar as unidades:", error);
        }
    };



    useEffect(() => {
        carregarCategorias();
        carregarUnidades();
    }, []);

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start'>
                    <CategoryIcon /> Categoria
                </h1>
                <div className={`items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                    <div className="hidden md:w-[14%] md:flex ">
                        <HeaderCadastro />
                    </div>
                    <div className="w-[100%] itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col md:w-[80%]">
                        <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Buscar categoria"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CategoryIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                autoComplete="off"
                                sx={{ width: { xs: '95%', sm: '50%', md: '40%', lg: '40%' }, }}
                            />
                            <ButtonComponent
                                startIcon={<SearchIcon fontSize='small' />}
                                title={'Pesquisar'}
                                subtitle={'Pesquisar'}
                                buttonSize="large"
                            />
                            <ButtonComponent
                                startIcon={<AddCircleOutline fontSize='small' />}
                                title={'Cadastrar'}
                                subtitle={'Cadastrar'}
                                buttonSize="large"
                                onClick={handleCadastroCategoria}
                            />
                        </div>
                        <div className="tamanho-tabela">
                            {loading ? (
                                <div className='flex items-center justify-center h-96'>
                                    {/* Componente de loading */}
                                </div>
                            ) : (
                                <TableComponent
                                    headers={headerCategoria}
                                    rows={categorias}
                                    actionsLabel={"Ações"}
                                    actionCalls={{
                                        edit: handleEditCategoria,
                                        delete: handleDeleteCategoria,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <CentralModal
                tamanhoTitulo={'81%'}
                maxHeight={'90vh'}
                top={'20%'}
                left={'28%'}
                width={'400px'}
                icon={<AddCircleOutline fontSize="small" />}
                open={cadastroCategoria}
                onClose={handleCloseCadastroCategoria}
                title="Cadastrar Categoria"
            >
                <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
                    <div className='mt-4 flex gap-3 flex-wrap'>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Nome da Categoria"
                            name="nome"
                            value={categoria.nome}
                            onChange={handleInputChange}
                            sx={{ width: { xs: '95%', sm: '50%', md: '40%', lg: '95%' } }}
                            autoComplete="off"
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
                            icon={<LocationOnOutlined fontSize="small" />}
                            label={'Unidade'}
                            backgroundColor={"#D9D9D9"}
                            name={"unidade"}
                            fontWeight={500}
                            options={userOptionsUnidade}
                            onChange={handleUnidadeChange}
                        />
                    </div>
                    <div className='w-[95%] mt-2 flex items-end justify-end'>
                        <ButtonComponent
                            title={'Cadastrar'}
                            subtitle={'Cadastrar'}
                            startIcon={<Save />}
                            onClick={handleCadastrarCategoria}
                        />
                    </div>
                </div>
            </CentralModal>

            {/* Modal Lateral para Edição */}
            <ModalLateral
                open={editandoCategoria}
                handleClose={() => setEditandoCategoria(false)}
                tituloModal="Editar Categoria"
                icon={<Edit />}
                tamanhoTitulo={'75%'}
                conteudo={
                    <div className='flex gap-2 flex-wrap items-end justify-end w-full mt-2'>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Nome da Categoria"
                            name="nome"
                            sx={{ width: '100%' }}
                            value={categoriaEditada ? categoriaEditada.nome : ''}
                            onChange={(e) => setCategoriaEditada({ ...categoriaEditada, nome: e.target.value })}
                            autoComplete="off"
                        />
                        <ButtonComponent
                            title={'Salvar'}
                            subtitle={'Salvar'}
                            startIcon={<Save />}
                            onClick={handleSaveEdit}
                        />
                    </div>
                }
            />
        </div>
    );
}

export default Categoria;