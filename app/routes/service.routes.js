const controller = require('../controllers/service.controller');

module.exports = app => {

    let router = require('express').Router();

    router.post('/', controller.upload.single('thumbnail'), controller.create);

    app.use('/api/service', router);
}