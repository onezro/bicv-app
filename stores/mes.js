import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'
const mesMESStore = defineStore('mes', () => {
	const tagName = ref({
		FI: '首检',
		RI: '巡检',
		EI: '设备点检',
		'4I': '4M点检',
		CI: '开班点检'
	})
	const ticketNumber = ref([])
	const taskData = ref([])
	const interfaceData = ref({
		inspect: "",
		inspectType: "",
		workOrder: ""
	})
	const SET_ticketNumber=(data)=>{
		ticketNumber.value=data
	}
	const SET_taskData=(data)=>{
		taskData.value=data
	}
	const SET_interfaceData=(interfaceType)=>{
		// console.log(interfaceType);
		interfaceData.value = {
			...interfaceData.value,
			...interfaceType
		}
	}
	
	return {
		tagName,
		ticketNumber,
		taskData,
		interfaceData,
		SET_ticketNumber,
		SET_taskData,
		SET_interfaceData
	}
})
export default mesMESStore;