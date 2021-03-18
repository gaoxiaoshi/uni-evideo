<template>
	<view
		class="body"
		:style="{'height': `${windowHeight}px`, 'width': `${windowWidth}px`}">
		<!-- <video
			:id="`video_${videoId}`"
			:ref="`video_${videoId}`"
			:duration="30"
			:autoplay="true"
			:controls="false"
			:show-progress="false"
			:show-play-btn="false"
			:show-fullscreen-btn="false"
			:enable-progress-gesture="false"
			:show-center-play-btn="false"
			:style="{'height': `${windowHeight}px`, 'width': `${windowWidth}px`}"
			@play="_play"
			@playing="_playing"
			@pause="_pause"
			@waiting="_waiting"
			@ended="_ended"
			@loadedmetadata="_loadedmetadata"
			@tap="handVideoClick"
			@timeupdate="timeupdate">
			<cover-image class="controls-img loading" src="@/static/icon-loading.gif" @click="handlePlay" v-if="isLoading"></cover-image>
			<cover-image class="controls-img" src="@/static/icon-play-big.png" @click="handlePlay" v-if="!isPlay && !isLoading"></cover-image>
		</video> -->
		<view id="myVideo" class="player" @tap="handVideoClick" :style="{'height': `${windowHeight}px`, 'width': `${windowWidth}px`}">
			<!-- <cover-image class="controls-img loading" src="@/static/icon-loading.gif" @click="handlePlay" v-if="isLoading"></cover-image> -->
			<cover-image class="controls-img" src="@/static/icon-play-big.png" @click="handlePlay" v-if="!isPlay && !isLoading"></cover-image>
		</view>
		<cover-view class="progressBar" :style="{ width: barWidth }"></cover-view>
	</view>
</template>

<script>
	let Hls = require('hls.js/dist/hls.min.js')
	import DPlayer from 'dplayer';
	export default {
		props: {
			src: {
				type: String,
				default: ''
			},
			height: {
				type: String,
				default: ''
			},
			width: {
				type: Number,
				default: 750
			},
			videoId: {
				type: Number,
				default: 0
			},
			videoData: {
				type: Object,
				default: null
			},
			videoConfig: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				hls: null,
				sysheight: 0,
				time: 0,
				waitingTime: 0,
				duration: 0,
				isPlay: false,
				videoCtx: null,
				windowWidth: 0,
				windowHeight: 0,
				isWating: false,
				isLoading: true
			}
		},
		computed: {
			realDuration () {
				if (this.videoConfig.player_limit_time) {
					return this.videoConfig.player_limit_time
				} else {
					return 50
				}
			},
			barWidth() {
				let percent = this.time / this.duration * 100
				return `${percent}%`
			}
		},
		mounted() {
			try {
				const res = uni.getSystemInfoSync()
				this.windowWidth = res.windowWidth
				this.windowHeight = res.windowHeight
			} catch (e) {
			}
			this.$nextTick(() => {
				this.init()
			})
		},
		destroyed() {
			console.log('player destroy')
			this.videoCtx.destroy()
		},
		methods: {
			init () {
				this.videoCtx = new DPlayer({
				  container: document.getElementById('myVideo'),
					autoplay: true,
					lang: 'en',
					video: {
						url: this.src,
						pic: this.$helper.videoSourcePath + this.videoData.poster,
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
				this.videoCtx.on('timeupdate', e => {
					// console.log('timeupdate', this.videoCtx.video.currentTime)
					if (this.videoCtx.video.currentTime - this.waitingTime > 1) {
						this.isLoading = false
					}
					this.$emit('timeupdate', {
						id: this.videoId,
						currentTime: this.videoCtx.video.currentTime,
						duration: this.videoCtx.video.duration,
						video: this.videoCtx
					})
					this.time = this.videoCtx.video.currentTime
					this.duration = this.videoCtx.video.duration
				})
				this.videoCtx.on('play', e => {
					this.isPlay = true
					this.isLoading = false
				})
				this.videoCtx.on('pause', e => {
					this.isPlay = false
				})
				this.videoCtx.on('waiting', e => {
					this.isLoading = true
					this.waitingTime = this.time
				})
				this.videoCtx.on('ended', e => {
					this.$emit('ended')
				})
				this.videoCtx.on('loadedmetadata', e => {
					console.log('Load Success')
					this.isLoading = false
				})
			},
			timeupdate(event) {
				if (event.detail.currentTime - this.waitingTime > 1) {
					this.isLoading = false
				}
				this.$emit('timeupdate', {
					id: this.videoId,
					currentTime: event.detail.currentTime,
					duration: event.detail.duration,
					video: this.videoCtx
				})
				this.time = event.detail.currentTime
				this.duration = event.detail.duration
			},
			_play (event) {
				this.isPlay = true
				this.isLoading = false
			},
			_pause (event) {
				this.isPlay = false
				// this.videoCtx.pause()
			},
			_waiting (event) {
				this.isLoading = true
				this.waitingTime = this.time
			},
			_ended() {
				this.$emit('ended')
			},
			_loadedmetadata(event) {
				console.log('加载完毕', event)
				this.isLoading = false
			},
			handVideoClick(e) {
				if (this.isPlay) {
					this.videoCtx.pause()
				}
			},
			handlePlay () {
				this.videoCtx.play()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.body {
		position: relative;
	}
	
	.controls-img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90px;
		height: 90px;
	}

	.progressBar {
		height: 1rpx;
		background-color: #FFFFFF;
		z-index: 999999;
		position: absolute;
		bottom: 50px;
		//#ifndef APP-PLUS-NVUE
		animation: flicker 4s linear infinite;
		animation-direction: alternate;
		//#endif
	}

	.cover-img {
		position: absolute;
		left: 0;
		top: 0;
	}
	
	.video-background {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		filter: blur(30px);
		z-index: -1;
	}
	
	v-deep .uni-video-container {
		background-color: transparent;
	}
	
	::v-deep .dplayer {
		.dplayer-mobile-play {
			display: none;
		}
		.dplayer-controller {
			display: none;
		}
	}

	//#ifndef APP-PLUS-NVUE
	@keyframes flicker {
		0% {
			box-shadow: 0 0 0 #FFFFFF;
		}

		/** 暂停效果 */
		10% {
			box-shadow: 0 0 2rpx #FFFFFF;
		}

		50% {
			box-shadow: 0 0 10rpx #FFFFFF;
		}

		60% {
			box-shadow: 0 0 12rpx #FFFFFF;
		}

		90% {
			box-shadow: 0 0 18rpx #FFFFFF;
		}

		100% {
			box-shadow: 0 0 20rpx #FFFFFF;
		}

	}

	//#endif
</style>
