import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { maskCPF } from '../../utils/formatCPF';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';

const TableComponent = ({ rows, headers, actionCalls = {}, actionsLabel }) => {
    const [pageList, setPageList] = useState([]);
    const hasActions = Object.keys(actionCalls).length > 0;
    const actionTypes = Object.keys(actionCalls);

    let headersList = hasActions
        ? headers.concat([{
            key: "actions",
            label: actionsLabel,
        }])
        : [...headers];

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
                        <TableRow key={rowIndex}>
                            {headersList.map(({ key, sort }) => (
                                sort !== false && (
                                    key === "actions" && hasActions ? (
                                        <TableCell key={key} style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                                            {renderActions(row)}
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
