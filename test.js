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

		//http://stackoverflow.com/questions/1346209/unknown-column-in-field-list-error-on-mysql-update-query
        //sql syntax is very important
		//var sql = "SELECT * FROM jobInfo WHERE id='" + id + "'";
		var sql = "SELECT * FROM jobInfo WHERE id = ?";

		conn.query(sql, id, function (err, results) {
			if (err) { console.log(err); }

			conn.release();
			if (results.length > 0) {
				console.log('has');
			} else {
				console.log('dont');
			}
		});
	});
}

checkInfo('QC_63722691');