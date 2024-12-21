// Função que carrega o progresso do cliente
function carregarProgresso() {
    const clienteId = 1; // Aqui você pode pegar o ID do cliente dinamicamente
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(c => c.id === clienteId);
    const bolinhasContainer = document.getElementById('bolinhas');
    bolinhasContainer.innerHTML = '';
  
    if (cliente) {
      for (let i = 0; i < 10; i++) {
        const bolinha = document.createElement('div');
        bolinha.classList.add('bolinha');
        if (i < cliente.bolinhas) {
          bolinha.classList.add('preenchida');
        }
        bolinhasContainer.appendChild(bolinha);
      }
    }
  }
  
  // Long polling para buscar atualizações em tempo real
  function longPoll() {
    fetch('/longpoll/1') // Usando um ID fixo para este exemplo
      .then(response => response.json())
      .then(data => {
        carregarProgresso();
        longPoll(); // Reinicia o polling
      })
      .catch(error => {
        console.error(error);
        setTimeout(longPoll, 5000); // Tenta novamente após 5 segundos
      });
  }
  
  // Inicia o long polling
  longPoll();
  
  // Carrega o progresso inicial
  carregarProgresso();
  