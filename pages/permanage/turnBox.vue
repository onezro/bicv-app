<template>
	<view class="content">
		<uni-section title="拆箱" type="line">
			<view class="box">
				<up-form labelPosition="left" :model="formData" ref="formRef" labelWidth="100">
					<up-form-item label="类型" prop="type">
						<uni-data-checkbox v-model="formData.type" :localdata="localdata" />
					</up-form-item>
					<up-form-item label="扫描条码" prop="barCode" class='test'>
						<up-input placeholder="请扫描条码" @focus="focus" :focus="barCodeFocus" v-model="formData.barCode"
							@confirm="submit"  style="height: 30px;" fontSize='13px'>
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconBarQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<up-form-item label="周转箱条码" prop="turnNumber" class='test'>
						<up-input v-model="formData.turnNumber" :disabled="true"  style="height: 30px;" fontSize='13px'>
						</up-input>

					</up-form-item>
				</up-form>
			</view>
		</uni-section>
		<uni-section title="装箱明细" type="line">
			<view class="box">
				<up-form labelPosition="left" :model="material" ref="materRef" labelWidth="80">
					<up-form-item label="工单号" prop="orderNum">
						<view class="textlog">{{material.OrderNumber}}</view>
						<!-- <up-input v-model="material.OrderNumber"  border="none"></up-input> -->
					</up-form-item>
					<up-form-item label="物料编码" prop="itemNumber">
						<text class="textlog">{{material.ProductName}}</text>
					</up-form-item>
					<up-form-item label="物料名称" prop="itemName">
						<text>{{material.ProductDescription}}</text>
					</up-form-item>
					<up-form-item label="大板数量" prop="boxNumber">
						<text class="textlog">{{material.PanelQty}}</text>
					</up-form-item>
					<up-form-item label="小板数量" prop="boxNumber">
						<text class="textlog">{{material.PcbQty}}</text>
					</up-form-item>
				</up-form>
				
			</view>
			<template v-slot:right>
				<up-button class="custom-style" text="重置" @click="resetForm"></up-button>
			</template>
		</uni-section>
		<view class="subox">
			
			<up-button type="primary" text="一键拆箱" @click="oneClick" v-if="isUnbox" :disabled="isOneClick"></up-button>
		</view>
	</view>
</template>

<script setup>
	import {
		QueryPackingInfoByCarrierName,
		SubmitPcbToPacking,
		SplitPcbToPacking
	} from "@/api/smt.js"
	import {
		audioSuccessPlay,
		audiofailPlay
	} from "@/utils/prompt.js"
	import {
		ref,
		watch,
		nextTick
	} from 'vue'
	import useUserStore from '@/stores/user.js'
	import {
		storeToRefs
	} from 'pinia'
	const userStore = useUserStore()
	const {
		name
	} = storeToRefs(userStore)
	// const list = ref(['拆箱', '一键拆箱'])
	// const curNow = ref(0)
	const localdata = ref([{
		text: '拆箱',
		value: 0
	}, {
		text: '一键拆箱',
		value: 1
	}])
	const formData = ref({
		type: 0,
		turnNumber: '',
		barCode: '',
	})
	const barList = ref([])
	const isUnbox = ref(false)
	const formRef = ref()
	const materRef = ref()
	const material = ref({
		OrderNumber: '',
		ProductName: '',
		ProductDescription: '',
		Column1: ''
	})
	const restMaterial = () => {
		material.value.OrderNumber = ''
		material.value.ProductName = ''
		material.value.ProductDescription = ''
		material.value.PanelQty = ''
		material.value.PcbQty = ''
		formData.value.turnNumber = ''
		formData.value.barCode = ''
	}
	const barCodeFocus = ref(true)
	const isOneClick = ref(true)
	watch(() => formData.value.type, (newValue, oldValue) => {
		isUnbox.value = newValue === 0 ? false : true
		if (newValue !== oldValue) {
			isOneClick.value = true
			getFocus()
			restMaterial()
		}

	})
	const getFocus = () => {
		barCodeFocus.value = false
		setTimeout(() => {
			barCodeFocus.value = true
		}, 100)
	}
	const focus=()=>{
		uni.hideKeyboard()
	}

	const iconBarQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				formData.value.barCode = res.result
				submit()
			}
		});
	}
	const submit = () => {
		if (formData.value.turnNumber == '') {
			getInfoData(formData.value.barCode)
		} else {
			if (formData.value.type == 0) {
				let data = {
					CarrierName: formData.value.turnNumber,
					PcbNumber: formData.value.barCode,
					userAccount: name.value,
				}
				SubmitPcbToPacking(data).then(res => {
					// console.log(res.msg);
					audioSuccessPlay()
					getInfoData(formData.value.turnNumber)
					uni.showToast({
						title: res.msg,
						icon: 'success',
						duration: 2500
					})
				}).catch((error) => {
					audiofailPlay()
				})
				formData.value.barCode = ''
				getFocus()
			} else {
				getInfoData(formData.value.barCode)
			}
		}

	}
	const resetForm = () => {
		restMaterial()
		getFocus()
		// formRef.value.resetFields()
	}
	const getInfoData = (val) => {
		QueryPackingInfoByCarrierName(val).then((res) => {
			formData.value.turnNumber = val
			material.value = {
				...res.content
			}
			audioSuccessPlay()
			if (isUnbox.value) {
				isOneClick.value = false
				// barCodeFocus.value=false
			}
		}).catch((error) => {
			// restMaterial()
			material.value.OrderNumber = ''
			material.value.ProductName = ''
			material.value.ProductDescription = ''
			material.value.PanelQty = ''
			material.value.PcbQty = ''
			audiofailPlay()
			if (isUnbox.value) {
				if(formData.value.turnNumber!==''){
					formData.value.turnNumber=val
				}
				isOneClick.value =true
				getFocus()
			}
		})
		formData.value.barCode = ''
		if (!isUnbox.value) {
			getFocus()
		}
		// if(isUnbox.value&&formData.value.turnNumber==''){
		// 	getFocus()
		// }

	}
	const oneClick = () => {
		// console.log(1111);
		let data = {
			CarrierName: formData.value.turnNumber,
			userAccount: name.value,
		}
		SplitPcbToPacking(data).then(res => {
			audioSuccessPlay()
			uni.showToast({
				title: res.msg,
				icon: 'success',
			})
			// getInfoData()
			material.value.OrderNumber = ''
			material.value.ProductName = ''
			material.value.ProductDescription = ''
			material.value.PanelQty = ''
			material.value.PcbQty = ''
			isOneClick.value = true
		}).catch((error) => {
			audiofailPlay()
		})
		formData.value.barCode = ''
		getFocus()
	}

	// const sectionChange = (index) => {
	// 	curNow.value = index;
	// }
</script>

<style scoped lang="scss">
	.content {
		height: 100%;
		background: #fff;

		// position: relative;
		.box {
			padding: 0 10px;
		}

		.subox {
			position: fixed;
			bottom: 10px;
			width: 100%;
			padding: 0 10px;
			display: flex;
			gap: 100rpx;
			background-color: #fff;
		}

		.textlog {
			line-height: 20px;
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