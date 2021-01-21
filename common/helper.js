// 接口通讯密匙(API后台获取) websiteSecret
const websiteSecret = '604d6iI5dv4c9KFPMQbB6KYygRXDcF8xwVrWRGBPaUbBlMnYfWmYZKJWAFD7';
// 接口地址
const apiUrl = 'https://www.sexyladdy.com/api.php';
// const apiUrl = 'http://www.peachcolor6969.com/api.php';
// const apiUrl = 'http://www.onenight3366.com/api.php';
// const apiUrl = 'http://www.peachethics.com/api.php';

// 影视资源地址
const videoSourcePath = 'https://source.sexyladdy.com/';
// 普通资源地址
const commonSourcePath = 'https://www.sexyladdy.com/'
// const commonSourcePath = 'http://www.peachcolor6969.com/'
// const commonSourcePath = 'http://www.onenight3366.com/'
// const commonSourcePath = 'http://www.peachethics.com/'

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