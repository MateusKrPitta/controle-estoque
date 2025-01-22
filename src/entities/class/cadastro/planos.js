import { cadastrosPlanos } from "../../../utils/json/cadastro/planos.js";

export const planos = cadastrosPlanos.map(cadastrosPlano => ({
    ID: cadastrosPlano.ID,
    Nome: cadastrosPlano.Nome,
    Unidades: cadastrosPlano.Unidades,
  }));