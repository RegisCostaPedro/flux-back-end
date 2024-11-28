var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/config/database.js
var require_database = __commonJS({
  "src/config/database.js"(exports2, module2) {
    var { Sequelize } = require("sequelize");
    var conexao2 = new Sequelize("flux_db_teste", "root", "", {
      host: "localhost",
      dialect: "mysql",
      define: {
        timestamps: false,
        freezeTableName: true
      }
    });
    module2.exports = conexao2;
  }
});

// src/config/config.js
var require_config = __commonJS({
  "src/config/config.js"(exports2, module2) {
    global.SALT_KEY = "5fbee1a43e26a53a1c62a7f1";
    global.EMAIL_TMPL = "<strong>{0}</strong>";
    module2.exports = {
      sendgridKey: "TBD",
      containerConnectionString: "TBD"
    };
  }
});

// src/routes/index-route.js
var require_index_route = __commonJS({
  "src/routes/index-route.js"(exports2, module2) {
    var express2 = require("express");
    var router = express2.Router();
    router.get("/", (req, res, next) => {
      res.status(200).send({
        title: "Flux",
        version: "0.0.28"
      });
    });
    module2.exports = router;
  }
});

// src/models/usuario.js
var require_usuario = __commonJS({
  "src/models/usuario.js"(exports2, module2) {
    var conexao2 = require_database();
    var { DataTypes, Model } = require("sequelize");
    var Usuario = class extends Model {
      static init(sequelize) {
        return super.init({
          id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          nome: {
            type: DataTypes.STRING,
            allowNull: false
          },
          cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
          },
          senha: {
            type: DataTypes.STRING,
            allowNull: false
          },
          roles: {
            type: DataTypes.ENUM("usuario", "admin"),
            allowNull: false
          },
          verifyCode: {
            type: DataTypes.INTEGER(6),
            allowNull: true
          },
          status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 0
          }
        }, {
          sequelize,
          modelName: "Usuario",
          tableName: "usuario"
        });
      }
    };
    Usuario.init(conexao2);
    module2.exports = Usuario;
  }
});

// src/repositories/usuario-repository.js
var require_usuario_repository = __commonJS({
  "src/repositories/usuario-repository.js"(exports2, module2) {
    var { where } = require("sequelize");
    var Usuario = require_usuario();
    var bcrypt = require("bcrypt");
    var UsarioRepository = class {
      //Buscar todos usuários
      static get = async () => {
        const res = await Usuario.findAll();
        return res;
      };
      // Buscar pelo id
      static getById = async (id) => {
        const res = await Usuario.findByPk(id);
        if (!res) {
          return { message: "Usu\xE1rio n\xE3o encontrado", status: 404 };
        }
        return { data: res, status: 200 };
      };
      // Buscar pela pk
      static getByPk = async (id) => {
        const res = await Usuario.findByPk(id);
        return res;
      };
      //Cadastrar usuário
      static post = async (body) => {
        const usuario = await Usuario.create(body);
        if (!usuario) {
          return { message: "Erro ao criar usu\xE1rio", status: 400 };
        }
        return { data: usuario, status: 201 };
      };
      //Atualizar usuário
      static put = async (id, body) => {
        const res = await Usuario.findByPk(id).then((usuarioEncontrado) => {
          return usuarioEncontrado.update(body);
        });
        if (!res) {
          return { message: "Erro ao atualizar usu\xE1rio", status: 400 };
        }
        return { data: res, status: 201 };
      };
      //Deletar usuário
      static delete = async (id) => {
        const res = await Usuario.findOne({ where: { id_usuario: id } });
        const usuarioEncontrado = await Usuario.findOne({ where: { id_usuario: id } });
        if (!usuarioEncontrado) {
          return { message: "Usu\xE1rio n\xE3o encontrado", status: 404 };
        }
        await usuarioEncontrado.destroy();
        return { message: "Usu\xE1rio deletado com sucesso!", status: 200 };
      };
      //Autenticar usuário (login)
      static autenticar = async (data) => {
        console.log(data.email);
        console.log(data.email);
        console.log(data.email);
        console.log(data.email);
        const usuario = await Usuario.findOne({
          where: {
            email: data.email
          }
        });
        if (!usuario) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(data.senha, usuario.senha);
        if (!isPasswordValid) {
          return null;
        }
        return usuario;
      };
      static findByVerifyCode = async (codigo) => {
        const codigoEncontrado = await Usuario.findOne(
          {
            where: {
              verifyCode: codigo
            }
          }
        );
        if (!codigoEncontrado) {
          return {
            message: "Erro ao verificar c\xF3digo",
            status: 400
          };
        }
        const res = await this.ativarConta(codigoEncontrado.verifyCode);
        if (res) {
          return { data: "Conta ativada", status: 200 };
        }
      };
      static ativarConta = async (codigo) => {
        const res = await Usuario.update({ status: 1, verifyCode: null }, { where: { verifyCode: codigo } });
        if (!res) {
          return {
            message: "Erro ao verificar c\xF3digo",
            status: 400
          };
        }
        return res;
      };
    };
    module2.exports = UsarioRepository;
  }
});

// src/validators/fluent-validator.js
var require_fluent_validator = __commonJS({
  "src/validators/fluent-validator.js"(exports2, module2) {
    "use strict";
    var errors = [];
    function ValidationContract() {
      errors = [];
    }
    ValidationContract.prototype.isRequired = (value, message) => {
      if (!value || value.length <= 0)
        errors.push({ message });
    };
    ValidationContract.prototype.hasMinLen = (value, min, message) => {
      if (!value || value.length < min)
        errors.push({ message });
    };
    ValidationContract.prototype.hasMaxLen = (value, max, message) => {
      if (!value || value.length > max)
        errors.push({ message });
    };
    ValidationContract.prototype.isFixedLen = (value, len, message) => {
      if (value.length != len)
        errors.push({ message });
    };
    ValidationContract.prototype.isEmail = (value, message) => {
      var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
      if (!reg.test(value))
        errors.push({ message });
    };
    ValidationContract.prototype.errors = () => {
      return errors;
    };
    ValidationContract.prototype.clear = () => {
      errors = [];
    };
    ValidationContract.prototype.isValid = () => {
      return errors.length == 0;
    };
    module2.exports = ValidationContract;
  }
});

// src/services/auth-service.js
var require_auth_service = __commonJS({
  "src/services/auth-service.js"(exports2, module2) {
    var jwt = require("jsonwebtoken");
    var AuthService = class _AuthService {
      static generateToken = async (data) => {
        const TokenExpirationTime = "1d";
        return jwt.sign(data, global.SALT_KEY, { expiresIn: TokenExpirationTime });
      };
      static decodeToken = async (token) => {
        try {
          return await jwt.verify(token, global.SALT_KEY);
        } catch (error) {
          throw new Error("Token inv\xE1lido ou expirado.");
        }
      };
      static authorize = async (req, res, next) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          if (!token) {
            return res.status(401).json({ message: "Acesso restrito: token n\xE3o fornecido." });
          }
          await _AuthService.decodeToken(token);
          next();
        } catch (error) {
          res.status(401).json({ message: "Token inv\xE1lido ou expirado." });
        }
      };
      static isAdmin = async (req, res, next) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          if (!token) {
            return res.status(401).json({ message: "Acesso restrito: token n\xE3o fornecido." });
          }
          const decoded = await _AuthService.decodeToken(token);
          if (decoded.roles && decoded.roles.includes("admin")) {
            next();
          } else {
            res.status(403).json({ message: "Acesso restrito: administrador necess\xE1rio." });
          }
        } catch (error) {
          res.status(401).json({ message: "Token inv\xE1lido ou expirado." });
        }
      };
    };
    module2.exports = AuthService;
  }
});

// src/services/mail-service.js
var require_mail_service = __commonJS({
  "src/services/mail-service.js"(exports2, module2) {
    var nodemailer = require("nodemailer");
    var MailService = class _MailService {
      static enviarEmail = async (email, nome, verifyCode) => {
        console.log(email, nome, verifyCode);
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "regiscostapedro0705@gmail.com",
            pass: "ieowliboebqvmyhm"
          }
        });
        const mailOptions = {
          from: "Banco Flux <regiscostapedro0707@gmail.com>",
          to: email,
          subject: "Banco Flux - Verifica\xE7\xE3o de Conta",
          html: (await _MailService.emailTemplate(nome, verifyCode)).toString()
        };
        try {
          await transporter.sendMail(mailOptions);
          console.log("E-mail enviado com sucesso!");
        } catch (error) {
          console.error("Erro ao enviar e-mail:", error);
        }
      };
      static emailTemplate = async (nome, verifyCode) => {
        return `  <!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
	<link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
        color: black;
  background-color: white; 
		}

@media (prefers-color-scheme: dark) {
  body {
    color: white; /* Cor do texto no tema escuro */
    background-color: black; /* Fundo no tema escuro */
  }
}
		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		sup,
		sub {
			font-size: 75%;
			line-height: 0;
		}

		@media (max-width:500px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}

			.row-2 .column-1 .block-1.image_block .alignment div {
				margin: 0 auto 0 0 !important;
			}

			.row-4 .column-1 .block-1.paragraph_block td.pad>div {
				font-size: 12px !important;
			}

			.row-1 .column-1 {
				padding: 30px 20px !important;
			}
		}
	</style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
</head>

<body class="body" style="background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-left: 12px solid #4285f4; border-radius: 0; border-right: 12px solid #4285f4; border-top: 20px solid #4285f4; color: #000000; width: 480px; margin: 0 auto;" width="480">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-left: 20px; padding-right: 20px; padding-top: 20px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
																<div class="alignment" align="left" style="line-height:10px">
																	<div style="max-width: 264px;"><img src="https://8c00719fd4.imgdist.com/pub/bfra/27ab661h/i3z/i0o/3ce/Frame%202logopreto%20%281%29_1.png" style="display: block; height: auto; border: 0; width: 100%;" width="264" alt title height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
													<table class="divider_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #4285f4;"><span style="word-break: break-word;">&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-3 mobile_hide" style="height:10px;line-height:10px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-bottom: 3px solid #4285f4; border-left: 12px solid #4285f4; border-radius: 0; border-right: 12px solid #4285f4; color: #000000; width: 480px; margin: 0 auto;" width="480">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-left: 25px; padding-right: 50px; vertical-align: top; border-radius: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 381px;"><img src="https://8c00719fd4.imgdist.com/pub/bfra/27ab661h/moy/3cw/98b/Cart%C3%A3o%20de%20visita%20de%20psicanalista%20colorido%20rosa%20e%20branco.png" style="display: block; height: auto; border: 0; width: 100%;" width="381" alt title height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-bottom: 3px solid #4285f4; border-left: 12px solid #4285f4; border-radius: 0; border-right: 12px solid #4285f4; color: #000000; width: 480px; margin: 0 auto;" width="480">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#101112;direction:ltr;font-family:Fira Sans, Lucida Sans Unicode, Lucida Grande, sans-serif;font-size:21px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:31.5px;">
																	<p style="margin: 0;">Ol\xE1 ${nome}, verifique sua conta para concluir seu cadastro!</p>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-2" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-left: 12px solid #4285f4; border-right: 12px solid #4285f4; border-radius: 0; color: #000000; background-color: #e9edf5; border-bottom: 3px solid #4285f4; width: 480px; margin: 0 auto;" width="480">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#101112;direction:ltr;font-family:Fira Sans, Lucida Sans Unicode, Lucida Grande, sans-serif;font-size:17px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:20.4px;">
																	<p style="margin: 0;">Cole o c\xF3digo abaixo no seu aplicativo Flux para se juntar a n\xF3s!</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-left: 12px solid #4285f4; border-right: 12px solid #4285f4; border-radius: 0; color: #000000; background-color: #cccccc; border-bottom: 30px solid #4285f4; width: 480px; margin: 0 auto;" width="480">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
													<table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<h1 style="margin: 0; color: #000000; direction: ltr; font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif; font-size: 70px; font-weight: 500; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 84px;"><span class="tinyMce-placeholder" style="word-break: break-word;">
                                                                ${verifyCode}</span></h1>
															</td>
														</tr>
													</table>
													<table class="divider_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 3px solid #4285f4;"><span style="word-break: break-word;">&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000; border-radius: 0; color: #000000; width: 480px; margin: 0 auto;" width="480">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 30px; padding-left: 20px; padding-right: 20px; padding-top: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-bottom:10px;width:100%;">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 215px;"><img src="https://8c00719fd4.imgdist.com/pub/bfra/27ab661h/lgp/faw/a3v/e356366d-af97-4215-b4eb-0da7a4de58a7.svg" style="display: block; height: auto; border: 0; width: 100%;" width="215" alt title height="auto"></div>
																</div>
															</td>
														</tr>
													</table>
													<table class="divider_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">

                              
																<div class="alignment" align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #E4DAFF;"><span style="word-break: break-word;">&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:5px;padding-top:5px;">
																<div style="color:#444a5b;direction:ltr;font-family:'Inter','Arial';font-size:14px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
																	<p style="margin: 0;">\xA9 FLUX</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
						<tbody>
            
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 480px; margin: 0 auto;" width="480">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center; line-height: 0;">
														<tr>
															<td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
																<!--[if !vml]><!-->
																<table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
																	<tr>
																		<td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="http://designedwithbeefree.com/" target="_blank" style="text-decoration: none;"><img class="icon" alt="Beefree Logo" src="https://d1oco4z2z1fhwp.cloudfront.net/assets/Beefree-logo.png" height="auto" width="34" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
																		<td style="font-family: 'Inter', sans-serif; font-size: 15px; font-weight: undefined; color: #1e0e4b; vertical-align: middle; letter-spacing: undefined; text-align: center; line-height: normal;"><a href="http://designedwithbeefree.com/" target="_blank" style="color: #1e0e4b; text-decoration: none;">Designed with Beefree</a></td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
                  <div class="bee-row bee-row-6">
		
								</td>
							</tr>
						</tbody>
					</table>
					  <table><!-- Footer Section -->
      <tr>
        <td class="footer">
          <p>Comece agora com o flux! \u{1FA75}</p>
          <div class="divider" style="border-top: 1px solid #e4daff"></div>
          <p>\xA9 FLUX</p>
        </td>
      </tr>
    </table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>`;
      };
    };
    module2.exports = MailService;
  }
});

