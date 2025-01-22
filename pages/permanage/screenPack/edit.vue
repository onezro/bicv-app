<template>
	<view class="content">
		<uni-section title="基本信息" type="line" class="secthieght">
			<view class="box">
				<up-form labelAlign="left" :model="formData" ref="formRef" labelWidth="80px">
					<up-form-item label="工位" class='test'>
						<up-input v-model="formData.workStationDec" disabled style="height: 30px;" fontSize='13px'>
						</up-input>
					</up-form-item>
					<up-form-item label="计划单号" class='test'>
						<uni-data-select v-model="formData.MfgOrderName" :localdata="orderList" @change="change"
							:clear="false" style="height: 30px;"></uni-data-select>
					</up-form-item>
					<up-form-item label="产品描述" class='test'>
						<!-- <text style="font-size: 13px;">{{formData.ProductDesc}}</text> -->
						<up-textarea height="35px" class="texta" v-model="formData.ProductDesc" disabled></up-textarea>
					</up-form-item>
					
					<up-form-item label="包装数" class='test'>
						<up-number-box v-model="formData.count" ></up-number-box>
					</up-form-item>

					<up-form-item label="屏条码" class='test'>
						<up-input :focus="barCodeFocus" @focus="focus" v-model="formData.ScreenBarCode"
							@confirm="submitQRCode" style="height: 30px;" fontSize='13px'>
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<up-form-item label="备注" class='test'>
						<up-input v-model="formData.Remark"  style="height: 30px;" fontSize='13px'>
						</up-input>
					</up-form-item>
				</up-form>
			</view>
		</uni-section>
		<uni-section :title="'包装明细'" type="line">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-list>
					<uni-swipe-action>
						<uni-swipe-action-item v-for="(f,i) in  list" :key="f" :right-options="rightOptions"
							@click="swipeClick($event, f)">
							<uni-list-item :title="'屏条码：'+f.ScreenBarCode" :rightText="'序号：'+(i+1)" />

						</uni-swipe-action-item>
					</uni-swipe-action>
				</uni-list>
			</scroll-view>
			<template v-slot:right>
				<view class="" style="display: flex;align-items: center;">
					数量：<text style="color: red;font-weight: bold;">{{list.length}}</text>
					<up-button type="primary" :disabled="list.length==0" text="提交" style="margin-left: 10px;"
						class="custom-style" @click="submitList"></up-button>
				</view>
			</template>
		</uni-section>

	</view>
</template>

<script setup>
	// import {} from "@/api/scr.js"
	import {
		OrderQuery
	} from '@/api/smt.js'
	import {
		JudgeScreenBarCodeNews,
		AssociationScreenAndBoxBarCodeNews
	} from "@/api/scr.js"
	import {
		ref,
		nextTick,
		onMounted,
		onBeforeUnmount,
		watch
	} from 'vue'
	import {
		onLoad,
		onReady,
		onShow
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
		workstationName: "",
		workStationDec: "",
		MfgOrderName: "",
		ScreenBarCode: "",
		ProductDesc:"",
		Remark:"",
		count: 1
	})
	const secthe = ref(0)
	const line = ref("")
	const orderList = ref([])
	const barCodeFocus = ref(false)
	const list = ref([])
	const rightOptions = ref([{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}])
	// watch(() => barCodeFocus.value, (newVal) => {
	// 	// console.log(newVal);
	// 	if (newVal) {
	// 		focus()
	// 	}
	// })
	onReady(() => {
		getHieght()
	})
	onLoad(options => {
		formData.value.workstationName = options.workStation
		formData.value.workStationDec = options.workStationDec
		line.value = options.line
	})
	onMounted(() => {
		getOrder()
	})

	//获取工单
	const getOrder = () => {
		// console.log( line.value);
		OrderQuery({
			lineName: line.value
		}).then(res => {
			// console.log(res.content);
			orderList.value = res.content.map(c => {
				return {
					...c,
					value: c.MfgOrderName,
					text: c.MfgOrderName,
				}
			})
		})
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
	const change = (val) => {
		// console.log(val);
		const changeObj=orderList.value.find(o=>o.value==val)
		formData.value.ProductDesc=changeObj.ProductDesc
		getFocus()
		formData.value.Remark=""
	}
	const iconClickQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				// console.log(res.result);
				formData.value.ScreenBarCode = res.result
				submitQRCode()
			}
		});
	}
	const submitQRCode = () => {
		if (formData.value.MfgOrderName == "") {
			uni.showToast({
				title: `请选择计划单号`,
				icon: 'none',
				duration: 2500
			})
			return
		}
		let barCode = formData.value.ScreenBarCode
		let data = {
			ScreenBarCode: barCode,
			MfgOrderName: formData.value.MfgOrderName,
			workstationName: formData.value.workstationName,
			userAccount: name.value,
		}
		JudgeScreenBarCodeNews(data).then(res => {
			// console.log(res);
			let isEixt = list.value.findIndex(l => l.ScreenBarCode == barCode)
			if (isEixt == -1) {
				if(list.value.length<formData.value.count){
					list.value.push({
						ScreenBarCode: barCode
					})
					audioSuccessPlay()
				}else{
					audiofailPlay()
					uni.showToast({
						title: `超过包装数`,
						icon: 'none',
						duration: 2500
					})
					return
				}
				
			} else {
				audiofailPlay()
				uni.showToast({
					title: `重复扫描`,
					icon: 'none',
					duration: 2500
				})
			}
			formData.value.ScreenBarCode = ""
			getFocus()
		}).catch(error => {
			audiofailPlay()
			formData.value.ScreenBarCode = ""
			getFocus()
		})
	}
	const submitList = () => {
		let data = {
			ScreenBarCodeList: [],
			MfgOrderName: formData.value.MfgOrderName,
			workstationName: formData.value.workstationName,
			userAccount: name.value,
			Remark:formData.value.Remark
		}
		list.value.forEach((t) => {
			data.ScreenBarCodeList.push(t.ScreenBarCode)
		})
		// console.log(data);
		AssociationScreenAndBoxBarCodeNews(data).then(res => {
			audioSuccessPlay()
			uni.showToast({
				title: res.msg,
				icon: 'none',
			})
			getFocus()
			formData.value.Remark=""
			list.value = []
		}).catch(error => {
			audiofailPlay()
		})

	}
	const swipeClick = (e, data) => {
		list.value = list.value.filter(l => l.ScreenBarCode != data.ScreenBarCode)
	}
	const getHieght = () => {
		uni.createSelectorQuery().select('.secthieght').boundingClientRect(data => {
			secthe.value = (uni.getSystemInfoSync().windowHeight - Math.round(data.height + 55)) + 'px'
		}).exec()
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
		font-size: 12px;
	}


</style>