var request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite');

//杭州 - 实习
var page = 1;
var url = 'http://sou.zhaopin.com/jobs/searchresult.ashx?bj=5006000&sj=299%3b302%3b301%3b381&jl=653&sm=0&sg=de3ab3dfb3f04814ab8bd6d4401349cf&p=' + page;

iconv.extendNodeEncodings();

var all = [];
request({url: url, encoding: 'UTF-8'}, function (err, res, body) {
	if (!err && res.statusCode === 200) {
		var $ = cheerio.load(body);
		var a = $('table[class=newlist]');
		a.each(function (index, ele) {
			if(index !== 0){
				var name = $(ele).find('.zwmc').find('a').eq(0).text();
				var a = $(ele).find('.newlist_deatil_two').find('span').eq(1).text();
				all.push(a);
			}
		});
		console.log(all);
	}
})

function getInfo() {
	//
}