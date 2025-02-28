const express = require('express')
const routerProfessor = express.Router()
const DAOProfessor = require('../database/DAOProfessor')
const bcrypt = require('bcryptjs'); 

routerProfessor.get("/professor/proflogin", (req, res) => {
    res.render("professor/proflogin", { mensagem: "" }) 
})
routerProfessor.post("/professor/proflogin", function (req, res) {
    let { email, senha } = req.body
    DAOProfessor.login(email, senha).then(professor => {
        if (professor != undefined) {
            if (bcrypt.compareSync(senha, professor.senha)) {
                req.session.professor = { id: professor.id, nome: professor.nome, email: professor.email }
                res.redirect("/professor/profArea")
            } else {
                res.render("professor/proflogin", { mensagem: "Usuário ou senha inválidos." })
            }
        } else {
            res.render("professor/proflogin", { mensagem: "Usuário ou senha inválidos." })
        }
    }).catch(err => {
        console.error(err)
        res.render("professor/proflogin", { mensagem: "Erro ao autenticar, tente novamente" })
    })
})

module.exports = routerProfessor