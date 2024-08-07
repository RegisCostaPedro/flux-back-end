const repostory = require('../repositories/home-repository');
const authService = require('../services/auth-service');
class HomeController {

    static renderHome = async (req, res) => {
        try{

        
        //Recupera o token
        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        // Decodifica o token
        const data = await authService.decodeToken(token);
        const usuario_id_token = data.id;
        const usuario_nome_token = data.nome

        const response = await repostory.get(usuario_id_token,usuario_nome_token);

        if(response.status === 200){
          
            return res.status(response.status).json(response.data);
         
        }else{
            return res.status(response.status).json({message: response.data})
        }
    }catch(error){
        res.status(500).send({
            message: "Falha ao processar requisição" + error
        })
    }
    }
}

module.exports = HomeController;