const express = require('express')
require("dotenv").config()
const app = express()
const cors =require("cors")
const port = process.env.PORT 
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')

require('./db/mongoose')

app.use(express.json())
app.use(cors())
app.use(reporterRouter)
app.use( newsRouter)

app.listen(port,()=>{
    console.log('running')
})