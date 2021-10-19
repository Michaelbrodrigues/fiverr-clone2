const db = require('../models');
const ServicePlan = db.servicePlan;
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
    const ServicePlanId = '_svp' + Math.random().toString(36).substr(2, 9);
    const servicePlan = {
        id: ServicePlanId,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        ServiceId: req.body.ServiceId,
    }

    ServicePlan.create(servicePlan)
        .then((data) => {
            res.send(data)
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the message.'
            })
        })
}