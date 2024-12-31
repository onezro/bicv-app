<template>
	<view class="content">
		<uni-section title="工单借料" type="line" class="sect1">
			<view class="box">
				<up-form labelPosition="left" :model="formData" ref="formRef" labelWidth="80">
					<up-form-item label="目标计划号" prop="ToMfgOrder" class='test'>
						<up-input placeholder="目标计划号" :focus="locatFocus" v-model="formData.ToMfgOrder"
							style="height: 30px;" fontSize='13px' clearable @confirm="checkOrder">
						</up-input>
					</up-form-item>
					<up-form-item label="物料批次条码" prop="FromContainerName" class='test'>
						<up-input placeholder="物料批次条码" @focus="focus" :focus="barCodeFocus" v-model="formData.FromContainerName"
							style="height: 30px;" fontSize='13px' @confirm="submitQRCode">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<up-form-item label="物料计划号" prop="ToMfgOrder" class='test'>
						<up-input placeholder="物料计划号" v-model="formData.FromMfgOrder" style="height: 30px;"
							fontSize='13px' disabled>
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
		<uni-section title="借料清单" type="line">
			<scroll-view scroll-y="true" :style="{height:secthe}">

				<uni-list :border="true">
					<uni-swipe-action>
						<uni-swipe-action-item v-for="f in  list" :key="f" :right-options="rightOptions"
							@click="swipeClick($event, f)">
							<uni-list-item :title="'物料条码：'+f.FromContainerName"
								:note="'物料计划号：'+f.FromMfgOrder+'\n物料编码：'+f.MaterialName"
								:rightText="'借料计划号：'+f.ToMfgOrder+'\n数量：'+f.Quantity"></uni-list-item>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</uni-list>

			</scroll-view>
			<template v-slot:right>
				<view class="" style="display: flex;align-items: center;">
					<wd-button size="small" :round="false" :disabled="list.length==0"  @click="submitApply">提交借料</wd-button>
				</view>
			</template>
		</uni-section>
	</view>
</template>

<script setup>
	import {
		LendOrderMaterialBatchNo,
		LendOrderMaterialToOrder,
		ApplyChangeOrderMaterialRequired
	} from '@/api/work.js'
	import {
		audioSuccessPlay,
		audiofailPlay
	} from "@/utils/prompt.js"
	import {
		ref
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
	const secthe = ref(0)
	const formData = ref({
		FromContainerName: "",
		FromMfgOrder: "",
		FromOrderType: "",
		MaterialName: "",
		MaterialDesc: "",
		Quantity: 0,
		ToMfgOrder: "",

	})
	const list = ref([])
	const locatFocus = ref(true)
	const barCodeFocus = ref(false)
	const isOrder = ref(true)
	const rightOptions = ref([{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}])
	onReady(() => {
		uni.createSelectorQuery().select('.sect1').boundingClientRect(data => {
			secthe.value = (uni.getSystemInfoSync().windowHeight - Math.round(data.height + 55)) + 'px'
		}).exec()
	})
	const getLocatFocus = () => {
		locatFocus.value = false
		setTimeout(() => {
			locatFocus.value = true
		}, 100)
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
	const iconClickQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				// console.log(res.result);
				formData.value.FromContainerName = res.result
				submitQRCode()
			}
		});
	}
	const submitQRCode = () => {
		LendOrderMaterialBatchNo(formData.value).then(res => {
			if(res.content.FromMfgOrder==formData.value.ToMfgOrder){
				audiofailPlay()
				uni.showToast({
					title: `借料单号与物料单号${res.content.FromMfgOrder}不能相同`,
					icon: 'none',
					duration: 3000
				})
				formData.value.FromContainerName = ""
				getFocus()
				return
			}
			// audioSuccessPlay()
			formData.value.FromMfgOrder = res.content.FromMfgOrder
			formData.value.FromOrderType = res.content.FromOrderType
			formData.value.MaterialName = res.content.MaterialName
			formData.value.MaterialDesc = res.content.MaterialDesc
			formData.value.Quantity = res.content.Quantity
			LendOrderMaterialToOrder(formData.value).then(res => {
				audioSuccessPlay()
				// isOrder.value = false
				list.value.push({
					...formData.value
				})
				formData.value.FromMfgOrder=""
				formData.value.FromContainerName=""
				getFocus()
			}).catch(() => {
				audiofailPlay()
				formData.value.FromMfgOrder=""
				formData.value.FromContainerName = ""
				getFocus()
			})
			
		}).catch(() => {
			audiofailPlay()
			formData.value.FromContainerName = ""
			getFocus()
		})

	}
	const checkOrder = () => {
	
			getFocus()
	}
	const submitApply = () => {

		let data = list.value.map(l => {
			return {
				mfgOrder: l.FromMfgOrder,
				changemfgOrder: l.ToMfgOrder,
				ContainerName: l.FromContainerName,
				MaterialName: l.MaterialName,
				Qty: l.Quantity,
				OperationType: "C",
				QualitylsGood: "1",
				EmployeeName: name.value
			};
		})
		ApplyChangeOrderMaterialRequired(data).then(res => {
			audioSuccessPlay()
			uni.showToast({
				title: res.msg,
				icon: 'none',
			})
			list.value=[]
		}).catch(() => {
			audiofailPlay()
		})

	}
	const swipeClick = (e, data) => {
		list.value = list.value.filter(l => l.FromContainerName != data.FromContainerName)
	}
	const reset = () => {
		list.value = []
		formData.value = {
			FromContainerName: "",
			FromMfgOrder: "",
			FromOrderType: "",
			MaterialName: "",
			MaterialDesc: "",
			Quantity: 0,
			ToMfgOrder: "",
		}
		isOrder.value = false
		getLocatFocus()
	}
</script>

<style scoped lang="scss">
	.content {
		height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;

		.box {
			padding: 0 10px;
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