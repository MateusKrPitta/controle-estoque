import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import ButtonComponent from '../../button';
import { useNavigate } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { PetsOutlined } from '@mui/icons-material';

const HeaderNovoContrato = ({ activeSection, disabledSections, handleNavigation }) => {
    const navigate = useNavigate();

    const handleNavigationLocal = (section) => {
        handleNavigation(section); // Use a função recebida como prop
        switch (section) {
            case 'dadosGerais':
                navigate('/novo-contrato/dados-gerais');
                break;
            case 'dadosTitular':
                navigate('/novo-contrato/dados-titular');
                break;
            case 'endereco':
                navigate('/novo-contrato/endereco');
                break;
            case 'dependentes':
                navigate('/novo-contrato/dependentes');
                break;
            case 'dependentePet':
                navigate('/novo-contrato/dependente-pet');
                break;
            case 'assinatura':
                navigate('/novo-contrato/assinatura');
                break;
            default:
                break;
        }
    };

    return (
        <div className="  flex flex-col w-[100%] gap-1">
            <ButtonComponent
                startIcon={<ArticleIcon fontSize="small" />}
                title="Dados Gerais"
                buttonSize="large"
                onClick={() => handleNavigationLocal('dadosGerais')}
                className={activeSection === 'dadosGerais' ? 'btn-active' : 'btn'}
                disabled={disabledSections.includes('dadosGerais')}
            />
            <ButtonComponent
                startIcon={<AccountCircleIcon fontSize="small" />}
                title="Dados Titular"
                buttonSize="large"
                onClick={() => handleNavigationLocal('dadosTitular')}
                className={activeSection === 'dadosTitular' ? 'btn-active' : 'btn'}
                disabled={disabledSections.includes('dadosTitular')}
            />
            <ButtonComponent
                startIcon={<LocationOnIcon fontSize="small" />}
                title="Endereço"
                buttonSize="large"
                onClick={() => handleNavigationLocal('endereco')}
                className={activeSection === 'endereco' ? 'btn-active' : 'btn'}
                disabled={disabledSections.includes('endereco')}
            />
            <ButtonComponent
                startIcon={<GroupAddIcon fontSize="small" />}
                title="Dependentes"
                buttonSize="large"
                onClick={() => handleNavigationLocal('dependentes')}
                className={activeSection === 'dependentes' ? 'btn-active' : 'btn'}
                disabled={disabledSections.includes('dependentes')}
            />
            <ButtonComponent
                startIcon={<PetsOutlined fontSize="small" />}
                title="Dependente Pet"
                buttonSize="large"
                onClick={() => handleNavigationLocal('dependentePet')}
                className={activeSection === 'dependentePet' ? 'btn-active' : 'btn'}
                disabled={disabledSections.includes('dependentePet')}
            />
            <ButtonComponent
                startIcon={<EditIcon fontSize="small" />}
                title="Assinatura"
                buttonSize="large"
                onClick={() => handleNavigationLocal('assinatura')}
                className={activeSection === 'assinatura' ? 'btn-active' : 'btn'}
                disabled={disabledSections.includes('assinatura')}
            />
        </div>
    );
};

export default HeaderNovoContrato;
