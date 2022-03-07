const mongoose = require('mongoose')
const Reporter = require('../models/reporter')

const  newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    image: {
        type: Buffer
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Reporter"

    }
})
newsSchema.methods.toJson = function () {
    const news = this
    const newsObject = news.toOcject()

return newsObject
}
 const News = mongoose.model('news', newsSchema)
module.exports = News
   