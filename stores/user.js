import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import {
	getToken,
	setToken,
	removeToken
} from '@/utils/auth'
const useUserStore = defineStore('user', () => {
	const token = ref(getToken())
	const name = ref(storage.get(constant.name))
	const permissions = ref(storage.get(constant.permissions))
	const SET_TOKEN = (data) => {
		token.value = data
	}
	const SET_NAME = (data) => {
		// console.log(data);
		name.value = data
		storage.set(constant.name, data)
	}
	const SET_PERMISSIONS = (data) => {
		permissions.value = data
		storage.set(constant.permissions, data)
	}
	const LOGOUT = () => {
		SET_TOKEN('')
		SET_PERMISSIONS([])
		removeToken()
		storage.clean()
		
	}
	return {
		token,
		name,
		permissions,
		SET_TOKEN,
		SET_NAME,
		SET_PERMISSIONS,
		LOGOUT
	}
})
export default useUserStore;
// export function useUserStoreHook() {
//   return useUserStore(store);
// }