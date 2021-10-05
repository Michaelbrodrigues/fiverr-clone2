module.exports = (sequelize, Sequelize) => {
    const Purchasing = sequelize.define('Purchasing', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT
        }
    }, {
        tableName: 'Purchasing'
    })
    return Purchasing;
}