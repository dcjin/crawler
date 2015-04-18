/*
*   Storage Module which contains three method for insert, update and check
*/

var mysql = require('mysql');

//create pool
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'crawler',
    connectionLimit: 15
});

//necessary params
var REQUIRED_PARAMETER = ['id', 'job', 'company', 'address', 'time', 'degree', 'experience', 'companyNature', 'companySize', 'introduce', 'jobLink', 'companyLink'];

/*
*   storage module
*
*   @param  {object}    item        whole information
*   @param  {function}  callback    callback method
*/

exports.storeInfo = function (item, callback) {
    'use strict';
    var params = [];

    //no "id" or dirty data
    if (item.id === '' || item.id === undefined) {
        console.log('bad information');
        callback({
            "err": true,
            "message": 'NO ID or DIRTY DATA'
        });
        return false;
    }

    //transform the info from Object to Array       has two types: [1, 2, 3]    {a:1, b:2, c:3}
    REQUIRED_PARAMETER.forEach(function (param) {
        //if item does not contain this 'param', set it to ''
        if (!item.hasOwnProperty(param)) {
            item[param] = '';
        }
        params.push(item[param]);
    });

    checkInfo(item.id, function (isExist) {
        if (isExist) {
            //WTF SO MANY CALLBACKS!!!
            updateInfo(params, function (isUpdated) {
                isUpdated && callback({
                    "err": false,
                    "message": "jobinfo " + item.id + " is updated"
                });
            });
            return true;
        }
        storeIn(params, function (isStored) {
            isStored && callback({
                "err": false,
                "message": "jobinfo " + item.id + " is stored"
            });
        });
        return true;
    });
};

/*
*   check module
*
*   @param  {number}     id         information's id
*   @param  {function}   callback   callback method
*/
exports.checkInfo = function (id, callback) {
    'use strict';
    checkInfo(id, callback);
};

function checkInfo(id, callback) {
    'use strict';
    pool.getConnection(function (err, conn) {
        if (err) { console.log(err); }

        //http://stackoverflow.com/questions/1346209/unknown-column-in-field-list-error-on-mysql-update-query
        // sql syntax is very important
        // var sql = "SELECT * FROM jobInfo WHERE id='" + id + "'";

        // using sql escape
        var sql = "SELECT * FROM jobInfo WHERE id = ?";

        conn.query(sql, id, function (err, results) {
            if (err) { console.log(err); }

            conn.release();
            if (results.length > 0) {
                callback(true);
                return true;
            }
            callback(false);
            return true;
        });
    });
}

/*
*   insert module
*
*   @param  {Array}     params      which contains whole information
*   @param  {function}  callback    callback method
*/
exports.storeIn = function (params, callback) {
    'use strict';
    storeIn(params, callback);
};

function storeIn(params, callback) {
    'use strict';
    pool.getConnection(function (err, conn) {
        if (err) { console.log(err); }

        // using sql escape
        if (params instanceof Array && params.length > 0) {
            var sql = 'INSERT INTO jobInfo (' + REQUIRED_PARAMETER.join(',') + ') values(' + conn.escape(params) + ')';

            conn.query(sql, function (err) {
                if (err) { console.log(err); }

                conn.release();

                callback(true);
                return true;
            });
        }
    });
}

/*
*   update module
*
*   @param  {Array}     params      which contains whole information
*   @param  {function}  callback    callback method
*/
exports.updateInfo = function (params, callback) {
    'use strict';
    updateInfo(params, callback);
};

function updateInfo(params, callback) {
    'use strict';
    pool.getConnection(function (err, conn) {
        if (err) { console.log(err); }

        if (params instanceof Array && params.length > 0) {
            //assemble sql statement
            var sql = 'UPDATE jobInfo SET ';

            for (var i = 1, len = REQUIRED_PARAMETER.length - 1; i < len; i++) {
                sql += REQUIRED_PARAMETER[i] + ' = ?, '
            }

            sql += REQUIRED_PARAMETER[REQUIRED_PARAMETER.length - 1] + ' = ? WHERE id = ?';

            // assemble params in correct sequence
            var id = params[0];
            for (var j = 1; j < params.length; j++) {
                params[j - 1] = params[j];
            }
            params[params.length - 1] = id;

            //using sql escape
            conn.query(sql, params, function (err) {
                if (err) { console.log(err); }

                conn.release();

                callback(true);
                return true;
            });
        }
    });
}