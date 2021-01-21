<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			let lang = 'en'
			/* try {
				const res = uni.getSystemInfoSync()
				lang = res.language
			} catch (e) {
				console.log('error=' + e)
			}
			this.$nextTick(function(){
				this._i18n.locale = lang
			}) */
		},
		onShow: function() {
			console.log('App Show')
			// 获取公共配置
			this.$http.post('/index/config/getConfig').then(res => {
				if (res.code == 200) {
					uni.setStorageSync('sys_config', res.data)
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
	@import '/static/css/iconfont.css';
</style>
