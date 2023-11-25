// Importação das funções da API
import { getCidades, getVoos } from './api-voo.js';

// Selecionar elementos do DOM
const cidadeOrigemInput = document.querySelector('#cidade-origem');
const cidadeDestinoInput = document.querySelector('#cidade-destino');
const voosTableBody = document.querySelector('#tabela-voos tbody');
const formBuscaVoo = document.querySelector('#form-busca-voo');

// Carregar cidades nas opções de origem e destino
function carregarCidades() {
    getCidades()
        .then(response => {
            const cidades = response.data;
            cidades.forEach(cidade => {
                const optionOrigem = document.createElement('option');
                const optionDestino = document.createElement('option');
                optionOrigem.value = cidade.Nome;
                optionDestino.value = cidade.Nome;
                cidadeOrigemInput.appendChild(optionOrigem);
                cidadeDestinoInput.appendChild(optionDestino);
            });
        })
        .catch(error => console.error('Erro ao carregar cidades:', error));
}

// Evento de envio do formulário de busca de voos
formBuscaVoo.addEventListener('submit', function(event) {
    event.preventDefault();
    const origem = cidadeOrigemInput.value;
    const destino = cidadeDestinoInput.value;
    buscarVoos(origem, destino);
});

// Buscar voos com base na origem e destino
function buscarVoos(origem, destino) {
    getVoos()
        .then(response => {
            const voos = response.data.filter(voo => 
                voo.origem === origem && voo.destino === destino
            );
            atualizarTabelaVoos(voos);
        })
        .catch(error => console.error('Erro ao buscar voos:', error));
}

// Atualizar a tabela de voos
function atualizarTabelaVoos(voos) {
    voosTableBody.innerHTML = '';
    voos.forEach(voo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${voo.vooId}</td>
            <td>${voo.origem}</td>
            <td>${voo.destino}</td>
            <td>${voo.dataPartida}</td>
            <td>${voo.dataChegada}</td>
            <td>${voo.preco}</td>
        `;
        voosTableBody.appendChild(row);
    });
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarCidades();
});
