const db = require('../models');
const Service = db.service;
const Op = db.Sequelize.Op;

// Import the filesystem module
const fs = require('fs');


const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images/service/')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + extension
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

exports.upload = multer({
    storage: storage
})

exports.read = (req, res) => {
    const serviceName = req.query.serviceName;
    let condition = serviceName ? {
        name: {
            [Op.like]: `%${serviceName}%`
        }
    } : null;

    Service.findAll({
        where: condition,
        include: {
            model: db.category
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "There is a problem in the server."
        })
    })
}

exports.create = (req, res) => {
    const ServiceId = '_svc' + Math.random().toString(36).substr(2, 9);
    const service = {
        id: ServiceId,
        title: req.body.title,
        description: req.body.description,
        thumbnail: req.file.filename,
        fileFormat: req.body.fileFormat,
        CategoryId: req.body.CategoryId,
        UserId: req.body.UserId,
    }

    Service.create(service)
        .then((data) => {
            res.send(data)
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the message.'
            })
        })
}