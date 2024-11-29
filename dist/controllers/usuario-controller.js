var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/config/database.js
var require_database = __commonJS({
  "src/config/database.js"(exports2, module2) {
    require("dotenv").config();
    var { Sequelize } = require("sequelize");
    var conexao = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      define: {
        timestamps: false,
        freezeTableName: true
      }
    });
    module2.exports = conexao;
  }
});

// src/models/usuario.js
var require_usuario = __commonJS({
  "src/models/usuario.js"(exports2, module2) {
    var conexao = require_database();
    var { DataTypes, Model: Model2 } = require("sequelize");
    var Usuario = class extends Model2 {
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
    Usuario.init(conexao);
    module2.exports = Usuario;
  }
});

// src/repositories/usuario-repository.js
var require_usuario_repository = __commonJS({
  "src/repositories/usuario-repository.js"(exports2, module2) {
    var { where } = require("sequelize");
    var Usuario = require_usuario();
    var bcrypt2 = require("bcrypt");
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
        const isPasswordValid = await bcrypt2.compare(data.senha, usuario.senha);
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
    function ValidationContract2() {
      errors = [];
    }
    ValidationContract2.prototype.isRequired = (value, message) => {
      if (!value || value.length <= 0)
        errors.push({ message });
    };
    ValidationContract2.prototype.hasMinLen = (value, min, message) => {
      if (!value || value.length < min)
        errors.push({ message });
    };
    ValidationContract2.prototype.hasMaxLen = (value, max, message) => {
      if (!value || value.length > max)
        errors.push({ message });
    };
    ValidationContract2.prototype.isFixedLen = (value, len, message) => {
      if (value.length != len)
        errors.push({ message });
    };
    ValidationContract2.prototype.isEmail = (value, message) => {
      var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
      if (!reg.test(value))
        errors.push({ message });
    };
    ValidationContract2.prototype.errors = () => {
      return errors;
    };
    ValidationContract2.prototype.clear = () => {
      errors = [];
    };
    ValidationContract2.prototype.isValid = () => {
      return errors.length == 0;
    };
    module2.exports = ValidationContract2;
  }
});

// src/services/auth-service.js
var require_auth_service = __commonJS({
  "src/services/auth-service.js"(exports2, module2) {
    var jwt2 = require("jsonwebtoken");
    var AuthService = class _AuthService {
      static generateToken = async (data) => {
        const TokenExpirationTime = "1d";
        return jwt2.sign(data, global.SALT_KEY, { expiresIn: TokenExpirationTime });
      };
      static decodeToken = async (token) => {
        try {
          return await jwt2.verify(token, global.SALT_KEY);
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
    var repository2 = require_usuario_repository();
    var bcrypt2 = require("bcrypt");
    var jwt2 = require("jsonwebtoken");
    require("dotenv").config();
    var mailService = require_mail_service();
    var nodemailer = require("nodemailer");
    var UsuarioService = class {
      static get = async (id_usuario) => {
        const listUsuarios = await repository2.get(id_usuario);
        if (!listUsuarios) {
          return { message: "Sem usu\xE1rios encontrados", status: 400 };
        }
        return { data: listUsuarios, status: 200 };
      };
      static getById = async (id) => {
        const usuario = await repository2.getById(id);
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
          const hashedPassword = await bcrypt2.hash(senha, 10);
          const emailEnviado = await mailService.enviarEmail(email, nome, verifyCode);
          const usuario = await repository2.post({
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
        const codigoValidado = await repository2.findByVerifyCode(codigo);
        if (codigoValidado.status === 400) {
          return { message: codigoValidado.message, status: codigoValidado.status };
        }
        return { data: codigoValidado.data, status: codigoValidado.status };
      };
      static update = async (id, body) => {
        try {
          const senha = body.senha;
          const usuario = await repository2.put(id, {
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
module.exports = UsuarioController;
