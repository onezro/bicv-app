import {
	createPinia
} from 'pinia'
// 引入持久化插件
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
// 使用持久化插件
pinia.use(persist)
export function setupStore(app) {
  app.use(pinia);
}

export default {pinia}