// src/services/usuario-service.js
var require_usuario_service = __commonJS({
  "src/services/usuario-service.js"(exports2, module2) {
    var Usuario = require_usuario();
    var repository = require_usuario_repository();
    var bcrypt = require("bcrypt");
    var jwt = require("jsonwebtoken");
    require("dotenv").config();
    var mailService = require_mail_service();
    var nodemailer = require("nodemailer");
    var UsuarioService = class {
      static get = async (id_usuario) => {
        const listUsuarios = await repository.get(id_usuario);
        if (!listUsuarios) {
          return { message: "Sem usu\xE1rios encontrados", status: 400 };
        }
        return { data: listUsuarios, status: 200 };
      };
      static getById = async (id) => {
        const usuario = await repository.getById(id);
        if (!usuario.data) {
          return { message: usuario.message, status: usuario.status };
        }
        return { data: usuario.data, status: usuario.status };
      };
      static create = async (nome, cpf, email, senha) => {
        try {
          const verifyCode = this.generateVerifyCode();
          const cpfExistente = await Usuario.findOne({ where: { cpf } });
          const emailExistente = await Usuario.findOne({ where: { email } });
          if (cpf.length < 11) {
            return { message: "Quantidade de caracteres inv\xE1lidos", status: 403 };
          }
          if (cpfExistente) {
            return { message: "Este CPF j\xE1 pertence a outro usu\xE1rio", status: 403 };
          }
          if (emailExistente) {
            return { message: "Este email j\xE1 pertence a outro usu\xE1rio", status: 403 };
          }
          const hashedPassword = await bcrypt.hash(senha, 10);
          const emailEnviado = await mailService.enviarEmail(email, nome, verifyCode);
          const usuario = await repository.post({
            nome,
            cpf,
            email,
            senha: hashedPassword,
            roles: "usuario",
            verifyCode
          });
          if (usuario.status !== 201) {
            return { message: usuario.message, status: usuario.status };
          }
          return { data: usuario.data, status: 201 };
        } catch (error) {
          console.error("Erro ao criar usu\xE1rio no servi\xE7o:", error);
          return { message: "Erro ao criar usu\xE1rio", status: 500 };
        }
      };
      static validarCodigoDeConfirmacao = async (codigoDeConfirmacao) => {
        const codigo = codigoDeConfirmacao;
        const codigoValidado = await repository.findByVerifyCode(codigo);
        if (codigoValidado.status === 400) {
          return { message: codigoValidado.message, status: codigoValidado.status };
        }
        return { data: codigoValidado.data, status: codigoValidado.status };
      };
      static update = async (id, body) => {
        try {
          const senha = body.senha;
          const usuario = await repository.put(id, {
            nome: body.nome,
            cpf: body.cpf,
            email: body.email,
            senha
          });
          if (usuario.status !== 201) {
            return { message: usuario.message, status: usuario.status };
          }
          return { data: usuario.data, status: 201 };
        } catch (error) {
          console.error("Erro ao criar usu\xE1rio no servi\xE7o:", error);
          return { message: "Erro ao atualizar usu\xE1rio", status: 500 };
        }
      };
      static generateVerifyCode() {
        let code = Math.floor(Math.random() * 1e6);
        return parseInt(code.toString().padStart(6, 0));
      }
    };
    module2.exports = UsuarioService;
  }
});

// src/controllers/usuario-controller.js
var require_usuario_controller = __commonJS({
  "src/controllers/usuario-controller.js"(exports2, module2) {
    var repository = require_usuario_repository();
    var bcrypt = require("bcrypt");
    var jwt = require("jsonwebtoken");
    var ValidationContract = require_fluent_validator();
    var authService = require_auth_service();
    var { Model } = require("sequelize");
    var service = require_usuario_service();
    var UsuarioController = class {
      //Buscar todos usuários
      static listarUsuarios = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const data = await authService.decodeToken(token);
          const id_usuario = data.id;
          const usuarioList = await service.get(id_usuario);
          if (!usuarioList.data) {
            return res.status(usuarioList.status).send({
              message: usuarioList.message
            });
          }
          res.status(usuarioList.status).send(usuarioList.data);
        } catch (error) {
          res.status(400).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      //Buscar usuario pelo id
      static buscarUsuarioPeloID = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const data = await authService.decodeToken(token);
          const id = req.params.id;
          const usuario = await service.getById(id);
          if (!usuario.data) {
            return res.status(usuario.status).send({
              message: usuario.message
            });
          }
          return res.status(usuario.status).send(usuario.data);
        } catch (error) {
          res.status(400).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      //Cadastrar usuário
      static cadastrarUsuario = async (req, res) => {
        try {
          let contract = new ValidationContract();
          contract.isEmail(req.body.email, "Email inv\xE1lido");
          contract.hasMinLen(req.body.senha, 3, "O senha deve conter pelo menos 3 caracteres");
          if (!contract.isValid()) {
            res.status(400).send(contract.errors()).end();
            return;
          }
          const { nome, cpf, email, senha } = req.body;
          const usuario = await service.create(nome, cpf, email, senha);
          if (usuario.status === 201) {
            res.status(201).json(usuario.data);
          } else {
            res.status(usuario.status).send({ message: usuario.message });
          }
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      static validarConta = async (req, res) => {
        const codigoDeConfirmacao = req.body.codigoDeConfirmacao;
        const response = await service.validarCodigoDeConfirmacao(codigoDeConfirmacao);
        this.cadastrarUsuario;
        if (response.status === 200) {
          return res.status(response.status).json(response.data);
        } else {
          return res.status(response.status).send({ message: response.message });
        }
      };
      //Atualizar usuário
      static atualizarUsuario = async (req, res) => {
        try {
          const usuario = await service.update(req.params.id, req.body);
          if (usuario.status === 201) {
            return res.status(201).send(usuario.data);
          } else {
            return res.status(usuario.status).send({ message: usuario.message });
          }
        } catch (error) {
          return res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      //Deletar usuário
      static deletarUsuario = async (req, res) => {
        try {
          const resultado = await repository.delete(req.params.id);
          return res.status(resultado.status).json({ message: resultado.message });
        } catch (error) {
          res.status(404).send({
            message: "Falha ao processar requisi\xE7\xE3o"
          });
        }
      };
      //Autenticar usuário (login)
      static autenticar = async (req, res) => {
        try {
          console.log("senha: req.body.senha: ", req.body.senha);
          const usuario = await repository.autenticar({
            email: req.body.email,
            senha: req.body.senha
          });
          if (!usuario) {
            res.status(404).send({
              message: "email ou senha inv\xE1lidos"
            });
            return;
          }
          const token = await authService.generateToken({
            id: usuario.id_usuario,
            email: usuario.email,
            nome: usuario.nome,
            roles: usuario.roles
          });
          res.status(201).send({
            token
          });
        } catch (error) {
          console.error("Erro ao autenticar usuario:", error);
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o"
          });
        }
      };
      static recuperarSenha = async (req, res) => {
      };
      // Refresh token
      static refreshToken = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const data = await authService.decodeToken(token);
          const usuario_id_token = data.id;
          const usuario = await repository.getById(usuario_id_token);
          if (!usuario || !usuario.data) {
            res.status(404).send({ message: "Usu\xE1rio n\xE3o encontrado" });
            return;
          }
          const tokenData = await authService.generateToken({
            id: usuario.data.id_usuario,
            email: usuario.data.email,
            nome: usuario.data.nome,
            roles: usuario.data.roles
          });
          return res.status(201).send({
            token: tokenData
          });
        } catch (error) {
          console.error("Erro ao autenticar cliente:", error);
          res.status(500).send({
            message: "Falha ao processar sua requisi\xE7\xE3o"
          });
        }
      };
    };
    module2.exports = UsuarioController;
  }
});

// src/routes/usuario-route.js
var require_usuario_route = __commonJS({
  "src/routes/usuario-route.js"(exports2, module2) {
    var express2 = require("express");
    var router = express2.Router();
    var controller = require_usuario_controller();
    var authService = require_auth_service();
    router.post("/cadastro-usuario", controller.cadastrarUsuario);
    router.post("/login", controller.autenticar);
    router.post("/refresh-token", authService.authorize, controller.refreshToken);
    router.post("/forget-password", controller.recuperarSenha);
    router.put("/validate-account", controller.validarConta);
    router.get("/listar-usuarios", authService.authorize, controller.listarUsuarios);
    router.get("/buscar-usuario/:id", authService.authorize, controller.buscarUsuarioPeloID);
    router.get("/buscar-usuario/", authService.authorize, controller.buscarUsuarioPeloID);
    router.patch("/atualizar-usuario/:id", authService.authorize, controller.atualizarUsuario);
    router.delete("/excluir-usuario/:id", authService.authorize, controller.deletarUsuario);
    module2.exports = router;
  }
});

// src/models/banco.js
var require_banco = __commonJS({
  "src/models/banco.js"(exports2, module2) {
    var conexao2 = require_database();
    var { DataTypes, Model } = require("sequelize");
    var Banco = class extends Model {
      static init(sequelize) {
        return super.init({
          id_banco: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
          },
          id: {
            type: DataTypes.INTEGER
          },
          name: {
            type: DataTypes.STRING
          },
          code: {
            type: DataTypes.STRING
          },
          ispb: {
            type: DataTypes.STRING
          },
          image: {
            type: DataTypes.STRING
          },
          spi_participant_type: {
            type: DataTypes.ENUM("DIRETO", "INDIRETO")
          }
        }, {
          sequelize,
          modelName: "Banco",
          tableName: "banco"
        });
      }
    };
    module2.exports = Banco;
  }
});

