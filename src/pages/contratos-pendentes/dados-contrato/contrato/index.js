import React from 'react';

const Contrato = ({ contrato }) => {
  if (!contrato) {
    return <div>Nenhum contrato disponível.</div>;
  }

  return (
    <div className="contrato-container">
      <h2>Detalhes do Contrato</h2>
      <div>
        <strong>Template:</strong> {contrato.nomeContrato}
      </div>
      <div>
        <strong>Tipo do Contrato:</strong> {contrato.dadosGerais?.tipoContrato || 'Contrato não disponível'}
      </div>
      <div>
        <strong>Data do Contrato:</strong> {contrato.dadosGerais?.dataContrato || 'Data não disponível'}
      </div>
      <div>
        <strong>Unidade Pax:</strong> {contrato.dadosGerais?.unidadePax}
      </div>

      <div>
        <strong>Nome do Titular:</strong> {contrato.dadosTitular?.nome || 'Nome não disponível'}
      </div>
      <div>
        <strong>CPF:</strong> {contrato.dadosTitular?.cpf || 'CPF não disponível'}
      </div>
      <div>
        <strong>RG:</strong> {contrato.dadosTitular?.rg || 'RG não disponível'}
      </div>
      <div>
        <strong>Endereço:</strong> {contrato.dadosEndereco?.logradouro || 'Endereço não disponível'}
      </div>
      <div>
        <strong>CEP:</strong> {contrato.dadosEndereco?.CEP || 'CEP não disponível'}
      </div>
      <div>
        <strong>Bairro:</strong> {contrato.dadosEndereco?.bairro || 'Bairro não disponível'}
      </div>
      <div>
        <strong>Cidade:</strong> {contrato.dadosEndereco?.cidadeAtual2 || 'Cidade não disponível'}
      </div>
      <div>
        <strong>Estado:</strong> {contrato.dadosEndereco?.estado2 || 'Estado não disponível'}
      </div>
      <div>
        <strong>Número:</strong> {contrato.dadosEndereco?.numero || 'Número não disponível'}
      </div>

      {/* Adicione mais campos conforme necessário */}
      <div>
        <strong>Status:</strong> {contrato.status || 'Status não disponível'}
      </div>
      {contrato.assinatura && (
        <div>
          <strong>Assinatura:</strong>
          <img 
            src={contrato.assinatura} 
            alt="Assinatura" 
            style={{ width: '200px', height: 'auto', marginTop: '10px' }} // Ajuste o tamanho conforme necessário
          />
        </div>
      )}
      
      {contrato.dadosTitular?.dependentes && contrato.dadosTitular.dependentes.length > 0 && (
        <div>
          <h3>Dependentes:</h3>
          <ul>
            {contrato.dadosTitular.dependentes.map((dependente, index) => (
              <li key={index}>{dependente.nome}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Contrato;