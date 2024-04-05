document.getElementById('voltar-fechar').addEventListener('click', function(){
    window.location.href = 'index.html';
});

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

        itens.forEach((item, index) => {
            const newRow = corpoTabela.insertRow();
            newRow.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.descricao}</td>
            <td>${item.validade}</td>
            <td>${item.quantidade}</td>
            <td><button class="btn-excluir" data-id="${item.id}" data-index="${index}">Excluir</button></td>
            `;

            let time = item.validade;
            let partes = time.split('/');
            let dia = parseInt(partes[0], 10);
            let mes = parseInt(partes[1], 10) - 1; // Os meses em JavaScript são baseados em zero (janeiro = 0, fevereiro = 1, ...)
            let ano = parseInt(partes[2], 10);
            let tempo = new Date(ano, mes, dia);
            
            let today = new Date();

            
            let calc = Math.abs(tempo - today); // Diferença em milissegundos
            
            let dias = calc / (1000 * 60 * 60 * 24); // Convertendo milissegundos para dias
            let arred = Math.ceil(dias);
        
            let atual = new Date().getFullYear();
            let mual = new Date().getMonth();
            let dual = new Date().getDay();
            
            if (arred < 90) { // Menor que 3 meses (90 dias)
                newRow.classList.add('vermelho');
            } else if (arred > 90 && arred < 180) { // Menor que 6 meses (180 dias) 
                newRow.classList.add('amarelo');
            }
            if (ano < atual || mes < mual && ano == atual){
                newRow.classList.add('preto');
            }
             if(arred < 4){
                newRow.classList.add('aviso');
            }
           

        });

        // Adicionando event listener para os botões de exclusão
        const botoesExcluir = document.querySelectorAll('.btn-excluir');
        botoesExcluir.forEach(botao => {
            botao.addEventListener('click', () => {
                const itemId = botao.getAttribute('data-id');
                const itemIndex = parseInt(botao.getAttribute('data-index'));
                excluirItem(itemId, itemIndex);
            });
        });
        

    }

    // Função para excluir um item da lista
    function excluirItem(itemId, itemIndex) {
        itensSalvos.splice(itemIndex, 1)
        localStorage.setItem('itens', JSON.stringify(itensSalvos));
        // Atualizar a lista de itens exibidos e renderizar a tabela novamente
        filtrarPorNome(campoFiltroNome.value.trim());
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

    document.getElementById('exportar-csv').addEventListener('click', () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Nome,Descrição,Validade,Quantidade\n" // Adiciona uma linha com os nomes das colunas
            + itensExibidos.map(item => `${item.nome},${item.descricao},${item.validade},${item.quantidade}`).join("\n");
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "itens.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
    });
    
    

    document.getElementById('gerar-relatorio').addEventListener('click', () => {
        const itens = itensExibidos; // Supondo que itensExibidos seja a lista de itens a ser exibida no relatório
        const relatorioHTML = `
            <div style="display: flex; justify-content: center;">
                <div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;">
                    <h1 style="text-align: center; font-size: 24px;">Relatório</h1>
                    <table style=" width: 100%; font-size: 18px;">
                        <thead>
                            <tr style="border-bottom: 2px solid black;">
                                <th style="padding: 12px; border-bottom: 2px solid black; text-align: left; width: 35%;">Nome</th>
                                <th style="padding: 12px; border-bottom: 2px solid black; text-align: left; width: 45%;">Descrição</th>
                                <th style="padding: 12px; border-bottom: 2px solid black; text-align: center; width: 30%;">Validade</th>
                                <th style="padding: 12px; border-bottom: 2px solid black; text-align: center; width: 30%;">Quantidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itens.map(item => `
                                <tr style="border-bottom: 1px solid black;">
                                    <td style="padding: 12px; width: 35%;">${item.nome}</td>
                                    <td style="padding: 12px; width: 45%;">${item.descricao}</td>
                                    <td style="padding: 12px;text-align: center; width: 30%;">${item.validade}</td>
                                    <td style="padding: 12px; text-align: center; width: 30%;">${item.quantidade}</td>
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
