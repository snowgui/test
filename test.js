/**
 * Converte um objeto JSON contendo uma lista de propostas para formato CSV.
 * Substitui valores booleanos 'true' pela string "sucesso".
 *
 * @param {object} jsonDados O objeto JSON contendo a chave 'proposals' com um array de objetos.
 * Exemplo: { proposals: [ { key1: val1, key2: true }, ... ] }
 * @returns {string} Uma string formatada como CSV, ou uma string vazia em caso de erro ou dados inválidos.
 */
function jsonParaCsvComSucesso(jsonDados) {
  // 1. Validação básica do input e acesso ao array 'proposals'
  if (!jsonDados || !jsonDados.proposals || !Array.isArray(jsonDados.proposals)) {
    console.error("Erro: O objeto de entrada é inválido ou não contém a chave 'proposals' como um array.");
    return ""; // Retorna string vazia se o formato for inválido
  }

  const proposals = jsonDados.proposals;

  // 2. Se o array de propostas estiver vazio, não há o que processar.
  if (proposals.length === 0) {
    return ""; // Retorna string vazia se não houver dados
  }

  // 3. Obter os cabeçalhos (nomes das colunas) a partir das chaves do *primeiro* objeto.
  //    Assume-se que todos os objetos na lista têm as mesmas chaves.
  const headers = Object.keys(proposals[0]);

  // 4. Criar a linha do cabeçalho CSV
  const linhaCabecalho = headers.join(',');

  // 5. Processar cada objeto (proposta) para criar as linhas de dados
  const linhasDados = proposals.map(proposta => {
    // Para cada proposta, mapeia os valores na ordem dos cabeçalhos
    return headers.map(header => {
      let valor = proposta[header];

      // 6. Substituir 'true' por "sucesso"
      if (valor === true) {
        return "sucesso";
      }

      // Tratamento opcional para valores que podem conter vírgulas ou aspas:
      // Se um valor for string e contiver vírgula ou aspas, coloca-o entre aspas duplas
      // e duplica quaisquer aspas duplas existentes dentro do valor.
      if (typeof valor === 'string' && (valor.includes(',') || valor.includes('"'))) {
         // Escapa as aspas duplas internas substituindo " por ""
         const valorEscapado = valor.replace(/"/g, '""');
         return `"${valorEscapado}"`; // Coloca o valor entre aspas duplas
      }


      // Retorna o valor original para outros tipos (números, false, null, undefined, strings simples)
      return valor;
    }).join(','); // Junta os valores da linha com vírgula
  });

  // 7. Combinar o cabeçalho e as linhas de dados, separados por quebra de linha
  const csvCompleto = [linhaCabecalho, ...linhasDados].join('\n');

  // 8. Retornar a string CSV completa
  return csvCompleto;
}

// --- Exemplo de Uso ---

// Seu JSON de exemplo
const dadosJson = {
  proposals: [
    {
      "proposalId": "c5e9c880-1d55-4399-a830-6f769375598a",
      "adjTaxTrue": true,
      "success_to_check": true
    },
    {
      "proposalId": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "adjTaxTrue": false, // Exemplo com false
      "success_to_check": true
    },
    {
      "proposalId": "x9y8z7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4",
      "adjTaxTrue": true,
      "success_to_check": false // Exemplo com false
    },
    {
        "proposalId": "z1z1z1z1-z1z1-z1z1-z1z1-z1z1z1z1z1z1",
        "adjTaxTrue": true,
        "success_to_check": true,
        "description": "Item com, vírgula e \"aspas\"" // Exemplo com vírgula e aspas
    }
  ]
};

// Chamada da função
const resultadoCsv = jsonParaCsvComSucesso(dadosJson);

// Imprimir o resultado no console
console.log(resultadoCsv);

/* Saída Esperada no Console:

proposalId,adjTaxTrue,success_to_check,description
c5e9c880-1d55-4399-a830-6f769375598a,sucesso,sucesso,
a1b2c3d4-e5f6-7890-1234-56789abcdef0,false,sucesso,
x9y8z7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4,sucesso,false,
z1z1z1z1-z1z1-z1z1-z1z1-z1z1z1z1z1z1,sucesso,sucesso,"Item com, vírgula e ""aspas"""

*/