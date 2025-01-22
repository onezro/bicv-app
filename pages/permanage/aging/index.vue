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
		QuerySpecStation('P1825').then(res => {
			let data = res.content
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
		uni.navigateTo({
			url: `/pages/permanage/aging/edit?workStation=${station.value}&workStationDec=${station.text}`
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