//pool
var db = require('../../common/config').db_crawler;

exports.getJob = function (callback) {
    'use strict';
    db.getConnection(function(err, conn) {
        if (err) {
            console.log(err);
        }
        conn.query('SELECT * FROM jobinfo', function(err, results) {
            if (err) {
                console.log(err);
            }
            conn.release();
            callback(results);
        });
    });
};

exports.getDetail = function (id, callback) {
    'use strict';
    db.getConnection(function (err, conn) {
        if (err) {
            console.log(err);
        }
        conn.query("SELECT * FROM jobinfo WHERE id = ?", id, function (err, results) {
            if (err) {
                console.log(err);
            }
            conn.release();
            if (results.length > 0) {
                callback(results[0]);
            }
        });
    });
};