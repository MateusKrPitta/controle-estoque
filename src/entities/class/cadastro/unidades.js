import { cadastrosUnidades } from "../../../utils/json/cadastro/unidades.js";

export const unidades = cadastrosUnidades.map(cadastrosUnidade => ({
    ID: cadastrosUnidade.ID,
    Descricao: cadastrosUnidade.Descricao,
    UF: cadastrosUnidade.UF,
    Telefone: cadastrosUnidade.Telefone,
    CNPJ: cadastrosUnidade.CNPJ,
  }));