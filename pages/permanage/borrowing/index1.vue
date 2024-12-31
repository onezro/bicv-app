<template>
	<view class="content">
		<uni-section title="工单借料" type="line" class="sect1">
			<view class="box">
				<up-form labelPosition="left" :model="formData" ref="formRef" labelWidth="80">
					<up-form-item label="物料批次条码" prop="FromContainerName" class='test'>
						<up-input placeholder="物料批次条码" :focus="locatFocus" v-model="formData.FromContainerName"
							style="height: 30px;" fontSize='13px' @confirm="submitQRCode">
						</up-input>
					</up-form-item>
					<up-form-item label="物料计划号" prop="ToMfgOrder" class='test'>
						<up-input placeholder="物料计划号" v-model="formData.FromMfgOrder" style="height: 30px;"
							fontSize='13px' disabled>
						</up-input>
					</up-form-item>
					<up-form-item label="借料计划号" prop="ToMfgOrder" class='test'>
						<up-input placeholder="借料计划号" :focus="barCodeFocus" v-model="formData.ToMfgOrder"
							style="height: 30px;" fontSize='13px' clearable @confirm="checkOrder">
							<template #suffix>
								<uni-icons type="checkbox" :color="isOrder?'#bdbdbd':'#00B400'" @click="checkOrder"
									size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
				</up-form>
				<view class="" style="display: flex;justify-content:space-between;">
					<wd-button size="small" type="info" @click="reset">重置</wd-button>
					<!-- 	<wd-button size="small" plain :disabled="formData.mfgOrder==''||formData.changemfgOrder==''"
						@click="orderList">查询转单列表</wd-button> -->
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
					<wd-button :disabled="list.length==0" size="small" @click="submitApply">申请借料</wd-button>
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
	const submitQRCode = () => {
		LendOrderMaterialBatchNo(formData.value).then(res => {
			audioSuccessPlay()
			formData.value.FromMfgOrder = res.content.FromMfgOrder
			formData.value.FromOrderType = res.content.FromOrderType
			formData.value.MaterialName = res.content.MaterialName
			formData.value.MaterialDesc = res.content.MaterialDesc
			formData.value.Quantity = res.content.Quantity
			getFocus()
		}).catch(() => {
			audiofailPlay()
			formData.value.FromContainerName = ""
		})

	}
	const checkOrder = () => {
		if (formData.value.FromMfgOrder == formData.value.ToMfgOrder) {
			audiofailPlay()
			uni.showToast({
				title: `借料单号${formData.value.ToMfgOrder}与物料单号不能相同`,
				icon: 'none',
				duration: 3000
			})
			isOrder.value = true
			formData.value.ToMfgOrder = ""
			getFocus()
			return
		}
		LendOrderMaterialToOrder(formData.value).then(res => {
			audioSuccessPlay()
			isOrder.value = false
			list.value.push({
				...formData.value
			})
			formData.value.FromContainerName=""
			
		}).catch(() => {
			audiofailPlay()
			formData.value.ToMfgOrder = ""
		})
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