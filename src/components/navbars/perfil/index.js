import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClearIcon from '@mui/icons-material/Clear';
import { Modal, Box, Menu, MenuItem, Typography } from "@mui/material";
import Title from "../../title";
import ButtonComponent from "../../button";
import CustomToast from "../../toast";
import SelectTextFields from "../../select";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';

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

const HeaderPerfil = ({ unidades, onSelectUnidade }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

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

  return (
    <>
      <div className="hidden md:flex justify-end w-full h-8">
        <div
          className="flex items-center justify-center  w-[14%] h-24 bg-cover bg-no-repeat rounded-bl-lg"
          style={{ backgroundColor: '#BCDA72' }}
        >
          <div className="w-[80%] items-star flex flex-wrap gap-2">
            <div className="flex items-center justify-start text-black  ">
              <a  className="cursor-pointer p-1">
                <AccountCircleIcon />
              </a>
              <span className="text-xs text-black font-bold ">Administrador</span>

            </div>
            <SelectTextFields
              width={'150px'}
              label={'Unidade'}
              
              icon={<LocationOnIcon fontSize="small" />}
              value={''} // Aqui você pode definir o valor selecionado
            />
          </div>
          <div className="w-[10%]" >
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
