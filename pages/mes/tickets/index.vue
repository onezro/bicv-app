<template>
	<view class="ticket">
		<uni-section title="检验项" titleFontSize="18px" type="line">
			<view class="card" @click="goTicketDetail(item)" v-for="(item,index) in taskData" :key="item.Step"
				:class="isStatus(item.Status)">
				<!-- {{index+1}}.{{item.Name}} -->
				<view class="">{{index+1}}.{{item.StepName}}</view>
				<view class="result" v-if="item.Status==9">正常</view>
				<view class="result" v-if="item.Status==1">NG</view>
				<view class="result" v-if="item.Status==0">未开始</view>
				<view class="result" v-if="item.Status==2">报修</view>
				<view class="result" v-if="item.Status==3">故障</view>
			</view>
		</uni-section>

	</view>
</template>

<script setup>
	// import {
	// 	mapState,
	// 	mapMutations
	// } from 'vuex'
	import {
		getTacketStep,
		// bindTicket
	} from '@/api/login.js'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		audioSuccessPlay,
		audiofailPlay
	} from '@/utils/prompt.js'
	import {
		storeToRefs
	} from 'pinia'
	import mesMESStore from '@/stores/mes.js'
	import {
		ref,
		computed,
		watch,
		nextTick
	} from 'vue'
	const mesStore = mesMESStore()
	const {
		taskData,
		tagName,
		interfaceData
	} = storeToRefs(mesStore)
	const order = ref('')
	const titleType = ref('')
	const isScan=ref(false)
	const scanSize = ref('')
	const WorkOrder = ref('')
	// watch(() => taskData.value, (newValue, oldValue) => {
	// 	if (newValue.length > 0) {
	// 		isScan = true
	// 	} else {
	// 		isScan = false
	// 	}
	// })
	onLoad((options) => {
		order.value = options.order
		titleType.value = options.type
		nextTick(()=>{
			uni.setNavigationBarTitle({
				title: options.order
			});
		})
		
	})
	onShow(() => {
		getData()
	})
	const getData = () => {
		getTacketStep(interfaceData.value).then((res) => {
			// console.log(res);
			let data=res.content
			let a=JSON.parse(data.OrderInfo)
			let b=JSON.parse(data.DetailList) 
			// console.log(a,b);
			WorkOrder.value = a[0].WorkOrder
			// // // this.WorkOrder =
			mesStore.SET_taskData(b)
		})
	}

	const goTicketDetail = (title) => {
		// if (this.interfaceData.inspectType == 'FI') {
		// 	if (this.WorkOrder) {
		uni.navigateTo({
			url: '../ticketDetail/index?order=' + order.value + '&step=' + title.Step + '&title=' +
				title.StepName + '&type=' + titleType.value
		})
		// } else {
		// 	uni.showToast({
		// 		icon: 'error',
		// 		title: '请先绑定工单'
		// 	});
		// }
		// } else {
		// 	uni.navigateTo({
		// 		url: '../ticketDetail/index?order=' + this.order + '&step=' + title.Step + '&title=' +
		// 			title.Name + '&type=' + this
		// 			.titleType
		// 	})
		// }

	}
	const isStatus = (status) => {
		if (status == 1) {
			return 'ng_active'
		}
		if (status == 9) {
			return 'active'
		}
		if (status == 2) {
			return 'bx_active'
		}
		if (status == 3) {
			return 'gz_active'
		}
	}
</script>

<style lang="scss" scoped>
	.ticket {
		height: 100vh;
		background-color: #fff;

		.card {
			box-sizing: border-box;
			border-radius: 10rpx;
			margin: 0 30rpx 20rpx 30rpx;
			padding: 20rpx 30rpx;
			box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px;
			font-size: 28rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #fff;
			background-color: #004ea1;

			.result {
				white-space: nowrap;
			}
		}

		.btn-box {
			position: fixed;
			bottom: 0;
			right: 0;
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-items: center;
			align-items: center;

			.btn {
				width: 100rpx;
				height: 60rpx;
				display: flex;
				justify-items: center;
				align-items: center;
			}
		}

		.active {
			color: #fff;
			background-color: #00AC6A;
		}

		.ng_active {
			background-color: #f11212;
		}

		.bx_active {
			background-color: #ffa726;
		}

		.gz_active {
			background-color: #bdbdbd;
		}
	}
</style>