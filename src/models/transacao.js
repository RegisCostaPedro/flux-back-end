const conexao = require('../config/database')
const { Sequelize, DataTypes } = require('sequelize');
const Conta = require('./conta');
const Usuario = require('./usuario');

const Transacao = conexao.define('transacao',{
    id_transacao:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
        
    },
    conta_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
        model: Conta,
        key: 'id_conta'
        }
    },
    data_transacao:{
        type: DataTypes.DATE,
        allowNull: false
    },
    valor:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    tipo_transacao:{
        type: DataTypes.ENUM('debito', 'credito', 'transferencia'),
        allowNull: false
    },
    descricao:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    usuario_id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Usuario,
            key:'id_usuario'
        }
    }
});

// Transacao.sync({ force: true })
//    .then(() => console.log('Tabela "transacao" criada com sucesso!'))
//    .catch(err => console.error('Erro ao criar a tabela "transacao":', err));