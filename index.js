const express = require('express');
const session = require('express-session');
const path = require('path');
const homeController = require('./controller/HomeController')
const professorController = require('./controller/ProfessorController')
const ideiaController = require('./controller/IdeiaController')
const conexao = require('./database/conexao');

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(session({ secret: "Um%55kjds", resave: true, saveUninitialized: true }));
app.use(homeController)
app.use(professorController)
app.use(ideiaController)

conexao.authenticate();

app.listen(3000, () =>{
    console.log('Aplicação rodando...')
})
