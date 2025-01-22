import { contratosFinalizados } from "../../utils/json/contratos-finalizados";

export const contratosPendentesMapeados = contratosFinalizados.map(contrato => ({
  ID: contrato.ID,
  Titular: contrato.Titular.Nome, // Aqui você está pegando o nome do titular
  Vendedor: contrato.Vendedor,
  "Data do Contrato": contrato["Data do Contrato"],
  Unidade: contrato["Unidade Pax"],
  Tipo: contrato["Tipo de Contrato"],
  Contrato: contrato.Contrato,
  Status: contrato.Status || "Status não definido" // Preenchendo a coluna Status
}));

// Remover duplicatas
const uniqueContratos = Array.from(new Set(contratosPendentesMapeados.map(a => a.ID)))
  .map(id => {
    return contratosPendentesMapeados.find(a => a.ID === id);
  });

