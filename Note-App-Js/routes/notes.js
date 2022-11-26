const express = require('express');
const { body } = require('express-validator');

const Category = require('../models/category');
const Note = require('../models/note');

const notesController = require('../controllers/notes');

const router = express.Router();
const isAuth = require('../middleware/isAuth');


//// CRUD notes
//create note
router.put('/', isAuth, [
    body('title').trim().not().isEmpty().withMessage('title empty!').custom((value, { req }) => {
        return Note.findOne({ title: value, creator: req.userId }).then(result => {
            if (result) {
                return Promise.reject('Note title already exist!');
            }
        });
    }),
    body('content').not().isEmpty().withMessage('content empty!'),
    body('categoryName').custom((value, { req }) => {
        return Category.findOne({ categoryName: value, creator: req.userId }).then(result => {
            if (!result) {
                return Promise.reject('Category doesnt exist!');
            }
        });
    })

], notesController.createNote);

//fetch single note
router.post('/', isAuth, [
    body('title').trim().not().isEmpty()
], notesController.getNote);

//fetch all notes
router.get('/', isAuth, notesController.getNotesByDate);

//update note
router.patch('/', isAuth, [
    body('title').trim().not().isEmpty().withMessage('title empty!').custom((value, { req }) => {
        return Note.findOne({ title: value, creator: req.userId }).then(result => {
            if (!result) {
                return Promise.reject('Note not found!');
            }
        });
    }),
    body('updatedTitle').trim().not().isEmpty().withMessage('title empty!').custom((value, { req }) => {

        if (value !== req.body.title) {
            return Note.findOne({ title: value, creator: req.userId }).then(result => {
                if (result) {
                    return Promise.reject('title already exist!');
                }
            });
        } else {
            return true;
        }
    }
    ),
], notesController.updateNote);

//delete note
router.delete('/', isAuth, [
    body('title').trim().not().isEmpty().withMessage('title empty!').custom((value, { req }) => {
        return Note.findOne({ title: value, creator: req.userId }).then(result => {
            if (!result) {
                return Promise.reject('Note not found!');
            }
        });
    }),
], notesController.deleteNote);

router.post('/tag', isAuth, [
    body('tag').trim().not().isEmpty().withMessage('title is empty!')
], notesController.fetchNotesByTag);

module.exports = router;
