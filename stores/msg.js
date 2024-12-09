import {
	defineStore
} from 'pinia'
import {
	ref,
	watch,
	computed
} from 'vue'
import {
	timestampToTime
} from '@/utils/dateFormat.js'
import {
	initPushMsg
} from '@/utils/push.js'

const msgMEStore = defineStore('msg', () => {
	const userId = ref('0004748000000fba')
	const socket = ref(null)
	const msgData = ref([])
	const unRead = ref(0)
	const linkMsg = ref('')
	const timer=ref(null)

	watch(() => unRead.value, (newValue, oldValue) => {
		if (newValue > 0) {
			// console.log(unRead.value);
			uni.setTabBarBadge({
				index: 1,
				text: `${unRead.value}`
			})
			plus.runtime.setBadgeNumber(unRead.value)
		} else {
			uni.removeTabBarBadge({
				index: 1
			});
			plus.runtime.setBadgeNumber(0)
			plus.runtime.setBadgeNumber(-1)
		}

	})
	//初始化
	const initSocket = () => {
		if (socket.value) {
			console.log('关闭');
			socket.value.close()
		}
		socket.value = uni.connectSocket({
			url: `ws://192.168.14.5:9002/messageChange?userId=${userId.value}`,
			success: function() {
				linkMsg.value = '连接初始化'
				console.log('WebSocket连接已配置！');
			}
		})
		socket.value.onOpen(() => {
			clearInterval(timer.value)
			linkMsg.value = '连接成功！'
			timer.value=setInterval(()=>{
				// initPushMsg('消息通知', '心跳')
				sendData('1111')
			},30000)
			console.log('WebSocket连接已打开！');
		})
		
		socket.value.onMessage((res) => {
			const data = JSON.parse(res.data)
			if (data.code == 100200) {
				const content = JSON.parse(data.content)
				if (content.length > msgData.value.length && msgData.value.length !== 0) {
					const oldIds = msgData.value.map(item => item.ID)
					const result = content.filter(item => !oldIds.includes(item.ID))

					result.forEach(v => {
						initPushMsg(v.MsgTitle, v.MsgContent)
					})
				}
				// initPushMsg('消息通知', '有数据更新')
				// console.log(content);
				upData(content)
			}
			// console.log('收到消息', res);
		})

		socket.value.onError((res) => {
			linkMsg.value = '连接出错！'
			// console.log('链接出错');
			// initPushMsg('消息通知', linkMsg.value)
			reconnect()

		})
		// socket.value.onClose(() => {
		// 	linkMsg.value = '连接关闭！'
		// 	initPushMsg('连接', linkMsg.value)
		// 	// reconnect()
		// })
	}
	const upData = (data) => {
		unRead.value = 0
		const data1 = data.map(m => {
			if (m.Status === 0) {
				unRead.value = unRead.value + 1
			}
			// initPushMsg(m.MsgTitle,m.MsgContent)
			return {
				...m,
				CreationDate: timestampToTime(m.CreationDate)
			}
		})
		data1.sort((a, b) => {
			let aTime = new Date(a.CreationDate);
			let bTime = new Date(b.CreationDate);
			return bTime - aTime;
		});

		msgData.value = data1
	}

	const sendData = (msg) => {
		uni.sendSocketMessage({
			data: JSON.stringify(msg),
			success: () => {
				console.log('发送成功');
			},
			fail: () => {
				console.log('发送失败');
			}
		});
	}


	const reconnect = () => {
		console.log("开始断线重连！！！！！！！！！！！");
		// 确保已经关闭后再重新打开
		uni.closeSocket()

		console.log("重新连接中...");
		// console.log(url + token);
		initSocket()
	}
	const closeSocket = () => {
		initPushMsg('通信','通信关闭')
		clearInterval(timer.value)
		uni.closeSocket({
			success: () => {
				console.info("退出成功")
			},
		})
	}
	//


	return {
		msgData,
		unRead,
		linkMsg,
		initSocket,
		sendData,
		closeSocket
	}
})
export default msgMEStore;