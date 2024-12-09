<template>
	<view class="content">
		<uni-section title="出库" type="line" class="sect1">
			<view class="box">
				<up-form ref="form" labelWidth="80">
					<up-form-item label="工单号" class='test'>
						<up-input v-model="formData.orderNumber" disabled style="height: 30px;" fontSize='13px'>
						</up-input>
					</up-form-item>
					<up-form-item label="治具编码" class='test'>
						<up-input placeholder="条码" @focus="focus" v-model="formData.compid" @confirm="submitQRCode"
							:focus="barCodeFocus" style="height: 30px;" fontSize='13px'>
							<template #suffix>
								<uni-icons type="scan" @click="iconClickQRCode" color="#777777" size="24"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
				</up-form>
			</view>
		</uni-section>
		<uni-section title="清单" type="line" class="sect" style="flex: 1;">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-list :border="true">
					<uni-list-item v-for="item in list" :title="'治具编码：'+item.CompID" :note="'型号：'+item.CompName"
						:rightText="'储位：'+item.Loc"></uni-list-item>
				</uni-list>
				<!-- <view class="card" margin="8px" padding="5px" v-for="item in list" :key="item.Rec">
				<up-form ref="baseForm" :model="item" :borderBottom='true' labelWidth="80">
					<up-form-item label="治具编码" :borderBottom='true'>
						<text>{{item.CompID}}</text>
					</up-form-item>
					<up-form-item label="型号" :borderBottom='true'>
						<text>{{item.CompName}}</text>
					</up-form-item>
					<up-form-item label="储位" :borderBottom='true'>
						<text>{{item.Loc}}</text>
					</up-form-item>
				
				</up-form>

			</view> -->
			</scroll-view>
			<template v-slot:right>
				<view class="" style="display: flex;align-items:center;">
					<view class=""  style="padding-right:15px;">
						需求：<text style="color: red;font-weight: bold;">{{Amount}}</text>
					</view>
					<view class="" style="padding-right:30px;">
						已出库：<text style="color: seagreen;font-weight: bold;">{{outNum}}</text>
					</view>
					<up-button type="primary"  text="一键出库"
						class="custom-style" @click="submitList"></up-button>
				</view>
			</template>
			<!-- <view class="button-box">
				<view class="" style="width: 100%;display: flex;justify-content: space-between;">
					<up-button type="success"  text="完成任务"
						class="custom-style" @click="submitList"></up-button>
					<up-button type="info"  text="取消任务"
						class="custom-style" @click="submitList"></up-button>
					<up-button type="primary"  text="一键出库" 
						class="custom-style" @click="submitList"></up-button>
				</view>
				
			</view> -->
		</uni-section>
	</view>
</template>

<script setup>
	import {
		ToolsMove,
		QueryTools
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

	const orderNo = ref('')
	const IsKitting = ref(false)
	const barCodeFocus = ref(true)
	const formData = ref({
		operationtype: "MoveOut",
		compid: "",
		location: "",
		orderNumber: "",
		compName: "",
		ToolsTaskDetailGuid: ""
	})
	const getToolForm = ref({
		ToolName: "",
		OrderNumber: "",
		OperateType: "1",
		CompName: "",
		workstationName: ""
	})
	const list = ref([])
	const secthe = ref(0)
	const Amount = ref(0)
	const outNum = ref(0)
	onLoad(options => {
		formData.value.orderNumber = options.orderNumber
		formData.value.compName = options.compName
		formData.value.ToolsTaskDetailGuid = options.toolsTaskDetailGuid
		getToolForm.value.CompName = options.compName
		Amount.value = options.amount
		outNum.value = options.IssuedQuantity

		// getToolForm.value.OrderNumber=options.orderNumber
	})
	onReady(() => {
		// uni.createSelectorQuery().select('.sect').boundingClientRect(data => {
		// 	secthe.value = ((data.height) - 45) + 'px'
		// }).exec()
		uni.createSelectorQuery().select('.sect1').boundingClientRect(data => {
			secthe.value = (uni.getSystemInfoSync().windowHeight - Math.round(data.height + 55)) + 'px'
		}).exec()

	})
	onMounted(() => {
		getToolList()
	})
	const getToolList = () => {
		// console.log(getToolForm.value);
		QueryTools(getToolForm.value).then(res => {
			list.value = res.content
		})
	}
	const getFocus = () => {
		barCodeFocus.value = false
		setTimeout(() => {
			barCodeFocus.value = true
		}, 100)
	}
	const focus = () => {
		uni.hideKeyboard()
	}
	const submitQRCode = () => {
		if (outNum.value < Amount.value) {
			ToolsMove(formData.value).then(res => {
				audioSuccessPlay()
				getToolList()
				uni.showToast({
					title: res.msg,
					icon: 'none',
				})
				outNum.value++
			}).catch(() => {
				audiofailPlay()
			})
		} else {
			uni.showToast({
				title: `治具任务已出库完成`,
				icon: 'error',
			})
		}

		formData.value.compid = ''
		getFocus()
	}
	const iconClickQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				formData.value.compid = res.result
				submitQRCode()
			}
		});
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
		.custom-style {
			width: 80px;
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
			background-color: #fff;
		
		.custom-style {
			width: 80px;
			height: 28px;
		}
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


</style>