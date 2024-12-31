import
config
from '@/config.js'
import {
	getToken
} from '@/utils/auth'
let timeout = 30000
const request = (options) => {
	const isToken = (config.headers || {}).isToken === false
	options.header = config.header || {}
	if (getToken() && !isToken) {
		options.header['Authorization'] = getToken()
	}
	// console.log(getToken());
	return new Promise((resolve, reject) => {
		uni.showLoading({
			mask: true,
			title: '加载中~',
		})
		// 封装主体：网络请求
		uni.request({
			url: config.baseUrl + options.url,
			data: options.data || {},
			timeout: timeout,
			// 默认值GET，如果有需要改动，在options中设定其他的method值
			method: options.method || 'GET',
			header: options.header,
			// success: (res) => {
			// 	// console.log(res);
			// 	uni.hideLoading()
			// 	// 控制台显示数据信息
			// 	resolve(res.data)
			// },
			// fail: (err) => {
			// 	// 页面中弹框显示失败
			// 	uni.hideLoading()
			// 	uni.showToast({
			// 		title: '请求接口失败'
			// 	})
			// 	// 返回错误消息
			// 	reject(err)
			// },
			// catch: (e) => {
			// 	console.log(e);
			// }
		}).then(res => {
			uni.hideLoading()
			const code = res.data.code || 200
			const msg = res.data.msg || ''
			// console.log(res.data);
			if (code == 100300) {
				resolve(res.data)
			}else if (code === 404){
				uni.showToast({
					title: msg,
					icon: 'none'
				})
				uni.reLaunch('/pages/login/index')
			}
			 else if (code === 100500) {
				uni.showToast({
					title: msg,
					icon: 'none'
				})
				reject('500')
			}else{
				resolve(res.data)
			}

			
			// let [error, res] = response
		}).catch(error => {
			uni.hideLoading()
			uni.showToast({
				title: msg,
				icon: 'none'
			})
			console.log(error, 1);
		})
	})
}
export {
	request
}