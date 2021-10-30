module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define('Message', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        text: {
            type: Sequelize.TEXT,
            allowNull: false
        },
		ToUserId: {
			type: Sequelize.STRING
		},
    }, {
        tableName: 'Message'
    })
    return Message;
}