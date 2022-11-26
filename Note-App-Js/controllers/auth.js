const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

////this is for demo purposes

//const nodemailer = require('nodemailer');
//const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

////this is for demo purposes

//const transporter = nodemailer.createTransport(sendgridTransport({
//    auth:{
//        api_key:'generated_api_key_goes_here'
//    }
//}));

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  bcrypt
    .hash(password, 12)
    .then((hashedP) => {
      const user = new User({
        email: email,
        password: hashedP,
        username: username,
        posts: [],
      });
      return user.save();
    })
    .then((result) => {
      ////this is for demo purposes

      //transporter.sendMail({
      //    to: email,
      //    from: 'me@mail.com',
      //    subject:'Signup Successful',
      //    html: `<h1>Welcome ${username}, Thank you for signing up!<h1>`
      //})

      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error('No user with such email!');
        error.statusCode = 401;
        throw error;
      }

      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Incorrect Password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { userId: loadedUser._id.toString() },
        'jwtsecret',
        { expiresIn: '1h' },
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
