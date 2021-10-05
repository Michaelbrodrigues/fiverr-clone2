module.exports = (sequelize, Sequelize) => {
    const ServicePlanFeature = sequelize.define('ServicePlanFeature', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        tableName: 'ServicePlanFeature'
    })
    return ServicePlanFeature;
}