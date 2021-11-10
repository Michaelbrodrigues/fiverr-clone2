module.exports = (sequelize, Sequelize) => {
    const ServicePlan = sequelize.define('ServicePlan', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
    }, {
        tableName: 'ServicePlan'
    })
    return ServicePlan;
}