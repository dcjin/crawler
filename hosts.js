var fs = require('fs'),
	cronJob = require('cron').CronJob,
	request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite'), //default: utf-8
	path = 'C:\\Windows\\System32\\drivers\\etc\\hosts', // hosts
	url = 'http://www.360kb.com/kb/2_122.html';

// After this call all Node basic primitives will understand iconv-lite encodings.
iconv.extendNodeEncodings();

console.log('start at ' + new Date());

var job = new cronJob({
	cronTime: '* * 09 * * 1-5', // 工作日 AM 9:00:00 运行
	onTick: function () {
		request({url: url, encoding: 'utf-8'}, function (err, rep, body) {
			if (!err && rep.statusCode === 200) {
				var $ = cheerio.load(body);
				var data = $('#storybox').find('.v_story').find('div').find('pre').text();
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
