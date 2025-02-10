import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ButtonComponent from '../../button';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import { ProductionQuantityLimitsTwoTone } from '@mui/icons-material';

const HeaderCadastro = () => {
    const navigate = useNavigate();

    const handleNavigation = (section) => {
        switch (section) {
            case 'usuarios': // Aqui estava 'usuario', mas o botão chama 'usuarios'
                navigate('/cadastro/usuarios');
                break;
            case 'produtos':
                navigate('/cadastro/produtos');
                break;
            case 'unidades':
                navigate('/cadastro/unidades');
                break;
            case 'categoria':
                navigate('/cadastro/categoria');
                break;

            default:
                console.warn(`Seção desconhecida: ${section}`);
                break;
        }
    };


    return (
        <div className="w-[100%] items-center justify-center flex flex-wrap  sm:justify-start md: gap-1 ">
            <ButtonComponent
                startIcon={<AccountCircleIcon fontSize="small" />}
                title="Usuário"
                buttonSize="large"
                onClick={() => handleNavigation('usuarios')}
                className="w-[35%] sm:w-[50%] md:w-[100%]"

            />
             <ButtonComponent
                startIcon={<ProductionQuantityLimitsTwoTone fontSize="small" />}
                title="Produtos"
                buttonSize="large"
                onClick={() => handleNavigation('produtos')}
                className="w-[35%] sm:w-[50%] md:w-[100%]"

            />
            <ButtonComponent
                startIcon={<LocationOnIcon fontSize="small" />}
                title="Unidades"
                buttonSize="large"
                onClick={() => handleNavigation('unidades')}
                className="w-[35%] sm:w-[50%] md:w-[100%]"

            />
            <ButtonComponent
                startIcon={<CategoryIcon fontSize="small" />}
                title="Categorias"
                buttonSize="large"
                onClick={() => handleNavigation('categoria')}
                className="w-[35%] sm:w-[50%] md:w-[100%]"

            />

        </div>
    );
};

export default HeaderCadastro;
