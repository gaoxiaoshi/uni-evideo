module.exports = {
	// 配置路径别名
	configureWebpack: {
		devServer: {
			proxy: {
				'/api.php': {
					target: 'http://www.evideo.com/api.php/',
					changeOrigin: true,
					autoRewrite: true,
					cookieDomainRewrite: true,
					pathRewrite: {
						'^/api.php': '/'
					}
				}
			},
			disableHostCheck: true
		}
	}
}
