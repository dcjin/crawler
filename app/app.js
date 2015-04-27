/**
 * Created by super on 2015/4/21.
 */
var express = require('express'),
    path = require('path'),
    config= require('../common/config'),
    route = require('./route');

var app = express();

//app.set('/public', express.static('public'));

app.set('views', __dirname + '/views')
    .set('view engine', 'ejs')
    .use(express.static(path.join(__dirname, 'public')));

app.listen(config.port);
console.log('server start');

app.get('/', route.getIndex)
    .get('/page/:id', route.getPage);