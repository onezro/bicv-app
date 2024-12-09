import
config
from '@/config.js'
import {
	getToken
} from '@/utils/auth'
let timeout = 1000*60
const request = (options) => {
	const isToken = (config.headers || {}).isToken === false
	options.header = config.header || {}
	if (getToken() && !isToken) {
		options.header['Authorization'] = getToken()
	}
	// if (options.params) {
	//   let url = options.url + '?' + tansParams(options.params)
	//   url = url.slice(0, -1)
	//   config.url = url
	// }
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
		if(res.statusCode===200){
			// console.log( res.data);
			const msg = res.data.msg
			if (res.data.success==true) {
				resolve(res.data)
			} else {
				// console.log(res.data);
				uni.showToast({
					title: msg,
					icon: 'none',
					duration: 3000
				})
				reject('500')
			}
		}else{
			uni.showToast({
				title: res.data.Message,
				icon: 'none',
				duration: 3000
			})
		}

		}).catch(error => {
			uni.hideLoading()
			console.log(error, 1);
		})
	})
}
export {
	request
}