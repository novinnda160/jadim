document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error("Credenciais inválidas ou erro no servidor.");
        }

        const data = await response.json();

        // Salva o token JWT e o ID do cliente no localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("clienteId", data.user.id);

        // Redireciona para a página inicial
        window.location.href = "/home";
    } catch (error) {
        alert("Erro ao fazer login: " + error.message);
    }
});
