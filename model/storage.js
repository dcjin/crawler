/*
*   Storage Module which contains three method for insert, update and check
*/
var config = require('../common/config'),
    insert = require('../model/insert'),
    update = require('../model/update'),
    check = require('../model/check'),
    debug = require('debug')('storage');

var count = 1,
    REQUIRED_PARAMETER = config.REQUIRED_PARAMETER;

/*
*   storage module
*
*   @param  {object}    item        whole information
*   @param  {function}  callback    callback method
*/
exports.saveInfo = function (item, callback) {
    'use strict';
    //对象数组化
    var params = process(item);

    check.check(item.id, 'jobinfo', function (isExist) {
        //单点退出和早退出！！！！！！
        if (isExist) {
            //WTF SO MANY CALLBACKS!!!
            update.update(params, '', function (isUpdated) {
                if (isUpdated) {
                    debug("NO.%s Info %s is updated", setCounter(count), item.id);
                    count++;
                    callback(false);
                } else {
                    debug('update is wrong');
                    callback(true);
                }
            });
        } else {
            insert.insert(params, '', function (isStored) {
                if (isStored) {
                    debug("NO.%s Info %s is stored", setCounter(count), item.id);
                    count++;
                    callback(false);
                } else {
                    debug('store is wrong');
                    callback(true);
                }
            });
        }
    });
};


//TODO 想不到好的方法，凑合用
exports.clearCount = function () {
    'use strict';
    count = 1;
};

//数据预处理
function process(item) {
    var arr = [];

    //no "id" or dirty data
    if (item.id === '' || item.id === undefined) {
        console.error('这条数据没有ID，当你看到这的时候，表示已经crash了');
    }

    //transform the info from Object to Array       has two types: [1, 2, 3]    {a:1, b:2, c:3}
    REQUIRED_PARAMETER.forEach(function (param) {
        //if item does not contain this 'param', set it to ''
        if (!item.hasOwnProperty(param)) {
            item[param] = '';
        }
        arr.push(item[param]);
    });

    return arr;
}

//设置控制台打印编号
function setCounter(num) {
    'use strict';
    var len = num.toString().length,
        str = '';
    switch (len) {
        case 1:
            str = '00' + num;
            break;
        case 2:
            str = '0' + num;
            break;
        default :
            str = num.toString();
            break;
    }
    return str;
}