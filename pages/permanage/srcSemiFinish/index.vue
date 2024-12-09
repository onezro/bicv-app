<template>
	<view class="content">
		<uni-section title="入库" type="line" class="sect1">
			<view class="box">
				<up-form labelPosition="left" :model="formData" ref="formRef" labelWidth="65">
					<!-- 	<up-form-item label="工位" prop="remark" class='test'>
						<up-input style="height: 30px;" fontSize='13px' v-model="formData.workstationDec" disabled>
						</up-input>
					</up-form-item> -->
					<up-form-item label="计划单号" prop="MfgOrderName" class='test'>
						<up-input placeholder="请输入验证计划单号" style="height: 30px;" fontSize='13px' :focus="true"
							v-model="formData.MfgOrderName"  clearable @confirm="checkOrder">
							<template #suffix>
								<uni-icons type="checkbox" :color="isOrder?'#bdbdbd':'#00B400'" @click="checkOrder"
									size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<up-form-item label="库位" prop="Loc" class='test'>
						<up-input placeholder="请扫描库位" style="height: 30px;" :focus='locFocus'   clearable fontSize='13px'
							:disabled="isOrder" @focus="focus" v-model="formData.Loc" @confirm="getFocus">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconGoodQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<up-form-item label="箱条码" prop="barCode" class='test'>
						<up-input placeholder="请扫描条码" :adjustPosition="true" style="height: 30px;" fontSize='13px'
							:disabled="isOrder" @focus="focus" :focus='orderFocus' v-model="formData.barCode" @confirm="submit">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconBarQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>

					<!-- <up-row gutter="20">
						<up-col span="6">
							<up-form-item label="入库数量" prop="inquan" class='test'>
								<view style="width: 80px;"><up-input style="height: 30px;" fontSize='13px'
										:disabled="true" v-model="list.length">
									</up-input></view>
							</up-form-item>

						</up-col>
						<up-col span="6"> -->
							<up-form-item label="日期" prop="date" class='test' >
								<uni-datetime-picker type="date" :clear-icon="false" v-model="formData.InTime"  />
							</up-form-item>
					<!-- 	</up-col>
					</up-row> -->


					<up-form-item label="备注" prop="remark" class='test'>
						<up-input style="height: 30px;" fontSize='13px' placeholder="输入备注" v-model="formData.remark">
						</up-input>
					</up-form-item>
				</up-form>
			</view>

		</uni-section>
		<uni-section title="入库列表" type="line" class="sect" style="flex: 1;">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-list>
					<uni-swipe-action>
						<uni-swipe-action-item v-for="f in  list" :key="f" :right-options="rightOptions"
							@click="swipeClick($event, f)">
							<uni-list-item :title="'箱条码：'+f.BoxContainer" :note="'产品编码：'+f.ProductName"  :rightText="'数量：'+f.TotalQty" />
							<!-- <uni-list-item :title="'周转箱条码：'+f.ContainerName" :note="'备注：'+f.remark"
								:rightText="'库位：'+f.goodWei" /> -->
						</uni-swipe-action-item>
					</uni-swipe-action>
				</uni-list>
				
			</scroll-view>
			
			<!-- <view class="button-box">
				<up-button class="custom-style" type="primary" :disabled="list.length==0" text="提交入库"
					@click="onSubmit"></up-button>
			</view> -->
			<template v-slot:right>
				<view class="" style="display: flex;align-items: center;">
				数量：<text style="color: red;font-weight: bold;">{{list.length}}</text>
			   <up-button class="custom-style" style="margin-left: 10px;"  type="primary" :disabled="list.length==0" text="提交入库"
			   	@click="onSubmit"></up-button>
				</view>
			  </template>
		</uni-section> 


	</view>
</template>

