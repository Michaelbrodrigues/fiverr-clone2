const db = require('../models');
const Message = db.message;
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
    const message = {
        id: '_' + Math.random().toString(36).substr(2, 9),
        text: req.body.text,
        UserId: req.body.UserId,
    }

    Message.create(message)
        .then((data) => {
            res.send(data)
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the message.'
            })
        })
}

exports.read = (req, res) => {
    Message.findAll({
        include: {
            model: db.user
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "There is a problem in the server."
        })
    })
}

exports.readSocketMessage = () => {
    return new Promise((resolve, reject) => {
        Message.findAll({
            include: {
                model: db.user
            }
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject({
                message: err.message || "There is a problem in the server."
            })
        })
    });
}

exports.createSocketMessage = (message) => {
    const messageValue = {
        id: message.id,
        text: message.text,
        UserId: message.UserId,
    }
    return new Promise((resolve, reject) => {
        Message.create(messageValue)
            .then((data) => {
                resolve(data);
            }).catch((err) => {
                reject({
                    message: err.message || 'Some error occured while creating the message.'
                })
            })
    });
}