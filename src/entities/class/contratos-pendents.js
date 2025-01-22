import { contratos } from "../../utils/json/contratos-pendentes";

export const contratosPendentesMapeados = contratos.map(contrato => ({
    ID: contrato.ID,
    TitularNome: contrato.Titular.Nome,
    Vendedor: contrato.Vendedor,
    "Data do Contrato": contrato["Data do Contrato"],
    Unidade: contrato["Unidade Pax"],
    Tipo: contrato["Tipo de Contrato"],
    Status: contrato.Status,
  }));