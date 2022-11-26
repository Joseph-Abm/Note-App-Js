const { validationResult } = require('express-validator');

const User = require('../models/user');
const Category = require('../models/category');
const Note = require('../models/note');

exports.createNote = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const userId = req.userId;
  const tags = req.body.tags;
  const categoryName = req.body.categoryName;

  let categoryId;
  let note;
  Category.findOne({ creator: userId, categoryName: categoryName })
    .then(category => {

      categoryId = category._id;
      note = new Note({ title: title, content: content, category: category, tags: tags, creator: userId });
      return note.save();
    })
    .then(result => {
      return User.findById(userId);
    })
    .then(user => {
      user.notes.push(note);
      user.save();
      return Category.findById(categoryId);
    })
    .then(category => {
      category.relatedNotes.push(note);
      category.save();
    })
    .then(result => {
      res.status(201).json({ mesage: 'Note created successfully!' });
    }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getNote = (req, res, next) => {

  const userId = req.userId;
  const title = req.body.title;

  Note.findOne({ creator: userId, title: title }).populate({ path: 'category', match: 'categoryName', select: '-__v -creator -relatedNotes -_id' }).select('-_id').select('-category._id').select('-creator')
    .then(note => {
      if (!note) {
        const error = new Error('Note not Found!');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ note: note });
    }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

};

exports.getNotesByDate = (req, res, next) => {

  const userId = req.userId;

  Note.find({ creator: userId })
    .populate({ path: 'category', match: 'categoryName', select: '-__v -creator -relatedNotes -_id' })
    .select('-_id')
    .select('-creator')
    .sort('-updatedAt')
    .then(notes => {
      if (!notes) {
        const error = new Error('Note not Found!');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ notes: notes });
    }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });;

};

exports.updateNote = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const userId = req.userId;
  const title = req.body.title;

  const updatedTitle = req.body.updatedTitle;
  const updatedContent = req.body.updatedContent;
  const updatedTags = req.body.updatedTags;

  console.log(title);
  console.log(updatedTitle);
  console.log(updatedContent);
  console.log(updatedTags);


  Note.findOneAndUpdate({ creator: userId, title: title }, { title: updatedTitle, content: updatedContent, tags: updatedTags })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Note updated sucessfully!' });
    }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteNote = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const userId = req.userId;
  const title = req.body.title;

  let noteId;
  let categoryId;

  Note.findOne({ creator: userId, title: title })
    .then(note => {
      noteId = note._id;
      categoryId = note.category;
      return note.delete();
    })
    .then(result => {
      return User.updateOne({ _id: userId }, { '$pull': { 'notes': noteId } });
    })
    .then(result => {
      return Category.updateOne({ creator: userId, _id: categoryId }, { '$pull': { 'relatedNotes': noteId } });
    })
    .then(result => {
      res.status(200).json({ message: 'Note successfully deleted!' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

};

exports.fetchNotesByTag = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const userId = req.userId;
  const tag = req.body.tag;

  Note.find({ creator: userId, 'tags': { '$elemMatch': { '$eq': tag } } })
    .populate('category', 'categoryName')
    .select('-creator')
    .sort('-updatedAt')
    .then(notes => {
      if (notes.length === 0) {
        const error = new Error('No notes with tag Found!');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ notes: notes });
    }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
    );

};