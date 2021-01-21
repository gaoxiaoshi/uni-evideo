import http from './interface'
import helper from '../helper'

function _getTimeStamp() {
	return new Date().getTime()/1000;
}

export const post = (url,data) => {
	let timestamp = _getTimeStamp();
	let token = uni.getStorageSync('token');

	//设置请求前拦截器
	http.interceptor.request = (config) => {
		config.header = {
			'secret': helper.websiteSecret,
			'token': token,
			'timestamp': timestamp
		}
		config.method = 'POST';
	}

	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
		if (response.data.code === 40003) {
			uni.showModal({
				title: 'Warning',
				content: response.data.msg || "fail",
				cancelText: 'Cancel',
				confirmText: 'Recharge',
				success(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/user/recharge'
						})
					}
				}
			})
		} else if (response.data.code === 40004) {
			uni.setStorageSync('userInfo', null);
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else if (response.data.code !== 200) {
			uni.showToast({
				title: response.data.msg || "fail",
				icon: 'none'
			})
		} else {
			return response;
		}
	}
	return http.request({
			url: url,
			data
	})
}

export const get = (url,data) => {
	let timestamp = _getTimeStamp();
	let token = uni.getStorageSync('token');

	//设置请求前拦截器
	http.interceptor.request = (config) => {
		config.header = {
			'secret': helper.websiteSecret,
			'token': token,
			'timestamp': timestamp
		}
		config.method = 'GET';
	}

	/**
	 * 错误统一管理
	 * 40003：余额不足
	 * 40004：未登录Token无效
	 * 40005：通用错误码，全局提示
	 */
	http.interceptor.response = (response) => {
		console.log('状态码：', response.data.code)
		if (response.data.code === 40003) {
			uni.showModal({
				title: 'Warning',
				content: response.data.msg || "fail",
				cancelText: 'Cancel',
				confirmText: 'Recharge',
				success(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/user/recharge'
						})
					}
				}
			})
		} else if (response.data.code === 40004) {
			uni.setStorageSync('userInfo', null);
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else if (response.data.code !== 200) {
			uni.showToast({
				title: response.data.msg || "fail",
				icon: 'none'
			})
		} else {
			return response;
		}
	}

	return http.request({
		url: url,
		data
	})
}

export default {
	post,
	get
}