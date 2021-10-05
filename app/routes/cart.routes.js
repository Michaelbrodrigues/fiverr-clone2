const { authJwt } = require('../middleware');
const controller = require('../controllers/cart.controller');

module.exports = app => {

    let router = require('express').Router();

    router.get('/', [authJwt.verifyToken], controller.read);
    router.get('/:id', [authJwt.verifyToken], controller.readById);
    router.post('/', [authJwt.verifyToken], controller.create);
    router.delete('/:id', [authJwt.verifyToken], controller.deleteAll);
    router.delete('/delete/:id', [authJwt.verifyToken], controller.deleteById);
    // router.patch('/:id', controller.upload.single('thumbnail'), controller.update);

    app.use('/api/cart', router);
}