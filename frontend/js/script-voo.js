// Funções para interagir com o backend são importadas do api-voo.js
import { getVoos, createVoo, updateVoo, deleteVoo, getVooById } from './api-voo.js';

// Referências para elementos do DOM
const voosTableBody = document.querySelector('#voosTable tbody');
const vooForm = document.querySelector('#vooForm');
const aeronaveIdInput = document.querySelector('#aeronaveIdVoo');
const trechoIdInput = document.querySelector('#trechoIdVoo');
const dataHoraPartidaInput = document.querySelector('#dataHoraPartida');
const dataHoraChegadaInput = document.querySelector('#dataHoraChegada');
const valorAssentoInput = document.querySelector('#valorAssento');
const vooIdInput = document.querySelector('#vooId');

function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString(); // Formato local, você pode personalizar conforme necessário
}

// Função para criar linhas da tabela com os dados dos voos
function createTableRow(voo) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${voo.VOOID}</td>
      <td>${voo.AERONAVEID}</td>
      <td>${voo.TRECHOID}</td>
      <td>${formatDateTime(voo.DATAHORAPARTIDA)}</td>
      <td>${formatDateTime(voo.DATAHORACHEGADA)}</td>
      <td>${voo.VALORASSENTO}</td>
      <td>
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Excluir</button>
      </td>
    `;
    // Adiciona os eventos nos botões
    row.querySelector('.edit-btn').addEventListener('click', () => editVoo(voo, row));
    row.querySelector('.delete-btn').addEventListener('click', () => startDelete(voo.VOOID));
    return row;
}

// Função para carregar e exibir a lista de voos
function loadVoos() {
    getVoos()
        .then(response => {
            voosTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados
            response.data.forEach(voo => {
                voosTableBody.appendChild(createTableRow(voo));
            });
        })
        .catch(error => console.error('Falha ao carregar voos:', error));
}

// Evento de submit do formulário para adicionar ou atualizar voo
vooForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const vooData = {
        AeronaveID: Number(aeronaveIdInput.value),
        TrechoID: Number(trechoIdInput.value),
        DataHoraPartida: new Date(dataHoraPartidaInput.value).toISOString(),
        DataHoraChegada: new Date(dataHoraChegadaInput.value).toISOString(),
        ValorAssento: Number(valorAssentoInput.value)
    };

    console.log(vooData);

    const vooId = vooIdInput.value;
    if (vooId) {
        // Atualizar voo existente
        updateVoo(vooId, vooData)
            .then(() => {
                loadVoos();
                resetForm();
            })
            .catch(error => console.error('Falha ao atualizar voo:', error));
    } else {
        // Criar novo voo
        createVoo(vooData)
            .then(() => {
                loadVoos();
                resetForm();
            })
            .catch(error => console.error('Falha ao criar voo:', error));
    }
});

function formatToISODate(dateTimeString) {
    const localDate = new Date(dateTimeString);
    const offset = localDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(localDate.getTime() - offset);
    return adjustedDate.toISOString().slice(0, -1) + 'Z'; // Remove milliseconds
}

function formatDateTimeForInput(isoString) {
    const date = new Date(isoString);
    // Formata a data e hora para o formato que o datetime-local espera
    return date.toISOString().slice(0, 16); // Formato 'YYYY-MM-DDTHH:MM'
}

function editVoo(voo, row) {
    // Transforma as células da tabela em campos de entrada
    row.children[1].innerHTML = `<input type="number" value="${voo.AERONAVEID}" />`;
    row.children[2].innerHTML = `<input type="number" value="${voo.TRECHOID}" />`;
    row.children[3].innerHTML = `<input type="datetime-local" value="${formatDateTimeForInput(voo.DATAHORAPARTIDA)}" />`;
    row.children[4].innerHTML = `<input type="datetime-local" value="${formatDateTimeForInput(voo.DATAHORACHEGADA)}" />`;
    row.children[5].innerHTML = `<input type="number" value="${voo.VALORASSENTO}" />`;

    // Muda os botões
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Salvar';
    saveButton.addEventListener('click', () => saveEdit(voo, row));

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.addEventListener('click', () => cancelEdit(voo, row));

    row.children[6].innerHTML = ''; // Limpa a célula dos botões
    row.children[6].appendChild(saveButton);
    row.children[6].appendChild(cancelButton);
}


function saveEdit(voo, row) {
    const updatedAeronaveId = row.children[1].querySelector('input').value.trim();
    const updatedTrechoId = row.children[2].querySelector('input').value.trim();
    const updatedDataHoraPartida = row.children[3].querySelector('input').value;
    const updatedDataHoraChegada = row.children[4].querySelector('input').value;
    const updatedValorAssento = row.children[5].querySelector('input').value;

    if (!updatedAeronaveId || !updatedTrechoId || !updatedDataHoraPartida || !updatedDataHoraChegada || !updatedValorAssento) {
        alert('Todos os campos são obrigatórios.');
        return;
    }

    console.log(updatedDataHoraPartida, updatedDataHoraPartida.type)
    // Converter para formato ISO
    updatedDataHoraPartida = formatToISODate(updatedDataHoraPartida);
    updatedDataHoraChegada = formatToISODate(updatedDataHoraChegada);

    console.log(updatedDataHoraPartida)
    const vooData = {
        AeronaveID: updatedAeronaveId,
        TrechoID: updatedTrechoId,
        DataHoraPartida: updatedDataHoraPartida,
        DataHoraChegada: updatedDataHoraChegada,
        ValorAssento: updatedValorAssento
    };

    // Chamada para a API de atualização
    updateVoo(voo.VOOID, vooData)
        .then(() => loadVoos())
        .catch(error => console.error('Falha ao atualizar voo:', error));
}

function cancelEdit(voo, row) {
    // Recria a linha da tabela com os valores originais
    const newRow = createTableRow(voo);
    row.parentNode.replaceChild(newRow, row);
}


function startDelete(id) {
    if (confirm('Tem certeza que deseja excluir este voo?')) {
        deleteVoo(id)
            .then(() => loadVoos())
            .catch(error => console.error('Falha ao excluir voo:', error));
    }
}

function resetForm() {
    vooForm.reset();
    vooIdInput.value = '';
}

// Carregar os voos quando a página for carregada
document.addEventListener('DOMContentLoaded', loadVoos);
