/**
 * Created by ws on 2015/4/22.
 */
var config = require('../common/config'),
    db = config.db_crawler;

/*
 *   check module
 *
 *   @param  {number}     id         information's id
 *   @param  {function}   callback   callback method
 */
exports.check = function (id, str, callback) {
    'use strict';
    db.getConnection(function (err, conn) {
        if (err) {
            console.log(err);
        }

        //http://stackoverflow.com/questions/1346209/unknown-column-in-field-list-error-on-mysql-update-query
        // sql syntax is very important
        // var sql = "SELECT * FROM jobInfo WHERE id='" + id + "'";

        // using sql escape
        var sql = "SELECT * FROM " + str + " WHERE id = ?";

        conn.query(sql, id, function (err, results) {
            if (err) {
                console.log(err);
            }

            conn.release();
            if (results.length > 0) {
                callback(true);
            } else {
                callback(false);
            }
        });
    });
};