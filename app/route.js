/**
 * Created by ws on 2015/4/27.
 */
//总页数
var totalPage = 0,
    config = require('../common/config'),
    read = require('./storage/read');

//首页路由
exports.getIndex = function (rep, res) {
    'use strict';
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
};

//分页路由
exports.getPage = function (req, res) {
    'use strict';
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
};