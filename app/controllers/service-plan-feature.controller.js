const db = require('../models');
const ServicePlanFeature = db.servicePlanFeature;
const Op = db.Sequelize.Op;


exports.read = (req, res) => {
	const { id, ServiceId } = req.query;
	ServicePlanFeature.findAll({
		where: {
			[Op.or]: [{
				id: {
					[Op.like]: id ? `%${id}%` : `%%`
				},
				ServiceId: {
					[Op.like]: ServiceId ? `%${ServiceId}%` : `%%`
				}
			}]
		},
		include: [
			{
				model: db.servicePlan
			},
			{
				model: db.service
			}
		]
	}).then(result => {
		res.status(200).send({
			success: true,
			message: "Get All Service Plan Feature Has Been Successfully.",
			data: result
		});
	}).catch(err => {
		res.status(500).send({
			message: err.message || "There is a problem in the server."
		})
	})
}

exports.create = (req, res) => {
	const ServicePlanFeatureId = '_svpf' + Math.random().toString(36).substr(2, 9);
	const servicePlan = {
		id: ServicePlanFeatureId,
		title: req.body.title,
		ServicePlanId: req.body.ServicePlanId,
		ServiceId: req.body.ServiceId,
		ServicePlanId: req.body.ServicePlanId,
		price: req.body.price,
	}

	ServicePlanFeature.create(servicePlan)
		.then((data) => {
			res.send({
				success: true,
				message: "Service Plan Feature Has Been Added Successfully.",
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
	ServicePlanFeature.findByPk(id)
		.then(result => {
			if (result) {
				ServicePlanFeature.destroy({
					where: {
						id: id
					}
				}).then(() => {
					res.status(200).send({
						success: true,
						message: `Service Plan Feature ID ${id} Deleted Successfully.`
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
	ServicePlanFeature.findByPk(id)
		.then(result => {
			if (result) {
				ServicePlanFeature.update(req.body, {
					where: {
						id: id
					}
				}).then(() => {
					res.send({
						success: true,
						message: `Service Plan Feature ID ${id} Has Been Updated Successfully.`,
					})
				}).catch(err => {
					res.status(500).send({
						message: err.message || "There is a problem in the server."
					})
				})
			} else {
				res.status(400).send({
					message: `Service Plan Feature ID ${id} not found!`
				});
			}
		}).catch(err => {
			res.status(500).send({
				message: err.message || "There is a problem in the server."
			})
		})
}