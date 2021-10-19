module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('Category', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        group: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'Category'
    })
    return Category;
}