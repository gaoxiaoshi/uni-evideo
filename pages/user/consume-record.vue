<template>
	<view class="record-view">
		<u-sticky>
			<view class="record-view--header">
				<view class="text">YOU BALANCE</view>
				<view class="value">{{userInfo && userInfo['money'] || 0}}</view>
			</view>
			<u-tabs
				:list="tabs"
				:is-scroll="false"
				:current="current"
				active-color="#76d8f7"
				@change="handleTabChange">
				</u-tabs>
		</u-sticky>
		<view class="record-view--content">
			<view class="record-list">
				<view class="record-list--item" v-for="(item, index) in dataList" :key="index" @click="handleLink(item)">
					<view class="item-line">
						<view class="type">{{item.type === 1 ? 'Member' : 'Video'}}</view>
						<view class="time">{{item.mtime}}</view>
					</view>
					<view class="item-line">
						<view class="content">{{item.content}}</view>
						<view class="money">-{{item.money}}</view>
					</view>
				</view>
			</view>
			<u-loadmore :status="loadStatus" :icon-type="loadIcon" :load-text="loadText"></u-loadmore>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				userInfo: null,
				page: 1,
				limit: 10,
				more: false,
				tabs: [
					{
						type: '',
						name: 'All'
					},
					{
						type: '1',
						name: 'Member'
					},
					{
						type: '2',
						name: 'Video'
					}
				],
				dataList: [],
				loadText: {
					loadmore: this.$t('loadText.loadmore'),
					loading: this.$t('loadText.loading'),
					nomore: this.$t('loadText.nomore')
				},
				loadStatus: 'loadmore',
				loadIcon: 'flower'
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				uni.showLoading({
					title: this.$t('loading')
				})
				this.$http.post('/index/config/getConfig').then(res => {
					uni.stopPullDownRefresh()
					uni.setStorageSync('sys_config', res.data)
					uni.setStorageSync('userInfo', res.data.userinfo)
					this.userInfo = res.data.userinfo
					this.getList(true)
				})
			},
			handleTabChange(e) {
				this.current = e
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
				this.getList(true)
			},
			handleLink (item) {
				if (item.type == 2) {
					uni.navigateTo({
						url: '/pages/video/index?id=' + item.gid
					})
				}
			},
			getList(init) {
				if (init) {
					this.page = 1
					this.more = true
				}
				let params = {
					type: this.tabs[this.current].type,
					page: this.page,
					limit: this.limit
				}
				this.loadStatus = 'loading'
				this.$http.post('/finance/consume/getConsumeList', params).then(res => {
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
				}).catch(() => {
					uni.hideLoading()
				})
			}
		},
		onPullDownRefresh () {
			this.init()
		},
		onReachBottom(){  //上拉触底函数
			if (!this.more) {
				return
			}
			this.page = this.page + 1
			this.getList()
		}
	}
</script>

<style lang="scss" scoped>
.record-view {
	min-height: 100vh;
	background-color: #f5f5f5;
	.record-view--header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 200rpx;
		color: #fff;
		background-image: linear-gradient( 40deg, #76d8f7 0%, #ce98f8 100%);
		.text {
			opacity: 0.6;
			font-weight: bold;
			font-size: 22rpx;
		}
		.value {
			margin-top: 4rpx;
			font-size: 48rpx;
		}
	}
	.record-view--content {
		.record-list {
			padding: 30rpx;
			.record-list--item {
				padding: 30rpx;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
				background-color: #fff;
				.item-line {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;
					&:last-child {
						margin-bottom: 0;
					}
				}
				.type {
					color: #202020;
					font-size: 28rpx;
				}
				.time {
					color: #b2b5b5;
					font-size: 24rpx;
					margin-top: 10rpx;
				}
				.content {
					color: #767878;
					font-size: 24rpx;
					max-width: 340rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.money {
					font-size: 30rpx;
					color: #e1b66e;
				}
			}
		}
	}
}
</style>
