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
            const { QTDLINHAS, QTDCOLUNAS } = response.data;
            console.log(QTDLINHAS, QTDCOLUNAS);
            gerarMapaAssentos(QTDLINHAS, QTDCOLUNAS);
            return axios.get(`http://localhost:3000/voos/${vooId}/assentosReservados`);
        })
        .then(response => {
            marcarAssentosReservados(response.data);
        })
        .catch(error => console.error('Erro ao carregar assentos:', error));
}

function gerarMapaAssentos(qtdLinhas, qtdColunas) {
    const assentosContainer = document.getElementById('assentos-container');
    assentosContainer.innerHTML = ''; // Limpa o container para novos assentos

    for (let linha = 1; linha <= qtdLinhas; linha++) {
        const linhaAssentos = document.createElement('div');
        linhaAssentos.className = 'linha-assentos';

        for (let coluna = 1; coluna <= qtdColunas; coluna++) {
            const assento = document.createElement('div');
            assento.className = 'assento';
            assento.dataset.assento = String.fromCharCode(64 + linha) + coluna; // Ex: A1, B2, etc.
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
    const formaPagamento = document.getElementById('forma-pagamento').value;
    const assentosSelecionados = document.querySelectorAll('.assento.selecionado');
    const vooId = new URLSearchParams(window.location.search).get('vooId');

    // Converter NodeList para array de códigos de assento
    const assentos = Array.from(assentosSelecionados).map(assento => assento.dataset.assento);

    axios.post('http://localhost:3000/reservas', {
        vooId: vooId,
        nome: nomeCompleto,
        email: email,
        assentos: assentos,
        formaPagamento: formaPagamento
    })
    .then(response => {
        alert('Sua passagem aérea foi emitida e enviada para seu endereço de email.');
        window.location.href = '/algum-caminho-para-confirmacao';
    })
    .catch(error => {
        alert('Houve um erro ao processar sua compra. Por favor, tente novamente.');
        console.error('Erro ao processar compra:', error);
    });
}
