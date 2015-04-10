/*
*	抽取模块二 --- 赶集网
*	杭州 --- 实习
*/

var request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite');

var page = 1;
var url = 'http://hz.ganji.com/zpbiyeshixisheng/o' + page + '/';

iconv.extendNodeEncodings();

var all = [];
request({url: url, encoding: 'UTF-8'}, function (err, res, body) {
	if (!err && res.statusCode === 200) {
		var $ = cheerio.load(body);
		//一条dl就是一条完整的信息
		var a = $('dl.job-list.list-noimg');
		a.each(function (index, ele) {
			//var name = $(ele).find('.zwmc').find('a').eq(0).text();
			var a = $(ele).find('a').eq(0).text();
			all.push(a);
		});
		console.log(all);
	}
})

function getInfo() {
	//
}