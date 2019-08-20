const mongoose = require('mongoose');
const debug = require('debug')('app:*');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const express = require('express');
const genres = require('./routes/genres');
const home = require('./routes/home');
const app = express();

mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Error when connecting MongoDB...', err.message));

app.set('view engine', 'pug');
app.set('views', './views'); // default

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/genres', genres);
app.use('/', home);

// Configuration
// debug('Application Name: ' + config.get('name'));
// debug('Mail Server: ' + config.get('mail.host'));
// debug('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

app.use(logger.log);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listener in port ${port}`));