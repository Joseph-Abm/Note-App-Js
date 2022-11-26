const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const categoryRoutes = require('./routes/category');
const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');
const category = require('./models/category');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', 'Content-Type, Authorization');
    next();
});

app.use('/category', categoryRoutes);
app.use('/note', notesRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.stausCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose.connect('mongodb+srv://jozo:jozo@application.n6nqazb.mongodb.net/notes')
    .then(result => {
        app.listen(3000);
        console.log('--- Connected ! ---');
    })
    .catch(err => {
        console.log(err);
    });
