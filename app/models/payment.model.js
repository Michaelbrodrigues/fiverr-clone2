module.exports = (sequelize, Sequelize) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        bankType: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING
        },
        validatedAt: {
            type: Sequelize.DATE
        },
        receiptImage: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'Payment'
    })
    return Payment;
}