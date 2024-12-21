// Função para fazer login do usuário
function loginUser(email, password) {
    if (!email || !password) {
        alert('Email e senha são obrigatórios.');
        return;
    }

    // Recuperar usuários do LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Encontrar o usuário pelo email
    const user = users.find(user => user.email === email);

    if (!user) {
        alert('Usuário não encontrado.');
        return;
    }

    // Verificar a senha
    if (user.password !== password) {
        alert('Senha incorreta.');
        return;
    }

    // Autenticação bem-sucedida
    alert('Login realizado com sucesso Aperte em OK e Aproveite!');
    localStorage.setItem('loggedInUser', JSON.stringify(user)); // Salva o usuário logado
    window.location.href = 'home.html'; // Redireciona para a página inicial
}
