const db = require('../models');
const Service = db.service;
const Op = db.Sequelize.Op;

// Import the filesystem module
const fs = require('fs');


const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images/service/')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + extension
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

exports.upload = multer({
    storage: storage
})

exports.read = (req, res) => {
    const title = req.query.title;
    const UserId = req.query.UserId;
    const id = req.query.id;


    const { page } = req.query;
	const size = 2;

	if(page == null) {
		Service.findAll({
		    where: {
				[Op.or]: [
					{
						title: {
							[Op.like]: title ? `%${title}%` : `%%`
						},
						UserId: {
							[Op.like]: UserId ? `%${UserId}%` : `%%`
						},
						id: {
							[Op.like]: id ? `%${id}%` : `%%`
						}
					}
				]

			},
		    include: [
				{
					model: db.category
				},
				{
					model: db.user
				},
				{
					model: db.servicePlanFeature
				}
			],
		}).then(result => {
			res.status(200).send({
				success: true,
				message: "Get All Service Has Been Successfully.",
				data: result
			});
		}).catch(err => {
			res.status(500).send({
				message: err.message || "There is a problem in the server."
			})
		})
	} else {
		Service.findAndCountAll({
			where: {
				[Op.or]: [{
					title: {
						[Op.like]: title ? `%${title}%` : `%%`
					},
					UserId: {
						[Op.like]: UserId ? `%${UserId}%` : `%%`
					}
				}]

			},
			include: [{
					model: db.category
				},
				{
					model: db.user
				}
			],
			limit: size,
			offset: page == 0 ? page * size : (page - 1) * size,
		}).then(result => {
			res.status(200).send({
				success: true,
				message: "Get All Service Has Been Successfully.",
				data: result
			});
		}).catch(err => {
			res.status(500).send({
				message: err.message || "There is a problem in the server."
			})
		})
	}
}

exports.create = (req, res) => {
    const ServiceId = '_svc' + Math.random().toString(36).substr(2, 9);

    const service = {
        id: ServiceId,
        title: req.body.title,
        description: req.body.description,
        thumbnail: req.file.filename,
        fileFormat: req.body.fileFormat,
        CategoryId: req.body.CategoryId,
        UserId: req.body.UserId,
    }

    Service.create(service)
        .then((data) => {
            res.send({
				success: true,
				message: " Service Has Been Added Successfully.",
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
	Service.findByPk(id)
		.then(result => {
			if (result) {
				const path = process.cwd() + '/uploads/images/service/' + result.thumbnail
				fs.unlink(path, (err) => {
					if (err) {
						console.error(err)
						return
					}
				})

				Service.destroy({
					where: {
						id: id
					}
				}).then(() => {
					res.status(200).send({
						success: true,
						message: `Service ID ${id} Deleted Successfully.`
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
	Service.findByPk(id)
		.then(result => {
			if (result) {
				if (req.file) {
					const path = process.cwd() + '/uploads/images/service/' + result.thumbnail
					fs.unlink(path, (err) => {
						if (err) {
							console.error(err)
							return
						}
					})
					var serviceUpd = {
						title: req.body.title,
						description: req.body.description,
						thumbnail: req.file.filename,
						fileFormat: req.body.fileFormat,
						CategoryId: req.body.CategoryId,
					}
				}
				Service.update(serviceUpd || req.body, {
					where: {
						id: id
					}
				}).then(() => {
					res.send({
						success: true,
						message: `Service  ID ${id} Has Been Updated Successfully.`,
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