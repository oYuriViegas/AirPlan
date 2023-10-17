// Função para exibir a seção desejada e ocultar as demais
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    for (let section of sections) {
        if (section.id === sectionId) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    }
}

// Oculta todas as seções no carregamento inicial e exibe apenas a primeira
document.addEventListener('DOMContentLoaded', function() {
    showSection('aeronaves');
});

// Funcionalidade para o formulário de aeronaves
document.getElementById('form-aeronaves').addEventListener('submit', function(event) {
    event.preventDefault();

    const modelo = document.getElementById('modelo').value;
    const identificacao = document.getElementById('identificacao').value;

    const listItem = document.createElement('li');
    listItem.textContent = `${modelo} - ${identificacao}`;

    document.getElementById('lista-aeronaves').appendChild(listItem);

    // Limpa o formulário
    event.target.reset();
});

// Funcionalidade para o formulário de aeroportos
document.getElementById('form-aeroportos').addEventListener('submit', function(event) {
    event.preventDefault();

    const aeroporto = document.getElementById('aeroporto').value;
    const cidade = document.getElementById('cidade').value;

    const listItem = document.createElement('li');
    listItem.textContent = `${aeroporto} - ${cidade}`;

    document.getElementById('lista-aeroportos').appendChild(listItem);

    // Limpa o formulário
    event.target.reset();
});

// Funcionalidade para o formulário de trechos
document.getElementById('form-trechos').addEventListener('submit', function(event) {
    event.preventDefault();

    const origem = document.getElementById('origem').value;
    const destino = document.getElementById('destino').value;

    const listItem = document.createElement('li');
    listItem.textContent = `${origem} -> ${destino}`;

    document.getElementById('lista-trechos').appendChild(listItem);

    // Limpa o formulário
    event.target.reset();
});

// Funcionalidade para o formulário de voos
document.getElementById('form-voos').addEventListener('submit', function(event) {
    event.preventDefault();

    const numeroVoo = document.getElementById('numero-voo').value;
    const dataVoo = document.getElementById('data-voo').value;
    const horarioPartida = document.getElementById('horario-partida').value;
    const horarioChegada = document.getElementById('horario-chegada').value;
    const aeroportoSaida = document.getElementById('aeroporto-saida').value;
    const aeroportoChegada = document.getElementById('aeroporto-chegada').value;
    const valorPassagem = document.getElementById('valor-passagem').value;

    const listItem = document.createElement('li');
    listItem.textContent = `Voo ${numeroVoo} - ${dataVoo} - ${horarioPartida}-${horarioChegada} - ${aeroportoSaida}-${aeroportoChegada} - R$ ${valorPassagem}`;

    document.getElementById('lista-voos').appendChild(listItem);

    // Limpa o formulário
    event.target.reset();
});




