<template>
	<view class="video" :id="`video_${id}`"></view>
</template>

<script>
	import Hls from 'hls.js/dist/hls.min.js';
	import DPlayer from 'dplayer';

	export default{ 
		props:{
			controls:{
				type: Boolean,
				default: false
			},
			id:{
				type: String|Number,
				default: ''
			},
			src:{
				type: String,
				default: ''
			},
			poster:{
				type: String,
				default: ''
			},
			rotateImg:{
				type: String,
				default: ''
			},
			play:{
				type: Boolean,
				default: false
			},
			height:{
				type: String,
				default: ''
			},
			width:{
				type: String,
				default: ''
			},
			initialTime:{
				type: Number,
				default: 0
			},
			// 大概时长使进度条更准确
			gDuration:{
				type: Number,
				default: 999
			},
			objectFit:{
				type: String,
				default: 'contain'
			},
			// 视频封面的图片
			poster:{
				type: String,
				default: ''
			}
		},
		data(){
			return{
				time: 0,
				duration: 0,
				playFirst: true,
				load: false,
				timer: null
			}
		},
		mounted() {
			this.initPlayer()
		},
		onHide() {
			console.log('隐藏')
		},
		onUnload() {
			console.log('销毁')
			this.videoCtx.destroy()
		},
		methods:{
			continuePlay(){
				if(!this.load){
					setTimeout(()=>{
						this.load = true
						this.videoPlay()
					},1000)
				}
			},
			//拖动滑块
			changeCurrent(e){
				this.time = e.detail.value
				this.videoCtx.seek(this.time)
			},
			playEnd(){
				this.$emit('playEnd')
			},
			timeupdate(event){
				this.duration = event.detail.duration
				if(this.time>=event.detail.duration) this.time=0
				this.time = event.detail.currentTime
				this.$emit('timeupdate',this.time)
			},
			initPlayer () {
				this.videoCtx = new DPlayer({
				  container: document.getElementById(`video_${this.id}`),
					autoplay: true,
					lang: 'en',
					video: {
						url: this.src,
						pic: this.$helper.videoSourcePath + this.poster,
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
				this.videoCtx.on('canplay', () => {
					console.log('可以播放了')
					this.videoCtx.play()
				})
				this.videoCtx.on('timeupdate', () => {
					console.log('当前时间：', this.videoCtx.video.currentTime)
					console.log('当前影片：', this.id)
					this.$emit('timeupdate', this.videoCtx.video.currentTime)
				})
			},
			videoPlay:function(){
				if(this.timer) clearTimeout(this.timer)
				this.timer = setTimeout(()=>{
					if(this.play){
						this.videoCtx.play();
						this.playFirst = false
					}else{
						this.videoCtx.pause();
						this.$emit('pause',this.time)
					}
				})
			}
		},
		watch:{
			//防抖 防止视频播放暂停太快
			play: function (newVal,oldVal){if(this.load) this.videoPlay()},
			startTime:{
				immediate: true,
				handler(newVal,oldVal){
					this.time = newVal
				}
			},
			gDuration:{
				immediate: true,
				handler(newVal,oldVal){
					this.duration = newVal
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.video{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 750rpx;
		height: 100%;
		
		justify-content: center;
		align-items: center;
	}
	::v-deep .dplayer-controller {
	  /* 底部控制条 */
	  // display: none;
		padding: 0;
		.dplayer-icons-left, .dplayer-icons-right {
			display: none;
		}
		.dplayer-bar-wrap {
			width: 100%;
		}
	}
</style>