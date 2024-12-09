<template>
	<view class="content">
		<view class="sect1">
		<uni-section title="基本信息" type="line" class="">
			<view class="box">
				<up-form ref="baseForm" :model="formData" :borderBottom='true' labelWidth="80">
					<!-- <up-form-item label="工位" class='test'>
						<up-input style="height: 30px;" fontSize='13px' border="surround"
							v-model="formData.workStationDec" disabled></up-input>
					</up-form-item> -->
					<up-form-item label="箱条码" class='test'>
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
	<!-- 	<uni-section title="箱体信息" type="line">
			<view class="box">
				<up-form ref="boxFormRef" :model="boxForm" :borderBottom='true' labelWidth="80">
					<up-form-item label="箱条码" class='test' prop="ContainerName">
						<up-input style="height: 30px;" fontSize='13px' border="surround"
							v-model="boxForm.ContainerName" disabled></up-input>
					</up-form-item>
					<up-row gutter="20">
						<up-col span="6">
							<up-form-item label="箱容量" class='test' prop="Capacity">
								<up-input style="height: 30px;" fontSize='13px' border="surround"
									v-model="boxForm.Capacity" disabled></up-input> 
							</up-form-item>
						</up-col>
						<up-col span="6">
							<up-form-item label="已装箱数" class='test' prop="Quantity">
								<view style="width: 90px;">
									<up-input style="height: 30px;" fontSize='13px'
										border="surround" v-model="boxForm.Quantity" disabled></up-input>
										</view>
							</up-form-item>
						</up-col>
					</up-row>
				</up-form>
			</view>
		</uni-section> -->
		</view>
		<uni-section title="送检清单" type="line" class="sect" style="flex: 1;">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-list>
					<uni-swipe-action>
						<uni-swipe-action-item v-for="(f,i) in  boxList" :key="f.ContainerName"
							:right-options="rightOptions" @click="swipeClick($event, f.ContainerName)"
							:disabled='f.Qty==0'>
							<uni-list-item :title="`箱条码：`+f.ContainerName" :rightText="'数量：'+f.Capacity" />
						</uni-swipe-action-item>
					</uni-swipe-action>
				</uni-list>
				<!-- <wd-table :data="tableData" :height="secthe" style="width: 100vw;" :index="true">
					<wd-table-col prop="sn" label="包装箱码" :sortable="true"></wd-table-col>
					<wd-table-col prop="address" label="数量" :sortable="true"></wd-table-col>
				</wd-table> -->

				<!-- <view class="" v-for="f  in boxList" style="padding: 5px;border-bottom: 1px solid #e1e2e3;">
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
				</view> -->
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
		ProductName: '',
		ProductDesc: '',
		Qty: '',
		type: '',
		Container: '',
		userAccount: name
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
				submitQRCode()
			}
		});
	}
	const submitQRCode = () => {

		const data = {
			WorkStation: formData.value.workstationName,
			CarrierName: formData.value.Container
		}
		const isEixt = boxList.value.findIndex(b => b.ContainerName == formData.value.Container)
		if (isEixt == -1) {
			// console.log(data);
			ProductInspectDetails(data).then(res => {
				boxFormRef.value.resetFields()
				formData.value.Container = ""
				if (res.success) {
					console.log(res);
					
					audioSuccessPlay()
					boxForm.value.Capacity = res.content.Capacity
					boxForm.value.ContainerName = res.content.CarrierName
					boxForm.value.Quantity = res.content.CurrentCapacity
					boxForm.value.Inspector = userStore.name
					boxForm.value.Date = getDateTody()
					boxList.value.push({
						...boxForm.value
					})
					boxForm.value=[]
				}
				getFocus()
			}).catch(() => {
				audiofailPlay()
				boxFormRef.value.resetFields()
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
		boxFormRef.value.resetFields()
	}
	const onSubmit = () => {
		let data = {
			item: [...boxList.value]
		}
		console.log(data);
		ProductInspect(data).then(res => {
			if (res.success) {
				boxFormRef.value.resetFields()
				boxList.value = []
				audioSuccessPlay()
				uni.showToast({
					title: res.msg,
					icon: 'success',
				})
				getFocus()
			}
		}).catch(() => {
			boxFormRef.value.resetFields()
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