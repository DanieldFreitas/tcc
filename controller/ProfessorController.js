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
        if (professor && bcrypt.compareSync(senha, professor.senha)) {
            req.session.professor = { id: professor.id, nome: professor.nome, email: professor.email, curso: professor.curso };
            let ideiasRecomendadas = await DAOIdeia.getByCurso(professor.curso);
            let problemasEmAndamento = await DAOIdeia.getEmAndamentoByProfessor(professor.id);
            res.render("professor/profArea", { professor, ideiasRecomendadas, problemasEmAndamento });
        } else {
            res.render("professor/proflogin", { mensagem: "Usuário ou senha inválidos." });
        }
    } catch (err) {
        console.error(err);
        res.render("professor/proflogin", { mensagem: "Erro ao autenticar." });
    }
});

// Rota para tratar um problema
routerProfessor.post("/professor/tratarProblema", async (req, res) => {
    let { idIdeia } = req.body;
    if (!req.session.professor) return res.redirect("/professor/proflogin");
    try {
        await DAOIdeia.markAsInProgress(idIdeia, req.session.professor.id);
        res.redirect("/professor/profArea");
    } catch (err) {
        console.error(err);
        res.render("professor/profArea", { mensagem: "Erro ao tratar o problema." });
    }
});

// Rota para carregar a área do professor
routerProfessor.get("/professor/profArea", async (req, res) => {
    if (!req.session.professor) return res.redirect("/professor/proflogin");
    try {
        let professor = req.session.professor;
        let ideiasRecomendadas = await DAOIdeia.getByCurso(professor.curso);
        let problemasEmAndamento = await DAOIdeia.getEmAndamentoByProfessor(professor.id);
        res.render("professor/profArea", { professor, ideiasRecomendadas, problemasEmAndamento });
    } catch (err) {
        console.error(err);
        res.render("professor/profArea", { mensagem: "Erro ao carregar as ideias." });
    }
});

// Rota para detalhes de um problema
routerProfessor.get("/professor/detalheProblema/:id", async (req, res) => {
    if (!req.session.professor) return res.redirect("/professor/profArea");
    try {
        let problema = await DAOIdeia.getById(req.params.id);
        if (!problema) {
            return res.render("ideia/detalheproblema", { professor: req.session.professor, mensagem: "Problema não encontrado.", problema: null });
        }
        res.render("ideia/detalheproblema", { professor: req.session.professor, problema, mensagem: "" });
    } catch (err) {
        console.error(err);
        res.render("ideia/detalheproblema", { professor: req.session.professor, mensagem: "Erro ao carregar os detalhes do problema.", problema: null });
    }
});

// Nova rota para listar problemas em aberto
routerProfessor.get("/professor/problemasabertos", async (req, res) => {
    if (!req.session.professor) return res.redirect("/professor/proflogin");
    try {
        // Buscar as ideias com status 'pendente' e sem professor atribuído
        let problemasAbertos = await DAOIdeia.getAll({
            where: { status: 'pendente', professorId: null }
        });
        res.render("professor/problemasabertos", { professor: req.session.professor, problemasAbertos });
    } catch (err) {
        console.error(err);
        res.render("professor/problemasabertos", { professor: req.session.professor, mensagem: "Erro ao carregar os problemas em aberto.", problemasAbertos: [] });
    }
});
// Rota para logout do professor
routerProfessor.get("/professor/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send("Erro ao encerrar a sessão.");
        res.redirect("/professor/proflogin");
    });
});

module.exports = routerProfessor;
