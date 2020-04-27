
const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({

    imageURL: {
        type: String,
        required: [true, 'Image is required']
    },

    description: {
        type: String,
        required: [true, 'Description is required']

    },

    dateCreated: {
        type: Date, 
        default: Date.now()
    },

    author: {    
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    
    },

    likes: {
        type: Array,
        default: []
    },

    comments: {
        type: Array,
        default: []
    }
});


module.exports = mongoose.model('Post', postSchema);