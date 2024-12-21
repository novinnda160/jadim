document.addEventListener("DOMContentLoaded", async () => {
    const listaClientes = document.getElementById("lista-clientes");
  
    const fetchClientes = async () => {
      const res = await fetch("/api/clientes");
      return await res.json();
    };
  
    const renderClientes = (clientes) => {
      listaClientes.innerHTML = "";
      clientes.forEach((cliente) => {
        const clienteDiv = document.createElement("div");
        clienteDiv.innerHTML = `
          <h3>${cliente.nome}</h3>
          <div class="bolinhas">
            ${Array(10)
              .fill(0)
              .map(
                (_, i) =>
                  `<div class="bolinha ${
                    i < cliente.pontos ? "preenchida" : ""
                  }" data-id="${cliente.id}" data-index="${i}"></div>`
              )
              .join("")}
          </div>
        `;
        listaClientes.appendChild(clienteDiv);
      });
  
      document.querySelectorAll(".bolinha").forEach((bolinha) =>
        bolinha.addEventListener("click", async (e) => {
          const id = parseInt(e.target.getAttribute("data-id"));
          const index = parseInt(e.target.getAttribute("data-index")) + 1;
          await fetch("/api/atualizar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, pontos: index }),
          });
          renderClientes(await fetchClientes());
        })
      );
    };
  
    renderClientes(await fetchClientes());
  });
  