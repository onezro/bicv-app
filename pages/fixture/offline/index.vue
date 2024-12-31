<template>
	<view class="content">
		<uni-section title="工位选择" type="line">
			<view class="box">
				<up-form labelAlign="left" :model="form" ref="formRef" labelWidth="50">
					<up-form-item label="车间">
						<uni-data-select v-model="work" :localdata="workData" @change="changeWork" :clear="false" ></uni-data-select>
					</up-form-item>
					<up-form-item label="产线">
						<uni-data-select v-model="line" :localdata="lineData" @change="change" :clear="false"></uni-data-select>
					</up-form-item>
					<up-form-item label="工位">
						<uni-data-select v-model="workStation" :localdata="stationData"
							@change="changeStation" :clear="false"></uni-data-select>
					</up-form-item>
				</up-form>
			</view>
		</uni-section>
	</view>
</template>

<script setup>
	import {
		GetFactoryModelPADList
	} from '@/api/work.js'
	import {
		ref,
		onMounted
	} from "vue"
	const line = ref('')
	const lineDec = ref('')
	const lineData = ref([])
	const workStation = ref('')
	const stationData = ref([])
	const localdata = ref([])
	const workData = ref([])
	onMounted(() => {
		getData()
	})

	const getData = () => {
		GetFactoryModelPADList().then(res => {
			
			let data = res.content.map(d => {
				return {
					value: d.Name,
					text: d.Desc,
					...d
				}
			})
		
			workData.value = OrganData(data)
		
		})
	}
	const OrganData = (organizations) => {
		const organizationMap = new Map();
		organizations.forEach((org) => {
			organizationMap.set(org.ID, {
				...org,
				children: []
			});
		});
		organizations.forEach((org) => {
			if (org.FID !== null) {
				const parentOrg = organizationMap.get(org.FID);
				if (parentOrg) {
					parentOrg.children.push(organizationMap.get(org.ID));
				}
			}
		});
		return Array.from(organizationMap.values()).filter(org => org.FID === null);
	}
	const changeWork = (val) => {
		// console.log(val);
		let data = workData.value.find(l => val === l.value)
		lineData.value = data.children
		stationData.value=[]
		workStation.value=""
	}
	const change = (val) => {
		let data = lineData.value.find(l => val === l.value)
		stationData.value = data.children
		lineDec.value = data.text
	}
	const changeStation = (val) => {
		const station = stationData.value.find(l => val === l.value)
		uni.navigateTo({
			url: `/pages/fixture/offline/edit?workStation=${station.value}&workStationDec=${station.text}&line=${lineDec.value}`
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