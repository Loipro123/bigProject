const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    title: {
        type:  String,
        require: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    urlLink: {
        type: String,
        require: true
    },
    urlImage: {
        type: String,
        require: true
    },
    size: {
        type: String,
        require: true
    }

})

const salesSchema = new mongoose.Schema({
    tax: {
        type: Number,
        required: true
    },
    ship: {
        type: Number,
        required: true
    },
    price: {
      type: Number,
      required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    products: [
        productSchema
    ]

})
const addressSchema = new mongoose.Schema({
    Street: {
      type: String,
      required: true
    },
    Zipcode: {
         type: String,
     },
    City: {
      type: String,
      require:true
    },
    State: {
        type: String,
        required: true
    },
    Country: {
        type: String,
        required: true
    }  
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    address: [
        addressSchema 
    ],
    sales: [
        salesSchema
    ],
    date: {
        type: Date,
        default: Date.now
    }
});




module.exports = User =mongoose.model('user', UserSchema);

