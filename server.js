const express = require('express');
const app = express();
const index_controller = require('./controllers/index.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads' });

app.set('view engine', 'pug');

app.get('/', index_controller.index);
app.post('/', upload.single('csv_file'), index_controller.validate);

app.listen(process.env.PORT || 5000, () => console.log('App running on :3000'));
