<template>
	<view class="content">
		<custom-header :showNavTop="showNavTop"></custom-header>
		<view class="banner">
			<view class="banner-background">
				<view class="bg-img" style="backgroundImage: url('/static/banner-bg.jpg')"></view>
				<view class="bg-color"></view>
			</view>
			<view class="banner-swiper">
				<swiper
					class="swiper-view"
					:indicator-dots="true"
					:circular="true"
					:autoplay="true"
					interval="5000"
					duration="500"
					indicator-color="#a1a6b3"
					indicator-active-color="#ed2f85"
					@change="bannerChange"
				>
					<block v-for="(item, index) in bannerList" :key="index">
						<swiper-item class="swiper-view--item">
							<image
								class="item-img"
								:lazy-load="true"
								:src="item.img_url"
								mode="scaleToFill"
								@click="handleVideoDetail(item.vid)"
								>
							</image>
						</swiper-item>
					</block>
				</swiper>
			</view>
		</view>
		<view class="notice-view" v-if="noticeList.length > 0">
			<u-notice-bar
				type="none"
				mode="vertical"
				border-radius="38"
				bg-color="#f8f8f8"
				:list="noticeList"
				@click="handleNotice">
			</u-notice-bar>
		</view>
		<view class="video-view">
			<view
				class="video-view--item"
				v-for="(item, index) in homeVideoList"
				:key="index">
				<view class="item-head">
					<view class="head-title">
						<u-icon name="video" custom-prefix="custom-icon" color="#4eacee" size="32"></u-icon>
						<text class="text">{{$t(`classilfy.${item.type_en}`)}}</text>
					</view>
					<view class="head-num">
						<view class="text">Total of <text class="num">{{item.videos_num}}</text></view>
					</view>
				</view>
				<view class="item-content">
					<view
						class="video-list-item"
						v-for="(video, vindex) in item.videos.list"
						@click="handleVideoDetail(video.vod_id)">
						<view
							class="video-thumb"
							:style="{'backgroundImage': 'url(' + $helper.videoSourcePath + video.vod_pic + ')'}"
						>
							<view class="video-thumb--tag">
								<view class="tag tag-year">{{video.vod_year}}</view>
							</view>
						</view>
						<view class="video-title">{{video.vod_name}}</view>
					</view>
				</view>
			</view>
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
	import { mapGetters } from 'vuex'
	import customHeader from '@/components/custom-header/index.vue'
	export default {
		data() {
			return {
				showNavTop: false,
				currentBanner: 0,
				bannerList: [],
				noticeList: [],
				homeVideoList: []
			}
		},
		components: {
			customHeader
		},
		computed: {
			...mapGetters([
				'tabbarlist'
			]),
			lang() {
				return this.$t('tabbar')
			}
		},
		methods: {
			initHome () {
				uni.showLoading({
					title: this.$t('loading'),
					mask: true
				})
				this.getHomeBannerList()
				this.getHomeNoticeList()
				this.getHomeVideoList()
			},
			getHomeBannerList () {
				this.$http.post('/banner/banner/getBannerLists').then(res => {
					if (res.code === 200) {
						let list = res.data.list
						this.bannerList = list.map(item => {
							return {
								...item,
								img_url: this.$helper.commonSourcePath + item.img
							}
						})
						this.currentBannerImg = this
					}
				})
			},
			getHomeNoticeList () {
				this.$http.post('/index/home/getMsgLists').then(res => {
					if (res.code === 200) {
						this.noticeList = res.data.list
					}
				})
			},
			getHomeVideoList () {
				this.$http.post('/videos/videos/getHomeVideoLists').then(res => {
					uni.hideLoading()
					console.log(res.data.list)
					if (res.code === 200) {
						this.homeVideoList = res.data
					}
				})
			},
			handleNotice (e) {
				uni.showModal({
					title: this.noticeList[e].title,
					content: this.noticeList[e].content,
					showCancel: false,
					confirmText: 'Confirm'
				})
			},
			handleVideoDetail (id) {
				uni.navigateTo({ url: '/pages/video/index?id=' + id });
			},
			bannerChange (e) {
				this.currentBanner = e.detail.current
			}
		},
		onShow () {
			this.initHome()
		},
		onPageScroll (e) {
			this.showNavTop = e.scrollTop > 60
		}
	}
</script>

<style lang="less" scoped>
	.content {
		height: 100%;
	}
	.banner {
		position: relative;
		height: auto;
		background-color: #282832;
		.banner-background {
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: 0;
			z-index: 0;
			position: absolute;
			overflow: hidden;
			.bg-img {
				display: block;
				position: absolute;
				left: -5%;
				top: -5%;
				z-index: -1;
				width: 110%;
				height: 110%;
				background-size: cover;
				background-repeat: no-repeat;
				background-position-y: 50%;
				filter: blur(60px);
				transition: .5s 0s all ease-out;
			}
			.bg-color {
				display: block;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, .2);
			}
		}
		.banner-swiper {
			padding-top: 182rpx;
			.swiper-view {
				width: 100%;
				height: 12rem;
				padding: 30rpx;
				box-sizing: border-box;
				.swiper-view--item {
					width: 100%;
					height: 100%;
					.item-img {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
					}
				}
			}
		}
	}
	.notice-view {
		margin-top: 20rpx;
		padding: 20rpx;
	}
	.video-view {
		margin-top: 10rpx;
		.video-view--item {
			.item-head {
				display: flex;
				justify-content: space-between;
				padding: 10rpx 30rpx;
				.head-title {
					.text {
						color: #111;
						font-weight: bold;
						margin-left: 10rpx;
					}
				}
				.head-num {
					display: flex;
					align-items: center;
					.text {
						color: #a1a5a5;
						.num {
							color: #4eacee;
							margin-left: 10rpx;
						}
					}
				}
			}
			.item-content {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 30rpx;
				.video-list-item {
					width: 220rpx;
					margin-bottom: 20rpx;
					.video-thumb {
						position: relative;
						display: block;
						padding-top: 145%;
						background: #ebebeb;
						background-position: 50% 50%;
						background-size: cover;
						border-radius: 14rpx 14rpx 0 0;
						overflow: hidden;
						.video-thumb--tag {
							display: inline-block;
							text-overflow: ellipsis;
							white-space: nowrap;
							position: absolute;
							font-size: 12px;
							color: #fff;
							top: 8rpx;
							left: 8rpx;
							.tag {
								display: inline-block;
								text-align: center;
								width: auto;
								height: 36rpx;
								line-height: 36rpx;
								padding: 0 8rpx;
								border-radius: 4px;
								&.tag-year {
									background: #1890ff;
								}
							}
						}
					}
					.video-title {
						width: 100%;
						overflow: hidden;
						font-size: 24rpx;
						margin: 10rpx 0;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						display: -webkit-box;
						padding: 0 10rpx;
					}
				}
			}
		}
	}
</style>
