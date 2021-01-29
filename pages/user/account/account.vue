<template>
	<view class="account-view">
		<view class="account-view--panel">
			<u-cell-group>
				<u-field
					label="Avatar"
					disabled
					@click="handleAvatar"
				>
					<u-image slot="right" width="64rpx" height="64rpx" shape="circle" :src="avatar" :show-loading="avatarLoading"></u-image>
				</u-field>
				<u-field
					v-model="nick"
					input-align="right"
					label="Nickname"
				>
				</u-field>
			</u-cell-group>
		</view>
		<view class="account-view--panel" style="padding: 30rpx;">
			<u-button type="primary" @click="handleSave">Save</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: '/static/avatar.png',
				nick: '',
				uploadAvatar: '',
				avatarLoading: false
			}
		},
		onShow() {
			this.init()
		},
		methods: {
			init() {
				this.$http.post('/api.php/index/config/getConfig').then( res => {
					uni.setStorageSync('sys_config', res.data)
					let userInfo = res.data.userinfo
					if (userInfo) {
						this.nick = userInfo.nick
						this.avatar = userInfo.avatar != '' ? res.data.userinfo.avatar.search('http') >= 0 ? res.data.userinfo.avatar : this.$helper.commonSourcePath + res.data.userinfo.avatar : '/static/avatar.png'
						uni.setStorageSync('userInfo', res.data.userinfo)
					} else {
						uni.navigateTo({
							url: '/pages/login/index'
						})
					}
				})
			},
			handleAvatar () {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: (res) => {
						this.imgToBase64(res)
					}
				})
			},
			imgToBase64 (chooseImageRes) {
				let _this = this
				let reader = new FileReader()
				reader.readAsDataURL(chooseImageRes.tempFiles[0])
				reader.onload = function (e) {
					console.log(e)
					_this.uploadImg(e.target.result)
				}
			},
			uploadImg (img) {
				let params = {
					code: img,
					type: 'avatar'
				}
				this.avatarLoading = true
				this.$http.post('/api.php/attachment/attachment/uploadImg', params).then(res => {
					uni.showToast({title: res.msg, icon: 'none'});
					this.avatarLoading = false
					if (res.code == 200) {
						console.log('头像数据', res)
						this.uploadAvatar = res.data.file
						this.avatar = this.$helper.commonSourcePath + res.data.file
					}
				})
			},
			handleSave () {
				let params = {
					avatar: this.uploadAvatar,
					nick: this.nick
				}
				uni.showLoading({
					title: this.$t('loading')
				})
				this.$http.post('/api.php/user/user/changeUsi', params).then(res => {
					uni.hideLoading()
					uni.showToast({title: res.msg, icon: 'none'})
					if (res.code == 200) {
						let usi = uni.getStorageSync('userInfo');
						usi.avatar = this.uploadAvatar ? this.uploadAvatar : usi.avatar
						usi.nick = this.nick
						uni.setStorageSync('userInfo', usi)
						uni.navigateBack()
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.account-view {
	height: 100vh;
	background-color: #f5f5f5;
	.account-view--panel {
		padding-top: 20rpx;
	}
}
.micon {
	margin-right: 8rpx;
}
</style>
