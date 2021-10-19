const controller = require('../controllers/purchasing.controller');

module.exports = app => {

    let router = require('express').Router();

    router.post('/', controller.create);
    router.get('/', controller.read);

    app.use('/api/purchasing', router);
}