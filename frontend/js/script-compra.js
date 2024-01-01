let valorAssento = 0;

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
            valorAssento = response.data.VALORASSENTO;

            console.log('response',response)

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
    atualizarTotalCompra();
}


function configurarFormularioPagamento() {
    const formPagamento = document.getElementById('form-pagamento');
    formPagamento.addEventListener('submit', function (event) {
        event.preventDefault();
        // ... (lógica para processar informações de pagamento)
        processarCompra();
    });
}

function atualizarTotalCompra() {
    const assentosSelecionados = document.querySelectorAll('.assento.selecionado').length;
    const totalCompra = assentosSelecionados * valorAssento;
    document.getElementById('total-compra').textContent = `Total: R$ ${totalCompra.toFixed(2)}`;
}

function processarCompra() {
    const nomeCompleto = document.getElementById('nome-completo').value;
    const email = document.getElementById('email').value;
    const vooId = new URLSearchParams(window.location.search).get('vooId');
    const assentosSelecionados = document.querySelectorAll('.assento.selecionado');

    // Converter NodeList para array de IDs de assento
    const assentosIds = Array.from(assentosSelecionados).map(assento => Number(assento.dataset.assentoId));

    axios.post('http://localhost:3000/clientes', { nome: nomeCompleto, email: email })
        .then(responseCliente => {
            let ClienteID = responseCliente.data.CLIENTEID;

            // Verifique se um ClienteID foi retornado
            if (!ClienteID) {
                alert('ClienteID não foi retornado do servidor. Criando novo usuário.');
                return criarNovoCliente(nomeCompleto, email);
            }

            return ClienteID;
        })
        .then(ClienteID => {
            // Fazer um POST para cada assento selecionado
            const reservasPromessas = assentosIds.map(AssentoID => {
                return axios.post('http://localhost:3000/reservas', {
                    VooID: Number(vooId),
                    ClienteID: ClienteID,
                    AssentoID: AssentoID
                });
            });

            // Executar todas as promessas
            return Promise.all(reservasPromessas);
        })
        .then(() => {
            alert('Sua passagem aérea foi emitida e enviada para seu endereço de email.');
            window.location.href = '/frontend/index.html';
        })
        .catch(error => {
            alert('Houve um erro ao processar sua compra. Por favor, tente novamente.');
            console.error('Erro ao processar compra:', error);
        });
}

function criarNovoCliente(nome, email) {
    // Implemente a lógica para criar um novo cliente
    return axios.post('http://localhost:3000/clientes', { nome: nome, email: email })
        .then(response => {
            if (response.data && response.data.CLIENTEID) {
                return response.data.CLIENTEID;
            } else {
                throw new Error('Falha ao criar novo cliente');
            }
        });
}
