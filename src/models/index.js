const conexao = require('../config/database')
const Banco = require("./banco");
const ContaBancaria = require("./conta-bancaria");
const ContaBancos = require("./conta-bancos");
const Pix = require("./pix");
const Transacao = require("./transacao");
const Usuario = require("./usuario");


ContaBancos.init(conexao);
Usuario.init(conexao);
Banco.init(conexao);
ContaBancaria.init(conexao);
Pix.init(conexao);
ContaBancos.init(conexao);
Transacao.init(conexao);

// Definindo as associações
Usuario.hasMany(ContaBancaria, { foreignKey: 'usuario_id' });
Banco.hasMany(ContaBancaria, { foreignKey: 'banco_id' });
Banco.hasMany(Pix, { foreignKey: 'banco_id' });
ContaBancaria.belongsTo(Usuario, { foreignKey: 'usuario_id' });
ContaBancaria.belongsTo(Banco, { foreignKey: 'banco_id' });
Pix.hasMany(ContaBancos, { foreignKey: 'pix_id' });
ContaBancos.belongsTo(Pix, { foreignKey: 'pix_id' });
ContaBancos.belongsTo(Usuario, { foreignKey: 'usuario_id' });
ContaBancos.belongsTo(ContaBancaria, { foreignKey: 'contaBancaria_id' });
ContaBancos.belongsTo(Banco, { foreignKey: 'banco_id' });
Transacao.belongsTo(ContaBancos, { foreignKey: 'contaBancos_id' });

module.exports = {
    Usuario,
    Banco,
    ContaBancaria,
    Pix,
    ContaBancos,
    Transacao,
  };