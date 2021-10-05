const { authJwt } = require('../middleware');
const db = require('../models');
const Warehouse = db.warehouse;
const controller = require('../controllers/warehouse.controller');

module.exports = app => {

    let router = require('express').Router();

    router.get('/', controller.read);
    // router.get('/:id', controller.readById);
    router.post('/', controller.create);
    // router.delete('/:id', controller.delete);
    router.patch('/:id', controller.update);

    app.use('/api/warehouse', router);
}