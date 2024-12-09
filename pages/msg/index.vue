<template>
	<view class="page">
		<uni-swipe-action>
			<uni-swipe-action-item :right-options="options1" v-for="m in msgData" :key="m.ID" @click="bindClick(m)">
				<uni-list-chat @click="openMsg(m)" :clickable='true' :avatar-circle="true" :title="m.MsgTitle"
					badge-positon="left" :badgeText="m.Status==0?'dot':''"
					:avatar="m.MsgType=='1'?'../../static/svg/error1.svg':'../../static/svg/wraing1.svg'"
					:note="m.MsgContent" :time="m.CreationDate"></uni-list-chat>
				
			</uni-swipe-action-item>
		</uni-swipe-action>
		<text>{{linkMsg}}</text>
		<up-modal :show="show" @confirm='closeModal()' :title="title" :content='content'></up-modal>
		<!-- <button @click="send">启动</button>
		
		<button @click="close">断开</button> -->

		<!-- <tabar/> -->
	</view>
</template>

<script setup>
	import watchScanVue from "../../components/watch-scan.vue"
	import {
		onShow
	} from "@dcloudio/uni-app"
	import msgMEStore from "@/stores/msg.js"
	import {
		storeToRefs
	} from 'pinia'
	import tabar from '@/pages/tabar/index.vue'
	import {
		ref,
		watch,
		onMounted,
		onUnmounted
	} from 'vue'
	
	import {initPushMsg} from '@/utils/push.js'
	const msgStore = msgMEStore()
	const {
		msgData,
		unRead,
		linkMsg
	} = storeToRefs(msgStore)
	const options1 = ref([{
		text: '删除',
		style: {
			backgroundColor: '#dd524d'
		}
	}])
	const show=ref(false)
    const title=ref('')
	const content=ref('')

	// onShow(()=>{
	// 	uni.$off('scan')
	// 	uni.$on('scan',(data)=>{
	// 		dataCode.value=data.code
	// 		// console.log(data);
	// 	})
	// })
	onMounted(() => {
		// msgStore.initSocket()
		 
	})
	const openMsg = (m) => {
		const data = {
			MessageId: m.ID,
			Status: 1,
			Isdelete: false
		}
		title.value=m.MsgTitle
		content.value=m.MsgContent
		// console.log(data);
		msgStore.sendData(data)
		show.value=true
		// uni.showModal({
		// 	title: m.MsgTitle,
		// 	content: m.MsgContent,
		// 	success: function (res) {
		// 		msgStore.sendData(data)
		// 		if (res.confirm) {
		// 			console.log('用户点击确定');
		// 		} else if (res.cancel) {
		// 			console.log('用户点击取消');
		// 		}
		// 	}
		// });
	
		
	}
	const closeModal=()=>{
		show.value=false
	}
	const send = () => {
		msgStore.initSocket()
	}
	const bindClick = (m) => {
		const data = {
			MessageId: m.ID,
			Status: m.Status,
			Isdelete: true
		}
		msgStore.sendData(data)
	}
	const close = () => {
		msgStore.closeSocket()
		// initPushMsg('测试','112334253513')
	}
	//

</script>


<style lang="scss" scoped>
	.page {
		height: 100%;
		background-color: #f0f0f0;
	}
</style>