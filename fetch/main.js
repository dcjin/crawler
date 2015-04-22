/*
*   main module 不行，装不下去了，老老实实地写中文。。。。。。。
 */

var async = require('async'),
    CronJob = require('cron').CronJob,
    parse_QC = require('./parse/parse_QC'),
    parse_ZL = require('./parse/parse_ZL'),
    parse_GJ = require('./parse/parse_GJ'),
    storage = require('./../model/storage'),
    common = require('./../common/common');

//全局变量，数组长度，暂存数组
var len = 0, arr = [];

console.log('\nHere they coming! (╯‵□′)╯︵┻━┻\n');

//设置定时任务，立即开始
var job = new CronJob({
    cronTime: '* * 09 * * *', // run at AM 9:00:00 everyday
    onTick: fetch(),
    start: true
});

job.start();

//use async series & eachSeries to control flow
//async模块流程控制
function fetch() {
    'use strict';
    var startDate = new Date();
    async.series([
        //智联招聘  爬取n-m页的列表数据，暂存数组arr
        function (next) {
            console.log('fetching 智联招聘 .......\n');
            async.eachSeries(common.getArr(1, 1), function (page, done) {
                parse_ZL.getInfo(page, function (all) {
                   console.log('Page ' + page + ' is done. Total ' + all.length + '\n');
                   len += all.length;
                   arr = arr.concat(all);

                   done();
               });
            }, function (err) {
                if (err) {
                    console.log(err + '\nSomething is wrong in parse_ZL');
                } else {
                    console.log('Done, total is ' + len + ', next...\n');
                    next();
                }
            });
        },
        //前程无忧  爬取n-m页的列表数据，暂存数组arr
        function (next) {
            console.log('fetching 前程无忧 .......\n');
            async.eachSeries(common.getArr(1, 1), function (page, done) {
                parse_QC.getInfo(page, function (all) {
                    console.log('Page ' + page + ' is done. Total ' + all.length + '\n');
                    len += all.length;
                    arr = arr.concat(all);

                    done();
                });
            }, function (err) {
                if (err) {
                    console.log(err + '\nSomething is wrong in parse_QC');
                } else {
                    console.log('Done, total is ' + len + ', next...\n');
                    next();
                }
            });
        },
        //赶集招聘  爬取n-m页的列表数据，暂存数组arr
        function (next) {
            console.log('fetching 赶集 .......\n');
            async.eachSeries(common.getArr(1, 1), function (page, done) {
                parse_GJ.getInfo(page, function (all) {
                    console.log('Page ' + page + ' is done. Total ' + all.length + '\n');
                    len += all.length;
                    arr = arr.concat(all);

                    done();
                });
            }, function (err) {
                if (err) {
                    console.log(err + '\nSomething is wrong in parse_GJ');
                } else {
                    console.log('All done, total is ' + len + ', to store...\n');
                    next();
                }
            });
        },
        //把arr的列表信息存入数据库
        function (next) {
            async.eachSeries(arr, storage.saveInfo, function (err) {
                if (err) {
                    console.log(err + '\nSomething is wrong in storage')
                } else {
                    var endDate = new Date();
                    storage.clearCount();
                    if (len > 0) {
                        console.log('\nAll info has been stored or updated\n');
                    } else {
                        console.log('\nNo info needs to be stored or updated\n')
                    }
                    console.log('Ended at ' + endDate.toLocaleString());
                    console.log('Total cast ' + common.getTimeOffset(startDate, endDate));
                    next();
                }
            });
        }
    ], function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('\n完成!');
        }
    });
}