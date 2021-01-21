<template>
	<view class="account-view">
		<view class="account-view--panel">
			<u-cell-group>
				<u-cell-item title="Change Account" @click="handleChangeAccount">
					<u-icon class="micon" slot="icon" name="account" custom-prefix="custom-icon" size="34" color="#ff5f00"></u-icon>
				</u-cell-item>
				<u-cell-item title="Change Password" @click="handleChangePassword">
					<u-icon class="micon" slot="icon" name="password" custom-prefix="custom-icon" size="34" color="#ff5f00"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			handleChangeAccount() {
				uni.navigateTo({
					url: '/pages/user/account/account'
				})
			},
			handleChangePassword() {
				uni.navigateTo({
					url: '/pages/user/account/password'
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
