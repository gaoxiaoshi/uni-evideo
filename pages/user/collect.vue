<template>
	<view class="history-view">
		<block v-if="likeList.length > 0">
			<navigator :url="`/pages/video/index?id=${row.vod_id}`" class="guess-list" v-for="row in likeList" :key="row.vid">
				<u-image width="276rpx" height="164rpx" border-radius="10" mode="aspectFill" :src="$helper.videoSourcePath + row.vod_pic">
					<u-loading slot="loading"></u-loading>
				</u-image>
				<view class="guess-content">
					<view class="title">{{row.vod_name}}</view>
					<view class="year">
						<u-button
							size="mini"
							type="primary"
							@click.stop="removeLike(row.vod_id)">
							remove
						</u-button>
					</view>
				</view>
			</navigator>
		</block>
		<block v-else>
			<no-data text="no collect data"></no-data>
		</block>
	</view>
</template>

<script>
	import noData from '@/components/no-data/index.vue'
	export default {
		data() {
			return {
				likeList: []
			}
		},
		components: {
			noData
		},
		onShow() {
			this.init()
		},
		methods: {
			init () {
				uni.showLoading({
					title: this.$t('loading')
				})
				this.$http.post('/videos/videos/getUserLikeList').then(res => {
					uni.hideLoading()
					if (res.code === 200) {
						this.likeList = res.data
					}
				})
			},
			removeLike (id) {
				this.$http.post('/videos/videos/addLike', {id: id}).then(res => {
					if (res.code === 200) {
						this.init()
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.history-view {
		min-height: 100vh;
		padding: 30rpx;
		background-color: #f5f5f5;
	}
	.guess-list {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
		.guess-content {
			flex: 1;
			margin-left: 20rpx;
			.title {
				color: #111;
				overflow: hidden;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				display: -webkit-box;
			}
			.year {
				margin-top: 20rpx;
				text-align: right;
			}
		}
	}
</style>
