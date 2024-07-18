
const Banco = require('../models/banco');


exports.get = async () => {
    const res = await Banco.findAll({
        // attributes: ['nome_banco', 'descricao']
    });
    return res;
};

exports.post = async (body) => {
    let nomeBanco = body.nome_banco;
    const bancoExistente = await Banco.findOne({
        where: { nome_banco: nomeBanco },
    });

    if (bancoExistente) {
        console.log("Banco já cadastrado");
        return {
            message: "Banco já cadastrado",
            status: 400 
        };
    } 

        const res = await Banco.create(body);
   
        return { data: res, status: 201 };
    

}

exports.put = async (id, body) => {
    res = await Banco.findByPk(id)
        .then(BancoEncontrado => {
            return BancoEncontrado.update(body);
        });
    if (!res) {
        return { message: "Banco não encontrado" };
    }
    return res;
};

exports.delete = async (id) => {
    res = await Banco.findByPk(id)
        .then(BancoEncontrado => {
            if (!BancoEncontrado || BancoEncontrado === null) {
                console.log('Banco não encontrado');
            }
            return BancoEncontrado.destroy({
                where: {
                    id
                }
            });
        });

    return res;
};

exports.getById = async(id)=>{
    const res = await Banco.findByPk(id);
    return res;

  
};

