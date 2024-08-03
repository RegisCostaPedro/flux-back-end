const axios = require('axios');
const repository = require('../repositories/pix-repository');
const authServiceAPI = require('../services/auth-transfeera-service');
const bancoService = require('../services/banco-transfeera-service')
const authService = require('../services/auth-service');
const request = require('got');

require('dotenv').config();

class PixController {
    static criarChave = async (req, res) => {
        try {
            const token = req.body.token || req.query.token || req.headers['x-access-token'];
            const dadosUsuario = await authService.decodeToken(token);

            const { key_type, key } = req.body;
            const accessToken = await authServiceAPI.returnAccessToken();

            const options = {
                method: 'POST',
                url: 'https://api-sandbox.transfeera.com/pix/key',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'user-Agent': dadosUsuario.email,
                    Authorization: `Bearer ${accessToken}`
                },
                data: { key, key_type }
            };

            const response = await axios.request(options);
            const createdKey = response.data;

            // id vindo da API 
            const id_pix = createdKey.id;

            const pix = await repository.post({
                id_pix,
                key: createdKey.key,
                key_type: createdKey.key_type,
                usuario_id: dadosUsuario.id,
                banco_id: req.body.banco_id
            });

            if (pix.status === 200) {
                return res.status(200).send(response.data);
            } else {
                return res.status(pix.status).send({ message: pix.message });
            }
        } catch (error) {
            console.error('Error creating PIX key:', error);
            return res.status(500).send({
                message: "Falha ao processar requisição: " + error.message
            });
        }
    }

   
}

module.exports = PixController;
