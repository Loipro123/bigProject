const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commnentId: {
        type:  mongoose.Schema.ObjectId,
        required: true
      },
    commentText: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      require
    },
    star: {
        type: Number,
        required: true
      }
    ,
    userId: {
        type:  mongoose.Schema.ObjectId,
        required: true
      },
    date: {
        type: Date,
        default: Date.now
    }

})
  

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    urlImage: {
        type: String,
        required: true
    },
    urlLink: {
        type: String
    },
    group: {
        type: String,
        required: true
    },
    star: {
        type: Number,
        required: true,
        default: 0
    },
    comments: [
        commentSchema
    ]
});

module.exports = Product =mongoose.model('product', productSchema);