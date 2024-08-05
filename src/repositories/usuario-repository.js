const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

class UsarioRepository {

    //Buscar todos usuários
    static get = async () => {
        const res = await Usuario.findAll({
            attributes: ['nome', 'email', 'senha']
        });
        return res;
    };

    // Buscar pelo id
    static getById = async (id) => {
        const res = await Usuario.findByPk(id);
        return res;

    };

 // Buscar pela pk
static getByPk = async (id) => {
    const res = await Usuario.findByPk(id);
    return res;

};


    //Cadastrar usuário
    static post = async (body) => {
        let nomeUsuario = body.nome;
        let emailUsuario = body.email;
        let cpfUsuario = body.cpf;

        const usuarioExistente = await Usuario.findOne({
            where: {
                nome: nomeUsuario,
                email: emailUsuario,
                cpf: cpfUsuario
            }
        });

        if (usuarioExistente) {
            return { message: "Usuário já cadastrado", status: 400 };
        }

        const res = await Usuario.create(body);
        return { data: res, status: 201 };


    }
    //Atualizar usuário
    static put = async (id, body) => {
        const res = await Usuario.findByPk(id)
            .then(usuarioEncontrado => {
                return usuarioEncontrado.update(body);
            });
        return res;
    };

    //Deletar usuário
    static delete = async (id) => {
        const res = await Usuario.findByPk(id)
            .then(usuarioEncontrado => {
                if (!usuarioEncontrado || usuarioEncontrado === null) {
                    console.log('Usuário não encontrado');
                }
                return usuarioEncontrado.destroy({
                    where: {
                        id
                    }
                });
            });

        return res;
    };

    //Autenticar usuário (login)
    static autenticar = async (data) => {
        const usuario = await Usuario.findOne({
            where: {
                email: data.email
            }
        });
        if (!usuario) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(data.senha, usuario.senha);
        if (!isPasswordValid) {
            return null;
        }

        return usuario;
    };

}



module.exports = UsarioRepository;