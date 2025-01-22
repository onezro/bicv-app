<template>
	<view class="content">
		<uni-section title="拆包信息" type="line">
			<view class="box">
				<up-form labelPosition="left" :model="formData" ref="form1" labelWidth="70">
					<up-form-item label="类型" prop="SplitType" class='test'>
						<uni-data-checkbox v-model="formData.SplitType" :localdata="localdata" @change="change"/>
					</up-form-item>
					<up-form-item label="物料批次条码" prop="ContainerName" class='test'>
						<u-input placeholder="扫描物料批次条码"  style="height: 30px;" @focus="focus" fontSize='13px' v-model="formData.ContainerName" :focus="focusQRCode"
							@confirm="submit">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="24"></uni-icons>
							</template>
						</u-input>
					</up-form-item>
					<up-form-item label="拆分数量" prop="SplitQty" class='test'>
						<u-input placeholder="拆分数量"  style="height: 30px;" fontSize='13px' v-model="formData.SplitQty"  disabled>
							
				</u-input>
						<!-- <up-number-box inputWidth="80" :disabled="isQty" v-model="formData.SplitQty"></up-number-box> -->
					</up-form-item>
				</up-form>
			</view>
		</uni-section>
		<uni-section title="物料明细" type="line">
			<view class="box">
				<up-form labelPosition="left" :model="material" ref="form1">
					<up-form-item label="生产计划号" prop="ConsumingOrder" labelWidth="80" class='test'>
						<text>{{material.ConsumingOrder}}</text>
					</up-form-item>
					<up-form-item label="物料编码" prop="MaterialName" labelWidth="80" class='test'>
						<text>{{material.MaterialName}}</text>
					</up-form-item>
					<up-form-item label="物料名称" labelWidth="80" prop="MaterialDesc" class='test'>
						<text>{{material.MaterialDesc}}</text>
					</up-form-item>
					<up-form-item label="制造日期" labelWidth="80" prop="DueDate" class='test'>
						<text>{{material.DueDate}}</text>
					</up-form-item>
					<up-form-item label="物料批次" labelWidth="80" prop="VendorLotNumber" class='test'>
						<text>{{material.VendorLotNumber}}</text>
					</up-form-item>
					<up-form-item label="数量" labelWidth="80" prop="Qty" class='test'>
						<text>{{material.Qty}}</text>
					</up-form-item>
				</up-form>

			</view>

		</uni-section>
		<view class="subox">
			<up-button text="重置" @click="restForm"></up-button>
			<up-button type="primary" text="确定" :disabled="isSubmit" @click="submitForm"></up-button>
		</view>
	</view>
</template>

<script setup>
	import {
		MaterialSplit,
		MaterialSplitVerify
	} from '@/api/scr.js'
	import {
		ref,
		watch
	} from 'vue'
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
		SplitType: "LCM",
		ContainerName: "",
		ProductName: "",
		ProductDescription: "",
		SplitQty: "",
		Remark: "",
		workstationName: "BICV-SCN-0001",
		userAccount: name.value,
		txnDate: ""
	})
	const localdata = ref([
		{
			text: 'LCM',
			value: 'LCM'
		},{
			text: '单件(客供)',
			value: '1'
		}
		
	])
	const material = ref({
		ContainerName: "",
		ConsumingOrder:"",
		Qty: '',
		MaterialName: "",
		MaterialDesc: "",
		SpecName: "",
		SpecDesc: "",
		VendorLotNumber: '',
		DueDate: ""
	})
	const focusQRCode = ref(true)
	const isQty=ref(true)
	const isSubmit=ref(true)
	watch(() => formData.value.SplitType, (newVal, oldVal) => {
		if (newVal =='2') {
			isQty.value = false
		}else{
			isQty.value = true
		}
	}, {
		deep: true,
		immediate: true
	})
	const change=()=>{
		getFocus()
		// restForm()
	}
	const getFocus = () => {
		focusQRCode.value = false
		setTimeout(() => {
			focusQRCode.value = true
		}, 100)
	}
	const focus=()=>{
		uni.hideKeyboard()
	}
	const submit = () => {
		MaterialSplitVerify(formData.value).then(res => {
			// console.log(res.content[0]);
			material.value={...res.content[0]}
			formData.value.SplitQty=res.content[0].Qty
			formData.value.ProductName=res.content[0].MaterialName
			isSubmit.value=false
			if(res.content[0].Qty==0){
				isSubmit.value=true
			}
			getFocus()
		}).catch(()=>{
			// console.log();
			formData.value.ContainerName=""
			isSubmit.value=true
				getFocus()
		})
	}
	const iconClickQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				formData.value.ContainerName = res.result;
				submit()
				// this.submitQRCode()
			}
		});
	}
	const restForm = () => {
		formData.value.ContainerName = ''
		formData.value.SplitQty = ''
		formData.value.SplitType = 'LCM'
		material.value.ContainerName=''
		material.value.ConsumingOrder=""
		material.value.DueDate=''
		material.value.MaterialDesc=''
		material.value.MaterialName=''
		material.value.Qty=''
		material.value.SpecDesc=''
		material.value.SpecName=''
		material.value.VendorLotNumber=''
		isSubmit.value=true
		getFocus()
	}
	const submitForm = () => {
		// console.log(formData.value);
		MaterialSplit(formData.value).then(res => {
			audioSuccessPlay()
			uni.showToast({
				title: res.msg,
				icon: 'none',
			})
			isSubmit.value=true
			formData.value.ContainerName=""
			formData.value.SplitQty=""
			getFocus()
			// restForm()
			// console.log(res);
		}).catch(() => {
			isSubmit.value=false
			audiofailPlay()
		})
	}
</script>

<style scoped lang="scss">
	.content {
		height: 100%;
		background: #fff;
		position: relative;

		.box {
			padding: 0 10px;
		}

		.subox {
			position: fixed;
			bottom: 10px;
			width: 100%;
			padding: 0 10px;
			display: flex;
			gap: 100rpx;
			background-color: #fff;
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
	.test1{
		font-size: 13px;
	}
	.test1 .u-form-item__body {
		padding: 10px 0;
		font-size: 12px;
	}
</style>