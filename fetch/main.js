/*
*   使用parallel  分页、抓取、存储全都是异步，不嵌套
*   每141条数据全程耗时约8s，其中抓取约耗时5s，存储耗时3s
 */

var async = require('async'),
    CronJob = require('cron').CronJob,
    parse_QC = require('./parse/parse_QC'),
    parse_ZL = require('./parse/parse_ZL'),
    parse_GJ = require('./parse/parse_GJ'),
    storage = require('./../model/storage'),
    common = require('./../common/common'),
    debug = require('debug')('fetch:main');


fetch();


//开始定时爬虫任务
exports.start = function () {
    'use strict';
    start();
};

//cron设置定时任务，此处为每30s执行一次
function start() {
    'use strict';
    //设置定时任务
    var job = new CronJob({
        cronTime: '*/30 * * * * *', // run at AM 9:00:00 everyday
        onTick: fetch,
        start: true
    });

    job.start();
}


//立即执行爬虫,单词执行
exports.fetch = function () {
    'use strict';
    fetch();
};

//use async series & eachSeries to control flow
//async模块流程控制
function fetch() {
    'use strict';
    storage.clearCount();
    debug('\n\n------------------(╯‵□′)╯︵┻━┻------------------\n\n');
    async.parallel([
        //智联招聘  爬取n-m页的列表数据
        function (finish) {
            debug('fetching 智联招聘 .......\n');
            async.eachSeries(common.getArr(1, 2), function (page, done) {
                parse_ZL.getInfo(page, function (all) {
                    storage.saveInfo(all, function(err) {
                        if(err) { console.log(err); }
                    });
                });
                done();
            }, function (err) {
                if (err) {
                    console.log(err + '\nSomething is wrong in parse_ZL');
                } else {
                    finish();
                }
            });
        },
        //前程无忧  爬取n-m页的列表数据
        function (finish) {
            debug('fetching 前程无忧 .......\n');
            async.eachSeries(common.getArr(1, 2), function (page, done) {
                parse_QC.getInfo(page, function (all) {
                    storage.saveInfo(all, function(err) {
                        if(err) { console.log(err); }
                    });

                });
                done();
            }, function (err) {
                if (err) {
                    console.log(err + '\nSomething is wrong in parse_QC');
                } else {
                    finish();
                }
            });
        },
        //赶集招聘  爬取n-m页的列表数据
        function (finish) {
            debug('fetching 赶集招聘 .......\n');
            async.eachSeries(common.getArr(1, 2), function (page, done) {
                parse_GJ.getInfo(page, function (all) {
                    storage.saveInfo(all, function(err) {
                        if(err) { console.log(err); }
                    });


                });
                done();
            }, function (err) {
                if (err) {
                    console.log(err + '\nSomething is wrong in parse_GJ');
                } else {
                    finish();
                }
            });
        }
    ], function(err) {
        if (err) {
            console.log(err);
        } else {
            debug('\n\n------------------(╯‵□′)╯︵┻━┻------------------\n\n');
        }
    });
}