<template>
	<view class="short-view" :style="{ height: height }">
		<view class="swiper" :style="containerStyle">
			<block v-for="(item, index) in videoList" :key="index">
				<short-video
					class="video"
					:src="item.src"
					:short="item.short"
					:height="height"
					:width="width"
					:duration="item.duration"
					:play="item.flag">
				</short-video>
				<cover-view class="cover-view-marks">
					<div :style="{ height: height,width: width }" @click.stop="clickVideo" @touchmove="ListTouchMove" @touchend.stop="ListTouchEnd"
					@touchstart="ListTouchStart">
					</div>
				</cover-view>
				<cover-view class="cover-view-left">
					<text class="view-left-text"  v-if="item.title">{{item.title}}</text>
					<view class="view-left-text-content" v-if="item.content"><text class="text-content-text">{{item.content}}</text><text class="text-content-advert" v-if="item.advert">广告</text></view>
					<view style="flex-direction: row;" v-if="item.dubbedText"><text class="iconfont view-left-icon" >&#xe600;</text><view class="view-left-dubbedText"><text class="view-left-dubbedText-text" :style="{transform: `translateX(${translateX}px)`}">{{item.dubbedText}}</text></view></view>
					<view class="seedetails" v-if="item.advert"><text class="seedetails-text" @click="navigateTo(item.advertUrl)">查看详情 ></text></view>
				</cover-view>
				<cover-view class="cover-view-right">
					<cover-image :src="item.avater" class="avater img" @click.stop="tapAvater"></cover-image>
					<text class="right-follow">+</text>
					<!-- <cover-image :src="item.check?'../../../static/img/axc.png':'../../../static/img/bed.png' " class="img-left" @click.stop="tapLove"></cover-image> -->
					<!-- <text class="iconfont " :class="item.check?'right-checkLove':'right-iconfont'" @click.stop="tapLove">&#xe757;</text> -->
					<text class="right-text">{{item.giveNum}}</text>
					<!-- <cover-image src="../../../static/img/ay2.png" style="height: 80upx;"  class="img-left" @click.stop="tapMsg"></cover-image> -->
					<!-- <text class="iconfont right-iconfont" @click.stop="tapMsg">&#xe612;</text> -->
					<text class="right-text">{{item.commentsNum}}</text>
					<!-- <cover-image  src="../../../static/img/b6p.png" style="height: 76upx;"  class="img-left" @click.stop="tapShare"></cover-image> -->
					<!-- <text class="iconfont right-iconfont" @click.stop="tapShare">&#xe627;</text> -->
					<text class="right-text">{{item.forwardsNum}}</text>
					<!-- <cover-image src="../../../static/changpian.png" class="musicIcon img"></cover-image> -->
				</cover-view>
			</block>
		</view>
		<u-tabbar
			:list="tabbarlist"
			active-color="#4eacee"
			inactive-color="#74767b"
			:mid-button="true">
		</u-tabbar>
	</view>
</template>

