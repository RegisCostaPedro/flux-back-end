const homeRepository = require('../repositories/home-repository');
const cateiraRepository = require('../repositories/carteira-repository');

class TransacaoService {

    static listarDadosHome = async (id_user, usuario_nome_token) => {
        const query = await homeRepository.get(id_user);
        if (!query || query.data == null || query.data.length === 0) {
            return { status: 204, nome_usuario: usuario_nome_token, message: "Você ainda não realizou transações" };
        }

        return { status: 200, data: query.data, nome: usuario_nome_token };


    }

    static listarHistoricoTransacao = async (id_user) => {
        const query = await cateiraRepository.get(id_user);

        if (!query || query.length === 0) {
            return {
                status: 200, message: "Você ainda não realizou transações"
            };
        }
        return { status: 200, data: query.data};

    }


}

module.exports = TransacaoService;