const express = require('express');
const routerIdeia = express.Router();
const DAOIdeia = require('../database/DAOIdeia');


// Rota para exibir o formulário de cadastro de ideias
routerIdeia.get("/ideia/cadastroideia", (req, res) => {
    res.render("ideia/cadastroideia", { mensagem: "" });
});

// Rota para salvar uma nova ideia
routerIdeia.post("/ideia/cadastrar", (req, res) => {
    let { titulo, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade } = req.body;

    console.log("Dados recebidos:");
    console.log("titulo:", titulo);
    console.log("causa:", causa);
    console.log("frequencia:", frequencia);
    console.log("prazo:", prazo);
    console.log("tipo_projeto:", tipo_projeto);
    console.log("curso_sugerido:", curso_sugerido);
    console.log("nome:", nome);
    console.log("telefone:", telefone);
    console.log("email:", email);
    console.log("cidade:", cidade);

    // Verificar e validar e-mail separadamente
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.render("ideia/cadastroideia", { mensagem: "O e-mail fornecido não é válido." });
    }

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!titulo || !nome || !telefone || !tipo_projeto || !curso_sugerido || !cidade) {
        return res.render("ideia/cadastroideia", { mensagem: "Todos os campos obrigatórios devem ser preenchidos." });
    }
    console.log("Chamando DAOIdeia.insert com os seguintes dados:");
    console.log({ titulo, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade });

    DAOIdeia.insert(titulo, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade)
    .then(inserido => {
        if (inserido) {
            // Redirecionar para a página de sucesso ou outra ação
            res.render("ideia/cadastrar", { mensagem: "Ideia cadastrada com sucesso!"});
        } else {
            res.render("ideia/cadastroideia", { mensagem: "Não foi possível cadastrar a ideia." });
        }
    }).catch(err => {
        console.error("Erro no cadastro:", err);
        res.render("ideia/cadastroideia", { mensagem: "Erro no cadastro da ideia." });
    });
});

module.exports = routerIdeia;
