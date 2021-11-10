const db = require('../models');
const Purchasing = db.purchasing;
const ServicePlanFeature = db.servicePlanFeature;
const Payment = db.payment;
const Op = db.Sequelize.Op;

const midtransClient = require('midtrans-client');
// Create Snap API instance
let snap = new midtransClient.Snap({
	// Set to true if you want Production Environment (accept real transaction).
	isProduction: false,
	serverKey: 'SB-Mid-server-XfJX0fTaOs_bEKleKpfreSvu'
});


exports.create = (req, res) => {
    const PurchasingId = 'ORDER-' + Math.random().toString(36).substr(2, 9);
    const ServicePlanFeatureId = req.body.ServicePlanFeatureId;
    ServicePlanFeature.findByPk(ServicePlanFeatureId)
        .then(result => {
            // const purchasing = {
            //     id: PurchasingId,
            //     quantity: req.body.quantity,
            //     description: req.body.description,
            //     price: result.price,
            //     ServicePlanFeatureId: ServicePlanFeatureId,
            //     UserId: req.body.UserId,
            // }

				let parameter = {
					"transaction_details": {
						"order_id": PurchasingId,
						"gross_amount": result.price * req.body.quantity
					},
					"credit_card": {
						"secure": true
					},
					"item_details": [{
						"id": result.id,
						"price": result.price,
						"quantity": req.body.quantity,
						"name": "Fiverr"
					}]
				};

				snap.createTransaction(parameter)
					.then((transaction) => {
						// transaction token
						res.send(transaction.token);
					})
        
            // Purchasing.create(purchasing)
            //     .then((data) => {
            //         const purchaseData = data;
            //         const payment = {
            //             id: '_prc' + Math.random().toString(36).substr(2, 9),
            //             bankType: req.body.bankType,
            //             status: "Unpaid",
            //             PurchasingId: PurchasingId
            //         }
            //         Payment.create(payment)
            //             .then(result => {
            //                 res.send({
			// 					success: true,
			// 					message: "Purchasing Has Been Successfully.",
			// 					data : {
			// 						purchasing: purchaseData,
			// 						payment: result
			// 					}
            //                 })
            //             }).catch((err) => {
            //                 res.status(500).send({
            //                     message: err.message || 'Some error occured while creating the message.'
            //                 })
            //             })
            //     }).catch((err) => {
            //         res.status(500).send({
            //             message: err.message || 'Some error occured while creating the message.'
            //         })
            //     })
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the message.'
            })
        })
}

exports.store = (req, res) => {
	const ServicePlanFeatureId = req.body.ServicePlanFeatureId;
	ServicePlanFeature.findByPk(ServicePlanFeatureId)
		.then(result => {
			const purchasing = {
			    id: req.body.id,
			    quantity: req.body.quantity,
			    description: req.body.description,
			    price: result.price,
			    ServicePlanFeatureId: ServicePlanFeatureId,
			    UserId: req.body.UserId,
				vaNumber: req.body.vaNumber,
				transactionId: req.body.transactionId,
				bank: req.body.bank,
				status: req.body.status
			}

			Purchasing.create(purchasing)
			    .then((data) => {
			        res.send({
						success: true,
						message: "Checkout Has Been Successfully.",
						data: data
					});
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
        where: {
        	[Op.or]: [{
        		id: {
        			[Op.like]: req.query.id ? `%${req.query.id}%` : `%%`
        		},
        		UserId: {
        			[Op.like]: req.query.UserId ? `%${req.query.UserId}%` : `%%`
        		}
        	}]
        },
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

exports.notification = (req, res) => {
	if(req.body.status_code == "200") {
		Purchasing.findAll({
			where: {
				transactionId: req.body.transaction_id
			}
		})
			.then(result => {
				if (result) {
					const status = {
						status: 'Paid'
					}
					Purchasing.update(status, {
						where: {
							transactionId: req.body.transaction_id
						}
					}).then(() => {
						res.status(200).send({
							message: "Purchase updated successfully!"
						})
					}).catch(err => {
						res.status(500).send({
							message: err.message || "There is a problem in the server."
						})
					})
				} else {
					res.status(400).send({
						message: `Product ID ${id} not found!`
					});
				}
			}).catch(err => {
				res.status(500).send({
					message: err.message || "There is a problem in the server."
				})
			})
	}
}

exports.update = (req, res) => {
	const id = req.params.id;
	Purchasing.findByPk(id)
		.then(result => {
			if (result) {
				Purchasing.update(req.body, {
					where: {
						id: id
					}
				}).then(() => {
					res.send({
						success: true,
						message: `Purchasing  ID ${id} Has Been Updated Successfully.`,
					})
				}).catch(err => {
					res.status(500).send({
						message: err.message || "There is a problem in the server."
					})
				})
			} else {
				res.status(400).send({
					message: `Purchasing ID ${id} not found!`
				});
			}
		}).catch(err => {
			res.status(500).send({
				message: err.message || "There is a problem in the server."
			})
		})
}