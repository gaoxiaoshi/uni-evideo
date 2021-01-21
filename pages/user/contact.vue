<template>
	<view class="account-view">
		<view class="account-view--panel">
			<u-cell-group>
				<u-cell-item title="Telegram" :value="telegramName" @click="handleContactLink(telegramLink)" v-if="telegramName">
					<u-icon class="micon" slot="icon" name="telegram" custom-prefix="custom-icon" size="34" color="#279fd3"></u-icon>
				</u-cell-item>
				<u-cell-item title="WhatsApp" :value="whatsappName" @click="handleContactLink(whatsappLink)" v-if="whatsappName">
					<u-icon class="micon" slot="icon" name="whatsapp" custom-prefix="custom-icon" size="34" color="#4dc247"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				telegramName: '',
				telegramLink: '',
				whatsappName: '',
				whatsappLink: ''
			}
		},
		onShow() {
			this.init()
		},
		methods: {
			init() {
				this.$http.post('/index/config/getConfig').then( res => {
					uni.setStorageSync('sys_config', res.data)
					if (res.data.content_telegram) {
						let telegram = res.data.content_telegram.split('|')
						this.telegramName = telegram[0]
						this.telegramLink = telegram[1]
					}
					if (res.data.content_whatsapp) {
						let whatsapp = res.data.content_whatsapp.split('|')
						this.whatsappName = whatsapp[0]
						this.whatsappLink = whatsapp[1]
					}
				})
			},
			handleContactLink (link) {
				window.open(link, '_blank')
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