// src/repositories/banco-repository.js
var require_banco_repository = __commonJS({
  "src/repositories/banco-repository.js"(exports2, module2) {
    var Banco = require_banco();
    var BancoRepository = class {
      //Listar bancos
      static get = async () => {
        const res = await Banco.findAll();
        if (!res) {
          return { message: "Bancos n\xE3o encontrados", status: 404 };
        }
        return { data: res, status: 200 };
      };
      // Cadastrar banco
      static post = async (body) => {
        console.log(body.id_banco);
        console.log(body.code);
        console.log(body.ispb);
        console.log(body.name);
        console.log(body.id);
        console.log(body);
        console.log(body);
        const res = await Banco.create(body);
        return { data: res, status: 201 };
      };
      // Atualizar banco pelo ID
      static put = async (id, body) => {
        const res = await Banco.findByPk(id).then((bancoEncontrado) => {
          if (!bancoEncontrado || bancoEncontrado === null) {
            return console.log("Banco n\xE3o encontrado");
          }
          return bancoEncontrado.update(body);
        });
        return res;
      };
      // Deletar banco pelo ID
      static delete = async (id) => {
        const res = await Banco.findByPk(id).then((BancoEncontrado) => {
          if (!BancoEncontrado || BancoEncontrado === null) {
            console.log("Banco n\xE3o encontrado");
          }
          return BancoEncontrado.destroy({
            where: {
              id
            }
          });
        });
        return res;
      };
      // Buscar banco pelo ID
      static getById = async (id) => {
        const res = await Banco.findByPk(id);
        return res;
      };
      static findOneByName = async (name) => {
        const res = await Banco.findOne(name);
        return res;
      };
    };
    module2.exports = BancoRepository;
  }
});

// src/models/pix.js
var require_pix = __commonJS({
  "src/models/pix.js"(exports2, module2) {
    var conexao2 = require_database();
    var { Sequelize, DataTypes, Model, DATE } = require("sequelize");
    var Pix = class extends Model {
      static init(sequelize) {
        return super.init({
          id_pix: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
          },
          key: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
          },
          key_type: {
            type: Sequelize.ENUM("EMAIL", "CNPJ", "TELEFONE", "CHAVE_ALEATORIA"),
            allowNull: false
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: false
          },
          updated_at: {
            type: DataTypes.DATE,
            allowNull: false
          },
          status: {
            type: Sequelize.ENUM("VALIDANDO", "PENDENTE", "REGISTRADA", "ERRO"),
            allowNull: false
          }
        }, {
          sequelize,
          modelName: "Pix",
          tableName: "pix"
        });
      }
    };
    module2.exports = Pix;
  }
});

// src/services/auth-transfeera-service.js
var require_auth_transfeera_service = __commonJS({
  "src/services/auth-transfeera-service.js"(exports2, module2) {
    var { where } = require("sequelize");
    var Pix = require_pix();
    var axios = require("axios");
    require("dotenv").config();
    var PixAuthService = class {
      static returnAccessToken = async () => {
        const body = {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "client_credentials"
        };
        try {
          const response = await axios.post("https://login-api-sandbox.transfeera.com/authorization", body);
          if (response.data && response.data.access_token) {
            return response.data.access_token;
          } else {
            throw new Error("Failed to retrieve access token");
          }
        } catch (error) {
          console.error("Error obtaining access token:", error);
          throw error;
        }
      };
    };
    module2.exports = PixAuthService;
  }
});

// src/services/banco-transfeera-service.js
var require_banco_transfeera_service = __commonJS({
  "src/services/banco-transfeera-service.js"(exports2, module2) {
    var { where } = require("sequelize");
    var Pix = require_pix();
    var axios = require("axios");
    var authServiceAPI = require_auth_transfeera_service();
    var authService = require_auth_service();
    var bancoRepository = require_banco_repository();
    require("dotenv").config();
    var BancoService = class {
      static returnListBanks = async (USUARIO_TOKEN, nomeInstituicao) => {
        try {
          const res = await bancoRepository.get();
          if (res) {
            return { data: res.data, status: res.status };
          }
        } catch (error) {
          console.error("Error obtaining list of banks:", error);
          throw error;
        }
      };
      static cadastrarInstituicoes = async (USUARIO_TOKEN) => {
        try {
          const accessToken = await authServiceAPI.returnAccessToken();
          const options = {
            method: "GET",
            url: `https://api-sandbox.transfeera.com/bank?pix=true`,
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "user-Agent": USUARIO_TOKEN.email,
              Authorization: `Bearer ${accessToken}`
            }
          };
          const response = await axios.request(options);
          let bancos = response.data;
          const cadastrandoBancos = await Promise.all(bancos.map(async (banco2) => {
            const { id, name, code = "DEFAULT_CODE", ispb, image, spi_participant_type } = banco2;
            if (!name || !ispb || !spi_participant_type) {
              throw new Error(`Dados inv\xE1lidos para o banco com id ${id}`);
            }
            return bancoRepository.post({
              id,
              name,
              code,
              ispb,
              image,
              spi_participant_type
            });
          }));
          return bancos;
        } catch (error) {
          console.error("Error obtaining list of banks:", error);
          throw error;
        }
      };
      static findBankById = (banks, bankId) => {
        return banks.find((bank) => bank.id === bankId);
      };
    };
    module2.exports = BancoService;
  }
});

// src/controllers/banco-controller.js
var require_banco_controller = __commonJS({
  "src/controllers/banco-controller.js"(exports2, module2) {
    var repository = require_banco_repository();
    var ValidationContract = require_fluent_validator();
    var bancoService = require_banco_transfeera_service();
    var authService = require_auth_service();
    var BancoController = class {
      //Buscar todos os bancos com transfeera api
      static listarBancos = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const bancoList = await repository.get();
          console.log(bancoList);
          if (!bancoList) {
            res.status(404).send({
              message: "Banco n\xE3o encontrado"
            });
            return;
          }
          console.log(bancoList.name);
          res.status(200).send(bancoList.data);
        } catch (error) {
          res.status(400).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      static consultarBancos = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const nomeInstituicao = req.body.instituicao;
          const bancoList = await bancoService.returnListBanks(dadosUsuario, nomeInstituicao);
          if (!bancoList) {
            res.status(404).send({
              message: "Banco n\xE3o encontrado"
            });
            return;
          }
          res.status(200).send(bancoList);
        } catch (error) {
          res.status(400).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      //Cadastrar banco
      static cadastrarBanco = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const cadastrar = req.body.cadastrar;
          const bancosCadastrados = await bancoService.cadastrarInstituicoes(dadosUsuario);
          if (bancosCadastrados.status === 201) {
            res.status(201).send(bancosCadastrados.data);
          } else {
            res.status(bancosCadastrados.status).send({ message: banco.message });
          }
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o" + error
          });
        }
      };
      // Atualizar Banco
      static atualizarBanco = async (req, res) => {
        try {
          const banco2 = await repository.put(req.params.id, req.body);
          console.log(banco2);
          return res.status(201).send(banco2);
        } catch (error) {
          return res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o " + error
          });
        }
      };
      // Deletar Banco
      static deletarBanco = async (req, res) => {
        try {
          const banco2 = await repository.delete(req.params.id);
          return res.status(200).send({
            message: "Banco deletado com sucesso!"
          });
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o"
          });
        }
      };
      // Buscar bancos pelo id
      static listarBancosPorId = async (req, res) => {
        try {
          const banco2 = await repository.getById(req.params.id);
          if (!banco2) {
            res.status(404).send({
              message: "Banco n\xE3o encontrado"
            });
            return;
          }
          res.status(200).send(banco2);
        } catch (error) {
          res.status(400).send({
            message: "Falha ao processar requisi\xE7\xE3o" + error
          });
        }
      };
    };
    module2.exports = BancoController;
  }
});

// src/routes/banco-route.js
var require_banco_route = __commonJS({
  "src/routes/banco-route.js"(exports2, module2) {
    var express2 = require("express");
    var controller = require_banco_controller();
    var router = express2.Router();
    var authService = require_auth_service();
    router.post("/cadastro-banco", authService.isAdmin, controller.cadastrarBanco);
    router.get("/listar-bancos", authService.authorize, controller.listarBancos);
    router.get("/buscar-banco/id/:id", authService.authorize, controller.listarBancosPorId);
    router.put("/atualizar-banco/:id", authService.authorize, controller.atualizarBanco);
    router.delete("/excluir-banco/:id", authService.authorize, controller.deletarBanco);
    router.get("/instituicoes", controller.consultarBancos);
    module2.exports = router;
  }
});

// src/models/conta-bancaria.js
var require_conta_bancaria = __commonJS({
  "src/models/conta-bancaria.js"(exports2, module2) {
    var conexao2 = require_database();
    var { DataTypes, Model } = require("sequelize");
    var ContaBancaria = class extends Model {
      static init(sequelize) {
        return super.init({
          id_conta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
          },
          usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "usuario",
              key: "id_usuario",
              onDelete: "CASCADE",
              onUpdate: "CASCADE"
            }
          },
          banco_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "banco",
              key: "id_banco",
              onDelete: "CASCADE",
              onUpdate: "CASCADE"
            }
          },
          saldo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
          },
          tipo_conta: {
            type: DataTypes.ENUM("CORRENTE", "POUPANCA", "SALARIO"),
            defaultValue: "SALARIO",
            allowNull: false
          }
        }, {
          sequelize,
          modelName: "Conta",
          tableName: "conta_bancaria"
        });
      }
    };
    ContaBancaria.init(conexao2);
    module2.exports = ContaBancaria;
  }
});

// src/repositories/conta-bancaria-repository.js
var require_conta_bancaria_repository = __commonJS({
  "src/repositories/conta-bancaria-repository.js"(exports2, module2) {
    var Conta = require_conta_bancaria();
    var Usuario = require_usuario();
    var Banco = require_banco();
    var ContaBancariaRepository = class {
      // listar contas bancarias  do usuario
      static get = async (usuario_id_TOKEN) => {
        const contaEncontrada = await Conta.findAll({
          include: [
            {
              model: Banco,
              attributes: ["id_banco", "name", "image"]
            }
          ],
          where: {
            usuario_id: usuario_id_TOKEN
          }
        });
        console.log(contaEncontrada);
        if (!contaEncontrada) {
          return {
            message: "Conta n\xE3o encontrada ou inexistente",
            status: 404
          };
        }
        const res = contaEncontrada;
        return { data: res, status: 200 };
      };
      // cadastrar conta bancaria
      static post = async (body) => {
        console.log("Request Body:", body);
        const tipo_conta = body.tipo_conta.toUpperCase();
        const usuario = await Usuario.findByPk(body.fkUsuarioId);
        const banco2 = await Banco.findByPk(body.fkBancoId);
        console.log("Banco ID:", body.fkBancoId);
        if (!usuario) {
          return {
            message: `O usu\xE1rio com o ID ${body.fkUsuarioId} n\xE3o foi encontrado`,
            status: 404
          };
        }
        if (!banco2) {
          return { message: "Banco n\xE3o encontrado", status: 404 };
        }
        const res = await Conta.create({
          usuario_id: body.fkUsuarioId,
          banco_id: body.fkBancoId,
          saldo: body.saldo,
          tipo_conta
        });
        return { data: res, status: 201 };
      };
      // atualizar conta bancaria do usuário
      static put = async (contaBancaria_id, novoSaldo, fkUsuarioId) => {
        const contaEncontrada = await Conta.findByPk(contaBancaria_id);
        if (!contaEncontrada) {
          return { message: "Conta n\xE3o encontrada", status: 404 };
        }
        const res = await contaEncontrada.update({ saldo: novoSaldo });
        return { data: res, status: 201 };
      };
      // deletar conta bancaria do usuário
      static delete = async (id, usuario_id_TOKEN) => {
        const usuario_id = usuario_id_TOKEN;
        const usuario = await Conta.findOne({ where: { usuario_id } });
        const banco2 = await Conta.findOne({ where: { usuario_id } });
        if (!usuario) {
          return {
            message: `Voc\xEA ainda n\xE3o possui uma conta bancaria para deleta-l\xE1`,
            status: 404
          };
        }
        if (!banco2) {
          return { message: "Banco n\xE3o encontrado", status: 404 };
        }
        const contaEncontrada = await Conta.findOne({
          where: {
            id_conta: id,
            usuario_id
          }
        });
        if (!contaEncontrada) {
          return {
            message: "Conta n\xE3o encontrada ou inexistente",
            status: 404
          };
        }
        if (contaEncontrada.usuario_id !== usuario_id) {
          return {
            message: "Esta conta n\xE3o pertence a voc\xEA",
            status: 403
          };
        }
        await contaEncontrada.destroy();
        return {
          message: "Conta deletada com sucesso.",
          status: 200
        };
      };
      // Buscar uma conta bancaira do usuário
      static findOne = async (body) => {
        const res = await Conta.findOne({
          where: {
            id_conta: body.contaBancaria_id,
            usuario_id: body.usuario_id
          }
        });
        if (!res) {
          return { message: "Voc\xEA n\xE3o possui contas bancarias registradas", status: 404 };
        }
        return { data: res, status: 200 };
      };
      // Buscar conta bancaira pelo PK dela
      static getById = async (id) => {
        const res = await Conta.findByPk(id);
        if (!res || res === null || res === void 0) {
          return { message: "Voc\xEA n\xE3o possui contas bancarias criadas", status: 404 };
        }
        return { data: res, status: 200 };
      };
    };
    module2.exports = ContaBancariaRepository;
  }
});

