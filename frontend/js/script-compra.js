document.addEventListener('DOMContentLoaded', function () {
    carregarAssentos();
    configurarFormularioPagamento();
});

function carregarAssentos() {
    // Este ID deveria vir da seleção de voo ou da URL
    const idAeronave = new URLSearchParams(window.location.search).get('aeronaveId');

    // Solicitar informações da aeronave e dos assentos reservados
    axios.get(`http://localhost:3000/aeronaves/${idAeronave}`)
        .then(responseAeronave => {
            const { QtdLinhas, QtdColunas } = responseAeronave.data;
            gerarMapaAssentos(QtdLinhas, QtdColunas);
        })
        .catch(error => console.error('Erro ao carregar informações da aeronave:', error));

    axios.get(`http://localhost:3000/reservas/assentos/${idAeronave}`)
        .then(responseReservas => {
            const assentosReservados = responseReservas.data;
            marcarAssentosReservados(assentosReservados);
        })
        .catch(error => console.error('Erro ao carregar assentos reservados:', error));
}

function gerarMapaAssentos(qtdLinhas, qtdColunas) {
    const assentosContainer = document.getElementById('assentos-container');
    assentosContainer.innerHTML = ''; // Limpar mapa de assentos anterior

    for (let i = 0; i < qtdLinhas; i++) {
        const linha = document.createElement('div');
        linha.className = 'linha-assentos';

        for (let j = 0; j < qtdColunas; j++) {
            const assento = document.createElement('div');
            assento.className = 'assento';
            assento.textContent = `${String.fromCharCode(65 + i)}${j + 1}`;
            assento.dataset.assento = `${String.fromCharCode(65 + i)}${j + 1}`;

            assento.addEventListener('click', selecionarAssento);
            linha.appendChild(assento);
        }

        assentosContainer.appendChild(linha);
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
    assento.classList.toggle('selecionado');
}

function configurarFormularioPagamento() {
    const formPagamento = document.getElementById('form-pagamento');
    formPagamento.addEventListener('submit', function (event) {
        event.preventDefault();
        const nomeCompleto = document.getElementById('nome-completo').value;
        const email = document.getElementById('email').value;
        const formaPagamento = document.getElementById('forma-pagamento').value;
        const assentosSelecionados = document.querySelectorAll('.assento.selecionado');

        // Converter NodeList para array de códigos de assento
        const assentos = Array.from(assentosSelecionados).map(assento => assento.dataset.assento);

        // Aqui você precisará enviar a requisição para o back-end para processar a compra
        processarCompra(nomeCompleto, email, formaPagamento, assentos);
    });
}

function processarCompra(nome, email, formaPagamento, assentos) {
    // Aqui você fará uma chamada ao back-end para criar a reserva dos assentos
    // e processar o pagamento. Este é apenas um esqueleto para a lógica.
    console.log('Processando compra', { nome, email, formaPagamento, assentos });

    // Simulação de sucesso na reserva e pagamento
    axios.post('http://localhost:3000/reservas', { nome, email, formaPagamento, assentos })
        .then(response => {
            alert('Sua passagem aérea foi emitida e enviada para seu endereço de email.');
            window.location.href = '/algum-caminho-para-confirmacao';
        })
        .catch(error => {
            alert('Houve um erro ao processar sua compra. Por favor, tente novamente.');
            console.error('Erro ao processar compra:', error);
        });
}
