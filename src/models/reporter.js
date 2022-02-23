const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const iSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 20,
        validate(value) {
            if (value < 0) {
                throw new Error(' postive number')

            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,

    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /01[0125]\d{4}\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    },
    avatar:{
        type:Buffer
    },
  
    tokens: [
        {
            type: String,
            required: true
        }
    ]
})




iSchema.pre('save', async function () {

    const reporter = this

    if (reporter.isModified('password')) { reporter.password = await bcrypt.hash(reporter.password, 8) }
})



iSchema.statics.findByCredentials = async (email, password) => {
    const reporter = await Reporter.findOne({ email })

    if (!reporter) {
        throw new Error('Unable to login..check email or password')
    }

    const isMatch = await bcrypt.compare(password, reporter.password)

    if (!isMatch) {
        throw new Error('Unable to login..check email or password')
    }
    return reporter

}



iSchema.methods.generateToken = async function () {
    const reporter = this
    const token = jwt.sign({ _id: reporter._id.toString() },process.env.JWT_ST)

    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()

    return token
}
iSchema.virtual("News",{
    ref:"news",
    localField:"_id",
    foreignField:"owner"
})

const Reporter = mongoose.model('Reporter', iSchema)
module.exports = Reporter

