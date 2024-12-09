<template>
	<view class="content">
		<uni-section title="周转箱上机" type="line">
			<view class="box">
				<up-form labelAlign="right" :model="form" ref="formRef" labelWidth="70">
					<up-form-item label="工位" prop="workstationDec" class='test'>
						<up-input v-model="form.workstationDec" :disabled="true" style="margin-left: 10px;height: 30px;" fontSize='13px' >
						</up-input>
					</up-form-item>
					<up-form-item label="类型" prop="type" class='test'>
						<uni-data-checkbox v-model="form.LoadType" :localdata="localdata" style="margin-left: 10px;" />
					</up-form-item>
					<!-- <up-form-item label="容量" prop="Capacity">
						<up-number-box inputWidth="80" style="margin-left: 10px;" v-model="form.Capacity"></up-number-box>
						
					</up-form-item> -->
					<up-form-item label="扫描条码" prop="barCode" class='test'>
						<up-input placeholder="请扫描条码" style="margin-left: 10px;height: 30px;" fontSize='13px' @focus="focus" :focus="barCodeFocus" v-model="form.CarrierName" @confirm="submit"
							>
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconBarQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<up-form-item label="当前扫描" class='test'>
						<view class="" style="margin-left: 10px;font-size: 13px;">{{barCode}}</view>
					</up-form-item>

				</up-form>
			</view>
		</uni-section>
		<uni-section title="周转箱列表" class="sect" type="line" style="flex: 1;">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-card margin="8px" padding="5px" v-for="c  in  CarrierList" :key="c.CARRIERNAME">
					<view class="box-data">
						<view class="list">
							<view class="item">
								<text class="title">周转箱条码</text>
								<text>{{c.CARRIERNAME}}</text>
							</view>
							<view class="item">
								<text class="title">类型</text>
								<text :class="[c.LOADTYPE==='OK'?'ok':'ng']">{{c.LOADTYPE}}</text>
							</view>
						</view>
						<view class="list">
							<view class="item">
								<text class="title">已装载</text>
								<text>{{c.QTY}}</text>
							</view>
							<view class="item">
								<text class="title">容量</text>
								<text>{{c.CAPACITY}}</text>
							</view>

						</view>
						<view class="bt">
							<up-button type="primary" style="margin: 0;width: 60px;height: 25px;" text="下机"
								@click="unload(c.CARRIERNAME,c.QTY)"></up-button>
						</view>
					</view>

				</uni-card>
			</scroll-view>

		</uni-section>
	</view>
</template>

<script setup>
	import {
		QueryCarrierList,
		LoadCarrier,
		UnloadCarrier
	} from '@/api/index.js'
	import {
		audioSuccessPlay,
		audiofailPlay
	} from "@/utils/prompt.js"
	import {
		onMounted,
		ref
	} from 'vue'
	import {
		onLoad,
		onShow,
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
	const form = ref({
		CarrierName: "",
		LoadType: "OK",
		Capacity:40,
		workstationName: "",
		workstationDec: '',
		userAccount: name.value,
		txnDate: ""
	})
	const localdata = ref([{
		text: 'OK',
		value: "OK"
	}, {
		text: 'NG',
		value: "NG"
	}])
	const secthe = ref(0)
	const barCode = ref('')
	const barCodeFocus = ref(true)
	const CarrierList = ref([])
	onLoad(options => {
		form.value.workstationName = options.workStation
		form.value.workstationDec = options.workStationDec
	})
	onReady(() => {
		uni.createSelectorQuery().select('.sect').boundingClientRect(data => {
			secthe.value = ((data.height) - 45) + 'px'
		}).exec()

	})

	onMounted(() => {
		getCarrierList()
	})
	const getFocus = () => {
		barCodeFocus.value = false
		setTimeout(() => {
			barCodeFocus.value = true
		}, 100)
	}
	const focus=()=>{
		uni.hideKeyboard()
	}
	const getCarrierList = () => {
		// console.log(form.value.workstationName);
		QueryCarrierList(form.value.workstationName).then(res => {
			// console.log(res);
			if (res.content == null) {
				CarrierList.value = []
			} else {
				CarrierList.value = res.content
			}

		})
	}
	const iconBarQRCode = () => {

		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				form.value.CarrierName = res.result
				submit()
			}
		});
	}
	const submit = () => {
		// console.log(form.value);
		let code = form.value.CarrierName
		barCode.value = code
		LoadCarrier(form.value).then(res => {
			audioSuccessPlay()
			getCarrierList()
			uni.showToast({
				title: res.msg,
				icon: 'success',
			})
		}).catch((error) => {
			audiofailPlay()
		})
		form.value.CarrierName = ''
		form.value.Capacity=40
		getFocus()
	}
	const unload = (val, qty) => {
		if (qty > 0) {
			uni.showToast({
				title: '周转箱已装载，不可卸载！！！',
				icon: 'none',
			})
		} else {
			UnloadCarrier(val).then(res => {
				getCarrierList()
				audioSuccessPlay()
				uni.showToast({
					title: res.msg,
					icon: 'success',
				})
			}).catch(() => {
				audiofailPlay()
			})
		}
	}
</script>

<style scoped lang="scss">
	.content {
		height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;

		// position: relative;
		.box {
			padding: 0 10px;
		}

		.box-data {
			display: flex;
			flex-direction: column;
			gap: 10px;
		}

		.list {
			display: flex;
			justify-content: space-between;

			.item {
				.title {
					margin-right: 10px;
					display: inline-block;
					width: 70px;
					text-align: right;
				}
			}
		}

		.bt {
			display: flex;
			justify-content: flex-end;
		}

	}

	.test {
		.u-form-item__body {
			padding: 5px 0;
		}
	}

	.ok {
		color: #fff;
		background-color: seagreen;
	}

	.ng {
		color: #fff;
		background-color: red;
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