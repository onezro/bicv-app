<template>
	<view class="content"></view>
</template>

<script setup>
	// var main, receiver, filter;
	// var _codeQueryTag = false;
	import {
		ref,
		onUnmounted
	} from "vue"
	import {
		onLoad,
		onHide
	} from "@dcloudio/uni-app"
	const scanCode = ref("")
	const main = ref()
	const receiver = ref()
	const filter = ref()
	const _codeQueryTag = ref(false)

	

	onHide(() => {
		stopScan()
	})
	onUnmounted(() => {
		stopScan()
	})
	const initScan = () => {
		// console.log(111);
		main.value = plus.android.runtimeMainActivity();
		var IntentFilter = plus.android.importClass('android.content.IntentFilter');
		filter.value = new IntentFilter();
		const action = uni.getStorageSync('currentDeviceData').action

		filter.value.addAction("com.dwexample.ACTION");
		receiver.value = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
			onReceive: (context, intent) => {
				console.log('onReceive');
				plus.android.importClass(intent);
				//下面的getStringExtra内改为自己的广播标签--有误
				let code = intent.getStringExtra("com.motorolasolutions.emdk.datawedge.data_string");
				queryCode(code);
			}
		});
	}
	const startScan = () => {
		console.log('startScan');
		main.value.registerReceiver(receiver.value, filter.value);
	}

	const stopScan = () => {
		console.log('stopScan');
		main.value.unregisterReceiver(receiver.value);
	}

	const queryCode = (code) => {
		console.log('queryCode');
		if (_codeQueryTag.value) return false;
		_codeQueryTag.value = true;
		setTimeout(function() {
			_codeQueryTag.value = false;
		}, 150);
		var id = code
		uni.$emit('scan', {
			code: id
		})
	}
	initScan()
	startScan()
</script>

<style>
</style>