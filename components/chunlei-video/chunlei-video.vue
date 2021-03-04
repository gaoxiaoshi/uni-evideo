<template>
	<view class="video">
		<video
			class="video"
			:controls="controls"
			:show-play-btn="false"
			:muted="!load||!play"
			:style="{ height: height }"
			:loop="true"
			:enable-progress-gesture="false"
			:objectFit="objectFit"
			:initial-time="startTime"
			:id="`video_${id}`"
			ref="video"
			@play="continuePlay"
			@ended="playEnd"
			@timeupdate="timeupdate">
		</video>
		<cover-view class="icon-view"><text class="icon" style="color:#FFF">&#xe896;</text></cover-view>
		<!-- <cover-image class="img" :style="{ height: height }" :src="$helper.videoSourcePath + poster" v-if="poster!=''&&playFirst"></cover-image> -->
		<cover-view class="top"></cover-view>
		<cover-view class="bottom"></cover-view>
		<!-- #ifdef APP-PLUS -->
		<cover-view class="danmu-view">
			<chunLei-danmu :danmuList="danmuList" :width="750"  :current="time" ref="danmu"></chunLei-danmu>
		</cover-view>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<cover-view class="slider-view">
			<chunLei-slider :max="duration" :value="time" :style="{width:`${380}px`}" :screenLeft="120" :width="380" @change="changeCurrent"></chunLei-slider>
		</cover-view>
		<cover-image :src="rotateImg" class="rotate-img" :style="{transform:`rotate(${time*20}deg)`}"></cover-image>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<cover-view class="progressBar" :style="{ width: barWidth }"></cover-view>
		<!-- #endif -->
	</view>
</template>

<script>
	let Hls = require('hls.js/dist/hls.min.js')
	import chunLeiSlider from './chunLei-slider/chunLei-slider.nvue';
	export default{ 
		components:{
			chunLeiSlider
		},
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
				time:0,
				duration:0,
				playFirst:true,
				load:false,
				timer:null
			}
		},
		mounted() {
			let _this = this
			this.videoCtx = uni.createVideoContext(`video_${this.id}`,this)
			setTimeout(function() {
				_this.getStream()
			}, 200);
			//#ifndef MP-WEIXIN
			// setTimeout(()=>{this.videoCtx.play();},200)
			// #endif
		},
		methods:{
			getStream() {
				if (Hls.isSupported()) {
					console.log('VIDEO对象：', this.videoCtx)
					this.hls = new Hls();
					this.hls.loadSource(this.src);
					this.hls.attachMedia(this.videoCtx);
					this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
						console.log('加载成功');
						
						this.videoCtx.play();
					});
					this.hls.on(Hls.Events.ERROR, (event, data) => {
						console.log(event, data);
						// 监听出错事件
						console.log('加载失败');
					});
				}
			},
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
		},
		computed:{
			barWidth(){
				let width = this.time / this.duration*parseInt(this.width)
				return `${width}px`
			},
			startTime(){
				return this.initialTime
			}
		}
	}
</script>

<style scoped>
	.video{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 750rpx;
		
		justify-content: center;
		align-items: center;
	}
	.img{
		position: absolute;
		
		width: 750rpx;
	}
	.icon-view{
		position: absolute;
	}
	.top{
		position: absolute;
		top:0;
		background-image: linear-gradient(to top , rgba(0,0,0,0) , rgba(0,0,0,0.7));
		width: 750rpx;
		height: 300rpx;
	}
	.icon{
		opacity: 0.6;
		font-size: 42px;
		color: #fff;
		font-family: texticons;
	}
	.bottom{
		position: absolute;
		bottom: 0;
		background-image: linear-gradient(to top , rgba(0,0,0,0.7) , rgba(0,0,0,0));
		width: 750rpx;
		height: 300rpx;
	}
	.slider-view{
		position: absolute;
		left: 0;
		bottom: 30px;
		width: 750rpx;
	}
	.progressBar{
		border-radius: 2upx;
		height: 4upx;
		background-color: #FFFFFF;
		z-index: 999999;
		position: absolute;
		left: 0;
		bottom: 30px;
		//#ifndef APP-PLUS-NVUE
		animation: flicker 4s linear infinite;
		animation-direction:alternate;
		//#endif
	}
	//#ifndef APP-PLUS-NVUE
	@keyframes flicker {
		0% { box-shadow:0 0 0 #FFFFFF; }
		10% { box-shadow:0 0 2upx #FFFFFF; }
		50% { box-shadow:0 0 10upx #FFFFFF; }
		60% { box-shadow:0 0 12upx #FFFFFF; }
		90% { box-shadow:0 0 18upx #FFFFFF; }
		100% { box-shadow:0 0 20upx #FFFFFF; }
	}
	//#endif
	.danmu-view{
		position: absolute;
		top:0;
		height: 160px;
	}
	.rotate-img{
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		bottom: 100rpx;
		right: 20rpx;
		border-radius: 45rpx;
	}
</style>