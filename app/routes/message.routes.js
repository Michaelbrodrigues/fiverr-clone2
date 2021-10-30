const controller = require('../controllers/message.controller');

module.exports = app => {

    let router = require('express').Router();

    router.get('/detail/:id/:ids', controller.read);
    router.get('/previews/:id', controller.preview);
    router.post('/', controller.create);

    app.use('/api/message', router);
}