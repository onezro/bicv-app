<template>
	<view class="content">
		<uni-section title="拆箱" type="line">
			<view class="box">
				<up-form labelPosition="left" :model="formData" ref="formRef" labelWidth="100">
					<up-form-item label="类型" prop="type">
						<uni-data-checkbox v-model="formData.type" :localdata="localdata" />
					</up-form-item>					
					<up-form-item label="扫描条码" prop="barCode">
						<up-input placeholder="请扫描条码" v-model="formData.barCode" @confirm="submit">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconBarQRCode" size="24"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<up-form-item label="周转箱条码" prop="turnNumber">
						<up-input v-model="formData.turnNumber" :disabled="!isUnbox">
						</up-input>
					
					</up-form-item>
				</up-form>
			</view>
		</uni-section>
		<uni-section title="装箱明细" type="line">
			<view class="box">
				<up-form labelPosition="left" :model="material" ref="materRef" labelWidth="80">
					<up-form-item label="工单号" prop="orderNum">
						<!-- <u-input  v-model="material.orderNum"/> -->
						<text>{{material.orderNum}}</text>
					</up-form-item>
					<up-form-item label="物料编号" prop="itemNumber">
						<text>{{material.itemNumber}}</text>
					</up-form-item>
					<up-form-item label="物料名称" prop="itemName">
						<text>{{material.itemName}}</text>
					</up-form-item>

					<up-form-item label="箱数量" prop="boxNumber">
						<text>{{material.boxNumber}}</text>
					</up-form-item>
				</up-form>
			</view>
		</uni-section>
		<view class="subox">
			<up-button text="重置" @click="resetForm"></up-button>
			<up-button type="primary" text="一键拆箱" v-if="isUnbox"></up-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch,
		nextTick
	} from 'vue'
	import form from '../../uni_modules/uview-plus/libs/config/props/form';
	// const list = ref(['拆箱', '一键拆箱'])
	// const curNow = ref(0)
	const localdata = ref([{
		text: '拆箱',
		value: 0
	}, {
		text: '一键拆箱',
		value: 1
	}])
	const formData = ref({
		type: 0,
		turnNumber: '',
		barCode: '',
	})
	const barList = ref([])
	const isUnbox = ref(false)
	const formRef = ref()
	const materRef = ref()
	const material = ref({
		orderNum: '12312323',
		itemNumber: '',
		itemName: '',
		boxNumber: ''
	})
	const restMaterial = () => {
		material.value.orderNum = ''
		material.value.itemNumber = ''
		material.value.itemName = ''
		material.value.boxNumber = ''
		formData.value.turnNumber = ''
		formData.value.barCode = ''
	}
	watch(() => formData.value.type, (newValue, oldValue) => {
		isUnbox.value = newValue === 0 ? false : true
		
		if (newValue !== oldValue) {
			restMaterial()
			// nextTick(()=>{
			// 	formRef.value.resetFields()
			// })

		}

	}, {
		deep: true,
		immediate: true
	})

	const iconTurnQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				console.log(res);
			}
		});
	}

	const iconBarQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				console.log(res);
			}
		});
	}
	const submit = () => {
		// formRef.value.resetFields()
		// formData.value.barCode=''
		if (formData.value.type == 0) {

		} else {
			let a = formData.value.barCode
			barList.value.push(a)
			formData.value.barCode = ''
			console.log(barList.value);
		}
	}
	const resetForm = () => {
		formRef.value.resetFields()
	}

	// const sectionChange = (index) => {
	// 	curNow.value = index;
	// }
</script>

<style scoped lang="scss">
	.content {
		height: 100%;
		background: #fff;

		// position: relative;
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