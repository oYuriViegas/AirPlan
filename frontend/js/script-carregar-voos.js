// script-carregar-voos.js

document.addEventListener('DOMContentLoaded', function() {
    // Carregar as cidades quando a página for carregada
    carregarCidades();

    // Configurar o evento de envio do formulário de busca de voos
    const formBuscaVoo = document.getElementById('form-busca-voo');
    formBuscaVoo.addEventListener('submit', function(event) {
        event.preventDefault();
        buscarVoos();
    });

    // Carregar todos os voos inicialmente
    carregarTodosVoos();
});

function carregarCidades() {
    axios.get('http://localhost:3000/cidades')
        .then(response => {
            const cidades = response.data;
            const listaCidadesOrigem = document.getElementById('lista-cidades-origem');
            const listaCidadesDestino = document.getElementById('lista-cidades-destino');

            cidades.forEach(cidade => {
                const optionOrigem = new Option(cidade.Nome, cidade.Nome);
                const optionDestino = new Option(cidade.Nome, cidade.Nome);
                listaCidadesOrigem.appendChild(optionOrigem);
                listaCidadesDestino.appendChild(optionDestino);
            });
        })
        .catch(error => console.error('Erro ao carregar cidades:', error));
}

function carregarTodosVoos() {
    axios.get('http://localhost:3000/voos/detalhes')
        .then(response => {
            const voos = response.data;
            atualizarTabelaVoos(voos);
        })
        .catch(error => console.error('Erro ao carregar voos:', error));
}

function buscarVoos() {
    const origem = document.getElementById('cidade-origem').value;
    const destino = document.getElementById('cidade-destino').value;

    axios.get(`http://localhost:3000/consultaVoos/buscar?origem=${origem}&destino=${destino}`)
        .then(response => {
            const voos = response.data;
            atualizarTabelaVoos(voos);
        })
        .catch(error => console.error('Erro ao buscar voos:', error));
}

function atualizarTabelaVoos(voos) {
    const voosTableBody = document.querySelector('#tabela-voos tbody');
    voosTableBody.innerHTML = '';

    voos.forEach(voo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${voo.CIDADEORIGEM}</td>
            <td>${voo.CIDADEDESTINO}</td>
            <td>${formatarDataHora(voo.DATAHORAPARTIDA)}</td>
            <td>${formatarDataHora(voo.DATAHORACHEGADA)}</td>
            <td>${voo.VALORASSENTO}</td>
        `;

        // Adicionando evento de clique na linha
        row.addEventListener('click', () => {
            window.location.href = `compra.html?vooId=${voo.VOOID}`;
        });

        voosTableBody.appendChild(row);
    });
}



function formatarDataHora(dataHora) {
    const data = new Date(dataHora);
    return data.toLocaleString();
}

