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
        if(!res){
            return { message: 'Usuário não encontrado',  status: 404};
        }
        return { data:res , status: 200 };


    };

    // Buscar pela pk
    static getByPk = async (id) => {
        const res = await Usuario.findByPk(id);
        return res;

    };

    //Cadastrar usuário
    static post = async (body) => {
        const usuario = await Usuario.create(body);
        
        if (!usuario) {
            return { message: "Erro ao criar usuário", status: 400 };
        }

        return { data: usuario, status: 201 };


    }

    //Atualizar usuário
    static put = async (id, body) => {
        const res = await Usuario.findByPk(id)
            .then(usuarioEncontrado => {
                return usuarioEncontrado.update(body);
            });

            if(!res){
                return { message: "Erro ao atualizar usuário", status: 400 };
            }

         return { data: res, status: 201 };

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