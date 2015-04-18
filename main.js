var //parse = require('./parse_51'),
	parse = require('./parse_zhilian'),
	storage = require('./storage');
	//async = require('async');

var jobInfo = parse.getInfo();

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

//add async module in here, now use setTimeout simulate async