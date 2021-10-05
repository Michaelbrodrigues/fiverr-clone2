const db = require('../models');
const User = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");


exports.createUser = (req, res) => {
    if (!req.body.email || !req.body.username || !req.body.password || !req.body.roleId || !req.body.fullName) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    } else {

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

        const user = {
            fullName: req.body.fullName,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            roleId: 1
        }

        User.create(user)
            .then((data) => {
                res.send(data)
            }).catch((err) => {
                res.status(500).send({
                    message: err.message || 'Some error occured while creating user.'
                })
            })
    }
};

exports.login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    } else {
        const email = req.body.email;
        const password = req.body.password;
        User.findOne({
            where: {
                email: email,
            }
        }).then(user => {
            if (!user) {
                res.status(400).send({
                    message: "Wrong email or password"
                })
            } else {
                const validatingPassword = bcrypt.compareSync(password, user.password); // true
                if (validatingPassword) {
                    const tokenJwt = jwt.sign({ id: user.id }, config.secret, {
                        expiresIn: 3600 // 24 hours
                    });
                    res.status(200).send({
                        message: "Login successfully!",
                        accessToken: tokenJwt
                    })
                } else {
                    res.status(400).send({
                        message: "Wrong email or password"
                    })
                }
            }
        });
    }
};

exports.logout = (req, res) => {
    const authHeader = req.headers["x-access-token"];
    jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
        if (logout) {
            res.send({ msg: 'You have been Logged Out' });
        } else {
            res.send({ msg: err.message | 'Error' });
        }
    });
}