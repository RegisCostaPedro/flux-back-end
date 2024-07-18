
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');


//Buscar todos usuários
exports.get = async()=>{
    const res = await Usuario.findAll({
        attributes: ['nome', 'email', 'senha']
    });
    return res;
};
//Cadastrar usuário
exports.post = async(body) =>{
    let nomeUsuario = body.nome;
    let emailUsuario = body.email;
    let cpfUsuario = body.cpf;

    const usuarioExistente =await Usuario.findOne({
        where:{
            nome: nomeUsuario,
            email: emailUsuario,
            cpf: cpfUsuario
        }
    });

    if(usuarioExistente){
        return { message: "Usuário já cadastrado", status: 400 };
    }

    const res = await Usuario.create(body);
    return { data: res, status: 201 };

  
}
//Atualizar usuário
exports.put = async(id,body) =>{
res = await Usuario.findByPk(id)
    .then(usuarioEncontrado=>{
        return usuarioEncontrado.update(body);
    });
 return res;
};
//Deletar usuário
exports.delete = async(id) =>{
    res = await Usuario.findByPk(id)
        .then(usuarioEncontrado=>{
            if(!usuarioEncontrado || usuarioEncontrado === null){
               console.log('Usuário não encontrado');
            }
            return usuarioEncontrado.destroy({
                where:{
                    id
                }
            });
        });
        
     return res;
};

//Autenticar usuário (login)
exports.autenticar = async (data) => {
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
