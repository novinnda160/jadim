// Função para registrar o usuário
function registerUser(name, cpf, email, password) {
    if (!name || !cpf || !email || !password) {
        alert('Todos os campos são obrigatórios.');
        return;
    }

    // Recuperar usuários do LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Verificar se o email já existe
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert('Usuário já registrado com este email.');
        return;
    }

    // Criar novo usuário
    const newUser = {
        id: Date.now(),
        name,
        cpf,
        email,
        password, // Pode ser adicionada uma hash aqui para maior segurança
    };

    // Adicionar o novo usuário à lista
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Usuário registrado com sucesso!!');
}
