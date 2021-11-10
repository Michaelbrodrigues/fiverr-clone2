const controller = require('../controllers/payment.controller');
const version = require('../config/version.config');

module.exports = app => {

    let router = require('express').Router();

    router.put('/:id', controller.upload.single('receiptImage'), controller.update);
    router.put('/checking/:id', controller.checking);

	router.post('/', controller.midPayment);

    app.use(`${version.version}/purchasing/payment`, router);
}