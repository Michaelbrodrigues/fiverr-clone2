const db = require('../models');
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");

exports.create = (req, res) => {
	const { fullName, username, email, password, RoleId } = req.body;
	const id = '_usr' + Math.random().toString(36).substr(2, 9);
	const hashedPassword = bcrypt.hashSync(password, 10);
	const user = {
		id: id,
		fullName: fullName,
		username: username,
		email: email,
		password: hashedPassword,
		RoleId: RoleId
	}

	User.create(user)
		.then((data) => {
			res.send({
				success: true,
				message: "User Has Been Added Successfully.",
				data: data
			})
		}).catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occured while creating user.'
			})
		})
}

exports.readById = (req, res) => {
    const id = req.params.id;
	User.findByPk(id).then(result => {
		res.status(200).send({
			success: true,
			message: "Get User By Id Has Been Successfully.",
			data: result
		});
	}).catch(err => {
		res.status(500).send({
			message: err.message || "There is a problem in the server."
		})
	})
}