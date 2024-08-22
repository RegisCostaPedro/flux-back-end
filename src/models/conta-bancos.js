const conexao = require('../config/database');
const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Pix = require('../models/pix');
const Usuario = require('./usuario');
const ContaBancaria = require('./conta-bancaria');
const Banco = require('./banco');

class ContaBancos extends Model {
    static init(sequelize) {
        return super.init({
            id_contaBancos: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            pix_id: {
                type:  Sequelize.UUID,
                allowNull: false, references: {
                    model: Pix,
                    key: 'id_pix',
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }

            },
            usuario_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Usuario,
                    key: 'id_usuario',
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }
            },
            contaBancaria_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: ContaBancaria,
                    key: 'id_conta',
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }
            },
            banco_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Banco,
                    key: 'id_banco',
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }
            },

        }, {
            sequelize,
            tableName: 'conta_bancos',
            timestamps: false,
        });
    }
}

ContaBancos.init(conexao);
module.exports = ContaBancos;
