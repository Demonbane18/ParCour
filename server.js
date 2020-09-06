const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const createError = require('http-errors')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000


//Assets
app.use(express.static('public'))

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//page routes
require('./routes/web')(app)
require('./routes/error')(app)




app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)

})