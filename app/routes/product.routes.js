const slugify = require('slugify');
const { authJwt } = require('../middleware');
const db = require('../models');
const Product = db.product;
const controller = require('../controllers/product.controller');

module.exports = app => {

    let router = require('express').Router();

    router.get('/', controller.read);
    router.get('/:id', controller.readById);
    router.post('/', controller.upload.single('thumbnail'), controller.create);
    router.delete('/:id', controller.delete);
    router.patch('/:id', controller.upload.single('thumbnail'), controller.update);

    app.use('/api/product', router);
}