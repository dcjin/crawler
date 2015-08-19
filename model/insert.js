/**
 * Created by ws on 2015/4/22.
 *
 */
var config = require('../common/config'),
    db = config.db_crawler,
    REQUIRED_PARAMETER = config.REQUIRED_PARAMETER;

/*
 *   insert module
 *
 *   @param  {Array}     params      which contains whole information
 *   @param  {function}  callback    callback method
 */
exports.insert = function (params, str, callback) {
    'use strict';
    db.getConnection(function (err, conn) {
        if (err) {
            console.log(err);
        }

        if (params instanceof Array && params.length) {
            var sql = str || 'INSERT INTO jobInfo (' + REQUIRED_PARAMETER.join(',') + ') values(' + conn.escape(params) + ')';
            conn.query(sql, function (err) {
                if (err) {
                    console.log(err);
                }

                conn.release();

                callback(true);
            });
        }
    });
};