const express = require("express");
const mongoose = require("mongoose");
const { checkSchema, body, validationResult } = require("express-validator");
const multer = require("multer");
const Product = require("../models/ProductModel");

// handle GET request at /api/product to get list of all products
exports.productIndex = (req, res, next) => {
    Product.find().then(product => res.json(product));
};

// Multer handling image upload Middleware at /api/product/create
exports.handleImages = function () {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./uploads/");
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        // reject a file
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    const upload = multer({ storage, fileFilter });

    return upload.single("productImage");
};

// handle POST request at /api/product/create to create a new product
// will pass an array of functions as a middleware
exports.createProduct = [
    //validate product that it's not empthy
    // then sanitize it with trima and escape
    body("name")
        .isLength({ min: 2 })
        .withMessage("Must be at least 2 letters")
        .trim()
        .escape(),
    body("description")
        .isLength({ min: 10 })
        .withMessage("Must be at least 10 letters")
        .trim()
        .escape(),
    body("category", "This field is required")
        .isLength({ min: 1 })
        .trim()
        .escape(),
    body("price")
        .isLength({ min: 1 })
        .withMessage("Must be at least 1 number")
        .isNumeric()
        .withMessage("Must be Numeric")
        .trim()
        .escape(),
    body("numberInStock")
        .isLength({ min: 1 })
        .withMessage("Must be at least 1 number")
        .isNumeric()
        .withMessage("Must be Numeric")
        .trim()
        .escape(),

    // continue process after validation
    (req, res, next) => {
        // get the validation errors from the request
        const errors = validationResult(req);

        // create new product after being validated and sanitized
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            productImage: req.file.path
        });

        // if there are errors send them as json
        if (!errors.isEmpty()) {
            res.status(442).json({
                message: "Request fields are invalid",
                errors: errors.array()
            });
        } else {
            newProduct
                .save()
                .then(() => res.redirect(newProduct.url))
                .catch(err => res.json(err));
        }
    }
];

// handle GET request at /api/product/:id to get details for a specific product
exports.productDetails = (req, res) => {
    Product.findById(req.params.id)
        .populate("category")
        .exec(function (err, result) {
            if (err) {
                res.json(err.message);
            } else {
                res.json(result);
            }
        });
};

// handle DELETE request at /api/product/:id/delete to delete an item by its id
exports.deleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json({ message: `item ${req.params.id} was deleted` });
        }
    });
};

// handle POST request at /api/product/:id/update to update an item
exports.updateProduct = [
    //validate product that it's not empthy
    // then sanitize it with trima and escape
    body("name")
        .isLength({ min: 2 })
        .withMessage("Must be at least 2 letters")
        .trim()
        .escape(),
    body("description")
        .isLength({ min: 10 })
        .withMessage("Must be at least 10 letters")
        .trim()
        .escape(),
    body("category", "This field is required")
        .isLength({ min: 1 })
        .trim()
        .escape(),
    body("price")
        .isLength({ min: 1 })
        .withMessage("Must be at least 1 number")
        .isNumeric()
        .withMessage("Must be Numeric")
        .trim()
        .escape(),
    body("numberInStock")
        .isLength({ min: 1 })
        .withMessage("Must be at least 1 number")
        .isNumeric()
        .withMessage("Must be Numeric")
        .trim()
        .escape(),

    (req, res, next) => {
        // get validation errors if there are any
        const errors = validationResult(req);

        // if there are validation errors send them in json
        if (!errors.isEmpty()) {
            res.status(402).json({
                message: "Invalid Inputs",
                errors: errors.array()
            });
        } else {
            // find one product in the database to get the same image
            //if the user won't update the image
            Product.findById(req.params.id, "productImage")
                .then(function (product) {
                    // create updated product with the provided data
                    let updatedProduct = {
                        name: req.body.name,
                        description: req.body.description,
                        category: req.body.category,
                        price: req.body.price,
                        numberInStock: req.body.numberInStock,
                        productImage: req.file
                            ? req.file.path
                            : product.productImage
                    };

                    Product.findByIdAndUpdate(req.params.id, updatedProduct, {
                        new: true,
                        useFindAndModify: false
                    })
                        .then(product => res.redirect(product.url))
                        .catch(err => res.json(err));
                })
                .catch(err => res.json(err));
        }
    }
];
