// cadastrarProfessor.js

const Professor = require('./model/Professor'); // Ajuste o caminho conforme necessário
const bcrypt = require('bcryptjs');  // Para criptografar a senha

async function cadastrarProfessor() {
    // Dados do professor que você quer cadastrar
    const nome = 'Professor Daniel';
    const email = 'daniel@professor';
    const senha = '1234';
    const curso = 'tads'  // A senha que o professor usa no SUAP

    // Criptografando a senha
    const senhaCriptografada = bcrypt.hashSync(senha, 10);

    try {
        // Inserir o professor no banco de dados com a senha criptografada
        const professor = await Professor.create({
            nome: nome,
            email: email,
            senha: senhaCriptografada, // A senha criptografada será armazenada no banco
            curso: curso,
        });

        console.log('Professor cadastrado com sucesso:', professor);
    } catch (error) {
        console.error('Erro ao cadastrar professor:', error);
    }
}

// Rodar a função para cadastrar o professor
cadastrarProfessor();
