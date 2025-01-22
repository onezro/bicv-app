<template>
	<view class="content">
		<uni-section title="转产工单" type="line" class="sect1">
			<view class="box">
				<up-form labelPosition="left" :model="formData" ref="formRef" labelWidth="70">
					<up-form-item label="当前单号" prop="mfgOrder" class='test'>
						<up-input placeholder="当前单号" :focus="locatFocus" v-model="formData.mfgOrder"
							style="height: 30px;" fontSize='13px' clearable @confirm="submitQRCode"
							@clear="clearOrder1">
						</up-input>
					</up-form-item>
					<up-form-item label="目标单号" prop="changemfgOrder" class='test'>
						<up-input placeholder="目标单号" :focus="barCodeFocus" v-model="formData.changemfgOrder"
							style="height: 30px;" fontSize='13px' clearable @confirm="submitShelves"
							@clear="clearOrder2">
						</up-input>
					</up-form-item>
				</up-form>
				<view class="" style="display: flex;justify-content: flex-end ;">
					<view class="">
					<wd-button size="small" :round="false" type="info" @click="reset">重置</wd-button></view>
					<view class="" style="margin-left: 10px;">
					<wd-button size="small" :round="false" :disabled="formData.mfgOrder==''||formData.changemfgOrder==''"
						@click="orderList">查询转单列表</wd-button></view>
				</view>
			</view>
		</uni-section>
		<uni-section title="转产物料清单" type="line">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-list>
					<uni-list :border="true">
						<uni-list-item v-for="item in list" :title="'物料条码：'+item.ContainerName"
							:note="'物料编码：'+item.MaterialName" :rightText="'数量：'+item.Qty"></uni-list-item>
					</uni-list>
				</uni-list>
			</scroll-view>
			<template v-slot:right>
				<view class="" style="display: flex;align-items: center;">
					<wd-button :round="false" :disabled="list.length==0||formData.mfgOrder==''||formData.changemfgOrder==''"
						size="small" @click="submitApply">提交转产</wd-button>
				</view>
			</template>
		</uni-section>
	</view>
</template>

<script setup>
	import {
		findOrder,
		QueryChangeOrderMaterialRequired,
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
		mfgOrder: "",
		changemfgOrder: "",
		FromOrderType: "",
		ToOrderType: "",
	})
	const list = ref([])
	const locatFocus = ref(true)
	const barCodeFocus = ref(false)

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
		findOrder({
			orderName: formData.value.mfgOrder
		}).then(res => {
			formData.value.FromOrderType = res.content[0].OrderTypeName
			getFocus()
		}).catch(() => {
			audiofailPlay()
			formData.value.mfgOrder = ""
		})
	}
	const submitShelves = () => {
		if (formData.value.mfgOrder !== formData.value.changemfgOrder) {
			findOrder({
				orderName: formData.value.changemfgOrder
			}).then(res => {
				formData.value.ToOrderType = res.content[0].OrderTypeName
				if (formData.value.mfgOrder != "") {
					getMaterList()
				}
			}).catch(() => {
				audiofailPlay()
				formData.value.changemfgOrder = ""
			})
		} else {
			audiofailPlay()
			uni.showToast({
				title: `转产不能是同一个单号`,
				icon: 'none',
			})
		}

	}
	const orderList = () => {
		if (formData.value.mfgOrder !== formData.value.changemfgOrder) {
			findOrder({
				orderName: formData.value.mfgOrder
			}).then(res => {
				formData.value.FromOrderType = res.content[0].OrderTypeName
			})
			findOrder({
				orderName: formData.value.changemfgOrder
			}).then(res => {
				formData.value.ToOrderType = res.content[0].OrderTypeName
			})
			getMaterList()
		} else {
			audiofailPlay()
			uni.showToast({
				title: `转产不能是同一个单号`,
				icon: 'none',
			})
		}
	}
	const clearOrder1 = () => {
		formData.value.FromOrderType = ""
		list.value = []
	}
	const clearOrder2 = () => {
		formData.value.ToOrderType = ""
		list.value = []
	}
	const getMaterList = () => {
		let data = {
			FromMfgOrder: formData.value.mfgOrder,
			FromOrderType: formData.value.FromOrderType,
			ToMfgOrder: formData.value.changemfgOrder,
			ToOrderType: formData.value.ToOrderType
		}
		QueryChangeOrderMaterialRequired(data).then(res => {
			list.value = res.content
			// console.log(res.content);
		})
	}
	const submitApply = () => {
		let isApply = list.value.find(l => l.MaterialQueue !== "")
		if (isApply == undefined) {
			let data = list.value.map(l => {
				return {
					mfgOrder: formData.value.mfgOrder,
					changemfgOrder: formData.value.changemfgOrder,
					ContainerName: l.ContainerName,
					MaterialName: l.MaterialName,
					Qty: l.Qty,
					MaterialQueue: l.MaterialQueue,
					OperationType:"C",
					QualitylsGood:"1 ",
					EmployeeName: name.value
				};
			})
			ApplyChangeOrderMaterialRequired(data).then(res => {
				audioSuccessPlay()
				getMaterList()
				uni.showToast({
					title: res.msg,
					icon: 'none',
				})
			}).catch(() => {
				audiofailPlay()
			})
		} else {
			audiofailPlay()
			uni.showToast({
				title: `物料${isApply.MaterialName}已上料，不可转产`,
				icon: 'none',
			})
		}

	}
	const reset = () => {
		list.value = []
		formData.value = {
			mfgOrder: "",
			changemfgOrder: "",
			FromOrderType: "",
			ToOrderType: "",
		}
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