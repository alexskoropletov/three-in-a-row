const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const path = require('path');

const port = 3000;
const routes = require('./routes');
const app = express();

app
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'pug')
  .use(logger('dev'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.static(path.join(__dirname, 'node_modules/phaser/dist')))
  .use('/', routes)
  .use((req, res, next) => {
    next(createError(404))
  })
  .use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  })
  .set('port', port);

const server = http.createServer(app);
server.listen(port);

module.exports = app;
