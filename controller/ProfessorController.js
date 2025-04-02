const express = require('express');
const routerProfessor = express.Router();
const DAOProfessor = require('../database/DAOProfessor');
const DAOIdeia = require('../database/DAOIdeia');
const bcrypt = require('bcryptjs');
const autorizacao = require('../autorizacao/autorizacao');

// Rota para login do professor
routerProfessor.get("/professor/proflogin", (req, res) => {
    if (req.session.professor) {
        return res.redirect("/professor/profArea"); // Se já estiver logado, redireciona para a área do professor
    }
    res.render("professor/proflogin", { mensagem: "" });
});

routerProfessor.post("/professor/proflogin", async (req, res) => {
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
routerProfessor.post("/professor/tratarProblema", autorizacao, async (req, res) => {
    let { idIdeia } = req.body;
    try {
        await DAOIdeia.markAsInProgress(idIdeia, req.session.professor.id);
        res.redirect("/professor/profArea");
    } catch (err) {
        console.error(err);
        res.render("professor/profArea", { mensagem: "Erro ao tratar o problema." });
    }
});

// Rota para carregar a área do professor
routerProfessor.get("/professor/profArea", autorizacao, async (req, res) => {
    try {

        let professor = req.session.professor;
        let ideiasRecomendadas = await DAOIdeia.getByCurso(professor.curso);
        let problemasEmAndamento = await DAOIdeia.getEmAndamentoByProfessor(professor.id);

        // Pega o success da query e transforma em booleano
        const success = req.query.success === '1';
        res.render("professor/profArea", { professor, ideiasRecomendadas, problemasEmAndamento, success});
    } catch (err) {
        console.error(err);
        res.render("professor/profArea", { mensagem: "Erro ao carregar as ideias." });
    }
});

// Rota para detalhes de um problema
routerProfessor.get("/professor/detalheProblema/:id", autorizacao, async (req, res) => {
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

// Rota para listar problemas em aberto
routerProfessor.get("/professor/problemasabertos", autorizacao, async (req, res) => {
    try {
        let problemasAbertos = await DAOIdeia.getPendentes();
        res.render("professor/problemasabertos", { professor: req.session.professor, problemasAbertos });
    } catch (err) {
        console.error(err);
        res.render("professor/problemasabertos", { professor: req.session.professor, mensagem: "Erro ao carregar os problemas em aberto.", problemasAbertos: [] });
    }
});

// Rota para exibir a página de finalização de problemas
routerProfessor.get("/professor/finalizarproblemas/:id", autorizacao, async (req, res) => {
    try {
        let problema = await DAOIdeia.getById(req.params.id);
        if (!problema) {
            return res.render("ideia/finalizarproblemas", { professor: req.session.professor, mensagem: "Problema não encontrado.", problema: null });
        }
        res.render("ideia/finalizarproblemas", { professor: req.session.professor, ideia: problema, mensagem: "" });
    } catch (err) {
        console.error(err);
        res.render("ideia/finalizarproblemas", { professor: req.session.professor, mensagem: "Erro ao carregar os detalhes do problema.", problema: null });
    }
});

// Rota para finalizar um problema
routerProfessor.post("/professor/finalizarproblemas", autorizacao, async (req, res) => {
    let { idIdeia, descricaoFinalizacao } = req.body;
    try {
        await DAOIdeia.finalizarProblemas(idIdeia, descricaoFinalizacao);
        res.redirect("/professor/profArea?success=1");
    } catch (err) {
        console.error(err);
        res.render("professor/profArea", { mensagem: "Erro ao finalizar o problema.", success: false });
    }
});

// Rota para exibir o histórico de problemas finalizados pelo professor logado
routerProfessor.get("/professor/historico", autorizacao, async (req, res) => {
    try {
        let problemasFinalizados = await DAOIdeia.getFinalizadosByProfessor(req.session.professor.id);
        res.render("professor/historico", { professor: req.session.professor, problemasFinalizados });
    } catch (err) {
        console.error(err);
        res.render("professor/historico", { professor: req.session.professor, mensagem: "Erro ao carregar o histórico.", problemasFinalizados: [] });
    }
});

// Rota para listar todos os problemas finalizados
routerProfessor.get("/professor/solucionados", autorizacao, async (req, res) => {
    try {
        let problemasFinalizados = await DAOIdeia.getFinalizados();
        res.render("ideia/solucionados", { professor: req.session.professor, problemasFinalizados });
    } catch (err) {
        console.error(err);
        res.render("professor/solucionados", { professor: req.session.professor, mensagem: "Erro ao carregar os problemas finalizados.", problemasFinalizados: [] });
    }
});

// Rota para exibir a descrição de finalização de um problema
routerProfessor.get("/professor/versolucao/:id", autorizacao, async (req, res) => {
    try {
        const problema = await DAOIdeia.getById(req.params.id);
        if (!problema || problema.status !== 'finalizado') {
            return res.render("ideia/versolucao", { professor: req.session.professor, mensagem: "Problema não encontrado ou não finalizado." });
        }
        res.render("ideia/versolucao", { professor: req.session.professor, problema, descricaoFinalizacao: problema.descricaoFinalizacao });
    } catch (err) {
        console.error(err);
        res.render("ideia/versolucao", { professor: req.session.professor, mensagem: "Erro ao carregar a descrição da solução." });
    }
});
// Rota para logout do professor
routerProfessor.get("/professor/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Erro ao destruir a sessão:", err);
            return res.status(500).send("Erro ao encerrar a sessão.");
        }

        // Impedir que a sessão ainda seja válida em cache
        res.clearCookie("connect.sid"); 
        
        // Define cabeçalhos para evitar cache da página
        res.setHeader('Cache-Control', 'no-store');

        return res.redirect("/professor/proflogin");
    });
});
module.exports = routerProfessor;
