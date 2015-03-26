var request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite');

// Changing this important parameter to change page
var curr_page = 1;
var url = 'http://search.51job.com/jobsearch/search_result.php?fromJs=1&jobarea=080200%2C00&district=000000&funtype=0000&industrytype=00&issuedate=8&providesalary=99&keywordtype=2&' + curr_page + '&lang=c&stype=1&postchannel=0100&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&lonlat=0%2C0&radius=-1&ord_field=0&list_type=0&fromType=14';

// After this call all Node basic primitives will understand iconv-lite encodings.
iconv.extendNodeEncodings();

request({ url: url, encoding: 'gb2312' }, function(error, response, body) {
	if(!error && response.statusCode === 200) {
		var $ = cheerio.load(body);
		var tr = $('tr');
		var all = [],
			part2 = [],
			part3 = [];
		var len = 0;
		tr.each(function(index, ele) {
			if($(ele).attr('class') === 'tr0') {
				var obj = {
					job: $(ele).children('.td1').children('a').text().trim(),
					company: $(ele).children('.td2').children('a').text().trim(),
					address: $(ele).children('.td3').children('span').text().trim(),
					time: $(ele).children('.td4').children('span').text().trim()
				}
				len++;
				all.push(obj);
			}
			if($(ele).attr('class') === 'tr1') {
				var str = $(ele).children('.td1234').text().trim();
				part2.push(str);
			}
			if($(ele).attr('class') === 'tr2') {
				var str = $(ele).children('.wordBreakNormal').children('span').text().trim();
				part3.push(str);
			}
		});

		//!logic
		for(var i = 0; i < len; i++) {
			all[i].info = part2[i];
			all[i].introduce = part3[i];
		}

		console.log(all);
		console.log('one contains ' + len + ' recruitment messages');
	}
});