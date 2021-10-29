const controller = require('../controllers/service-plan.controller');
const version = require('../config/version.config');

module.exports = app => {

    let router = require('express').Router();

    router.get('/', controller.read);
    router.post('/', controller.create);
    router.delete('/:id', controller.delete);
    router.patch('/:id', controller.update);

    app.use(`${version.version}/services/plans`, router);
}