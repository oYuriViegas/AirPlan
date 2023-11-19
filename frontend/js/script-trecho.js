// Funções para interagir com o backend são importadas do api-trecho.js
import { getTrechos, createTrecho, updateTrecho, deleteTrecho } from './api-trecho.js';

// Referências para elementos do DOM
const trechosTableBody = document.querySelector('#trechosTable tbody');
const trechoForm = document.querySelector('#trechoForm');
const origemIdInput = document.querySelector('#origemIdTrecho');
const destinoIdInput = document.querySelector('#destinoIdTrecho');
const trechoIdInput = document.querySelector('#trechoId');

// Função para criar linhas da tabela com os dados dos trechos
function createTableRow(trecho) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${trecho.TRECHOID}</td>
      <td>${trecho.ORIGEMID}</td>
      <td>${trecho.DESTINOID}</td>
      <td>
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Excluir</button>
      </td>
    `;
    // Adiciona os eventos nos botões
    row.querySelector('.edit-btn').addEventListener('click', () => editTrecho(trecho, row));
    row.querySelector('.delete-btn').addEventListener('click', () => startDelete(trecho.TRECHOID));
    return row;
}

// Função para carregar e exibir a lista de trechos
function loadTrechos() {
    getTrechos()
        .then(response => {
            trechosTableBody.innerHTML = '';
            response.data.forEach(trecho => {
                trechosTableBody.appendChild(createTableRow(trecho));
            });
        })
        .catch(error => console.error('Falha ao carregar trechos:', error));
}

// Evento de submit do formulário para adicionar ou atualizar trecho
trechoForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const trechoData = {
        origemId: origemIdInput.value,
        destinoId: destinoIdInput.value
    };

    const trechoId = trechoIdInput.value;
    if (trechoId) {
        // Atualizar trecho existente
        updateTrecho(trechoId, trechoData)
            .then(() => {
                loadTrechos();
                resetForm();
            })
            .catch(error => console.error('Falha ao atualizar trecho:', error));
    } else {
        // Criar novo trecho
        createTrecho(trechoData)
            .then(() => {
                loadTrechos();
                resetForm();
            })
            .catch(error => console.error('Falha ao criar trecho:', error));
    }
});

function editTrecho(trecho, row) {
    row.children[1].innerHTML = `<input type="number" value="${trecho.ORIGEMID}" />`;
    row.children[2].innerHTML = `<input type="number" value="${trecho.DESTINOID}" />`;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Salvar';
    saveButton.addEventListener('click', () => saveEdit(trecho, row));

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.addEventListener('click', () => cancelEdit(trecho, row));

    row.children[3].innerHTML = '';
    row.children[3].appendChild(saveButton);
    row.children[3].appendChild(cancelButton);
}

function saveEdit(trecho, row) {
    const updatedOrigemId = row.children[1].querySelector('input').value;
    const updatedDestinoId = row.children[2].querySelector('input').value;

    const trechoData = {
        origemId: updatedOrigemId,
        destinoId: updatedDestinoId
    };

    updateTrecho(trecho.TRECHOID, trechoData)
        .then(() => loadTrechos())
        .catch(error => console.error('Falha ao atualizar trecho:', error));
}

function cancelEdit(trecho, row) {
    const newRow = createTableRow(trecho);
    row.parentNode.replaceChild(newRow, row);
}


function startDelete(id) {
    if (confirm('Tem certeza que deseja excluir este trecho?')) {
        deleteTrecho(id)
            .then(() => loadTrechos())
            .catch(error => console.error('Falha ao excluir trecho:', error));
    }
}


// Função para resetar o formulário
function resetForm() {
    trechoForm.reset();
    trechoIdInput.value = '';
}

// Carrega os trechos quando a página é carregada
document.addEventListener('DOMContentLoaded', loadTrechos);
