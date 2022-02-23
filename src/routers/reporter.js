const express = require('express')
const Reporter = require('../models/reporter')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const auth = require('../middel/auth')
const multer = require("multer")

router.post('/reporters', async (req, res) => {
    try {
        const reporter = new Reporter(req.body)
        await reporter.save()
       const reportert =new Reporter.currentTime() 
      
        const token = await reporter.generateToken()
        res.status(200).send({ reporter, token,reportert })
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/login', async (req, res) => {
    try {
        const reporter = await Reporter.findByCredentials(req.body.email, req.body.password)
        const token = await reporter.generateToken()
        res.status(200).send({ reporter, token })
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})


router.get('/profile', auth, async (req, res) => {
    res.status(200).send(req.reporter)
})


router.get('/reporters', auth, async (req, res) => {
    try {
        const reporter = await Reporter.find({})
        res.send(reporter)
    }
    catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch('/profile', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)

        const reporters = await Reporter.findById(req.reporter)

        if (!reporters) {
            return res.status(404).send('No reporter is found')
        }

        updates.forEach((el) => (reporters[el] = req.body[el]))
        await reporters.save()
        res.status(200).send(reporters)
    }
    catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/reporters', auth, async (req, res) => {
    try {

        const reporter = await Reporter.findByIdAndDelete(req.reporter)
        if (!reporter) {
            res.status(200).send(reporter)

            return res.status(404).send('No reporter is found')
        }
        res.status(200).send(reporter)
    }
    catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete('/profile', auth, async (req, res) => {
    try {

        const reporter = await Reporter.findByIdAndDelete(req.reporter)
        if (!reporter) {
            res.status(200).send(reporter)

            return res.status(404).send('No reporter is found')
        }
        res.status(200).send(reporter)
    }
    catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete('/logout', auth, async (req, res) => {
    try {

        req.reporter.tokens = req.reporter.tokens.filter((el) => {
            return el !== req.reporter.tokens
        })
        await req.reporter.save()
        res.send('Logout Successfully')
    }
    catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete('/logoutall', auth, async (req, res) => {
    try {
        req.reporter.tokens = []
        await req.reporter.save()
        res.send()
    }
    catch (e) {
        res.status(500).send(e.message)
    }

})
const uploads =multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            cb(new Error("error"))
        }
cb(null,true)
     
    }
})
router.post('/avatar',auth,uploads.single("avatar"),async(req,res)=>{
    try{
        req.reporter.avatar=req.file.buffer
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.send(e)
    }
})

module.exports = router