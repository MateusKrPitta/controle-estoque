import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbars/header';
import MenuMobile from '../../../components/menu-mobile';
import HeaderPerfil from '../../../components/navbars/perfil';
import HeaderRelatorio from '../../../components/navbars/relatorios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { InputAdornment, TextField } from '@mui/material';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import { AddCircleOutline, MoneyRounded, Numbers } from '@mui/icons-material';
import { formatValor } from '../../../utils/functions';
import ButtonComponent from '../../../components/button';
import { headerDesperdicio } from '../../../entities/headers/header-desperdicio';
import TableComponent from '../../../components/table';
import SelectTextFields from '../../../components/select/index.js'; // Import your SelectTextFields component
import { NumericFormat } from 'react-number-format';

const Desperdicio = () => {
    const [produto, setProduto] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [precoRaw, setPrecoRaw] = useState(''); // Raw price input
    const [produtos, setProdutos] = useState([]);
    const [desperdicioRows, setDesperdicioRows] = useState([]);

    useEffect(() => {
        // Fetch products from local storage
        const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
        setProdutos(produtosSalvos);
    }, []);

    const handleAddDesperdicio = () => {
        if (!produto || !quantidade || !precoRaw) {
            alert("Por favor, preencha todos os campos.");
            return;
        }
    
        const parsedPreco = parseFloat(precoRaw); // Agora já está correto
    
        if (isNaN(parsedPreco) || parsedPreco <= 0) {
            alert("O valor do preço é inválido.");
            return;
        }
    
        const total = parsedPreco * parseInt(quantidade, 10);
    
        const newDesperdicio = {
            produto,
            quantidade,
            preco: formatValor(parsedPreco), // Mantém a formatação correta
            total: formatValor(total),
        };
    
        const updatedDesperdicioRows = [...desperdicioRows, newDesperdicio];
        setDesperdicioRows(updatedDesperdicioRows);
        localStorage.setItem('desperdicio', JSON.stringify(updatedDesperdicioRows));
    
        // Resetar os campos
        setProduto('');
        setQuantidade('');
        setPrecoRaw('');
    };
    
    

    return (
        <div className="flex w-full ">
            <Navbar />
            <div className='flex ml-0 flex-col gap-3 w-full items-end md:ml-2'>
                <MenuMobile />
                <HeaderPerfil />
                <h1 className='flex justify-center text-base items-center gap-2 sm:ml-1  md:text-2xl  font-bold  w-full md:justify-start   '>
                    <DeleteForeverIcon /> Desperdício
                </h1>
                <div className=" items-center w-full flex mt-[40px] gap-2 flex-wrap md:items-start">
                    <div className="hidden md:w-[14%] md:flex ">
                        <HeaderRelatorio />
                    </div>
                    <div className="w-[100%]  itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col md:w-[80%]">
                        <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                            <SelectTextFields
                                width={'200px'}
                                icon={<LocalGroceryStoreIcon fontSize="small" />}
                                label={'Produto'}
                                backgroundColor={"#D9D9D9"}
                                name={"produto"}
                                fontWeight={500}
                                options={produtos.map(prod => ({ label: prod.nome, value: prod.nome }))}
                                onChange={(e) => setProduto(e.target.value)} // Update the selected product
                                value={produto} // Reflect the current state
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                label="Quantidade"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                autoComplete="off"
                                sx={{ width: { xs: '25%', sm: '50%', md: '40%', lg: '20%' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Numbers />
                                        </InputAdornment>
                                    ),
                                }}
                            />

<NumericFormat
    customInput={TextField}
    fullWidth
    variant="outlined"
    size="small"
    label="Preço"
    sx={{ width: { xs: '50%', sm: '50%', md: '40%', lg: '20%' } }}
    value={precoRaw} 
    onValueChange={(values) => {
        // Usa values.floatValue, que já está no formato correto
        setPrecoRaw(values.floatValue || '');
    }} 
    thousandSeparator="."
    decimalSeparator=","
    prefix="R$ "
    decimalScale={2}
    fixedDecimalScale={true}
    allowNegative={false}
    InputProps={{
        startAdornment: (
            <InputAdornment position="start">
                <MoneyRounded />
            </InputAdornment>
        ),
    }}
/>


                            <ButtonComponent
                                title="Adicionar"
                                subtitle="Adicionar"
                                startIcon={<AddCircleOutline />}
                                onClick={handleAddDesperdicio}
                            />
                        </div>
                        <TableComponent
                            headers={headerDesperdicio}
                            rows={desperdicioRows}
                            actionsLabel={"Ações"} // Se você quiser adicionar ações
                            actionCalls={{}} // Se você quiser adicionar ações
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Desperdicio;