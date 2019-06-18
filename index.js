'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const log4js = require('log4js');
const logger = require('./utils/logger');

const app = express();
app.use(log4js.connectLogger(logger, { level: 'info' }));

const config = require('./config.default');

mongoose.connect(config.sandDb, { useNewUrlParser: true })
    .then(() => logger.info(`Server connected to DB ${config.sandDb}`))
    .catch(err => logger.error(err));


app.use(cors());
app.use(compression());
app.use(require('response-time')());
app.use(helmet.frameguard('sameorigin'));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

app.use('/user', require('./API/user'));

app.get('/', function(req, res) {
    res.send(`Welcome on to the port ${process.env.PORT || 5000}`);
});

app.listen(process.env.PORT || 5000, function() {
    logger.info(`Listening on port ${process.env.PORT || 5000}`);
});
