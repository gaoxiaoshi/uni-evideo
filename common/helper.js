// 接口通讯密匙(API后台获取) websiteSecret
const websiteSecret = '604d6iI5dv4c9KFPMQbB6KYygRXDcF8xwVrWRGBPaUbBlMnYfWmYZKJWAFD7';

// 接口地址
let apiUrl = '';
// 影视资源地址
let videoSourcePath = '';
// 普通资源地址
let commonSourcePath = '';

if(process.env.NODE_ENV === 'development'){
	videoSourcePath = 'http://source.evideo.com/';
	commonSourcePath = 'http://www.evideo.com/'
}else{
	videoSourcePath = 'https://source.sexyladdy.com/';
	commonSourcePath = window.location.origin + '/'
}

var getUrlName = function getUrlName(url) {
	let tmp= new Array();//临时变量，保存分割字符串
	tmp = url.split("/");//按照"/"分割
	let pp = tmp[tmp.length-1];//获取最后一部分，即文件名和参数
	tmp = pp.split("?");//把参数和文件名分割开
	return tmp[0];
}

export default {  
	websiteSecret,
	apiUrl,
	videoSourcePath,
	commonSourcePath,
	getUrlName
}  