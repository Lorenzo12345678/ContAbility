const mongoose = require('mongoose');
const User = require('./User');

const {_id} = User

const ExpenseSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required : false 
    },
    date: {
        type: Date,
        default: Date.now

    },
    companyName :{
        type: String,
        required : true,
    },
    key:{
        type: String,
        required: true

    }
    

})

const Expense = mongoose.model('Expense', ExpenseSchema)
module.exports = Expense