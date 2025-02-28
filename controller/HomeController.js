const express = require('express')
const routerHome = express.Router()

routerHome.get("/", (req, res) => {
    res.render("index", { mensagem: "" })
})

module.exports = routerHome