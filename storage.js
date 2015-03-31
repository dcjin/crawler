var mysql = require('mysql'),
	async = require('async');

//创建连接池
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'crawler',
	connectionLimit: 15
});

exports.storeInfo = function (info) {
	pool.getConnection(function (err, conn) {
		if (err) { console.log('err: ' + err); }

		var sql = "INSERT INTO jobInfo (name, company, address, time) values('" + info.job + "','" + info.company + "','" + info.address + "','" + info.time + "')";

		conn.query(sql, function(err, results) {
			if (err) { console.log(err); return; }

			console.log('saved');
		});

		conn.release();
	})
}