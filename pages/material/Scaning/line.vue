<template>
	<view class="content1" @tap="getFocus">
		<!-- <view class="">
			{{dataCode}}
		</view>
		<watch-scan-vue></watch-scan-vue> -->
		<view class="inputbox">
			<tk-input ref="myInput1" class="un-input" :allowEdit="true"
				                :style="{border:'1px solid #000', margin: '5px'}"  v-model="inputData"
				                @confirm="confirm" />
			<!-- <up-input v-model.trim="inputData" inputmode="none" :focus="isFocus" @blur="blur" @confirm="confirm">
			</up-input> -->
		</view>
		<view class="coll">
			<view class="coll-title">{{title}}</view>
			<view class="list-box">
				<view class="child">
					<up-collapse :value="activePanel" accordion :border="false" @change="handlePanelChange">
						<up-collapse-item ref="panel" v-for="(l,i) in listData" :key="l.location" :name="l.location"
							:class="{'active-panel': l.location === activePanel, 'inactive-panel': l.location !== activePanel}">
							<template v-slot:title>
								<view class="title" :class="[l.verified?'':'ng']">
									<text>{{l.location}}</text>
									<text>{{l.partNumber}}</text>
								</view>
							</template>
							<view class="content ">
								<text class="text" v-if="!l.verified">{{l.errorMessage||'位置未验证'}}</text>
							</view>
						</up-collapse-item>
					</up-collapse>
				</view>
			</view>
		</view>
		<up-popup :show="isKitt" mode="bottom">
			<view
				style="height: 100vh;padding: 15px;display: flex;flex-direction:column;justify-content: space-between;">
				<view class="">
					<view class="" style="font-size: 18px;">{{warnContent}}供料器  即将维护</view>
					<view class="">
						<view class="">未装配供料器</view>
						<view class="">装配供料器：{{kitForm.feederID}}</view>
						<view class="">位置：1.1.1</view>
					</view>
					<view class="">
						<up-form :model="kitForm" :rules="rules" ref="kitFormRef" :errorType="'border-bottom'"
							label-width="100" borderBottom labelPosition="top">
							<up-form-item :label="kitForm.partNumber?'Part Number':''" prop="partNumber"
								borderBottom='true'>
								<up-input v-model="kitForm.partNumber" readonly placeholder="Part Number*"
									border="none"></up-input>
							</up-form-item>
							<up-form-item :label="kitForm.manufacturer?'Manufacturer':''" prop="manufacturer"
								:borderBottom='true'>
								<up-input v-model="kitForm.manufacturer" readonly placeholder="Manufacturer*"
									border="none"></up-input>
							</up-form-item>
							<up-form-item :label="kitForm.reelID?'Container ID':''" prop="reelID" :borderBottom='true'>
								<up-input v-model="kitForm.reelID" readonly placeholder="Part Number*"
									border="none"></up-input>
							</up-form-item>
							<up-form-item :label="kitForm.quantity?'Quantity':''" prop="quantity" :borderBottom='true'>
								<up-input v-model="kitForm.quantity" readonly placeholder="Quantity*"
									border="none"></up-input>
							</up-form-item>
							<up-form-item :label="kitForm.operator?'Operator':''" prop="operator" :borderBottom='true'>
								<up-input v-model="kitForm.operator" readonly placeholder="Operator*"
									border="none"></up-input>
							</up-form-item>
						</up-form>
					</view>
				</view>
			</view>
		</up-popup>
		<view class="msg-title" v-if="isShowMsg">
			<view class="msg-box">
				<view class="" style="margin-left: 15px;">{{msgContent}}</view>
				<view class="" style="margin-right: 10px;"><up-button color="#000" text="关闭" size="small"
						@click="closeMsg" style="width: 40px;"></up-button></view>
			</view>
		</view>
		<view class="msg">
			<view class="tips">
				<text>提示信息</text>
				<view class="tips-content" :class="{'activetips':isTipsError}">{{tipsContent}}</view>
			</view>
			<up-button type="info" v-if="isKitt" text="取消" @click="isKitt=false">
			</up-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch,
		nextTick,
		computed,
		onMounted,
		onUnmounted
	} from 'vue'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		stringType
	} from "@/utils/checkString.js"
	// import watchScanVue from '../../../components/watch-scan.vue';
	const dataCode = ref('')
	const inputData = ref("")
	const barCode = ref("")
	const isFocus = ref(true)
	const machineData = ref()
	const ipData = ref()
	const title = ref("") //line title
	const listData = ref([])
	const activePanel = ref("") //选择下拉
	const chooseData = ref({}) //选择绑定验证的位置
	const feed = ref('') //Feeder
	const reel = ref("") //料盘
	const kitForm = ref({
		partNumber: "",
		manufacturer: "",
		reelID: "",
		feederID: "",
		quantity: "",
		operator: "",
		lotNumber: "",
		dateCode: "",
		mnfPartNo: "",
		usedReelBarcodeScanned: false,
		trayCoordinateX: 1,
		trayCoordinateY: 1
	}) //绑定物料kitting
	const rules = ref({
		partNumber: [{
			required: true,
			message: 'Part Number*',
			trigger: ['change'],
		}],
		manufacturer: [{
			required: true,
			message: 'manufacturer',
			trigger: ['change'],
		}],
		reelID: [{
			required: true,
			message: 'reelID',
			trigger: ['change'],
		}],
		quantity: [{
			type: "number",
			required: true,
			message: 'quantity',
			trigger: ['change'],
		}],
		operator: [{
			required: true,
			message: 'operator',
			trigger: ['change'],
		}],


	})
	const kitFormRef = ref()
	const isKitt = ref(false)
	const isClear = ref(false)
	const operatorForm = ref({
		operatorBarcode: "",
		force: false
	})
	const timerId = ref()
	const isNotForm = computed(() => {
		return kitForm.value.manufacturer && kitForm.value.operator && kitForm.value.partNumber && kitForm.value
			.reelID && kitForm.value.quantity
	})
	const unregistForm = ref({
		ip: '',
		mcId: ''
	})
	const mcidForm = ref({
		ip: '',
		mcId: ''
	})
	const isShowMsg = ref(false)
	const msgContent = ref("")
	const tipsContent = ref("")
	const isTipsError = ref(false)
	const warnContent=ref("")
	const myInput1=ref()
	
	watch(isNotForm, (newVal) => {
		if (newVal) {
			kitting()
		}
	})
	// watch(()=>isFocus.value,(newVal)=>{
	// 	if(newVal){
	// 		uni.hideKeyboard()
	// 		console.log(1111);
	// 	}
	// })
