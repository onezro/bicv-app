<template>
	<view class="content">
		<uni-section title="工位选择" type="line">
			<view class="box">
				<up-form labelAlign="left" :model="form" ref="formRef" labelWidth="50">
					<!-- <up-form-item label="产线" @change="changeLine">
						<uni-data-select v-model="line" :localdata="lineData" @change="change"></uni-data-select>
					</up-form-item> -->
					<up-form-item label="工位">
						<uni-data-select v-model="workStation" :localdata="stationData"
							@change="changeStation"></uni-data-select>
					</up-form-item>
				</up-form>
			</view>
		</uni-section>
	</view>
</template>

<script setup>
	import {
		findWorkstationListByOPUI
	} from '@/api/login.js'
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

	onMounted(() => {
		getData()
	})

	const getData = () => {
		findWorkstationListByOPUI().then(res => {
			let data = res.content
			data = data.map(d => {
				return {
					value: d.Name,
					text: d.Desc,
					...d
				}
			})

			localdata.value = OrganData(data)
			// console.log(localdata.value);
			let data2 = localdata.value.filter(c => c.value == "M08-ASY01")
			let data3 = []
			data2[0].children.forEach(m => {
				// console.log(m.children);
				data3.push(...m.children)
			})
			console.log(data3);
			stationData.value = data3
		})
	}
	const OrganData = (organizations) => {
		// const organizationMap = new Map();
		// organizations.forEach((org) => {
		// 	organizationMap.set(org.ID, {
		// 		...org,
		// 		children: []
		// 	});
		// });
		// organizations.forEach((org) => {
		// 	if (org.FID !== org.ID) {
		// 		const parentOrg = organizationMap.get(org.FID);
		// 		if (parentOrg) {
		// 			parentOrg.children.push(organizationMap.get(org.ID));
		// 		}
		// 	}
		// });
		// return Array.from(organizationMap.values())
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
		// console.log( organizations);
		return Array.from(organizationMap.values()).filter(org => org.FID === null);
	}
	const change = (val) => {
		let data = localdata.value.find(l => val === l.value)
		stationData.value = data.children
		lineDec.value = data.text
	}
	// const changeLine=(val)=>{

	// }
	const changeStation = (val) => {
		const station = stationData.value.find(l => val === l.value)
		uni.navigateTo({
			url: `/pages/permanage/finishPack/edit?workStation=${station.value}&workStationDec=${station.text}&line=${line.value}`
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