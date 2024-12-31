<template>
	<view class="content">
		<uni-section title="上线" type="line" class="sect1">
			<view class="box">
				<up-form labelAlign="left" :model="formData" ref="formRef" labelWidth="80">
					<up-form-item label="产线" class='test'>
						<up-input v-model="formData.line" disabled style="height: 30px;" fontSize='13px'>
						</up-input>
					</up-form-item>
					<up-form-item label="工位" class='test'>
						<up-input v-model="formData.workstationDec" disabled style="height: 30px;" fontSize='13px'>
						</up-input>
					</up-form-item>
					<!-- <up-form-item label="计划单号" class='test'>
						<up-input v-model="formData.OrderNumber"  style="height: 30px;" fontSize='13px'>
						</up-input>
					</up-form-item> -->
					<up-form-item label="治具编码" class='test'>
						<up-input placeholder="请输入治具编码" @focus="focus" :focus="barCodeFocus" v-model="formData.ToolName"
							@confirm="submitQRCode" style="height: 30px;" fontSize='13px'>
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
				</up-form>
			</view>
		</uni-section>
		<uni-section title="已上线" type="line" class="sect" style="flex: 1;">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-list :border="true">
					<uni-list-item v-for="item in list" :title="'治具编码:'+item.CompID" :rightText="'计划号:'+item.OrderID"
						:note="'类型：'+item.CompName"></uni-list-item>
				</uni-list>
			</scroll-view>
			<template v-slot:right>
				<view class="" style="display: flex;align-items:center;">
					<view class="" style="padding-right:15px;">
						已上线：<text style="color: red;font-weight: bold;">{{list.length}}</text>
					</view>
					<wd-picker ref="wdPickerRef" :columns="orderData" @confirm="handleConfirm" v-model="order"
						use-default-slot>
						<wd-button type="primary" size="small" @click="submitList"
							:disabled="list.length==0">一键转单</wd-button>
					</wd-picker>

				</view>
			</template>
		</uni-section>
		<!-- <wd-picker ref="wdPickerRef" :columns="orderData"  v-model="order" @confirm="handleConfirm" /> -->
	</view>
</template>

<script setup>
	import {
		ToolOnline,
		QueryTools,
		QueryToolsTaskNo,
		ToolChangeOrder
	} from '@/api/work.js'
	import {
		audioSuccessPlay,
		audiofailPlay
	} from "@/utils/prompt.js"
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onReady
	} from "@dcloudio/uni-app"
	import useUserStore from '@/stores/user.js'
	import {
		storeToRefs
	} from 'pinia'
	const userStore = useUserStore()
	const {
		name
	} = storeToRefs(userStore)
	const formData = ref({
		ToolName: "",
		WorkStationName: "",
		workStationDec: '',
		line: '',
		EmployeeName: name.value,
		OrderNumber: "",
		OperateType: "",
		userAccount: name.value,
	})
	const barCodeFocus = ref(false)
	const list = ref([])
	const getToolForm = ref({
		ToolName: "",
		OrderNumber: "",
		OperateType: "3",
		CompName: "",
		workstationName: ""
	})
	const secthe = ref(0)
	const orderData = ref([])
	const order = ref("")
	const wdPickerRef = ref()
	onLoad(options => {
		// console.log(options);
		formData.value.WorkStationName = options.workStation
		formData.value.workstationDec = options.workStationDec
		formData.value.line = options.line
		getToolForm.value.workstationName = options.workStation
	})
	onReady(() => {
		// uni.createSelectorQuery().select('.sect').boundingClientRect(data => {
		// 	secthe.value = ((data.height) - 40) + 'px'
		// }).exec()
		uni.createSelectorQuery().select('.sect1').boundingClientRect(data => {
			secthe.value = (uni.getSystemInfoSync().windowHeight - Math.round(data.height + 55)) + 'px'
		}).exec()

	})
	onMounted(() => {
		getFocus()
		getTool()
		// getOrderData()
	})
	const getFocus = () => {
		barCodeFocus.value = false
		setTimeout(() => {
			barCodeFocus.value = true
			uni.hideKeyboard()
		}, 100)
	}
	const focus = () => {
		uni.hideKeyboard()
	}
	const getTool = () => {
		QueryTools(getToolForm.value).then(res => {
			list.value = res.content
		})
	}
	// const getOrderData = () => {
	// 	const uniqueCompNames = [...new Set(list.value.map(item => item.CompName))];
	// 	let data = {
	// 		CompName: [],
	// 		workstationName: formData.value.WorkStationName,
	// 		tools: "",
	// 		userAccount: name.value,
	// 	}
	// 	data.CompName=uniqueCompNames
	// 	QueryToolsTaskNo(data).then(res => {
	// 		orderData.value = res.content.map(r => {
	// 			return {
	// 				text: r.TaskNo,
	// 				value: r.TaskNo,
	// 				ProcedureCode: r.ProcedureCode
	// 			}
	// 		})
	// 	})
	// }
	const submitQRCode = () => {
		// console.log(formData.value);
		ToolOnline(formData.value).then(res => {
			// console.log(res);
			// list.value = res.content
			getTool()
			audioSuccessPlay()
			formData.value.ToolName = ''
			uni.showToast({
				title: res.msg,
				icon: 'none',
				duration: 2000
			})
		}).catch((error) => {
			// console.log(error);
			formData.value.ToolName = ''
			audiofailPlay()
		})
		getFocus()
	}
	const iconClickQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				// console.log(res.result);
				formData.value.ToolName = res.result
			}
		});
	}
	const submitList = () => {
		const uniqueCompNames = [...new Set(list.value.map(item => item.CompName))];
		const uniqueOrder = [...new Set(list.value.map(item => item.OrderID))]
		let data = {
			CompName: [],
			workstationName: formData.value.WorkStationName,
			tools: "",
			userAccount: name.value,
		}
		data.CompName = uniqueCompNames

		QueryToolsTaskNo(data).then(res => {
			let arr = []
			res.content.forEach(r => {
				if (!uniqueOrder.includes(r.TaskNo)) {
					arr.push({
						text: r.TaskNo,
						value: r.TaskNo,
						ProcedureCode: r.ProcedureCode
					})

				}
			})
			orderData.value = arr
			wdPickerRef.value.open()
		})

	}
	const handleConfirm = (val) => {
		if (val.value == "") {
			uni.showToast({
				title: `无转单任务`,
				icon: 'error',
				duration: 2000
			})
			return
		}
		let data = {
			ToOrderNumber: val.value,
			SpecName: val.selectedItems.ProcedureCode,
			compEntity: [],
			workstationName: formData.value.WorkStationName,
			userAccount: name.value
		}
		list.value.forEach(l => {
			data.compEntity.push({
				FromOrderNumber:l.OrderID,
				CompName: l.CompName,
				CompId: l.CompID
			})
		})

		ToolChangeOrder(data).then(res => {
			getTool()
			audioSuccessPlay()
			uni.showToast({
				title: res.msg,
				icon: 'none',
				duration: 2000
			})
		}).catch((error) => {
			audiofailPlay()
		})
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

		.card {
			box-sizing: border-box;
			margin: 10rpx 30rpx 30rpx 30rpx;
			padding: 20rpx;
			border-radius: 10rpx;
			box-shadow: 0 0 10rpx #888;
			font-size: 28rpx;
			overflow: auto;
			background-color: #ffffff;
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

	.test1 .u-form-item__body__left__content__label {
		font-size: 12px;
	}

	.test1 .u-form-item__body {
		padding: 3px 0;
		font-size: 12px;
	}

	.texta .uni-textarea-textarea {
		font-size: 13px;
	}
</style>