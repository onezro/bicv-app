<template>
	<view class="content" ref="content">
		<uni-section title="基本信息" type="line" class="sect1">
			<view class="box">
				<up-form ref="baseForm" :model="formData" :borderBottom='true' labelWidth="65">
					<up-form-item label="工位" class='test'>
						<up-input style="height: 30px;" fontSize='13px' border="surround"
							v-model="formData.workStationDec" disabled></up-input>
					</up-form-item>
					<up-form-item label="工单" class='test'>
						<uni-data-select v-model="formData.MfgOrder" :localdata="orderList" @change="change"
							:clear="false" style="height: 30px;"></uni-data-select>
					</up-form-item>
					<up-row gutter="20">
						<up-col span="7">

							<up-form-item label="产品编码" class='test'>
								<up-input style="height: 35px;" fontSize='13px' border="surround"
									v-model="formData.ProductName" disabled></up-input>
							</up-form-item>
						</up-col>
						<up-col span="5">
							<up-form-item label="数量" class='test'>
								<view style="width: 90px;"><up-input style="height: 30px;" fontSize='13px'
										border="surround" v-model="formData.Qty" disabled></up-input></view>
							</up-form-item>
						</up-col>
					</up-row>

					<up-form-item label="产品描述" class='test'>
						<!-- <up-input style="height: 30px;" fontSize='13px' border="surround"  v-model="formData.ProductDesc"
							disabled></up-input> -->
						<up-textarea height="35px" class="texta" v-model="formData.ProductDesc" disabled></up-textarea>
					</up-form-item>

					<up-form-item label="批次条码" class='test'>
						<up-input style="height: 30px;" :adjustPosition="false" fontSize='13px' border="surround"
							v-model="formData.Container" @focus="focus" @confirm="submitQRCode" :focus="barCodeFocus">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
				</up-form>
			</view>
		</uni-section>
		<uni-section :title="'物料需求清单'" type="line" id="sect" style="flex: 1" ref="sectionRef">
			<!--  minHeight:`calc(100% - ${height1}px)`-->
			<scroll-view scroll-y="true" :style="{height:secthe,minHeight:`calc(100vh- ${height1}px)`}">
				<!-- <view class="" style="hieght:100%;overflow: auto;"> -->
					<uni-card margin="10px" padding="5px" spacing='0px' v-for="f in feedList" :key="f.MaterialName">
						<up-form ref="baseForm" :model="f" :borderBottom='true' labelAlign='right' labelWidth="60">
							<up-row gutter="20">
								<up-col span="7">
									<up-form-item label="物料编码" :borderBottom='true' class='test1'>
										<text class="header1-text">{{f.MaterialName}}</text>
									</up-form-item>
								</up-col>
								<up-col span="5">
									<up-form-item label="单件用量" :borderBottom='true' class='test1'>
										<text class="header1-text">{{f.QtyRequired}}</text>
									</up-form-item>
								</up-col>
							</up-row>
							<up-row gutter="20">
								<up-col span="12">
									<up-form-item label="物料描述" :borderBottom='true' class='test1'>
										<text class="header1-text">{{f.MaterialDesc}}</text>
									</up-form-item>
								</up-col>
							</up-row>
							<up-row gutter="20">
								<up-col span="7">
									<up-form-item label="主料" :borderBottom='true' class='test1'>
										<text class="header1-text" v-if="f.isMater === 1">是</text>
										<text class="header1-text"
											v-if="f.isMater === 0">否{{ `(${f.originalMaterialName})` }}</text>
									</up-form-item>
								</up-col>
								<up-col span="5">
									<up-form-item label="需求数" :borderBottom='true' class='test1'>
										<text class="header1-text">{{f.TotalQtyRequired}}</text>
									</up-form-item>
								</up-col>
							</up-row>
							<up-row gutter="20">
								<up-col span="6">
									<up-form-item label="上料总量" :borderBottom='true' class='test1'>
										<text class="header1-text"
											style="color:#ffcd50;font-weight: bold;">{{f.LoadQueueQty}}</text>
									</up-form-item>
								</up-col>
								<up-col span="6">
									<up-button type="primary" text="下料" :disabled="f.LoadQueueQty==0" size='mini'
										style="width: 30px;" @click="feedDec(f)"></up-button>
								</up-col>
							</up-row>
						</up-form>
					</uni-card>

				<!-- </view> -->
			</scroll-view>
			<up-popup :show="show" mode="bottom" safeAreaInsetBottom closeable @close="close" @open="open">
				<view class="" style="height: 70vh;">
					<view class="title" style="width: 90vw;position: sticky;left: 0;top: 0;">
						<uni-list :border="false">
							<uni-list-item :border="false" :title="'物料编码：'+feedHeadList.MaterialName"
								:note="'物料描述：'+feedHeadList.MaterialDesc"
								:rightText="'上料总量：'+feedHeadList.LoadQueueQty" />
						</uni-list>
					</view>
					<scroll-view :scroll-top="scrollTop" scroll-y="true" style="height:100%;padding-bottom: 120px;">
						<uni-list>
							<uni-swipe-action>
								<uni-swipe-action-item v-for="f in  feedDetilList" :key="f.ContainerName"
									:right-options="rightOptions" @click="swipeClick($event, f)" :disabled='f.Qty==0'>
									<uni-list-item :title="'批次条码：'+f.ContainerName"
										:note="f.VendorLotNumber===null?'批次号：'+'&nbsp;&nbsp;&nbsp;上料量：'+f.LoadQueueQty:'批次号：'+f.VendorLotNumber+'&nbsp;&nbsp;&nbsp;上料量：'+f.LoadQueueQty"
										:rightText="'剩余量：'+f.Qty" />
								</uni-swipe-action-item>
							</uni-swipe-action>
						</uni-list>
					</scroll-view>
				</view>
			</up-popup>
		</uni-section>

	</view>
