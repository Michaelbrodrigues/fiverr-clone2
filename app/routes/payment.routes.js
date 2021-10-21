const controller = require('../controllers/payment.controller');

module.exports = app => {

    let router = require('express').Router();

    router.put('/:id', controller.upload.single('receiptImage'), controller.update);
    router.put('/checking/:id', controller.checking);

    app.use('/api/purchasing/payment', router);
}