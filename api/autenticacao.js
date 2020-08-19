const { authSecret } = require("../.env");
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
  const signin = async (require, response) => {
    if (!require.body.email || !require.body.senha) {
      return response.status(400).send("informe email e senha");
    }

    const usuario = await app
      .db("usuario")
      .where({ email: require.body.email })
      .first()


    if (!usuario) response.status(400).send("Usuário não encontrado");

    const isMatch = bcrypt.compareSync(require.body.senha, usuario.senha);

    if (!isMatch) response.status(400).send("Email/ Senha inválidos");
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      id: usuario.id,
      email: usuario.email,
      admin: usuario.admin,
      emitidoEm: now,
      exp: now + 60 * 60 * 24 * 1, //1 dia
    };

    response.json({ payload, token: jwt.encode(payload, authSecret) });
  };
  const validarToken = async (require, response) => {
    const usuario = require.body || null;
    try {
      if (usuario) {
        const token = jwt.decode(usuario.token, authSecret);
        if (new Date(token.exp * 1000) > new Date()) {
          return response.send(true);
        }
      }
    } catch (error) {}
    response.send(false);
  };
  return { signin, validarToken };
};
