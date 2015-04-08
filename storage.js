var mysql = require('mysql');

//创建连接池
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'crawler',
	connectionLimit: 15
});

//所需的信息
var REQUIRED_PARAMETER = ['id', 'job', 'company', 'address', 'time', 'degree', 'experience', 'companyNature', 'companySize', 'introduce'];


/*
*	存储信息模块
*	
*	@param  {object} item 一条完整的信息
*	@param 	{function} callback 回调方法
*/

exports.storeInfo = function (item, callback) {
	var params = [];

	//没有id或者id为空都为脏数据
	if (item['id'] === '' || typeof item['id'] === 'undefined') {
		console.log('bad information');
		return;
	}

	//数组化信息 有些信息不存在，如公司性质，则赋空			两种形式数据[1, 2, 3]   {a:1, b:2, c:3}
	REQUIRED_PARAMETER.forEach(function (param) {
		(typeof item[param] === 'undefined') && (item[param] = '');
		params.push(item[param]);
	});

	checkInfo(item.id, function (isExist) {
		if (isExist) {
			//callback 为storeinfo的,多层果然是地狱啊
			updateInfo(item, function (isUpdated) {
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
*	检查信息模块
*
*	@param {number} id 招聘信息id
*	@return {boolean}
*/
exports.checkInfo = function (id, callback) {
	checkInfo(id, callback);
}

function checkInfo(id, callback) {
	pool.getConnection(function (err, conn) {
		if (err) { console.log(err); }

		var sql = 'SELECT * FROM jobInfo WHERE id=' + id;

		conn.query(sql, function (err, results) {
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

function updateInfo(item, callback) {
	pool.getConnection(function (err, conn) {
		if (err) { console.log(err); }

		if (!item || typeof item === 'undefined') { return; }

		//TODO
		var sql = "UPDATE jobInfo SET job = '" + item.job + "', company = '" + item.company + "', address = '" + item.address
		+ "', time = '" + item.time + "', degree = '" + item.degree + "', experience = '" + item.experience + "', companyNature ='" + item.companyNature
		+ "', companySize = '" + item.companySize + "', introduce = '" + item.introduce + "' WHERE ID = '" + item.id + "'";

		conn.query(sql, function (err, results) {
			if (err) { console.log(err); }

			conn.release();

			callback(true);
			return true;
		});
	});
}