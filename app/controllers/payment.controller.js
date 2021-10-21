const db = require('../models');
const Purchasing = db.purchasing;
const Payment = db.payment;
const Op = db.Sequelize.Op;

// Import the filesystem module
const fs = require('fs');


const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images/receipt/')
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


exports.update = (req, res) => {
    const PaymentId = req.params.id;
    Payment.findByPk(PaymentId)
        .then(result => {
            if(result) {
                if(result.receiptImage) {
                    const path = process.cwd() + '/uploads/images/receipt/' + result.receiptImage
                    fs.unlink(path, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    })
                }
                const paymentUpd = {
                    receiptImage: req.file.filename,
                    validatedAt: Date.now(),
                    status: "Paid-Unchecking"
                }
                Payment.update(paymentUpd, {
                    where: {
                        id: PaymentId
                    }
                }).then(() => {
                    res.status(200).send({
                        message: "Payment updated successfully!"
                    })
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "There is a problem in the server."
                    })
                })
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the message.'
            })
        })
}

exports.checking = (req, res) => {
    const PaymentId = req.params.id;
    Payment.findByPk(PaymentId)
        .then(result => {
            if (result) {
                const paymentUpd = {
                    validatedAt: Date.now(),
                    status: req.body.status
                }
                Payment.update(paymentUpd, {
                    where: {
                        id: PaymentId
                    }
                }).then(() => {
                    res.status(200).send({
                        message: "Payment updated successfully!"
                    })
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "There is a problem in the server."
                    })
                })
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the message.'
            })
        })
}
// exports.read = (req, res) => {
//     Purchasing.findAll({
//         include: {
//             model: db.payment
//         }
//     }).then(result => {
//         res.status(200).send(result);
//     }).catch(err => {
//         res.status(500).send({
//             message: err.message || "There is a problem in the server."
//         })
//     })
// }