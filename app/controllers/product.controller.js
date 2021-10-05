const db = require('../models');
const Product = db.product;
const Op = db.Sequelize.Op;
const slugify = require('slugify');
// Import the filesystem module
const fs = require('fs');


const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images/product/')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + extension
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

exports.upload = multer({ storage: storage })

exports.create = (req, res) => {
    const product = {
        productName: req.body.productName,
        slug: slugify(req.body.productName),
        productDescription: req.body.productDescription,
        thumbnail: req.file.filename,
        grade: req.body.grade,
        shape: req.body.shape,
        weight: req.body.weight,
        productType: req.body.productType
    }

    Product.create(product)
        .then((data) => {
            res.send(data)
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured while creating the post.'
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Product.findByPk(id)
        .then(result => {
            if (result) {
                const path = process.cwd() + '/uploads/images/product/' + result.thumbnail
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    //file removed
                })

                Product.destroy({
                    where: {
                        id: id
                    }
                }).then(result => {
                    res.status(200).send({
                        message: "Product Deleted Successfully."
                    })
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "There is a problem in the server."
                    })
                })
            } else {
                res.status(400).send({
                    message: `Product ID ${id} not found!`
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "There is a problem in the server."
            })
        })
}

exports.update = (req, res) => {
    const id = req.params.id;

    Product.findByPk(id)
        .then(result => {
            if (result) {
                if (req.file) {
                    const path = process.cwd() + '/uploads/images/product/' + result.thumbnail
                    fs.unlink(path, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        //file removed
                    })
                    var productUpd = {
                        productName: req.body.productName,
                        slug: slugify(req.body.productName),
                        productDescription: req.body.productDescription,
                        thumbnail: req.file.filename,
                        grade: req.body.grade,
                        shape: req.body.shape,
                        weight: req.body.weight,
                        productType: req.body.productType
                    }
                }
                Product.update(productUpd || req.body, {
                    where: {
                        id: id
                    }
                }).then(result => {
                    res.status(200).send({
                        message: "Product updated successfully!"
                    })
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "There is a problem in the server."
                    })
                })
            } else {
                res.status(400).send({
                    message: `Product ID ${id} not found!`
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "There is a problem in the server."
            })
        })
}

exports.read = (req, res) => {
    const productName = req.query.productName;
    let condition = productName ? { productName: { [Op.like]: `%${productName}%` } } : null;

    Product.findAll({
        where: condition
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

    Product.findByPk(id)
        .then(result => {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(400).send({
                    message: `Product ID ${id} not found!`
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "There is a problem in the server."
            })
        })
}