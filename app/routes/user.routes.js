const controller = require('../controllers/user.controller');
const version = require('../config/version.config');
const {
	authJwt
} = require('../middleware');

module.exports = app => {

	let router = require('express').Router();

	router.get('/:id', controller.readById);
	router.post('/', controller.create);

	app.use(`${version.version}/users`, router);
}