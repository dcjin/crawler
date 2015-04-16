/*
*	parsing module --- 智联招聘
*	杭州 --- 实习
*/

var request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	common = require('./common');

var page = 1;
var url = 'http://sou.zhaopin.com/jobs/searchresult.ashx?bj=5006000&sj=299%3b302%3b301%3b381&jl=653&sm=0&sg=de3ab3dfb3f04814ab8bd6d4401349cf&p=' + page;

exports.getInfo_zhilian = function () {
	// After this call all Node basic primitives will understand iconv-lite encodings.
	iconv.extendNodeEncodings();

	var all = [];

	request({url: url, encoding: 'UTF-8'}, function (err, res, body) {
		if (!err && res.statusCode === 200) {
			var $ = cheerio.load(body, {decodeEntities: false});
			var aContent = $('table.newlist');
			aContent.each(function (index, ele) {
				ele = $(ele);// wrap to a jQuery object
				if(index !== 0){
					var id = common.getValue(ele, '.zwmc', 'input', 'value', 0);
					var baseInfo = {
						job: common.getInfoRow(ele, '.zwmc', 'a', 0),
						jobLink: common.getValue(ele, '.zwmc', 'a', 'href', 0),
						company: common.getInfoRow(ele, '.gsmc', 'a', 0),
						companyLink: common.getValue(ele, '.gsmc', 'a', 'href', 0),
						address: common.getInfoRow(ele, '.gzdd', null, -1),
						time: common.getInfoRow(ele, '.gxsj', 'span', 0),
						// companyNature: getInfoRow(ele, '.newlist_deatil_two', 'span', 1),
						// companySize: getInfoRow(ele, '.newlist_deatil_two', 'span', 2),
						// experience: getInfoRow(ele, '.newlist_deatil_two', 'span', 3),
						introduce: common.getInfoRow(ele, '.newlist_deatil_last', null, -1)
					};

					var detailInfo = common.getDetail_zhilian($, ele, '.newlist_deatil_two', 'span');

					baseInfo.id = 'ZL_' + id.replace('000_653_1_03_401__1_','').replace('000_653_1_03_201__1_','').replace('CC','').replace('J90','');

					for(var item in detailInfo) {
						//needed
						if(detailInfo.hasOwnProperty(item)) {
							baseInfo[item] = detailInfo[item];
						}
					}

					all.push(baseInfo);
				}
			});
			//console.log(all);
		}
	});

 	return all;
 }