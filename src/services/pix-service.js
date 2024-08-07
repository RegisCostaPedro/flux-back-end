const { where } = require('sequelize');
const Pix = require('../models/pix');
const axios = require('axios');
const authServiceAPI = require('./auth-transfeera-service');
const authService = require('../services/auth-service');
const repository = require('../repositories/pix-repository');
require('dotenv').config();

class pixService {

    static criarChave = async (key_type, key, dadosUsuario, accessToken, banco_id) => {
        try {
       
            if(key_type){
                //fazer logica para caso a chave seja cnpj, o aleatoria
            }

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
            const id_pix = createdKey.id;

            const chaveExistente = await repository.findByKey(createdKey.key);
            

            if(chaveExistente.status === 409){
                return { status:  chaveExistente.status, message: response.data.statusCode };
            }
            const pix = await repository.post({
                id_pix,
                key: createdKey.key,
                key_type: createdKey.key_type,
                usuario_id: dadosUsuario.id,
                banco_id: banco_id
            });

            if (pix.status === 200) {
                return { status: 200, data: createdKey };
            } else if(pix.status === 409){
                return { status: pix.status || 500, message: response.data.statusCode };
            }else{
                return { status: pix.status || 500, message: response.data.statusCode };
            }

        } catch (error) {
            console.error('Error creating PIX key:', error);

            // Retornar a mensagem de erro da API da Transfeera ou do banco de dados
            if (error.code === 'ER_DUP_ENTRY') {
                return {
                    status: 400,
                    message: 'Chave Pix já registrada no banco de dados'
                };
            }

            if (error.response && error.response.data) {
                return {
                    status: error.response.data.statusCode || 500,
                    message: error.response.data.message
                };
            } else {
                return {
                    status: 500,
                    message: 'Erro interno do servidor'
                };
            }
        }
    }



    static verificarChave = async (idPix, emailUsuario, accessToken, verifyCode) => {
        try {

            if (verifyCode.length !== 6) {
                return {
                    message: 'A chave deve conter apenas 6 dígitos numéricos',
                    status: 400
                };
            }

            // const accessToken = await authServiceAPI.returnAccessToken();
            const verifyOptions = {
                method: 'PUT',
                url: `https://api-sandbox.transfeera.com/pix/key/${idPix}/verify`,
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'User-Agent': emailUsuario,
                    Authorization: `Bearer ${accessToken}`
                },
                data: { code: verifyCode }

            };

            const verifyResponse = await axios.request(verifyOptions);
            console.log('Verify Response:', verifyResponse.data);
            // Consultar o status após a verificação
            const statusOptions = {
                method: 'GET',
                url: `https://api-sandbox.transfeera.com/pix/key/${idPix}`,
                headers: {
                    accept: 'application/json',
                    'User-Agent': emailUsuario,
                    Authorization: `Bearer ${accessToken}`
                }
            };

            const statusResponse = await axios.request(statusOptions);
            const keyRegistredStatus = statusResponse.data.status;

            const updatedStatus = keyRegistredStatus === 'REGISTRADA' ? 'REGISTRADA' : keyRegistredStatus;

            const updateResult = await repository.put({
                id_pix: idPix,
                status: updatedStatus
            });

            if (!updateResult.data) {
                return {
                    message: 'Erro ao atualizar chave',
                    status: 500
                };
            }

            return {
                data: statusResponse.data,
                status: 200
            };

        } catch (error) {
            console.error('Error verifying PIX key:', error);

            // Pegando o erro vindo da API da Transfeera
            if (error.response && error.response.data) {
                return {
                    message: error.response.data.message,
                    status: error.response.data.statusCode || 500
                };
            } else {
                return {
                    message: 'Erro interno do servidor',
                    status: 500
                };
            }
        }
    }

    static reenviarCodigo = async (idPix, emailUsuario, accessToken) => {
        try {


            // const accessToken = await authServiceAPI.returnAccessToken();
            const verifyOptions = {
                method: 'PUT',
                url: `https://api-sandbox.transfeera.com/pix/key/${idPix}/resendVerificationCode`,
                headers: {
                    accept: 'application/json',
                    'User-Agent': emailUsuario,
                    authorization: `Bearer ${accessToken}`
                }
            };


            const verifyResponse = await axios.request(verifyOptions);
            console.log('Verify Response:', verifyResponse.data);
            // Consultar o status após a verificação
            const statusOptions = {
                method: 'GET',
                url: `https://api-sandbox.transfeera.com/pix/key/${idPix}`,
                headers: {
                    accept: 'application/json',
                    'User-Agent': emailUsuario,
                    Authorization: `Bearer ${accessToken}`
                }
            };

            const statusResponse = await axios.request(statusOptions);
            const keyRegistredStatus = statusResponse.data.status;

            const updatedStatus = keyRegistredStatus === 'REGISTRADA' ? 'REGISTRADA' : keyRegistredStatus;

            const updateResult = await repository.put({
                id_pix: idPix,
                status: updatedStatus
            });

            if (!updateResult.data) {
                return {
                    message: 'Erro ao atualizar chave',
                    status: 500
                };
            }

            return {
                data: statusResponse.data,
                status: 200
            };

        } catch (error) {
            console.error('Error verifying PIX key:', error);

            // Pegando o erro vindo da API da Transfeera
            if (error.response && error.response.data) {
                return {
                    message: error.response.data.message,
                    status: error.response.data.statusCode || 500
                };
            } else {
                return {
                    message: 'Erro interno do servidor',
                    status: 500
                };
            }
        }
    }
    

    static deletarChave = async (idPix, usuario_id, emailUsuario, accessToken) => {

        try {
            const options = {
                method: 'DELETE',
                url: `https://api-sandbox.transfeera.com/pix/key/${idPix}`,
                headers: {
                    accept: 'application/json',
                    'User-Agent': emailUsuario,
                    Authorization: `Bearer ${accessToken}`
                }
            };

    
          const response = await axios.request(options);
            
          // Deleta a chave do banco de dados
          const chaveDeletada = await repository.delete(idPix, usuario_id);

          if (chaveDeletada.status === 204) {
              return {
                  status: 204,
                  message: 'Chave deletada com sucesso'
              };
          } else {
              return {
                  status: chaveDeletada.status || 500,
                  message: chaveDeletada.message || 'Erro ao deletar chave no banco de dados'
              };
          }

        } catch (error) {
            if (error.response && error.response.data) {
                return {
                    message: error.response.data.message,
                    status: error.response.data.statusCode || 500
                };
            } else {
                return {
                    message: 'Erro interno do servidor',
                    status: 500
                };
            }
        }
    }
}



module.exports = pixService;