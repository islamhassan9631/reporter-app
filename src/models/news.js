const mongoose = require('mongoose')
const Reporter = require('../models/reporter')
const News = mongoose.model('news',{
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
  
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Reporter"
      
    }
})
module.exports = News