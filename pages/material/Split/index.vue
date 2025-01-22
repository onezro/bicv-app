<template>
	<view class="content">
		<uni-section title="拆分" type="line" class="sect1">
			<view class="box">
				<up-form ref="formRef" :model="formData" :borderBottom='true' labelWidth="65">
					<up-form-item label="批次条码" class='test'>
						<up-input style="height: 30px;" :adjustPosition="true" fontSize='13px' border="surround"
							v-model="formData.ContainerName" @confirm="submitQRCode" :focus="barCodeFocus"
							@focus="focus">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<up-form-item label="拆分数量" class='test'>
						<up-number-box v-model="qty" :min="1" :max="maxQty" inputWidth="80"></up-number-box>
					</up-form-item>
				</up-form>
				<view class="" style="display: flex;justify-content: flex-end;">
					<view class="">
						<wd-button size="small" style="margin-right: 10px;" :round="false" type="info"
							@click="reset">重置</wd-button>
						<wd-button size="small" :round="false" @click="onSubmit" :disabled="maxQty==1"
							>提交</wd-button>
					</view>

				</view>
			</view>
		</uni-section>
		<uni-section title="基本信息" type="line">
			<view class="box">
				<up-form ref="baseFormRef" :model="baseForm" labelWidth="65">
					<up-form-item label="原物料批次号" class='test' prop="FromContainerName">
						<up-input style="height: 30px;" fontSize='12px' border="surround"
							v-model="baseForm.FromContainerName" disabled></up-input>
					</up-form-item>

					<up-form-item label="预拆分物料批次号" class='test' prop="ToContainerName">
						<up-input style="height: 30px;" fontSize='12px' border="surround"
							v-model="baseForm.ToContainerName" disabled></up-input>
					</up-form-item>

					<up-row gutter="20">
						<up-col span="7">
							<up-form-item label="物料编码" class='test' prop="MaterialName">
								<up-input style="height: 30px;" fontSize='12px' border="surround"
									v-model="baseForm.MaterialName" disabled></up-input>
							</up-form-item>
						</up-col>
						<up-col span="5">
							<up-form-item label="数量" class='test' prop="Qty">
								<view style="width: 90px;"><up-input style="height: 30px;" fontSize='12px'
										border="surround" v-model="baseForm.Qty" disabled></up-input></view>
							</up-form-item>
						</up-col>
					</up-row>

					<up-form-item label="物料描述" class='test' prop="MaterialDesc">
						<up-textarea height="30px" class="texta" v-model="baseForm.MaterialDesc" disabled></up-textarea>
					</up-form-item>
				</up-form>
			</view>
		</uni-section>
	</view>
</template>

<script setup>
	import {
		VerifySpliteMaterial,
		SpliteMaterial
	} from "@/api/smt.js"
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
		workstationName: 'BICV-ASY-0001',
		ContainerName: '',
		Qty: 1
		// userAccount: name.value,
	})
	const maxQty = ref(1)
	const qty = ref(1)
	const baseForm = ref({
		FromContainerName: "",
		ToContainerName: "",
		MaterialName: "",
		MaterialDesc: "",
		Qty: ""
	})
	const barCodeFocus = ref(true)
	const baseFormRef = ref()
	const isDisabled = ref(true)

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
	const focus = () => {
		uni.hideKeyboard()
	}
	const iconClickQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				// console.log(res.result);
				formData.value.ContainerName = res.result
				submitQRCode()
			}
		});
	}
	const submitQRCode = () => {
		VerifySpliteMaterial(formData.value.ContainerName).then(res => {
		
		
			if (res.content.Qty > 1) {
				audioSuccessPlay()
				maxQty.value = res.content.Qty - 1
			} else {
				audiofailPlay()
				maxQty.value = res.content.Qty
				// isDisabled.value = true
				uni.showToast({
					title: `${res.content.FromContainerName}数量为${res.content.Qty},不可拆分`,
					icon: 'none',
					duration: 3000
				})
			}
			baseForm.value = {
				...res.content
			}
		}).catch(() => {
			audiofailPlay()
			baseFormRef.value.resetFields()
			formData.value.ContainerName = ""
			maxQty.value = 1
			isDisabled.value = true
			getFocus()
		})

	}
	const onSubmit = () => {
		let data = {
			FromContainerName: baseForm.value.FromContainerName,
			ToContainerName: baseForm.value.ToContainerName,
			// MaterialName: "string",
			// MaterialDesc: "string",
			Qty: qty.value,
			workstationName: "BICV-ASY-0001",

			userAccount: name.value,
		}
		// console.log(data);
		if (maxQty.value > 1) {
			SpliteMaterial(data).then(res => {
				audioSuccessPlay()
				uni.showToast({
					title: res.msg,
					icon: 'none',
					duration: 3000
				})
				maxQty.value = 1
				qty.value = 1
				formData.value.ContainerName = ""
				baseFormRef.value.resetFields()
				isDisabled.value = true
				getFocus()
			}).catch(() => {
				audiofailPlay()
			})
		} else {
				audiofailPlay()
			uni.showToast({
				title: `${data.FromContainerName}数量为${data.Qty},不可拆分`,
				icon: 'none',
				duration: 3000
			})
		}

	}
	const reset = () => {
		maxQty.value = 1
		qty.value = 1
		formData.value.ContainerName = ""
		baseFormRef.value.resetFields()
		getFocus()
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
		font-size: 12px;
	}
</style>