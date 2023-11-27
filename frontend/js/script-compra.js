document.addEventListener('DOMContentLoaded', function () {
    const queryParams = new URLSearchParams(window.location.search);
    const vooId = queryParams.get('vooId');
    if (vooId) {
        carregarAssentos(vooId);
    }
    configurarFormularioPagamento();
});

function carregarAssentos(vooId) {
    axios.get(`http://localhost:3000/voos/${vooId}`)
        .then(response => {
            const aeronaveId = response.data.AERONAVEID;
            return Promise.all([
                axios.get(`http://localhost:3000/aeronaves/${aeronaveId}`),
                axios.get(`http://localhost:3000/assentos/aeronave/${aeronaveId}`)
            ]);
        })
        .then(([responseAeronave, responseAssentos]) => {
            const { QtdLinhas, QtdColunas } = responseAeronave.data;
            const mapaAssentos = criarMapaAssentos(responseAssentos.data);
            gerarMapaAssentos(QtdLinhas, QtdColunas, mapaAssentos);
            return axios.get(`http://localhost:3000/voos/${vooId}/assentosReservados`);
        })
        .then(response => {
            marcarAssentosReservados(response.data);
        })
        .catch(error => console.error('Erro ao carregar assentos:', error));
}

function criarMapaAssentos(assentos) {
    const mapa = {};
    assentos.forEach(assento => {
        mapa[assento.CodigoAssento] = assento.AssentoID;
    });
    return mapa;
}

function gerarMapaAssentos(qtdLinhas, qtdColunas, mapaAssentos) {
    const assentosContainer = document.getElementById('assentos-container');
    assentosContainer.innerHTML = '';

    for (let linha = 1; linha <= qtdLinhas; linha++) {
        const linhaAssentos = document.createElement('div');
        linhaAssentos.className = 'linha-assentos';

        for (let coluna = 1; coluna <= qtdColunas; coluna++) {
            const codigoAssento = String.fromCharCode(64 + linha) + coluna;
            const assento = document.createElement('div');
            assento.className = 'assento';
            assento.dataset.assento = codigoAssento;
            assento.dataset.assentoId = mapaAssentos[codigoAssento];
            assento.addEventListener('click', selecionarAssento);
            linhaAssentos.appendChild(assento);
        }

        assentosContainer.appendChild(linhaAssentos);
    }
}



function marcarAssentosReservados(assentosReservados) {
    assentosReservados.forEach(assentoReservado => {
        const assentoElement = document.querySelector(`[data-assento="${assentoReservado.CodigoAssento}"]`);
        if (assentoElement) {
            assentoElement.classList.add('reservado');
            assentoElement.removeEventListener('click', selecionarAssento);
        }
    });
}


function selecionarAssento(event) {
    const assento = event.target;
    if (!assento.classList.contains('reservado')) {
        assento.classList.toggle('selecionado');
    }
}


function configurarFormularioPagamento() {
    const formPagamento = document.getElementById('form-pagamento');
    formPagamento.addEventListener('submit', function (event) {
        event.preventDefault();
        // ... (lógica para processar informações de pagamento)
        processarCompra();
    });
}

function processarCompra() {
    const nomeCompleto = document.getElementById('nome-completo').value;
    const email = document.getElementById('email').value;
    const vooId = new URLSearchParams(window.location.search).get('vooId');
    const assentosSelecionados = document.querySelectorAll('.assento.selecionado');

    // Converter NodeList para array de códigos de assento
    const assentos = Array.from(assentosSelecionados).map(assento => assento.dataset.assento);
    
    // Primeiro, criar ou obter o ClienteID
    axios.post('http://localhost:3000/clientes', { nome: nomeCompleto, email: email })
        .then(responseCliente => {
            const ClienteID = responseCliente.data.ClienteID;
            console.log(responseCliente);
            console.log(vooId, ClienteID, assentos);

            // Agora, criar a reserva com os assentos selecionados
            return axios.post('http://localhost:3000/reservas', {
                VooID: vooId,
                ClienteID: ClienteID,
                Assentos: assentos
            });
        })
        .then(responseReserva => {
            alert('Sua passagem aérea foi emitida e enviada para seu endereço de email.');
            window.location.href = '/algum-caminho-para-confirmacao';
        })
        .catch(error => {
            alert('Houve um erro ao processar sua compra. Por favor, tente novamente.');
            console.error('Erro ao processar compra:', error);
        });
}

