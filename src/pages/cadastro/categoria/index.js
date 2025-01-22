import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import HeaderCadastro from '../../../components/navbars/cadastro';
import CategoryIcon from '@mui/icons-material/Category';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import ButtonComponent from '../../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import { AddCircleOutline, Edit, Save } from '@mui/icons-material';
import CentralModal from '../../../components/modal-central';
import ArticleIcon from '@mui/icons-material/Article';
import TableComponent from '../../../components/table';
import { headerCategoria } from '../../../entities/headers/header-categoria';
import ModalLateral from '../../../components/modal-lateral';

const Categoria = () => {
    const [cadastroCategoria, setCadastroCategoria] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState({ nome: '' });
    const [editandoCategoria, setEditandoCategoria] = useState(false);
    const [categoriaEditada, setCategoriaEditada] = useState(null);

    useEffect(() => {
        const categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];
        setCategorias(categoriasSalvas);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoria({ ...categoria, [name]: value });
    };

    const handleCadastroCategoria = () => setCadastroCategoria(true);
    const handleCloseCadastroCategoria = () => setCadastroCategoria(false);

    const handleCadastrarCategoria = () => {
        const updatedCategorias = [...categorias, categoria];
        setCategorias(updatedCategorias);
        localStorage.setItem('categorias', JSON.stringify(updatedCategorias));
        setCategoria({ nome: '' });
        handleCloseCadastroCategoria();
    };

    const handleEditCategoria = (categoria) => {
        setCategoriaEditada(categoria);
        setEditandoCategoria(true);
    };

    const handleDeleteCategoria = (categoria) => {
        const updatedCategorias = categorias.filter(cat => cat.nome !== categoria.nome);
        setCategorias(updatedCategorias);
        localStorage.setItem('categorias', JSON.stringify(updatedCategorias));
    };

    const handleSaveEdit = () => {
        if (categoriaEditada) {
            const updatedCategorias = categorias.map(cat =>
                cat.nome === categoriaEditada.nome ? { ...cat, nome: categoriaEditada.nome } : cat
            );
            setCategorias(updatedCategorias);
            localStorage.setItem('categorias', JSON.stringify(updatedCategorias));
            setEditandoCategoria(false);
            setCategoriaEditada(null);
        }
    };
    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex flex-col gap-3 w-full items-end'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='sm:items-center md:text-2xl font-bold text-black w-[99%] flex items-center gap-2 '>
                    <CategoryIcon /> Categoria
                </h1>
                <div className='w-full mt-7 p-3 flex gap-2 items-start'>
                    <HeaderCadastro />
                    <div className='w-[90%] flex flex-col'>
                        <div className='flex gap-2'>
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
                                sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '40%' }, }}
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
                tamanhoTitulo={'82%'}
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
                            sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '93%' }, marginLeft: '10px' }}
                            autoComplete="off"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ArticleIcon />
                                    </InputAdornment>
                                ),
                            }}
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
                            onChange={(e) => setCategoriaEditada({ ...categoriaEditada, nome: e.target.value })} // Atualiza o estado corretamente
                            autoComplete="off"
                        />
                        <ButtonComponent
                            title={'Salvar'}
                            subtitle={'Salvar'}
                            startIcon={<Save />}
                            onClick={handleSaveEdit} // Chama a função de salvar
                        />
                    </div>
                }
            />
        </div>
    );
}

export default Categoria;