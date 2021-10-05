module.exports = (sequelize, Sequelize) => {
    const ServicePlan = sequelize.define('ServicePlan', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'ServicePlan'
    })
    return ServicePlan;
}