const express = require('express')
const News = require('../models/news')
const router = new express.Router()
const auth = require('../middel/auth')
const multer = require('multer')

const upload =multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            cb(new Error('plz upload image'))
        }
       
        cb(undefined, true)
    }
})

router.post('/news', auth,upload.single('image'),  async (req, res) => {
    try {

        const news = new News({ ...req.body, owner: req.reporter.id })
        news.image =req.file.buffer

        await news.save()
        res.status(200).send(news)
    }
    catch (e) {
        res.status(400).send(e)
    }
})



router.get('/news', auth, async (req, res) => {
    try {
        await req.reporter.populate("News")
        res.send(req.reporter.News)


    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.get('/news/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const news = await News.findOne({ _id, owner: req.reporter._id })
        if (!news) {
            return res.status(404).send()
        }
        res.status(200).send(news)
    }
    catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/news/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findOneAndUpdate({_id,owner:req.reporter._id},req.body, {
    
            new: true,
            runValidators: true
        })

        if (!news) {
            res.status(404).send('No  nwes')
        }
        res.status(200).send(news)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.delete('/news/:id', auth, async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id)
        if (!news) {
            res.status(404).send('No news')
        }
        res.status(200).send(news)
    }
    catch (e) {
        res.status(500).send(e)
    }
})



router.delete('/news', auth, async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id)
        if (!news) {
            res.status(404).send('No news')
        }
        res.status(200).send(news)
    }
    catch (e) {
        res.status(500).send(e)
    }
})



router.post('/new/image/:id', upload.single('image'), auth, async (req, res) => {
    try {
        const reqNews = await News.findOne({ _id: req.params.id, owner: req.reporter._id })
        if (!reqNews) {
            return res.status(400).send('new new found')
        }
        reqNews.image = req.file.buffer
        await reqNews.save()
        res.status(200).send(reqNews)
    }
    catch (e) {
        res.status(400).send(e)
    }
})
router.get("/newnews/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findOne({ _id, owner: req.reporter._id })
        if (!news) {
            return res.status(404).send("no news")
        }
        await news.populate("owner")
        res.status(200).send(news.owner)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router