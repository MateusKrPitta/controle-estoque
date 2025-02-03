import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit'; // Importar o ícone de edição
import { formatValor } from '../../utils/functions';

const TabelaProdutos = ({ pratos, onEditClick }) => {
    const [openRow, setOpenRow] = React.useState(null);

    const handleRowClick = (index) => {
        setOpenRow(openRow === index ? null : index);
    };

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Nome do Prato</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Custo Total</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Valor Venda</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>CMV Real</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Lucro Real</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Ações</TableCell> {/* Coluna para ações */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pratos.map((prato, index) => (
                        <React.Fragment key={index}>
                            <TableRow>
                                <TableCell>
                                    <IconButton
                                        aria-label="expand row"
                                        size="small"
                                        onClick={() => handleRowClick(index)}
                                    >
                                        {openRow === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell>{prato.nomePrato}</TableCell>
                                <TableCell style={{ backgroundColor: '#B0D847', borderRadius: '5px', textAlign: 'center', fontWeight: 700 }}>{formatValor(prato.custoTotal)}</TableCell>
                                <TableCell style={{ borderRadius: '5px', textAlign: 'center', fontWeight: 700 }}>{formatValor(prato.valorVenda)}</TableCell>
                                <TableCell style={{ backgroundColor: '#B0D847', borderRadius: '5px', textAlign: 'center', fontWeight: 700 }}>{formatValor(prato.cmvReal)}</TableCell>
                                <TableCell style={{ borderRadius: '5px', textAlign: 'center', fontWeight: 700 }}>{formatValor(prato.lucroReal)}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <IconButton onClick={() => onEditClick(index)}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                    <Collapse in={openRow === index} timeout="auto" unmountOnExit>
                                        <Box sx={{ margin: 1 }} style={{ backgroundColor: '#d9d9d9', padding: '10px', borderRadius: '10px' }}>
                                            <Typography variant="h6" gutterBottom component="div">
                                                Detalhes dos Produtos
                                            </Typography>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Nome do Produto</TableCell>
                                                        <TableCell align="right">Quantidade</TableCell>
                                                        <TableCell align="right">Unidade</TableCell>
                                                        <TableCell align="right">Preço por Porção</TableCell>
                                                        <TableCell align="right">Valor Utilizado</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {prato.produtos.map((produto, prodIndex) => (
                                                        <TableRow key={prodIndex}>
                                                            <TableCell>{produto.nome}</TableCell>
                                                            <TableCell align="right">{produto.quantidade}</TableCell>
                                                            <TableCell align="right">{produto.unidade}</TableCell>
                                                            <TableCell align="right">{produto.precoPorcao}</TableCell>
                                                            <TableCell align="right">{produto.valorUtilizado}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

TabelaProdutos.propTypes = {
    pratos: PropTypes.array.isRequired,
    onEditClick: PropTypes.func.isRequired, // Alterado para onEditClick
};

export default TabelaProdutos;