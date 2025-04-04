const Sequelize = require('sequelize');
const conexao = require('../database/conexao');

const Professor = conexao.define('professores', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: Sequelize.STRING,
    email: Sequelize.STRING,
    senha: Sequelize.STRING,
    curso: Sequelize.STRING
}, {
    timestamps: false 
});

Professor.sync({ force: false });

//Professor.sync({ alter: true });


module.exports = Professor;
