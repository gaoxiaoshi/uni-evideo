<template>
	<view class="custom-header" :class="{'nav_top': showNavTop}">
		<view class="header">
			<view class="head_a">
				<!-- <image class="head_logo" :src="`${$helper.commonSourcePath}${showNavTop ? globalConfig.logo_black : globalConfig.logo_white}`" mode="aspectFit"></image> -->
				<view class="head_menu">
					<view class="head_menu-item" @click="handleUserHistory"><u-icon name="histrory" custom-prefix="custom-icon" color="#fe9900" size="24px"></u-icon></view>
					<view class="head_menu-item" @click="handleUserCenter"><u-icon name="smile" custom-prefix="custom-icon" color="#fe9900" size="24px"></u-icon></view>
				</view>
			</view>
		</view>
		<view class="header">
			<view class="head_b">
				<view class="menu" @click="handleToClass"><u-icon name="list-dot" size="24px" color="#fe9900"></u-icon></view>
				<view class="search" @click="handleToSearch">
					<view class="search-content">
						<u-icon name="search" color="#aaa"></u-icon>
						<view class="search-text">Search</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			showNavTop: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			globalConfig() {
				return uni.getStorageSync('sys_config')
			}
		},
		methods: {
			handleToSearch () {
				uni.switchTab({
					url: '/pages/search/index'
				})
			},
			handleToClass () {
				uni.switchTab({
					url: '/pages/classify/index'
				})
			},
			handleUserHistory () {
				uni.navigateTo({
					url: '/pages/user/history'
				})
			},
			handleUserCenter () {
				uni.switchTab({
					url: '/pages/user/index'
				})
			}
		}
	}
</script>

<style lang="less">
	.custom-header {
		position: fixed;
		display: block;
		z-index: 999999995;
		width: 100%;
		top: 0;
		left: 0;
		right: 0;
		border: 0;
		transition: .3s 0s all ease-out;
		.header {
			position: relative;
			.head_a {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				height: 90rpx;
				padding: 0 30rpx;
				.head_logo {
					width: 195rpx;
					height: 52rpx;
				}
				.head_menu {
					display: flex;
					.head_menu-item {
						margin-left: 36rpx;
						color: #FFFFFF;
						&:first-child {
							margin-left: 0;
						}
					}
				}
			}
			.head_b {
				display: flex;
				align-items: center;
				height: 92rpx;
				.menu {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 92rpx;
					height: 100%;
					color: #fff;
				}
				.search {
					display: flex;
					align-items: center;
					flex: 1;
					padding-right: 30rpx;
					.search-content {
						display: flex;
						align-items: center;
						width: 100%;
						height: 66rpx;
						background: rgba(255, 255, 255, 0.1);
						border-radius: 66rpx;
						padding: 26rpx;
						.search-text {
							color: #aaa;
							margin-left: 26rpx;
						}
					}
				}
			}
		}
		&.nav_top {
			background: #fff;
			box-shadow: 0 2px 15px rgba(0, 0, 0, .1);
			.header {
				.head_a {
					.head_menu {
						.head_menu-item {
							color: #878787!important;
						}
					}
				}
				.head_b {
					.menu {
						color: #878787!important;
					}
					.search {
						.search-content {
							background: #f8f8f8;
						}
					}
				}
			}
		}
	}
</style>
