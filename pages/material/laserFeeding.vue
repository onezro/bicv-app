<template>
	<view class="content">
		<uni-section title="上料信息" type="line">
			<up-form labelPosition="left" :model="formData" ref="form1" class="form1">
				<up-form-item label="工单" prop="formData.order" labelWidth="100" borderBottom>
					<uni-data-select v-model="formData.order" placeholder="请选择工单"
						:localdata="orderArr"></uni-data-select>
				</up-form-item>
				<up-form-item label="设备" prop="formData.eq" labelWidth="100" borderBottom>
					<uni-data-select v-model="formData.eq" placeholder="请选择设备" :localdata="eqArr"></uni-data-select>
				</up-form-item>
				<up-form-item label="包装条码" labelWidth="100" prop="formData.barCode" borderBottom>
					<u-input placeholder="扫描包装条码" v-model="formData.barCode" :focus="focusQRCode" @confirm="submit">
						<template #suffix>
							<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="24"></uni-icons>
						</template>
					</u-input>
				</up-form-item>
			</up-form>
		</uni-section>
		<uni-section title="工单明细" type="line">
			<up-form labelPosition="left" :model="material" ref="form1" class="form1">
				<up-form-item label="物料编码" prop="material.type" labelWidth="80">
					<text></text>
				</up-form-item>
				<up-form-item label="物料名称" labelWidth="80" prop="material.barCode">
					<text></text>
				</up-form-item>
				<up-form-item label="生成日期" labelWidth="80" prop="material.splitQt">
					<text></text>
				</up-form-item>
				<up-form-item label="物料批次" labelWidth="80" prop="material.splitQt">
					<text></text>
				</up-form-item>
				<up-form-item label="数量" labelWidth="80" prop="material.splitQt">
					<text></text>
				</up-form-item>
			</up-form>
		</uni-section>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const formData = ref({
		order: '',
		eq: "",
		barCode: '',
	})
	const orderArr = ref([{
			value: '1235638',
			text: "1235638"
		},
		{
			value: '1235648',
			text: "1235648"
		},
		{
			value: '1235658',
			text: "1235658"
		}
	])
	const eqArr = ref([{
			value: '1235638',
			text: "镭雕01"
		},
		{
			value: '1235648',
			text: "镭雕02"
		},
		{
			value: '1235658',
			text: "镭雕03"
		}
	])
	const submit = () => {
		console.log(formData.value);
	}
	const iconClickQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				console.log(res);
				// this.issueText.BarCode = res.result;
				// this.submitQRCode()
			}
		});
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100%;
		background-color: #fff;

		.form1 {
			padding: 0 10px;
		}
	}
</style>