onMounted(()=>{
	nextTick(()=>{
		getFocus()
	})
})
	onShow(() => {
		timerId.value = setInterval(() => {
			uni.hideKeyboard(); //隐藏软键盘
		}, 60);
	})
	onUnmounted(() => {
		clearInterval(timerId.value)
	})

	onLoad(() => {
		machineData.value = uni.getStorageSync('NIS_Machine')
		ipData.value = uni.getStorageSync('NIS_IPFORM')
		operatorForm.value.operatorBarcode = uni.getStorageSync('OPER')
		kitForm.value.operator = uni.getStorageSync('OPER')
		// console.log(operatorForm.value);
		unregistForm.value.ip = machineData.value.ip
		unregistForm.value.mcId = machineData.value.mcId
		mcidForm.value.ip = machineData.value.ip
		getLineTitle()
	})

	const getLineTitle = () => {
		uni.request({
			url: `http://${ipData.value.ip}:${ipData.value.port}/api/v1.0/configurations/host-configuration`,
			method: 'GET',
			header: {
				alias: machineData.value.alias
			}
		}).then(res => {
			if (res.statusCode === 200) {
				// console.log(res.data);
				title.value = res.data.nickName
				getAllStation()
			}
		})
	}
	const getAllStation = () => {
		uni.request({
			url: `http://${ipData.value.ip}:${ipData.value.port}/api/v1.0/low-level-warnings/device?ErrorHandlingIfUnauthorized=&mcId=${machineData.value.mcId}&maxItems=10&station=-1&slot=-1&subSlot=-1&showModules=-1`,
			method: 'GET',
			header: {
				alias: machineData.value.alias
			}
		}).then(res => {
			if (res.statusCode === 200) {
				listData.value = res.data.items
			}
		})
	}
	const handlePanelChange = (val) => {
		let activeName = val.find(v => v.status == "open")
		if (activeName !== undefined) {
			chooseData.value = listData.value.find(v => v.location == activeName.name)
		}
		activePanel.value = activeName == undefined ? activePanel.value : activeName.name

		// console.log(val);
	}
	const getFocus = () => {
		// isFocus.value = false
		// setTimeout(() => {
		// 	isFocus.value = true
		// }, 100)
		myInput1.value.focus()
		// console.log(1111);
	}
	const input = () => {
		// uni.hideKeyboard();
		// console.log("input");
	}
	const blur = () => {
		getFocus()
		uni.hideKeyboard();
		// console.log("blur");
	}
	const confirm = () => {
		let val = inputData.value
		barCode.value = val
		inputData.value = ""
		getFocus()
		uni.request({
			url: `http://${ipData.value.ip}:${ipData.value.port}/api/v1.0/barcodes/resolve`,
			method: 'POST',
			header: {
				alias: machineData.value.alias
			},
			data: {
				barcode:barCode.value
			}
		}).then(res=>{
			let data=res.data.matches
			if(data.length!==0){
				if(data[0].pattern.name=="Operator"){
					operatorForm.value.operatorBarcode = barCode.value
					operatorLogOUt()
				}else if(data[0].pattern.name=="Feeder"){
					feedIsResolve()
				}else if(data[0].pattern.name=="Reel"){
					reel.value = val
					if (isKitt.value) {
						reelCheck()
					}else{
						
					}
				}
				// else if(data[0].pattern.name=="Mcid"){
				// 	unregister()
				// 	mcidForm.value.mcId = val
				// }
			}else{
				isTipsError.value=true
				tipsContent.value = "条码格式有误"
			}
			
		})
		
		if (stringType(barCode.value) == "MCID") {
		
			unregister()
			mcidForm.value.mcId = val
		}
		// if (stringType(barCode.value) == "Feed") {
		// 	feedIsResolve()
		// }
		// if (stringType(barCode.value) == "Material") {
		// 	reel.value = val
		// 	if (isKitt.value) {
		// 		reelCheck()
		// 	}
		// }
		if (stringType(barCode.value) == "CLEAR") {
			isClear.value = !isClear.value
			if (isClear.value) {
				isTipsError.value=false
				tipsContent.value = "清除Feeder绑定"
			}
		}
		// if (stringType(barCode.value) == "OPER") {
		// 	// isClear.value = true
		// 	operatorForm.value.operatorBarcode = val
		// 	operatorLogOUt()
		// }
		// if(stringType(barCode.value)=="none"){
		// 	isTipsError.value=true
		// 	tipsContent.value = "条码格式有误"
		// }
	}
	//注销登录
	const unregister = () => {
		uni.request({
			url: `http://${ipData.value.ip}:${ipData.value.port}/api/v1.0/applications/unregister`,
			method: 'POST',
			header: {
				alias: machineData.value.alias
			},
			data: unregistForm.value
		}).then((res) => {
			if (res.statusCode == 200 || res.statusCode == 204) {
				uni.request({
					url: `http://${ipData.value.ip}:5000/api/v1.0/applications/register`,
					method: "POST",
					data: mcidForm.value
				}).then(res => {
					if (res.statusCode === 200) {
						// console.log(res.data);
						uni.setStorageSync('NIS_Machine', res.data)
						// uni.navigateTo({
						// 	url: `/pages/material/Scaning/line`
						// })
					} else {
						uni.redirectTo({
							url: `/pages/material/Scaning/mcid?mcId=${mcidForm.value.mcId}`
						})
					}
				})
			} else {

			}
		})
	}
	//是否是Feeder和feeder可用
	const feedIsResolve = () => {
		isTipsError.value = false
		tipsContent.value = ""
		uni.request({
			url: `http://${ipData.value.ip}:${ipData.value.port}/api/v1.0/barcodes/resolve`,
			method: 'POST',
			header: {
				alias: machineData.value.alias
			},
			data: {
				barcode: barCode.value
			}
		}).then(res => {
			// console.log(res);
			if (res.statusCode == 200 || res.statusCode == 204) {
				if (res.data.matches.length == 0) {
					console.log("error");
					isTipsError.value = true
					tipsContent.value = "Feeder未注册"
				}
				feed.value = res.data.matches[0].match
				if (isClear.value) {
					msgContent.value = barCode.value
					clearFeeder()
				} else {
					if (activePanel.value === "") {
						chooseData.value = {
							...listData.value[0]
						}
					}
					feedIsKitt()
				}

			}

		})
	}
	//feeder 绑定料盘
	const feedIsKitt = () => {

		uni.request({
			url: `http://${ipData.value.ip}:${ipData.value.port}/api/v1.0/reels/summary-by-feeder?feederId=${feed.value}&station=${chooseData.value.station}&slot=${chooseData.value.slot}&subSlot=${chooseData.value.subSlot}`,
			method: 'GET',
			header: {
				alias: machineData.value.alias
			}
		}).then(res => {
			let {
				data
			} = res
			// console.log(res.data.positionDataItem.isFeederKitted);
			if (res.statusCode == 200 || res.statusCode == 204) {
				//是否已绑定物料
				if (!data.positionDataItem.isFeederKitted) {
					isKitt.value = true
					kitForm.value.feederID = feed.value
				} else {
					feedVerify()
				}
			} else {
				
			}
		})
	}

	//站位feed验证
	const feedVerify = () => {
		// console.log(chooseData.value);
		isTipsError.value = false
		tipsContent.value = ""
		uni.request({
			url: `http://${ipData.value.ip}:${ipData.value.port}/api/v1.0/feeders/${feed.value}/verify`,
			method: 'POST',
			header: {
				alias: machineData.value.alias
			},
			data: {
				station: chooseData.value.station,
				slot: chooseData.value.slot,
				subSlot: chooseData.value.subSlot
			}
		}).then(res => {
			// console.log(res);
			if (res.statusCode == 200 || res.statusCode == 204) {
				getAllStation()
			} else {
				isTipsError.value = true
				tipsContent.value = "站位验证失败"
			}
		})
	}
	//清除Feeder
	const clearFeeder = () => {
		uni.request({
			url: `http://${ipData.value.ip}:${ipData.value.port}/api/v1.0/feeders/${feed.value}/clear`,
			method: 'POST',
			header: {
				alias: machineData.value.alias
			},
			data: {
				clearBarcodeWasScanned: true
			}
		}).then(res => {
			// console.log(res);
			isClear.value = false
			tipsContent.value = ""
			feedIsKitt()
			getAllStation()
			// if (res.statusCode == 200 || res.statusCode == 204) {

			// }
		})
	}
	//reeID
	const reelCheck = () => {
		isTipsError.value = false
		tipsContent.value = ""
		uni.request({
			url: `http://${ipData.value.ip}:${ipData.value.port}/api/v1.0/reels/${reel.value}/information`,
			method: 'GET',
			header: {
				alias: machineData.value.alias
			},

		}).then(res => {
			// console.log(res);
			if (res.statusCode == 200 || res.statusCode == 204) {
				if (res.data.found) {
					kitForm.value.partNumber = res.data.partNo
					kitForm.value.manufacturer = res.data.manufacturer
					kitForm.value.reelID = res.data.reelID
					kitForm.value.quantity = res.data.remainingQuantity
				} else {
					isTipsError.value = true
					tipsContent.value = ""
				}
			}
		})
	}
	const kitting = () => {
		isTipsError.value = false
		tipsContent.value = ""
		uni.request({
			url: `http://${ipData.value.ip}:${ipData.value.port}/api/v1.0/kitting`,
			method: 'POST',
			header: {
				alias: machineData.value.alias
			},
			data: kitForm.value

		}).then(res => {
			console.log(res);
			if (res.statusCode == 200 || res.statusCode == 204) {
				kitFormRef.value.resetFields()
				isKitt.value = false
				getAllStation()
			}

		})
	}
	const operatorLogOUt = () => {
		isTipsError.value = false
		tipsContent.value = ""
		const regex = /\d+/;
		const match1 = regex.exec(operatorForm.value.operatorBarcode);
		if (uni.getStorageSync('OPER') == match1[0]) {
			operatorForm.value.force = false
		} else {
			operatorForm.value.force = true
		}
		// console.log(operatorForm.value);
		uni.request({
			url: `http://${ipData.value.ip}:${ipData.value.port}/api/v1.0/operator/log-in-out?ErrorHandlingIfUnauthorized=`,
			method: 'POST',
			header: {
				alias: machineData.value.alias
			},
			data: operatorForm.value

		}).then(res => {
			// console.log(res);
			if (res.statusCode == 200 || res.statusCode == 204) {
				const regex = /\d+/;
				const match = regex.exec(res.data.operatorBarcode);
				isTipsError.value = false
				if (res.data.force) {
					operatorForm.value.operatorBarcode = match[0]
					kitForm.value.operator = match[0]
					uni.setStorageSync('OPER', match[0])
					isTipsError.value = false
					tipsContent.value = `${res.data.operatorBarcode}登录成功`
				} else {
					uni.setStorageSync('OPER', "")
					operatorForm.value.operatorBarcode = ""
					kitForm.value.operator = ""
						tipsContent.value = `${res.data.operatorBarcode}已注销`
				}
				// kitFormRef.value.resetFields()
				// isKitt.value = false
				// getAllStation()
			}

		})
	}
