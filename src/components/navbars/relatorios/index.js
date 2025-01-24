import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ButtonComponent from '../../button';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';

const HeaderRelatorio= () => {
    const navigate = useNavigate();

    const handleNavigation = (section) => {
        switch (section) {
            case 'estoque-real': // Aqui estava 'usuario', mas o botão chama 'usuarios'
                navigate('/relatorios/estoque-real');
                break;
            
            default:
                console.warn(`Seção desconhecida: ${section}`);
                break;
        }
    };
    

    return (
        <div className="w-[100%] items-center justify-center flex flex-wrap  sm:justify-start md:w-[15%] gap-1 ">
            <ButtonComponent
                startIcon={<BarChartIcon fontSize="small" />}
                title="Estoque Real"
                buttonSize="large"
                onClick={() => handleNavigation('estoque-real')}
                className="w-[35%] sm:w-[50%] md:w-[100%]"

            />
           
            
        </div>
    );
};

export default HeaderRelatorio;
