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
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT
        },
		transactionId: {
			type: Sequelize.STRING
		},
		vaNumber: {
			type: Sequelize.STRING
		},
		bank: {
			type: Sequelize.STRING
		},
		status: {
			type: Sequelize.STRING
		},

    }, {
        tableName: 'Purchasing'
    })
    return Purchasing;
}