<template>
	<view class="content">
		<uni-section title="首套信息" type="line">
			<view class="box">
				<up-form ref="baseForm" :model="formData"  labelWidth="65">
					<up-form-item label="工单号" class='test'>
						<up-input style="height: 30px;" fontSize='13px' border="surround"
							v-model="formData.OrderNumber"></up-input>
					</up-form-item> 
					<!-- <up-form-item label="工单" class='test'>
						<uni-data-select v-model="formData.MfgOrder" :localdata="orderList" @change="change"
							:clear="false" style="height: 30px;"></uni-data-select>
					</up-form-item>
					<up-form-item label="物料条码" class='test'>
						<up-input style="height: 30px;" adjustPosition="true" fontSize='13px' border="surround"
							v-model="formData.Container" @confirm="submitQRCode" :focus="barCodeFocus">
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item> -->
				</up-form>
			</view>
		</uni-section>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const formData = ref({
		McId: 0,
		issue_color: 3,
		OrderNumber: "",
		Side: "",
		Station: 0,
		RackList: [{
			reel_id: "",
			shelf_id: "",
			position_info: ""
		}],
		OperatorName: ""
	})
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
</style>