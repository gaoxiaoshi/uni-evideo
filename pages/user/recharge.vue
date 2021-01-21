<template>
	<view class="record-view">
		<u-sticky>
			<view class="record-view--header">
				<view class="text">YOU BALANCE</view>
				<view class="value">{{userInfo && userInfo['money'] || 0}}</view>
			</view>
			<u-tabs
				:list="tabs"
				:is-scroll="false"
				:current="current"
				active-color="#76d8f7">
			</u-tabs>
		</u-sticky>
		<view class="record-view--content">
			<view class="recharge-list">
				<view
					class="recharge-item"
					:class="{ 'checked': index === currentItem }"
					v-for="(item, index) in list"
					:key="index"
					@click="handleChoose(index)">
					<u-icon name="/static/icon-balance.png" size="36"></u-icon>
					<view class="item-money">{{parseInt(item * scale, 10)}}</view>
					<view class="item-amount">₹{{item}}</view>
				</view>
			</view>
			<view class="recharge-submit">
				<u-button type="primary" shape="circle" :loading="loading" @click="handleConfirm">Confirm</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				userInfo: null,
				scale: 1,
				dataList: [],
				tabs: [
					{
						name: 'Online'
					}
				],
				list: [],
				currentItem: -1,
				loading: false
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				uni.showLoading({
					title: this.$t('loading')
				})
				this.$http.post('/index/config/getConfig').then(res => {
					uni.hideLoading()
					uni.stopPullDownRefresh()
					uni.setStorageSync('sys_config', res.data)
					uni.setStorageSync('userInfo', res.data.userinfo)
					this.userInfo = res.data.userinfo
					this.scale = res.data.recharge_scale
					this.list = res.data.recharge_list
				}).catch(() => {
					uni.hideLoading()
				})
			},
			handleChoose (index) {
				this.currentItem = index
			},
			handleConfirm () {
				this.loading = true
				this.$http.post('/finance/recharge/createOrder', { amount: this.list[this.currentItem] }).then(res => {
					this.loading = false
					if (res.code == 200) {
						let { order_sn, amount } = res.data
						uni.navigateTo({
							url: `/pages/payment/index?order_sn=${order_sn}&amount=${amount}`
						})
					}
				}).catch(() => {
					this.loading = false
				})
			}
		},
		onPullDownRefresh () {
			this.init()
		}
	}
</script>

<style lang="scss" scoped>
.record-view {
	min-height: 100vh;
	background-color: #f5f5f5;
	.record-view--header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 200rpx;
		color: #fff;
		background-image: linear-gradient( 40deg, #76d8f7 0%, #ce98f8 100%);
		.text {
			opacity: 0.6;
			font-weight: bold;
			font-size: 22rpx;
		}
		.value {
			margin-top: 4rpx;
			font-size: 48rpx;
		}
	}
	.record-view--content {
		padding: 30rpx;
		.recharge-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			.recharge-item {
				width: 30%;
				background: #fff;
				padding: 30rpx 10rpx;
				margin-bottom: 30rpx;
				border-radius: 10rpx;
				text-align: center;
				.item-money {
					color: #ffd04e;
					font-size: 40rpx;
					font-weight: bold;
				}
				.item-amount {
					margin-top: 10rpx;
				}
				&.checked {
					background-color: #434343;
					.item-amount {
						color: #fff;
					}
				}
			}
		}
		.recharge-submit {
			margin-top: 20rpx;
		}
	}
}
</style>
