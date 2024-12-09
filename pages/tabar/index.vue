<template>
	<up-tabbar :value="activeIndex" @change="change" :fixed="true" activeColor="#005a79" :placeholder="true"
		:safeAreaInsetBottom="true">
		<up-tabbar-item text="首页">
			<template #active-icon>
				<image class="u-page__item__slot-icon" src="../../static/images/tabbar/home1_.png">
				</image>
			</template>
			<template #inactive-icon>
				<image class="u-page__item__slot-icon" src="../../static/images/tabbar/home1.png"></image>
			</template>
		</up-tabbar-item>
		<up-tabbar-item text="消息" badge="3">
			<template #active-icon>
				<image class="u-page__item__slot-icon" src="../../static/images/tabbar/msg2.png">
				</image>
			</template>
			<template #inactive-icon>
				<image class="u-page__item__slot-icon" src="../../static/images/tabbar/msg1.png"></image>
			</template>
		</up-tabbar-item>
		<up-tabbar-item text="我的">
			<template #active-icon>
				<image class="u-page__item__slot-icon" src="../../static/images/tabbar/mine1.png">
				</image>
			</template>
			<template #inactive-icon>
				<image class="u-page__item__slot-icon" src="../../static/images/tabbar/mine2.png"></image>
			</template>
		</up-tabbar-item>
	</up-tabbar>
</template>

<script setup>
	import {
		onShow
	} from '@dcloudio/uni-app';
	import {
		ref
	} from 'vue'
	// import {
	// 	uRouter
	// } from '@/utils/router';
	// const {
	// 	go
	// } = uRouter
	const activeIndex = ref(0)
	const menu = ref([{
		text: '首页',
		pagePath: "pages/index",
	}, {
		text: '消息',
		pagePath: "pages/msg/index",
	}, {
		text: '我的',
		pagePath: "pages/mine/index",
	}])
	const initActive = () => {
		const pages = getCurrentPages()
		activeIndex.value = menu.value.findIndex(e => e.pagePath === pages[0].route)
	}
	onShow(() => {
		initActive()
		uni.hideTabBar()
	})
	const change = (index) => {
		uni.switchTab({
			url: `/${menu.value[index].pagePath}`
		})
	}
</script>

<style lang="scss">
	.u-page__item__slot-icon {
		width: 27px;
		height: 27px;
	}
</style>