document.addEventListener('DOMContentLoaded', function () {
    const queryParams = new URLSearchParams(window.location.search);
    const vooId = queryParams.get('vooId');
    if (vooId) {
        carregarAssentos(vooId);
    }
    configurarFormularioPagamento();
});

function carregarAssentos(vooId) {
    const baseUrl = "http://localhost:3000";

    axios.get(`${baseUrl}/voos/${vooId}`)
        .then(async(response) => {
            const aeronaveId = response.data.AERONAVEID;
            console.log(vooId)

            const [assentosResponse, aeronaveResponse, assentosReservadosResponse] = await Promise.all([
                axios.get(`${baseUrl}/assentos/aeronave/${aeronaveId}`),
                axios.get(`${baseUrl}/aeronaves/${aeronaveId}`),
                axios.get(`${baseUrl}/assentos/aeronave/${vooId}/assentosReservados`)
            ]);

            const { QTDLINHAS, QTDCOLUNAS } = aeronaveResponse.data;
            gerarMapaAssentos(QTDLINHAS, QTDCOLUNAS, assentosResponse.data);
            marcarAssentosReservados(assentosReservadosResponse.data);
            console.log(assentosReservadosResponse)
        })
        .catch(error => console.error('Erro ao carregar assentos:', error));
}


function gerarMapaAssentos(qtdLinhas, qtdColunas, assentos) {
    console.log("Quantidade de Linhas:", qtdLinhas, "Quantidade de Colunas:", qtdColunas);
    console.log("Dados dos Assentos:", assentos);

    const assentosContainer = document.getElementById('assentos-container');
    assentosContainer.innerHTML = '';

    for (let linha = 1; linha <= qtdLinhas; linha++) {
        const linhaAssentos = document.createElement('div');
        linhaAssentos.className = 'linha-assentos';

        for (let coluna = 1; coluna <= qtdColunas; coluna++) {
            const codigoAssento = String.fromCharCode(64 + linha) + coluna;
            const assentoData = assentos.find(a => a.CODIGOASSENTO === codigoAssento);

            if (assentoData) {
                const assento = document.createElement('div');
                assento.className = 'assento';
                assento.textContent = codigoAssento;
                assento.dataset.assento = codigoAssento;
                assento.dataset.assentoId = assentoData.ASSENTOID;

                assento.addEventListener('click', selecionarAssento);

                linhaAssentos.appendChild(assento);
            }
        }

        if (linhaAssentos.hasChildNodes()) {
            assentosContainer.appendChild(linhaAssentos);
        }
    }
}



function marcarAssentosReservados(assentosReservados) {
    assentosReservados.forEach(assentoReservado => {
        const assentoElement = document.querySelector(`[data-assento="${assentoReservado.CODIGOASSENTO}"]`);
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
    console.log(assentosSelecionados.keys);
    
    // Converter NodeList para array de códigos de assento
    const assentos = Array.from(assentosSelecionados).map(assento => assento.dataset.assento);
    console.log(assentos);
    // Primeiro, criar ou obter o ClienteID
    axios.post('http://localhost:3000/clientes', { nome: nomeCompleto, email: email })
        .then(responseCliente => {
            const ClienteID = responseCliente.data.ClienteID;
            console.log('responseCliente.data',responseCliente.data);
            console.log('vooId, ClienteID, assentos',vooId, ClienteID, assentos);

            // Agora, criar a reserva com os assentos selecionados
            return axios.post('http://localhost:3000/reservas', {
                VooID: Number(vooId),
                ClienteID: Number(ClienteID),
                AssentosID: assentos
            });
        })
        .then(() => {
            alert('Sua passagem aérea foi emitida e enviada para seu endereço de email.');
            window.location.href = '/algum-caminho-para-confirmacao';
        })
        .catch(error => {
            alert('Houve um erro ao processar sua compra. Por favor, tente novamente.');
            console.error('Erro ao processar compra:', error);
        });
}

