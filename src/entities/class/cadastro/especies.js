import { cadastrosEspecies } from "../../../utils/json/cadastro/especies.js";

export const especies = cadastrosEspecies.map(cadastrosEspecie => ({
    ID: cadastrosEspecie.ID,
    Nome: cadastrosEspecie.Nome,
    Status: cadastrosEspecie.Status,
  }));