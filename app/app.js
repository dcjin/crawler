/**
 * Created by super on 2015/4/21.
 */
var express = require('express'),
    read = require('./storage/read'),
    path = require('path'),
    config= require('../common/config');

var app = express();

//app.set('/public', express.static('public'));

app.set('views', __dirname + '/views')
    .set('view engine', 'ejs')
    .use(express.static(path.join(__dirname, 'public')));

app.get('/', function (rep, res) {
    read.getJob(function (results) {
        if (results) {
            var len = Math.ceil(results.length / config.maxLen);
            totalPage = len;
            res.locals.info = {
                result: results.slice(0, config.maxLen),
                totalPage: len,
                now: 1,
                startNo: 1,
                endNo: 10
            };
            res.render('index');
        }
    });
});

var totalPage = 0;
app.get('/page/:id', function (req, res) {
    var id = req.params.id;
    read.getJob(function (results) {
        if (results) {
            var len = Math.ceil(results.length / config.maxLen);
            totalPage = len;
            res.locals.info = {
                result: results.slice(config.maxLen * (id - 1), config.maxLen * id),
                totalPage: len,
                now: id,
                startNo: 1,
                endNo: 10
            };
            if (id >= 6) {
                res.locals.info.startNo = +id - 5;
                res.locals.info.endNo = (+id + 5 > totalPage) ? totalPage : (+id + 5);
            }
            res.render('index');
        }
    });
});

app.listen(config.port);
console.log('start');