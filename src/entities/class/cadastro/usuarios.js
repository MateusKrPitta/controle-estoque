import { cadastrosUsuarios } from "../../../utils/json/cadastro/usuarios.js";

export const usuario = cadastrosUsuarios.map(cadastrosUsuario => ({
    ID: cadastrosUsuario.ID,
    Nome: cadastrosUsuario.Nome,
    CPF: cadastrosUsuario.CPF,
    Funcao: cadastrosUsuario.Funcao,
  }));