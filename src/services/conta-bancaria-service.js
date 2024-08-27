const Conta = require('../models/conta-bancaria');
const Transacao = require('../models/transacao');
const Usuario = require('../models/usuario');

const repository = require('../repositories/conta-bancaria-repository');
const ContaBancosrepository = require('../repositories/conta-bancos-repository');


class ContaBancariaService {


    static criarContaBancaria = async (fkUsuarioId, fkBancoId, tipo_conta, saldo) => {
        try {

            const contaBancaria = await repository.post({fkUsuarioId, fkBancoId, tipo_conta, saldo})
            
            if(!contaBancaria){
                return {message: contaBancaria.message, status: contaBancaria.status}
            }

            return {data: contaBancaria.data, status: contaBancaria.status}

        } catch (error) {
            return {
                message: "Falha na requisição" + error,
                status: 500
            }
        }

    }

    static atualizarSaldo = async (contaID, valor, fkUsuarioId, descricao, fkBancoId) => {
        try {
            const t = await sequelize.transaction();
            const contaBancariaEncontrada = await Conta.findByPk(contaID);

            if (!contaBancariaEncontrada) {
                return { message: 'Conta não encontrada ou inexistente', status: 404 };
            }
    
            const usuario = await Usuario.findByPk(fkUsuarioId);
    
            // console.log(usuario.id_usuario);
            // console.log(fkUsuarioId);
    
            if (!usuario) {
                
                return { message: `Você ainda não possui uma conta bancária para atualizá-la`, status: 404 };
            }
    
    
            if (contaBancariaEncontrada.usuario_id !== usuario.id_usuario) {
                await t.rollback();
                return { message: 'Esta conta já pertence a um usuário', status: 403 };
            }
    
            const conta = await repository.getById(contaID);
    
   
            if (!conta) {
                await t.rollback();
                return { message:conta.message, status:  conta.status};
            }
    
            const saldoAtual = parseFloat(conta.saldo);
    
            const novoSaldo = saldoAtual + parseFloat(valor);
    
    
            if (novoSaldo < 0) {
                return { message: 'Saldo insuficiente', status: 400 };
            }
    
            conta.saldo = novoSaldo;
            await repository.put(contaID, novoSaldo);
    
            const tipoOperacao = valor >= 0 ? 'entrada' : 'retirada';
          
            await Transacao.create({
                conta_id: contaID,
                valor: valor,
                data_transacao: new Date(),
                tipo_operacao: tipoOperacao,
                descricao: descricao,
                usuario_id: fkUsuarioId,
                banco_id: fkBancoId
            }, { transaction: t });
            return { data: conta, status: 201 };
    
        } catch (error) {
            return {
                message: "Falha na requisição" + error,
                status: 500
            }
        }

    }

     
}

module.exports = ContaBancariaService;