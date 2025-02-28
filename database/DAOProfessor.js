const Professor = require('../model/Professor');
const bcrypt = require('bcryptjs');

class DAOProfessor {
    static async login(email, senha) {
        try {
            let professor = await Professor.findOne({ where: { email: email } });
            if (professor) {
                if (bcrypt.compareSync(senha, professor.senha)) {
                    return professor;
                }
            }
            return undefined;
        } catch (error) {
            console.log(error.toString());
            return undefined;
        }
    }
}

module.exports = DAOProfessor;
