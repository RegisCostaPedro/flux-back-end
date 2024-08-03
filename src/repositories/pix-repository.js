const { where } = require('sequelize');
const Pix = require('../models/pix');
const axios = require('axios');
const  pixAuthService = require('../services/auth-transfeera-service');
const Usuario = require('../models/usuario');
const Banco = require('../models/banco');
require('dotenv').config();



class PixRepository {

    static post = async (body) => {
        try {
            // Verifica se o usuário existe
            const usuario = await Usuario.findByPk(body.usuario_id);
            const banco = await Banco.findByPk(body.banco_id);
    
            if (!usuario) {
                return {
                    message: `O usuário não encontrado`,
                    status: 404
                };
    
            }
            if (!banco) {
                return { message: "Banco não encontrado", status: 404 };
            }
            // Cria a nova entrada na tabela Pix
            const pix = await Pix.create({
                id_pix: body.id_pix,
                key: body.key,
                key_type: body.key_type,
                usuario_id: body.usuario_id,
                banco_id: body.banco_id,
                created_at: new Date(),
                updated_at: new Date()
            });
    
            return { data: pix, status: 200 };
        } catch (error) {
            console.error('Error creating PIX entry:', error);
            return {
                message: "Falha ao criar entrada PIX: " + error.message,
                status: 500
            };
        }
    }
}   


   
module.exports = PixRepository;


