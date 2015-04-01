var request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite');

// Changing this important parameter to change page
var curr_page = 1;
var url = 'http://search.51job.com/jobsearch/search_result.php?fromJs=1&jobarea=080200%2C00&district=000000&funtype=0000&industrytype=00&issuedate=8&providesalary=99&keywordtype=2&curr_page=' + curr_page + '&lang=c&stype=1&postchannel=0100&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&lonlat=0%2C0&radius=-1&ord_field=0&list_type=0&fromType=14';

exports.getInfo = function () {
	//lenAll   total length
	var all = [], part1 = [], part2 = [], lenAll = 0;

	// After this call all Node basic primitives will understand iconv-lite encodings.
	iconv.extendNodeEncodings();

	request({ url: url, encoding: 'gb2312' }, function(error, response, body) {
		if(!error && response.statusCode === 200) {
			var $ = cheerio.load(body);
			var tr = $('tr');
			
			tr.each(function(index, ele) {
				if($(ele).attr('class') === 'tr0') {
					var obj = {
						job: $(ele).find('.td1').find('a').text().trim(),
						company: $(ele).find('.td2').find('a').text().trim(),
						address: $(ele).find('.td3').find('span').text().trim(),
						time: $(ele).find('.td4').find('span').text().trim()
					}
					lenAll++;
					all.push(obj);
				}
				if($(ele).attr('class') === 'tr1') {
					var arr = $(ele).find('.td1234').text().trim().split('|');
					var obj = {};

					arr.forEach(function (item) {
						if (typeof item === 'string' && item.length > 0) {
							item = item.trim();// 去空
							str = item.substr(0, 4);// 取模块：如‘工作经验’，‘学历要求’
							var len = item.indexOf('：') > 0 ? item.indexOf('：') + 1 : 4;//取截取位置，前3个取'：'处，最后一个从‘公司规模’开始取

							switch (str) {
								case '学历要求':
									obj.degree = item.substr(len);
									break;
								case '工作经验':
									obj.experience = item.substr(len);
									break;
								case '公司性质':
									obj.companyNature = item.substr(len);
									break;
								case '公司规模':
									obj.companySize = item.substr(len);
									break;
								default:
									break;
							}
						}
					});

					part1.push(obj);
				}
				if($(ele).attr('class') === 'tr2') {
					var element = $(ele).find('.wordBreakNormal').find('span');
					var obj = {
						introduce: element.text().trim(),
						jobID: +element.attr('id').substr(7)//难道这个就是ID？？？？
					};

					part2.push(obj);
				}
			});

			//合并信息,一一对应
			for(var i = 0; i < lenAll; i++) {
				for(var item in part1[i]) {
					all[i][item] = part1[i][item];
				}
				for(var item in part2[i]) {
					all[i][item] = part2[i][item];
				}
			}
			//console.log(all);
		}
	});
	
	return all;
}