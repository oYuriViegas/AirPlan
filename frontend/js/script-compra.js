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
            return axios.get(`http://localhost:3000/aeronaves/${aeronaveId}`);
        })
        .then(response => {
            console.log(response);
            const { AERONAVEID, QTDLINHAS, QTDCOLUNAS } = response.data;
            gerarMapaAssentos(AERONAVEID);
            return axios.get(`http://localhost:3000/voos/${vooId}/assentosReservados`);
        })
        .then(response => {
            marcarAssentosReservados(response.data);
        })
        .catch(error => console.error('Erro ao carregar assentos:', error));
}

function gerarMapaAssentos(aeronaveId) {
    // Primeiro, buscar todos os assentos da aeronave especificada
    console.log(aeronaveId);
    axios.get(`http://localhost:3000/assentos/aeronave/${aeronaveId}`)
        .then(response => {
            const assentosAeronave = response.data;
            desenharMapaAssentos(assentosAeronave);
        })
        .catch(error => {
            console.error('Erro ao carregar assentos da aeronave:', error);
        });
}

function desenharMapaAssentos(assentosAeronave) {
    const assentosContainer = document.getElementById('assentos-container');
    assentosContainer.innerHTML = ''; // Limpa o container para novos assentos

    assentosAeronave.forEach(assento => {
        const linha = assento.Linha;
        const coluna = assento.Coluna;
        const codigoAssento = assento.CodigoAssento;
        const assentoId = assento.AssentoID;

        let linhaAssentos = document.querySelector(`.linha-assentos[data-linha='${linha}']`);
        if (!linhaAssentos) {
            linhaAssentos = document.createElement('div');
            linhaAssentos.className = 'linha-assentos';
            linhaAssentos.dataset.linha = linha;
            assentosContainer.appendChild(linhaAssentos);
        }

        const assentoElement = document.createElement('div');
        assentoElement.className = 'assento';
        assentoElement.textContent = codigoAssento; // Opcional: Mostrar o código do assento
        assentoElement.dataset.assento = codigoAssento;
        assentoElement.dataset.assentoId = assentoId;

        assentoElement.addEventListener('click', selecionarAssento);
        linhaAssentos.appendChild(assentoElement);
    });
}


function buscarAssentoId(aeronaveId, codigoAssento, callback) {
    axios.get(`http://localhost:3000/assentos/${aeronaveId}/${codigoAssento}`)
        .then(response => {
            if (response.data && response.data.AssentoID) {
                callback(response.data.AssentoID);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar ID do assento:', error);
        });
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
            const ClienteID = responseCliente.data.CLIENTEID;
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

