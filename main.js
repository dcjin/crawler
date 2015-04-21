/*
*   main module 不行，装不下去了，老老实实地写中文。。。。。。。
 */

var parse_ZL = require('./parse_ZL'),
    storage = require('./storage'),
    async = require('async');

var len = 0,
    arr = [];

//敌方还有30S到达战场
fetch();
/**************************************************************/

//use async control flow to simplify the asynchronous
function fetch() {
    'use strict';
    console.log('\nHere they coming! (╯‵□′)╯︵┻━┻\n');
    var startDate = new Date();
    async.eachSeries(getArr(1, 2), getZL, function (err) {
        if (err) {
            console.log('Something is wrong');
        } else {
            console.log('All done, total is ' + len + ', to store...\n');

            //https://github.com/caolan/async#eachSeries
            async.eachSeries(arr, storage.storeInfo, function (err) {
                if (err) {
                    console.log('something in storage module is wrong');
                } else {
                    storage.clearCount();
                    console.log('\nAll info has been stored or updated\n');
                    var endDate = new Date();
                    console.log('cast ' + getTime(startDate, endDate));
                }
            });
        }
    });
}

//计算耗时 TODO 有点low
function getTime(start, end) {
    var y = end.getFullYear() - start.getFullYear(),
        m = end.getMonth() - start.getMonth(),
        d = end.getDate() - start.getDate(),
        h = end.getHours() - start.getHours(),
        min = end.getMinutes() - start.getMinutes(),
        s = end.getSeconds() - start.getSeconds();

    var obj = {
        y: y > 0 ? (y > 1 ? y + 'year(s) ' : 'year') : '',
        m: m > 0 ? (m > 1 ? m + 'month(s) ' : 'month') : '',
        d: d > 0 ? (d > 1 ? d + 'day(s) ' : 'day') : '',
        h: h > 0 ? h + 'h ' : '',
        min: min > 0 ? min + 'm ' : '',
        s: s > 0 ? s + 's' : ''
    };
    return obj.y + obj.m + obj.d + obj.h + obj.min + obj.s;
}

function getArr(startNo, endNo) {
    'use strict';
    var arr = [];
    for (var i = startNo; i <= endNo; i++) {
        arr.push(i);
    }
    return arr;
}

//TODO 包一层。。。我也无奈啊
function getZL(page, callback) {
    'use strict';
    parse_ZL.getInfo(page, function (all) {
        console.log('Page ' + page + ' is done. Total ' + all.length + '\n');
        len += all.length;
        arr = arr.concat(all);

        callback(false);
    });
}