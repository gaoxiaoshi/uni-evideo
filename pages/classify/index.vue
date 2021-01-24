<template>
	<view class="classify-view">
		<view class="wrap">
			<u-sticky>
				<u-tabs-swiper
					ref="tabs"
					:list="list"
					:current="current"
					height="98"
					gutter="50"
					activeColor="#4eacee"
					@change="change">
				</u-tabs-swiper>
			</u-sticky>
			<swiper class="swiper-box" :current="current" @change="swiperChange">
				<swiper-item class="swiper-item" v-for="item in list" :key="item.type_id">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="scroll-page">
							<view class="video-view">
								<view
									class="video-list-item"
									v-for="(video, vindex) in dataList"
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
							<u-loadmore :status="loadStatus" :icon-type="loadIcon" :load-text="loadText"></u-loadmore>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<u-tabbar
			:list="tabbarlist"
			active-color="#4eacee"
			inactive-color="#74767b">
		</u-tabbar>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				list: [],
				dataList: [],
				current: 0,
				loadStatus: 'loadmore',
				loadIcon: 'flower',
				loadText: {
					loadmore: this.$t('loadText.loadmore'),
					loading: this.$t('loadText.loading'),
					nomore: this.$t('loadText.nomore')
				},
				page: 1,
				limit: 9,
				more: true
			}
		},
		computed: {
			...mapGetters([
				'tabbarlist'
			])
		},
		onLoad() {
			this.getVideosType()
		},
		methods: {
			getVideosType (id) {
				// let list = uni.getStorageSync('videosType') ? uni.getStorageSync('videosType') : [];
				let list = []
				if (list.length === 0) {
					this.$http.post('/videos/videos/getVideoTypeLists').then(res => {
						if (res.code === 200) {
							this.list = res.data.map(item => {
								return {
									...item,
									name: this.$t(`classilfy.${item.type_en}`)
								}
							})
							uni.setStorageSync('videosType', this.list)
							this.getDateList(true)
						}
					})
				} else {
					this.list = list
					this.getDateList(true)
				}
			},
			getDateList(init = false) {
				if (init) {
					this.page = 1
					this.more = true
				}
				let params = {
					type_id: this.list[this.current].type_id,
					page: this.page,
					limit: this.limit
				}
				/* uni.showLoading({
					title: this.$t('loading'),
					mask: true,
				}) */
				this.loadStatus = 'loading'
				this.$http.post('/videos/videos/getVideoLists', params).then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						if (res.data.page * res.data.limit >= res.data.count) {
							this.more = false
							this.loadStatus = 'nomore'
						} else {
							this.loadStatus = 'loadmore'
						}
						if (init) {
							this.dataList = res.data.list
						} else {
							this.dataList = this.dataList.concat(res.data.list)
						}
					}
				})
			},
			handleVideoDetail (id) {
				uni.navigateTo({ url: '/pages/video/index?id=' + id });
			},
			reachBottom () {
				console.log(this.more)
				if (!this.more) {
					return
				}
				this.page = this.page + 1
				this.getDateList()
			},
			// tab栏切换
			change(index) {
				console.log('当前分类索引：', this.current)
				this.current = index
				this.getDateList(true)
			},
			swiperChange({ detail: { current } }) {
				this.current = current
				this.getDateList(true)
			}
		}
	}
</script>

<style lang="less">
.wrap {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
}
.swiper-box {
	flex: 1;
	background-color: #f5f5f5;
}
.scroll-page {
	padding-bottom: 100rpx;
}
.swiper-item {
	height: 100%;
}
.video-view {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	padding: 30rpx;
	.video-list-item {
		width: 220rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		border-radius: 0 0 14rpx 14rpx;
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
</style>
