const db = require('../models');
const Warehouse = db.warehouse;
const Product = db.product;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    Product.findByPk(req.body.productId)
        .then(result => {
            if (result) {
                const warehouse = {
                    quantity: req.body.quantity,
                    price: req.body.price,
                    productId: req.body.productId
                }
                Warehouse.create(warehouse)
                    .then(result => {
                        res.status(200).send(result);
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || 'Some error occured while creating the post.'
                        })
                    })
            } else {
                res.status(400).send({
                    message: `Product ID ${req.body.productId} not found!`
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the post.'
            })
        })
}

exports.update = (req, res) => {
    const id = req.params.id;
    Product.findByPk(req.body.productId)
        .then(result => {
            if (result) {
                Warehouse.findByPk(id)
                    .then(result => {
                        if (result) {
                            Warehouse.update(req.body, {
                                where: {
                                    id: id
                                }
                            })
                                .then(result => {
                                    res.status(200).send({
                                        message: "Product Warehouse updated successfully!"
                                    })
                                }).catch(err => {
                                    res.status(500).send({
                                        message: err.message || "There is a problem in the server."
                                    })
                                })
                        } else {
                            res.status(400).send({
                                message: `Warehouse ID ${id} not found!`
                            });
                        }
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || "There is a problem in the server."
                        })
                    })
            } else {
                res.status(400).send({
                    message: `Product ID ${req.body.productId} not found!`
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the post.'
            })
        })
}

exports.read = (req, res) => {
    Warehouse.findAll({
        include: {
            model: db.product
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "There is a problem in the server."
        })
    })
}