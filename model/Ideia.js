const Sequelize = require('sequelize');
const conexao = require('../database/conexao');

const Ideia = conexao.define('ideias', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    causa: Sequelize.STRING,
    frequencia: Sequelize.STRING,
    prazo: Sequelize.DATEONLY,
    tipo_projeto: {
        type: Sequelize.ENUM(
            'consultoria', 'curso', 'evento', 'novo_produto', 'melhoria', 'resultado', 'nao_sabe'
        ),
        allowNull: false
    },
    curso_sugerido: {
        type: Sequelize.ENUM(
            'tads', 'ega', 'fpgl', 'ta'
        ),
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telefone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    cidade: {
        type: Sequelize.ENUM(
            'bage', 'pelotas', 'candiota', 'hulha_negra', 'dom_pedrito', 'acegua', 'santana'
        ),
        allowNull: false
    }
});

Ideia.sync({ force: false });

module.exports = Ideia;
