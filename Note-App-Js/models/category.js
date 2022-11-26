const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({

    categoryName: {
        type: String,
        required: true
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    relatedNotes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
});

module.exports = mongoose.model('Category', categorySchema);