</template>

<script setup>
	import {
		ref,
		nextTick,
		onMounted,
		onBeforeUnmount
	} from 'vue'
	import {
		audioSuccessPlay,
		audiofailPlay
	} from "@/utils/prompt.js"
	import {
		OrderQuery,
		QueryOrderMaterialRequired,
		QueryMaterialQueueDetails,
		UnLoadMaterialQueue,
		LoadMaterialQueue,
		// QuerySpecBystation
	} from '@/api/index.js'
	import {
		QuerySpecBystation
	} from '@/api/dip.js'
	import {
		onLoad,
		onReady,
		onShow
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
		workStationDec: '',
		workstationName: '',
		MfgOrder: '',
		ProductName: '',
		ProductDesc: '',
		Qty: '',
		Container: '',
		userAccount: name
	})
	const getFeedForm = ref({
		MfgOrder: '',
		workstationName: '',
		SpecName: "",
	})
	//获取明细
	const getDetailForm = ref({
		MfgOrder: '',
		Container: "",
		MaterialName: "",
		workstationName: '',
		userAccount: name,
	});
	const orderList = ref([])
	const feedList = ref([])
	const feedDetilList = ref([])
	const show = ref(false)
	const feedHeadList = ref({})
	const rightOptions = ref([{
		text: '下料',
		style: {
			backgroundColor: '#F56C6C'
		}
	}])
	//下料form
	const unformData = ref({
		MfgOrder: '',
		Container: "",
		MaterialName: "",
		workstationName: '',
		userAccount: name,
	});
	const barCodeFocus = ref(false)
	// const titleQty = ref(0)
	const secthe = ref(0)
	const line = ref('')
	const height1 = ref('')
	const sectionRef = ref()
	const content = ref()
	onLoad(options => {
		formData.value.workStationDec = options.workStationDec
		formData.value.workstationName = options.workStation
		getFeedForm.value.workstationName = options.workStation
		getDetailForm.value.workstationName = options.workStation
		unformData.value.workstationName = options.workStation
		line.value = options.line
		QuerySpecBystation(options.workStation).then(res => {
			getFeedForm.value.SpecName = res.content[0].SpecName
			// console.log(res.content);
		})
	
			// getHieght()
	})
	onReady(() => {
		getHieght()
	})
	// onShow(()=>{
		
	// 	getHieght()
	// 	// console.log(1);
	// })

	onMounted(() => {
		getOrder()
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
	//获取高度
	const getHieght = () => {
		uni.createSelectorQuery().select('.sect1').boundingClientRect(data => {
			secthe.value=(uni.getSystemInfoSync().windowHeight-Math.round(data.height+48))+'px'
		}).exec()
	}
	//获取工单
	const getOrder = () => {
		OrderQuery({
			lineName: line.value
		}).then(res => {
			orderList.value = res.content.map(c => {
				return {
					...c,
					value: c.MfgOrderName,
					text: c.MfgOrderName,
				}
			})
		})
	}
	//选择工单
	const change = (val) => {
		let data = orderList.value.find(o => val == o.MfgOrderName)
		formData.value.ProductName = data.ProductName
		formData.value.ProductDesc = data.ProductDesc
		formData.value.Qty = data.Qty
		getFeedForm.value.MfgOrder = data.MfgOrderName
		unformData.value.MfgOrder = data.MfgOrderName
		getFeedData()
		getFocus()
		focus()
	}

	const submitQRCode = () => {
		if (formData.value.MfgOrder == '') {
			uni.showToast({
				title: '请先选择工单',
				icon: 'error',
			})
			return
		}
		console.log(formData.value);
		LoadMaterialQueue(formData.value).then(res => {
			audioSuccessPlay()
			getFeedData()
			uni.showToast({
				title: res.msg,
				icon: 'none',
			})
			getFocus()
		}).catch(() => {
			audiofailPlay()
		})
		formData.value.Container = ''
		getFocus()
	}
	const iconClickQRCode = () => {
		if (formData.value.MfgOrder == '') {
			uni.showToast({
				title: '请先选择工单',
				icon: 'error',
			})
			return
		}
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				// console.log(res.result);
				formData.value.Container = res.result
				submitQRCode()
			}
		});
	}
	//打开获取物料明细弹窗
	const feedDec = (val) => {
		// console.log(val);
		feedHeadList.value = val
		getDetailForm.value.MfgOrder = val.MfgOrderName
		getDetailForm.value.MaterialName = val.MaterialName;
		getFeedDetail()
		show.value = true
		// console.log(feedHeadList.value);
	}
	//获取需求清单
	const getFeedData = (data) => {
		console.log(getFeedForm.value);
		QueryOrderMaterialRequired(getFeedForm.value).then(res => {
			console.log(res.content);
			feedList.value = res.content
			upDataQty()
		})
	}
	//获取物料明细
	const getFeedDetail = () => {
		console.log(getDetailForm.value);
		QueryMaterialQueueDetails(getDetailForm.value).then(res => {
			console.log(res.content);
			feedDetilList.value = res.content
		})
	}
	const close = () => {
		show.value = false
	}
	const disabledScroll = () => {
		return
	}
	const swipeClick = (e, data) => {
		// console.log(data);
		unformData.value.Container = data.ContainerName;
		unformData.value.MaterialName = data.MaterialName;
		UnLoadMaterialQueue(unformData.value).then((res) => {
			audioSuccessPlay()
			getFeedData()
			getFeedDetail()
			uni.showToast({
				title: res.msg,
				icon: 'success',
			})
			upDataQty()
		}).catch(() => {
			audiofailPlay()
		})
	}
	const upDataQty = () => {
		let data = feedList.value.find(f =>
			feedHeadList.value.MaterialName == f.MaterialName
		)
		feedHeadList.value.LoadQueueQty = data.LoadQueueQty
		// console.log(data);
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