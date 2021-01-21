import printConnect from '@/common/print/index'

const bluetooth = {
	state: {
		// 全局打印机类
		printer: null,
		// 已绑定打印机参数
		printerOption: null,
		// 历史打印机列表
		historyPrinter: []
	},
	mutations: {
		INIT_PRINTER: (state, device) => {
			state.printer = new printConnect(device)
		},
		GET_PRINTER_OPTION: (state, device) => {
			state.printerOption = device
		},
		GET_HISTORY_PRINTER: (state, value) => {
			if (value instanceof Array) {
				state.historyPrinter = value
			} else {
				state.historyPrinter.push(value)
			}
		}
	},
	actions: {
		initPrinter({ commit }, device) {
			commit('INIT_PRINTER', device)
		},
		getPrinterOption({ commit }) {
			let device = uni.getStorageSync('printer') || null
			if (device) {
				commit('INIT_PRINTER', device)
			}
			commit('GET_PRINTER_OPTION', device)
		},
		getHistoryPrinter({ commit }, value) {
			commit('GET_HISTORY_PRINTER', value)
		}
	}
}
export default bluetooth