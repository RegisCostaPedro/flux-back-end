const conexao = require('../config');
const Usuario = require('./usuario');
const Banco = require('./banco');
const { Sequelize, DataTypes } = require('sequelize');

const Pix = conexao.define('pix', {
    id_pix: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    chave_pix: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true

    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    banco_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }

});
Pix.belongsTo(Banco,{
    constraint: true,
    foreignKey: 'banco_id'
})
Pix.belongsTo(Usuario,{
    constraint: true,
    foreignKey: 'usuario_id'
});

setTimeout(() => {
    Pix.sync({ force: true })
  .then(() => console.log('Tabela "pix" criada com sucesso!'))
  .catch(err => console.error('Erro ao criar a tabela "pix":', err));
}, 100);


  
module.exports = Pix;


