const express = require('express')
const News = require('../models/news')
const router = new express.Router()
const auth = require('../middel/auth')



router.post('/news', auth, async (req, res) => {
    try {

        const news = new News({ ...req.body, owner: req.reporter.id })

        await news.save()
        res.status(200).send(news)
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})



router.get('/news', auth, async (req, res) => {
    try {
        await req.reporter.populate("News")
        res.send(req.reporter.News)


    }
    catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/news/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const news = await News.findOne({ _id, owner: req.reporter._id })
        if (!news) {
            return res.status(404).send('No news ')
        }
        res.status(200).send(news)
    }
    catch (e) {
        res.status(500).send(e.message)
    }
})


router.patch('/news/:id', auth, async (req, res) => {
    try {

        const news = await News.findOneAndUpdate(req.reporter._id, req.body, {
            new: true,
            runValidators: true
        })

        if (!news) {
            res.status(404).send('No  nwes')
        }
        res.status(200).send(news)
    }
    catch (e) {
        res.status(500).send(e.message)
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
        res.status(500).send(e.message)
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
        res.status(500).send(e.message)
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
        res.status(500).send(e.message)
    }
})

module.exports = router