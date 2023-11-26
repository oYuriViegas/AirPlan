// Importações das funções da API (Certifique-se de que elas estão corretamente implementadas)
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
                optionOrigem.value = cidade.Nome;
                cidadeOrigemInput.appendChild(optionOrigem);

                const optionDestino = document.createElement('option');
                optionDestino.value = cidade.Nome;
                cidadeDestinoInput.appendChild(optionDestino);
            });
        })
        .catch(error => console.error('Erro ao carregar cidades:', error));
}

// Carregar todos os voos inicialmente
function carregarTodosVoos() {
    getVoos()
        .then(response => {
            const voos = response.data;
            atualizarTabelaVoos(voos);
        })
        .catch(error => console.error('Erro ao carregar voos:', error));
}

// Buscar voos com base na origem e destino
function buscarVoos(origem, destino) {
    getVoos()
        .then(response => {
            const voosFiltrados = response.data.filter(voo => 
                voo.origem.includes(origem) && voo.destino.includes(destino)
            );
            atualizarTabelaVoos(voosFiltrados);
        })
        .catch(error => console.error('Erro ao buscar voos:', error));
}

// Atualizar a tabela de voos
function atualizarTabelaVoos(voos) {
    voosTableBody.innerHTML = '';
    voos.forEach(voo => {
        const row = createTableRow(voo);
        voosTableBody.appendChild(row);
    });
}

// Função para criar linhas da tabela com os dados dos voos
function createTableRow(voo) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${voo.origem}</td>
        <td>${voo.destino}</td>
        <td>${formatarDataHora(voo.partida)}</td>
        <td>${formatarDataHora(voo.chegada)}</td>
        <td>${voo.preco}</td>
    `;
    return row;
}

// Função para formatar data e hora
function formatarDataHora(dataHora) {
    const data = new Date(dataHora);
    return data.toLocaleString(); // Converte para formato local de data e hora
}

// Evento de envio do formulário de busca de voos
formBuscaVoo.addEventListener('submit', function(event) {
    event.preventDefault();
    const origem = cidadeOrigemInput.value;
    const destino = cidadeDestinoInput.value;
    buscarVoos(origem, destino);
});

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarCidades();
    carregarTodosVoos();
});
