import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClearIcon from '@mui/icons-material/Clear';
import { Modal, Box, Menu, MenuItem, Typography } from "@mui/material";
import Title from "../../title";
import ButtonComponent from "../../button";
import SelectTextFields from "../../select";
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const HeaderPerfil = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [uniqueCategoriesCount, setUniqueCategoriesCount] = useState(0);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenLogoutConfirm = () => setOpenLogoutConfirm(true);
  const handleCloseLogoutConfirm = () => setOpenLogoutConfirm(false);

  const confirmLogout = async () => {
    handleCloseLogoutConfirm();
    // const response = await logout();
    // setTimeout(() => {
    //   sessionStorage.clear();
    //   navigate("/login");
    //   CustomToast({ type: 'success', message: response.message });
    // }, 10);
  };
  useEffect(() => {
    const categoriasSalvas = JSON.parse(localStorage.getItem('unidades')) || [];
    const categoriasUnicas = Array.from(new Set(categoriasSalvas.map(cat => cat.nome)))
      .map(nome => categoriasSalvas.find(cat => cat.nome === nome));

    setCategorias(categoriasUnicas);
    setUniqueCategoriesCount(categoriasUnicas.length); // Atualiza o estado com o número de categorias únicas
  }, []);
  return (
    <>
      <div className="hidden md:flex justify-end w-full h-8">
        <div
          className="flex items-center justify-center  w-[35%] h-20 bg-cover bg-no-repeat rounded-bl-lg"
          style={{ backgroundColor: '#BCDA72' }}
        >
          <div className="w-[80%] items-star flex flex-wrap gap-2">

          <SelectTextFields
                width={'150px'}
                icon={<CategoryIcon fontSize="small" />}
                label={'Unidades'}
                backgroundColor={"#D9D9D9"}
                name={"Unidades"}
                fontWeight={500}
                options={categorias.map(categoria => ({ label: categoria.nome, value: categoria.id }))}
                onChange={(e) => setSelectedCategoria(e.target.value)} // Atualiza o estado
                value={selectedCategoria} // Reflete o estado atual no componente
              />
            <div className="flex items-center justify-start text-black  ">
              <a className="cursor-pointer p-1" >
                <AccountCircleIcon />
              </a>
              <span className="text-xs text-black font-bold ">Administrador</span>

            </div>
          </div>
          <div className="w-[10%] flex justify-center items-center" style={{backgroundColor:'white', borderRadius:'50px', padding:'5px'}} >
            <a onClick={handleMenuOpen} className="cursor-pointer p-1">
              <LogoutIcon />
            </a>
          </div>
        </div>

      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="p-4"
      >
        <MenuItem onClick={handleOpenLogoutConfirm} title="Sair do sistema" className="flex items-center gap-2">
          <LogoutIcon fontSize="small" className="text-red" /> Sair
        </MenuItem>
      </Menu>
      <Modal
        open={openLogoutConfirm}
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <Box sx={style}>
          <div className='flex justify-between'>
            <Typography id="logout-modal-title" variant="h6" component="h2">
              <Title
                conteudo={"Confirmação de Logout"}
                fontSize={"18px"}
                fontWeight={"700"}
                color={"#006b33"}
              />
            </Typography>
            <button className='text-red' title="Fechar" onClick={handleCloseLogoutConfirm}><ClearIcon /></button>
          </div>
          <Typography id="logout-modal-description" sx={{ mt: 2 }}>
            <Title
              conteudo={"Tem certeza de que deseja sair?"}
              fontSize={"15px"}
              fontWeight={"500"}
            />
          </Typography>
          <div className="flex gap-2 justify-end mt-4">
            <ButtonComponent
              subtitle={"Corfirmar Logout"}
              title={"SIM"}
              onClick={confirmLogout}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default HeaderPerfil;
