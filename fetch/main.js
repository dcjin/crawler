/*
*   main module 不行，装不下去了，老老实实地写中文。。。。。。。
 */

var parse_ZL = require('./parse_ZL'),
    storage = require('./storage'),
    async = require('async'),
    common = require('./../common/common');

var len = 0, arr = [];

fetch();

//use async control flow to simplify the asynchronous
function fetch() {
    'use strict';
    console.log('\nHere they coming! (╯‵□′)╯︵┻━┻\n');
    //记录起始时间
    var startDate = new Date();
    async.eachSeries(common.getArr(1, 2), function (page, callback) {
        //按页爬取每页包含的列表信息，并存入一级数组arr
        parse_ZL.getInfo(page, function (all) {
            console.log('Page ' + page + ' is done. Total ' + all.length + '\n');
            len += all.length;
            arr = arr.concat(all);

            callback(false);
        });
    }, function (err) {
        //完成上述后调用
        if (err) {
            console.log('Something is wrong');
        } else {
            console.log('All done, total is ' + len + ', to store...\n');

            //https://github.com/caolan/async#eachSeries
            //arr包含所有列表信息，逐个存入数据库，或者更新
            async.eachSeries(arr, storage.storeInfo, function (err) {
                if (err) {
                    console.log('something in storage module is wrong');
                } else {
                    var endDate = new Date();
                    storage.clearCount();
                    console.log('\nAll info has been stored or updated\n');
                    console.log('Ended at ' + endDate.toLocaleString() + '. Total cast ' + common.getTimeOffset(startDate, endDate));
                }
            });
        }
    });
}