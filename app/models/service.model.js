module.exports = (sequelize, Sequelize) => {
    const Service = sequelize.define('Service', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT
        },
        thumbnail: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fileFormat: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        tableName: 'Service'
    })
    return Service;
}