// src/models/conta-bancos.js
var require_conta_bancos = __commonJS({
  "src/models/conta-bancos.js"(exports2, module2) {
    var { DataTypes, Model, Sequelize } = require("sequelize");
    var Usuario = require_usuario();
    var ContaBancaria = require_conta_bancaria();
    var Banco = require_banco();
    var ContaBancos = class extends Model {
      static init(sequelize) {
        return super.init(
          {
            id_contaBancos: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            pix_id: {
              type: Sequelize.UUID,
              allowNull: true,
              references: {
                model: "pix",
                key: "id_pix",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
              }
            },
            // usuario_id: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false,
            //     references: {
            //         model: Usuario,
            //         key: 'id_usuario',
            //         onDelete: 'CASCADE',
            //         onUpdate: 'CASCADE'
            //     }
            // },
            contaBancaria_id: {
              type: DataTypes.INTEGER,
              allowNull: true,
              references: {
                model: ContaBancaria,
                key: "id_conta",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
              }
            },
            status: {
              type: DataTypes.ENUM("ATIVO", "INATIVO"),
              allowNull: false,
              defaultValue: "ATIVO"
            }
          },
          {
            sequelize,
            tableName: "conta_bancos",
            timestamps: true
          }
        );
      }
    };
    module2.exports = ContaBancos;
  }
});

// src/models/transacao.js
var require_transacao = __commonJS({
  "src/models/transacao.js"(exports2, module2) {
    var conexao2 = require_database();
    var { Sequelize, DataTypes, Model } = require("sequelize");
    var ContaBancos = require_conta_bancos();
    var Transacao = class extends Model {
      static init(sequelize) {
        return super.init({
          id_transacao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          conta_flux_origem_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "conta_bancos",
              key: "id_contaBancos",
              onDelete: "CASCADE",
              onUpdate: "CASCADE"
            }
          },
          data_transacao: {
            type: DataTypes.DATE,
            allowNull: false
          },
          valor: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
          },
          tipo_operacao: {
            type: DataTypes.ENUM("deposito", "retirada", "transferencia"),
            allowNull: false
          },
          descricao: {
            type: DataTypes.TEXT,
            allowNull: false
          },
          conta_bancos_destino_id: {
            type: DataTypes.INTEGER,
            allowNull: true
          }
        }, {
          sequelize,
          modelName: "Transacao",
          tableName: "transacao",
          timestamps: true
        });
      }
    };
    Transacao.init(conexao2);
    module2.exports = Transacao;
  }
});

// src/models/index.js
var require_models = __commonJS({
  "src/models/index.js"(exports2, module2) {
    var conexao2 = require_database();
    var Banco = require_banco();
    var ContaBancaria = require_conta_bancaria();
    var ContaBancos = require_conta_bancos();
    var Pix = require_pix();
    var Transacao = require_transacao();
    var Usuario = require_usuario();
    ContaBancos.init(conexao2);
    Usuario.init(conexao2);
    Banco.init(conexao2);
    ContaBancaria.init(conexao2);
    Pix.init(conexao2);
    ContaBancos.init(conexao2);
    Transacao.init(conexao2);
    Usuario.hasMany(ContaBancaria, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancaria.belongsTo(Usuario, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancos.belongsTo(Usuario, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancos.belongsTo(ContaBancaria, { foreignKey: "contaBancaria_id", onDelete: "CASCADE" });
    Pix.hasOne(ContaBancos, { foreignKey: "pix_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
    ContaBancos.belongsTo(Pix, { foreignKey: "pix_id", onDelete: "CASCADE" });
    ContaBancaria.belongsTo(Banco, { foreignKey: "banco_id" });
    Banco.hasMany(ContaBancaria, { foreignKey: "banco_id" });
    conexao2.sync({ alter: true });
    module2.exports = {
      Usuario,
      Banco,
      ContaBancaria,
      Pix,
      ContaBancos,
      Transacao
    };
  }
});

// src/repositories/pix-repository.js
var require_pix_repository = __commonJS({
  "src/repositories/pix-repository.js"(exports2, module2) {
    var { where } = require("sequelize");
    var Pix = require_pix();
    var axios = require("axios");
    var pixAuthService = require_auth_transfeera_service();
    var Usuario = require_usuario();
    var Banco = require_banco();
    var ContaBancos = require_conta_bancos();
    var { ContaBancaria } = require_models();
    require("dotenv").config();
    var PixRepository = class {
      static get = async (usuario_ID_TOKEN) => {
        const pixEncontrados = await ContaBancos.findAll({
          include: [
            {
              model: Pix,
              attributes: ["id_pix", "key", "key_type", "created_at", "status"]
            },
            {
              model: ContaBancaria,
              include: [
                {
                  model: Banco,
                  attributes: ["id_banco", "name", "image"]
                }
              ]
            }
          ],
          where: {
            usuario_id: usuario_ID_TOKEN
          },
          attributes: []
        });
        if (pixEncontrados.length === 0) {
          return {
            message: "Pix n\xE3o encontrada ou inexistente",
            status: 404
          };
        }
        return { data: pixEncontrados, status: 200 };
      };
      static post = async (body) => {
        try {
          const usuario = await Usuario.findByPk(body.usuario_id);
          const key_type = body.key_type.toUpperCase();
          if (!usuario) {
            return {
              message: `O usu\xE1rio n\xE3o encontrado`,
              status: 404
            };
          }
          const pix = await Pix.create({
            id_pix: body.id_pix,
            key: body.key,
            key_type,
            usuario_id: body.usuario_id,
            created_at: /* @__PURE__ */ new Date(),
            updated_at: /* @__PURE__ */ new Date(),
            status: key_type == "CNPJ" || key_type == "CHAVE_ALEATORIA" ? "REGISTRADA" : "VALIDANDO"
          });
          if (!pix) {
            return { status: 400, message: "Erro ao criar chave PIX" };
          }
          return { data: pix, status: 201 };
        } catch (error) {
          console.error("Error creating PIX entry:", error);
          return {
            message: "Falha ao criar criar chave PIX: " + error.message,
            status: 500
          };
        }
      };
      static findById = async (id) => {
        const pixEncontrados = await Pix.findByPk({
          where: {
            usuario_id: id
          }
        });
        if (pixEncontrados.length === 0) {
          return {
            message: "Pix n\xE3o encontrada ou inexistente",
            status: 404
          };
        }
        return { data: pixEncontrados, status: 200 };
      };
      static findByPixAndUserId = async (pixKey_id, usuario_id) => {
        const pixEncontrado = await ContaBancos.findOne({
          include: [
            {
              model: Pix,
              attributes: ["id_pix", "key", "key_type", "created_at", "status"]
            }
          ],
          where: {
            usuario_id
          },
          attributes: []
        });
        if (!pixEncontrado) {
          return {
            message: "Chave Pix n\xE3o encontrada ou inexistente",
            status: 404
          };
        }
        return { data: pixEncontrado, status: 200 };
      };
      static put = async (body) => {
        const updatePix = await Pix.update(
          {
            status: body.status
          },
          {
            where: {
              id_pix: body.id_pix
            }
          }
        );
        if (!updatePix) {
          return {
            message: "Erro ao atualizar chave",
            status: 404
          };
        }
        return { data: updatePix, status: 200 };
      };
      static delete = async (idPix) => {
        const chaveDeletada = await Pix.destroy({
          where: {
            id_pix: idPix
          }
        });
        if (chaveDeletada === 0) {
          return {
            message: "Chave n\xE3o encontrada ou n\xE3o autorizada para exclus\xE3o",
            status: 404
          };
        }
        return { status: 200 };
      };
      static findByKey = async (key) => {
        const chaveExistente = await Pix.findOne({
          where: { key }
        });
        if (chaveExistente) {
          return {
            message: "Chave PIX fornecida j\xE1 existe",
            status: 400
          };
        }
        return { data: chaveExistente, status: 200 };
      };
    };
    module2.exports = PixRepository;
  }
});

// src/repositories/conta-bancos-repository.js
var require_conta_bancos_repository = __commonJS({
  "src/repositories/conta-bancos-repository.js"(exports2, module2) {
    var pixRepository = require_pix_repository();
    var { ContaBancos, ContaBancaria, Pix, Banco } = require_models();
    var ContaBancosRepository = class {
      // listar contas bancarias  do usuario
      static get = async (usuario_id_TOKEN) => {
        console.log("REPOSITORY", usuario_id_TOKEN);
        const contaEncontrada = await ContaBancos.findAll({
          include: [
            {
              model: ContaBancaria,
              include: { model: Banco }
            },
            {
              model: Pix
            }
          ],
          where: {
            usuario_id: usuario_id_TOKEN
          }
        });
        if (!contaEncontrada) {
          return {
            message: "Voc\xEA n\xE3o possui contas banc\xE1rias dispon\xEDveis para realizar transa\xE7\xF5es",
            status: 404
          };
        }
        const res = contaEncontrada;
        return { data: res, status: 200 };
      };
      static findOne = async (body) => {
        const contaEncontrada = await ContaBancos.findOne({
          include: [{
            model: ContaBancaria
          }, { model: Pix }],
          where: {
            usuario_id: body.usuario_id,
            id_contaBancos: body.contaBancaria_id
          }
        });
        if (!contaEncontrada) {
          return {
            message: "Conta n\xE3o encontrada ou inexistente",
            status: 404
          };
        }
        const res = contaEncontrada;
        return { data: res, status: 200 };
      };
      // relacionar o pix com a conta bancos
      static post = async (body) => {
        const res = await ContaBancos.create({
          pix_id: body.id_pix,
          usuario_id: body.usuario_id,
          contaBancaria_id: body.contaBancaria_id,
          banco_id: body.banco_id
        });
        if (!res) {
          return {
            message: "Erro ao vincular chave pix e conta bancaria",
            status: 400
          };
        }
        return { data: `Chave vinculada com sucesso! 
 ${res}`, status: 201 };
      };
      // atualizar conta bancaria do usuário
      static put = async (id, novoSaldo) => {
        return await ContaBancos.update({ saldo: novoSaldo }, { where: { contaBancaria_id: id } });
      };
      // deletar conta bancaria do usuário
      static deletePix = async (idPix, usuario_id) => {
        try {
          const pixDelete = await pixRepository.delete(idPix);
          if (!pixDelete) {
            return {
              message: "Erro deletar conta bancaria",
              status: 400
            };
          }
          return { data: "Chave Pix deletada com sucesso!", status: 200 };
        } catch (error) {
          console.error(error);
          return {
            message: "Erro ao deletar entradas da tabela ContaBancos",
            status: 500
          };
        }
      };
      // Buscar conta pelo ID dela
      static getById = async (id) => {
        const res = await ContaBancos.findByPk(id);
        return res;
      };
    };
    module2.exports = ContaBancosRepository;
  }
});

// src/services/conta-bancaria-service.js
var require_conta_bancaria_service = __commonJS({
  "src/services/conta-bancaria-service.js"(exports2, module2) {
    var ContaBancaria = require_conta_bancaria();
    var Transacao = require_transacao();
    var Usuario = require_usuario();
    var repository = require_conta_bancaria_repository();
    var ContaBancosrepository = require_conta_bancos_repository();
    var sequelize = require_database();
    var ContaBancariaService = class {
      static criarContaBancaria = async (fkUsuarioId, fkBancoId, saldo, tipo_conta) => {
        try {
          const tipo_conta_normalizado = String(tipo_conta).trim().toUpperCase();
          console.log(tipo_conta_normalizado);
          if (tipo_conta_normalizado !== "POUPANCA" && tipo_conta_normalizado !== "CORRENTE" && tipo_conta_normalizado !== "SALARIO") {
            return { message: "Tipo de conta banc\xE1ria inv\xE1lido", status: 400 };
          }
          const contaBancaria = await repository.post({
            fkUsuarioId,
            fkBancoId,
            tipo_conta: tipo_conta_normalizado,
            saldo
          });
          if (!contaBancaria.data) {
            return { message: contaBancaria.message, status: contaBancaria.status || 500 };
          }
          return { data: contaBancaria.data, status: 201 };
        } catch (error) {
          console.error("Erro ao criar conta banc\xE1ria:", error);
          return {
            message: "Falha na requisi\xE7\xE3o: " + error.message,
            status: 500
          };
        }
      };
      static atualizarSaldo = async (contaID, valor, fkUsuarioId, descricao, fkBancoId, contaBancos_id) => {
        const t = await sequelize.transaction();
        try {
          const contaBancariaEncontrada = await ContaBancaria.findOne({
            where: {
              id_conta: contaID,
              usuario_id: fkUsuarioId
            }
          });
          if (!contaBancariaEncontrada) {
            await t.rollback();
            return { message: "Conta n\xE3o encontrada ou inexistente", status: 404 };
          }
          const usuario = await Usuario.findByPk(fkUsuarioId);
          if (!usuario) {
            await t.rollback();
            return { message: `Voc\xEA ainda n\xE3o possui uma conta banc\xE1ria para atualiz\xE1-la`, status: 404 };
          }
          if (contaBancariaEncontrada.usuario_id !== usuario.id_usuario) {
            await t.rollback();
            return { message: "Esta conta j\xE1 pertence a outro usu\xE1rio", status: 403 };
          }
          const conta = await repository.getById(contaID);
          if (!conta) {
            await t.rollback();
            return { message: conta.message, status: conta.status || 500 };
          }
          const saldoAtual = parseFloat(conta.data.saldo);
          const novoSaldo = saldoAtual + parseFloat(valor);
          if (novoSaldo < 0) {
            await t.rollback();
            return { message: "Voc\xEA n\xE3o possui saldo o suficiente em sua conta!", status: 400 };
          }
          const saldoAtualizado = await repository.put(contaID, novoSaldo, fkUsuarioId);
          const tipoOperacao = valor >= 0 ? "deposito" : "retirada";
          const transacao = await Transacao.create({
            conta_id: contaID,
            valor,
            data_transacao: /* @__PURE__ */ new Date(),
            tipo_operacao: tipoOperacao,
            descricao,
            usuario_id: fkUsuarioId,
            banco_id: fkBancoId,
            conta_flux_origem_id: contaBancos_id
          }, { transaction: t });
          await t.commit();
          return { data: saldoAtualizado.data.previous, status: 201 };
        } catch (error) {
          await t.rollback();
          console.error("Erro ao atualizar saldo:", error);
          return {
            message: "Falha na requisi\xE7\xE3o: " + error.message,
            status: 500
          };
        }
      };
    };
    module2.exports = ContaBancariaService;
  }
});

// src/controllers/conta-bancaria-controller.js
var require_conta_bancaria_controller = __commonJS({
  "src/controllers/conta-bancaria-controller.js"(exports2, module2) {
    var repository = require_conta_bancaria_repository();
    var authService = require_auth_service();
    var service = require_conta_bancaria_service();
    var ContaController = class {
      static listarContasBancarias = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const contas = await repository.get(dadosUsuario.id);
          if (contas.status === 200) {
            return res.status(contas.status).send(contas.data);
          } else {
            return res.status(contas.status).send({ message: contas.message });
          }
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o " + error
          });
        }
      };
      static criarContaBancaria = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const saldo = parseFloat(req.body.saldo);
          const tipo_conta = req.body.tipo_conta;
          const fkUsuarioId = dadosUsuario.id;
          const fkBancoId = req.body.fkBancoId;
          const resultado = await service.criarContaBancaria(fkUsuarioId, fkBancoId, saldo, tipo_conta);
          if (resultado.status === 201) {
            return res.status(201).send(resultado.data);
          } else {
            return res.status(resultado.status).send({ message: resultado.message });
          }
        } catch (error) {
          throw error;
        }
      };
      static atualizarContaBancaria = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const contaID = req.params.id;
          const valor = parseFloat(req.body.saldo);
          const descricao = req.body.descricao;
          const fkUsuarioId = dadosUsuario.id;
          const fkBancoId = req.body.banco_id;
          const resultado = await service.atualizarSaldo(
            contaID,
            valor,
            fkUsuarioId,
            descricao,
            fkBancoId
          );
          if (resultado.status === 201) {
            return res.status(201).send(resultado.data);
          } else {
            return res.status(resultado.status).send({ message: resultado.message });
          }
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      static deletarContaBancaria = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const conta = await repository.delete(req.params.id, dadosUsuario.id);
          if (conta.status === 201) {
            return res.status(conta.status).send(conta.data);
          } else {
            return res.status(conta.status).send({ message: conta.message });
          }
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o" + error
          });
        }
      };
      static buscarContasBancariasPorId = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const conta = await repository.getById(req.params.id, dadosUsuario.id);
          if (conta.status === 200) {
            return res.status(conta.status).send(conta.data);
          } else {
            return res.status(conta.status).send({ message: conta.message });
          }
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o" + error
          });
        }
      };
    };
    module2.exports = ContaController;
  }
});

