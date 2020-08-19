module.exports = (app) => {
  const { existeOuErro, naoExisteOuErro, igualOuErro } = app.api.validacao;

  const salvar = (require, response) => {
    const categoria = { ...require.body };

    if (require.params.id) categoria.id = require.params.id;

    console.log(categoria);

    try {
      existeOuErro(categoria.nome, "nome da categoria não informado");
    } catch (mensagem) {
      return response.status(400).send(mensagem);
    }

    if (categoria.id) {
      app
        .db("categoria")
        .update(categoria)
        .where({ id: require.params.id })
        .then((categoria) =>
          response.status(204).send("categoria atualizada com sucesso")
        )
        .catch((e) => response.status(404).send(e));
    } else {
      app
        .db("categoria")
        .insert(categoria)
        .then((_) => response.status(204).send("categoria salva com sucesso"))
        .catch((e) => response.status(500).send(e));
    }
  };

  const remove = async (require, response) => {
    try {
      existeOuErro(
        require.params.id,
        "o código da categoria não foi informado"
      );

      //tem subcategoria?

      const subcategoria = await app
        .db("categoria")
        .where({ parentId: require.params.id });
      naoExisteOuErro(subcategoria, "Categoria possui subcategorias");

      const artigo = await app
        .db("artigo")
        .where({ categoriaId: require.params.id });
      naoExisteOuErro(artigo, "Categoria possi artigos");

      const linhaDeletada = await app
        .db("categoria")
        .where({ id: require.params.id })
        .del();

      existeOuErro(linhaDeletada, "Categoria não foi encontrada");
      response.status(204).send(mensagem);
    } catch (mensagem) {
      response.status(400).send(mensagem);
    }
  };

  const withPath = (categorias) => {
    const pegarParent = (categorias, parentId) => {
      const parent = categorias.filter((parent) => parent.id === parentId);
      return parent.length ? parent[0] : null;
    };

    console.log("pegar Parent: ", pegarParent);

    const categoriaWithPath = categorias.map((cat) => {
      let path = cat.nome;
      let parent = pegarParent(categorias, cat.parentId);

      while (parent) {
        path = `${parent.nome} > ${path}`;
        parent = pegarParent(categorias, parent.parentId);
      }
      return { ...cat, path };
    });

    console.log("Categoria com caminho: ", categoriaWithPath);

    categoriaWithPath.sort((a, b) => {
      if (a.path < b.path) return -1;
      if (a.path > b.path) return 1;
      return 0;
    });

    return categoriaWithPath;
  };

  console.log("com caminho: ", withPath);

  const get = (require, response) => {
    app
      .db("categoria")
      .then((categorias) => response.json(withPath(categorias)))
      .catch((e) => response.status(500).send(e));
  };

  const getById = (require, response) => {
    app
      .db("categoria")
      .where({ id: require.params.id })
      .first()
      .then((categoria) => response.json(categoria))
      .catch((e) => response.status(500).send(e));
  };

  const paraArvore = (categoria, arvore) => {

    if (!arvore) 
        arvore = categoria.filter((c) => !c.parentId);

    arvore = arvore.map((parentNode) => {
      const isChild = (node) => node.parentId == parentNode.id;
      parentNode.filho = paraArvore(categoria, categoria.filter(isChild));
      return parentNode;
    });
    return arvore;
  };

  const getArvore = (req, res) => {
    app
      .db("categoria")
      .then((categoria) => res.json(paraArvore(categoria)))
      .catch((err) => res.status(500).send(err));
  };

  return { salvar, remove, get, getById, getArvore };
};
