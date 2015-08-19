/**
 * Created by ws on 2015/4/22.
 */
var config = require('../common/config'),
    db = config.db_crawler,
    REQUIRED_PARAMETER = config.REQUIRED_PARAMETER;

/*
 *   update module
 *
 *   @param  {Array}     params      which contains whole information
 *   @param  {function}  callback    callback method
 */
exports.update = function (params, str, callback) {
    'use strict';
    db.getConnection(function (err, conn) {
        if (err) {
            console.log(err);
        }

        if (params instanceof Array && params.length > 0) {
            //assemble sql statement
            var sql = str;
            //默认使用爬虫写好的sql语句
            if (!sql) {
                sql = 'UPDATE jobInfo SET ';

                for (var i = 1, len = REQUIRED_PARAMETER.length - 1; i < len; i++) {
                    sql += REQUIRED_PARAMETER[i] + ' = ?, ';
                }

                sql += REQUIRED_PARAMETER[REQUIRED_PARAMETER.length - 1] + ' = ? WHERE id = ?';
            }

            // assemble params in correct sequence
            var id = params[0];
            for (var j = 1; j < params.length; j++) {
                params[j - 1] = params[j];
            }
            params[params.length - 1] = id;

            //using sql escape
            conn.query(sql, params, function (err) {
                if (err) {
                    console.log(err);
                }

                conn.release();

                callback(true);
            });
        }
    });
};