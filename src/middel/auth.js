
const Reporter = require('../models/reporter')
const jwt = require('jsonwebtoken')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
       .replace('Bearer ','')


        const decode = jwt.verify(token,process.env.JWT_ST)
       

        const reporter = await Reporter.findOne({ _id: decode._id, tokens: token })
      
        if (!reporter) {
            throw new Error()
        }
       req.reporter = reporter

        req.token = token

        next()
    }
    catch (e) {
        res.status(401).send(e)
    }
}

module.exports = auth