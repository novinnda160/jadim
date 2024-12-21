const API_URL = "http://localhost:3000/api/clientes";

function loadClientes() {
  fetch(API_URL)
    .then(response => response.json())
    .then(clientes => {
      const tbody = document.getElementById("clientes-list");
      tbody.innerHTML = ""; // Limpa a lista
      clientes.forEach(cliente => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${cliente.id}</td>
          <td>${cliente.nome}</td>
          <td>${cliente.cpf}</td>
          <td>${cliente.localDestino}</td>
          <td>
            <button onclick="editCliente(${cliente.id})">Editar</button>
            <button onclick="deleteCliente(${cliente.id})">Remover</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Erro ao carregar clientes:", err));
}

function deleteCliente(id) {
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(response => {
      if (response.ok) {
        alert("Cliente removido com sucesso!");
        loadClientes();
      } else {
        alert("Erro ao remover cliente!");
      }
    });
}

function editCliente(id) {
  const novoNome = prompt("Digite o novo nome:");
  if (novoNome) {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novoNome }),
    })
      .then(response => response.json())
      .then(cliente => {
        alert("Cliente atualizado!");
        loadClientes();
      });
  }
}

document.getElementById("refresh").addEventListener("click", loadClientes);

// Carregar lista de clientes ao abrir
loadClientes();
