const Conta = require('../models/conta');
const Transacao = require('../models/transacao');
const Usuario = require('../models/usuario');

const repository = require('../repositories/conta-bancaria-repository');


class ContaBancariaService {

    static atualizarSaldo = async (contaID, valor, fkUsuarioId,descricao) => {

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
            return { message: 'Esta conta já pertence a um usuário', status: 403 };
        }

        const conta = await repository.getById(contaID);


        if (!conta) {
            return { message: 'Conta não encontrada', status: 404 };
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
            usuario_id: fkUsuarioId
        });
        return { data: conta, status: 201 };

    }

}

module.exports = ContaBancariaService;