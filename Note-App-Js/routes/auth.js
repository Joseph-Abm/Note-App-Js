const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
    body('email').isEmail().withMessage('Invalid email address!')
        .custom((value, { req }) => {

            return User.findOne({ email: value }).then(usr => {
                if (usr) {
                    return Promise.reject('Email address already exist!');
                }
            });

        })
        .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password does not match!');
        }
        return true;
    }),
    body('username').trim().not().isEmpty()
], authController.signup);

router.post('/login', authController.login);

module.exports = router;