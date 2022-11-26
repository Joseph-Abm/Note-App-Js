const { validationResult } = require('express-validator');

const User = require('../models/user');
const Category = require('../models/category');
const Note = require('../models/note');

const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

exports.createCategory = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const userId = req.userId;
    const categoryName = req.body.categoryName;

    const category = new Category({
        categoryName: categoryName,
        creator: userId,
        relateNotes: [],
    });
    return category
        .save()
        .then((result) => {
            res.status(201).json({ message: 'Category created !' });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getCategories = (req, res, next) => {

    const userId = req.userId;

    Category.find({ creator: userId })
        .select('-_id')
        .select('-creator')
        .select('-relatedNotes')
        .select('-__v')
        .then(categories => {
            if (!categories.isEmpty) {
                const categoriesArr = categories.map(cat => { return cat['categoryName']; });
                res.status(200).json({ categories: categoriesArr });
            } else {
                const error = new Error('No categories found!');
                error.statusCode = 401;
                throw error;
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateCategory = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const userId = req.userId;

    const categoryName = req.body.categoryName;
    const updatedCategoryName = req.body.updatedCategoryName;

    Category.updateOne({ creator: userId, 'categoryName': categoryName }, { $set: { 'categoryName': updatedCategoryName } })
        .then((result) => {
            res.status(200).json({ message: 'Category successfully updated!' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteCategory = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const userId = req.userId;
    const categoryName = req.body.categoryName;

    let categoryId;
    let relatedNotes;

    Category.findOne({ creator: userId, categoryName: categoryName })
        .then(category => {
            categoryId = category._id;
            relatedNotes = category.relatedNotes;
            return category.delete();
        })
        .then(result => {
            return Note.deleteMany({ creator: userId, category: categoryId });
        })
        .then(result => {
            return User.updateOne({ _id: userId }, { '$pull': { 'notes': { '$in': relatedNotes } } }, { 'multi': 'true' });
        })
        .then(result => {
            res.status(200).json({ message: 'Category successfully deleted!' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};

exports.fetchNotesByCategory = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const userId = req.userId;
    const categoryName = req.body.categoryName;

    Category.findOne({ creator: userId, 'categoryName': categoryName })
        .then(category => {
            if (category.relatedNotes.length === 0) {
                const error = new Error('Category doesnt contain any notes!');
                error.statusCode = 404;
                throw error;
            }
        }).then(result => {
            return Category.aggregate([
                { '$match': { 'creator': ObjectId(userId), 'categoryName': categoryName } },
                { '$unwind': { 'path': '$relatedNotes' } },
                { '$lookup': { 'from': 'notes', 'localField': 'relatedNotes', 'foreignField': '_id', 'as': 'note' } },
                { '$unwind': { 'path': '$note' } },
                { '$replaceRoot': { 'newRoot': '$note' } },
                { '$sort': { 'updatedAt': -1 } }]);
        })
        .then(notes => {
            res.status(200).json({ notes: notes });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });;
};