/**
 * Created by ws on 2015/4/21.
 */
var mysql = require('mysql');

//db crawler
exports.db_crawler = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'crawler',
    connectionLimit: 15
});

//db torrent
exports.db_torrent = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'torrent',
    connectionLimit: 15
});

exports.port = '3000';

//单页显示数量
exports.maxLen = 10;

exports.REQUIRED_PARAMETER = ['id', 'job', 'company', 'address', 'time', 'degree', 'experience', 'companyNature', 'companySize', 'introduce', 'jobLink', 'companyLink'];

//智联招聘  实习  杭州
exports.url_ZL = 'http://sou.zhaopin.com/jobs/searchresult.ashx?bj=5006000&sj=299%3b302%3b301%3b381&jl=653&sm=0&sg=de3ab3dfb3f04814ab8bd6d4401349cf&p=';

//前程无忧  实习  杭州  partOne
exports.url_QC_partOne = 'http://search.51job.com/jobsearch/search_result.php?fromJs=1&jobarea=080200%2C00&district=000000&funtype=0000&industrytype=00&issuedate=8&providesalary=99&keywordtype=2&curr_page=';

//前程无忧  实习  杭州  partTwo
exports.url_QC_partTwo = '&lang=c&stype=1&postchannel=0100&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&lonlat=0%2C0&radius=-1&ord_field=0&list_type=0&fromType=14';

//赶集招聘  实习  杭州
exports.url_GJ = 'http://hz.ganji.com/zpbiyeshixisheng/';