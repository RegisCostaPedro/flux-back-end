const repository = require('../repositories/usuario-repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ValidationContract = require('../validators/fluent-validator');
const authService = require('../services/auth-service');
const { Model } = require('sequelize');

class UsuarioController {

    //Buscar todos usuários
    static listarUsuarios = async (req, res) => {

        try {
            const usuarioList = await repository.get();

            if (!usuarioList) {
                res.status(404).send({
                    message: "Usuário não encontrado"
                });
                return;
            }

            res.status(200).send(usuarioList);
        } catch (error) {
            res.status(400).send({
                message: "Falha ao processar requisição: " + error
            })
        }
    };

    //Buscar usuario pelo id
    static buscarUsuarioPeloID = async (req, res) => {

        try {

            const usuarioList = await repository.getById(req.params.id);

            if (!usuarioList) {
                res.status(404).send({
                    message: "Usuário não encontrado"
                });
                return;
            }

            res.status(200).send(usuarioList);
        } catch (error) {
            res.status(400).send({
                message: "Falha ao processar requisição: " + error
            })
        }
    };


    //Cadastrar usuário
    static cadastrarUsuario = async (req, res) => {


        try {
            let contract = new ValidationContract();
            contract.hasMinLen(req.body.nome, 3, 'O nome deve conter pelo menos 3 caracteres');
            contract.hasMinLen(req.body.cpf, 14, 'O cpf deve conter pelo menos 13 caracteres');
            contract.hasMaxLen(req.body.cpf, 14, 'O cpf deve ter no máximo 13 caracteres');
            contract.isEmail(req.body.email, 'Email inválido');
            contract.hasMinLen(req.body.senha, 3, 'O senha deve conter pelo menos 3 caracteres');

            if (!contract.isValid()) {
                res.status(400).send(contract.errors()).end();
                return;
            }
            const hashedPassword = await bcrypt.hash(req.body.senha, 10);
            console.log(req.body.senha);

            const usuario = await repository.post({
                nome: req.body.nome,
                cpf: req.body.cpf,
                email: req.body.email,
                senha: hashedPassword,
                roles: "usuario"
            });

            if (usuario.status === 201) {
                res.status(201).send(usuario.data);
            } else {
                res.status(usuario.status).send({ message: usuario.message });
            }

        } catch (error) {
            res.status(500).send({
                message: "Falha ao processar requisição: " + error
            })
        }
    }
    //Atualizar usuário
    static atualizarUsuario = async (req, res) => {
        try {
            const usuario = await repository.put(req.params.id, req.body);

            return res.status(201).send(usuario);

        } catch (error) {
            return res.status(500).send({
                message: "Falha ao processar requisição: " + error
            });
        }
    }

    //Deletar usuário
    static deletarUsuario = async (req, res) => {
        try {
            const usuario = await repository.delete(req.params.id);

            return res.status(200).send({
                message: "Usuário deletado com sucesso!"
            });
        } catch (error) {
            res.status(404).send({
                message: "Falha ao processar requisição"
            });
        }
    }

    //Autenticar usuário (login)
    static autenticar = async (req, res) => {
        try {
            console.log(req.body.senha)
            const usuario = await repository.autenticar({
                email: req.body.email,
                senha: req.body.senha,
            });

            if (!usuario) {
                res.status(404).send({
                    message: 'email ou senha inválidos'
                });
                return;
            }
            const token = await authService.generateToken({
                id: usuario.id_usuario,
                email: usuario.email,
                nome: usuario.nome,
                roles: usuario.roles //coloca no refresh token

            });

            res.status(201).send({
                token: token,
                data: {
                    email: usuario.email,
                    nome: usuario.nome
                }
            });

        } catch (error) {
            console.error('Erro ao autenticar usuario:', error);
            res.status(500).send({
                message: "Falha ao processar requisição"
            });
        }
    }

    // Refresh token
    static refreshToken = async (req, res) => {
        try {
            //Recupera o token
            const token = req.body.token || req.query.token || req.headers['x-access-token'];

            // Decodifica o token
            const data = await authService.decodeToken(token);


            const usuario = await repository.getById(data.id);
            console.log(usuario);
            if (!usuario) {
                res.status(404).send({
                    message: 'Cliente não encontrado'
                });
                return;
            }

            const tokenData = await authService.generateToken({
                id: usuario._id,
                email: usuario.email,
                nome: usuario.nome,
                roles: usuario.roles
            })

            res.status(201).send({
                token: token,
                data: {
                    email: usuario.email,
                    nome: usuario.nome
                }
            });
        } catch (error) {
            console.error('Erro ao autenticar cliente:', error);
            res.status(500).send({
                message: 'Falha ao processar sua requisição'
            });
        }
    };

}

module.exports = UsuarioController;