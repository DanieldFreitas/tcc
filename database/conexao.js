const Sequelize = require('sequelize')

const conexao = new Sequelize('tcc', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgresql',
    timezone: '-03:00'
})

module.exports = conexao 