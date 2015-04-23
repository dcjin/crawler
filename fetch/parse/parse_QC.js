//解析模块
var request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    common = require('../../common/common'),
    config = require('../../common/config'),
    debug = require('debug')('fetch:parse:qc');

exports.getInfo = function (page, callback) {
    'use strict';
    var all = [],
        url = config.url_QC_partOne + page + config.url_QC_partTwo;
    debug('前程无忧 Page %s...\n', page);

    //After this call all Node basic primitives will understand iconv-lite encodings.
    iconv.extendNodeEncodings();

    request({ url: url, encoding: 'gb2312' }, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var $ = cheerio.load(body),
                aContent = $('#resultList').find('tr');

            aContent.each(function (index, ele) {
                ele = $(ele);
                //a full information contains three parts, each has a class named 'tr' + n (n=0,1,2)
                var className = $(ele).attr('class');

                if (className === 'tr0') {
                    var tr1 = aContent.eq(index + 1),
                        tr2 = aContent.eq(index + 2),
                        detailInfo = {},
                        baseInfo = {
                            job: common.getInfoRow(ele, '.td1', 'a', 0),
                            jobLink: common.getValue(ele, '.td1', 'a', 'href', 0),
                            company: common.getInfoRow(ele, '.td2', 'a', 0),
                            companyLink: common.getValue(ele, '.td2', 'a', 'href', 0),
                            address: common.getInfoRow(ele, '.td3', 'span', 0),
                            time: common.getInfoRow(ele, '.td4', 'span', 0)
                        };

                    baseInfo.id = 'QC_' + common.getValue(tr2, '.wordBreakNormal', 'span', 'id', 0).replace('jobinfo', '');
                    baseInfo.introduce = common.getInfoRow(tr2, '.wordBreakNormal', 'span', 0);

                    detailInfo = common.getDetail_QC(tr1, '.td1234');

                    for (var i in detailInfo) {
                        if (detailInfo.hasOwnProperty(i)) {
                            baseInfo[i] = detailInfo[i];
                        }
                    }
                    all.indexOf(baseInfo.id) === -1 && all.push(baseInfo) && callback(baseInfo);
                }
            });
        }
    });
};