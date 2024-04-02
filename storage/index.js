document.getElementById('formulario').addEventListener('submit', function(){


const descricao = document.getElementById('descricao').value;
const validade = document.getElementById('validade').value;
const quantidade = document.getElementById('quantidade').value;
const nome = document.getElementById('nome').value;

// Simular envio do formulário com dados válidos
const novoItem = {
  descricao: descricao,
  quantidade: quantidade,
  validade: validade,
  nome: nome
};

itensSalvos.push(novoItem);
localStorage.setItem('itens', JSON.stringify(itensSalvos));

 document.getElementById('descricao').value = '';
 document.getElementById('validade').value= '';
 document.getElementById('quantidade').value= '';
document.getElementById('nome').value= '';

// Verificar se o item foi adicionado corretamente
console.log('Itens salvos:', JSON.parse(localStorage.getItem('itens')));
});

// Verificar se o item foi salvo corretamente
const itensSalvos = JSON.parse(localStorage.getItem('itens')) || [];
const opentable = document.getElementById('table').addEventListener('click', function(){
    window.open('tabela.html', '_blank');
  } )



