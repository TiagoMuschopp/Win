
   function validarData() {
    var inputValidade = document.getElementById('validade');
    var regexData = /^\d{2}\/\d{2}\/\d{4}$/; // Expressão regular para dd/mm/yyyy

    if (!regexData.test(inputValidade.value)) {
        alert('Formato de data inválido. Por favor, insira no formato dd/mm/yyyy.');
        inputValidade.focus();
        return false;
    }
    return true;
}

// Evento de submissão do formulário
document.getElementById('formulario').addEventListener('submit', function(event) {
    if (!validarData()) {
        event.preventDefault(); // Impede o envio do formulário se a validação falhar
    }
});

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
    window.location.href = 'tabela.html';
  } )



