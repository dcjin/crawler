exports.all = {
	//regexp for zhilian
	reg_for_zhilian: {
		baseReg: /.*<td class="zwmc">\s*<input.*value="(.*)" onclick=.*>\s*<div.*>\s*<a style="font-weight: bold".*>(.[^<|\/a]*)\s*<\/a>.*<\/div>\s*<\/td>\s*<td class="gsmc">\s*<a.*href="(.*)" target=.*>(.*)<\/a>\s*<\/td>\s*<td class="zwyx">(.*)<\/td>\s*<td class="gzdd">(.*)<\/td>\s*<td class="gxsj">\s*<span>(.*)<\/span>.*<\/td>.*/,
		detailReg: /.*<li class="newlist_deatil_two">\s*<span>(.*)<\/span>\s*<span>(.*)<\/span>\s*<span>(.*)<\/span>\s*<span>(.*)<\/span>\s*<span>(.*)<\/span>\s*<\/li>\s*<li class="newlist_deatil_last">(.*)<\/li>.*/
	},

	//regexp for 51
	reg_for_51: {

	},

	//regexp for ganji
	reg_for_ganji: {

	}
}