module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('Category', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        group: {
            type: Sequelize.INTEGER
        }
    }, {
        tableName: 'Category'
    })
    return Category;
}