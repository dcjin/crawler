var parse = require('./parse'),
	storage = require('./storage'),
	async = require('async');

var jobInfo = parse.getInfo();

// setTimeout(function () {
// 	jobInfo.forEach(function (info) {
// 		//console.log(info);
// 		storage.storeInfo(info);
// 	});
// }, 3000);

//此处添加async模块