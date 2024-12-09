<template>
	<view class="content">
		<view class="sect1">
			<uni-section title="扫描" type="line">
				<view class="box">
					<up-form ref="baseForm" :model="form" :borderBottom='true' labelWidth="65">
						<up-form-item label="工位" class='test'>
							<up-input style="height: 30px;" fontSize='13px' border="surround"
								v-model="formData.workStationDec" disabled></up-input>
						</up-form-item>
						<up-form-item label="操作类型" class='test'>
							<uni-data-checkbox v-model="form.type" :localdata="localdata" />
						</up-form-item>

						<up-form-item label="位置条码" class='test'>
							<up-input style="height: 30px;" adjustPosition fontSize='13px' border="surround"
								v-model="form.locationCode" @confirm="locationSubmit" clearable :focus="locatFocus"
								@focus="focus" @clear="clear">
								<template #suffix>
									<uni-icons type="scan" color="#bdbdbd" @click="locationClick" size="20"></uni-icons>
								</template>
							</up-input>
						</up-form-item>
						<up-form-item label="SN条码" class='test'>
							<up-input style="height: 30px;" :disabled="!isStorage" :adjustPosition="true"
								fontSize='13px' border="surround" v-model="form.SN" @confirm="submitQRCode"
								:focus="barCodeFocus" @focus="focus">
								<template #suffix>
									<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode"
										size="20"></uni-icons>
								</template>
							</up-input>
						</up-form-item>
					</up-form>
				</view>
			</uni-section>
			<uni-section title="基本信息" type="line">
				<view class="box">
					<up-form ref="baseForm" :model="formData" :borderBottom='true' labelWidth="65">
						<up-row gutter="20">
							<up-col span="7">
								<up-form-item label="工单" class='test' prop="MfgOrder">
									<up-input style="height: 30px;" fontSize='13px' border="surround"
										v-model="formData.MfgOrder" disabled></up-input>
								</up-form-item>
							</up-col>
							<up-col span="5">
								<up-form-item label="机型" class='test' prop="type">
									<view style="width: 90px;"><up-input style="height: 30px;" fontSize='13px'
											border="surround" v-model="formData.type" disabled></up-input></view>
								</up-form-item>
							</up-col>
						</up-row>
						<up-row gutter="20">
							<up-col span="7">
								<up-form-item label="产品编码" class='test' prop="ProductName">
									<up-input style="height: 30px;" fontSize='13px' border="surround"
										v-model="formData.ProductName" disabled></up-input>
								</up-form-item>
							</up-col>
							<up-col span="5">
								<up-form-item label="数量" class='test' prop="Qty">
									<view style="width: 90px;"><up-input style="height: 30px;" fontSize='13px'
											border="surround" v-model="formData.Qty" disabled></up-input></view>
								</up-form-item>
							</up-col>
						</up-row>

						<up-form-item label="产品描述" class='test' prop="ProductDesc">
							<up-textarea height="30px" class="texta" v-model="formData.ProductDesc"
								disabled></up-textarea>
						</up-form-item>

					</up-form>
				</view>
			</uni-section>
		</view>
		<uni-section title="明细" type="line" class="sect" style="flex: 1;">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<!-- 	<wd-table :data="tableData" :height="secthe" style="width: 100vw;" :index="true">
					<wd-table-col prop="sn" label="成品SN条码" :sortable="true"></wd-table-col>
					<wd-table-col prop="address" label="位置条码" :sortable="true"></wd-table-col>
				</wd-table> -->

				<uni-list>
					<uni-swipe-action>
						<uni-swipe-action-item v-for="(f ,i) in  list" :key="f" :right-options="rightOptions"
							@click="swipeClick($event, f.SN)">
							<up-cell :title="`成品SN：${f.SN}`" :value="`序号：${i+1}`">
							</up-cell>

						</uni-swipe-action-item>
					</uni-swipe-action>
				</uni-list>
			</scroll-view>
			<template v-slot:right>
				<up-button class="custom-style" type="primary" :disabled="!isStorage||list.length==0" text="提交"
					@click="onSubmit"></up-button>
			</template>
		</uni-section>
		<!-- <view class="button-box">
			<up-button class="custom-style" type="primary" v-if="isStorage" text="提交" @click="onSubmit"></up-button>
		</view> -->
	</view>
