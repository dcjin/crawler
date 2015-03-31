var parse = require('./parse'),
	storage = require('./storage'),
	async = require('async');

var jobInfo = parse.getInfo();

// jobInfo.forEach(function (item) {
// 	storage.storeInfo(item);
// })

// async.series([
// 	function (callback) {
// 		jobInfo = parse.getInfo();
// 		callback(null);
// 	},
// 	function (callback) {
// 		// jobInfo.forEach(function (item) {
// 		// 	storage.storeInfo(item);
// 		// });
// 		// callback(null);
// 		console.log(jobInfo);
// 	}], function (err) {
// 	if (err) throw err;
// 	console.log('完成');
// });
setTimeout(function () {
	jobInfo.forEach(function (info) {
		storage.storeInfo(info);
		//console.log(info);
		// var sql = 'INSERT INTO jobInfo (name, company, address, time) values(' + info.job + ','+ info.company +',' + info.address + ', ' + info.time + ')';
		// console.log(sql);
	});

	console.log('完成');
	// storage.storeInfo({
	// 	job:'实习',
	// 	company: '杭州行行行想公司',
	// 	address: '杭州',
	// 	time: '2015-3-31'
	// })
}, 3000);