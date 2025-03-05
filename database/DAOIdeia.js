const Ideia = require('../model/Ideia');
const Professor = require('../model/Professor');

const DAOIdeia = {
    // Método para inserir uma nova ideia no banco de dados
    insert: async (titulo, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade) => {
        try {
            console.log("[DAOIdeia] Tentando inserir no banco...");
            console.log({ titulo, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade });
            
            const novaIdeia = await Ideia.create({
                titulo,
                causa,
                frequencia,
                prazo,
                tipo_projeto,
                curso_sugerido,
                nome,
                telefone,
                email,
                cidade,
                status: 'pendente'  // A ideia começa com status "pendente"
            });
            
            console.log("[DAOIdeia] Ideia inserida com sucesso:", novaIdeia.toJSON());
            return novaIdeia;
        } catch (error) {
            console.error("[DAOIdeia] Erro ao inserir ideia:", error.message);
            console.error("[DAOIdeia] Detalhes do erro:", error);
            return null;
        }
    },

    // Método para buscar todas as ideias cadastradas
    getAll: async () => {
        try {
            return await Ideia.findAll();
        } catch (error) {
            console.error("[DAOIdeia] Erro ao buscar ideias:", error);
            return null;
        }
    },

    // Método para buscar uma ideia pelo ID
    getOne: async (id) => {
        try {
            return await Ideia.findByPk(id);
        } catch (error) {
            console.error("[DAOIdeia] Erro ao buscar ideia:", error);
            return null;
        }
    },

    // Método para buscar ideias filtradas pelo curso do professor
    getByCurso: async (curso) => {
        try {
            return await Ideia.findAll({
                where: { curso_sugerido: curso, status: 'pendente' }
            });
        } catch (error) {
            console.error("[DAOIdeia] Erro ao buscar ideias pelo curso:", error);
            return null;
        }
    },

    // Método para buscar as ideias "em andamento" associadas a um professor
    getEmAndamentoByProfessor: async (professorId) => {
        try {
            const professor = await Professor.findByPk(professorId);
            if (!professor) return [];

            return await Ideia.findAll({
                where: {
                    curso_sugerido: professor.curso,
                    status: 'tratando'
                },
                include: [{
                    model: Professor, 
                    attributes: ['id', 'nome']
                }]
            });
        } catch (error) {
            console.error("[DAOIdeia] Erro ao buscar ideias em andamento do professor:", error);
            return [];
        }
    },

    // Método para atualizar uma ideia existente
    update: async (id, titulo, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade) => {
        try {
            const ideiaAtualizada = await Ideia.update({
                titulo,
                causa,
                frequencia,
                prazo,
                tipo_projeto,
                curso_sugerido,
                nome,
                telefone,
                email,
                cidade
            }, {
                where: { id }
            });
            return ideiaAtualizada[0] > 0;
        } catch (error) {
            console.error("[DAOIdeia] Erro ao atualizar ideia:", error);
            return false;
        }
    },

    // Método para excluir uma ideia
    delete: async (id) => {
        try {
            const deletado = await Ideia.destroy({ where: { id } });
            return deletado > 0;
        } catch (error) {
            console.error("[DAOIdeia] Erro ao excluir ideia:", error);
            return false;
        }
    },

    // Método para marcar uma ideia como "em progresso"
    markAsInProgress: async (id) => {
        try {
            const ideiaAtualizada = await Ideia.update(
                { status: 'tratando' },
                { where: { id } }
            );
            return ideiaAtualizada[0] > 0;
        } catch (error) {
            console.error("[DAOIdeia] Erro ao marcar ideia como em progresso:", error);
            return false;
        }
    }
};

module.exports = DAOIdeia;
