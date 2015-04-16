var parse = require('./parse_51'),
	parse_zhilian = require('./parse_zhilian'),
	storage = require('./storage'),
	async = require('async');

var jobInfo = parse.getInfo();
//var jobInfo = parse_zhilian.getInfo_zhilian();

setTimeout(function () {
	jobInfo.forEach(function (info) {
		//console.log(info);
		storage.storeInfo(info, function (params) {
			if (!params.err) {
				console.log(params.message);
			}
		});
	});
}, 3000);

//此处添加async模块