<script setup>
	import {
		CheckScreenWarehousingOrder,
		PackingCarrierScreenWarehousing,
		CheckScreenWarehousingCarrier
	} from '@/api/scr.js'
	import {
		ref,
		watch,
		onBeforeMount
	} from 'vue'
	import {
		onLoad,
		onShow,
		onReady
	} from "@dcloudio/uni-app"
	import {
		audioSuccessPlay,
		audiofailPlay
	} from "@/utils/prompt.js"
	import useUserStore from '@/stores/user.js'
	import {
		storeToRefs
	} from 'pinia'
	const userStore = useUserStore()
	const {
		name
	} = storeToRefs(userStore)

	const formData = ref({
		MfgOrderName: '',
		Loc: '',
		barCode: '',
		BoxContainers: [],
		// inquan: 0,
		ERPOrder:'',
		InTime: '',
		remark: '',
		workstationName: '',
		workstationDec: '',
		userAccount: name.value,
		txnDate: ''
	})

	const material = ref({
		itemNumber: '',
		itemName: '',
		boxNumber: ''
	})
	const isOrder = ref(true)
	const orderFocus = ref(true)
	const secthe = ref(0)
	const list = ref([])
	const rightOptions = ref([{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}])
	const locFocus=ref(false)
	onReady(() => {
		
		uni.createSelectorQuery().select('.sect1').boundingClientRect(data => {
			secthe.value=(uni.getSystemInfoSync().windowHeight-Math.round(data.height+55))+'px'
		}).exec()
	})
	const focus=()=>{
		uni.hideKeyboard()
	}
	//监听工单号改变
	watch(() => formData.value.MfgOrderName, (newVal, oldVal) => {
		if (newVal !== oldVal) {
			isOrder.value = true
		}
	}, {
		deep: true,
		immediate: true
	})
	onBeforeMount(() => {
		formData.value.InTime = setDefaultDate()
	})
	const getFocus = () => {
		orderFocus.value = false
		setTimeout(() => {
			orderFocus.value = true
		}, 100)
	}

	const getLocFocus = () => {
		locFocus.value = false
		setTimeout(() => {
			locFocus.value = true
		}, 100)
	}
	//验证工单
	const checkOrder = () => {
		CheckScreenWarehousingOrder({
			MfgOrderName:formData.value.MfgOrderName
		}).then(res => {
			// console.log(res);
			isOrder.value = false
			getLocFocus()
			audioSuccessPlay()
			uni.showToast({
				title: res.msg,
				icon: 'success',
			})
		}).catch(() => {
			audiofailPlay()
		})
	}

	const submit = () => {
		if(list.value.length>=3){
			uni.showToast({
				title: '超过最大提交数',
				icon: 'error',
				duration: 2500
			})
			return
		}
		CheckScreenWarehousingCarrier({
			MfgOrderName: formData.value.MfgOrderName,
			BoxContainer: formData.value.barCode
		}).then(res => {
			formData.value.ERPOrder=res.content[0].ERPOrder==null?"":res.content[0].ERPOrder
			let isEixt = list.value.findIndex(l => l.BoxContainer == formData.value.barCode)
			if (isEixt == -1) {
				list.value.unshift({
					BoxContainer:formData.value.barCode,
					ProductName:res.content[0].ProductName,
					TotalQty:res.content[0].qty
				})
				// list.value.unshift(formData.value.barCode)
				audioSuccessPlay()
			} else {
				uni.showToast({
					title: '重复扫描!!!',
					icon: 'none',
					duration: 2500
				})
				audiofailPlay()
			}
			formData.value.barCode = ''
			getFocus()
		}).catch(() => {
			formData.value.barCode = ''
			audiofailPlay()
			getFocus()
		})

	}
	const onSubmit = () => {
		list.value.forEach((t)=>{
			formData.value.BoxContainers.push(t.BoxContainer)
		})
	// console.log(formData.value);
	
		PackingCarrierScreenWarehousing(formData.value).then(res => {
			// console.log(res);
			audioSuccessPlay()
			uni.showToast({
				title: '入库成功',
				icon: 'success',
			})
			list.value = []
			formData.value.remark = '',
			formData.value.BoxContainers=[]
			formData.value.InTime = setDefaultDate()
		}).catch((error) => {
			audiofailPlay()
			formData.value.BoxContainers=[]
			formData.value.InTime = setDefaultDate()
			
		})
		// console.log(formData.value);
	}
	const swipeClick = (e, data) => {
		list.value = list.value.filter(l => l.BoxContainer != data.BoxContainer)
	}

	const setDefaultDate = () => {
		// 获取当前日期  
		const now = new Date();
		// 格式化日期为YYYY-MM-DD  
		const formattedDate =
			`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
		// 设置currentValue  
		// formData.value.InTime = formattedDate;
		return formattedDate
	}

	const iconGoodQRCode = () => {
		if (!isOrder.value) {
			uni.scanCode({
				onlyFromCamera: true,
				scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
				success: res => {
					formData.value.Loc = res.result
				}
			});
		}

	}
	const iconBarQRCode = () => {
		if (!isOrder.value) {
			uni.scanCode({
				onlyFromCamera: true,
				scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
				success: res => {
					formData.value.barCode = res.result
					submit()
				}
			});
		}
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
			bottom: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100vw;

			.custom-style {
				width: 80px;
				height: 28px;
			}
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

	.texta .uni-textarea-textarea {
		font-size: 13px;
	}
</style>