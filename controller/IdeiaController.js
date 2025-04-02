const express = require('express');
const routerIdeia = express.Router();
const DAOIdeia = require('../database/DAOIdeia');
const autorizacao = require('../autorizacao/autorizacao')

// Rota para exibir o formulário de cadastro de ideias
routerIdeia.get("/ideia/cadastroideia", (req, res) => {
    res.render("ideia/cadastroideia", { mensagem: "" });
});

// Rota para salvar uma nova ideia
routerIdeia.post("/ideia/cadastrar", (req, res) => {
    let { titulo, detalhes, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade } = req.body;
    DAOIdeia.insert(titulo, detalhes, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade)
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

// Rota para editar uma ideia
routerIdeia.get("/ideia/editarproblema/:id", autorizacao, (req, res) => {
    const { id } = req.params;
    DAOIdeia.getById(id).then(ideia => {
        if (ideia) {
            res.render("ideia/editarproblema", { ideia, professor: req.session.professor });
        } else {
            res.render("ideia/editarproblema", { mensagem: "Ideia não encontrada.", ideia: null });
        }
    }).catch(err => {
        console.error("Erro ao buscar ideia para edição:", err);
        res.send("Erro ao buscar ideia");
    });
});

// Rota para atualizar uma ideia
routerIdeia.post("/ideia/atualizar/:id", autorizacao, (req, res) => {
    if (!req.session.professor) return res.redirect("/professor/proflogin");
    const { id } = req.params;
    const { titulo, detalhes, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade } = req.body;

    DAOIdeia.update(id, titulo, detalhes, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade)
        .then(ideiaAtualizada => {
            if (ideiaAtualizada) {
                res.redirect(`/professor/detalheproblema/${id}`);
            } else {
                res.render("ideia/editarproblema", { mensagem: "Não foi possível atualizar a ideia." });
            }
        }).catch(err => {
            console.error("Erro ao atualizar ideia:", err);
            res.render("ideia/editarproblema", { mensagem: "Erro ao atualizar ideia." });
        });
});

// Rota para excluir uma ideia
routerIdeia.post("/ideia/excluir/:id", autorizacao, (req, res) => {
    const { id } = req.params;
    DAOIdeia.delete(id).then(excluido => {
        if (excluido) {
            res.redirect("/professor/profArea");
        } else {
            res.send("Não foi possível excluir a ideia.");
        }
    }).catch(err => {
        console.error("Erro ao excluir ideia:", err);
        res.render("professor/profArea", { mensagem: "Erro ao excluir a ideia.", problemasEmAndamento: [] });
    });
});

// Rota para finalizar um projeto
routerIdeia.post("/ideia/finalizarproblemas/:id", autorizacao, async (req, res) => {
    if (!req.session.professor) return res.redirect("/professor/proflogin"); // Verifica se o professor está logado
    const { id } = req.params;
    const { descricaoFinalizacao } = req.body;
    
    try {
        const sucesso = await DAOIdeia.finalizarProblemas(id, descricaoFinalizacao);
        if (sucesso) {
            res.redirect("/professor/profArea?success=1"); // Redireciona para a área do professor após finalizar
        } else {
            res.render("professor/finalizarProjeto", { mensagem: "Não foi possível finalizar o projeto." });
        }
    } catch (err) {
        console.error("Erro ao finalizar o projeto:", err);
        res.render("ideia/finalizarproblemas", { mensagem: "Erro ao finalizar o problema." });
    }
});
// Rota para detalhes de um problema
routerIdeia.get("/ideia/detalheproblema/:id", async (req, res) => {
    const { id } = req.params;
    try {
        let problema = await DAOIdeia.getById(id); // Recupera a ideia pelo ID

        if (!problema) {
            return res.render("ideia/detalheproblema", { mensagem: "Problema não encontrado.", problema: null });
        }

        // Exibe os detalhes do problema, incluindo a descrição de finalização, se houver
        res.render("ideia/detalheproblema", { problema, mensagem: "", descricaoFinalizacao: problema.descricaoFinalizacao || "Não foi fornecida descrição de finalização ainda." });

    } catch (err) {
        console.error(err);
        res.render("ideia/detalheproblema", { mensagem: "Erro ao carregar os detalhes do problema.", problema: null });
    }
});

module.exports = routerIdeia;
