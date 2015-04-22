/**
 * Created by super on 2015/4/21.
 */
//pool
var db = require('../../common/config').db_torrent;
var db1 = require('../../common/config').db_crawler;

var sql = "SELECT * FROM shion";

exports.getAll = function (callback) {
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err);
        }

        callback(results);
    });
};

exports.getJob = function (callback) {
    db1.query("SELECT * FROM jobinfo", function (err, results) {
        if (err) {
            console.log(err);
        }

        callback(results);
    });
};

exports.getDetail = function (id, callback) {
    db1.getConnection(function (err, conn) {
        if (err) {
            console.log(err);
        }

        conn.query("SELECT * FROM jobinfo WHERE id = ?", id, function (err, results) {
            if (err) {
                console.log('11' + err);
            }
            if (results.length > 0) {
                callback(results[0]);
            }
        });
    });
};