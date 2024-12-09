<template>
	<view class="firstInspection">
		<view class="search" style="padding: 5rpx  15rpx;">
			<uni-easyinput prefixIcon="search" trim="all" v-model="searchMsg" placeholder="任务单搜索" @clear="clear">
			</uni-easyinput>
		</view>
		<view class="card" @click="goToTickets(item.InspectOrder)" v-for="(item,index) in filterData" :key="item.order"
			:class="isStatus(item.Status)">
			<view class="">{{index+1}}.{{item.InspectOrder}}</view>
			<view class="" v-if="item.Status=='I'">未开始</view>
			<view class="" v-if="item.Status=='P'">进行中</view>
			<!-- <view class="" v-if="item.Status=='C'">完成</view> -->
		</view>
		<view class="btn-box" v-if="interfaceData.inspectType=='FI'">
			<!-- <button plain="true" @click="scanNumber()" class="btn">
				<uni-icons type="scan" size="24"></uni-icons>
			</button> -->
			<up-button type="primary" icon="camera" style="width: 120rpx;height: 60rpx;" @click="scanNumber()"></up-button>
		</view>
		<!-- </uni-section> -->
	</view>
</template>

<script setup>
	import {
		getTacketData,
		// uploadResults,
		bindTicket
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
		nextTick
	} from 'vue'
	const mesStore = mesMESStore()
	const {
		ticketNumber,
		tagName,
		interfaceData
	} = storeToRefs(mesStore)
	const title = ref('')
	const titleType = ref('')
	const searchMsg = ref('')
	const filterMsg = ref([])
	const filterData = computed(() => {
		return ticketNumber.value.filter(item => {
			return item.InspectOrder.toLowerCase().indexOf(searchMsg.value.toLowerCase()) !== -1;
		})
	})
	onLoad((options) => {
		nextTick(()=>{
			uni.setNavigationBarTitle({
				title: tagName.value[options.type] + '任务单'
			});
		})
		
		title.value = tagName.value[options.type]
		titleType.value = options.type
	})
	onShow(() => {
		// console.log(interfaceData.value);
		getData()
	})

	//获取任务单数据
	const getData = () => {
		getTacketData(interfaceData.value).then((data) => {
			// console.log(data);
			// let a = data.content
			let a=data.content
			if (a[0].InspectOrder !== '') {
				a = a.filter(item => item.Status != 'C')
				mesStore.SET_ticketNumber(a)
				filterMsg.value = ticketNumber.value
			}
		})
	}
	//点击跳转任务单详情
	const goToTickets = (InspectOrder) => {
		mesStore.SET_interfaceData({
			inspect: InspectOrder
		})
		uni.navigateTo({
			url: '/pages/mes/tickets/index?order=' + InspectOrder + '&type=' + titleType.value
		});
	}
	const handleSearch = (queryString) => {
		filterMsg.value = [];
		ticketNumber.value.map(item => {
			if (item.InspectOrder.indexOf(queryString) !== -1) {
				filterMsg.value.push(item);
			}
		});
	}
	const clear = () => {

	}
	const isWaring = (flag) => {
		let dayTime = Date.now()
		let tackTime = Date.parse(new Date(flag).toString())
		let difference = (dayTime - tackTime) / 1000 / 60 / 60
		if (difference > 1) {
			return true
		}
		return false
	}
	const isStatus = (status) => {
		if (status == 'P') {
			return "waring"
		}
		if (status == 'C') {
			return "finsh"
		}
	}
	const scanNumber = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode'],
			success: (res) => {
				// this.SET_interfaceData({
				// 	workOrder: res.result
				// })
				// console.log(this.interfaceData);
				bindTicket({
					inspect: '12344',
					inspectType: 'FI',
					workOrder: res.result
				}).then((res1) => {
					console.log(res1);
					if (res1.Status == 'NG') {
						audiofailPlay()
						uni.showModal({
							title: '提示',
							content: res1.Message,
							success: res => {
								if (res.confirm) {
									// this.Download()
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						})
						// console.log(11111);
					} else {
						audioSuccessPlay()
						uni.showToast({
							title: '创建成功',
							icon: 'success'
						});
					}
					getData()
				})
			}
		})
	}

</script>

<style lang="scss" scoped>
	.firstInspection {
		width: 100%;
		height: 100vh;
		background-color: #fff;
		padding-top: 50px;

		.search {
			position: fixed;
			width: 100%;
			background-color: #ffffff;
			left: 5;
			top: var(--window-top);
			z-index: 99;
			// border: 1px solid #ddd;
		}

		.card {
			box-sizing: border-box;
			border-radius: 10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 0 30rpx 20rpx 30rpx;
			padding: 20rpx 30rpx;
			font-size: 28rpx;
			color: #fff;
			box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px;
			background-color: #c3c3c3;
		}

		.waring {
			color: #fff;
			background-color: #004ea1;
		}

		.finsh {
			color: #fff;
			background-color: #00AC6A;
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

	}
</style>