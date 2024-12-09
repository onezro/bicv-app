<template>
	<view class="content" @tap="getFocus">
		<view class="box">
<!-- 			<tk-input ref="myInput1" class="un-input" :allowEdit="false"
			                :style="{border:'1px solid #000', margin: '5px'}" @input="input" v-model="value1"
			                @confirm="onInput1Confirm" />
			            <view>value1:{{value1}}</view> -->
			<up-form :model="ipForm" ref="form1" label-width="60" labelPosition="top">
				<up-form-item label="IP地址" prop="ip" :borderBottom='true'>
					<up-input v-model="ipForm.ip" adjustPosition border="none"></up-input>
				</up-form-item>
				<up-form-item label="端口" prop="port" :borderBottom='true'>
					<up-input v-model="ipForm.port" adjustPosition border="none"></up-input>
				</up-form-item>
				<up-form-item>
					<up-button plain="true" text="返回"></up-button>
					<up-button type="primary" text="确定" @click="onsubmit"></up-button>
				</up-form-item>
			</up-form>
			<!-- <view class="" style="display: flex;gap: 10px;">
				<up-button plain="true" text="返回"></up-button>
				<up-button type="primary" text="确定" @click="onsubmit"></up-button>
			</view> -->
		</view>
	</view>
</template>
<!-- // <script module="input" lang="renderjs">
// 	export default {
// 		mounted() {
// 			// inputmode="none" 
// 			// this.$el.querySelector('input').setAttribute('inputmode', 'none')
// 			// console.log(112);
// 			this.$nextTick(() => {
// 				const inputElement = this.$el.querySelector('input');
// 				if (inputElement) {
// 					inputElement.setAttribute('inputmode', 'none');
// 					// 如果需要，还可以添加其他属性或事件监听器  
// 				}
// 			});
// 		}
// 	}
// </script> -->

<script setup>
	import {
		ref,
		watch,
		onMounted,
		onUnmounted,
		nextTick
	} from 'vue'
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app"
	const ipForm = ref({
		ip: "",
		port: ""
	})
	onLoad(() => {
		let ipData = uni.getStorageSync('NIS_IPFORM')
		// console.log(ipData);
		if (ipData !== undefined) {
			ipForm.value = {
				...ipData
			}
			onsubmit()
		}
	})
// 	const value1=ref("")
// 	const myInput1=ref()
// 	const onInput1Confirm=(val)=>{
// 		value1.value=""
// 		console.log(val);
// 	}
// 	const input=(e)=>{
// 		console.log(e);
// 	}
// 	const getFocus=()=>{
// 		myInput1.value.focus()
// 	}
// onMounted(()=>{
// 	nextTick(()=>{
// 		getFocus()
// 	})
// })

	const onsubmit = () => {
		uni.request({
			url: `http://${ipForm.value.ip}:${ipForm.value.port}/api/v1.0/ping?DisableErrorHandling=`,
			method: "POST",
		}).then(res => {

			if (res.statusCode === 204) {

				uni.setStorageSync('NIS_IPFORM', ipForm.value)

				uni.navigateTo({
					url: `/pages/material/Scaning/mcid`
				})
			} else {
				// uni.showToast({
				// 	title: msg,
				// 	icon: 'none'
				// })
			}
		})
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100%;
		background: #fff;
		display: flex;
		// flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px;

		.box {
			// margin: auto;
			width: 100%;
			padding: 0 15px;
			box-shadow: 0px 0px 10px rgba(0, 0, 0, .12);
		}

		.inputbox {
			position: absolute;
			left: -999px;
		}
	}
</style>