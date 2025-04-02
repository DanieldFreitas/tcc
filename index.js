const express = require('express');
const session = require('express-session');
const path = require('path');
const homeController = require('./controller/HomeController');
const professorController = require('./controller/ProfessorController');
const ideiaController = require('./controller/IdeiaController');
const conexao = require('./database/conexao');

const app = express();

app.use(express.static("public"));

// Middleware para processar JSON e formulários corretamente
app.use(express.json());  // Adicionado para permitir JSON no req.body
app.use(express.urlencoded({ extended: true })); //  Permitir objetos aninhados no req.body

// Configuração da View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configuração de sessão
app.use(session({ secret: "Um%55kjds", 
                  resave: true,     
                  saveUninitialized: true,
                  cookie: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Verifique se está em ambiente seguro
                    maxAge: 1000 * 60 * 60 // A sessão expira após 1 hora
                }
 }));

// Rotas
app.use(homeController);
app.use(professorController);
app.use(ideiaController);

// Conectar ao banco de dados com tratamento de erro
conexao.authenticate()
    .then(() => console.log("Conectado ao banco de dados!"))
    .catch(err => console.error("Erro ao conectar no banco:", err));

    
app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor rodando na porta 3000');
    });
      
