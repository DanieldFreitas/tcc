const Sequelize = require('sequelize');
const conexao = require('../database/conexao');
const Professor = require('./Professor'); // Importando o modelo Professor

const Ideia = conexao.define('ideias', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: Sequelize.STRING,
    causa: Sequelize.STRING,
    frequencia: Sequelize.STRING,
    prazo: Sequelize.DATEONLY,
    tipo_projeto: Sequelize.ENUM(
        'consultoria', 'curso', 'evento', 'novo_produto', 'melhoria', 'resultado', 'nao_sabe'
    ),
    curso_sugerido: Sequelize.CHAR(
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
    }
});

// Estabelecendo o relacionamento entre Ideia e Professor.
Ideia.belongsTo(Professor, {
    foreignKey: 'curso_sugerido',
    targetKey: 'curso',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Professor.hasMany(Ideia, { foreignKey: 'curso_sugerido', sourceKey: 'curso' });

// Sincroniza o modelo com a tabela no banco
Ideia.sync({ force: false });

module.exports = Ideia;
