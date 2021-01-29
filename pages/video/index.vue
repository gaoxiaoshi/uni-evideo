<template>
	<view class="video-page">
		<!-- 播放器 -->
		<u-sticky>
			<view class="video-player">
				<view class="player limit" v-show="playLimit">
					<view class="limit-text">At the end of the trial, Please pay for it or upgrade vip to watch.<block v-if="!userInfo">If you already pay for it or vip, Please <navigator class="link" url="/pages/login/index">Sign In</navigator>, first!</block></view>
					<view class="limit-action">
						<view class="action-item" @click="handleVideoPay">Pay</view>
						<view class="action-item upgrade" @click="handleUpgrade">Upgrade</view>
					</view>
				</view>
				<view class="player" id="myVideo" v-show="!playLimit"></view>
			</view>
		</u-sticky>
		<view class="video-header">
			<view class="video-follow" @click="handleCollect">{{isLike ? 'Cancel To Favorites' : 'Add To Favorites'}}</view>
			<view class="video-detail">
				<view class="title">{{title || ''}}</view>
				<view class="score-view">
					<view class="score">{{vod_score || 0}} <view class="score-split"></view></view>
					<view class="classify">{{$t(`classilfy.${type_info.type_en}`) || ''}}</view>
				</view>
				<view class="desc">Description：{{remark || 'no description'}}</view>
			</view>
		</view>
		<view class="video-panel">
			<view class="video-panel--header">
				<view class="header-title">Guess You Like</view>
			</view>
			<view class="video-panel--content">
				<navigator :url="`/pages/video/index?id=${rec.vod_id}`" class="guess-list" v-for="(rec, index) in recommend" :key="index">
					<u-image width="276rpx" height="164rpx" border-radius="10" mode="aspectFill" :src="$helper.videoSourcePath + rec.vod_pic">
						<u-loading slot="loading"></u-loading>
					</u-image>
					<view class="guess-content">
						<view class="title">{{rec.vod_name}}</view>
						<view class="year">{{rec.vod_year}}</view>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	let Hls = require('hls.js/dist/hls.min.js')
	import DPlayer from 'dplayer';

	export default {
		data() {
			return {
				vid: '',
				vod_pic: '',
				vod_play_from: [],
				vod_score: '',
				title: '',
				remark: '',
				type: '',
				srcList: {},
				type_info: {},
				recommend: [],
				isLike: false,
				currentLine: 0,
				currentSrc: 0,
				isPay: false,
				player: null,
				userInfo: null,
				sysconfig: null,
				playLimit: false,
				userInfo: null,
				currentTime: 0
			}
		},
		onLoad(option) {
			this.vid = option.id
		},
		onHide() {
			this.player.pause()
		},
		onShow() {
			if (!this.vid) {
				uni.showModal({
					title: 'Message',
					content: "Can't find",
					showCancel: false,
					confirmText: 'Confirm',
					success() {
						uni.navigateBack()
					}
				})
			} else {
				this.init()
			}
		},
		onUnload() {
			let historyList = uni.getStorageSync('historyList') || []
			if (historyList.length > 0) {
				let index = historyList.findIndex(item => item.vid === this.vid)
				if (index >= 0) {
					historyList.splice(index, 1)
				}
			}
			
			historyList.unshift({
				vid: this.vid,
				vod_pic: this.vod_pic,
				title: this.title,
				type_en: this.type_info.type_en
			})
			
			uni.setStorageSync('historyList', historyList)
		},
		beforeDestroy() {
			this.player = null
		},
		methods: {
			init () {
				this.$http.post('/api.php/index/config/getConfig',{}).then((res)=>{
					uni.setStorageSync('sys_config', res.data)
					// 系统参数
					this.sysconfig = res.data
					console.log('系统参数：', this.sysconfig)
					// 初始会员权限
					this.userInfo = res.data.userinfo || null
					// 初始化视频信息
					this.getVideoDetail()
				})
			},
			getVideoDetail () {
				uni.showLoading({
					title: this.$t('loading')
				})
				this.$http.post('/api.php/videos/videos/getVideoDetail', {
					vid: this.vid
				}).then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						this.vod_pic = res.data.vod_pic,
						this.vod_play_from = res.data.vod_play_from,
						this.vod_score = res.data.vod_score,
						this.title = res.data.title,
						this.remark = res.data.remark,
						this.type = res.data.type,
						this.srcList = res.data.srcList,
						this.type_info = res.data.type_info,
						this.recommend = res.data.recommend,
						this.isLike = res.data.isLike,
						this.isPay = res.data.isPay
						uni.setNavigationBarTitle({
							title: res.data.title
						})
						this.initPlayer()
					}
				})
			},
			handleCollect () {
				let userinfo = uni.getStorageSync('userInfo')
				if (!userinfo) {
					uni.showModal({
						title: 'Message',
						content: 'Please sign in first!',
						showCancel: false,
						confirmText: 'Confirm',
						success() {
							uni.navigateTo({
								url: "/pages/login/index"
							})
						}
					})
				} else {
					this.$http.post('/api.php/videos/videos/addLike', {id: this.vid}).then(res => {
						if (res.code === 200) {
							this.isLike = res.data ? true : false
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				}
			},
			initPlayer () {
				this.player = new DPlayer({
				  container: document.getElementById('myVideo'),
					autoplay: false,
					lang: 'en',
					video: {
						url: this.srcList[this.vod_play_from[this.currentLine]][this.currentSrc].url,
						pic: this.$helper.videoSourcePath + this.vod_pic,
						type: 'customHls',
						customType: {
							customHls: function (video, player) {
								const hls = new Hls()
								hls.loadSource(video.src)
								hls.attachMedia(video)
							}
						}
					}
				})
				this.player.on('timeupdate', e => {
					let currentTime = this.player.video.currentTime
					let limitTime = this.sysconfig.player_limit_time
					if (!this.isPay) {
						console.log('没有购买')
						if (this.userInfo && this.userInfo.group_id != 1) {
							console.log('有登陆，并且是会员')
							this.playLimit = false
						} else {
							console.log('没有有登陆，或者不是会员')
							if (limitTime > 0 && currentTime >= limitTime) {
								this.playLimit = true
								this.player.pause()
							}
						}
					} else {
						console.log('有购买')
						this.playLimit = false
					}
				})
			},
			handleVideoPay () {
				let params = {
					vid: this.vid,
					title: this.title,
					price: this.sysconfig.player_price
				}
				uni.showLoading({
					title: this.$t('pay')
				})
				this.$http.post('/api.php/finance/exchange/exchangeVideo', params).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						let _this = this
						uni.showModal({
							content: res.msg,
							showCancel: false,
							confirmText: 'Playing Now',
							success() {
								_this.playLimit = false
								_this.isPay = true
								_this.player.play()
							}
						})
					}
				})
			},
			handleUpgrade () {
				this.currentTime = this.player.video.currentTime
				uni.navigateTo({
					url: '/pages/user/vip'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.video-page {
		min-height: 100%;
	}
	.video-player, .video-limit {
		position: relative;
		display: block;
		overflow: hidden;
		padding: 0;
		height: 0;
		z-index: 998;
		padding-bottom: 56.25%;
		.player {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			margin: 0px;
			padding: 0px;
			min-height: 100px;
			background: #000000;
			&.limit {
				display: flex;
				flex-direction: column;
				justify-content: center;
				color: #fff;
				padding: 30rpx;
				.limit-text {
					color: #fff;
					.link {
						display: inline;
						padding: 0 10rpx;
						color: #2979ff;
					}
				}
				.limit-action {
					display: flex;
					justify-content: space-evenly;
					margin-top: 40rpx;
					.action-item {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 180rpx;
						height: 60rpx;
						border-radius: 60rpx;
						border: 1px solid #fff;
						color: #fff;
						&.upgrade {
							border: 0;
							background-image: linear-gradient(135deg, #76d8f7, #ce98f8 52%, #633bf8);;
						}
					}
				}
			}
		}
	}
	.video-header {
		padding: 30rpx;
		.video-follow {
			display: block;
			width: 100%;
			height: 75rpx;
			text-align: center;
			border: 0;
			border-radius: 75rpx;
			font-size: 28rpx;
			font-weight: 700;
			line-height: 75rpx;
			background: #ff5f00;
			background: -webkit-linear-gradient(135deg, #76d8f7, #ce98f8 52%, #633bf8);
			background: linear-gradient(135deg, #76d8f7, #ce98f8 52%, #633bf8);
			box-shadow: 0 0 0.25rem 0 rgba(255, 95, 0, .3);
			color: #fff;
		}
		.video-detail {
			margin: 10px 0;
			padding-top: 10rpx;
			.title {
				color: #333;
				font-weight: bold;
				font-size: 32rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.score-view {
				display: flex;
				align-items: center;
				margin-top: 20rpx;
				.score {
					position: relative;
					width: 58rpx;
					color: #76d8f7;
					font-size: 14px;
					font-weight: bold;
					.score-split {
						width: 1px;
						height: 30rpx;
						position: absolute;
						top: 50%;
						right: 0;
						transform: translateY(-50%);
						background-color: #d6d6d6;
					}
				}
				.classify {
					display: inline-block;
					text-align: center;
					width: auto;
					height: 36rpx;
					height: 36rpx;
					padding: 0 16rpx;
					border-radius: 36rpx;
					font-size: 12px;
					color: #666;
					margin-left: 10rpx;
					background: #ebebeb;
				}
			}
			.desc {
				color: #888;
				margin-top: 10rpx;
			}
		}
	}
	.video-panel {
		.video-panel--header {
			padding: 0 30rpx;
			.header-title {
				color: #111;
				font-size: 36rpx;
				font-weight: bold;
			}
		}
		.video-panel--content {
			padding: 30rpx;
			.guess-list {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
				.guess-content {
					flex: 1;
					margin-left: 20rpx;
					.title {
						color: #111;
						overflow: hidden;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						display: -webkit-box;
					}
					.year {
						font-size: 12px;
						color: #878787;
						margin-top: 20rpx;
					}
				}
			}
		}
	}
</style>