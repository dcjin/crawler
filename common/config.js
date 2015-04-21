/**
 * Created by super on 2015/4/21.
 */
var mysql = require('mysql');

//db crawler
exports.db_crawler = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'crawler',
    connectionLimit: 15
});

//db shion
exports.db_torrent = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'torrent',
    connectionLimit: 15
});