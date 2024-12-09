<template>
	<view class="content">
		<uni-section title="下线" type="line" class="sect1">
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
					<up-form-item label="治具编码" class='test'>
						<up-input placeholder="请输入治具编码" @focus="focus" :focus="barCodeFocus" v-model="formData.ToolName"
							@confirm="submitQRCode" style="height: 30px;" fontSize='13px'>
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<!-- 	<up-form-item>
						<up-button type="primary" text="一键下线" @click="oneClick"
							style="width: 200rpx;height: 80rpx;"></up-button>
					</up-form-item> -->
				</up-form>
			</view>
		</uni-section>
		<uni-section title="清单" type="line" class="sect" style="flex: 1;">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-list>
					<uni-list :border="true">
						<uni-list-item v-for="item in list" :title="'治具编码:'+item.CompID" :rightText="'计划号:'+item.OrderID"
							:note="'类型：'+item.CompName"></uni-list-item>
					</uni-list>
				</uni-list>
			</scroll-view>
			<template v-slot:right>
				<view class="" style="display: flex;align-items: center;">
					已上线：<text style="color: red;font-weight: bold;">{{list.length}}</text>
					<up-button type="primary" :disabled="list.length==0" text="一键下线" style="margin-left: 10px;"
						class="custom-style" @click="oneClick"></up-button>
				</view>
			</template>
		</uni-section>
		<!-- 	<view class="" style="position: fixed;bottom: 10px;right: 10px;">
			
		</view> -->
	</view>
</template>

<script setup>
	import {
		ToolOffline,
		QueryTools,
	} from '@/api/work.js'
	import {
		audioSuccessPlay,
		audiofailPlay
	} from "@/utils/prompt.js"
	import {
		ref,
		watch,
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
		OrderNumber: "",
		OperateType: 2,
		workstationName: "",
		workstationDec: '',
		userAccount: name,
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
	onLoad(options => {
		// console.log(options);
		formData.value.WorkStationName = options.workStation
		formData.value.workstationDec = options.workStationDec
		formData.value.line = options.line
		getToolForm.value.workstationName = options.workStation
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
		getTool()
	})
	const getFocus = () => {
		barCodeFocus.value = false
		setTimeout(() => {
			barCodeFocus.value = true
			// uni.hideKeyboard()
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
	const oneClick = () => {
		formData.value.OperateType = '1'
		uni.showModal({
			title: '提示',
			content: '是否一键下线？',
			success: (res) => {
				if (res.confirm) {
					offline()
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});




	}
	const submitQRCode = () => {
		formData.value.OperateType = '2'
		offline()
	}
	const offline = () => {
		ToolOffline(formData.value).then(res => {
			audioSuccessPlay()
			formData.value.ToolName = ''
			getTool()
			uni.showToast({
				title: res.msg,
				icon: 'none',
			})
		}).catch((error) => {
			// console.log(error);
			formData.value.ToolName = ''
			audiofailPlay()
		})
		if (formData.value.OperateType == 2) {
			getFocus()
		}

	}
	const iconClickQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				// console.log(res.result);
				formData.value.ToolName = res.result
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