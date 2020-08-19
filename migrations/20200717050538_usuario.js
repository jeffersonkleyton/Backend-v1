
exports.up = function(knex) {
  return knex.schema.createTable('usuario', table => {
    table.increments('id').primary()
    table.string('nome').notNull()
    table.string('email').notNull().unique()
    table.string('senha').notNull()
    table.boolean('admin').notNull().defaultTo(false)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('usuario')
};
