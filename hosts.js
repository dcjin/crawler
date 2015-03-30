var fs = require('fs'),
	cronJob = require('cron').CronJob,
	request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite'), //default: utf-8
	path = 'C:\\Windows\\System32\\drivers\\etc\\hosts', // hosts
	url = 'http://www.360kb.com/kb/2_122.html';

// After this call all Node basic primitives will understand iconv-lite encodings.
iconv.extendNodeEncodings();

var job = new cronJob({
	cronTime: '00 00 09 * * 1-5', // 工作日 AM 9:00:00 运行
	onTick: function () {
		request({url: url, encoding: 'utf-8'}, function (err, rep, body) {
			if (!err && rep.statusCode === 200) {
				var $ = cheerio.load(body);
				var data = $('#storybox').children('.v_story').children('div').children('pre').text();
				//console.log(data);

				fs.writeFile(path, data, function(err) {
					if(err) {console.log('failed: ' + err);}

					console.log('Saved at ' + new Date());
				});
			}
		});
	},
	start: false
});

job.start();
