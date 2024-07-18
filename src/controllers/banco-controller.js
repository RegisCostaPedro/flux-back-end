const repository = require('../repositories/banco-repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ValidationContract = require('../validators/fluent-validator');
const authService = require('../services/auth-service');


//Buscar todos os bancos
exports.listarBancos = async(req,res,next)=>{
 
 try {
    const bancoList = await repository.get();

    if(!bancoList){
        res.status(404).send({
            message: "Banco não encontrado"
        });
        return;
    }

    res.status(200).send(bancoList);
 } catch (error) {
    res.status(400).send({
        message: "Falha ao processar requisição: " + error
    })
 }
};
//Cadastrar banco
exports.cadastrarBanco = async(req,res,next)=>{

    try {
        let contract = new ValidationContract();
        contract.hasMinLen(req.body.nome_banco, 3, 'O nome do banco deve conter pelo menos 3 caracteres');
    
        contract.hasMinLen(req.body.descricao, 5, 'A descricao  deve conter pelo menos 5 caracteres');

       
        if (!contract.isValid()) {
            res.status(400).send(contract.errors()).end();
            return;
        }
    
        const banco = await repository.post({
         nome_banco: req.body.nome_banco,
         descricao:  req.body.descricao
          
        });
         if(banco.status === 201){
            res.status(201).send(banco.data);
      
         }else{
            res.status(banco.status).send({ message: banco.message });
         }
   

    } catch (error) {
        res.status(500).send({
            message: "Falha ao processar requisição" + error
        })
          
    }
}

// Atualizar Banco
 exports.atualizarBanco = async(req,res,next) =>{
     try {
         const banco = await repository.put(req.params.id,req.body);
         return  res.status(201).send(banco);
     } catch (error) {
         return  res.status(500).send({
             message: "Falha ao processar requisição"
         });
     }
 }

// Deletar Banco
 exports.deletarBanco = async(req,res,next) =>{
     try {
         const banco = await repository.delete(req.params.id);
      
       return  res.status(200).send({
             message: "Banco deletado com sucesso!"
         });
     } catch (error) {
         res.status(404).send({
             message: "Falha ao processar requisição"
         });
     }
 }
