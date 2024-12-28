// Função para hash de senha (exemplo simples)
function hashPassword(password) {
    return btoa(password);  // Usando Base64 para fins ilustrativos (não seguro para produção)
}

// Função para registrar o usuário
function registerUser(name, cpf, email, password) {
    if (!name || !cpf || !email || !password) {
        alert('Todos os campos são obrigatórios.');
        return;
    }

    // Validação de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }

    // Validação de CPF (exemplo simples)
    const cpfRegex = /^\d{11}$/;
    if (!cpfRegex.test(cpf)) {
        alert('Por favor, insira um CPF válido.');
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

    // Criar novo usuário com senha hashada
    const newUser = {
        id: Date.now(),
        name,
        cpf,
        email,
        password: hashPassword(password), // Armazenar senha com hash
    };

    // Adicionar o novo usuário à lista
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Usuário registrado com sucesso!');
    // Opcional: redirecionar para a página de login
    window.location.href = '/login';
}
