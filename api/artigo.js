const queries = require ("./queries")
module.exports = (app) => {
  const { existeOuErro, naoExisteOuErro } = app.api.validacao;

  const salvar = (require, response) => {
    const artigo = { ...require.body };

    if (require.params.id) artigo.id = require.params.id

    try {
      existeOuErro(artigo.nome, "nome invalido");
      existeOuErro(artigo.descricao, "descrição invalido");
      existeOuErro(artigo.categoriaId, "ID da categora está inválido");
      existeOuErro(artigo.usuarioId, "ID do usuário está invalido");
      existeOuErro(artigo.conteudo, "Conteudo invalido");
    } catch (mensagem) {
      response.status(400).send(mensagem);
    }

    if (artigo.id) { 
      app
        .db("artigo")
        .update(artigo)
        .where({ id: artigo.id })
        .then((_) => response.status(204).send("artigo atualizado com sucesso"))
        .catch((e) => response.status(500).send("erro ao atualizar artigo"));
    } else {
      app
        .db("artigo")
        .insert(artigo)
        .then((_) => response.status(204).send("artigo salvo com sucesso"))
        .catch((e) => response.status(500).send("erro ao salvar artigo"));
    }

  }

  const remove = async (require, response) => {
    try {
       const linhaDeletada = app.db('artigo')
          .where({id: require.params.id}).del()

        naoExisteOuErro(linhaDeletada, 'artigo não foi encontrado')

        response.status(204).send()
    } catch (mensagem) {
        response.status(500).send(mensagem)
    }
  }

  const limite = 10

  const getPaginacao = async (require, response) => {
      const pagina = require.query.page || 1

      const resultado = await app.db('artigo').count('id').first()
      const count = parseInt(resultado.count)

      app.db('artigo')
        .select('id', 'nome', 'descricao')
        .limit(limite).offset(pagina * limite - limite)
        .then(artigo => response.json({data: artigo, count, limite}))
        .catch(e => response.status(500).send(e))
  }

  const getById = (require, response) => {
    app.db('artigo')
      .where({id: require.params.id})
      .first()
      .then(artigo => {
        artigo.conteudo = artigo.conteudo.toString()
        return response.json(artigo)
      })
      .catch(e => response.status(500).send(e))
  }

  const getByCategoria = async (req, res) => {
    const categoriaId = req.params.id
    const page = req.query.page || 1
    const categoria = await app.db.raw(queries.categoryWithChildren, categoriaId)
    const ids = categoria.rows.map(c => c.id)

    app.db({a: 'artigo', u: 'usuario'})
        .select('a.id', 'a.nome', 'a.descricao', 'a.imageUrl', { author: 'u.nome' })
        .limit(limite).offset(page * limite - limite)
        .whereRaw('?? = ??', ['u.id', 'a.usuarioId'])
        .whereIn('categoriaId', ids)
        .orderBy('a.id', 'desc')
        .then(artigo => res.json(artigo))
        .catch(err => res.status(500).send(err))
}

  return {salvar, remove, getPaginacao, getById, getByCategoria}


};
