document.getElementById('voltar-fechar').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const corpoTabela = document.getElementById('tabela-body');
    const seletorOrdem = document.getElementById('seletor-ordem');
    const campoFiltroNome = document.getElementById('filtro-nome'); 
    const itensSalvos = JSON.parse(localStorage.getItem('itens')) || [];
    let itensExibidos = [...itensSalvos]; 

    renderizarTabela(itensExibidos);

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
            let mes = parseInt(partes[1], 10) - 1;
            let ano = parseInt(partes[2], 10);
            let tempo = new Date(ano, mes, dia);
            
            let today = new Date();

            let calc = Math.abs(tempo - today);
            let dias = calc / (1000 * 60 * 60 * 24);
            let arred = Math.ceil(dias);
        
            let atual = new Date().getFullYear();
            let mual = new Date().getMonth();
            let dual = new Date().getDay();
            
            if (arred < 90) {
                newRow.classList.add('vermelho');
            } else if (arred > 90 && arred < 180) {
                newRow.classList.add('amarelo');
            }
            if (ano < atual || mes < mual && ano == atual){
                newRow.classList.add('preto');
            }
             if(arred < 4){
                newRow.classList.add('aviso');
            }
        });

        const botoesExcluir = document.querySelectorAll('.btn-excluir');
        botoesExcluir.forEach(botao => {
            botao.addEventListener('click', () => {
                const itemId = botao.getAttribute('data-id');
                const itemIndex = parseInt(botao.getAttribute('data-index'));
                excluirItem(itemId, itemIndex);
            });
        });
    }

    function excluirItem(itemId, itemIndex) {
        itensSalvos.splice(itemIndex, 1)
        localStorage.setItem('itens', JSON.stringify(itensSalvos));
        filtrarPorNome(campoFiltroNome.value.trim());
    }

    function ordenarPorValidade(ordem) {
        if (ordem === 'validadeAsc') {
            itensExibidos.sort((a, b) => {
                const dataA = a.validade.split('/').reverse().join('/');
                const dataB = b.validade.split('/').reverse().join('/');
                return new Date(dataA) - new Date(dataB);
            });
        } else if (ordem === 'validadeDesc') {
            itensExibidos.sort((a, b) => {
                const dataA = a.validade.split('/').reverse().join('/');
                const dataB = b.validade.split('/').reverse().join('/');
                return new Date(dataB) - new Date(dataA);
            });
        }
        renderizarTabela(itensExibidos);
    }

    function filtrarPorNome(nome) {
        const regex = new RegExp(nome, 'i');
        itensExibidos = itensSalvos.filter(item => regex.test(item.nome));
        renderizarTabela(itensExibidos);
    }

    seletorOrdem.addEventListener('change', () => {
        const ordemSelecionada = seletorOrdem.value;
        if (ordemSelecionada !== 'default') {
            ordenarPorValidade(ordemSelecionada);
        }
    });

    campoFiltroNome.addEventListener('input', () => {
        const nomeFiltrado = campoFiltroNome.value.trim();
        filtrarPorNome(nomeFiltrado);
    });

    document.getElementById('exportar-csv').addEventListener('click', () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Nome,Descrição,Validade,Quantidade\n" 
            + itensExibidos.map(item => `${item.nome},${item.descricao},${item.validade},${item.quantidade}`).join("\n");
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "itens.csv");
        document.body.appendChild(link); 
        link.click();
    });

    document.getElementById('gerar-relatorio').addEventListener('click', () => {
        const itens = itensExibidos; 
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