</script>

<style lang="scss" scoped>
	.content1 {
		height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;
		overflow: auto;
		margin-bottom: 60px;

		.inputbox {
			position: absolute;
			// left: -999px;
			// z-index: 999999;
		}

		.coll {
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			gap: 10px;
			padding: 0 15px;

			.coll-title {

				// margin-top: 10px;
				padding: 10px 20px 0 20px;
				font-size: 20px;
				font-weight: bold;
			}

			.title {
				display: flex;
				justify-content: space-around;
				font-size: 16px;
				font-weight: bold;
			}


			.ng {
				color: red;
			}
		}

		.box {
			// border: 1px solid  red;
			// padding: 20px 0;
		}

		// .list-box {
		// 	position: relative;
		// 	&::after,
		// 	&::before {
		// 		z-index: 1;
		// 		content: '';
		// 		position: absolute;
		// 		top: 0;
		// 		bottom: 0;
		// 		width: 2px;
		// 		/* 竖线的宽度 */
		// 		background-color: gainsboro;
		// 		/* 竖线的颜色 */
		// 	}

		// 	&::before {
		// 		left: 50%;
		// 		transform: translateX(-50%);
		// 	}

		// 	&::after {
		// 		left: 75%;
		// 		transform: translateX(-50%);
		// 	}
		// 	  .child {  
		// 	    position: relative; /* 如果子div需要相对定位 */  
		// 	    z-index: 1; /* 确保子div位于伪元素之上 */  
		// 	    /* 其他样式，如宽度、高度、背景色等 */  
		// 	  }  

		// }

	}

	.active-panel {
		border: 1px solid red;
		margin-bottom: 10px;
		/* 红色边框 */
	}

	.inactive-panel {
		margin-bottom: 10px;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, .12);
		/* 灰色边框 */
	}

	::v-deep .input-placeholder {
		color: red !important;
	}

	.active-input {
		background-color: #fff;
		color: green;
	}

	.msg {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index:19999;
		width: 100%;
		border-top: 1px solid #4d80f0;
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
		background-color: #dcecff;

		.tips {
			height: 60px;
			padding: 5px;

			.tips-content {
				margin-top: 5px;
				font-size: 18px;
				font-weight: bold;
				
			}
			.activetips{
				color: #ff0000;
			}
			
		}
	}

	.msg-title {
		position: fixed;
		bottom: 80px;
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
			background-color: #000;
		}

		.msg-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			// margin: 0 10px;
			box-sizing: border-box;
			border: 1px solid #000;
			border-radius: 3px;
			width: 100%;
			height: 80px;
			background-color: #fff;
			box-shadow: 0px 0px 15px rgba(0, 0, 0, .3);

		}
		
	}
</style>