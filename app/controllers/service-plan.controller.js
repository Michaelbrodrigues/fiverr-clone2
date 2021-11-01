const db = require('../models');
const ServicePlan = db.servicePlan;
const Op = db.Sequelize.Op;


exports.read = (req, res) => {

	const { id } = req.query;
	
	ServicePlan.findAll({
		where: {
			[Op.or]: [{
				id: {
					[Op.like]: id ? `%${id}%` : `%%`
				}
			}]

		},
		include: [{
				model: db.service
			}
		]
	}).then(result => {
		res.status(200).send({
			success: true,
			message: "Get All Service Plan Has Been Successfully.",
			data: result
		});
	}).catch(err => {
		res.status(500).send({
			message: err.message || "There is a problem in the server."
		})
	})
}

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
            res.send({
				success: true,
				message: " Service Plan Has Been Added Successfully.",
				data: data
            })
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the message.'
            })
        })
}

exports.delete = (req, res) => {
	const id = req.params.id;
	ServicePlan.findByPk(id)
		.then(result => {
			if (result) {
				ServicePlan.destroy({
					where: {
						id: id
					}
				}).then(() => {
					res.status(200).send({
						success: true,
						message: `Service Plan ID ${id} Deleted Successfully.`
					})
				}).catch(err => {
					res.status(500).send({
						message: err.message || "There is a problem in the server."
					})
				})
			} else {
				res.status(400).send({
					message: `Service ID ${id} not found!`
				});
			}
		}).catch(err => {
			res.status(500).send({
				message: err.message || "There is a problem in the server."
			})
		})
}

exports.update = (req, res) => {
	const id = req.params.id;
	ServicePlan.findByPk(id)
		.then(result => {
			if (result) {
				ServicePlan.update(req.body, {
					where: {
						id: id
					}
				}).then(() => {
					res.send({
						success: true,
						message: `Service Plan ID ${id} Has Been Updated Successfully.`,
					})
				}).catch(err => {
					res.status(500).send({
						message: err.message || "There is a problem in the server."
					})
				})
			} else {
				res.status(400).send({
					message: `Service Plan ID ${id} not found!`
				});
			}
		}).catch(err => {
			res.status(500).send({
				message: err.message || "There is a problem in the server."
			})
		})
}