const controller = require('../controllers/service.controller');
const version = require('../config/version.config');
const {
    authJwt
} = require('../middleware');

module.exports = app => {

    let router = require('express').Router();

    router.post('/', controller.upload.single('thumbnail'), controller.create);
    router.get('/services', authJwt.verifyToken, controller.read);

    app.use(`${version.version}`, router);
}