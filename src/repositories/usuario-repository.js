
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

exports.get = async()=>{
    const res = await Usuario.findAll({},'nome email senha');
    return res;
};

exports.post = async(body) =>{
    const res = await Usuario.create(body);
    return res;
}

exports.put = async(id,body) =>{
res = await Usuario.findByPk(id)
    .then(usuarioEncontrado=>{
        return usuarioEncontrado.update(body);
    });
 return res;
};

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
