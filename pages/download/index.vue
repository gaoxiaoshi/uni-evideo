<template>
	<view class="mobile">
		<view class="fixed-bg">
			<image class="load-img" :src="download_background" />
		</view>
		<view class="fixed-header">
			<view class="left">
				<image class="logo" :src="site_logo" />
				<view class="title">{{site_name}}</view>
			</view>
		</view>
		<view class="fixed-footer">
			<a class="download-btn" :href="download_url" @click="handleCollect" target="_black">
				<view class="btn">
					<u-icon class="icon" name="android-fill" color="#FFF" size="28" v-if="platform == 'android'"></u-icon>
					<u-icon class="icon" name="apple-fill" color="#FFF" size="28" v-if="platform == 'ios'"></u-icon>
					Download
				</view>
			</a>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				site_logo: '',
				site_name: '',
				download_background: '',
				platform: '',
				download_url: ''
			}
		},
		onShow() {
			let _this = this
			uni.getSystemInfo({
				success: function (res) {
					console.log(res)
					_this.platform = res.platform
					if (res.platform == 'ios' && !_this.isSafari()) {
						uni.showModal({
							title: 'Message',
							content: 'Please open the page on safari',
							showCancel: false,
							confirmText: 'Copy Link',
							success(res) {
								if (res.confirm) {
									uni.setClipboardData({
										data: window.location.origin + '/h5/#/pages/download/index',
										success: function (res) {
											uni.showToast({
												title: 'Copy Success',
											})
										}
									})
								}
							}
						})
					}
					_this.init()
					_this.handleDownload()
				}
			})
		},
		methods: {
			init() {
				this.$http.post('/api.php/index/config/getConfig').then( res => {
					uni.stopPullDownRefresh()
					uni.setStorageSync('sys_config', res.data)
					uni.setStorageSync('userInfo', res.data.userinfo)
					this.site_logo = this.$helper.commonSourcePath + res.data.site_logo
					this.site_name = res.data.site_name
					this.download_background = this.$helper.commonSourcePath + res.data.download_background
				})
			},
			handleDownload () {
				this.$http.post('/api.php/index/config/download', {
					platform: this.platform
				}).then(res => {
					if (res.code == 200) {
						this.download_url = res.data
					}
				})
			},
			handleCollect () {
				this.$http.post('/api.php/index/config/collect', {
					platform: this.platform
				})
			},
			isSafari() {
				let ua = window.navigator.userAgent
				console.log(ua)
				if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
						return true
				} else {
						return false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mobile {
		color: #fff;
		.fixed-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			.load-img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
		.fixed-header {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			box-sizing: border-box;
			height: 190rpx;
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			z-index: 9;
			.left {
				display: flex;
				font-size: 40rpx;
				align-items: center;
				.logo {
					width: 108rpx;
					height: 108rpx;
					margin-right: 19rpx;
					border-radius: 10rpx;
				}
				.title {
					font-size: 100%;
					font-weight: bold;
					line-height: 1.2;
				}
			}
		}
		.fixed-footer {
			z-index: 9;
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			padding: 0 80rpx 64rpx 80rpx;
			box-sizing: border-box;
			font-size: 24rpx;
			.download-btn {
				display: block;
				ointer-events: auto;
				width: 100%;
				height: 90rpx;
				max-height: 7vh;
				text-decoration: none;
				.btn {
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #fff;
					border-radius: 45rpx;
					background: linear-gradient(90deg, #f4405e, #eb25ba);
					.icon {
						margin-right: 10rpx;
					}
				}
			}
		}
	}
</style>
