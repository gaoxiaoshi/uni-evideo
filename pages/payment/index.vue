<template>
	<view class="pay-view">
		<u-cell-group class="pay-view--panel">
			<u-cell-item title="Order SN" :value="order_sn" :arrow="false"></u-cell-item>
			<u-cell-item title="Amount" :value="amount" :arrow="false"></u-cell-item>
		</u-cell-group>
		<u-cell-group title="Payment Method" class="pay-view--panel">
			<u-cell-item :title="item.name" v-for="(item, index) in payList" :key="index" :arrow="false" @click="handlePayWay(item.type)">
				<u-icon class="icon-type" slot="icon" size="32" :name="`/static/${item.icon}.png`"></u-icon>
				<u-icon slot="right-icon" :name="item.type === ptype ? 'radio-check' : 'radio'" color="" custom-prefix="custom-icon" size="40"></u-icon>
			</u-cell-item>
		</u-cell-group>
		<view class="recharge-submit">
			<u-button type="primary" shape="circle" :loading="loading" @click="handlePay">{{loading ? `Waiting, Don't close the page` : 'Paying Now'}}</u-button>
		</view>
		<view class="recharge-tips">Tips：After payment, if the account is not received after 30 minutes, please contact customer service</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order_sn: '',
				amount: '',
				ptype: '922',
				payList: [
					/* {
						type: 'upi',
						name: 'UPI',
						icon: 'icon-pay-upi'
					},
					{
						type: 'bankCard',
						name: 'Bank Card',
						icon: 'icon-pay-card'
					}, */
					{
						type: '922',
						name: 'UPI',
						icon: 'icon-pay-upi'
					},
					{
						type: '907',
						name: 'Bank Card',
						icon: 'icon-pay-card'
					}
				],
				loading: false,
				timer: null
			}
		},
		onLoad(options) {
			this.order_sn = options.order_sn
			this.amount = options.amount
			this.init()
		},
		onUnload() {
			clearInterval(this.timer)
		},
		methods: {
			init () {
				this.$http.post('/api.php/finance/recharge/getOrder', {
					order_sn: this.order_sn
				}).then(res => {
					if (res.code === 200) {
						if (res.data.status == 1) {
							this.loading = false
							clearInterval(this.timer)
							uni.showModal({
								content: 'Recharge Successfull',
								showCancel: false,
								confirmText: 'Confirm',
								success() {
									uni.switchTab({
										url: '/pages/user/index'
									})
								}
							})
						} else if (res.data.status == 2) {
							this.loading = true
							this.createTimer()
						} else if (res.data.status == -1) {
							uni.reLaunch({
								url: '../index/index'
							})
						}
					}
				})
			},
			handlePayWay (type) {
				this.ptype = type
			},
			createTimer () {
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					setTimeout(() => {
						this.init()
					}, 0)
				}, 3000)
			},
			handlePay () {
				this.loading = true
				this.$http.post('/api.php/finance/pay/pay', {
					order_sn: this.order_sn,
					amount: this.amount,
					ptype: this.ptype
				}).then(res => {
					console.log(res)
					if (res.code === 200) {
						/* if (res.data.code != 200) {
							this.cancelPay()
						} else {
							this.createTimer()
							window.open(res.data.data.payUrl, '_blank')
						} */
						if (res.data.status == 'success') {
							this.createTimer()
							window.open(res.data.data.pay_url, '_blank')
						} else {
							this.cancelPay()
						}
					}
				})
			},
			cancelPay () {
				this.$http.post('/api.php/finance/pay/payCancel', {
					order_sn: this.order_sn
				}).then(res => {
					if (res.code === 200) {
						uni.showModal({
							title: 'FAIL',
							content: `Failed, Please return`,
							showCancel: false,
							confirmText: 'Confirm',
							success() {
								uni.navigateBack()
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.pay-view {
	overflow: hidden;
	min-height: 100vh;
	background-color: #f5f5f5;
	.pay-view--panel {
		margin-top: 20rpx;
	}
	.recharge-submit {
		padding: 30rpx;
	}
	.recharge-tips {
		padding: 30rpx;
	}
}
.icon-type {
	margin-right: 10rpx;
}
</style>
