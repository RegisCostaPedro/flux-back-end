const homeRepository = require('../repositories/home-repository');
const cateiraRepository = require('../repositories/carteira-repository');
const Transacao = require('../models/transacao');
class TransacaoService {


    static listarDadosHome = async (id_user, usuario_nome_token) => {
        const query = await homeRepository.get(id_user);
        if (!query || query.data == null || query.data.length === 0) {
            return { status: 204, nome_usuario: usuario_nome_token, message: "Você ainda não realizou transações" };
        }

        return { status: 200, data: query.data, nome: usuario_nome_token };


    }

    static listarHistoricoTransacao = async (id_user) => {
        var query = await cateiraRepository.get(id_user);

        if (!query || query.length === 0) {
            return {
                status: 204, message: "Você ainda não realizou transações"
            };
        }

        const resultPorcentAndQuery = query.data.map(transacao => {
            let total = parseFloat(transacao.saldoTotalGeral);
            let valor = parseFloat(transacao.valor);
            let tipo_operacao = transacao.tipo_operacao;

            if (tipo_operacao == 'entrada') {
                let aumentoPorcent = ((valor / total) * 100);
                console.log(`Aumento Percentual: ${aumentoPorcent.toFixed(3)}%`);
                return {
                    ...transacao,
                    porcentagem: `${aumentoPorcent.toFixed(3)}%`
                }
            }
            else if (tipo_operacao == 'retirada') {
                let diminuicaoPorcent = ((valor / total) * 100);
                console.log(`Diminuição Percentual: ${diminuicaoPorcent.toFixed(3)}%`);

                return {
                    ...transacao,
                    porcentagem: `${diminuicaoPorcent.toFixed(3)}%`
                }
            }

        });

        return { status: 200, data: resultPorcentAndQuery };

    }


}

module.exports = TransacaoService;