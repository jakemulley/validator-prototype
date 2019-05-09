const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const controller = require('./controllers/index.js')
const app = express()
const upload = multer({ dest: 'uploads' })
const port = process.env.PORT || 5000

app.set('view engine', 'pug')

app.use(bodyParser.json())

app.get('/', controller.index)
app.post('/', upload.single('csv_file'), controller.validate)

app.listen(port, () => console.log(`App running on ${port}`))
