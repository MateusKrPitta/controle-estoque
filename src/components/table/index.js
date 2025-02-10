import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField } from '@mui/material';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { maskCPF } from '../../utils/formatCPF';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';

const TableComponent = ({ rows, headers, actionCalls = {}, actionsLabel, onRowChange, rowStyle }) => {
    const [pageList, setPageList] = useState([]); // Inicialize como um array
    const hasActions = Object.keys(actionCalls).length > 0;
    const actionTypes = Object.keys(actionCalls);
    const [totals, setTotals] = useState({ entradas: 0, estoqueInicial: 0, estoqueFinal: 0 });

    let headersList = hasActions
        ? headers.concat([{
            key: "actions",
            label: actionsLabel,
        }])
        : [...headers];
    const handleInputChange = (rowIndex, key, value) => {
        const updatedRows = [...pageList];
        updatedRows[rowIndex][key] = value;
        setPageList(updatedRows);
        onRowChange(updatedRows); // Chama a função para atualizar os dados no componente pai
    };
    const calculateTotals = (rows) => {
        const newTotals = rows.reduce((acc, row) => {
            acc.entradas += Number(row.entradas || 0);
            acc.estoqueInicial += Number(row.estoqueInicial || 0);
            acc.estoqueFinal += Number(row.estoqueFinal || 0);
            return acc;
        }, { entradas: 0, estoqueInicial: 0, estoqueFinal: 0 });
        setTotals(newTotals);
    };

    useEffect(() => {
        if (Array.isArray(rows)) {
            setPageList(rows);
            calculateTotals(rows);
        } else {
            console.error('As rows não são um array', rows);
            setPageList([]); // Defina como um array vazio se não for um array
        }
    }, [rows]);
    

    const renderActions = (row) => {
        let actions = {
            confirm: (
                row.status !== "Cadastrado" && ( // Adiciona a verificação para ocultar o botão
                    <IconButton onClick={() => actionCalls.confirm(row)} title="Confirmar Registro"
                        className='confirm-button'
                        sx={{
                            color: '#BCDA72',
                            border: '1px solid #BCDA72',
                            '&:hover': {
                                color: '#fff',
                                backgroundColor: '#BCDA72',
                                border: '1px solid #005a2a'
                            }
                        }} >
                        <CheckCircleOutlineIcon fontSize={"small"} />
                    </IconButton>
                )
            ),
            view: (
                <IconButton onClick={() => actionCalls.view(row)} title="Visualizar Dados"
                    className='view-button'
                    sx={{
                        color: '#BCDA72',
                        border: '1px solid #BCDA72',
                        '&:hover': {
                            color: '#fff',
                            backgroundColor: '#BCDA72',
                            border: '1px solid #BCDA72'
                        }
                    }} >
                    <VisibilityOutlinedIcon fontSize={"small"} />
                </IconButton>
            ),
            edit: (
                <IconButton onClick={() => actionCalls.edit(row)} title="Editar Dados"
                    className='view-button'
                    sx={{
                        color: '#BCDA72',
                        border: '1px solid #BCDA72',
                        '&:hover': {
                            color: '#fff',
                            backgroundColor: '#BCDA72',
                            border: '1px solid #005a2a'
                        }
                    }} >
                    <EditIcon fontSize={"small"} />
                </IconButton>
            ),
            delete: (
                row.status !== "Pagamento Realizado" && (
                    <IconButton onClick={() => actionCalls.delete(row)} title="Excluir Registro"
                        className='delete-button'
                        sx={{
                            color: '#9a0000',
                            border: '1px solid #9a0000',
                            '&:hover': {
                                color: '#fff',
                                backgroundColor: '#9a0000',
                                border: '1px solid #b22222'
                            }
                        }} >
                        <DeleteOutlineIcon fontSize={"small"} />
                    </IconButton>
                )
            ),
            inactivate: (
                <IconButton onClick={() => actionCalls.inactivate(row)} title="Inativar Registro"
                    className='inactivate-button'
                    sx={{
                        color: '#ff9800',
                        border: '1px solid #ff9800',
                        '&:hover': {
                            color: '#fff',
                            backgroundColor: '#ff9800',
                            border: '1px solid #e68a00'
                        }
                    }} >
                    <BlockOutlinedIcon fontSize={"small"} />
                </IconButton>
            ),
            option: (
                <IconButton onClick={() => actionCalls.option(row)} title="Iniciar Novo Contrato"
                    className='view-button'
                    sx={{
                        color: '#BCDA72',
                        border: '1px solid #BCDA72',
                        '&:hover': {
                            color: '#fff',
                            backgroundColor: '#BCDA72',
                            border: '1px solid #005a2a'
                        }
                    }} >
                    <AddCircleOutlineIcon fontSize={"small"} />
                </IconButton>
            ),
        };

        return actionTypes.map((action) => {
            const ActionButton = actions[action];
            return ActionButton ? (
                <span key={action}>
                    {ActionButton}
                </span>
            ) : null;
        });
    };

    useEffect(() => {
        setPageList(rows);
    }, [rows]);

    return (
        <TableContainer component={Paper} style={{ maxHeight: '430px', overflowY: 'auto' }} className='scrollbar'>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {headersList.map(({ key, label, sort }) => (
                            sort !== false && (
                                <TableCell key={key} style={{
                                    fontWeight: 'bold',
                                    textAlign: key === 'actions' ? 'center' : 'left'
                                }}>{label}</TableCell>
                            )
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pageList.map((row, rowIndex) => (
                        <TableRow key={rowIndex} style={rowStyle ? rowStyle(row) : {}}>
                            {headersList.map(({ key, sort }) => (
                                sort !== false && (
                                    key === "actions" && hasActions ? (
                                        <TableCell key={key} style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                                            {renderActions(row)}
                                        </TableCell>
                                    ) : key === "tipo" ? ( // Verifica se a coluna é a que contém "entrada" ou "saida"
                                        <TableCell key={key} style={{
                                            backgroundColor: row.tipo === 'entrada' ? '#006b33' :
                                                row.tipo === 'saida' ? '#ff0000' :
                                                    row.tipo === 'desperdicio' ? '#000000' : // Nova condição para desperdício
                                                        'transparent', // Cor padrão se não for nenhum dos tipos
                                            color: '#fff' // Para garantir que o texto seja legível
                                        }}>
                                            {row[key]}
                                        </TableCell>
                                    ) : key === "entradas" || key === "estoqueInicial" || key === "estoqueFinal" ? (
                                        <TableCell key={key}>
                                            <TextField
                                                type="number"
                                                value={row[key] || ''}
                                                onChange={(e) => handleInputChange(rowIndex, key, e.target.value)}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                    ) : key === "cpf" ? (
                                        <TableCell style={{ fontSize: '12px' }} key={key}>{maskCPF(row[key])}</TableCell>
                                    ) : (
                                        <TableCell style={{ fontSize: '12px' }} key={key}>{row[key] || "-"}</TableCell>
                                    )
                                )
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableComponent;
