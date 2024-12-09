<template>
	<view class="content">
		<uni-section title="基本信息" type="line">
			<view class="box">
				<up-form ref="baseForm" :model="formData" :borderBottom='true' labelWidth="65">
					<!-- <up-form-item label="工位" class='test'>
						<up-input style="height: 30px;" fontSize='13px' border="surround"
							v-model="formData.workStationDec" disabled></up-input>
					</up-form-item> -->
					<up-form-item label="类型" prop="type">
						<uni-data-checkbox v-model="formData.type" :localdata="localdata" />
					</up-form-item>
					<up-form-item label="扫描条码" class='test'>
						<up-input style="height: 30px;" :adjustPosition="true" fontSize='13px' border="surround"
							v-model="formData.Container" @confirm="submitQRCode" :focus="barCodeFocus" @focus="focus">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					
				</up-form>
			</view>
		</uni-section>
		<uni-section title="箱体信息" type="line">
			<view class="box">
				<up-form ref="boxFormRef" :model="boxForm" :borderBottom='true' labelWidth="80">
					<up-form-item label="周转箱条码" class='test' prop="boxCran">
						<up-input style="height: 30px;" fontSize='13px' border="surround" v-model="boxForm.boxCran"
							disabled></up-input>
					</up-form-item>
					<up-row gutter="20">
						<up-col span="6">
							<up-form-item label="箱容量" class='test' prop="capacity">
								<up-input style="height: 30px;" fontSize='13px' border="surround"
									v-model="boxForm.capacity" disabled></up-input>
							</up-form-item>
						</up-col>
						<up-col span="6">
							<up-form-item label="已装箱数" class='test'>
								<view style="width: 90px;"><up-input style="height: 30px;" fontSize='13px'
										border="surround" v-model="boxForm.qty" disabled></up-input></view>
							</up-form-item>
						</up-col>
					</up-row>
				</up-form>
			</view>
		</uni-section>
		<uni-section title="装箱明细" type="line" class="sect" style="flex: 1;">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				
				<view class="" v-for="f  in boxList" style="padding: 5px;border-bottom: 1px solid #e1e2e3;">
					<up-form ref="baseForm" :model="f" :borderBottom='true' labelAlign="rigth" labelWidth="80">
						<up-row gutter="">
							<up-col span="6">
								<up-form-item label="成品SN条码"  class='test1'>
									<text class="header1-text">{{f.sn}}</text>
								</up-form-item>
							</up-col>
							<up-col span="6">
								<up-form-item label="工单"  class='test1'>
									<text class="header1-text">{{f.order}}</text>
								</up-form-item>
							</up-col>
						</up-row>
						<up-row gutter="">
							<up-col span="6">
								<up-form-item label="产品编码"  class='test1'>
									<text class="header1-text">{{f.productName}}</text>
								</up-form-item>
							</up-col>
							<up-col span="6">
								<up-form-item label="软硬件版本"  class='test1'>
									<text class="header1-text">{{f.soflow}}</text>
								</up-form-item>
							</up-col>
						</up-row>
						<up-form-item label="产品描述"  class='test1'>
							<text class="header1-text">{{f.productDesc}}</text>
						</up-form-item>
						</up-form>
				</view>
			</scroll-view>
			<view class="button-box">
				<up-button class="custom-style"  text="重置" @click="resetForm"></up-button>
				<up-button class="custom-style" type="primary" v-if="isUnbox" :disabled="isOneClick" text="一键拆箱" @click="onSubmit"></up-button>
			</view>
		</uni-section>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onReady
	} from "@dcloudio/uni-app"
	import {
		ref,
		watch
	} from "vue"
	import useUserStore from '@/stores/user.js'
	import {
		storeToRefs
	} from 'pinia'
	const userStore = useUserStore()
	const {
		name
	} = storeToRefs(userStore)
	const formData = ref({
		workStationDec: '',
		workstationName: '',
		MfgOrder: '',
		ProductName: '',
		ProductDesc: '',
		Qty: '',
		type: 0,
		Container: '',
		userAccount: name
	})
	const barCodeFocus = ref(true)
	const secthe = ref(0)
	const boxForm = ref({
		boxCran: "ZZX20240001",
		capacity: "40",
		qty: "40"
	})
	const localdata = ref([{
		text: '拆箱',
		value: 0
	}, {
		text: '一键拆箱',
		value: 1
	}])
	const boxFormRef=ref()
	const boxList = ref([
		{
			sn:"SA240106060054",
			order:"20831182",
			productName:"241060600131",
			soflow:"2024-05-25",
			productDesc:"c测试测试",
		}
	])
	const isFocus=ref(false)
	const isUnbox = ref(false)
	const isOneClick = ref(true)
	watch(() => formData.value.type, (newValue, oldValue) => {
		isUnbox.value = newValue == 0 ? false : true
		if (newValue !== oldValue) {
			isOneClick.value = true
			getFocus()
			resetForm()
		}
	
	})

	onReady(() => {
		uni.createSelectorQuery().select('.sect').boundingClientRect(data => {
			secthe.value = ((data.height) - 45-40) + 'px'
			// console.log(data);
		}).exec()

	})
	onLoad(options => {
		formData.value.workStationDec = options.workStationDec
		formData.value.workstationName = options.workStation

	})
	const getFocus = () => {
		barCodeFocus.value = false
		setTimeout(() => {
			barCodeFocus.value = true
			// uni.hideKeyboard()
		}, 100)
	}
	const focus=()=>{
		uni.hideKeyboard()
	}
	const iconClickQRCode=()=>{
		if (boxForm.value.boxCran == '') {
			uni.showToast({
				title: '请先扫描周转条码',
				icon: 'error',
			})
			return
		}
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				// console.log(res.result);
				// formData.value.Container = res.result
				submitQRCode()
			}
		});
	}
	const submitQRCode=()=>{
		if (boxForm.value.boxCran == '') {
			uni.showToast({
				title: '请先扫描周转条码',
				icon: 'error',
			})
			return
		}
	}
	const onSubmit=()=>{
		
	}
	
	const resetForm=()=>{
		boxForm.value.boxCran=""
		boxForm.value.capacity=""
			boxForm.value.qty=""
		boxList.value=[]
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
		.button-box {
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100vw;
			height: 40px;
			background-color: #fff;
		
			.custom-style {
			
				width: 80px;
				height: 30px;
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