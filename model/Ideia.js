const Sequelize = require('sequelize');
const conexao = require('../database/conexao');
const Professor = require('./Professor');

const Ideia = conexao.define('ideias', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: Sequelize.STRING,
    detalhes: Sequelize.TEXT,
    causa: Sequelize.STRING,
    frequencia: Sequelize.STRING,
    prazo: Sequelize.DATEONLY,
    tipo_projeto: Sequelize.ENUM(
        'consultoria', 'curso', 'evento', 'novo_produto', 'melhoria', 'resultado', 'nao_sabe'
    ),
    curso_sugerido: Sequelize.ENUM(
        'tads', 'ega', 'fpgl', 'ta'
    ),
    nome: Sequelize.STRING,
    telefone: Sequelize.STRING,
    email: Sequelize.STRING,
    cidade: Sequelize.ENUM(
        'bage', 'pelotas', 'candiota', 'hulha_negra', 'dom_pedrito', 'acegua', 'santana'
    ),
    status: {
        type: Sequelize.ENUM('pendente', 'tratando', 'finalizado'),
        defaultValue: 'pendente'
    },
    descricaoFinalizacao: {  // Nova coluna para armazenar a descrição da solução
        type: Sequelize.TEXT,
        allowNull: true // Pode ser nulo caso o professor ainda não tenha finalizado
    },
    professorId: { 
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Professor,
            key: 'id'
        }
    }
});

Professor.hasMany(Ideia, { foreignKey: 'professorId', as: 'ideias' });
Ideia.belongsTo(Professor, { foreignKey: 'professorId', as: 'professor' });


Ideia.sync({ force: false });

//Ideia.sync({ alter: true });


module.exports = Ideia;
