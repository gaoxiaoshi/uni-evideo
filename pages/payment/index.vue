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
			<u-button type="primary" shape="circle" :loading="loading" @click="handlePay">{{loading ? 'Waiting' : 'Paying Now'}}</u-button>
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
				ptype: '100',
				payList: [
					{
						type: '100',
						name: 'UPI',
						icon: 'icon-pay-upi'
					},
					{
						type: '3',
						name: 'Bank Card',
						icon: 'icon-pay-card'
					}
				],
				loading: false
			}
		},
		onLoad(options) {
			this.order_sn = options.order_sn
			this.amount = options.amount
		},
		onShow() {
			this.init()
		},
		methods: {
			init () {
				this.$http.post('/finance/recharge/getOrder', {
					order_sn: this.order_sn
				}).then(res => {
					if (res.code === 200) {
						if (res.data.status == 1) {
							this.loading = false
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
						}
					}
				})
			},
			handlePayWay (type) {
				this.ptype = type
			},
			handlePay () {
				this.loading = true
				this.$http.post('/finance/pay/pay', {
					order_sn: this.order_sn,
					amount: this.amount,
					ptype: this.ptype
				}).then(res => {
					if (res.code === 200) {
						window.open(res.data.data.url, '_blank')
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
