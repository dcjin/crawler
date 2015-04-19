//regexp for all TODO
//exports.all = {
//    //regexp for zhilian
//    reg_for_zhilian: {
//        baseReg: /.*<td class="zwmc">\s*<input.*value="(.*)" onclick=.*>\s*<div.*>\s*<a style="font-weight: bold".*>(.[^<|\/a]*)\s*<\/a>.*<\/div>\s*<\/td>\s*<td class="gsmc">\s*<a.*href="(.*)" target=.*>(.*)<\/a>\s*<\/td>\s*<td class="zwyx">(.*)<\/td>\s*<td class="gzdd">(.*)<\/td>\s*<td class="gxsj">\s*<span>(.*)<\/span>.*<\/td>.*/,
//        detailReg: /.*<li class="newlist_deatil_two">\s*<span>(.*)<\/span>\s*<span>(.*)<\/span>\s*<span>(.*)<\/span>\s*<span>(.*)<\/span>\s*<span>(.*)<\/span>\s*<\/li>\s*<li class="newlist_deatil_last">(.*)<\/li>.*/
//    },
//
//    //regexp for 51
//    reg_for_51: { },
//
//    //regexp for ganji
//    reg_for_ganji: { }
//};

/*
*   Get content
*
*   @{object}   ele     dom对象
*   @(string)   key     信息所在的标签 第一层//TODO
*   @{string}   tag     信息所在的标签 第二层//TODO
*   @{number}   offset  第几个
*/
exports.getInfoRow = function (ele, key, tag, offset) {
    'use strict';
    if (!tag && offset ===   -1) {
        return ele.find(key).text().trim();
    }
    return ele.find(key).find(tag).eq(offset).text().trim();
};

/*
*   Get attribute
*
*   @{object}   ele     dom对象
*   @(string)   key     信息所在的标签 第一层//TODO
*   @{string}   tag     信息所在的标签 第二层//TODO
*   @{string}   param   所需要的attribute
*   @{number}   offset  第几个
*/
exports.getValue = function (ele, key, tag, param, offset) {
    'use strict';
    return ele.find(key).find(tag).eq(offset).attr(param);
};

/*
*   Get detail
*
*   @{object}   $       文档的jQuery对象
*   @{object}   ele     dom对象
*   @(string)   key     信息所在的标签 第一层//TODO
*   @{string}   tag     信息所在的标签 第二层//TODO
*/
exports.getDetail_ZL = function ($, ele, key, tag) {
    'use strict';

    var aTags = ele.find(key).find(tag),
        obj  = {};

    for (var i = 0, len = aTags.length; i < len; i++) {
        var str = $(aTags[i]).text().trim(),
            pos = str.indexOf('：');

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
        }
    }
    return obj;
};

/*
*   Get detail
*
*   @{object}   $       文档的jQuery对象
*   @{object}   ele     dom对象
*   @(string)   key     信息所在的标签
*/
exports.getDetail_QC = function (ele, key) {
    'use strict';

    var str = ele.find(key).text().trim(),
        aStr = str.split('|'),
        obj = {};

    aStr.forEach(function (item) {
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

    return obj;
};