// src/routes/conta-bancaria-route.js
var require_conta_bancaria_route = __commonJS({
  "src/routes/conta-bancaria-route.js"(exports2, module2) {
    var express2 = require("express");
    var router = express2.Router();
    var controller = require_conta_bancaria_controller();
    var authService = require_auth_service();
    router.post("/criar-conta-bancaria", authService.authorize, controller.criarContaBancaria);
    router.get("/listar-contas", authService.authorize, controller.listarContasBancarias);
    router.put("/atualizar-conta/:id", authService.authorize, controller.atualizarContaBancaria);
    router.delete("/deletar-conta/:id", authService.authorize, controller.deletarContaBancaria);
    router.get("/bucar-conta/:id", authService.authorize, controller.buscarContasBancariasPorId);
    module2.exports = router;
  }
});

// src/services/pix-service.js
var require_pix_service = __commonJS({
  "src/services/pix-service.js"(exports2, module2) {
    var axios = require("axios");
    var repository = require_pix_repository();
    var contaBancariaRepository = require_conta_bancaria_repository();
    var contaBancosRepository = require_conta_bancos_repository();
    require("dotenv").config();
    var PixService = class {
      static criarChave = async (key_type, key, dadosUsuario, accessToken, banco_id, contaBancaria_id) => {
        try {
          const usuario_id = dadosUsuario.id;
          const key_typeUpCase = key_type.toUpperCase();
          const chaveExistente = await this.procurarChaveExistente(key);
          console.warn(chaveExistente);
          if (chaveExistente) {
            return {
              status: chaveExistente.status,
              message: chaveExistente.message
            };
          }
          const contasBancariasDisponiveis = await contaBancariaRepository.findOne({
            contaBancaria_id,
            usuario_id
          });
          if (!contasBancariasDisponiveis.data) {
            return {
              message: contasBancariasDisponiveis.message,
              status: contasBancariasDisponiveis.status
            };
          }
          const contaBancariaUsuario = contasBancariasDisponiveis.data.id_conta;
          if (key_typeUpCase == "CNPJ") {
            let response = await this.cadastrarChavePixCNPJouAleatoria(
              key,
              key_type,
              usuario_id,
              banco_id,
              contaBancariaUsuario
            );
            return response;
          } else {
            const options = {
              method: "POST",
              url: "https://api-sandbox.transfeera.com/pix/key",
              headers: {
                accept: "application/json",
                "content-type": "application/json",
                "user-Agent": dadosUsuario.email,
                Authorization: `Bearer ${accessToken}`
              },
              data: { key, key_type: key_typeUpCase }
            };
            const response = await axios.request(options);
            const createdKey = response.data;
            const id_pix = createdKey.id;
            const pix = await repository.post({
              id_pix,
              key: createdKey.key,
              key_type: createdKey.key_type,
              usuario_id: dadosUsuario.id
            });
            const contaBancos = await contaBancosRepository.post({
              id_pix,
              usuario_id: dadosUsuario.id,
              contaBancaria_id: contaBancariaUsuario,
              banco_id
            });
            if (!contaBancos) {
              return { message: contaBancos.message, status: contaBancos.status };
            }
            if (pix.status === 201) {
              return { status: pix.status, data: createdKey };
            } else if (pix.status === 409) {
              return {
                status: pix.status || 500,
                message: response.data.statusCode
              };
            } else {
              return {
                status: pix.status || 500,
                message: response.data.statusCode
              };
            }
          }
        } catch (error) {
          if (error.code === "ER_DUP_ENTRY") {
            return {
              status: 400,
              message: "Chave Pix j\xE1 registrada no banco de dados"
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
              message: "Erro interno do servidor"
            };
          }
        }
      };
      static verificarChave = async (idPix, emailUsuario, accessToken, verifyCode) => {
        try {
          if (verifyCode.length !== 6) {
            return {
              message: "A chave deve conter apenas 6 d\xEDgitos num\xE9ricos",
              status: 400
            };
          }
          const verifyOptions = {
            method: "PUT",
            url: `https://api-sandbox.transfeera.com/pix/key/${idPix}/verify`,
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "User-Agent": emailUsuario,
              Authorization: `Bearer ${accessToken}`
            },
            data: { code: verifyCode }
          };
          const verifyResponse = await axios.request(verifyOptions);
          const statusOptions = {
            method: "GET",
            url: `https://api-sandbox.transfeera.com/pix/key/${idPix}`,
            headers: {
              accept: "application/json",
              "User-Agent": emailUsuario,
              Authorization: `Bearer ${accessToken}`
            }
          };
          const statusResponse = await axios.request(statusOptions);
          const keyRegistredStatus = statusResponse.data.status;
          const updatedStatus = keyRegistredStatus == "REGISTRADA" ? "REGISTRADA" : keyRegistredStatus;
          const updateResult = await repository.put({
            id_pix: idPix,
            status: updatedStatus
          });
          if (!updateResult.data) {
            return {
              message: "Erro ao atualizar chave",
              status: 500
            };
          }
          return {
            data: statusResponse.data,
            status: 200
          };
        } catch (error) {
          if (error.response && error.response.data) {
            return {
              message: error.response.data.message,
              status: error.response.data.statusCode || 500
            };
          } else {
            return {
              message: "Erro interno do servidor",
              status: 500
            };
          }
        }
      };
      static reenviarCodigo = async (idPix, emailUsuario, accessToken) => {
        try {
          const verifyOptions = {
            method: "PUT",
            url: `https://api-sandbox.transfeera.com/pix/key/${idPix}/resendVerificationCode`,
            headers: {
              accept: "application/json",
              "User-Agent": emailUsuario,
              authorization: `Bearer ${accessToken}`
            }
          };
          const verifyResponse = await axios.request(verifyOptions);
          const statusOptions = {
            method: "GET",
            url: `https://api-sandbox.transfeera.com/pix/key/${idPix}`,
            headers: {
              accept: "application/json",
              "User-Agent": emailUsuario,
              Authorization: `Bearer ${accessToken}`
            }
          };
          const statusResponse = await axios.request(statusOptions);
          const keyRegistredStatus = statusResponse.data.status;
          const updatedStatus = keyRegistredStatus === "REGISTRADA" ? "REGISTRADA" : keyRegistredStatus;
          const updateResult = await repository.put({
            id_pix: idPix,
            status: updatedStatus
          });
          if (!updateResult.data) {
            return {
              message: "Erro ao atualizar chave",
              status: 500
            };
          }
          return {
            data: statusResponse.data,
            status: 200
          };
        } catch (error) {
          if (error.response && error.response.data) {
            return {
              message: error.response.data.message,
              status: error.response.data.statusCode || 500
            };
          } else {
            return {
              message: "Erro interno do servidor",
              status: 500
            };
          }
        }
      };
      static deletarChave = async (idPix, usuario_id, emailUsuario, accessToken) => {
        try {
          const contasBancariasDisponiveis = await contaBancosRepository.findOne({
            idPix,
            usuario_id
          });
          if (!contasBancariasDisponiveis || !contasBancariasDisponiveis.data) {
            return {
              message: "Conta banc\xE1ria n\xE3o encontrada ou inexistente",
              status: 404
            };
          }
          const contaBancosUsuarioID = contasBancariasDisponiveis.data.usuario_id;
          if (!contasBancariasDisponiveis) {
            return {
              message: contasBancariasDisponiveis.message,
              status: contasBancariasDisponiveis.status
            };
          }
          const contaBancosDelete = await contaBancosRepository.deletePix(
            idPix,
            contaBancosUsuarioID
          );
          if (contaBancosDelete.status !== 200) {
            return {
              message: contaBancosDelete.message,
              status: contaBancosDelete.status
            };
          }
          const options = {
            method: "DELETE",
            url: `https://api-sandbox.transfeera.com/pix/key/${idPix}`,
            headers: {
              accept: "application/json",
              "User-Agent": emailUsuario,
              Authorization: `Bearer ${accessToken}`
            }
          };
          const response = await axios.request(options);
          if (response && contaBancosDelete.status === 200) {
            return {
              data: contaBancosDelete.data,
              status: contaBancosDelete.status
            };
          } else {
            return {
              message: contaBancosDelete.message,
              status: contaBancosDelete.status
            };
          }
        } catch (error) {
          return {
            message: error.response ? error.response.data.message : "Erro interno do servidor",
            status: error.response ? error.response.status : 500
          };
        }
      };
      static buscarChaveId = async (idPix, dadosUsuario, accessToken) => {
        try {
          const emailUsuario = dadosUsuario.email;
          const usuario_id = dadosUsuario.id;
          const pixUser = await repository.findByPixAndUserId(idPix, usuario_id);
          if (pixUser.status !== 200) {
            return {
              message: pixUser.message,
              status: pixUser.status
            };
          }
          const pixId = pixUser.data.Pix.id_pix;
          const options = {
            method: "GET",
            url: `https:api-sandbox.transfeera.com/pix/key/${pixId}`,
            headers: {
              accept: "application/json",
              "User-Agent": emailUsuario,
              authorization: `Bearer ${accessToken}`
            }
          };
          const response = await axios.request(options);
          console.log(response);
          if (pixUser.status === 200) {
            return { data: response.data, status: pixUser.status };
          } else {
            return { message: pixUser.message, status: pixUser.status };
          }
        } catch (error) {
          if (error.response && error.response.data) {
            return {
              message: error.response.data.message,
              status: error.response.data.statusCode || 500
            };
          } else {
            return {
              message: "Erro interno do servidor",
              status: 500
            };
          }
        }
      };
      static cadastrarChavePixCNPJouAleatoria = async (key, key_type, usuario_id, banco_id, contaBancariaUsuarioID) => {
        let key_typeUpCase = key_type.toUpperCase();
        const pix = await repository.post({
          key,
          key_type: key_typeUpCase,
          usuario_id
        });
        const contaBancos = await contaBancosRepository.post({
          id_pix: pix.data.id_pix,
          usuario_id,
          contaBancaria_id: contaBancariaUsuarioID,
          banco_id
        });
        if (!contaBancos) {
          return { message: contaBancos.message, status: contaBancos.status };
        }
        if (pix.status === 201) {
          return { status: pix.status, data: pix.data };
        } else {
          return { status: pix.status || 500, message: pix.message };
        }
      };
      static procurarChaveExistente = async (key) => {
        const chaveExistente = await repository.findByKey(key);
        if (chaveExistente.status == 400) {
          return {
            status: chaveExistente.status,
            message: chaveExistente.message
          };
        }
        return chaveExistente.data;
      };
    };
    module2.exports = PixService;
  }
});

