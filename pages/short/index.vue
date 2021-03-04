<template>
	<view class="short-view" :style="{ height: height }">
		<swiper
			class="swiper"
			:vertical="true"
			@change="changeCurrent"
			@animationfinish="animationFinish"
			:current="index"
			:style="{ height: height }">
			<swiper-item v-for="(item, idx) in videoList" :key="idx" class="swiper-item">
				<!-- 视频渲染数预加载数影响性能 -->
				<div class="swiper-item--container">
					<block v-if="item.src">
						<video-player
							class="video"
							:id="item.id"
							:src="item.src"
							:poster="item.poster"
							:height="height"
							:width="width"
							:play="item.flag"
							v-if="Math.abs(index-idx)<=1"
							:gDuration="item.duration"
							:initialTime="item.initialTime"
							@pause="pauseVideo"
							:objectFit="item.objectFit"
							@playEnd="playEnd"
						>
						</video-player>
						
						<cover-view class="cover-view-left">
							<cover-view class="left-view">
								<!-- #ifdef APP-PLUS-NVUE -->
								<text class="left-text">@{{item.at}}</text>
								<!-- #endif -->
								<!-- #ifndef APP-PLUS-NVUE -->
								<cover-view class="left-text">@{{item.at}}</cover-view>
								<!-- #endif -->
							</cover-view>
							<cover-view class="left-view">
								<!-- #ifdef APP-PLUS-NVUE -->
								<text class="left-text">{{item.content}}</text>
								<!-- #endif -->
								<!-- #ifndef APP-PLUS-NVUE -->
								<cover-view class="left-text">{{item.content}}</cover-view>
								<!-- #endif -->
							</cover-view>
						</cover-view>
						<cover-view class="cover-view-right">
							
							<cover-image :src="item.check ? '../../static/icon-like-check.png' : '../../static/icon-like.png'" class="img" @click.stop="tapLove"></cover-image>
							
							<!-- #ifdef APP-PLUS-NVUE -->
							<text class="right-text">{{item.like}}</text>
							<!-- #endif -->
							<!-- #ifndef APP-PLUS-NVUE -->
							<cover-view class="right-text">{{item.like}}</cover-view>
							<!-- #endif -->
							
						</cover-view>
					</block>
				</div>
			</swiper-item>
		</swiper>
		<u-tabbar
			:list="tabbarlist"
			active-color="#fe9900"
			inactive-color="#74767b"
			:mid-button="true"
			bg-color="#1e1e1e">
		</u-tabbar>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import chunleiVideo from '@/components/chunlei-video/chunlei-video'
	import videoPlayer from '@/components/video-player/index.vue'
	export default {
		data() {
			return {
				sysheight: 0,
				height: '667px',
				index: 0,
				width: '',
				oldIndex: 0,
				// 剩余多少视频加载视频列表
				playCount: 2,
				videoList: [],
				page: 1,
				more: true
			}
		},
		watch:{
			index(newVal, oldVal) {
				let len = this.videoList.filter(item=>item.src).length
				//加载视频
				if(len - this.index - 1 <= this.playCount){
					this.pushVideoList()
				}
				this.oldIndex = oldVal
			}
		},
		components: {
			chunleiVideo,
			videoPlayer
		},
		computed: {
			...mapGetters([
				'tabbarlist'
			])
		},
		created(){
			this.sysheight = uni.getSystemInfoSync().windowHeight
			this.height = `${this.sysheight}px` 
			let width = uni.getSystemInfoSync().windowWidth 
			this.width = `${width}px`
		},
		mounted() {
			// this.init(true)
			
			/* this.index = this.videoList.reduce((total,item)=>{
				if(id==''||id==item.id){
					id = ''
				}else{
					total++
				}
				return total
			},0)
			if(!this.index){
				this.$nextTick(()=>{
					this.videoPlay(this.index)
				})
			} */
		},
		onHide(){
			for (let item of this.videoList) {
				item.flag = false
			}
		},
		methods: {
			init (init = false) {
				this.$http.post('/api.php/index/config/getConfig',{}).then((res)=>{
					uni.setStorageSync('sys_config', res.data)
					// 系统参数
					this.sysconfig = res.data
					console.log('系统参数：', this.sysconfig)
					// 初始会员权限
					this.userInfo = res.data.userinfo || null
					// 获取视频列表
					this.getList(init)
				})
			},
			getList (init) {
				if (init) {
					this.page = 1
				}
				this.$http.post('/api.php/videos/videos/getShortVideos', {
					page: this.page
				}).then(res => {
					if (res.code === 200) {
						if (res.data.page * res.data.limit >= res.data.count) {
							this.more = false
						}
						let list = res.data.list.map(item => {
							return {
								src: item.vod_play_url.split('$')[1],
								title: item.vod_name,
								poster: item.vod_pic,
								flag: false,
								check: false,
								like:'7w',
								comment:'1045',
								at: item.vod_name,
								id: item.vod_id,
								avater: item.vod_id,
								initialTime: 0,
								duration: 663
							}
						})
						if (init) {
							this.videoList = list
						} else {
							this.videoList = this.videoList.concat(list)
						}
					}
				})
			},
			animationFinish(e){
				//#ifdef APP-PLUS
				this.changeCurrent(e)
				//#endif
			},
			changeCurrent(e){
				this.index = e.detail.current; 
				
				this.$nextTick(()=>{
					
					for (let item of this.videoList) {
						item.flag = false
					}   
					
					this.videoList[this.index].flag = true
					
				}) 
				
			},
			pushVideoList () {
				let params 
				let promise = new Promise((resolve,reject)=>{
					uni.request({
						url: 'https://api.apiopen.top/videoRecommend?id=127397',
						success: (res) => {
							let videoGroup = []
							for (let item of res.data.result) {
								if(item.type == 'videoSmallCard'){
									videoGroup.push({
										src:item.data.playUrl,
										content:item.data.title,
										flag:false,
										check:false,
										like:'7w',
										comment:'1045',
										at:item.data.author.name,
										id:item.data.author.icon,
										avater:item.data.author.icon,
										initialTime:0,
										duration:item.data.duration
									})
								}
							}
							
							let len = this.videoList.filter(item=>item.src).length
							for(let i = len;i<len+videoGroup.length;i++){
								this.$set(this.videoList,i,videoGroup[i-len])
								
							}
							resolve()
						}
					})
				}) 
				return promise
			},
			tapLove(){
				this.videoList[this.index].check = !this.videoList[this.index].check
				this.videoList = [...this.videoList]
				
			},
			tapAvater(){
				uni.showToast({
					icon:'none',
					title:`点击索引为${this.index}的头像`
				})
			},
			videoPlay(index){
				let promise = new Promise((resolve,reject)=>{
					resolve()
				})
				promise.then(res=>{
					this.$set(this.videoList[index],'flag',!this.videoList[index].flag)
					
				})
			},
			pauseVideo(val){
				if(typeof this.videoList[this.oldIndex].initialTime !='undefined') this.videoList[this.oldIndex].initialTime = val
			},
			clickVideo(){
				this.videoList[this.index].flag = !this.videoList[this.index].flag
			}
		}
	}
