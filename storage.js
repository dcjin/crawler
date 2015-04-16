var mysql = require('mysql');

//create pool
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'crawler',
	connectionLimit: 15
});

//necessary params
var REQUIRED_PARAMETER = ['id', 'job', 'company', 'address', 'time', 'degree', 'experience', 'companyNature', 'companySize', 'introduce', 'jobLink', 'companyLink'];


/*
*	storage module
*	
*	@param  {object}	item 		whole information
*	@param 	{function}	callback	callback method
*/

exports.storeInfo = function (item, callback) {
	var params = [];

	//no "id" or dirty data
	if (item['id'] === '' || typeof item['id'] === 'undefined') {
		console.log('bad information');
		return;
	}

	//transform the info from Object to Array		has two types: [1, 2, 3]   {a:1, b:2, c:3}
	REQUIRED_PARAMETER.forEach(function (param) {
		if (REQUIRED_PARAMETER.hasOwnProperty(param)) {
			(typeof item[param] === 'undefined') && (item[param] = '');
			params.push(item[param]);
		}
	});

	checkInfo(item.id, function (isExist) {
		if (isExist) {
			//WTF SO MANY CALLBACKS!!!
			updateInfo(params, function (isUpdated) {
				isUpdated && callback({
					"err": false,
					"message": "jobinfo " + item.id + " is updated",
				});
			});

			return true;
		} else {
			storeIn(params, function (isStored) {
				isStored && callback({
					"err": false,
					"message": "jobinfo " + item.id + " is stored"
				})
			});
		}
	});
}

/*
*	check module
*
*	@param {number}		id 		information's id
*	@return {boolean}
*/
exports.checkInfo = function (id, callback) {
	checkInfo(id, callback);
}

function checkInfo(id, callback) {
	pool.getConnection(function (err, conn) {
		if (err) { console.log(err); }

		//http://stackoverflow.com/questions/1346209/unknown-column-in-field-list-error-on-mysql-update-query
        //sql syntax is very important
		//var sql = "SELECT * FROM jobInfo WHERE id='" + id + "'";

		//using sql escape
		var sql = "SELECT * FROM jobInfo WHERE id = ?";

		conn.query(sql, id, function (err, results) {
			if (err) { console.log(err); }

			conn.release();
			if (results.length > 0) {
				callback(true);
				return true;
			} else {
				callback(false);
				return true;
			}
		});
	});
}

/*
*	插入信息模块
*	
*	@param {Array} params 数组化后的信息
*	@param {function} callback	回调方法
*/
exports.storeIn = function (params, callback) {
	storeIn(params, callback);
}

function storeIn(params, callback) {
	pool.getConnection(function (err, conn) {
		if (err) { console.log(err); }

		// var sql = "INSERT INTO jobInfo (" + REQUIRED_PARAMETER.join(',') + ") values('"
		// 	+ item.jobID + "','" + item.job + "','" + item.company + "','" + item.address + "','" + item.time + "','" + item.degree + "','" + item.experience + "','"
		// 	+ item.companyNature + "','" + item.companySize + "','" + item.introduce +"')";

		//using sql escape
		if (params instanceof Array && params.length > 0) {
			var sql = 'INSERT INTO jobInfo (' + REQUIRED_PARAMETER.join(',') + ') values(' + conn.escape(params) + ')';

			conn.query(sql, function (err, results) {
				if (err) { console.log(err); }

				conn.release();

				callback(true);
				return true;
			});
		} else {
			return;
		}
	});
}

/*
*	更新信息模块
*	
*	@param {Array} item 信息对象
*	@param {function} callback	回调方法
*/
exports.updateInfo = function (item, callback) {
	updateInfo(item, callback);
}

function updateInfo(params, callback) {
	pool.getConnection(function (err, conn) {
		if (err) { console.log(err); }

		if (params instanceof Array && params.length > 0) {
			//assemble sql statement
			var sql = 'UPDATE jobInfo SET ';

			for (var i = 1, len = REQUIRED_PARAMETER.length - 1; i < len; i++) {
				sql += REQUIRED_PARAMETER[i] + ' = ?, '
			}

			sql += REQUIRED_PARAMETER[REQUIRED_PARAMETER.length - 1] + ' = ? WHERE id = ?';

			// var sql = "UPDATE jobInfo SET job = '" + item.job + "', company = '" + item.company + "', address = '" + item.address
			// + "', time = '" + item.time + "', degree = '" + item.degree + "', experience = '" + item.experience
			// + "', companyNature ='" + item.companyNature + "', companySize = '" + item.companySize + "', introduce = '" + item.introduce + "',jobLink = '" + item.jobLink +
			// + '", companyLink = "' + item.companyLink + "' WHERE ID = '" + item.id + "'";

			//assemble params in correct sequence
			var id = params[0],
				len = params.length;
			for (var i = 1; i < len; i++) {
				params[i - 1] = params[i];
			}
			params[len - 1] = id;

			conn.query(sql, params, function (err, results) {
				if (err) { console.log(err); }

				conn.release();

				callback(true);
				return true;
			});
		}
	});
}