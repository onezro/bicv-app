<template>
	<view class="content">
		<uni-section title="入库扫描" type="line" class="sect1">
			<view class="box">
				<up-form labelPosition="left" :model="formData" ref="formRef" labelWidth="70">
					<up-form-item label="是否打印" prop="IsPrint" class='test'>
						<uni-data-checkbox v-model="formData.IsPrint" :localdata="localdata" />
					</up-form-item>
					<up-form-item label="计划单号" prop="MfgOrderName" class='test'>
						<up-input placeholder="计划单号"  v-model="formData.MfgOrderName" disabled
							style="height: 30px;" fontSize='13px' 
							>
						</up-input>
					</up-form-item>
					<up-form-item label="箱条码" prop="barCode" class='test'>
						<up-input placeholder="请扫描箱条码" @focus="focus" :focus="barCodeFocus" v-model="formData.barCode"
							@confirm="submitQRCode"  style="height: 30px;" fontSize='13px'>
							<template #suffix>
								<uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="20"></uni-icons>
							</template>
						</up-input>
					</up-form-item>
					<up-form-item label="备注" prop="Remark" class='test'>
						<up-input placeholder="备注"  v-model="formData.Remark" 
							style="height: 30px;" fontSize='13px' 
							>
						</up-input>
					</up-form-item>
				</up-form>
				<view class="" style="display: flex;justify-content: flex-end;">
					<view class="">
					<wd-button size="small" :round="false" type="info" @click="reset">重置</wd-button>
					</view>
				</view>
			</view>
		</uni-section>
		<uni-section title="入库清单" type="line">
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<uni-list :border="true">
					<uni-swipe-action>
						<uni-swipe-action-item v-for="f in  list" :key="f" :right-options="rightOptions"
							@click="swipeClick($event, f)">
							<uni-list-item :title="'箱条码：'+f.PackagingBoxNumber"
								:note="'产品描述：'+f.ProductDescription"
								:rightText="'计划号：'+f.MfgOrderName"></uni-list-item>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</uni-list>
			</scroll-view>
			<template v-slot:right>
				<view class="" style="display: flex;align-items: center;">
					<wd-button :round="false" :disabled="list.length==0"
						size="small" @click="submit">提交入库</wd-button>
				</view>
			</template>
		</uni-section>
	</view>
</template>

<script setup>
	import {ScanPackagingBoxNumberDetails,FinishedProductStorage} from "@/api/asy.js"
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
	const formRef=ref()
	const secthe = ref(0)
	const list = ref([])
	const localdata=ref([{
		text: '是',
		value: true
	}, {
		text: '否',
		value: false
	}])
	const rightOptions = ref([{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}])
	const formData=ref({
		IsPrint:true,
		barCode:"",
		MfgOrderName:"",
		Remark:"",
	})
	const barCodeFocus=ref(true)
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
	const focus=()=>{
		uni.hideKeyboard()
	}
	const submitQRCode=()=>{
		ScanPackagingBoxNumberDetails({PackagingBoxNumber:formData.value.barCode}).then(res=>{
			if(formData.value.MfgOrderName==""){
				formData.value.MfgOrderName=res.content[0].MfgOrderName
			}
			
			if(res.content[0].MfgOrderName==formData.value.MfgOrderName){
				
				const isEixt = list.value.findIndex(b => b.PackagingBoxNumber == formData.value.barCode)
				console.log(isEixt);
				if(isEixt==-1){
					audioSuccessPlay()
					list.value.push({...res.content[0]})
				}else{
					audiofailPlay()
					uni.showToast({
						title: `${formData.value.barCode}箱条码重复`,
						icon: 'none',
					})
				}
			}else{
				audiofailPlay()
				uni.showToast({
					title: `${res.content[0].MfgOrderName}计划单号不一致`,
					icon: 'none',
				})
				
			}
			formData.value.barCode=""
			getFocus()
		}).catch(()=>{
			formData.value.barCode=""
			getFocus()
			audiofailPlay()
		})
	}
	const iconClickQRCode = () => {
		uni.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: res => {
				// console.log(res.result);
				formData.value.barCode = res.result
				submitQRCode()
			}
		});
	}
	const submit=()=>{
		let data={
			  userAccount: name.value,
			  Remark: formData.value.Remark,
			  IsPrint: formData.value.IsPrint,
			  PackagingBoxNumberList: []
		}
		list.value.forEach(l=>{
			data.PackagingBoxNumberList.push(l.PackagingBoxNumber)
		})
		// console.log(data);
		FinishedProductStorage(data).then(res=>{
			audioSuccessPlay()
			uni.showToast({
				title: res.msg,
				icon: 'none',
			})
			list.value=[]
			formData.value.MfgOrderName=""
			formData.value.Remark=""
			formData.value.IsPrint=true
			getFocus()
		}).catch(()=>{
			audiofailPlay()
		})
		
	}
	const swipeClick = (e, data) => {
		list.value = list.value.filter(l => l.PackagingBoxNumber != data.PackagingBoxNumber)
	}
	const reset=()=>{
		list.value=[]
		formData.value.MfgOrderName=""
		formData.value.barCode=""
		formData.value.Remark=""
		formData.value.IsPrint=true
		getFocus()
	}
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
		font-size: 13px;
	}
</style>