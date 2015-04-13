var regStr = /<tr class="tr0".*>\s*<td class="td0"><input.*value="(\d+)"><\/td>.*<\/tr>/;

var str = '<tr class="tr0" bgcolor="#ffffff" style="background: rgb(255, 255, 255);"><td class="td0"><input type="checkbox" name="selectJobid67589927" value="67589927"></td></tr>';

var result = regStr.exec(str);

console.log(result[1]);