<template>
	<view class="content">
		<uni-section title="拆箱" type="line" class="sect1">
			<view class="box">
				<up-form labelPosition="left" :model="formData" ref="formRef" labelWidth="100">
					<up-form-item label="类型" prop="type" class='test'>
						<uni-data-checkbox v-model="formData.type" :localdata="localdata" />
					</up-form-item>
					<up-form-item label="扫描条码" prop="barCode" class='test'>
						<up-input placeholder="请扫描条码" @focus="focus" :focus="barCodeFocus" v-model="formData.barCode"
							@confirm="submit" style="height: 30px;" fontSize='13px'>
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconBarQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<up-form-item label="周转箱条码" prop="turnNumber" class='test'>
						<up-input v-model="formData.turnNumber" :disabled="true" style="height: 30px;" fontSize='13px'>
						</up-input>

					</up-form-item>
				</up-form>
			</view>
		</uni-section>
		<uni-section title="装箱明细" type="line">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-list :border="true">
					<uni-list-item v-for="item in list" :title="'成品条码：'+item.ContainerName" :note="'产品编号：'+item.ProductName+'\n产品描述：'+item.ProductDesc"
						:rightText="'计划单号：'+item.MfgOrderName"></uni-list-item>
				</uni-list>
			
			</scroll-view>
			<template v-slot:right>
				<view class="" style="display: flex;align-items: center;">
				<view class="" style="padding-right: 15px;">	<wd-button  type="info" size="small" @click="resetForm"
				>重置</wd-button></view>
			
				<wd-button type="primary" size="small" @click="oneClick"
					v-if="isUnbox" :disabled="isOneClick">一键拆箱</wd-button></view>
			</template>
		</uni-section>
		<!-- <view class="subox">
			<up-button text="重置" @click="resetForm"></up-button>
			<up-button type="primary" text="一键拆箱" @click="oneClick" v-if="isUnbox" :disabled="isOneClick"></up-button>
		</view> -->
	</view>
</template>

<script setup>
	import {
		QueryPackingInfoByBox,
		OnekeyFinishedSNToPacking,
		SplitFinishedSNToPacking
	} from "@/api/asy.js"
	import {
		audioSuccessPlay,
		audiofailPlay
	} from "@/utils/prompt.js"
	import {
		ref,
		watch,
		nextTick
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
		// material.value.OrderNumber = ''
		// material.value.ProductName = ''
		// material.value.ProductDescription = ''
		// material.value.PanelQty = ''
		// material.value.PcbQty = ''
		list.value=[]
		formData.value.turnNumber = ''
		formData.value.barCode = ''
	}
	const barCodeFocus = ref(true)
	const isOneClick = ref(true)
		const secthe = ref(0)
	const list=ref([])
	watch(() => formData.value.type, (newValue, oldValue) => {
		isUnbox.value = newValue === 0 ? false : true
		if (newValue !== oldValue) {
			isOneClick.value = true
			getFocus()
			restMaterial()
		}

	})
	onReady(() => {
	
		uni.createSelectorQuery().select('.sect1').boundingClientRect(data => {
			secthe.value = (uni.getSystemInfoSync().windowHeight - Math.round(data.height + 55)) + 'px'
		}).exec()
	
	})
	const getFocus = () => {
		barCodeFocus.value = false
		setTimeout(() => {
			barCodeFocus.value = true
		}, 100)
	}
	const focus=()=>{
		setTimeout(() => {
		uni.hideKeyboard()
		}, 100) 
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
					BoxBarcode: formData.value.turnNumber,
					ContainerName: formData.value.barCode,
					userAccount: name.value,
				}
				SplitFinishedSNToPacking(data).then(res => {
				
					audioSuccessPlay()
					if(list.value.length==1){
						list.value=[]
						// formData.value.turnNumber=""
					}else{
						getInfoData(formData.value.turnNumber)
					}
					
					uni.showToast({
						title: res.msg,
						icon: 'none',
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
		QueryPackingInfoByBox(val).then((res) => {
			formData.value.turnNumber = val
			// console.log(res);
			list.value=res.content
			// material.value = {
			// 	...res.content[0]
			// }
			audioSuccessPlay()
			if (isUnbox.value) {
				isOneClick.value = false
				// barCodeFocus.value=false
			}
		}).catch((error) => {
			// restMaterial()
			// material.value.OrderNumber = ''
			// material.value.ProductName = ''
			// material.value.ProductDescription = ''
			// material.value.PanelQty = ''
			// material.value.PcbQty = ''
			list.value=[]
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
		// let data = {
		// 	CarrierName: formData.value.turnNumber,
		// 	userAccount: name.value,
		// }
		let data= formData.value.turnNumber
		OnekeyFinishedSNToPacking(data).then(res => {
			audioSuccessPlay()
			uni.showToast({
				title: res.msg,
				icon: 'none',
			})
			isOneClick.value = true
			list.value=[]
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


</style>