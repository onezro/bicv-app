<template>
	<view class="content">
		<uni-section title="工位选择" type="line">
			<view class="box">
				<uni-data-select v-model="workStation" :localdata="localdata" @change="change"></uni-data-select>
			</view>

		</uni-section>

	</view>
</template>

<script setup>
	import {
		QuerySpecStation
	} from '@/api/smt.js'
	import {
		ref,
		onMounted
	} from "vue"
	const localdata = ref([])
	const workStation = ref('')

	
	onMounted(() => {
		getData()
	})

	const getData = () => {
		QuerySpecStation('SMT-INV').then(res => {
			let data = res.content
			// console.log(data);
			localdata.value = data.map(d => {
				return {
					value: d.EQUIPMENTNAME,
					text: d.EQUIPMENTDESC
				}
			})
		})
	}
	const change = (val) => {
		const station = localdata.value.find(l => val === l.value)
		// console.log(station);
		uni.navigateTo({
			url: `/pages/permanage/burnFinish/edit?workStation=${station.value}&workStationDec=${station.text}`
		})
	}
</script>

<style scoped lang="scss">
	.content {
		height: 100%;
		background: #fff;

		// position: relative;
		.box {
			padding: 0 10px;
		}


	}
</style>