import { cadastrosRacas } from "../../../utils/json/cadastro/racas.js";

export const racas = cadastrosRacas.map(cadastrosRaca => ({
    ID: cadastrosRaca.ID,
    Nome: cadastrosRaca.Nome,
    Status: cadastrosRaca.Status,
  }));