document.addEventListener('DOMContentLoaded', () => {
  const corpoTabela = document.getElementById('tabela-body');
  const seletorOrdem = document.getElementById('seletor-ordem');
  const campoFiltroNome = document.getElementById('filtro-nome'); // Novo campo de filtro por nome
  const itensSalvos = JSON.parse(localStorage.getItem('itens')) || [];
  let itensExibidos = [...itensSalvos]; // Usado para manter uma cópia dos itens exibidos

  // Renderizar a tabela
  renderizarTabela(itensExibidos);

  // Função para renderizar a tabela
  function renderizarTabela(itens) {
      corpoTabela.innerHTML = '';

      itens.forEach(item => {
          const newRow = corpoTabela.insertRow();
          newRow.innerHTML = `
              <td>${item.descricao}</td>
              <td>${item.quantidade}</td>
              <td>${item.validade}</td>
              <td>${item.nome}</td>
          `;
      });
  }

  // Função para ordenar os itens por validade
  function ordenarPorValidade(ordem) {
      if (ordem === 'validadeAsc') {
          itensExibidos.sort((a, b) => new Date(a.validade) - new Date(b.validade));
      } else if (ordem === 'validadeDesc') {
          itensExibidos.sort((a, b) => new Date(b.validade) - new Date(a.validade));
      }
      renderizarTabela(itensExibidos);
  }

  // Função para filtrar os itens por nome
  function filtrarPorNome(nome) {
      const regex = new RegExp(nome, 'i'); // Expressão regular para busca por nome, o 'i' ignora maiúsculas e minúsculas
      itensExibidos = itensSalvos.filter(item => regex.test(item.nome));
      renderizarTabela(itensExibidos);
  }

  // Event listener para mudanças no seletor de ordem
  seletorOrdem.addEventListener('change', () => {
      const ordemSelecionada = seletorOrdem.value;
      if (ordemSelecionada !== 'default') {
          ordenarPorValidade(ordemSelecionada);
      }
  });

  // Event listener para mudanças no campo de filtro por nome
  campoFiltroNome.addEventListener('input', () => {
      const nomeFiltrado = campoFiltroNome.value.trim();
      filtrarPorNome(nomeFiltrado);
  });

  // Função para gerar o relatório
  document.getElementById('gerar-relatorio').addEventListener('click', () => {
      // Aqui você pode escrever o código para gerar o relatório com base nos dados da planilha
      // Por exemplo, você pode percorrer os itens salvos e criar um documento HTML para impressão
      const itens = itensExibidos; // Use itensExibidos para o relatório
      const relatorioHTML = `
          <div style="display: flex; justify-content: center;">
              <div>
                  <h1 style="text-align: center;">Relatório</h1>
                  <table>
                      <thead>
                          <tr>
                              <th>Descrição</th>
                              <th>Quantidade</th>
                              <th>Validade</th>
                              <th>Nome</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${itens.map(item => `
                              <tr>
                                  <td>${item.descricao}</td>
                                  <td>${item.quantidade}</td>
                                  <td>${item.validade}</td>
                                  <td>${item.nome}</td>
                              </tr>
                          `).join('')}
                      </tbody>
                  </table>
              </div>
          </div>`;

      const janelaRelatorio = window.open('', '_blank');
      janelaRelatorio.document.open();
      janelaRelatorio.document.write(relatorioHTML);
      janelaRelatorio.document.close();
  });
});
