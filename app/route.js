/**
 * Created by ws on 2015/4/27.
 */
//总页数
var totalPage = 0,
    config = require('../common/config'),
    read = require('./storage/read'),
    fetch = require('../fetch/main');

//执行爬虫
exports.getNewInfo = function (req, res) {
    'use strict';
    fetch.fetch();
};

exports.updateInfo = function (req, res) {
    'use strict';
    read.getJob(function (results) {
        if (results) {
            res.json({ msg: results });
        }
    });
    //res.json({ msg: 'fuck hello' });
};

//首页及分页渲染方法
exports.renderView = function (req, res) {
    'use strict';
    var id = req.params.id,
        isIndex = id ? false : true;
    read.getJob(function (results) {
        if (results) {
            renderView(req, res, results, isIndex);
        }
    });
};

function renderView (req, res, results, isIndex) {
    'use strict';
    var id = req.params.id;
    var len = Math.ceil(results.length / config.maxLen);
    totalPage = len;
    res.locals.info = {
        result: results.slice(isIndex ? 0 : config.maxLen * (id - 1), isIndex ? config.maxLen : config.maxLen * id),
        totalPage: len,
        now: isIndex ? 1 : id,
        startNo: 1,
        endNo: 10
    };

    if (!isIndex && id >= 6) {
        res.locals.info.startNo = +id - 5;
        res.locals.info.endNo = (+id + 5 > totalPage) ? totalPage : (+id + 5);
    }

    res.render('index');
}