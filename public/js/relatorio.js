// Função para listar os usuários armazenados no localStorage
function listarUsuarios() {
    const userTable = document.getElementById("user-list");
    userTable.innerHTML = "";  // Limpa a tabela antes de popular

    // Obtém os usuários armazenados no localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Adiciona os dados na tabela
    users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editarUsuario(${user.id})">Editar</button>
                <button onclick="excluirUsuario(${user.id})">Excluir</button>
            </td>
        `;

        userTable.appendChild(row);
    });
}

// Função para excluir um usuário
function excluirUsuario(id) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Filtra o usuário a ser excluído
    const updatedUsers = users.filter(user => user.id !== id);

    // Atualiza o localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Atualiza a lista na página
    listarUsuarios();
}

// Função para editar um usuário (simulação, você pode adicionar um formulário de edição)
function editarUsuario(id) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.id === id);

    if (user) {
        alert(`Editar usuário: ${user.name} (email: ${user.email})`);
    }
}

// Inicializa a listagem de usuários ao carregar a página
document.addEventListener('DOMContentLoaded', listarUsuarios);
