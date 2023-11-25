// Importar a função para obter assentos disponíveis do seu servidor Node( acho que esta errado testa ai yuri)
import { getAssentosDisponiveis } from './api-assentos.js';

document.addEventListener('DOMContentLoaded', function () {
  const mapaAssentos = document.getElementById('mapa-assentos');

  // Obter assentos disponíveis do servidor(isso aqui tb)
  getAssentosDisponiveis()
    .then(assentos => {
      // Adicionar assentos disponíveis ao mapa(esses esta funcionando)
      assentos.forEach(assento => {
        const assentoElement = document.createElement('div');
        assentoElement.classList.add('assento', 'disponivel');
        assentoElement.textContent = assento.CodigoAssento;

        // Adicionar evento de clique para selecionar o assento
        assentoElement.addEventListener('click', function () {
          alert(`Você selecionou o assento ${assento.CodigoAssento}`);
        });

        mapaAssentos.appendChild(assentoElement);
      });
    })
    .catch(error => console.error('Erro ao obter assentos disponíveis:', error));
});
