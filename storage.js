var mysql = require('mysql');

//创建连接池
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'crawler',
	connectionLimit: 15
});

exports.storeInfo = function (item) {
	pool.getConnection(function (err, conn) {
		if (err) { console.log('err: ' + err); }

		var REQUIRED_PARAMETER = ['jobID', 'job', 'company', 'address', 'time', 'degree', 'experience', 'companyNature', 'companySize', 'introduce'];

		REQUIRED_PARAMETER.forEach(function (param) {
			if (typeof item[param] === 'undefined') {
				if (param === 'jobID') {
					item[param] = 0;
				}
				item[param] = '';
			}
		});

		var sql = "INSERT INTO jobInfo (id, name, company, address, time, degree, experience, companyNature, companySize, introduce) values('"
			+ item.jobID + "','" + item.job + "','" + item.company + "','" + item.address + "','" + item.time + "','" + item.degree + "','" + item.experience + "','"
			+ item.companyNature + "','" + item.companySize + "','" + item.introduce +"')";

		conn.query(sql, function(err, results) {
			if (err) { console.log(err); return; }

			console.log('saved');
		});

		conn.release();
	})
}