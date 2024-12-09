<template>
	<view class="content">
		<view class="box">
			<view class="title">输入或扫描资源ID</view>
			<up-form :model="mcidForm" ref="form1" label-width="100" labelPosition="top">
				<up-form-item label="资源ID" prop="mcId" :borderBottom='true'>
					<up-input v-model="mcidForm.mcId" :adjustPosition="true" type="number" border="none" @confirm="onSubmit"></up-input>
				</up-form-item>
				<up-form-item>
					<up-button :plain="true" text="上一步" @click="back"></up-button>
					<up-button type="primary" :disabled="mcidForm.mcId==''||mcidForm.mcId==undefined" text="确定" @click="onSubmit"></up-button>
				</up-form-item>

			</up-form>
			<!-- 	<view class="" style="display: flex;gap: 10px;">
			
			</view> -->
		</view>
		<view class="msg-title" v-if="isShowMsg">
			<view class="msg-box">
				<view class="" style="margin-left: 15px;">{{msgContent}}</view>
				<view class="" style="margin-right: 10px;"><up-button type="error" text="关闭" size="small"
						@click="closeMsg" style="width: 40px;"></up-button></view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch,
		onMounted,
		onUnmounted
	} from 'vue'
	import {
		onLoad,
		onReady
	} from "@dcloudio/uni-app"
	const ipData = ref("")
	const mcidForm = ref({
		mcId: "",
		ip: "172.31.70.87"
	})
	const machineData = ref()
	const isShowMsg = ref(false)
	const msgContent = ref("")
	onLoad(options => {
		ipData.value = uni.getStorageSync('NIS_IPFORM')
		machineData.value = uni.getStorageSync('NIS_Machine')
		// console.log(options.mcId);
		mcidForm.value.mcId = options.mcId !== undefined ? options.mcId : machineData.value.mcId
		// if (machineData.value !== undefined|| machineData.value!='') {
		// 	// console.log(machineData.value);
		// 	mcidForm.value.=machineData.value.mcId
		if (mcidForm.value.mcId !== ''||mcidForm.value.mcId!==undefined) {
			console.log(mcidForm.value.mcId);
			onSubmit()
		}

		// }
	})

	const registerMcid = () => {
		uni.request({
			url: `http://${ipData.value.ip}:5000/api/v1.0/applications/register`,
			method: "GET",
		}).then(res => {
			if (res.statusCode === 200) {

			}
		})
	}
	const onSubmit = () => {
		isShowMsg.value = false
		uni.request({
			url: `http://${ipData.value.ip}:8014/api/machines/${mcidForm.value.mcId}/webapplications?DisableErrorHandling=`,
			method: "GET",
		}).then(res => {
			// console.log(res);
			if (res.statusCode === 200) {
				uni.request({
					url: `http://${ipData.value.ip}:5000/api/v1.0/applications/register`,
					method: "POST",
					data: mcidForm.value
				}).then(res => {

					if (res.statusCode === 200) {
						// console.log(res.data);
						uni.setStorageSync('NIS_Machine', res.data)
						uni.redirectTo({
							url: `/pages/material/Scaning/line`
						})
					} else {
						isShowMsg.value = true
						msgContent.value = `无法注册这个器件  ${mcidForm.value.mcId}`
						// console.log(res);
					}
				})
			}else{
				isShowMsg.value = true
				msgContent.value = `无法注册这个器件  ${res.data.Message}`
			}
		})
	}
	const closeMsg = () => {
		isShowMsg.value = false
	}
	const back=()=>{
		uni.navigateBack({
			 delta: 1,
		})
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px;

		.box {
			width: 100%;
			padding: 0 15px;
			box-shadow: 0px 0px 10px rgba(0, 0, 0, .12);

			.title {
				padding-top: 10px;
				text-align: center;
				font-size: 20px;
			}
		}

		.inputbox {
			position: absolute;
			left: -999px;
		}

		.msg-title {
			position: fixed;
			bottom: 50px;
			left: 0;

			width: 100%;
			padding: 0 10px;

			&::before {
				content: '';
				position: absolute;
				border-radius: 5px;
				top: 0;
				bottom: 0;
				width: 5px;
				background-color: red;
			}

			.msg-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				// margin: 0 10px;
				box-sizing: border-box;
				border: 1px solid #ff8f8f;
				border-radius: 3px;
				width: 100%;
				height: 80px;
				background-color: #ffeeee;
				box-shadow: 0px 0px 15px rgba(0, 0, 0, .3);

			}
		}
	}
</style>