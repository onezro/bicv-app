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
					<view class="" style="padding-right:15px;">
						需求：<text style="color: red;font-weight: bold;">{{Amount}}</text>
					</view>
					<view class="" style="padding-right:15px;">
						<wd-button  @click.stop="showList" type="info" size="small" :disabled="toolsList.length==0" >已出库：<text style="color: seagreen;font-weight: bold;">{{toolsList.length}}</text></wd-button>
					</view>
					<wd-button type="primary" size="small" @click="submitList"
						:disabled="list.length==0">一键出库</wd-button>
					<!-- <up-button type="primary" text="一键出库" class="custom-style" @click="submitList"
						:disabled="list.length==0"></up-button> -->
				</view>
			</template>
		</uni-section>
		<up-popup :show="showTool" mode="bottom" safeAreaInsetBottom closeable @close="close" @open="open">
			<view class="" style="height: 70vh;">
				<view class="title" style="width: 90vw;position: sticky;left: 0;top: 0;">
					<uni-list :border="false">
						<uni-list-item :border="false" :title="'计划单号：'+formData.orderNumber"
							:note="'治具型号：'+formData.compName" :rightText="'已出库：'+toolsList.length" />
					</uni-list>

				</view>
				<scroll-view  scroll-y="true" style="height:100%;padding-bottom: 120px;">
					<uni-list>
						<uni-swipe-action>
							<uni-swipe-action-item v-for="(f,i) in  toolsList" :key="f.CompID"
								:right-options="rightOptions" @click="swipeClick($event, f.CompID)"
								:disabled='f.Qty==0'>
								<uni-list-item :title="'治具编码：'+f.CompID" :note="'型号：'+f.CompName"
									:rightText="'序号：'+(i+1)" />
							</uni-swipe-action-item>
						</uni-swipe-action>
					</uni-list>
				</scroll-view>
			</view>
		</up-popup>
	</view>
</template>

<script setup>
	import {
		ToolsMove,
		QueryTools,
		QueryTmpToolData,
		DeleteTmpToolData,
		ToolsMoveOutOnce
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
	


	const orderNo = ref('')
	const IsKitting = ref(false)
	const barCodeFocus = ref(true)
	const formData = ref({
		operationtype: "MoveOut",
		compid: "",
		location: "",
		orderNumber: "",
		compName: "",
		ToolsTaskDetailGuid: "",
		userAccount: name.value
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
	const showTool = ref(false)
	const toolsList = ref([])
	const rightOptions = ref([{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}])
	const toolID = ref("")
	onLoad(options => {
		formData.value.orderNumber = options.orderNumber
		formData.value.compName = options.compName
		formData.value.ToolsTaskDetailGuid = options.toolsTaskDetailGuid
		getToolForm.value.CompName = options.compName
		Amount.value = options.amount
		outNum.value = options.IssuedQuantity
		toolID.value = options.toolsTaskDetailGuid
	
		// getToolForm.value.OrderNumber=options.orderNumber
	})
	onReady(() => {
	
		uni.createSelectorQuery().select('.sect1').boundingClientRect(data => {
			secthe.value = (uni.getSystemInfoSync().windowHeight - Math.round(data.height + 55)) + 'px'
		}).exec()

	})
	onMounted(() => {
		getToolList()
		getTempTool()
	})
	const getToolList = () => {
		// console.log(getToolForm.value);
		QueryTools(getToolForm.value).then(res => {
			list.value = res.content
			// console.log(list.value );
		})
	}
	const getTempTool = () => {
		QueryTmpToolData(toolID.value).then(res => {
			toolsList.value = res.content
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
		console.log(formData.value);
		if (toolsList.value.length < Amount.value) {
			ToolsMove(formData.value).then(res => {
				audioSuccessPlay()
				getToolList()
				getTempTool()
				uni.showToast({
					title: res.msg,
					icon: 'none',
				})
				// outNum.value++
			}).catch(() => {
				audiofailPlay()
			})
		} else {
			audiofailPlay()
			uni.showToast({
				title: `出库达到需求`,
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
	const submitList = () => {
		let data = []
		// console.log(list.value);
		if (toolsList.value.length < Amount.value) {
			list.value.forEach((l, i) => {
				// console.log(toolsList.value.length);
				if (i + 1 <= Amount.value - toolsList.value.length) {
					data.push({
						compid: l.CompID,
						location: l.Loc,
						orderNumber: formData.value.orderNumber,
						compName: l.CompName,
						ToolsTaskDetailGuid: toolID.value,
						toolType: l.MaterialName,
							userAccount: name.value
					})
				}

			})
			// console.log(data);
			ToolsMoveOutOnce(data).then(res => {
				audioSuccessPlay()
				getTempTool()
				getToolList()
				uni.showToast({
					title: res.msg,
					icon: 'none',
				})
			}).catch(() => {
				audiofailPlay()
			})
		} else {
			audiofailPlay()
			uni.showToast({
				title: `出库达到需求`,
				icon: 'error',
			})
		}

	}
	const showList = () => {
		// getTempTool()
		showTool.value = true
	}
	const close = () => {
		showTool.value = false
	}

	const swipeClick = (e, compid) => {
		DeleteTmpToolData(compid).then(res => {
			audioSuccessPlay()
			getTempTool()
			getToolList()
			uni.showToast({
				title: res.msg,
				icon: 'none',
			})
		}).catch(() => {
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