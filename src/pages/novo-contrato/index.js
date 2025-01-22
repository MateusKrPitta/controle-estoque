import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para navegação
import Navbar from '../../components/navbars/header';
import HeaderPerfil from '../../components/navbars/perfil';
import TableComponent from '../../components/table';
import { contratos } from '../../utils/json/novos-contrato'; // Importação dos contratos
import { headerNovoContrato } from '../../entities/headers/header-novo-contrato';
import ButtonComponent from '../../components/button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MenuMobile from '../../components/menu-mobile';
import { ArticleOutlined } from '@mui/icons-material';

const NovoContrato = () => {
  const [selectedContract, setSelectedContract] = useState(null); // Contrato selecionado
  const navigate = useNavigate(); // Hook para navegação

  const handleRowClick = (row) => {
    setSelectedContract(row); // Atualizar o contrato selecionado
  };

  const handleAvancar = () => {
    navigate('/novo-contrato/dados-gerais', { state: { contratoNome: selectedContract?.nome } });
  };

  return (
    <div className="container-contratos-pendentes ">
      <Navbar />
      <div className='flex flex-col gap-2 w-full items-end'>
        <MenuMobile />
        <HeaderPerfil />
        <h1 className='flex gap-2 items-center justify-center text-base sm:ml-1  md:text-2xl  font-bold text-primary w-full md:justify-start   '><ArticleOutlined />Novo Contrato</h1>

        <div className="w-full">
          <div className="w-[90%] mt-5 ml-6 md:ml-0">
            <TableComponent
              rows={contratos}
              headers={headerNovoContrato}
              actionCalls={{
                option: (row) => handleRowClick(row), // Clique na linha atualiza o contrato selecionado
              }}
              actionsLabel="Ações"
            />
          </div>

          {selectedContract && (
            <div className="w-[90%] mt-5 flex justify-end">
              <ButtonComponent
                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                title="Avançar"
                subtitle="Avançar"
                buttonSize="large"
                onClick={handleAvancar} // Clique no botão chama a função para navegar
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovoContrato;
