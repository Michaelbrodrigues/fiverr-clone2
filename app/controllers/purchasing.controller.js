const db = require('../models');
const Purchasing = db.purchasing;
const ServicePlan = db.servicePlan;
const Payment = db.payment;
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
    const PurchasingId = '_prc' + Math.random().toString(36).substr(2, 9);
    const ServicePlanId = req.body.ServicePlanId;
    ServicePlan.findByPk(ServicePlanId)
        .then(result => {
            const purchasing = {
                id: PurchasingId,
                quantity: req.body.quantity,
                description: req.body.description,
                price: result.price,
                ServicePlanId: ServicePlanId,
                UserId: req.body.UserId,
            }
        
            Purchasing.create(purchasing)
                .then((data) => {
                    const purchaseData = data;
                    const payment = {
                        id: '_prc' + Math.random().toString(36).substr(2, 9),
                        bankType: req.body.bankType,
                        status: "Unpaid",
                        PurchasingId: PurchasingId
                    }
                    Payment.create(payment)
                        .then(result => {
                            res.send({
                                purchasing: purchaseData,
                                payment: result
                            })
                        }).catch((err) => {
                            res.status(500).send({
                                message: err.message || 'Some error occured while creating the message.'
                            })
                        })
                }).catch((err) => {
                    res.status(500).send({
                        message: err.message || 'Some error occured while creating the message.'
                    })
                })
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the message.'
            })
        })
}

exports.read = (req, res) => {
    Purchasing.findAll({
        include: {
            model: db.payment
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "There is a problem in the server."
        })
    })
}