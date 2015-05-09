//解析模块
var request = require('request'),
    cheerio = require('cheerio'),
    common = require('../../common/common'),
    config = require('../../common/config'),
    debug = require('debug')('fetch:parse:gj');

//查重使用
var all = [];
exports.clearArr = function () {
    'use strict';
    all = [];
};

exports.getInfo = function (page, callback) {
    'use strict';
    var url = config.url_GJ + 'o' + page + '/';
    debug('赶集招聘 Page %s...\n', page);
    request(url, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            //one dl tag contains whole information
            var $ = cheerio.load(body),
                aContent = $('dl.job-list.list-noimg');

            aContent.each(function (index, ele) {
                ele = $(ele);
                var supernatant = ele.find('.s-box'),
                    baseInfo = {
                        jobLink: common.getValue(ele, 'dt', 'a', 'href', 0),
                        job: common.getInfoRow(ele, 'dt', 'a', 0),
                        id: 'GJ_' + common.getValue(ele, 'dt', 'a', 'puid', 0),
                        company: common.getValue(ele, '.company', 'a', 'title', 0),
                        companyLink: common.getValue(ele, '.company', 'a', 'href', 0),
                        //address: common.getInfoRow(ele, '.pay', null, -1),
                        time: common.getInfoRow(ele, '.pub-time', null, -1),
                        address: common.getDetail_GJ(common.getInfoRow($(supernatant), '.s-butt', 'li', 1)),
                        experience: common.getDetail_GJ(common.getInfoRow($(supernatant), '.s-butt', 'li', 2)),
                        degree: common.getDetail_GJ(common.getInfoRow($(supernatant), '.s-butt', 'li', 3)),
                        companySize: common.getDetail_GJ(common.getInfoRow($(supernatant), '.s-butt', 'li', 5)),
                        introduce: common.getInfoRow($(supernatant), '.s-bu-bm', 'li', 0)
                    };

                if (index === 0) {
                    baseInfo.jobLink = config.url_GJ + baseInfo.id + 'x.htm';
                }
                if (baseInfo.time === '今天') {
                    var day = new Date(),
                        m = day.getMonth() + 1,
                        d = day.getDate();
                    baseInfo.time = ((m < 10) ? ('0' + m) : m) + '-' + ((d < 10) ? ('0' + d) : d);
                }
                //坑爹，同样的信息特么会发两遍，特么还是在同一页里面，特么还有一个是置顶的，尼玛有钱啊
                if (all.indexOf(baseInfo.id) === -1) {
                    all.push(baseInfo.id);
                    callback(baseInfo);
                }
            });
        }
    });
};