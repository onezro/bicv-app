 <template>
 	<view class="content">
 		<uni-section title="入库" type="line" class="sect1">
 			<view class="box">
 				<up-form labelPosition="left" :model="formData" ref="formRef" labelWidth="65">
 					<!-- 	<up-form-item label="工位" prop="remark" class='test'>
						<up-input style="height: 30px;" fontSize='13px' v-model="formData.workstationDec" disabled>
						</up-input>
					</up-form-item> -->
 					<up-form-item label="计划单号" prop="orderNum" class='test'>
 						<up-input style="height: 30px;" fontSize='13px' :disabled="true"
 							v-model="formData.OrderNumber">
 						</up-input>
 					</up-form-item>
 					<up-form-item label="日期" prop="date" class='test'>
 						<uni-datetime-picker type="date" :clear-icon="false" v-model="formData.InTime" />
 					</up-form-item>

 					<up-form-item label="烧录条码" prop="barCode" class='test'>
 						<up-input placeholder="烧录条码" :adjustPosition="true" style="height: 30px;" fontSize='13px'
 							:focus='focusQRCode' v-model="formData.barCode" @focus="focus" @confirm="submit">
 							<template #suffix>
 								<uni-icons type="scan" color="#bdbdbd" @click="iconBarQRCode" size="20"></uni-icons>
 							</template>
 						</up-input>
 					</up-form-item>
 				</up-form>
 			</view>
 			<view class="" style="display: flex;justify-content: flex-end;"><up-button class="custom-style" text="重置"
 					style="margin-right: 10px;" @click="restForm"></up-button></view>

 		</uni-section>
 		<uni-section title="入库列表" type="line" class="sect" style="flex: 1;">
 			<scroll-view scroll-y="true" :style="{height:secthe}">
 				<uni-list>
 					<uni-swipe-action>
 						<uni-swipe-action-item v-for="f in  list" :key="f" :right-options="rightOptions"
 							@click="swipeClick($event, f)">
 							<uni-list-item :title="'烧录条码:'+f.ContainerName"
 								:note="'工单:'+f.ERPOrder+'\n产品编码:'+f.ProductName" :rightText="'数量:'+f.Qty" />
 						</uni-swipe-action-item>
 					</uni-swipe-action>
 				</uni-list>
 			</scroll-view>
 			<template v-slot:right>
 				<view class="" style="display: flex;align-items: center;">

 					数量：<text style="color: red;font-weight: bold;">{{list.length}}</text>
 					<!-- <up-button class="custom-style" style="margin-left: 10px;"   type="primary" :disabled="list.length==0" text="提交入库"
			   	@click="onSubmit"></up-button> -->

 					<up-button class="custom-style" type="primary" style="margin-left: 10px;"
 						:disabled="list.length==0" text="提交入库" @click="onSubmit"></up-button>
 				</view>
 			</template>
 			<!-- <view class="button-box">
				
				
			</view> -->
 		</uni-section>

 	</view>
 </template>

 <script setup>
 	import {
 		CheckContainers,
 		SubmitBurnToStock

 	} from '@/api/smt.js'
 	import {
 		ref,
 		watch,
 		onBeforeMount
 	} from 'vue'
 	import {
 		onLoad,
 		onShow,
 		onReady
 	} from "@dcloudio/uni-app"
 	import {
 		audioSuccessPlay,
 		audiofailPlay
 	} from "@/utils/prompt.js"
 	import useUserStore from '@/stores/user.js'
 	import {
 		storeToRefs
 	} from 'pinia'
 	import dayjs from 'dayjs'
 	const userStore = useUserStore()
 	const {
 		name
 	} = storeToRefs(userStore)

 	const formData = ref({
 		OrderNumber: '',
 		ERPOrder: '',
 		InTime: '',
 		barCode: '',
 		StockDetail: [],
 		workstationName: '',
 		workstationDec: '',
 		userAccount: name,
 		txnDate: ''
 	})
 	const isOrder = ref(true)
 	const focusQRCode = ref(true)
 	const secthe = ref(0)
 	const list = ref([])
 	const rightOptions = ref([{
 		text: '删除',
 		style: {
 			backgroundColor: '#F56C6C'
 		}
 	}])
 	// onLoad(options => {
 	// 	// console.log(options.workStation);
 	// 	formData.value.workstationName = options.workStation
 	// 	formData.value.workstationDec = options.workStationDec
 	// })
 	onBeforeMount(() => {
 		formData.value.InTime = setDefaultDate()
 		// console.log( dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"));
 	})
 	onReady(() => {
 		// uni.createSelectorQuery().select('.sect').boundingClientRect(data => {
 		// 	secthe.value = ((data.height) - 85) + 'px'

 		// }).exec()
 		uni.createSelectorQuery().select('.sect1').boundingClientRect(data => {
 			secthe.value = (uni.getSystemInfoSync().windowHeight - Math.round(data.height + 55)) + 'px'
 		}).exec()
 	})

 	const getFocus = () => {
 		focusQRCode.value = false
 		setTimeout(() => {
 			focusQRCode.value = true
 		}, 100)
 	}
 	const focus = () => {
 		uni.hideKeyboard()
 	}

 	const submit = () => {
 		// let data=formData.value.barCode
 		CheckContainers(formData.value.barCode).then(res => {
 			// console.log(res);
 			if (formData.value.OrderNumber == '') {
 				formData.value.OrderNumber = res.content[0].MfgOrderName
 				formData.value.ERPOrder = res.content[0].ERPOrder
 				// list.value.push(formData.value.barCode)
 				list.value.push({
 					...res.content[0]
 				})
 				audioSuccessPlay()
 				getFocus()
 			} else {
 				let isEixt = list.value.findIndex(l => l.ContainerName == formData.value.barCode)
 				if (formData.value.OrderNumber == res.content[0].MfgOrderName && isEixt == -1) {
 					list.value.push({
 						...res.content[0]
 					})
 					audioSuccessPlay()
 					getFocus()
 				} else {
 					uni.showToast({
 						title: isEixt !== -1 ? '入库烧录条码重复!!!' : '入库计划号不同',
 						icon: 'none',
 						duration: 2500
 					})
 					audiofailPlay()
 					getFocus()
 				}
 			}
 			formData.value.barCode = ''
 		}).catch(() => {
 			formData.value.barCode = ''
 			audiofailPlay()
 			getFocus()
 		})

 		// list.value.push(formData.value.barCode)
 		// // formData.value.CarrierName.push(formData.value.barCode)
 		// formData.value.barCode = ''
 		// getFocus()
 	}
 	const restForm = () => {
 		list.value = []
 		formData.value.StockDetail = []
 		formData.value.OrderNumber = ''
 		formData.value.ERPOrder = ''
 		formData.value.barCode = ""
 		getFocus()
 	}

 	const onSubmit = () => {
 		formData.value.StockDetail = [...list.value]
 		// console.log(formData.value);
 		SubmitBurnToStock(formData.value).then(res => {
 			audioSuccessPlay()
 			uni.showToast({
 				title: '入库成功',
 				icon: 'success',
 			})
 			list.value = []
 			formData.value.StockDetail = []
 			formData.value.OrderNumber = ''
 			formData.value.ERPOrder = ''
 			formData.value.InTime = setDefaultDate()
 			getFocus()
 		}).catch((error) => {
 			formData.value.StockDetail = []
 			formData.value.InTime = setDefaultDate()
 			audiofailPlay()
 		})
 	}
 	const swipeClick = (e, data) => {
 		list.value = list.value.filter(l => l.ContainerName != data.ContainerName)
 		if (list.value.length == 0) {
 			formData.value.OrderNumber = ''
 			formData.value.ERPOrder = ''
 			getFocus()
 		}
 	}

 	const iconBarQRCode = () => {
 		if (!isOrder.value) {
 			uni.scanCode({
 				onlyFromCamera: true,
 				scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
 				success: res => {
 					formData.value.barCode = res.result
 					submit()
 				}
 			});
 		}
 	}
 	const setDefaultDate = () => {
 		// 获取当前日期  
 		const now = new Date();
 		// 格式化日期为YYYY-MM-DD  
 		const formattedDate =
 			`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
 		// 设置currentValue  
 		// formData.value.InTime = formattedDate;
 		return formattedDate
 	}
 </script>

 <style lang="scss" scoped>
 	.content {
 		height: 100%;
 		background: #fff;
 		display: flex;
 		flex-direction: column;

 		.box {
 			padding: 0 10px;
 		}

 		.custom-style {
 			width: 80px;
 			height: 28px;
 		}

 		.custom-style1 {
 			width: 40px;
 			height: 28px;
 		}

 		.button-box {
 			position: fixed;
 			left: 0;
 			bottom: 10px;
 			display: flex;
 			align-items: center;
 			justify-content: center;
 			width: 100vw;
 			background-color: #000;


 		}
 	}
 </style>
 <style lang="scss">
 	.test .u-form-item__body__left__content__label {
 		font-size: 13px;
 	}

 	.test .u-form-item__body {
 		padding: 5px 0;
 		font-size: 12px;
 	}

 	.texta .uni-textarea-textarea {
 		font-size: 13px;
 	}
 </style>