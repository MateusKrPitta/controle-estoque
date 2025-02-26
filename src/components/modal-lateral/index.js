import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Slide from '@mui/material/Slide';
import Lines from '../lines';
import Label from '../label';
import ButtonClose from '../buttons/button-close';

const style = (width) => ({
    position: 'absolute',
    top: 0, // Começa do topo da tela
    right: 0,
    width: width || 400, // Usa o valor de width passado ou o padrão (400px)
    height: '100vh', // Ocupa 100% da altura da viewport
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    borderTopLeftRadius: '16px',
    display: 'flex',
    flexDirection: 'column', // Organiza o conteúdo em coluna
});

export default function ModalLateral({ open, overflowY, handleClose, tituloModal, conteudo, icon, width, tamanhoIcone, tamanhoTitulo, opcao, tamanhoOpcao }) {
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                }}
            >
                <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                    <Box sx={style(width)}>
                        <Lines display={'flex'} flexDirection={'column'} width={'100%'} height={'100%'} conteudo={
                            <>
                                {/* Cabeçalho da modal */}
                                <Lines width={'100%'} display={'flex'} alignItems={'center'} conteudo={
                                    <>
                                        <Lines width={tamanhoIcone || '10%'} alignItems={'center'} justifyContent={'center'} padding={'5px'} backgroundColor={'#b0d847'} borderRadius={'5px'} color={'#ffff'} conteudo={<>{icon}</>} />
                                        <Label fontSize={'15px'} color={'black'} width={tamanhoTitulo} fontWeight={'700'} conteudo={tituloModal} />
                                        <Lines width={tamanhoOpcao || '0%'} display={'flex'} alignItems={'center'} justifyContent={'center'} conteudo={opcao} />
                                        <ButtonClose funcao={handleClose} />
                                    </>
                                } />

                                {/* Conteúdo da modal */}
                                <Lines
                                    overflowY={'scroll'}
                                    flex={1} // Ocupa todo o espaço restante
                                    width={'100%'}
                                    border={'1px solid #d9d9d9'}
                                    borderRadius={'10px'}
                                    padding={'10px'}
                                    marginTop={'10px'} // Adiciona um espaço entre o cabeçalho e o conteúdo
                                    conteudo={<>{conteudo}</>}
                                />
                            </>
                        } />
                    </Box>
                </Slide>
            </Modal>
        </div>
    );
}