//解析模块
var request = require('request'),
    cheerio = require('cheerio'),
    common = require('../../common/common'),
    config = require('../../common/config');

exports.getInfo = function (page, callback) {
    'use strict';
    var all = [],
        url = config.url_GJ + 'o' + page + '/';
    console.log('Page ' + page + '...');
    request(url, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            //one dl tag contains whole information
            var $ = cheerio.load(body),
                aContent = $('dl.job-list.list-noimg');

            aContent.each(function (index, ele) {
                var supernatant = $(ele).find('.s-box'),
                    obj = {
                        job: common.getInfoRow($(ele), 'dt', 'a', 0),
                        id: 'GJ_' + common.getValue($(ele), 'dt', 'a', 'puid', 0),
                        company: common.getValue($(ele), '.company', 'a', 'title', 0),
                        companyLink: common.getValue($(ele), '.company', 'a', 'href', 0),
                        address: common.getInfoRow($(ele), '.pay', null, -1),
                        time: common.getInfoRow($(ele), '.pub-time', null, -1),
                        experience: common.getDetail_GJ(common.getInfoRow($(supernatant), '.s-butt', 'li', 2)),
                        degree: common.getDetail_GJ(common.getInfoRow($(supernatant), '.s-butt', 'li', 3)),
                        companySize: common.getDetail_GJ(common.getInfoRow($(supernatant), '.s-butt', 'li', 5)),
                        introduce: common.getInfoRow($(supernatant), '.s-bu-bm', 'li', 0)
                    };

                if (index === 0) {
                    obj.jobLink = config.url_GJ + obj.id + 'x.htm';
                }
                if (obj.time === '今天') {
                    var day = new Date(),
                        m = day.getMonth() + 1,
                        d = day.getDate();
                    obj.time = ((m < 10) ? ('0' + m) : m) + '-' + d;
                }
                all.push(obj);
            });
            callback(all);
        }
    });
};