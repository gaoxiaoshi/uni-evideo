<template>
	<view class="user-center" style="padding-bottom: 100rpx;">
		<view class="user-center--header" v-if="!userInfo">
			<image class="header-avatar" src="../../static/avatar.png" mode="aspectFit"></image>
			<navigator url="/pages/login/index" class="header-name" >Sign In</navigator>
		</view>
		<view class="user-center--header" v-else>
			<u-image class="header-avatar" width="150rpx" height="150rpx" border-radius="75rpx" :src="userInfo.avatar ? $helper.commonSourcePath + userInfo.avatar : '../../static/avatar.png'" mode="aspectFit"></u-image>
			<view class="header-name">{{userInfo.username}}</view>
		</view>
		<view class="user-center--member" v-if="userInfo">
			<view class="member-info">
				<view class="value score">{{ userInfo.money || 0 }}</view>
				<view class="label">My Coin</view>
			</view>
			<view class="member-info">
				<view class="value">{{userInfo.group_name}}</view>
				<text class="label" v-if="userInfo.expire_time != -1">{{userInfo.expire_time}}</text>
			</view>
		</view>
		<view class="user-center--panel">
			<u-cell-group>
				<u-cell-item title="Recommend" value="Earn Coin">
					<u-icon class="micon" slot="icon" name="tuijian" custom-prefix="custom-icon" size="34" color="#ddaf5a"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="user-center--panel">
			<u-cell-group>
				<u-cell-item title="Account" @click="checkWhiteList('account')">
					<u-icon class="micon" slot="icon" name="info" custom-prefix="custom-icon" size="34" color="#ff5f00"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="user-center--panel">
			<u-cell-group>
				<u-cell-item title="Collect" @click="checkWhiteList('collect')">
					<u-icon class="micon" slot="icon" name="collect" custom-prefix="custom-icon" size="34" color="#50a9fc"></u-icon>
				</u-cell-item>
				<u-cell-item title="History" @click="checkWhiteList('history')">
					<u-icon class="micon" slot="icon" name="record" custom-prefix="custom-icon" size="34" color="#50a9fc"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="user-center--panel">
			<u-cell-group>
				<u-cell-item title="Purchase Membership" @click="checkWhiteList('vip')">
					<u-icon class="micon" slot="icon" name="vip" custom-prefix="custom-icon" size="34" color="#ddaf5a"></u-icon>
				</u-cell-item>
				<u-cell-item title="Recharge" @click="checkWhiteList('recharge')">
					<u-icon class="micon" slot="icon" name="charge" custom-prefix="custom-icon" size="34" color="#2dbd8c"></u-icon>
				</u-cell-item>
				<u-cell-item title="Recharge Record" @click="checkWhiteList('rechargeRecord')">
					<u-icon class="micon" slot="icon" name="booking" custom-prefix="custom-icon" size="34" color="#2dbd8c"></u-icon>
				</u-cell-item>
				<u-cell-item title="Consume Record" @click="checkWhiteList('consumeRecord')">
					<u-icon class="micon" slot="icon" name="record" custom-prefix="custom-icon" size="34" color="#2dbd8c"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="user-center--panel">
			<u-cell-group>
				<u-cell-item title="Contact Us" @click="checkWhiteList('contact')">
					<u-icon class="micon" slot="icon" name="contact" custom-prefix="custom-icon" size="34" color="#ff6464"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="user-center--panel" style="padding: 30rpx;" v-if="userInfo">
			<u-button type="primary" @click="logout">Logout</u-button>
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
	export default {
		data() {
			return {
				login: false,
				userInfo: null,
				whiteList: ['history', 'contact']
			}
		},
		computed: {
			...mapGetters([
				'tabbarlist'
			])
		},
		onShow() {
			this.init()
		},
		onPullDownRefresh () {
			this.init()
		},
		methods: {
			init() {
				this.$http.post('/index/config/getConfig').then( res => {
					uni.stopPullDownRefresh()
					uni.setStorageSync('sys_config', res.data)
					uni.setStorageSync('userInfo', res.data.userinfo)
					this.userInfo = res.data.userinfo
				})
			},
			checkWhiteList (path) {
				let index = this.whiteList.findIndex(item => item === path)
				if (index > -1) {
					this.handleCellClick(path)
				} else {
					if (this.userInfo) {
						this.handleCellClick(path)
					} else {
						uni.showModal({
							title: 'Message',
							content: 'Please sign in first!',
							cancelText: 'Cancel',
							confirmText: 'Confirm',
							success(e) {
								if (e.confirm) {
									uni.navigateTo({
										url: '/pages/login/index'
									})
								}
							}
						})
					}
				}
			},
			handleCellClick(path) {
				switch (path) {
					case 'account':
						uni.navigateTo({
							url: '/pages/user/account/index'
						});
						break;
					case 'history':
						uni.navigateTo({
							url: '/pages/user/history'
						});
						break;
					case 'collect':
						uni.navigateTo({
							url: '/pages/user/collect'
						});
						break;
					case 'vip':
						uni.navigateTo({
							url: '/pages/user/vip'
						});
						break;
					case 'recharge':
						uni.navigateTo({
							url: '/pages/user/recharge'
						});
						break;
					case 'rechargeRecord':
						uni.navigateTo({
							url: '/pages/user/recharge-record'
						});
						break;
					case 'consumeRecord':
						uni.navigateTo({
							url: '/pages/user/consume-record'
						});
						break;
					case 'contact':
						uni.navigateTo({
							url: '/pages/user/contact'
						});
						break;
				}
			},
			logout() {
				this.$http.post('/user/auth/logout').then(res => {
					uni.showToast({title: res.msg, icon: 'none'})
					if (res.code == 200) {
						this.userInfo = null
						uni.setStorageSync('userInfo', null)
						uni.switchTab({
							url: '/pages/user/index'
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
.user-center {
	background-color: #f5f5f5;
	min-height: 100vh;
	.user-center--header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 310rpx;
		padding-top: var(--status-bar-height);
		background-image: linear-gradient( 40deg, #76d8f7 0%, #ce98f8 100%);
		.header-avatar {
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
		}
		.header-name {
			color: #333;
			font-size: 40rpx;
			margin-top: 18rpx;
		}
	}
	.user-center--member {
		padding: 30rpx 0;
		background: #fff;
		overflow: hidden;
		.member-info {
			float: left;
			width: 50%;
			line-height: 36rpx;
			text-align: center;
			border-right: 1px solid #f1f1f1;
			box-sizing: border-box;
			.score {
				color: #ff6464;
			}
			.label {
				color: #999;
				font-size: 26rpx;
			}
		}
	}
	.user-center--panel {
		margin-top: 20rpx;
	}
}
.micon {
	margin-right: 8rpx;
}
</style>
