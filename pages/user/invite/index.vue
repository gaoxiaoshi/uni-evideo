<template>
	<view class="invite-view">
		<view class="invite-view--poster">
			<image class="poster-image" :src="posterUrl" mode="widthFix"></image>
		</view>
		<view class="invite-view--btn">
			<view class="btn-item" @click="handleSave">
				<image class="btn-image" src="@/static/btn_save.png" mode="widthFix"></image>
			</view>
			<view class="btn-item" @click="handleCopy">
				<image class="btn-image" src="@/static/btn_copy.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="invite-view--info">
			<view class="info-view">friends：<navigator class="num" url="./friends">{{inviteNum}}</navigator>；Awards：<navigator class="num" url="./award">{{awards}}</navigator></view>
		</view>
		<!-- 此处画布需要隐藏，利用生产的base64的图片来展示 -->
		<canvas-view
			:widthPixels="750"
			:painting="painting"
			@success="drawSuccess"
			v-show="false"
		></canvas-view>
	</view>
</template>

<script>
	import canvasView from '@/components/canvas-view/index.vue'
	export default {
		data() {
			return {
				avatar: '',
				inviteCode: '',
				posterBg: '',
				username: '',
				posterUrl: '',
				inviteNum: 0,
				awards: 0
			}
		},
		computed: {
			painting () {
				return {
					width: '750px',
					height: '960px',
					views: [
						{
							type: "image",
							url: this.posterBg,
							css: {
								top: "0",
								left: "0",
								borderRadius: "40px 40px 0 0",
								width: "750px",
								height: "774px",
							},
						},
						{
							type: "image",
							url: this.avatar == '' ? require('@/static/avatar.jpg') : this.avatar,
							css: {
								top: "30px",
								left: "50px",
								borderRadius: "40px",
								width: "80px",
								height: "80px",
							},
						},
						{
							type: "text",
							text: this.username.toLocaleUpperCase(),
							css: {
								top: "50px",
								left: "150px",
								width: "360px",
								maxLines: 1,
								fontSize: "32px",
								color: '#fff'
							},
						},
						{
							type: "text",
							text: 'INVITECODE：',
							css: {
								bottom: "125px",
								left: "240px",
								width: "360px",
								maxLines: 1,
								fontSize: "32px",
							},
						},
						{
							type: "text",
							text: this.inviteCode,
							css: {
								bottom: "60px",
								left: "240px",
								width: "360px",
								maxLines: 1,
								fontSize: "48px",
							},
						},
						{
							type: "qrcode",
							content: window.location.origin + '/h5/#/pages/register/index?inviteCode=' + this.inviteCode,
							css: {
								bottom: "30px",
								left: "50px",
								color: "#000",
								background: "#fff",
								width: "135px",
								height: "135px",
								borderWidth: "10px",
								borderColor: "#fff",
							},
						}
					],
				}
			}
		},
		components: {
			canvasView
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				console.log(window.location)
				this.$http.get('/api.php/user/user/getInviteInfo').then((res)=>{
					if (res.code == 200) {
						this.avatar = res.data.avatar
						this.inviteCode = res.data.inviteCode
						this.inviteNum = res.data.inviteNum
						this.posterBg = res.data.posterBg
						this.username = res.data.username
						this.awards = res.data.awards
					}
				})
				uni.stopPullDownRefresh()
			},
			drawSuccess(src) {
				this.posterUrl = src
			},
			base64ToBlob (code) {
				const parts = code.split(';base64,')
				const contentType = parts[0].split(':')[1]
				const raw = window.atob(parts[1])
				const rawLength = raw.length
				const uInt8Array = new Uint8Array(rawLength)
				for (let i = 0; i < rawLength; ++i) {
					uInt8Array[i] = raw.charCodeAt(i)
				}
				return new Blob([uInt8Array], {
					type: contentType
				})
			},
			handleSave () {
				const aLink = document.createElement('a')
				const blob = this.base64ToBlob(this.posterUrl)
				const evt = document.createEvent('HTMLEvents')
				evt.initEvent('click', true, true)
				aLink.download = 'poster'
				aLink.href = URL.createObjectURL(blob)
				aLink.click()
			},
			handleCopy () {
				uni.setClipboardData({
					data: window.location.origin + '/h5/#/pages/register/index?inviteCode=' + this.inviteCode,
					success: function (res) {
						uni.showToast({
							title: 'Copy Success',
						});
					}
				})
			}
		},
		onPullDownRefresh () {
			this.init()
		}
	}
</script>

<style lang="scss" scoped>
	.invite-view {
		width: 100%;
		height: calc(100vh - var(--window-top));
		background-color: #26293f;
		.invite-view--poster {
			padding: 20px 20px 0;
			.poster-image {
				width: 100%;
				font-size: 0;
				border-radius: 12px;
				vertical-align: bottom;
			}
		}
		.invite-view--btn {
			display: flex;
			justify-content: space-between;
			padding: 20px;
			.btn-item {
				width: 45%;
				.btn-image {
					width: 100%;
				}
			}
		}
		.invite-view--info {
			padding: 0 20px;
			.info-view {
				border-radius: 8rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				color: #fff;
				background-color: #000000;
				.num {
					display: inline;
					color: #eb4f64;
				}
			}
		}
	}
</style>
