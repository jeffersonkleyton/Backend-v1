
exports.up = function(knex) {
  return knex.schema.createTable('categoria', table => {
    table.increments('id').primary()
    table.string('nome').notNull()
    table.integer('parentId').references('id').inTable('categoria')
  })
};

exports.down = function(knex) {
   return knex.schema.dropTable('categoria')
};
