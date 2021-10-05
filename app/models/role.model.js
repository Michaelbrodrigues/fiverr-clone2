module.exports = (sequelize, Sequelize) => {
    const role = sequelize.define('Role', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        roleName: {
            type: Sequelize.STRING
        },
        roleDescription: {
            type: Sequelize.TEXT
        }
    }, {
        tableName: 'Role'
    })
    return role;
}