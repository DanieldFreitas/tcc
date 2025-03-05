const express = require('express');
const routerProfessor = express.Router();
const DAOProfessor = require('../database/DAOProfessor');
const DAOIdeia = require('../database/DAOIdeia');
const bcrypt = require('bcryptjs');

// Rota para login do professor
routerProfessor.get("/professor/proflogin", (req, res) => {
    res.render("professor/proflogin", { mensagem: "" });
});

routerProfessor.post("/professor/proflogin", async function (req, res) {
    let { email, senha } = req.body;

    try {
        let professor = await DAOProfessor.login(email, senha);

        if (professor) {
            if (bcrypt.compareSync(senha, professor.senha)) {
                // Armazena as informações do professor na sessão
                req.session.professor = { 
                    id: professor.id, 
                    nome: professor.nome, 
                    email: professor.email, 
                    curso: professor.curso 
                };

                // Buscar ideias recomendadas para o professor baseado no curso
                let ideiasRecomendadas = await DAOIdeia.getByCurso(professor.curso);

                // Buscar as ideias "em andamento" (tratando) para o professor
                let problemasEmAndamento = await DAOIdeia.getEmAndamentoByProfessor(professor.id);

                // Garantir que problemasEmAndamento seja um array vazio se não houver ideias
                if (!problemasEmAndamento || problemasEmAndamento.length === 0) {
                    problemasEmAndamento = [];
                }

                res.render("professor/profArea", { 
                    professor: professor, 
                    ideiasRecomendadas: ideiasRecomendadas,
                    problemasEmAndamento: problemasEmAndamento // Passando as ideias em andamento
                });
            } else {
                res.render("professor/proflogin", { mensagem: "Usuário ou senha inválidos." });
            }
        } else {
            res.render("professor/proflogin", { mensagem: "Usuário ou senha inválidos." });
        }
    } catch (err) {
        console.error(err);
        res.render("professor/proflogin", { mensagem: "Erro ao autenticar, tente novamente" });
    }
});

// Rota para marcar a ideia como "em andamento" (tratando)
routerProfessor.post("/professor/tratarProblema", async (req, res) => {
    let { idIdeia } = req.body;

    try {
        // Marcar a ideia como em andamento
        const resultado = await DAOIdeia.markAsInProgress(idIdeia);

        if (resultado) {
            res.redirect("/professor/profArea");  // Redireciona para a área do professor
        } else {
            res.render("professor/profArea", { mensagem: "Erro ao tratar o problema." });
        }
    } catch (err) {
        console.error(err);
        res.render("professor/profArea", { mensagem: "Erro ao tratar o problema." });
    }
});

// Rota para exibir a área do professor com suas ideias pendentes e em andamento
routerProfessor.get("/professor/profArea", async (req, res) => {
    // Verifica se o professor está logado
    if (!req.session.professor) {
        return res.redirect("/professor/proflogin");
    }

    let professor = req.session.professor;
    
    try {
        // Buscar ideias recomendadas para o professor baseado no curso
        let ideiasRecomendadas = await DAOIdeia.getByCurso(professor.curso);

        // Buscar as ideias em andamento para o professor
        let problemasEmAndamento = await DAOIdeia.getEmAndamentoByProfessor(professor.id);

        // Garantir que problemasEmAndamento seja um array vazio se não houver ideias
        if (!problemasEmAndamento || problemasEmAndamento.length === 0) {
            problemasEmAndamento = [];
        }

        res.render("professor/profArea", {
            professor: professor,
            ideiasRecomendadas: ideiasRecomendadas,
            problemasEmAndamento: problemasEmAndamento // Passando as ideias em andamento
        });
    } catch (err) {
        console.error(err);
        res.render("professor/profArea", { mensagem: "Erro ao carregar as ideias." });
    }
});

// Rota para fazer logout do professor
routerProfessor.get("/professor/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Erro ao encerrar a sessão.");
        }
        res.redirect("/professor/proflogin");
    });
});

module.exports = routerProfessor;
