const user = {
	state: {
		tabbarlist: [
			{
				iconPath: "/static/tabbar/home.png",
				selectedIconPath: "/static/tabbar/home-selected.png",
				text: 'Home',
				pagePath: "/pages/index/index"
			},
			{
				iconPath: "/static/tabbar/classify.png",
				selectedIconPath: "/static/tabbar/classify-selected.png",
				text: 'Classify',
				pagePath: "/pages/classify/index"
			},
			{
				iconPath: "/static/tabbar/search.png",
				selectedIconPath: "/static/tabbar/search-selected.png",
				text: 'Search',
				pagePath: "/pages/search/index"
			},
			{
				iconPath: "/static/tabbar/user.png",
				selectedIconPath: "/static/tabbar/user-selected.png",
				text: 'Me',
				pagePath: "/pages/user/index"
			}
		]
	},
	mutations: {
		/* SET_USERINFO: (state, userInfo) => {
			state.userInfo = userInfo
		} */
	},
	actions: {
		// 获取用户信息
		/* GetUserInfo ({ commit, state, dispatch }) {
			console.log(state.userInfo)
		} */
	}
}
export default user