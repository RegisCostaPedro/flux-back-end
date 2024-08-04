const { where } = require('sequelize');
const Pix = require('../models/pix');
const axios = require('axios');
const authServiceAPI = require('./auth-transfeera-service');
const authService = require('../services/auth-service');
const repository = require('../repositories/pix-repository');
require('dotenv').config();

class pixService {
    static verificarChave = async (idPix, emailUsuario, accessToken, verifyCode) => {
        try {
            // const accessToken = await authServiceAPI.returnAccessToken();
            const options = {
                method: 'PUT',
                url: `https://api-sandbox.transfeera.com/pix/key/${idPix}/verify`,
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'user-Agent': emailUsuario,
                    Authorization: `Bearer ${accessToken}`
                },
                data: { code: verifyCode }

            };
            if (options.data.code < 6) {
                return {
                    message: 'A chave deve conter apenas 6 digitos',
                    status: 400
                };
            }
            if (verifyCode.length !== 6) {
                return {
                    message: 'A chave deve conter apenas 6 dígitos numéricos',
                    status: 400
                };
            }

            const response = await axios.request(options);
            const keyRegistred = response.data.status;
            const createdKey = response.data;

            // id vindo da API 
            const id_pix = createdKey.id;

            console.log(keyRegistred);
            const pix = await repository.put({
                id_pix:id_pix,
                status:"REGISTRADA"
            });
            console.log(pix);
            if (pix.status === 200) {
                return { data: response.data, status: 200 };
            } else {
                return {
                    message: pix.message,
                    status: pix.status || 500 
                };
            }

        } catch (error) {
            console.error('Error obtaining list of banks:', error);
            throw error;
        }
    }

    static findBankById = (banks, bankId) => {
        return banks.find(bank => bank.id === bankId);
    }
}

module.exports = pixService;