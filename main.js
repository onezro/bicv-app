import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import * as Pinia from 'pinia';
import uviewPlus,{setConfig} from '@/uni_modules/uview-plus'
import './permission'
// import { checkPermi } from './utils/permission'

setConfig({
	// 修改$u.config对象的属性
	config: {
		// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
		unit: 'rpx'
	},
})

export function createApp() {
	const app = createSSRApp(App)
	// app.config.globalProperties.$checkPermi=checkPermi
	app.use(Pinia.createPinia());
	app.use(uviewPlus)

	return {
		app,
		Pinia
	}
}
// #endif