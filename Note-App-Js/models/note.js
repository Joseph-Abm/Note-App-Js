const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    tags: [
        {
            type: String,
            _id: false
        }
    ],

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);