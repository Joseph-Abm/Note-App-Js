const express = require('express');
const { body } = require('express-validator');

const Category = require('../models/category');

const categoryController = require('../controllers/category');

const router = express.Router();
const isAuth = require('../middleware/isAuth');

////CRUD categories
//create a category
router.put('/', isAuth, [
    body('categoryName').custom((value, { req }) => {
        return Category.findOne({ categoryName: value, creator: req.userId }).then(result => {
            if (result) {
                return Promise.reject('Category already exist!');
            }
        });

    })
], categoryController.createCategory);

//get all categories
router.get('/', isAuth, categoryController.getCategories);

//update category
router.patch('/', isAuth, [
    body('categoryName').custom((value, { req }) => {
        return Category.findOne({ categoryName: value, creator: req.userId }).then(result => {
            if (!result) {
                return Promise.reject('Category not found!');
            }
        });
    }),
    body('updatedCategoryName').custom((value, { req }) => {
        return Category.findOne({ categoryName: value, creator: req.userId }).then(result => {
            if (result) {
                return Promise.reject('Category already exist!');
            }
        });

    })
], categoryController.updateCategory);

//delete category
router.delete('/', isAuth, [
    body('categoryName').trim().custom((value, { req }) => {
        return Category.findOne({ categoryName: value, creator: req.userId }).then(result => {
            if (!result) {
                return Promise.reject('Category not found!');
            }
        });
    })
], categoryController.deleteCategory);

router.post('/', isAuth, [
    body('categoryName').trim().custom((value, { req }) => {
        if (value === "") {
            throw new Error('category name empty!');
        }
        return true;
    }).custom((value, { req }) => {
        return Category.findOne({ categoryName: value, creator: req.userId }).then(result => {
            if (!result) {
                return Promise.reject('Category not found!');
            }
        });
    })
], categoryController.fetchNotesByCategory);


module.exports = router;