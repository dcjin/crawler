/*
*   parsing module --- 前程无忧
*   杭州 --- 实习
*/

var request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    common = require('./../common/common');

var page = 1;
var url = 'http://search.51job.com/jobsearch/search_result.php?fromJs=1&jobarea=080200%2C00&district=000000&funtype=0000&industrytype=00&issuedate=8&providesalary=99&keywordtype=2&curr_page=' + page + '&lang=c&stype=1&postchannel=0100&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&lonlat=0%2C0&radius=-1&ord_field=0&list_type=0&fromType=14';

exports.getInfo = function () {
    'use strict';
    var all = [], part1 = [], part2 = [];

    //After this call all Node basic primitives will understand iconv-lite encodings.
    iconv.extendNodeEncodings();

    request({ url: url, encoding: 'gb2312' }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var $ = cheerio.load(body),
                aContent = $('#resultList').find('tr');

            aContent.each(function (index, ele) {
                //a full information contains three parts, each has a class named 'tr' + n (n=0,1,2)
                var className = $(ele).attr('class'),
                    obj = {};

                if (className === 'tr0') {
                    obj = {
                        job: common.getInfoRow($(ele), '.td1', 'a', 0),
                        jobLink: common.getValue($(ele), '.td1', 'a', 'href', 0),
                        company: common.getInfoRow($(ele), '.td2', 'a', 0),
                        companyLink: common.getValue($(ele), '.td2', 'a', 'href', 0),
                        address: common.getInfoRow($(ele), '.td3', 'span', 0),
                        time: common.getInfoRow($(ele), '.td4', 'span', 0)
                    };

                    all.push(obj);
                } else if (className === 'tr1') {
                    obj = common.getDetail_QC($(ele), '.td1234');

                    part1.push(obj);
                } else if (className === 'tr2') {
                    obj = {
                        id: common.getValue($(ele), '.wordBreakNormal', 'span', 'id', 0),
                        introduce: common.getInfoRow($(ele), '.wordBreakNormal', 'span', 0)
                    };
                    obj.id = 'QC_' + (obj.id).replace('jobinfo', '');

                    part2.push(obj);
                }
            });

            //Merge
            (function () {
                for (var i = 0, len = all.length; i < len; i++) {
                    for (var baseInfo in part1[i]) {
                        if (part1[i].hasOwnProperty(baseInfo)) {
                            all[i][baseInfo] = part1[i][baseInfo];
                        }
                    }
                    for (var detailInfo in part2[i]) {
                        if (part2[i].hasOwnProperty(detailInfo)) {
                            all[i][detailInfo] = part2[i][detailInfo];
                        }
                    }
                }
            })();
            //console.log(all);
        }
    });

    return all;
};