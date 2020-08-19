
exports.up = function(knex) {
  return knex.schema.createTable ('artigo', table => {
    table.increments('id').primary()
    table.string('nome').notNull()
    table.string('descricao', 1000).notNull()
    table.string('imageUrl', 1000)
    table.binary('conteudo').notNull()
    table.integer('usuarioId').references('id').inTable('usuario').notNull()
    table.integer('categoriaId').references('id').inTable('categoria').notNull()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('artigo')
};
