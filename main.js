import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);

// 引入语言包，注意路径
import en from '@/common/locales/en.js';
// import gu from '@/common/locales/en.js';

// 引入并使用vue-i18n
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

// 构造i18n对象
const i18n = new VueI18n({
	locale: 'en',
	messages: {
		'en': en
	}
})

// 引入全局缓存
import store from './store'

// 引入Api请求
import requestApi from '@/common/vmeitime-http'
Vue.prototype.$http = requestApi

// 引入配置
import helper from '@/common/helper'
Vue.prototype.$helper = helper


App.mpType = 'app'

const app = new Vue({
    ...App,
		store,
		i18n
})
app.$mount()
