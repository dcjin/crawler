/*
*	测试js哦~
*/

var mysql = require('mysql');

//创建连接池
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'crawler',
	connectionLimit: 15
});

function checkInfo(id) {
	pool.getConnection(function (err, conn) {
		if (err) { console.log(err); }

		var sql = 'SELECT * FROM jobInfo WHERE id=' + id;

		conn.query(sql, function (err, results) {
			if (err) { console.log(err); }

			var flag = results.length > 0 ? true : false;

			conn.release();
		});
	});
}