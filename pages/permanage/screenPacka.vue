<template>
	<view class="content">
		<uni-section title="装箱" type="line">
			<view class="box">
				<up-form labelPosition="left" :model="formData" ref="formRef" labelWidth="100">
					<up-form-item label="周转箱条码" prop="turnNumber">
						<up-input v-model="formData.turnNumber" placeholder="请扫描周转箱条码">
						</up-input>
					</up-form-item>
					<up-form-item label="箱容量" prop="boxCapacity">
						<!-- <uni-data-checkbox v-model="formData.boxCapacity" :localdata="localdata" /> -->
						<uni-data-select v-model="formData.boxCapacity" :localdata="localdata"></uni-data-select>
					</up-form-item>
					<up-form-item label="已装箱数量" prop="PackedQty">
						<up-input v-model="formData.PackedQty" disabled>
						</up-input>
					</up-form-item>
					<up-form-item label="扫描条码" prop="barCode">
						<up-input placeholder="请扫描条码" v-model="formData.barCode" @confirm="submit">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconBarQRCode" size="24"></uni-icons>
							</template>
						</up-input>
					</up-form-item>

				</up-form>
			</view>
		</uni-section>
		<uni-section title="装箱明细" type="line">
			<view class="box">
				<view class="list">
					<view class="item">
						<view class="text-data">
							<text>MES屏条码</text>
							<text>1232324</text>
						</view>
						<view class="text-data">
							<text>工单号</text>
							<text>1232324</text>
						</view>
					</view>
					<view class="item">
						<view class="text-data">
							<text>产品编码</text>
							<text>1232324</text>
						</view>
						<view class="text-data">
							<text >生产日期</text>
							<text>2024-08-19</text>
						</view>
					</view>
					<view class="item">
						<view class="text-data">
							<text style="white-space:nowrap;">产品名称</text>
							<text>测试测试测试测试测试从是测试从四川省测试测试测试测试测试测试测试测试测试测试从是测试从四川省测试测试测试测试测试</text>
						</view>

					</view>
				</view>
			</view>
		</uni-section>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const localdata = ref([{
		text: '10',
		value: 10
	}, {
		text: '20',
		value: 20
	}, {
		text: '30',
		value: 30
	}, {
		text: '40',
		value: 40
	}])
	const formData = ref({
		turnNumber: '',
		barCode: '',
		boxCapacity: '',
		PackedQty: 2
	})
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
		.list{
			display: flex;
			flex-direction: column;
			gap: 10px;
			padding-bottom: 10px;
			border-bottom: 1px solid #dadbde ;
			.item{
				display: flex;
				justify-content: space-between;
				.text-data{
					display: flex;
					gap: 20px;
				}
			}
		}
	}
</style>