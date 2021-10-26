
const { verifySignUp, authJwt } = require('../middleware');
const users = require('../controllers/auth.controller');
const version = require('../config/version.config');

module.exports = app => {

    let router = require('express').Router();

    router.post('/create', [
        verifySignUp.checkDuplicateUsernameOrEmail
    ], users.createUser);

    router.post('/login', users.login);
    router.post('/logout', [
        authJwt.verifyToken
    ], users.logout);

    // router.get('/test', [authJwt.verifyToken], function (req, res) {
    //     res.send("success")
    // });

    app.use(`${version.version}/auth`, router);
}