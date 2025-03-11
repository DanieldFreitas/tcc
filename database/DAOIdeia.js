const Ideia = require('../model/Ideia');
const Professor = require('../model/Professor');

const DAOIdeia = {
    insert: async (titulo, detalhes, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade) => {
        try {
            return await Ideia.create({
                titulo,
                detalhes,
                causa,
                frequencia,
                prazo,
                tipo_projeto,
                curso_sugerido,
                nome,
                telefone,
                email,
                cidade,
                status: 'pendente'
            });
        } catch (error) {
            console.error("[DAOIdeia] Erro ao inserir ideia:", error);
            return null;
        }
    },

    getAll: async () => {
        try {
            return await Ideia.findAll({
                where: { status: 'pendente', professorId: null } // Só ideias pendentes e sem professor atribuído
            });
        } catch (error) {
            console.error("[DAOIdeia] Erro ao buscar ideias:", error);
            return null;
        }
    },

    getByCurso: async (curso) => {
        try {
            return await Ideia.findAll({
                where: { curso_sugerido: curso, status: 'pendente', professorId: null }
            });
        } catch (error) {
            console.error("[DAOIdeia] Erro ao buscar ideias pelo curso:", error);
            return null;
        }
    },

    getEmAndamentoByProfessor: async (professorId) => {
        try {
            return await Ideia.findAll({
                where: { professorId, status: 'tratando' }
            });
        } catch (error) {
            console.error("[DAOIdeia] Erro ao buscar ideias em andamento:", error);
            return [];
        }
    },

    markAsInProgress: async (idIdeia, idProfessor) => {
        try {
            const ideiaAtualizada = await Ideia.update(
                { status: 'tratando', professorId: idProfessor },
                { where: { id: idIdeia, status: 'pendente' } }
            );
            return ideiaAtualizada[0] > 0;
        } catch (error) {
            console.error("[DAOIdeia] Erro ao marcar ideia como em progresso:", error);
            return false;
        }
    },

    getById: async (id) => { // NOVA FUNÇÃO
        try {
            return await Ideia.findByPk(id);
        } catch (error) {
            console.error("[DAOIdeia] Erro ao buscar ideia por ID:", error);
            return null;
        }
    },

    update: async (id, titulo, detalhes, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade) => {
        try {
            const ideia = await Ideia.findByPk(id);
            if (!ideia) return null; // Se não encontrar a ideia

            // Atualizar os campos
            ideia.titulo = titulo;
            ideia.detalhes = detalhes;
            ideia.causa = causa;
            ideia.frequencia = frequencia;
            ideia.prazo = prazo;
            ideia.tipo_projeto = tipo_projeto;
            ideia.curso_sugerido = curso_sugerido;
            ideia.nome = nome;
            ideia.telefone = telefone;
            ideia.email = email;
            ideia.cidade = cidade;

            // Salvar a ideia atualizada
            await ideia.save();
            return ideia;
        } catch (error) {
            console.error("[DAOIdeia] Erro ao atualizar ideia:", error);
            return null;
        }
    },

    delete: async (id) => {
        try {
            const resultado = await Ideia.destroy({ where: { id } });
            return resultado > 0;
        } catch (error) {
            console.error("[DAOIdeia] Erro ao excluir ideia:", error);
            return false;
        }
    }
};

module.exports = DAOIdeia;