</template>

<script setup>
	import {
		ScanLocationCode,
		ScanContainer,
		AgingPitted,
		AgingOutbound
	} from "@/api/asy.js"
	import {
		onLoad,
		onReady
	} from "@dcloudio/uni-app"
	import {
		audioSuccessPlay,
		audiofailPlay
	} from "@/utils/prompt.js"
	import {
		nextTick,
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
	const form = ref({
		SN: "",
		locationCode: '',
		type: "MoveIn"
	})
	const verifyLocForm = ref({
		OpType: "MoveIn",
		LocationCode: "",
		workstationName: "",
		userAccount: name.value
	})
	const verifySnForm = ref({
		SN: "",
		workstationName: "",
		userAccount: name.value

	})
	const localdata = ref([{
		text: '入库',
		value: "MoveIn"
	}, {
		text: '出库',
		value: "MoveOut"
	}])
	const formData = ref({
		workStationDec: '',
		workstationName: '',
		MfgOrder: '',
		ProductName: '',
		ProductDesc: '',
		Qty: '',
		type: '',
		Container: '',
		userAccount: name.value
	})
	const locatFocus = ref(true)
	const barCodeFocus = ref(false)
	const secthe = ref(0)
	const rightOptions = ref([{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}])
	const list = ref([])
	const tableData = ref([])
	const isStorage = ref(true)
	const baseForm = ref()
	watch(() => form.value.type, (newVal, oldVal) => {
		verifyLocForm.value.OpType = newVal
		if (newVal == "MoveIn") {
			isStorage.value = true
			getLocatFocus()
			nextTick(() => {
				baseForm.value.resetFields()
			})
			form.value.locationCode = ""
			list.value = []

		} else {
			isStorage.value = false
			getLocatFocus()
			nextTick(() => {
				baseForm.value.resetFields()
			})
			form.value.locationCode = ""
			list.value = []
		}
	})
	onReady(() => {
		uni.createSelectorQuery().select('.sect1').boundingClientRect(data => {
			secthe.value = (uni.getSystemInfoSync().windowHeight - Math.round(data.height + 55)) + 'px'
		}).exec()

	})
	onLoad(options => {
		formData.value.workstationName = options.workStation
		verifyLocForm.value.workstationName = options.workStation
		verifySnForm.value.workstationName = options.workStation
		formData.value.workStationDec = options.workStationDec
	})
	const getFocus = () => {
		barCodeFocus.value = false
		setTimeout(() => {
			barCodeFocus.value = true
		}, 100)
	}
	const getLocatFocus = () => {
		locatFocus.value = false
		setTimeout(() => {
			locatFocus.value = true
		}, 100)
	}
	const clear = () => {
		getLocatFocus()
	}
	const focus = () => {
		uni.hideKeyboard()
	}
	const locationSubmit = (val) => {
		let barCode = form.value.locationCode
		verifyLocForm.value.LocationCode = barCode
		ScanLocationCode(verifyLocForm.value).then(res => {
			audioSuccessPlay()
			
			if (isStorage.value) {
				getFocus()
			} else {
				list.value = []
				const data = {
					OpType: form.value.type,
					workstationName: formData.value.workstationName,
					userAccount: name.value,
					LocationCode: form.value.locationCode,
					AgingPittedList: []
				}
				data.AgingPittedList = res.content.AgingPittedList
				list.value = res.content.AgingPittedList
				console.log(data);
				AgingOutbound(data).then(res => {
					if (res.success) {
						audioSuccessPlay()
						uni.showToast({
							title: res.msg,
							icon: 'success',
							duration: 2500
						})
						verifyLocForm.value.LocationCode=""
					}
					form.value.locationCode = ""
					getLocatFocus()
				}).catch(error => {
					audiofailPlay()
					form.value.locationCode = ""
					getLocatFocus()
				})
			}
		}).catch(error => {
			audiofailPlay()
			form.value.locationCode = ""
			getLocatFocus()
		})
		// let LocationCode=form.value.LocationCode
		// if (isStorage.value) {
		// 	getFocus()
		// } else {
		// 	list.value = []
		// 	QueryLocationCode(val).then(res => {
		// 		if (res.content != null) {
		// 			const data = {
		// 				WorkStation: formData.value.workstationName,
		// 				user: name.value,
		// 				LocationCode: form.value.locationCode,
		// 				AgingOutboundList: []
		// 			}
		// 			data.AgingOutboundList = res.content.AgingPittedList
		// 			list.value = res.content.AgingPittedList
		// 			// console.log(data);
		// 			AgingOutbound(data).then(res => {
		// 				if (res.success) {
		// 					audioSuccessPlay()
		// 					uni.showToast({
		// 						title: res.msg,
		// 						icon: 'success',
		// 						duration: 2500
		// 					})
		// 				}
		// 				form.value.locationCode = ""
		// 				getLocatFocus()
		// 			}).catch(error => {
		// 				audiofailPlay()
		// 				form.value.locationCode = ""
		// 				getLocatFocus()
		// 			})
		// 		} else {
		// 			audiofailPlay()

		// 			getLocatFocus()
		// 			uni.showToast({
		// 				title: `${form.value.locationCode}位置上已没有成品`,
		// 				icon: 'none',
		// 				duration: 2500
		// 			})
		// 			form.value.locationCode = ""
		// 		}
		// 	}).catch(() => {
		// 		audiofailPlay()

		// 		getLocatFocus()
		// 		uni.showToast({
		// 			title: `${form.value.locationCode}位置上已没有成品`,
		// 			icon: 'none',
		// 			duration: 2500
		// 		})
		// 		form.value.locationCode = ""

		// 	})
		// }

	}
	const locationClick = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				form.value.locationCode = res.result
			}
		});
	}
	const iconClickQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				form.value.SN = res.result
			}
		});
	}
	const submitQRCode = () => {
		baseForm.value.resetFields()
		let barCode = form.value.SN
		verifySnForm.value.SN = barCode
		if (list.value.length < 3) {
			
			ScanContainer(verifySnForm.value).then(res => {
				console.log(res);
				if (res.success) {
					let isExit = list.value.findIndex(l => l.SN == form.value.SN)
					if (isExit == -1) {
						list.value.push({
							SN: form.value.SN
						})
						formData.value.MfgOrder = res.content[0].MfgOrderName
						formData.value.type = res.content[0].BD_ProductModel
						formData.value.ProductName = res.content[0].ProductName
						formData.value.Qty = res.content[0].Qty
						formData.value.ProductDesc = res.content[0].ProductDesc
						verifySnForm.value.SN =""
						audioSuccessPlay()
					} else {
						audiofailPlay()
						uni.showToast({
							title: "SN重复",
							icon: 'none',
							duration: 2500
						})
					}

				}
				form.value.SN = ""
				getFocus()
			}).catch((error) => {
			// console.log(error);
				audiofailPlay()
				form.value.SN = ""
				getFocus()
			})
		} else {
			audiofailPlay()
			form.value.SN = ""
			getFocus()
			uni.showToast({
				title: "位置上限",
				icon: 'none',
				duration: 2500
			})
		}
	}
	const swipeClick = (e, data) => {
		list.value = list.value.filter(l => l.SN != data)
		baseForm.value.resetFields()
	}
	const onSubmit = () => {
		const data = {
			OpType: form.value.type,
			workstationName: formData.value.workstationName,
			userAccount: name.value,
			LocationCode: form.value.locationCode,
			AgingPittedList: [...list.value]
		}
		// console.log(data);
		AgingPitted(data).then(res => {
			if (res.success) {
				uni.showToast({
					title: "入库成功",
					icon: 'success',
					duration: 2500
				})
				baseForm.value.resetFields()
				list.value = []
				form.value.locationCode = ""
				audioSuccessPlay()
				getLocatFocus()
				uni.hideKeyboard()
			}
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

		.header1-text {
			margin-left: 10px;
		}

		.button-box {
			position: fixed;
			left: 0;
			bottom: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100vw;

			.custom-style {
				width: 80px;
				height: 30px;
			}
		}

		.tableHead {
			position: sticky;
			left: 0;
			top: 0;
			z-index: 99999;
			background-color: #fff;
		}

		.custom-style {
			width: 60px;
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