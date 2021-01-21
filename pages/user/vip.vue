<template>
	<view class="membership-view">
		<view class="membership-header">
			<image class="header-avatar" width="120rpx" height="120rpx" border-radius="60rpx" :src="userInfo ? $helper.commonSourcePath + userInfo.avatar : '../../static/avatar.png'" mode="aspectFit"></image>
			<view class="header-info">
				<view class="username">{{userInfo && userInfo.username}}</view>
				<view class="id">ID:{{userInfo && userInfo.id}}</view>
			</view>
		</view>
		<view class="membership-panel">
			<view class="title">Membership Packages</view>
			<scroll-view class="package" scroll-x="true" :show-scrollbar="false">
				<view class="package-item" :class="{'checked': current === index}" v-for="(item, index) in packageList" :key="index">
					<view class="item-name">{{item.name}}</view>
					<view class="item-money">{{item.price}}</view>
					<view class="item-btn" @click="handleCheck(index)">{{current === index ? 'Checked' : 'Check'}}</view>
					<u-icon class="item-radio" :name="current === index ? 'radio-check' : 'radio'" :color="current === index ? '#fefefe' : '#d0d0d0'" custom-prefix="custom-icon" size="40"></u-icon>
				</view>
			</scroll-view>
			<view class="expire">Expiration Date：{{packageList.length > 0 && packageList[current].expire}} Day</view>
		</view>
		<view class="membership-footer">
			<view class="footer-price">
				<u-icon name="/static/icon-balance.png" size="36" style="margin-right: 20rpx;"></u-icon>{{packageList.length > 0 && packageList[current].price || 0}}
			</view>
			<view class="footer-action" @click="handlePay">Pay</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				userInfo: null,
				packageList: []
			}
		},
		onShow() {
			this.init()
		},
		methods: {
			init() {
				uni.showLoading({
					title: this.$t('loading')
				})
				this.$http.post('/index/config/getConfig').then(res => {
					uni.stopPullDownRefresh()
					uni.setStorageSync('sys_config', res.data)
					uni.setStorageSync('userInfo', res.data.userinfo)
					this.userInfo = res.data.userinfo
					return this.$http.post('/user/user/getUserGroup')
				}).then(res => {
					if (res.code === 200) {
						this.packageList = res.data
					}
					uni.hideLoading()
				})
			},
			handleCheck (index) {
				this.current = index
			},
			handlePay () {
				uni.showLoading({
					title: this.$t('pay')
				})
				let params = {
					price: this.packageList[this.current].price,
					group_id: this.packageList[this.current].id
				}
				this.$http.post('/finance/exchange/exchangeMember', params).then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						uni.showModal({
							content: res.msg,
							showCancel: false,
							success() {
								uni.navigateBack()
							}
						})
					}
				}).catch(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.membership-view {
	height: 100vh;
	background-color: #f5f5f5;
	.membership-header {
		display: flex;
		align-items: center;
		padding: 0 30rpx 40rpx;
		height: 240rpx;
		background-image: linear-gradient( 40deg, #76d8f7 0%, #ce98f8 100%);
		.header-avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			margin-right: 30rpx;
		}
		.header-info {
			color: #fff;
			.username {
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}
	.membership-panel {
		margin-top: -40rpx;
		background-color: #fff;
		border-radius: 40rpx 40rpx 0 0;
		height: 520rpx;
		.title {
			padding: 30rpx;
			font-size: 34rpx;
			font-weight: bold;
		}
		.package {
			padding: 30rpx;
			white-space: nowrap;
			box-sizing: border-box;
			.package-item {
				position: relative;
				display: inline-block;
				width: 260rpx;
				height: 280rpx;
				border-radius: 12rpx;
				margin-right: 30rpx;
				padding: 15rpx;
				background-color: #f5f5f5;
				overflow: hidden;
				.item-name {
					color: #3c3c3c;
					font-size: 26rpx;
					line-height: 40rpx;
				}
				.item-money {
					color: #7f7f7f;
					font-size: 42rpx;
					text-align: center;
					margin-top: 40rpx;
				}
				.item-radio {
					position: absolute;
					right: 15rpx;
					top: 15rpx;
				}
				.item-btn {
					color: #7f7f7f;
					height: 52rpx;
					line-height: 52rpx;
					border-radius: 52rpx;
					text-align: center;
					background: #e7e7e7;
					margin-top: 40rpx;
				}
				&.checked {
					background-color: #434343;
					.item-name {
						color: #e6d78d;
					}
					.item-money {
						color: #e6d78d;
					}
					.item-btn {
						color: #434343;
						background-image: linear-gradient( 40deg, #e6d78d 0%, #e1b66e 100%);
					}
				}
			}
		}
		.expire {
			color: #9ea4ab;
			font-size: 30rpx;
			text-align: center;
		}
	}
	.membership-footer {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 96rpx;
		background-color: #FFFFFF;
		box-shadow: 0 2px 15px rgba(0, 0, 0, .1);
		.footer-price {
			display: flex;
			align-items: center;
			flex: 1;
			padding: 0 30rpx;
			font-size: 32rpx;
		}
		.footer-action {
			width: 240rpx;
			height: 100%;
			line-height: 96rpx;
			color: #fff;
			font-size: 38rpx;
			font-weight: bold;
			text-align: center;
			background-image: linear-gradient( 90deg, #e6d78d 0%, #e1b66e 100%);
		}
	}
}
</style>
