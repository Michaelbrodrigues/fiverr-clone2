module.exports = (sequelize, Sequelize) => {
    const role = sequelize.define('Role', {
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