const controller = require('../controllers/service.controller');
const version = require('../config/version.config');
const {
    authJwt
} = require('../middleware');

module.exports = app => {

    let router = require('express').Router();

    router.post('/', authJwt.verifyToken, controller.upload.single('thumbnail'), controller.create);
    router.get('/', controller.read);
    router.delete('/:id', authJwt.verifyToken, controller.delete);
    router.patch('/:id', controller.upload.single('thumbnail'), controller.update);

    app.use(`${version.version}/services`, router);
}