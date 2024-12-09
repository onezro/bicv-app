<script setup>
	import {
		onLaunch,
		onShow,
		onHide
	} from "@dcloudio/uni-app"
	import {
		ref,
		onMounted,
		onUnmounted
	} from "vue";
	import {
		getToken
	} from '@/utils/auth'
	import {
		initPushMsg
	} from '@/utils/push.js'
	import msgMEStore from "@/stores/msg.js"
	import {
		setPermissions
	} from "@/utils/getPhonePer.js"
	const msgStore = msgMEStore()
	const g_wakelock = ref(null)
	onLaunch(() => {
		if (!getToken()) {
			// msgStore.initSocket()
			uni.reLaunch('/pages/login/index')
		}
		// setPermissions()
	})
	onMounted(() => {

	})
	onShow(() => {
		// msgStore.initSocket()
	})
	onUnmounted(() => {
		msgStore.closeSocket()
	})
	onHide(() => {
		// wakeLock()
		// console.log(1111);
		// msgStore.initSocket()
		// plus.android.invoke('startForegroundService', {
		// 	action: 'ACTION_START_FOREGROUND_SERVICE',
		// 	id: 1,
		// 	title: '前台服务标题',
		// 	text: '前台服务正在运行'
		// });
	})
	const wakeLock = () => {
		var main = plus.android.runtimeMainActivity();
		var Context = plus.android.importClass("android.content.Context");
		var PowerManager = plus.android.importClass("android.os.PowerManager");
		var pm = main.getSystemService(Context.POWER_SERVICE);
		g_wakelock.value = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ANY_NAME");
		g_wakelock.value.acquire();
		// console.log(1111);
		setInterval(()=>{
			initPushMsg('消息通知', '进入后台')
		},60000)
	}
	const releaseWakeLock =()=>{
		if(g_wakelock.value != null && g_wakelock.value.isHeld()) {  
		        g_wakelock.value.valuerelease();  
		        g_wakelock.value = null;  
		    }  
	}
	// export default {
	// 	onLaunch: function() {
	// 		// console.log(getToken());
	// 		if (!getToken()) {
	// 			uni.reLaunch('/pages/login/index')
	// 		}
	// 	},
	// 	onShow: function() {
	// 		// uni.hideTabBar()
	// 		console.log('App Show')
	// 	},
	// 	onHide: function() {
	// 		console.log('App Hide')
	// 	}
	// }
</script>

<style lang="scss">
	@import "@/uni_modules/uview-plus/index.scss";
	@import '@/static/scss/index.scss';
	// @import "@/uni_modules/uview-plus/index.scss";
	// @import "@/uni_modules/uview-plus/index.scss";
	/*每个页面公共css */

	uni-page-body,
	html,
	body {
		height: 100%;
	}
</style>