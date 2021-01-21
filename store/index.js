import Vue from 'vue'
import Vuex from 'vuex'
import getters from '@/store/getters'
import tabbar from '@/store/modules/tabbar'

Vue.use(Vuex)

const store = new Vuex.Store({
	strict: true,
	modules: {
		tabbar
	},
	getters
})

export default store
