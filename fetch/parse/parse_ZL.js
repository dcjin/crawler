//解析模块
var request = require('request'),
    cheerio = require('cheerio'),
    common = require('../../common/common'),
    config = require('../../common/config'),
    debug = require('debug')('fetch:parse:zl');

exports.getInfo = function (page, callback) {
    'use strict';
    debug('智联招聘 Page %s...\n', page);
    var all = [];
    request(config.url_ZL + page, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var $ = cheerio.load(body, {decodeEntities: false}),
                aContent = $('table[class=newlist]');

            aContent.each(function (index, ele) {
                ele = $(ele);// wrap to a jQuery object
                if (index !== 0) {
                    var id = common.getValue(ele, '.zwmc', 'input', 'value', 0),
                        baseInfo = {
                            job: common.getInfoRow(ele, '.zwmc', 'a', 0),
                            jobLink: common.getValue(ele, '.zwmc', 'a', 'href', 0),
                            company: common.getInfoRow(ele, '.gsmc', 'a', 0),
                            companyLink: common.getValue(ele, '.gsmc', 'a', 'href', 0),
                            address: common.getInfoRow(ele, '.gzdd', null, -1),
                            time: common.getInfoRow(ele, '.gxsj', 'span', 0),
                            introduce: common.getInfoRow(ele, '.newlist_deatil_last', null, -1)
                        },
                        detailInfo = common.getDetail_ZL($, ele, '.newlist_deatil_two', 'span');

                    baseInfo.id = 'ZL_' + id.replace('000_653_1_03_401__1_', '')
                        .replace('000_653_0', '')
                        .replace('000_653_1_03_201__1_', '')
                        .replace('CC', '')
                        .replace('J90', '');

                    for (var item in detailInfo) {
                        //needed
                        if (detailInfo.hasOwnProperty(item)) {
                            baseInfo[item] = detailInfo[item];
                        }
                    }
                    all.indexOf(baseInfo.id) === -1 && all.push(baseInfo.id) && callback(baseInfo);
                }
            });
        }
    });
};