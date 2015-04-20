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
    async.eachSeries(getArr(1, 5), getZL, function (err) {
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
                    console.log('\nAll info has been stored or updated');
                }
            });
        }
    });
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