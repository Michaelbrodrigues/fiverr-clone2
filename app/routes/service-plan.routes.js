const controller = require('../controllers/service-plan.controller');

module.exports = app => {

    let router = require('express').Router();

    router.post('/', controller.create);

    app.use('/api/service/plan', router);
}