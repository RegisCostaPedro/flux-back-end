const axios = require('axios');
const repository = require('../repositories/pix-repository');
const authServiceAPI = require('../services/auth-transfeera-service');
const authService = require('../services/auth-service');
const pixService = require('../services/pix-service');


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

    static verificarChave = async (req, res) => {
        try {
            const idPix = req.params.id;
            const verifyCode = req.body.code;

            const token = req.body.token || req.query.token || req.headers['x-access-token'];
            const dadosUsuario = await authService.decodeToken(token);
            const emailUsuario = dadosUsuario.email;

            const accessToken = await authServiceAPI.returnAccessToken();
            const options = await pixService.verificarChave(idPix, emailUsuario, accessToken, verifyCode);
            console.log(options.data);

            if (options.status === 200) {
            return res.status(200).send(options.data);
        } else {
            return res.status(options.status).send({ message: options.message });
        }

        } catch (error) {
            console.error('Error updating PIX key:', error);
            return res.status(500).send({
                message: "Falha ao processar requisição: " + error.message
            });
        }
    }



    static listarChavesPix = async (req, res) => {
        try {
            //Recupera o token
            const token = req.body.token || req.query.token || req.headers['x-access-token'];

            // Decodifica o token
            const dadosUsuario = await authService.decodeToken(token);

            const pix = await repository.get(dadosUsuario.id);

            if (pix.status === 200) {

                return res.status(pix.status).send(pix.data);
            } else {

                return res.status(pix.status).send({ message: pix.message });
            }

        } catch (error) {
            res.status(400).send({
                message: "Falha ao processar requisição: " + error
            })
        }

    }

    static buscarChavePixPorID = async (req, res) => {
        try {
            const idPix = req.params.id;

            const token = req.body.token || req.query.token || req.headers['x-access-token'];

            // Decodifica o token
            const dadosUsuario = await authService.decodeToken(token);

            const accessToken = await authServiceAPI.returnAccessToken();

            const options = {
                method: 'GET',
                url: `https://api-sandbox.transfeera.com/pix/key/${idPix}`,
                headers: {
                    accept: 'application/json',
                    'User-Agent': dadosUsuario.email,
                    authorization: `Bearer ${accessToken}`
                }
            };

            const response = await axios.request(options)
                .then(function (response) {
                    return res.status(200).send(response.data);
                }).catch(function (error) {
                    console.error(error);
                });

            if (!response) {
                return res.status(400).send({ message: "Pix não encontrada ou inexistente" });
            }

        } catch (error) {
            res.status(400).send({
                message: "Falha ao processar requisição: " + error
            })
        }
    }

}

module.exports = PixController;
