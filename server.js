import express from "express";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3000;

// Mock inicial para armazenar clientes e usuários (simulando um banco de dados)
const users = [];
let clientes = [
  {
    id: 1,
    nome: "João",
    cpf: "123456789",
    rg: "MG123456",
    idade: 30,
    temFilhos: true,
    temAcompanhantes: false,
    endereco: "Rua 1",
    telefone: "123456789",
    localEmbarque: "Terminal A",
    localDestino: "Cidade B",
    dataHoraViagem: "2024-12-15 10:00",
    valorViagem: 150,
  },
  {
    id: 2,
    nome: "Maria",
    cpf: "987654321",
    rg: "MG987654",
    idade: 25,
    temFilhos: false,
    temAcompanhantes: true,
    endereco: "Rua 2",
    telefone: "987654321",
    localEmbarque: "Terminal B",
    localDestino: "Cidade C",
    dataHoraViagem: "2024-12-16 12:00",
    valorViagem: 200,
  },
];

let clientesAtualizados = {};

// Middleware para parsear JSON no corpo das requisições e servir arquivos estáticos
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

// --------------------------------------------------------------------
// RENDERIZAÇÃO DAS PÁGINAS
// --------------------------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "register.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "home.html"));
});

// --------------------------------------------------------------------
// FUNCIONALIDADES DE USUÁRIOS
// --------------------------------------------------------------------
app.get("/users", (req, res) => res.json(users));

app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(200).json({ message: "Usuário excluído com sucesso!" });
  } else {
    res.status(404).json({ message: "Usuário não encontrado." });
  }
});

app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, cpf } = req.body;

  const user = users.find((user) => user.id === userId);

  if (user) {
    Object.assign(user, { name, email, cpf });
    res.status(200).json({ message: "Usuário atualizado com sucesso!", user });
  } else {
    res.status(404).json({ message: "Usuário não encontrado." });
  }
});

app.post("/register", async (req, res) => {
  const { name, cpf, email, password } = req.body;

  if (!name || !cpf || !email || !password) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Usuário já registrado." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    name,
    cpf,
    email,
    password: hashedPassword,
    viagens: 0,
  };

  users.push(newUser);
  res.status(201).json({ message: "Usuário registrado com sucesso!", user: newUser });
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Senha incorreta." });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, "YOUR_SECRET_KEY", { expiresIn: "1h" });

  res.status(200).json({
    message: "Login bem-sucedido!",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// --------------------------------------------------------------------
// FUNCIONALIDADES DE CLIENTES
// --------------------------------------------------------------------
app.get("/api/clientes", (req, res) => res.json(clientes));

app.post("/api/clientes", (req, res) => {
  const newCliente = { id: clientes.length + 1, ...req.body };
  clientes.push(newCliente);
  res.status(201).json(newCliente);
});

app.put("/api/clientes/:id", (req, res) => {
  const clienteId = parseInt(req.params.id);
  const cliente = clientes.find((c) => c.id === clienteId);

  if (cliente) {
    Object.assign(cliente, req.body);
    res.json(cliente);
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
});

app.delete("/api/clientes/:id", (req, res) => {
  const clienteId = parseInt(req.params.id);
  clientes = clientes.filter((c) => c.id !== clienteId);
  res.status(200).json({ message: "Cliente removido com sucesso!" });
});

app.get("/longpoll/:id", (req, res) => {
  const clienteId = parseInt(req.params.id);
  let done = false;

  const interval = setInterval(() => {
    const updates = clientesAtualizados[clienteId];
    if (updates) {
      res.json(updates);
      delete clientesAtualizados[clienteId];
      clearInterval(interval);
      done = true;
    }
  }, 1000);

  setTimeout(() => {
    if (!done) {
      res.json({});
      clearInterval(interval);
    }
  }, 30000);
});

app.post("/sendClientData", (req, res) => {
  const clienteData = req.body;

  if (!clienteData.name || !clienteData.cpf || !clienteData.email) {
    return res.status(400).json({ error: "Os campos nome, CPF e email são obrigatórios." });
  }

  const novoCliente = {
    id: clientes.length + 1,
    ...clienteData,
  };

  clientes.push(novoCliente);

  res.status(201).json({ message: "Cliente adicionado com sucesso!", cliente: novoCliente });
});

// Configurar o endpoint de long polling
app.get('/api/cliente/:id', (req, res) => {
  const clienteId = parseInt(req.params.id, 10);
  const cliente = clientes.find(c => c.id === clienteId);

  if (!cliente) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }

  // Adiciona a requisição do cliente à lista de long polling
  clientRequests.push(res);

  // Quando os dados do cliente mudam, notificamos todos os clientes que estão aguardando
  const sendUpdates = () => {
    const updatedCliente = clientes.find(c => c.id === clienteId);
    if (updatedCliente) {
      clientRequests.forEach(clientRes => {
        clientRes.json(updatedCliente); // Envia os dados atualizados
        clientRes.end();
      });
      clientRequests = []; // Limpa a lista de requisições
    }
  };

  // Simula uma atualização dos dados (pode ser acionado por alguma outra lógica do sistema)
  setTimeout(() => {
    clientes[0].nome = 'Carlos';  // Exemplo de atualização do nome
    sendUpdates();  // Envia a atualização para o cliente
  }, 5000);  // Atualiza os dados após 5 segundos
});

// Rota para editar os dados do cliente (simulando mudança de dados)
app.post('/api/editar-cliente', express.json(), (req, res) => {
  const { id, nome, cpf, rg, idade, whatsapp, endereco, acompanhantes, criancas, localEmbarque, localDesembarque, horaData, valorViagem } = req.body;
  const cliente = clientes.find(c => c.id === id);

  if (cliente) {
    // Atualiza os dados do cliente
    cliente.nome = nome;
    cliente.cpf = cpf;
    cliente.rg = rg;
    cliente.idade = idade;
    cliente.whatsapp = whatsapp;
    cliente.endereco = endereco;
    cliente.acompanhantes = acompanhantes;
    cliente.criancas = criancas;
    cliente.localEmbarque = localEmbarque;
    cliente.localDesembarque = localDesembarque;
    cliente.horaData = horaData;
    cliente.valorViagem = valorViagem;

    res.status(200).json({ message: 'Dados do cliente atualizados com sucesso' });
  } else {
    res.status(404).json({ message: 'Cliente não encontrado' });
  }
});

// INICIALIZA O SERVIDOR
// --------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