// src/controllers/pix-controller.js
var require_pix_controller = __commonJS({
  "src/controllers/pix-controller.js"(exports2, module2) {
    var axios = require("axios");
    var repository = require_pix_repository();
    var authServiceAPI = require_auth_transfeera_service();
    var authService = require_auth_service();
    var pixService = require_pix_service();
    require("dotenv").config();
    var PixController = class {
      static criarChave = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const banco_id = req.body.banco_id;
          const contaBancaria_id = req.body.conta_bancaria_id;
          const { key_type, key } = req.body;
          const accessToken = await authServiceAPI.returnAccessToken();
          const response = await pixService.criarChave(
            key_type,
            key,
            dadosUsuario,
            accessToken,
            banco_id,
            contaBancaria_id
          );
          if (response.status === 200) {
            return res.status(200).send(response.data);
          } else {
            return res.status(response.status).send({ message: response.message });
          }
        } catch (error) {
          res.status(400).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      static verificarChave = async (req, res) => {
        try {
          const idPix = req.params.id;
          const verifyCode = req.body.code;
          console.log("verifyCode: ", verifyCode);
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const emailUsuario = dadosUsuario.email;
          const accessToken = await authServiceAPI.returnAccessToken();
          const response = await pixService.verificarChave(idPix, emailUsuario, accessToken, verifyCode);
          console.log("verifyCode: ", verifyCode);
          console.log(response.data);
          if (response.status === 200) {
            return res.status(200).send(response.data);
          } else {
            return res.status(response.status).send({ message: response.message });
          }
        } catch (error) {
          res.status(400).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      static reenviarCodigo = async (req, res) => {
        try {
          const idPix = req.params.id;
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const emailUsuario = dadosUsuario.email;
          const accessToken = await authServiceAPI.returnAccessToken();
          const response = await pixService.reenviarCodigo(idPix, emailUsuario, accessToken);
          console.log(response.data);
          if (response.status === 200) {
            return res.status(200).send(response.data);
          } else {
            return res.status(response.status).send({ message: response.message });
          }
        } catch (error) {
          res.status(400).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      static listarChavesPix = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const pix = await repository.get(dadosUsuario.id);
          if (pix.status === 200) {
            return res.status(pix.status).send(pix.data);
          } else {
            return res.status(pix.status).send({ message: pix.message });
          }
        } catch (error) {
          res.status(400).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      static buscarChavePixPorID = async (req, res) => {
        try {
          const idPix = req.params.id;
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const accessToken = await authServiceAPI.returnAccessToken();
          const response = await pixService.buscarChaveId(idPix, dadosUsuario, accessToken);
          if (response.status !== 200) {
            return res.status(response.status).send(response.message);
          }
          return res.status(response.status).send(response.data);
        } catch (error) {
          res.status(400).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      static deletarChave = async (req, res) => {
        try {
          const idPix = req.params.id;
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const usuario_id = dadosUsuario.id;
          const emailUsuario = dadosUsuario.email;
          const accessToken = await authServiceAPI.returnAccessToken();
          const response = await pixService.deletarChave(idPix, usuario_id, emailUsuario, accessToken);
          console.log(response.status);
          if (response.status === 200) {
            console.warn(response.status);
            console.warn(response.status);
            console.warn(response.status);
            return res.status(response.status).json(response.data);
          } else if (response.status === 201) {
            console.warn(response.status);
            console.warn(response.status);
            console.warn(response.status);
            return res.status(response.status).json(response.data);
          } else {
            return res.status(response.status).send({ message: response.message });
          }
        } catch (error) {
          res.status(400).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
    };
    module2.exports = PixController;
  }
});

// src/routes/pix-route.js
var require_pix_route = __commonJS({
  "src/routes/pix-route.js"(exports2, module2) {
    var express2 = require("express");
    var controller = require_pix_controller();
    var router = express2.Router();
    var authService = require_auth_service();
    router.post("/cadastrar-chave", authService.authorize, controller.criarChave);
    router.put("/pix/key/:id/verify", authService.authorize, controller.verificarChave);
    router.put("/pix/key/:id/resendVerificationCode", authService.authorize, controller.reenviarCodigo);
    router.get("/pix", authService.authorize, controller.listarChavesPix);
    router.get("/pix/key/:id", authService.authorize, controller.buscarChavePixPorID);
    router.delete("/pix/key/:id", authService.authorize, controller.deletarChave);
    module2.exports = router;
  }
});

// src/repositories/home-repository.js
var require_home_repository = __commonJS({
  "src/repositories/home-repository.js"(exports2, module2) {
    var { Sequelize, QueryTypes, where } = require("sequelize");
    var Transacao = require_transacao();
    var Banco = require_banco();
    var usarioRepository = require_usuario_repository();
    var Usuario = require_usuario();
    var HomeRepository = class {
      static getHomeData = async (id_user, limit) => {
        const nome = await usarioRepository.getById(id_user);
        const query = await Banco.sequelize.query(
          `SELECT 
    usuario.nome,
    transacao.conta_flux_origem_id,
    banco_origem.image AS imagem_banco_origem,
    banco_origem.name AS nome_banco_origem,
    transacao.conta_bancos_destino_id,
    banco_destino.image AS imagem_banco_destino,
    ROUND(transacao.valor, 2) AS valor,
    transacao.tipo_operacao,
    transacao.descricao,
    banco_destino.name AS nome_banco_destino,
    (SELECT 
            SUM(c.saldo)
        FROM
            conta_bancaria c
        WHERE
            c.usuario_id = usuario.id_usuario) AS saldoTotalGeral
FROM
    transacao
        JOIN
    conta_bancos AS conta_origem ON conta_origem.id_contaBancos = transacao.conta_flux_origem_id
        JOIN
    usuario ON usuario.id_usuario = conta_origem.usuario_id
        JOIN
    conta_bancaria AS conta_bancaria_origem ON conta_bancaria_origem.id_conta = conta_origem.contaBancaria_id
        JOIN
    banco AS banco_origem ON banco_origem.id_banco = conta_bancaria_origem.banco_id
        JOIN
    conta_bancos AS conta_destino ON conta_destino.id_contaBancos = transacao.conta_bancos_destino_id
        JOIN
    conta_bancaria AS conta_bancaria_destino ON conta_bancaria_destino.id_conta = conta_destino.contaBancaria_id
        JOIN
    banco AS banco_destino ON banco_destino.id_banco = conta_bancaria_destino.banco_id
WHERE
    usuario.id_usuario = :id_user
ORDER BY transacao.data_transacao DESC
LIMIT 10;
    `,
          {
            replacements: { id_user, limit },
            type: QueryTypes.SELECT
          }
        );
        if (query.length === 0) {
          const queryIfNotTransaction = await Usuario.sequelize.query(
            `
        SELECT 
            a.nome
        FROM
            usuario a
        WHERE
            a.id_usuario = :id_user `,
            {
              replacements: { id_user },
              type: QueryTypes.SELECT
            }
          );
          return { status: 200, data: queryIfNotTransaction };
        }
        return { status: 200, data: query, nome };
      };
    };
    module2.exports = HomeRepository;
  }
});

// src/repositories/carteira-repository.js
var require_carteira_repository = __commonJS({
  "src/repositories/carteira-repository.js"(exports2, module2) {
    var { Sequelize, QueryTypes, where } = require("sequelize");
    var Transacao = require_transacao();
    var Banco = require_banco();
    var ContaBancaria = require_conta_bancaria();
    var CarteiraRepository = class {
      static get = async (id_user, limit) => {
        const query = await Banco.sequelize.query(
          `
  SELECT 
    usuario.nome,
    transacao.conta_flux_origem_id,
    banco_origem.image AS imagem_banco_origem,
    banco_origem.name AS nome_banco_origem,
    transacao.conta_bancos_destino_id,
    banco_destino.image AS imagem_banco_destino,
    ROUND(transacao.valor, 2) AS valor,
    transacao.tipo_operacao,
    transacao.descricao,
    banco_destino.name AS nome_banco_destino,
        (SELECT
            SUM(c.saldo)
        FROM
            conta_bancaria c
        WHERE
            c.usuario_id = usuario.id_usuario) AS saldoTotalGeral
FROM
    transacao
        JOIN conta_bancos AS conta_origem ON conta_origem.id_contaBancos = transacao.conta_flux_origem_id
        JOIN usuario ON usuario.id_usuario = conta_origem.usuario_id
        JOIN conta_bancaria AS conta_bancaria_origem ON conta_bancaria_origem.id_conta = conta_origem.contaBancaria_id
        JOIN banco AS banco_origem ON banco_origem.id_banco = conta_bancaria_origem.banco_id
        JOIN conta_bancos AS conta_destino ON conta_destino.id_contaBancos = transacao.conta_bancos_destino_id
        JOIN conta_bancaria AS conta_bancaria_destino ON conta_bancaria_destino.id_conta = conta_destino.contaBancaria_id
        JOIN banco AS banco_destino ON banco_destino.id_banco = conta_bancaria_destino.banco_id
WHERE
    usuario.id_usuario = :id_user
ORDER BY 
    transacao.data_transacao DESC
LIMIT 10;
    `,
          {
            replacements: { id_user, limit },
            type: QueryTypes.SELECT
          }
        );
        if (query.length === 0) {
          const queryIfNotTransaction = await ContaBancaria.sequelize.query(
            `
        SELECT 
            SUM(c.saldo) as saldoTotalGeral
        FROM
            conta_bancaria c
        WHERE
            c.usuario_id = :id_user  `,
            {
              replacements: { id_user },
              type: QueryTypes.SELECT
            }
          );
          return { status: 206, data: queryIfNotTransaction };
        }
        return { status: 200, data: query };
      };
    };
    module2.exports = CarteiraRepository;
  }
});

// src/repositories/transacao-repository.js
var require_transacao_repository = __commonJS({
  "src/repositories/transacao-repository.js"(exports2, module2) {
    var { Sequelize, QueryTypes, where } = require("sequelize");
    var Transacao = require_transacao();
    var Banco = require_banco();
    var TransacaoRepository = class {
      static buscarExtratoGeral = async (id_user, limit) => {
        const query = await Banco.sequelize.query(
          `
                    SELECT 
    usuario.id_usuario,
    usuario.nome,
    usuario.cpf,
    conta_bancaria.saldo AS valor_disponivel,
    banco.name AS nome_instituicao_financeira,
    (SELECT 
            SUM(c.saldo)
        FROM
            conta_bancaria AS c
        WHERE
            c.usuario_id = usuario.id_usuario) AS saldo_total_geral
FROM
    conta_bancaria
        JOIN
    banco ON conta_bancaria.banco_id = banco.id_banco
        JOIN
    usuario ON conta_bancaria.usuario_id = usuario.id_usuario 
    WHERE usuario.id_usuario = :id_user
    ORDER BY conta_bancaria.saldo DESC 

    `,
          {
            replacements: { id_user, limit },
            type: QueryTypes.SELECT
          }
        );
        return { status: 200, data: query };
      };
      static buscarExtratoBancario = async (id_user, contaBancariaId) => {
        const query = await Banco.sequelize.query(
          `
  SELECT 
    usuario.nome,
    usuario.cpf,
    pix.key,
    banco_origem.name AS nome_instituicao_financeira_origem,
    banco_destino.name AS nome_instituicao_financeira_destino,
    conta_bancaria_destino.id_conta as idContaBancariaDestino,
    conta_bancaria_origem.id_conta as idContaBancariaOrigem,
    conta_bancaria_origem.saldo saldoContaBancariaOrigem,
    conta_bancaria_destino.saldo as saldoContaBancariaDestino,
    transacao.data_transacao,
    transacao.descricao,
    transacao.valor,
    (SELECT 
            SUM(c.saldo)
        FROM
            conta_bancaria c
        WHERE
            c.usuario_id = usuario.id_usuario) AS saldoTotalGeral,
    (SELECT 
            SUM(a.valor)
        FROM
            transacao AS a
                JOIN
            conta_bancos AS cb ON a.conta_flux_origem_id = cb.id_contaBancos
        WHERE
            cb.contaBancaria_id = :contaBancariaId AND a.valor < 0) AS saidas,
    (SELECT 
            SUM(a.valor)
        FROM
            transacao AS a
                JOIN
            conta_bancos AS cb ON a.conta_flux_origem_id = cb.id_contaBancos
        WHERE
            cb.contaBancaria_id = :contaBancariaId AND a.valor > 0) AS entradas
FROM
    transacao
        JOIN
    conta_bancos AS conta_origem ON transacao.conta_flux_origem_id = conta_origem.id_contaBancos
        JOIN
    pix ON conta_origem.pix_id = pix.id_pix
        JOIN
    usuario ON conta_origem.usuario_id = usuario.id_usuario
        JOIN
    conta_bancaria AS conta_bancaria_origem ON conta_bancaria_origem.id_conta = conta_origem.contaBancaria_id
        JOIN
    banco AS banco_origem ON banco_origem.id_banco = conta_bancaria_origem.banco_id
        JOIN
    conta_bancos AS conta_destino ON conta_destino.id_contaBancos = transacao.conta_bancos_destino_id
        JOIN
    conta_bancaria AS conta_bancaria_destino ON conta_bancaria_destino.id_conta = conta_destino.contaBancaria_id
        JOIN
    banco AS banco_destino ON banco_destino.id_banco = conta_bancaria_destino.banco_id
WHERE
    
    usuario.id_usuario = :id_user
    AND 
        conta_origem.contaBancaria_id = :contaBancariaId

ORDER BY transacao.data_transacao DESC;

  
      `,
          {
            replacements: { id_user, contaBancariaId },
            type: QueryTypes.SELECT
          }
        );
        return { status: 200, data: query };
      };
    };
    module2.exports = TransacaoRepository;
  }
});

// src/services/transacao-service.js
var require_transacao_service = __commonJS({
  "src/services/transacao-service.js"(exports2, module2) {
    var homeRepository = require_home_repository();
    var cateiraRepository = require_carteira_repository();
    var transacaoRepository = require_transacao_repository();
    var Transacao = require_transacao();
    var usuarioRepository = require_usuario_repository();
    var TransacaoService = class {
      static listarDadosHome = async (id_user, usuario_nome_token) => {
        const query = await homeRepository.getHomeData(id_user, 10);
        const username = usuario_nome_token;
        if (!query || query.data == null || query.data.length === 0) {
          return {
            status: 206,
            data: username,
            message: "Voc\xEA ainda n\xE3o possui transa\xE7\xF5es feitas"
          };
        }
        return { status: 200, data: query.data, nome: username };
      };
      static listarHistoricoTransacao = async (id_user) => {
        var query = await cateiraRepository.get(id_user, 10);
        console.log(query);
        if (!query || query.data.length === 0) {
          return {
            status: query.status,
            message: query.data
          };
        }
        const resultPorcentAndQuery = query.data.map((transacao) => {
          let total = parseFloat(transacao.saldoTotalGeral).toFixed(2);
          let valor = parseFloat(transacao.valor).toFixed(2);
          let tipo_operacao = transacao.tipo_operacao;
          if (tipo_operacao == "deposito") {
            let aumentoPorcent = valor / total * 100;
            console.log(`Aumento Percentual: ${aumentoPorcent.toFixed(2)}%`);
            return {
              ...transacao,
              porcentagem: `${aumentoPorcent.toFixed(2)}%`
            };
          } else if (tipo_operacao == "transferencia") {
            console.log(tipo_operacao);
            let diminuicaoPorcent = valor / total * 100;
            console.log(diminuicaoPorcent);
            console.log(
              `Diminui\xE7\xE3o Percentual: ${diminuicaoPorcent.toFixed(2)}%`
            );
            return {
              ...transacao,
              porcentagem: `${diminuicaoPorcent.toFixed(2)}%`
            };
          }
          return;
        }).filter((transacoes) => transacoes !== null);
        const campoSaltoTotalGeral = query.data.map(
          (transacao) => transacao.saldoTotalGeral
        );
        const totalGeral = campoSaltoTotalGeral.length > 0 ? campoSaltoTotalGeral[0] : null;
        return { status: 200, data: { totalGeral, resultPorcentAndQuery } };
      };
      static listarExtratoGeral = async (id_user) => {
        const query = await transacaoRepository.buscarExtratoGeral(id_user);
        if (!query || query.data.length === 0) {
          return {
            status: 204,
            message: "Voc\xEA ainda n\xE3o realizou transa\xE7\xF5es"
          };
        }
        return { data: query.data, status: 200 };
      };
      static buscarExtratoContaBancaria = async (id_user, contaBancariaId) => {
        const query = await transacaoRepository.buscarExtratoBancario(
          id_user,
          contaBancariaId
        );
        if (!query || query.data.length === 0) {
          return {
            status: 204,
            message: "Voc\xEA ainda n\xE3o realizou transa\xE7\xF5es"
          };
        }
        return { data: query.data, status: 200 };
      };
    };
    module2.exports = TransacaoService;
  }
});

// src/controllers/home-controller.js
var require_home_controller = __commonJS({
  "src/controllers/home-controller.js"(exports2, module2) {
    var transacaoService = require_transacao_service();
    var authService = require_auth_service();
    var HomeController = class {
      static renderHome = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const data = await authService.decodeToken(token);
          const usuario_id_token = data.id;
          const usuario_nome_token = data.nome;
          const response = await transacaoService.listarDadosHome(usuario_id_token, usuario_nome_token);
          if (response.status === 200) {
            return res.status(response.status).json(response.data);
          } else {
            return res.status(response.status).json({ data: response.data, message: response.message });
          }
        } catch (error) {
          throw error;
        }
      };
    };
    module2.exports = HomeController;
  }
});

// src/routes/home-route.js
var require_home_route = __commonJS({
  "src/routes/home-route.js"(exports2, module2) {
    var express2 = require("express");
    var controller = require_home_controller();
    var authService = require_auth_service();
    var router = express2.Router();
    router.get("/home", authService.authorize, controller.renderHome);
    module2.exports = router;
  }
});

// src/controllers/carteira-controller.js
var require_carteira_controller = __commonJS({
  "src/controllers/carteira-controller.js"(exports2, module2) {
    var transacaoService = require_transacao_service();
    var authService = require_auth_service();
    var CarteiraController = class {
      static renderCarteira = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const data = await authService.decodeToken(token);
          const usuario_id_token = data.id;
          const response = await transacaoService.listarHistoricoTransacao(usuario_id_token);
          if (response.status === 200) {
            return res.status(response.status).json(response.data);
          } else {
            console.log(response.status);
            console.log(response.status);
            console.log(response.status);
            return res.status(response.status).json({ message: response.data });
          }
        } catch (error) {
          throw error;
        }
      };
    };
    module2.exports = CarteiraController;
  }
});

// src/routes/carteira-route.js
var require_carteira_route = __commonJS({
  "src/routes/carteira-route.js"(exports2, module2) {
    var express2 = require("express");
    var controller = require_carteira_controller();
    var authService = require_auth_service();
    var router = express2.Router();
    router.get("/carteira", authService.authorize, controller.renderCarteira);
    module2.exports = router;
  }
});

// src/services/conta-bancos-service.js
var require_conta_bancos_service = __commonJS({
  "src/services/conta-bancos-service.js"(exports2, module2) {
    var ContaBancaria = require_conta_bancaria();
    var Transacao = require_transacao();
    var Usuario = require_usuario();
    var contaBancariaRepository = require_conta_bancaria_repository();
    var contaBancosrepository = require_conta_bancos_repository();
    var pixRepository = require_pix_repository();
    var sequelize = require_database();
    var { ContaBancos } = require_models();
    var { where } = require("sequelize");
    var contaBancariaService = require_conta_bancaria_service();
    var { verify } = require("jsonwebtoken");
    var ContaBancosRepository = require_conta_bancos_repository();
    var ContaBancosService = class _ContaBancosService {
      static realizarTransferencia = async (conta_bancaria_origem_id, valor_transferencia, fkUsuarioId, descricao_transacao, id_conta_bancaria_destino) => {
        const t = await sequelize.transaction();
        try {
          const usuario = await Usuario.findByPk(fkUsuarioId);
          if (!usuario) {
            await t.rollback();
            return {
              message: `Voc\xEA ainda n\xE3o possui uma conta banc\xE1ria para realizar a transfer\xEAncia`,
              status: 404
            };
          }
          const contaBancaria = await _ContaBancosService.buscarContaBancaria(
            conta_bancaria_origem_id,
            fkUsuarioId
          );
          if (!contaBancaria || !contaBancaria.data) {
            await t.rollback();
            return { message: contaBancaria.message, status: contaBancaria.status };
          }
          const contaDestino = await _ContaBancosService.buscarContaBancaria(
            id_conta_bancaria_destino,
            fkUsuarioId
          );
          if (!contaDestino) {
            await t.rollback();
            return { message: "Conta de destino n\xE3o encontrada", status: 404 };
          }
          const saldoAtual = parseFloat(contaBancaria.data.Contum.saldo);
          if (valor_transferencia > saldoAtual) {
            await t.rollback();
            return {
              message: "Voc\xEA n\xE3o possui saldo o suficiente em sua conta!",
              status: 400
            };
          }
          const novoSaldoOrigem = saldoAtual - parseFloat(valor_transferencia);
          const saldoDestino = parseFloat(contaDestino.data.Contum.saldo);
          const novoSaldoDestino = saldoDestino + parseFloat(valor_transferencia);
          if (contaDestino.data.Pix.status === "VALIDANDO") {
            console.log(
              "N\xE3o \xE9 possivel realizar transfer\xEAncias se sua chave pix n\xE3o est\xE1 registrada"
            );
            return {
              message: "N\xE3o \xE9 possivel realizar transfer\xEAncias se sua chave pix n\xE3o est\xE1 registrada",
              status: 400
            };
          }
          if (contaDestino.data.id_contaBancos === contaBancaria.data.id_contaBancos) {
            console.log(
              "Voc\xEA n\xE3o pode realizar uma transfer\xEAncia para uma mesma conta banc\xE1ria"
            );
            return {
              message: "Voc\xEA n\xE3o pode realizar uma transfer\xEAncia para uma mesma conta banc\xE1ria",
              status: 400
            };
          }
          await Promise.all([
            contaBancariaRepository.put(
              contaBancaria.data.Contum.id_conta,
              novoSaldoOrigem,
              contaBancaria.data.usuario_id,
              { transaction: t }
            ),
            contaBancariaRepository.put(
              contaDestino.data.Contum.id_conta,
              novoSaldoDestino,
              contaDestino.data.usuario_id,
              { transaction: t }
            )
          ]);
          await _ContaBancosService.registrarTransacao({
            valor: -valor_transferencia,
            data_transacao: /* @__PURE__ */ new Date(),
            tipo_operacao: "transfer\xEAncia",
            descricao: descricao_transacao,
            usuario_id: fkUsuarioId,
            conta_flux_origem_id: conta_bancaria_origem_id,
            conta_bancos_destino_id: id_conta_bancaria_destino
          }, { transaction: t });
          await _ContaBancosService.registrarTransacao({
            valor: valor_transferencia,
            data_transacao: /* @__PURE__ */ new Date(),
            tipo_operacao: "dep\xF3sito",
            descricao: descricao_transacao,
            usuario_id: fkUsuarioId,
            conta_flux_origem_id: conta_bancaria_origem_id,
            conta_bancos_destino_id: id_conta_bancaria_destino
          }, { transaction: t });
          console.log("-----------------------------------------------------------------");
          await t.commit();
          const contaBancariaUpdate = await contaBancosrepository.findOne({
            contaBancaria_id: conta_bancaria_origem_id,
            usuario_id: fkUsuarioId
          });
          return {
            message: "Transfer\xEAncia realizada com sucesso",
            data: contaBancariaUpdate.data,
            status: 201
          };
        } catch (error) {
          await t.rollback();
          return {
            message: "Falha na requisi\xE7\xE3o: " + error.message,
            status: 500
          };
        }
      };
      static buscarContasDoFlux = async (fkUsuarioId) => {
        console.log("SERVICE", fkUsuarioId);
        const res = await contaBancosrepository.get(fkUsuarioId);
        if (!res) {
          return { message: res.message, status: res.status };
        }
        return { data: res.data, status: res.status };
      };
      static async buscarContaBancaria(contaBancaria_id, usuario_id) {
        const conta = await contaBancosrepository.findOne({
          contaBancaria_id,
          usuario_id
        });
        if (!conta) {
          return { message: "Conta n\xE3o encontrada", status: 404 };
        }
        return { data: conta.data, status: conta.status };
      }
      static async verificarSaldoSuficiente(contaBancaria_id, usuario_id, valor) {
        const conta_id = contaBancaria_id;
        const conta = await ContaBancosRepository.findOne({ conta_id, usuario_id });
        const saldoDisponivelNaConta = await conta.data.Contum.saldo;
        if (saldoDisponivelNaConta < valor) {
          return {
            message: "Voc\xEA n\xE3o possui saldo o suficiente em sua conta!",
            status: 400
          };
        }
        return { data: conta.data, status: conta.status };
      }
      static async atualizarSaldoConta(idConta, novoSaldo) {
        await contaBancariaRepository.update(
          { saldo: novoSaldo },
          { where: { id: idConta } }
        );
      }
      static async registrarTransacao(dadosTransacao) {
        console.log("--------------------------------------------");
        console.log(dadosTransacao);
        console.log("--------------------------------------------");
        const res = await Transacao.create(dadosTransacao);
        return { data: res };
      }
    };
    module2.exports = ContaBancosService;
  }
});

// src/controllers/conta-bancos-controller.js
var require_conta_bancos_controller = __commonJS({
  "src/controllers/conta-bancos-controller.js"(exports2, module2) {
    var repository = require_conta_bancaria_repository();
    var authService = require_auth_service();
    var service = require_conta_bancos_service();
    var ContaBancosController = class {
      static listarContasFlux = async (req, res) => {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        const dadosUsuario = await authService.decodeToken(token);
        const fkUsuarioId = dadosUsuario.id;
        const resultado = await service.buscarContasDoFlux(fkUsuarioId);
        if (!resultado) {
          res.status(resultado.status).send({ message: resultado.message });
        }
        res.status(resultado.status).send(resultado.data);
      };
      static criarTransferencia = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService.decodeToken(token);
          const fkUsuarioId = dadosUsuario.id;
          const valor_transferencia = parseFloat(req.body.valor_transferencia);
          const id_conta_bancaria_flux_origem = req.body.id_conta_bancaria_origem;
          const descricao_transacao = req.body.descricao;
          const id_conta_bancaria_flux_destino = req.body.id_conta_bancaria_destino;
          const resultado = await service.realizarTransferencia(
            id_conta_bancaria_flux_origem,
            valor_transferencia,
            fkUsuarioId,
            descricao_transacao,
            id_conta_bancaria_flux_destino
          );
          switch (resultado.status) {
            case 200:
              res.status(resultado.status).send({ data: resultado.data });
              break;
            case 201:
              res.status(resultado.status).send({ message: resultado.message, data: resultado.data });
              break;
            default:
              res.status(resultado.status).send({ message: resultado.message });
              break;
          }
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
    };
    module2.exports = ContaBancosController;
  }
});

// src/routes/conta-bancos-route.js
var require_conta_bancos_route = __commonJS({
  "src/routes/conta-bancos-route.js"(exports2, module2) {
    var express2 = require("express");
    var controller = require_conta_bancos_controller();
    var authService = require_auth_service();
    var router = express2.Router();
    router.get("/listar-contas-flux", authService.authorize, controller.listarContasFlux);
    router.post("/realizar-transferencia", authService.authorize, controller.criarTransferencia);
    module2.exports = router;
  }
});

// src/controllers/extrato-controller.js
var require_extrato_controller = __commonJS({
  "src/controllers/extrato-controller.js"(exports2, module2) {
    var transacaoService = require_transacao_service();
    var authService = require_auth_service();
    var ExtratoController = class {
      static imprimirExtratoGeral = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const data = await authService.decodeToken(token);
          const usuario_id_token = data.id;
          const response = await transacaoService.listarExtratoGeral(
            usuario_id_token
          );
          if (response.status === 200) {
            return res.status(response.status).json(response.data);
          } else {
            return res.status(response.status).json({ data: response.data, message: response.message });
          }
        } catch (error) {
          throw error;
        }
      };
      static imprimirExtratoContaBancariaPeloID = async (req, res) => {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        const data = await authService.decodeToken(token);
        const usuario_id_token = data.id;
        const id_conta_bancaria = req.params.id;
        const response = await transacaoService.buscarExtratoContaBancaria(
          usuario_id_token,
          id_conta_bancaria
        );
        if (response.status === 200) {
          console.log(response);
          return res.status(response.status).json(response.data);
        } else {
          console.log(response);
          return res.status(response.status).json({ data: response.data, message: response.message });
        }
      };
    };
    module2.exports = ExtratoController;
  }
});

// src/routes/extrato-route.js
var require_extrato_route = __commonJS({
  "src/routes/extrato-route.js"(exports2, module2) {
    var express2 = require("express");
    var controller = require_extrato_controller();
    var router = express2.Router();
    var authService = require_auth_service();
    router.get("/impressao-geral", authService.authorize, controller.imprimirExtratoGeral);
    router.get("/imprimir-extrato-bancario/:id", authService.authorize, controller.imprimirExtratoContaBancariaPeloID);
    module2.exports = router;
  }
});

// src/app.js
var express = require("express");
var bodyParser = require("body-parser");
var conexao = require_database();
var config = require_config();
var cors = require("cors");
require("dotenv").config();
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
conexao.authenticate().then(() => {
  console.log("Banco Conectado");
}).catch((erroMsg) => {
  console.log(erroMsg);
});
var indexRoute = require_index_route();
var usuarioRoute = require_usuario_route();
var bancoRoute = require_banco_route();
var contaBancariaRoute = require_conta_bancaria_route();
var pixRoute = require_pix_route();
var homeRoute = require_home_route();
var carteiraRoute = require_carteira_route();
var contaBancosRoute = require_conta_bancos_route();
var ExtratoRoute = require_extrato_route();
var contasFlux = require_conta_bancos_route();
app.use("/", indexRoute);
app.use(homeRoute);
app.use(carteiraRoute);
app.use("/login", usuarioRoute);
app.use("/flux", usuarioRoute);
app.use("/banco", bancoRoute);
app.use("/conta", contaBancariaRoute, contaBancosRoute);
app.use(ExtratoRoute);
app.use(pixRoute);
app.use(contasFlux);
var corsOptions = {
  origin: [/http:\/\/localhost:\d{4}/, /http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d{4}/, "http://localhost:8100", "*"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: "Content-Type,Authorization"
};
app.use(cors(corsOptions));
module.exports = app;
