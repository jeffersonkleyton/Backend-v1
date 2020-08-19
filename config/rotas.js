const admin = require ('./admin')

module.exports = (app) => {
  app.post("/signup", app.api.usuario.salvar);
  app.post("/signin", app.api.autenticacao.signin);
  app.post("/validarToken", app.api.autenticacao.validarToken);

  app
    .route("/usuario")
    //.all(app.config.passport.authenticate())
    .post(admin(app.api.usuario.salvar))
    .get(app.api.usuario.get);

  app
    .route("/usuario/:id")
    //.all(app.config.passport.authenticate())
    .put(app.api.usuario.salvar)
    .get(app.api.usuario.obterPorId)
    .delete(app.api.usuario.deletarUsuario);

  app

    .route("/categoria")
    .all(app.config.passport.authenticate())
    .get(admin(app.api.categoria.get))
    .post(admin(app.api.categoria.salvar));

  app
    .route("/categoria/arvore")
    .all(app.config.passport.authenticate())
    .get(app.api.categoria.getArvore);

  app
    .route("/categoria/:id")
    .all(app.config.passport.authenticate())
    .get(app.api.categoria.getById)
    .put(admin(app.api.categoria.salvar))
    .delete(admin(app.api.categoria.remove));

  app
    .route("/artigo")
 //   .all(app.config.passport.authenticate())
    .get(app.api.artigo.getPaginacao)
    .post(admin(app.api.artigo.salvar))

  app
    .route("/artigo/:id")
    .all(app.config.passport.authenticate())
    .get(app.api.artigo.getById)
    .put(admin(app.api.artigo.salvar))
    .delete(admin(app.api.artigo.remove))

  app
    .route("/categoria/:id/artigo")
    .all(app.config.passport.authenticate())
    .get(app.api.artigo.getByCategoria);
};
