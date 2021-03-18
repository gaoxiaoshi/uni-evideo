<template>
	<view class="short-view" :style="{ height: height }">
		<swiper
			class="swiper"
			:vertical="true"
			@change="changeCurrent"
			:current="index"
			:style="{ height: height }">
			<swiper-item v-for="(item, idx) in videoList" :key="idx" class="swiper-item">
				<!-- 视频渲染数预加载数影响性能 -->
				<div class="swiper-item--container">
					<video-player
						class="video"
						v-if="idx === index"
						:video-id="item.id"
						:video-data="item"
						:video-config="sysconfig"
						:src="item.src"
						:height="height"
						@ended="ended"
						@timeupdate="timeupdate">
					</video-player>
					
					<div class="cover-view-left">
						<div class="left-view">
							<div class="left-text">【{{item.title}}】</div>
						</div>
						<div class="left-view">
							<div class="btn-group">
								<div class="left-btn" @click="handleDetail(item.id)">
									<image class="btn-play" src="../../static/icon-play.png" mode="widthFix">FULL VIDEO {{duration || ''}}</image>
								</div>
							</div>
						</div>
					</div>
					<!-- <cover-view class="cover-view-right">
						<cover-image :src="item.check ? '../../static/icon-like-check.png' : '../../static/icon-like.png'" class="img" @click.stop="tapLove"></cover-image>
						<cover-view class="right-text">{{item.like}}</cover-view>	
					</cover-view> -->
				</div>
			</swiper-item>
		</swiper>
		<u-tabbar
			:list="tabbarlist"
			active-color="#ffffff"
			inactive-color="#646566"
			:mid-button="false"
			bg-color="transparent">
		</u-tabbar>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import videoPlayer from '@/components/video-player/index.vue'
	export default {
		data() {
			return {
				sysheight: 0,
				height: '667px',
				index: 0,
				width: '',
				oldIndex: 0,
				currentVideo: null,
				duration: '',
				playCount: 2,
				videoList: [],
				page: 1,
				more: true
			}
		},
		watch:{
			index(newVal, oldVal) {
				let len = this.videoList.length
				//加载视频
				if(len - this.index - 1 <= this.playCount){
					this.page++
					this.getList()
				}
				this.oldIndex = oldVal
			}
		},
		components: {
			videoPlayer
		},
		computed: {
			...mapGetters([
				'tabbarlist'
			])
		},
		created(){
			let sysInfo = uni.getSystemInfoSync()
			console.log('System info：', sysInfo)
			this.sysheight = uni.getSystemInfoSync().windowHeight
			this.height = `${this.sysheight + 50}px` 
			let width = uni.getSystemInfoSync().windowWidth 
			this.width = `${width}px`
			this.getList(true)
		},
		onShow() {
			this.init()
		},
		onHide(){
			this.currentVideo.pause()
		},
		onUnload() {
			this.currentVideo.pause()
		},
		methods: {
			init () {
				this.$http.post('/api.php/index/config/getConfig',{}).then((res)=>{
					uni.setStorageSync('sys_config', res.data)
					// 系统参数
					this.sysconfig = res.data
					// 初始会员权限
					this.userInfo = res.data.userinfo || null
				})
			},
			handleDetail (id) {
				console.log('CURRENT:', this.videoList[this.index])
				this.currentVideo.pause()
				if (!this.userInfo) {
					uni.showModal({
						title: 'Message',
						content: 'You are not signed in yet，Please sign in or sign up first',
						cancelText: 'Sign Up',
						confirmText: 'Sign In',
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/index'
								})
							}
							if (res.cancel) {
								uni.navigateTo({
									url: '/pages/register/index'
								})
							}
						}
					})
				} else {
					console.log('CURRENT:', this.videoList[this.index])
					if (this.videoList[this.index].isPay) {
						uni.navigateTo({ url: '/pages/video/index?id=' + id })
					} else {
						if (this.userInfo.group_id != 1) {
							uni.navigateTo({ url: '/pages/video/index?id=' + id })
						} else {
							uni.showModal({
								title: 'Message',
								content: 'Please pay for it or upgrade vip to watch',
								cancelText: 'Upgrade',
								confirmText: 'Pay',
								success: res => {
									if (res.confirm) {
										uni.showLoading({
											title: this.$t('pay')
										})
										console.log(this.videoList[this.index])
										let params = {
											vid: this.videoList[this.index].id,
											title: this.videoList[this.index].title,
											price: this.sysconfig.player_price
										}
										this.$http.post('/api.php/finance/exchange/exchangeVideo', params).then(res => {
											uni.hideLoading()
											if (res.code == 200) {
												let _this = this
												uni.showToast({
													title: 'Success',
													icon: 'success',
													duration: 2000,
													success() {
														_this.videoList[_this.index].isPay = true
														uni.navigateTo({ url: '/pages/video/index?id=' + id })
													}
												})
											}
										})
									}
									if (res.cancel) {
										uni.navigateTo({
											url: '/pages/user/vip'
										})
									}
								}
							})
						}
					}
				}
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
								id: item.vod_id,
								isPay: item.isPay
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
			timeupdate(event) {
				this.currentVideo = event.video
				// 获取视频总时长
				let duration = event.duration
				let currentTime = event.currentTime
				
				let limitTime = parseInt(this.sysconfig.player_limit_time)
				
				if (duration) {
					this.duration = this.formatSeconds(duration)
				} else {
					this.duration = 0
				}
				
				if (this.userInfo) {
					// 已登录
					if (this.userInfo.group_id == 1) {
						// 非会员
						// console.log('非会员:', limitTime, currentTime, this.videoList[this.index].isPay)
						if (!this.videoList[this.index].isPay) {
							if (limitTime < currentTime) {
								// this.index ++
								this.currentVideo.video.currentTime = 0
							}
						}
					}
				} else {
					// 未登录
					// console.log('未登录:', limitTime, currentTime)
					if (limitTime < currentTime) {
						// this.index ++
						// console.log(this.currentVideo.video)
						this.currentVideo.video.currentTime = 0
					}
				}
			},
			ended () {
				this.index ++
			},
			formatSeconds(value) {
				let theTime = parseInt(value);// 秒
				let middle= 0;// 分
				if(theTime > 60) {
						middle= parseInt(theTime/60);
						theTime = parseInt(theTime%60);	
				}
				return `${middle>9?middle:'0'+middle}:${theTime>9?theTime:'0'+theTime}`;
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
				position: relative;
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
		.cover-view-left{
			position: absolute;
			left: 30rpx;
			right: 30rpx;
			bottom: 60px;
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
			font-size: 18px;
			color: #FFFFFF;
			white-space: normal;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.btn-group {
			display: inline-block;
		}
		.left-btn {
			display: flex;
			align-items: center;
			height: 32px;
			background-color: rgba(109, 26, 255, 0.8);
			font-size: 16px;
			padding: 0 10px;
			border-radius: 32px;
			.btn-play {
				width: 30rpx;
				margin-right: 10rpx;
			}
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
