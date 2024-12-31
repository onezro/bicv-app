<template>
	<view class="content">
		<uni-section title="入库" type="line" class="sect1">
			<view class="box">
				<up-form labelPosition="left" :model="formData" ref="formRef" labelWidth="70">
					<up-form-item label="储位" prop="location">
						<up-input placeholder="储位" @focus="focus" :focus="locatFocus" v-model="formData.location"
							clearable @confirm="submitQRCode">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconCellQRCode" size="24"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<up-form-item label="治具编码" prop="compid">
						<up-input placeholder="治具编码" @focus="focus" :focus="barCodeFocus" v-model="formData.compid"
							@confirm="submitShelves">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconToolQRCode" size="24"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<!-- <up-form-item label="类型" prop="model">
						<up-input placeholder="类型" v-model="formData.model" disabled>
						</up-input>
					</up-form-item> -->

				</up-form>
			</view>
		</uni-section>
		<uni-section title="清单" type="line" class="sect" style="flex: 1;">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-list>
					<uni-list :border="true">
						<uni-list-item v-for="item in list" :title="'治具编码：'+item.compid"
							:note="'储位：'+item.location"></uni-list-item>
					</uni-list>
				</uni-list>
			</scroll-view>
			<template v-slot:right>
				<up-button class="custom-style" size="small" type="primary" text="重置" @click="onSubmit"></up-button>
			</template>
		</uni-section>
	</view>
</template>

<script setup>
	import {
		ToolsMove,
		ValidateComId
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
	const formData = ref({
		operationtype: "MoveIn",
		compid: "",
		// model: '',
		location: "",
		orderid: "",
		userAccount: name.value
	})
	const list = ref([])
	const locatFocus = ref(true)
	const barCodeFocus = ref(false)
	const secthe = ref(0)
	onReady(() => {
		uni.createSelectorQuery().select('.sect1').boundingClientRect(data => {
			secthe.value = (uni.getSystemInfoSync().windowHeight - Math.round(data.height + 55)) + 'px'
		}).exec()

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
	const focus = () => {
		uni.hideKeyboard()
	}
	const iconToolQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				formData.value.compid = res.result
				submitShelves()
			}
		});
	}
	const iconCellQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				formData.value.location = res.result
				// submitShelves()
				// console.log(res.result);
			}
		});
	}
	const submitQRCode = () => {
		// ValidateComId(formData.value.compid).then(res => {
		// 	formData.value.model = res.content
		// 	audioSuccessPlay()
		// 	// console.log(res);
		// }).catch(() => {
		// 	audiofailPlay()
		// })
		getFocus()
	}
	const submitShelves = () => {
		// console.log(formData.value);
		ToolsMove(formData.value).then(res => {
			audioSuccessPlay()
			list.value.push({
				...formData.value
			})
			uni.showToast({
				title: res.msg,
				icon: 'none',
			})
			// formData.value.location = ''
			formData.value.compid = ''
			// formData.value.model = ''
			getFocus()
		}).catch((error) => {
			// formData.value.location = ''
			formData.value.compid = ''
			audiofailPlay()
			getFocus()
		})

	}
	const onSubmit = () => {
		getLocatFocus()
		list.value = []
		formData.value.compid = ''
		formData.value.model = ''
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

		.custom-style {
			width: 60px;
			height: 28px;
		}

	}
</style>