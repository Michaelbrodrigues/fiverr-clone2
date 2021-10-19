const controller = require('../controllers/message.controller');

module.exports = app => {

    let router = require('express').Router();

    router.get('/', controller.read);
    router.post('/', controller.create);

    app.use('/api/message', router);
}