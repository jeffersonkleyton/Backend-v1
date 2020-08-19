module.exports = {
    categoryWithChildren: `
        WITH RECURSIVE subcategories (id) AS (
            SELECT id FROM categoria WHERE id = ?
            UNION ALL
            SELECT c.id FROM subcategories, categoria c
                WHERE "parentId" = subcategories.id
        )
        SELECT id FROM subcategories
    `
}