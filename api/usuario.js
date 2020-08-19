const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
  const { existeOuErro, naoExisteOuErro, igualOuErro } = app.api.validacao;

  const encriptarSenha = (senha) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(senha, salt);
  };

  const salvar = async (require, response) => {
    const usuario = {...require.body}

    if (require.params.id) usuario.id = require.params.id;

   //if(!require.originalUrl.startsWith('/usuario')) usuario.admin = false
   // if(!require.user || !require.user.admin) usuario.admin = false
    try {
      existeOuErro(usuario.nome, "Nome não informado");
      existeOuErro(usuario.email, "Email não informado");
      existeOuErro(usuario.senha, "Senha não informada");
      existeOuErro(usuario.confirmarSenha, "Confirmação de Senha não informada");
      igualOuErro(usuario.senha, usuario.confirmarSenha, "senhas não conferem");

      const usuarioDB = await app.db("usuario")
        .where({ email: usuario.email }).first();

      if (!usuario.id) {
        naoExisteOuErro(usuarioDB, "Usuário já cadastrado");
      }
    } catch (msg) {
      return response.status(400).send(console.log(msg));
    }

    usuario.senha = encriptarSenha(usuario.senha);
    delete usuario.confirmarSenha;

    if (usuario.id) {
      app.db("usuario")
        .update(usuario)
        .where({ id: usuario.id })
        .then(_ => response.status(204).send())
        .catch((e) => response.status(500).send("erro ao atualizar"));
    } else {
      app.db("usuario")
        .insert(usuario)
        .then(_ => response.status(204).send("salvo com sucesso"))
        .catch((e) => response.status(500).send(e));
    }
  };

  const get = (require, response) => {
    app.db("usuario")
      .select('id', 'nome', 'email', 'admin')
      .then(usuario => response.json(usuario))
      .catch(e => response.status(400).send('erro ao buscar usuario nesse ponto'))
  };

  const obterPorId = (require, response) => {
    app.db("usuario")
      .select('id', 'nome', 'email', 'admin')
      .where({id: require.params.id})
      .first()
      .then(usuario => response.json(usuario))
      .catch(e => response.status(400).send('erro ao buscar usuario'))
  };

  const deletarUsuario = (require, response) => {
    app.db('usuario')
      .where({id: require.params.id}).del()
      .then(usuario => response.send('usuario excluido'))
      .catch(e => response.send('erro aqui'))

  }




  return { salvar, get, obterPorId, deletarUsuario};
};
