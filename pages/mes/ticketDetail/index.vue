<template>
	<view class="">
		<other-inspect :option="option" :list="list"></other-inspect>
		<!-- <equipInspect :option="option" v-if="option.type=='EI'"></equipInspect> -->
		<!-- <proceInspect :option="option" :list="list" v-if="option.type=='FI'"></proceInspect> -->
	</view>
</template>

<script setup>
	import otherInspect from './components/otherInspect.vue'
	// import proceInspect from './components/proceInspect.vue'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		audioSuccessPlay,
		audiofailPlay
	} from '@/utils/prompt.js'
	import {
		storeToRefs
	} from 'pinia'
	import mesMESStore from '@/stores/mes.js'
	import {
		getTacketStep,
		// getELStepContent,
		getStepContent
	} from '@/api/login.js'
	import {
		ref,
		computed,
		nextTick
	} from 'vue'
	const mesStore = mesMESStore()
	const {
		ticketNumber,
		tagName,
		interfaceData
	} = storeToRefs(mesStore)

	const option = ref('')
	const detailList = ref([])
	const list = ref([])
	const getText = ref({
		inspectOrder: "",
		step: 0,
		status: "",
		name: "",
		inspectContent: ""
	})
	onLoad((options) => {
		getText.value.inspectOrder = options.order
		getText.value.step = options.step
		option.value = options
		nextTick(() => {
			uni.setNavigationBarTitle({
				title: options.order + '--' + options.title
			});
		})

	})
	onShow(() => {
		getData()
	})

	const getData = () => {
		// console.log(interfaceData.value);
		getTacketStep(interfaceData.value).then((res) => {
			// console.log(res);
			let data = res.content
			let a = JSON.parse(data.OrderInfo)
			let b = JSON.parse(data.DetailList)
			mesStore.SET_taskData(b)
			// console.log(getText.value);
			getStepContent(getText.value).then((data) => {
				let SubItemList = data.content
				// console.log(SubItemList);
				list.value = SubItemList
				// nextTick(() => {
				// 	uni.hideLoading();
				// })
			})
		})
	}
</script>

<style lang="scss" scoped>

</style>