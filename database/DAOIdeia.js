const Ideia = require('../model/Ideia');

const DAOIdeia = {
    // Método para inserir uma nova ideia no banco de dados
    insert: async (titulo, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade) => {
        try {
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
                cidade
            });
            return novaIdeia;
        } catch (error) {
            console.error("Erro ao inserir ideia:", error);
            return null;
        }
    },

    // Método para buscar todas as ideias cadastradas
    getAll: async () => {
        try {
            return await Idea.findAll();
        } catch (error) {
            console.error("Erro ao buscar ideias:", error);
            return null;
        }
    },

    // Método para buscar uma ideia pelo ID
    getOne: async (id) => {
        try {
            return await Idea.findByPk(id);
        } catch (error) {
            console.error("Erro ao buscar ideia:", error);
            return null;
        }
    },

    // Método para atualizar uma ideia existente
    update: async (id, titulo, causa, frequencia, prazo, tipo_projeto, curso_sugerido, nome, telefone, email, cidade) => {
        try {
            const ideiaAtualizada = await Idea.update({
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
            return ideiaAtualizada[0] > 0; // Retorna true se houver alguma linha afetada
        } catch (error) {
            console.error("Erro ao atualizar ideia:", error);
            return false;
        }
    },

    // Método para excluir uma ideia
    delete: async (id) => {
        try {
            const deletado = await Idea.destroy({ where: { id } });
            return deletado > 0; // Retorna true se houver alguma linha excluída
        } catch (error) {
            console.error("Erro ao excluir ideia:", error);
            return false;
        }
    }
};

module.exports = DAOIdeia;
