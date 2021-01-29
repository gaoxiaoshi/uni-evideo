<template>
	<view class="account-view">
		<view class="account-view--panel">
			<u-cell-group>
				<u-field
					type="password"
					v-model="oldpassword"
					input-align="right"
					label="Current Password"
				>
				</u-field>
				<u-field
					type="password"
					v-model="password"
					input-align="right"
					label="New Password"
				>
				</u-field>
				<u-field
					type="password"
					v-model="repassword"
					input-align="right"
					label="Re New Password"
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
				password: '',
				oldpassword: '',
				repassword: ''
			}
		},
		methods: {
			handleSave () {
				uni.showLoading({
					title: this.$t('loading')
				})
				let params = {
					password: this.password,
					oldpassword: this.oldpassword,
					repassword: this.repassword
				}
				this.$http.post('/api.php/user/user/changePassword', params).then((res)=>{
					uni.hideLoading()
					if (res.code == 200) {
						uni.showToast({title: res.msg, icon: 'none', duration: 2000})
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
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
