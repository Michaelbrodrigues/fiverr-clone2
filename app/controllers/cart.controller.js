const db = require('../models');
const Cart = db.cart;
const Op = db.Sequelize.Op;


exports.read = (req, res) => {
    Cart.findAll({
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

exports.readById = (req, res) => {

    const id = req.params.id;
    Cart.findAll({
        where: {
            userId: id
        },
        include: {
            model: db.product
        }
    }).then(result => {
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(400).send({
                message: `User ID ${id} Not Found!`
            })
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "There is a problem in the server."
        })
    })
}

exports.deleteAll = (req, res) => {
    Cart.findOne({
        where: {
            cartCode: req.params.id
        }
    }).then((result) => {
        if (result) {
            Cart.destroy({
                where: {
                    cartCode: req.params.id
                }
            }).then(() => {
                res.status(200).send({
                    message: "Cart Cleared Successfully."
                })
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "There is a problem in the server."
                })
            })
        } else {
            res.status(400).send({
                message: `Cart Code ${req.params.id} not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "There is a problem in the server."
        })
    })
}

exports.deleteById = (req, res) => {
    Cart.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        if (result) {
            Cart.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.status(200).send({
                    message: `Product ID ${req.params.id} Deleted Successfully.`
                })
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "There is a problem in the server."
                })
            })
        } else {
            res.status(400).send({
                message: `Cart ID ${req.params.id} not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "There is a problem in the server."
        })
    })
}

exports.create = (req, res) => {
    Cart.findOne({
        where: {
            userId: req.body.userId,
            isCheckedOut: false
        }
    }).then(result => {
        const code = result ? result.cartCode : '_' + Math.random().toString(36).substr(2, 9);
        Cart.findOne({
            where: {
                userId: req.body.userId,
                isCheckedOut: false,
                productId: req.body.productId
            }
        }).then(result => {
            if (result) {
                const qtyUpd = {
                    quantity: result.quantity + req.body.quantity
                }
                Cart.update(qtyUpd, {
                    where: {
                        id: result.id
                    }
                }).then(result => {
                    res.status(200).send({
                        message: "Cart Updated Successfully!"
                    })
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "There is a problem in the server."
                    })
                })
            } else {
                const cart = {
                    cartCode: code,
                    quantity: req.body.quantity,
                    cartNotes: req.body.cartNotes,
                    isCheckedOut: false,
                    userId: req.body.userId,
                    productId: req.body.productId
                }
                Cart.create(cart)
                    .then((data) => {
                        res.send(data)
                    }).catch((err) => {
                        res.status(500).send({
                            message: err.message || 'Some error occured while creating the post.'
                        })
                    })
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "There is a problem in the server."
            })
        })
    }).catch(err => {
        res.status(500).send({
            message: err.message || "There is a problem in the server."
        })
    })
}