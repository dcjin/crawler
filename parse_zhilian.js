/*
*	parsing module --- 智联招聘
*	杭州 --- 实习
*/

var request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	settings = require('./settings');

var page = 1;
var url = 'http://sou.zhaopin.com/jobs/searchresult.ashx?bj=5006000&sj=299%3b302%3b301%3b381&jl=653&sm=0&sg=de3ab3dfb3f04814ab8bd6d4401349cf&p=' + page;

//exports.getInfo_zhilian = function () {
	iconv.extendNodeEncodings();

	var all = [];

	request({url: url, encoding: 'UTF-8'}, function (err, res, body) {
		if (!err && res.statusCode === 200) {
			var $ = cheerio.load(body, {decodeEntities: false});
			var aContent = $('table.newlist');
			aContent.each(function (index, ele) {
				ele = $(ele);// wrap to a jQuery object
				if(index !== 0){
					var id = getValue(ele, '.zwmc', 'input', 'value', 0);
					var baseInfo = {
						job: getInfoRow(ele, '.zwmc', 'a', 0),
						jobLink: getValue(ele, '.zwmc', 'a', 'href', 0),
						company: getInfoRow(ele, '.gsmc', 'a', 0),
						//companyLink: getValue(ele, '.gsmc', 'a', 'href', 0),
						address: getInfoRow(ele, '.gzdd', null, -1),
						time: getInfoRow(ele, '.gxsj', 'span', 0),
						// companyNature: getInfoRow(ele, '.newlist_deatil_two', 'span', 1),
						// companySize: getInfoRow(ele, '.newlist_deatil_two', 'span', 2),
						// experience: getInfoRow(ele, '.newlist_deatil_two', 'span', 3),
						introduce: getInfoRow(ele, '.newlist_deatil_last', null, -1),
					};

					var detailInfo = getDetail($, ele, '.newlist_deatil_two', 'span');

					baseInfo.id = id.replace('000_653_1_03_401__1_','').replace('000_653_1_03_201__1_','').replace('CC','').replace('J90','');

					for(var item in detailInfo) {
						baseInfo[item] = detailInfo[item];
					}

					all.push(baseInfo);
				}
			});
			console.log(all);
		}
	});

// 	return all;
// }

/*
*	Get content
*	
*	@{object}	ele	dom对象
*	@(string)	key	信息所在的标签 第一层//TODO
*	@{string}	tag	信息所在的标签 第二层//TODO
*	@{number}	offset 第几个
*/
function getInfoRow(ele, key, tag, offset) {
	if (!tag && offset == -1) {
		return ele.find(key).text().trim();
	}
	return ele.find(key).find(tag).eq(offset).text().trim();
}

/*
*	Get attribute
*	
*	@{object}	ele	dom对象
*	@(string)	key	信息所在的标签 第一层//TODO
*	@{string}	tag	信息所在的标签 第二层//TODO
*	@{string}	param 所需要的attribute
*	@{number}	offset 第几个
*/
function getValue(ele, key, tag, param, offset) {
	return ele.find(key).find(tag).eq(offset).attr(param);
}

/*
*	Get detail
*	
*	@{object}	$ 文档的jQuery对象
*	@{object}	ele	dom对象
*	@(string)	key	信息所在的标签 第一层//TODO
*	@{string}	tag	信息所在的标签 第二层//TODO
*/
function getDetail($, ele, key, tag) {
	var aTags = ele.find(key).find(tag);
	var obj  = {};

	for(var i = 0, len = aTags.length; i < len; i++) {
		var str = $(aTags[i]).text().trim();
		var pos = str.indexOf('：');
		switch (str.substr(0, pos)) {
			case '地点':
				break;
			case '经验':
				obj.experience = str.substr(pos + 1);
				break;
			case '公司性质':
				obj.companyNature = str.substr(pos + 1);
				break;
			case '公司规模':
				obj.companySize = str.substr(pos + 1);
				break;
			case '职位月薪':
				break;
			case '学历':
				obj.degree = str.substr(pos + 1);
			default:
				break;
		}
	}
	return obj;
}