const controller = require('../controllers/purchasing.controller');
const version = require('../config/version.config');

module.exports = app => {

    let router = require('express').Router();

    router.post('/', controller.create);
    router.patch('/:id', controller.update);
    router.get('/', controller.read);

	router.post('/store', controller.store);
	router.post('/notification', controller.notification);

    app.use(`${version.version}/purchasing`, router);
}