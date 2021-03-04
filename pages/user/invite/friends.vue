<template>
	<view class="friend-view">
		<u-cell-group class="friend-list" title="My Friends" :border="false">
			<u-cell-item
				:title="item.username"
				:value="item.ctime"
				:arrow="false"
				bg-color="#1c1c1e"
				:title-style="{
					color: '#fefefe',
					marginLeft: '10rpx'
				}"
				:value-style="{
					color: '#98989e'
				}"
				hover-class="none"
				v-for="(item, index) in dataList"
				:key="index">
				<u-avatar slot="icon" size="60" :src="$helper.commonSourcePath +item.avatar"></u-avatar>
			</u-cell-item>
		</u-cell-group>
		<u-loadmore :status="loadStatus" :icon-type="loadIcon" :load-text="loadText"></u-loadmore>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				page: 1,
				limit: 10,
				more: false,
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
				this.$http.post('/api.php/index/config/getConfig').then(res => {
					uni.stopPullDownRefresh()
					uni.setStorageSync('sys_config', res.data)
					uni.setStorageSync('userInfo', res.data.userinfo)
					this.userInfo = res.data.userinfo
					this.getList(true)
				})
			},
			getList(init) {
				if (init) {
					this.page = 1
					this.more = true
				}
				let params = {
					page: this.page,
					limit: this.limit
				}
				this.loadStatus = 'loading'
				this.$http.post('/api.php/user/user/getMyFriends', params).then(res => {
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
	.friend-view {
		width: 100%;
		min-height: calc(100vh - var(--window-top));
		background-color: #26293f;
		.friend-list {
			margin-bottom: 20rpx;
		}
	}
</style>
