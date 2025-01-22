import { cadastrosAdicionais } from "../../../utils/json/cadastro/adicionais.js";

export const adicionais = cadastrosAdicionais.map(cadastrosAdicionai => ({
    ID: cadastrosAdicionai.ID,
    Nome: cadastrosAdicionai.Nome,
    Unidades: cadastrosAdicionai.Unidades,
  }));