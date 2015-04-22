/**
 * Created by super on 2015/4/21.
 */
var express = require('express'),
    read = require('./storage/read');

var app = express();

app.set('views', __dirname + '/views')
    .set('view engine', 'ejs')
    .set('/res', express.static('res'));

app.get('/', function (rep, res) {
    read.getJob(function (results) {
        if (results) {
            res.locals.info = results;
            res.render('index');
        }
    });
});
app.get('/detail/:id', function (req, res) {
    read.getDetail(req.params.id, function (results) {
        if (results) {
            res.locals.info = results;
            res.render('detail');
        }
    });
});

app.listen(3000);
console.log('start');