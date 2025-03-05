const express = require('express');
const routerIdeia = express.Router();
const DAOIdeia = require('../database/DAOIdeia');

// Rota para exibir o formulário de cadastro de ideias
routerIdeia.get("/ideia/cadastroideia", (req, res) => {
    res.render("ideia/cadastroideia", { mensagem: "" });
});

// Rota para salvar uma nova ideia
routerIdeia.post("/ideia/cadastrar", (req, res) => {
    let { titulo, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade } = req.body
    DAOIdeia.insert(titulo, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade)
    .then(inserido => {
        if (inserido) {
            res.render("ideia/cadastrar", { mensagem: "Ideia cadastrada com sucesso!" });
        } else {
            res.render("ideia/cadastroideia", { mensagem: "Não foi possível cadastrar a ideia." });
        }
    }).catch(err => {
        console.error("Erro no cadastro:", err);
        res.render("ideia/cadastroideia", { mensagem: "Erro no cadastro da ideia." });
    });
});

module.exports = routerIdeia;
