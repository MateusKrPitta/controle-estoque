import { cadastrosParentescos } from "../../../utils/json/cadastro/parentescos.js";

export const parentescos = cadastrosParentescos.map(cadastrosParentesco => ({
    ID: cadastrosParentesco.ID,
    Nome: cadastrosParentesco.Nome,
    Unidades: cadastrosParentesco.Unidades,
  }));