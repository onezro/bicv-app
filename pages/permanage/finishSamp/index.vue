<template>
	<view class="content">
		<view class="sect1">
			<uni-section title="基本信息" type="line" class="">
				<view class="box">
					<up-form ref="baseForm" :model="formData" :borderBottom='true' labelWidth="80">
						<up-form-item label="计划单号" prop="MfgOrderName" class='test'>
							<up-input placeholder="计划单号" v-model="formData.MfgOrderName" disabled style="height: 30px;"
								fontSize='13px'>
							</up-input>
						</up-form-item>
						<up-form-item label="箱条码" class='test'>
							<up-input style="height: 30px;" :adjustPosition="true" fontSize='13px' border="surround"
								v-model="formData.Container" @confirm="submitQRCode" :focus="barCodeFocus"
								@focus="focus">
								<template #suffix>
									<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode"
										size="20"></uni-icons>
								</template>
							</up-input>
						</up-form-item>

					</up-form>
					<view class="" style="display: flex;justify-content: flex-end;">
						<view class="">
						<wd-button size="small" :round="false" type="info" @click="reset">重置</wd-button>
						</view>
					</view>
				</view>
			</uni-section>

		</view>
		<uni-section title="送检清单" type="line" class="sect" style="flex: 1;">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-list>
					<uni-swipe-action>
						<uni-swipe-action-item v-for="(f,i) in  boxList" :key="f.ContainerName"
							:right-options="rightOptions" @click="swipeClick($event, f.ContainerName)"
							:disabled='f.Qty==0'>
							<uni-list-item :title="`箱条码：`+f.ContainerName" :rightText="'计划单号：'+f.MfgOrderName" />
						</uni-swipe-action-item>
					</uni-swipe-action>
				</uni-list>

			</scroll-view>
			<template v-slot:right>
				<up-button class="custom-style" type="primary" :disabled="boxList.length==0" text="送检提交"
					@click="onSubmit"></up-button></template>
			<!-- <view class="button-box">

				<up-button class="custom-style" type="primary" :disabled="boxList.length==0" text="送检提交" @click="onSubmit"></up-button>
			</view> -->
		</uni-section>
	</view>
</template>

<script setup>
	import {
		ProductInspect,
		ProductInspectDetails
	} from "@/api/asy.js"
	import {
		getDateTody
	} from "@/utils/dateFormat.js"
	import {
		audioSuccessPlay,
		audiofailPlay
	} from "@/utils/prompt.js"
	import {
		onLoad,
		onReady
	} from "@dcloudio/uni-app"
	import {
		ref
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
		MfgOrderName: "",
		ProductName: '',
		ProductDesc: '',
		Qty: '',
		type: '',
		Container: '',
		userAccount: name.value
	})
	const barCodeFocus = ref(true)
	const secthe = ref(0)
	const boxForm = ref({
		ContainerName: "",
		Capacity: "",
		Quantity: "",
		Date: "",
		Inspector: name.value
	})
	const boxFormRef = ref()
	const boxList = ref([])
	const isFocus = ref(false)
	const tableData = ref([])
	const rightOptions = ref([{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}])

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
	onReady(() => {
		uni.createSelectorQuery().select('.sect1').boundingClientRect(data => {
			secthe.value = (uni.getSystemInfoSync().windowHeight - Math.round(data.height + 55)) + 'px'
		}).exec()

	})
	onLoad(options => {
		// formData.value.workStationDec = options.workStationDec
		// formData.value.workstationName = options.workStation

	})
	const iconClickQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				formData.value.Container = res.result
				submitQRCode()
			}
		});
	}
	const submitQRCode = () => {

		const data = {
			CarrierName: formData.value.Container
		}
		const isEixt = boxList.value.findIndex(b => b.ContainerName == formData.value.Container)
		if (isEixt == -1) {
			ProductInspectDetails(data).then(res => {
				if(formData.value.MfgOrderName==""){
					formData.value.MfgOrderName=res.content.MfgOrderName
				}
				console.log(res.content);
				if(res.content.MfgOrderName==formData.value.MfgOrderName){
					audioSuccessPlay()
					formData.value.MfgOrderName=res.content.MfgOrderName
					boxForm.value.ContainerName = res.content.CarrierName
					boxForm.value.userAccount = name.value
					boxForm.value.MfgOrderName = res.content.MfgOrderName
					boxForm.value.Inspector = name.value
					boxList.value.push({
						...boxForm.value
					})
					boxForm.value = []
				}else{
					audiofailPlay()
					uni.showToast({
						title: `${res.content.MfgOrderName}计划单号不一致`,
						icon: 'none',
					})
				}
				
				formData.value.Container = ""
				getFocus()
			}).catch(() => {
				audiofailPlay()
				// boxFormRef.value.resetFields()
				formData.value.Container = ""
				getFocus()

			})
		} else {
			formData.value.Container = ""
			getFocus()
			audiofailPlay()
			uni.showToast({
				title: "箱条码重复",
				icon: 'none',
			})
		}

	}
	const swipeClick = (e, val) => {
		// console.log(val);
		boxList.value = boxList.value.filter(l => l.ContainerName != val)
		// boxFormRef.value.resetFields()
	}
	const onSubmit = () => {
		let data = {
			item: [...boxList.value]
		}
		// console.log(data);
		ProductInspect(data).then(res => {
			if (res.success) {
				// boxFormRef.value.resetFields()
				boxList.value = []
				formData.value.MfgOrderName=""
				audioSuccessPlay()
				uni.showToast({
					title: res.msg,
					icon: 'none',
				})
				getFocus()
			}
		}).catch(() => {
			// boxFormRef.value.resetFields()
			formData.value.Container = ""
			getFocus()
			audiofailPlay()
		})
	}

	const resetForm = () => {
		boxForm.value.boxCran = ""
		boxForm.value.capacity = ""
		boxList.value = []
	}
	const reset=()=>{
		boxList.value=[]
		formData.value.MfgOrderName=""
		formData.value.Container=""
		getFocus()
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

		// .button-box {
		// 	position: fixed;
		// 	left: 0;
		// 	bottom: 0;
		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: center;
		// 	width: 100vw;
		// 	height: 40px;
		// 	background-color: #fff;

		// 	.custom-style {

		// 		width: 80px;
		// 		height: 30px;
		// 	}
		// }
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