<script>
	import shortVideo from '@/components/short-video/index.vue'
	import { mapGetters } from 'vuex'
	let timer=null
	export default {
		data() {
			return {
				width: '',
				height: '667px',
				index: 0,
				containerStyle:'',
				distance:0,
				listTouchStartY: 0,
				listTouchDirection: null,
				scroll:false,
				translateX:'10',
				videoList:[
					{
						src:'https://vod.hjbfq.com/20201215/AWfBkv33/index.m3u8',//视频地址
						flag:false,//是否播放
						check:false,//是否点赞
						avater:'../../../static/img/tou1.jpg',//用户头像
						duration:10,//时长
						nickname:'小羽毛',//昵称
						advert:false,//是否广告
						title:'@小羽毛',//标题
						content:'见笑了 感觉无论如何都走不出星爷当年那种feel #致敬经典',//内容
						dubbedText:'@北方有你创作的原声 - 北方有你',//配音文字
						giveNum:'109.8w',//点赞数
						commentsNum:'1.8w',//评论数
						forwardsNum:'7680'//转发数
					},
					{
						src:'https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4',
						flag:false,
						check:true,
						avater:'../../../static/img/tou2.jpg',
						duration:15,
						short:true,//是否矮视频
						nickname:'测试矮视频',//昵称
						advert:false,//是否广告
						title:'@313',//标题
						content:'3113313怖故事，3131#恐怖',//内容
						dubbedText:'@遇见穿女士创作的原声 - 遇见穿女士',//配音文字
						giveNum:'176.7w',//点赞数
						commentsNum:'4.5w',//评论数
						forwardsNum:'2.7w',//转发数
					},
					{
						src:'http://admin.jzldy.com:8999/utuifiles/video/2.mp4',
						flag:false,
						check:true,
						avater:'../../../static/img/tou2.jpg',
						duration:15,
						nickname:'遇见穿女士',//昵称
						advert:false,//是否广告
						title:'@遇见穿女士',//标题
						content:'史上最短恐怖故事，胆小车误入#恐怖',//内容
						dubbedText:'@遇见穿女士创作的原声 - 遇见穿女士',//配音文字
						giveNum:'176.7w',//点赞数
						commentsNum:'4.5w',//评论数
						forwardsNum:'2.7w',//转发数
					},
					{
						src:'http://admin.jzldy.com:8999/utuifiles/video/4.mp4',
						flag:false,
						check:false,
						avater:'../../../static/img/tou3.jpg',
						duration:17,
						nickname:'暴躁涛哥',//昵称
						advert:false,//是否广告
						title:'@暴躁涛哥',//标题
						content:'别惹女人  不好惹',//内容
						dubbedText:'暴躁涛哥创作的原声 - 暴躁涛哥',//配音文字
						giveNum:'1.2w',//点赞数
						commentsNum:556,//评论数
						forwardsNum:83,//转发数
					},{
						src:'http://admin.jzldy.com:8999/utuifiles/video/ad-wz.mp4',
						flag:false,
						check:false,
						avater:'../../../static/img/tou4.jpg',
						duration:15,
						nickname:'微信投资',//昵称
						advert:true,//是否广告
						title:'@微信投资',//标题
						content:'女白领下班有点闲，无意接触微信投资赚大钱！',//内容
						dubbedText:'@微信投资创作的原声 - 微信投资',//配音文字
						giveNum:1567,//点赞数
						commentsNum:693,//评论数
						forwardsNum:0,//转发数
						advertUrl:'http://static.jiezhiwz.com/z',//广告地址
					}
					
				]
			}
		},
		components: {
			shortVideo
		},
		computed: {
			...mapGetters([
				'tabbarlist'
			])
		},
		onLoad() {
			let systemInfo = uni.getSystemInfoSync()
			this.width = `${systemInfo.windowWidth}px`
			this.height = `${systemInfo.windowHeight}px`
		},
		onShow() {
			this.animateTranslateX()
			setTimeout(()=>{
				this.videoList[this.index].flag = true
			},1000)
		},
		onHide(){
			for (let item of this.videoList) {
				item.flag = false
			}
			clearInterval(timer)
		},
		methods: {
			animateTranslateX(){
				let num= this.videoList[this.index].dubbedText.length*9
				timer=setInterval(()=>{
					this.translateX--
					if(this.translateX==-(num+35)){
						this.translateX=num
					}
				},100)
				
			},
			ListTouchStart(e) {
				this.listTouchStartY = e.changedTouches[0].pageY
				this.moverOnoff=false
					
			},
			ListTouchMove(e) {
				this.listTouchDirection = this.listTouchStartY - e.changedTouches[0].pageY > 10 ? -1 : 0
				this.listTouchDirection = e.changedTouches[0].pageY - this.listTouchStartY > 10 ?  1 : this.listTouchDirection
				const distance = this.distance + e.changedTouches[0].pageY - this.listTouchStartY
				if(distance>0) return
				if(Math.abs(this.listTouchStartY - e.changedTouches[0].pageY)<2){
					this.listTouchDirection = null
				}
			},
			ListTouchEnd(e) {
				try{
					this.videoList[this.index].flag = !this.videoList[this.index].flag
					this.translateX=10
				}catch(e){
				}
				if(this.scroll) return
				if(!this.listTouchDirection){
					return
				}
				const destination = this.listTouchDirection*this.sysheight+this.distance
				if(destination>0||destination<-this.sysheight*(this.videoList.length-1)) return
				for (let item of this.videoList) {
					item.flag = false
				}
				this.animate(destination, this.listTouchDirection)
				this.index = this.index - this.listTouchDirection
				this.videoList[this.index].flag = true
				this.listTouchDirection = null
			},
			animate(des, direc) {
				let { distance } = this
				let promise = new Promise((resolve,reject)=>{
					this.scroll = true
					const temp = setInterval(() => {
						if ((direc === -1 && des < distance) || (direc === 1 && des > distance)) {
							distance += 100 * direc
							this.containerStyle = `transform:translateY(${distance}px)`
						} else {
							clearInterval(temp)
							distance = des
							this.distance = des
							this.containerStyle = `transform:translateY(${distance}px)`
							this.scroll = false
							resolve()
						}
					}, 50)
				})
				return promise
			},
			tapLove(){
				this.videoList[this.index].check = !this.videoList[this.index].check
				this.videoList = [...this.videoList]
			},
			tapAvater(){
				return
			},
			tapMsg(){
				uni.getSubNVueById('drawer').show('slide-in-bottom', 200,()=>{});
			},
			tapShare(){
				uni.getSubNVueById('forward').show('slide-in-bottom', 200,()=>{});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.short-view{
		flex: 1;
		overflow: hidden;
		background-color: #000;
	}
	.swiper{
		position: relative;
		background-color: #000;
	}
	.cover-view-center{
		position: fixed;
		/* opacity: 0.1; */
		z-index: 100;
	}
	.cover-view-left{
		position: absolute;
		margin-left: 20upx;
		width: 500upx;
		bottom: 50upx;
		z-index: 9999;
		font-size: 14px;
		color: #FFFFFF;
		//#ifndef APP-PLUS-NVUE
		white-space: pre-wrap;  
		text-overflow:ellipsis;
		overflow:hidden;
		//#endif
	}
	.left-text{
		font-size: 14px;
		color: #FFFFFF;
	}
	.avater{
		border-radius: 45upx;
		border-width: 2px;
		border-style: solid;
		border-color: #FFFFFF;
	}
	.cover-view-marks{
		position: absolute;
		bottom: 80upx;
		margin-right: 20upx;
		right: 0;
		z-index: 9999;
	}
	
	.cover-view-right{
		position: absolute;
		bottom: 0px;
		margin-right: 20upx;
		right: 10upx;
		z-index: 9999;
		text-align: center;
		padding: 0 4upx;
		
	}
	.seedetails{ width: 480upx;height: 70upx;text-align: center;background-color: rgba(177,68,48,0.8);border-radius: 6px;margin-top: 10px; }
	.seedetails-text{font-size: 16px;color: #FFFFFF;text-align: center;line-height: 70upx;}
	.view-left-text{color: #FFFFFF;font-size: 18px;margin-bottom: 10upx;font-weight: bold;}
	/* 广告 */
	.view-left-text-content{padding-right: 50upx;}
	.text-content-advert{position: absolute;right: 8px;bottom: 10upx; font-size: 10px;background-color:rgba(255,255,255,0.1);color: #eee;border-radius: 2px;padding: 2px 5px;width: 66upx;flex-direction: row;text-align: center;}
	.text-content-text{color: #eee;font-size: 16px;lines: 2;overflow: hidden;text-overflow: ellipsis;line-height:50upx;}
	
	/* 广告 */
	.view-left-dubbedText{color: #FFFFFF;font-size: 16px;width:300upx; flex-direction: row;}
	.view-left-dubbedText-text{color: #eee;font-size: 16px;line-height: 50upx;}
	.view-left-icon{color: #eee;font-size: 20px;}
	.right-follow{
		position: absolute;z-index:100;top: 70upx;left: 30upx;
		color: #FFFFFF;font-size: 16px;width:34upx;height:34upx;background-color: #F12F5B;text-align: center;line-height: 34upx;border-radius: 17upx;
	}
	.right-text{
		color: #FFFFFF;font-size: 11px;text-align: center;margin-bottom: 40upx;
	}
	.right-iconfont{
		color: #eee;font-size: 32px;text-align: center;
	} 
	.right-checkLove{
		color: #FD0606;font-size: 30px;text-align: center;
	}
	.img{
		height: 90upx;width: 90upx;margin-bottom: 60upx;
	}
	.img-left{
		width: 80upx;height: 66upx;
	}
	.musicIcon{margin-top: 40upx; }
</style>
