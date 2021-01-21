<template>
	<view class="history-view">
		<block v-if="historyList.length > 0">
			<navigator :url="`/pages/video/index?id=${row.vod_id}`" class="guess-list" v-for="row in historyList" :key="row.vid">
				<u-image width="276rpx" height="164rpx" border-radius="10" mode="aspectFill" :src="$helper.videoSourcePath + row.vod_pic">
					<u-loading slot="loading"></u-loading>
				</u-image>
				<view class="guess-content">
					<view class="title">{{row.title}}</view>
					<view class="year">{{$t(`classilfy.${row.type_en}`)}}</view>
				</view>
			</navigator>
		</block>
		<block v-else>
			<no-data text="no history data"></no-data>
		</block>
	</view>
</template>

<script>
	import noData from '@/components/no-data/index.vue'
	export default {
		data() {
			return {
				historyList: []
			}
		},
		components: {
			noData
		},
		onShow() {
			this.historyList = uni.getStorageSync('historyList')
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
				display: inline-block;
				text-align: center;
				width: auto;
				height: 36rpx;
				height: 36rpx;
				padding: 0 16rpx;
				border-radius: 36rpx;
				font-size: 12px;
				color: #666;
				margin-top: 10rpx;
				background: #ebebeb;
			}
		}
	}
</style>
