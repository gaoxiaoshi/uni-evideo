<template>
	<view class="record-view">
		<u-sticky>
			<view class="record-view--header">
				<view class="text">YOU BALANCE</view>
				<view class="value">{{userInfo && userInfo['money'] || 0}}</view>
			</view>
		</u-sticky>
		<view class="record-view--content">
			<view class="record-list">
				<view class="record-list--item" :class="{'hasAction': item.status != 0}" v-for="(item, index) in dataList" :key="index">
					<view class="item-line">
						<view class="type">{{item.order_sn}}</view>
						<view class="time">
							<u-link :color="item.status == 0 ? '#f90' : item.status == 1 ? '#19be6b' : '#909399'">
								{{getStatusText(item.status)}}
							</u-link>
						</view>
					</view>
					<view class="item-line">
						<view class="content">{{item.ctime}}</view>
						<view class="money">+{{item.money}}</view>
					</view>
					<!-- <view class="item-bottom" v-if="item.status == 0">
						<u-button class="btn" size="mini" shape="circle" @click="handleCancel(item)">Cancel</u-button>
						<u-button class="btn" size="mini" type="primary" shape="circle" @click="handlePay(item)">Pay</u-button>
					</view> -->
				</view>
			</view>
			<u-loadmore :status="loadStatus" :icon-type="loadIcon" :load-text="loadText"></u-loadmore>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: null,
				page: 1,
				limit: 10,
				more: false,
				dataList: [],
				loadText: {
					loadmore: this.$t('loadText.loadmore'),
					loading: this.$t('loadText.loading'),
					nomore: this.$t('loadText.nomore')
				},
				loadStatus: 'loadmore',
				loadIcon: 'flower'
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
				this.$http.post('/api.php/index/config/getConfig').then(res => {
					uni.stopPullDownRefresh()
					uni.setStorageSync('sys_config', res.data)
					uni.setStorageSync('userInfo', res.data.userinfo)
					this.userInfo = res.data.userinfo
					this.getList(true)
				})
			},
			getList(init) {
				if (init) {
					this.page = 1
					this.more = true
				}
				let params = {
					page: this.page,
					limit: this.limit
				}
				this.loadStatus = 'loading'
				this.$http.post('/api.php/finance/recharge/getRechargeList', params).then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						if (res.data.page * res.data.limit >= res.data.count) {
							this.more = false
							this.loadStatus = 'nomore'
						} else {
							this.loadStatus = 'loadmore'
						}
						if (init) {
							this.dataList = res.data.list
						} else {
							this.dataList = this.dataList.concat(res.data.list)
						}
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
			handleCancel (item) {
				uni.showLoading({
					title: this.$t('loading')
				})
				this.$http.post('/api.php/finance/recharge/cancelOrder', {
					order_id: item.id
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.getList(init)
					}
				})
			},
			handlePay (item) {
				uni.navigateTo({
					url: `/pages/payment/index?order_sn=${item.order_sn}&amount=${item.amount}`
				})
			},
			getStatusText (status) {
				if (status === -1) {
					return 'Failed'
				} else if (status === 0) {
					return 'UnPaid'
				} else if (status === 1) {
					return 'Success'
				} else {
					return 'Waiting'
				}
			}
		},
		onPullDownRefresh () {
			this.init()
		},
		onReachBottom(){  //上拉触底函数
			if (!this.more) {
				return
			}
			this.page = this.page + 1
			this.getList()
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
		// background-image: linear-gradient( 40deg, #76d8f7 0%, #ce98f8 100%);
		background: url(../../static/user_bg.jpg) no-repeat center center;
		background-size: cover;
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
		.record-list {
			padding: 30rpx;
			.record-list--item {
				padding: 30rpx 30rpx 20rpx;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
				background-color: #fff;
				.item-line {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 20rpx;
					overflow: hidden;
				}
				.item-bottom {
					text-align: right;
					padding-top: 20rpx;
					border-top: 1px solid #e4e7ed;
					.btn {
						margin-left: 20rpx;
					}
				}
				.type {
					color: #202020;
					font-size: 28rpx;
				}
				.time {
					color: #b2b5b5;
					font-size: 24rpx;
					margin-top: 10rpx;
				}
				.content {
					color: #767878;
					font-size: 24rpx;
					max-width: 340rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.money {
					font-size: 30rpx;
					color: #e1b66e;
				}
			}
		}
	}
}
</style>
