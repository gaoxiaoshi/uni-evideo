<template>
	<view class="content">
		
		<view class="search-box">
			<mSearch
				class="mSearch-input-box"
				:mode="2"
				button="outside"
				:placeholder="defaultKeyword"
				@search="doSearch(false)"
				@clear="handleClear"
				v-model="keyword">
			</mSearch>
		</view>
		
		<view class="search-keyword" >
			<scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
				<block v-for="(row,index) in keywordList" :key="index">
					<navigator :url="`/pages/video/index?id=${row.vod_id}`" class="guess-list">
						<u-image width="276rpx" height="164rpx" border-radius="10" mode="aspectFill" :src="$helper.videoSourcePath + row.vod_pic">
							<u-loading slot="loading"></u-loading>
						</u-image>
						<view class="guess-content">
							<view class="title">
								<rich-text :nodes="row.htmlStr"></rich-text>
							</view>
							<view class="year">{{row.vod_year}}</view>
						</view>
					</navigator>
				</block>
				
			</scroll-view>
			<scroll-view class="keyword-box" v-show="!isShowKeywordList" scroll-y>
				<view class="keyword-block" v-if="oldKeywordList.length>0">
					<view class="keyword-list-header">
						<view>历史搜索</view>
						<view>
							<image @tap="oldDelete" src="/static/HM-search/delete.png"></image>
						</view>
					</view>
					<view class="keyword">
						<view v-for="(keyword,index) in oldKeywordList" @tap="doSearch(keyword)" :key="index">{{keyword}}</view>
					</view>
				</view>
				<view class="keyword-block">
					<view class="keyword-list-header">
						<view>HOT VIDEO</view>
						<view>
							<image @tap="hotToggle" :src="'/static/HM-search/attention'+forbid+'.png'"></image>
						</view>
					</view>
					<view class="keyword" v-if="forbid==''">
						<view v-for="(keyword,index) in hotKeywordList" @tap="doSearch(keyword.vod_name)" :key="index">{{keyword.vod_name}}</view>
					</view>
					<view class="hide-hot-tis" v-else>
						<view>Current hot video is hidden</view>
					</view>
				</view>
			</scroll-view>
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
	//引用mSearch组件，如不需要删除即可
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';

	export default {
		data() {
			return {
				defaultKeyword: "",
				keyword: "",
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				forbid: '',
				isShowKeywordList: false
			}
		},
		computed: {
			...mapGetters([
				'tabbarlist'
			]),
			lang() {
				return this.$t('tabbar')
			}
		},
		components: {
			//引用mSearch组件，如不需要删除即可
			mSearch
		},
		onLoad() {
			this.init();
			uni.setNavigationBarTitle({
				title: 'Search'
			})
		},
		onHide() {
			this.keyword = ''
		},
		methods: {
			init() {
				this.loadDefaultKeyword();
				this.loadOldKeyword();
				this.loadHotKeyword();
			},
			blur(){
				uni.hideKeyboard()
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
				this.defaultKeyword = "Search Key";
			},
			//加载历史搜索,自动读取本地Storage
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
			},
			//加载热门搜索
			loadHotKeyword() {
				//定义热门搜索关键字，可以自己实现ajax请求数据再赋值
				this.$http.post('/videos/videos/hotKeyWords').then((res)=>{
					if(res.data.list.length > 0){
						this.hotKeywordList = res.data.list;
					}
				})
			}, 
			//高亮关键字
			drawCorrelativeKeyword(keywords, keyword) {
				var len = keywords.length, keywordArr = [];
				for (var i = 0; i < len; i++) {
					var row = keywords[i];
					//定义高亮#9f9f9f
					var html = row.vod_name.replace(keyword, "<span style='color: #f97900;'>" + keyword + "</span>");
					var tmpObj = {
						...row,
						keyword: row.vod_name,
						htmlStr: html
					};
					keywordArr.push(tmpObj)
				}
				return keywordArr;
			},
			//顶置关键字
			setKeyword(index) {
				this.keyword = this.keywordList[index].keyword;
			},
			//清除历史搜索
			oldDelete() {
				uni.showModal({
					title: 'Message',
					content: 'Are You Sure?',
					cancelText: 'Cancel',
					confirmText: 'Confirm',
					success: (res) => {
						if (res.confirm) {
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//热门搜索开关
			hotToggle() {
				this.forbid = this.forbid ? '' : '_forbid';
			},
			//执行搜索
			doSearch(key) {
				key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
				if (!key) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				this.isShowKeywordList = true;
				this.keyword = key
				this.saveKeyword(key);
				uni.showLoading({
					title: this.$t('loading')
				})
				this.$http.post('/videos/videos/searchKeywords',{keyword: key}).then((res)=>{
					uni.hideLoading()
					if(res.data.length > 0){
						this.keywordList = this.drawCorrelativeKeyword(res.data, key);
					}
				})
			},
			handleClear() {
				this.keywordList = []
				this.isShowKeywordList = false;
			},
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
			}
		}
	}
</script>

<style lang="less">
.search-box {
	background-color: rgb(242,242,242);
	padding: 30rpx 20rpx;
	display: flex;
	justify-content: space-between;
	position: sticky;
	top: 0;
	z-index: 999;
	.mSearch-input-box{
		width: 100%;
	}
	.input-box {
		width:85%;
		flex-shrink:1;
		display:flex;
		justify-content:center;
		align-items:center;
	}
	.search-btn {
		width:15%;
		margin:0 0 0 2%;
		display:flex;
		justify-content:center;
		align-items:center;
		flex-shrink:0;
		font-size:28upx;
		color:#fff;
		background:linear-gradient(to right,#ff9801,#ff570a);
		border-radius:60upx;
		& > input {
			width:100%;
			height:60upx;
			font-size:28upx;
			border:0;
			border-radius:60upx;
			-webkit-appearance:none;
			-moz-appearance:none;
			appearance:none;
			padding:0 3%;
			margin:0;
			background-color:#ffffff;
		}
	}
}
.guess-list {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
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
			font-size: 12px;
			color: #878787;
			margin-top: 20rpx;
		}
	}
}
.placeholder-class {color:#9e9e9e;}
.search-keyword {width:100%;background-color:rgb(242,242,242);}
.keyword-list-box {
	height:calc(100vh - 110upx);
	padding: 30rpx;
	border-radius:20upx 20upx 0 0;
	background-color:#fff;
	box-sizing: border-box;
}
.keyword-entry-tap {background-color:#eee;}
.keyword-entry {width:100%;height:80upx;margin:0 3%;font-size:30upx;color:#333;display:flex;justify-content:space-between;align-items:center;border-bottom:solid 1upx #e7e7e7;}
.keyword-entry image {width:60upx;height:60upx;}
.keyword-entry .keyword-text,.keyword-entry .keyword-img {height:80upx;display:flex;align-items:center;}
.keyword-entry .keyword-text {width:90%;overflow: hidden;}
.keyword-entry .keyword-img {width:10%;justify-content:center;}
.keyword-box {height:calc(100vh - 110upx);border-radius:20upx 20upx 0 0;background-color:#fff;}
.keyword-box .keyword-block {padding:10upx 0;}
.keyword-box .keyword-block .keyword-list-header {width:100%;padding:10upx 3%;font-size:27upx;color:#333;display:flex;justify-content:space-between;}
.keyword-box .keyword-block .keyword-list-header image {width:40upx;height:40upx;}
.keyword-box .keyword-block .keyword {width:100%;padding:3px 3%;display:flex;flex-flow:wrap;justify-content:flex-start;}
.keyword-box .keyword-block .hide-hot-tis {display:flex;justify-content:center;font-size:28upx;color:#6b6b6b;}
.keyword-box .keyword-block .keyword > view {
	max-width: 500rpx;
	border-radius: 60upx;
	padding:0 20upx;
	margin:10upx 20upx 10upx 0;
	height:60upx;
	line-height: 60upx;
	font-size:28upx;
	background-color:rgb(242,242,242);
	color:#6b6b6b;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