</script>

<style lang="scss" scoped>
	.short-view{
		flex: 1;
		overflow: hidden;
		background-color: #000;
		.swiper{
			flex: 1;
			background-color: #000;
		}
		.swiper-item {
			flex: 1;
			.swiper-item--container {
				width: 100%;
				height: 100%;
			}
		}
		
		.video {
			flex: 1;
		  }
		.video-box{
			flex: 1;
			width: 750rpx;
		}
		.cover-view-center{
			position: absolute;
			justify-content: center;
			align-items: center;
			opacity: 0.1;
			z-index: 999;
		}
		.cover-view-left{
			position: absolute;
			margin-left: 10upx;
			width: 500upx;
			bottom: 120upx;
			z-index: 9999;
			font-size: 16px;
			color: #FFFFFF;
			/* #ifndef APP-PLUS */
			white-space: pre-wrap;
			text-overflow:ellipsis;
			overflow:hidden;
			/* #endif */
		}
		.left-view{
			margin-bottom: 20upx;
		}
		.left-text{
			font-size: 16px;
			color: #FFFFFF;
		}
		.avater{
			border-radius: 50upx;
			border-color: #fff;
			border-style: solid;
			border-width: 2px;
		}
		
		.cover-view-right{
			position: absolute;
			bottom: 50%;
			right: 20upx;
			/* #ifndef APP-PLUS-NVUE */
			display: flex;
			flex-direction: column;
			/* #endif */
			z-index: 9999;
		}
		
		.right-text-avater{
			position: absolute;
			font-size: 14px;
			top: 80upx;
			left: 30upx;
			height: 40upx;
			width: 40upx;
			background-color: #DD524D;
			color: #FFFFFF;
			border-radius: 50%;
			text-align: center;
			line-height: 40upx;
			z-index: 999;
		}
		.avater-icon{
			height: 40upx;
			width: 40upx;
			
			color: #fff;
			background-color: #DD524D;
			border-radius: 50%;
			position: absolute;
			left: 30upx;
			top:-20upx;
		}
		
		.right-text{
			text-align: center;
			font-size: 14px;
			color: #FFFFFF;
			margin-bottom: 50upx;
			height: 20px;
		}
		.img{
			width: 80upx;
			height: 66upx;
		}
	}
</style>
