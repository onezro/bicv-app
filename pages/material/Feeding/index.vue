<template>
	<view class="content">
		<uni-section title="工位选择" type="line">
			<view class="box">
				<up-form labelAlign="left" :model="form" ref="formRef" labelWidth="50">
					<up-form-item label="产线" @change="changeLine">
						<uni-data-select v-model="line" :localdata="lineData" @change="change"></uni-data-select>
					</up-form-item>
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
	const lineDec=ref('')
	const lineData = ref([])
	const workStation = ref('')
	const stationData = ref([])
	const localdata = ref([])

	onMounted(() => {
		getData()
	})

	const getData = () => {
		findWorkstationListByOPUI().then(res => {
			let data = res.content.filter((c) => c.FID !== null && c.FID !== '')
			data = data.map(d => {
				return {
					value: d.Name,
					text: d.Desc,
					...d
				}
			})
			localdata.value = OrganData(data)
			data = data.filter(c => c.Level !== 3)
			lineData.value = data
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
			if (org.FID !== org.ID) {
				const parentOrg = organizationMap.get(org.FID);
				if (parentOrg) {
					parentOrg.children.push(organizationMap.get(org.ID));
				}
			}
		});
		return Array.from(organizationMap.values())
	}
	const change = (val) => {
		let data = localdata.value.find(l => val === l.value)
		stationData.value = data.children
		lineDec.value=data.text
	}
	// const changeLine=(val)=>{
		
	// }
	const changeStation = (val) => {
		const station = localdata.value.find(l => val === l.value)
		uni.navigateTo({
			url: `/pages/material/Feeding/edit?workStation=${station.value}&workStationDec=${station.text}&line=${line.value}`
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