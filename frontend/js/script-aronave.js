import { getAeronaves, createAeronave, updateAeronave, deleteAeronave } from './api-aeronave.js';

const aeronaveForm = document.getElementById('aeronaveForm');
const modeloInput = document.getElementById('modeloAeronave');
const numeroIdentificacaoInput = document.getElementById('numeroIdentificacao');
const fabricanteInput = document.getElementById('fabricanteAeronave');
const anoFabricacaoInput = document.getElementById('anoFabricacao');
const qtdLinhasInput = document.getElementById('qtdLinhas');
const qtdColunasInput = document.getElementById('qtdColunas');
const aeronaveIdInput = document.getElementById('aeronaveId');
const aeronavesTableBody = document.getElementById('aeronavesTable').querySelector('tbody');

// Carregar aeronaves e exibir na tabela
function loadAeronaves() {
    getAeronaves()
        .then(response => {
            aeronavesTableBody.innerHTML = '';
            response.data.forEach(aeronave => {
                const row = createAeronaveRow(aeronave);
                aeronavesTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Falha ao carregar aeronaves:', error));
}

// Criar uma linha na tabela para cada aeronave
function createAeronaveRow(aeronave) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${aeronave.AeronaveID}</td>
        <td>${aeronave.Modelo}</td>
        <td>${aeronave.NumeroIdentificacao}</td>
        <td>${aeronave.Fabricante}</td>
        <td>${aeronave.AnoFabricacao}</td>
        <td>${aeronave.QtdLinhas} x ${aeronave.QtdColunas}</td>
        <td>
            <button class="edit-btn" onclick="startEditAeronave(${aeronave.AeronaveID})">Editar</button>
            <button class="delete-btn" onclick="startDeleteAeronave(${aeronave.AeronaveID})">Excluir</button>
        </td>
    `;
    return row;
}

// Manipular o envio do formulário
aeronaveForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const aeronaveData = {
        modelo: modeloInput.value,
        numeroIdentificacao: numeroIdentificacaoInput.value,
        fabricante: fabricanteInput.value,
        anoFabricacao: anoFabricacaoInput.value,
        qtdLinhas: qtdLinhasInput.value,
        qtdColunas: qtdColunasInput.value
    };

    const aeronaveId = aeronaveIdInput.value;
    if (aeronaveId) {
        updateAeronave(aeronaveId, aeronaveData)
            .then(() => {
                loadAeronaves();
                resetForm();
            })
            .catch(error => console.error('Falha ao atualizar aeronave:', error));
    } else {
        createAeronave(aeronaveData)
            .then(() => {
                loadAeronaves();
                resetForm();
            })
            .catch(error => console.error('Falha ao criar aeronave:', error));
    }
});

// Iniciar a edição de uma aeronave
function startEditAeronave(id) {
    // Aqui você buscaria as informações da aeronave pelo ID
    // e preencheria o formulário para edição
}

// Iniciar a exclusão de uma aeronave
function startDeleteAeronave(id) {
    if (confirm('Tem certeza que deseja excluir esta aeronave?')) {
        deleteAeronave(id)
            .then(() => loadAeronaves())
            .catch(error => console.error('Falha ao excluir aeronave:', error));
    }
}

// Resetar o formulário
function resetForm() {
    aeronaveForm.reset();
    aeronaveIdInput.value = '';
}

// Carregar aeronaves quando a página é carregada
document.addEventListener('DOMContentLoaded', loadAeronaves);
