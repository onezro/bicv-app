<template>
	<view class="content">
		<view class="bigBox">
			<image class="imgbg" src="../static/zn4.gif" mode="widthFix"></image>
		</view>
		
			<uni-section v-for="(m,i) in  permissions" :key="m.id" :title="m.title" type="line" titleFontSize='18px'>
				<uni-grid :column="4" :show-border="false" @change="goToFist1($event,m.title,m.childMenu)">
					<uni-grid-item v-for="(c,index) in m.childMenu" :index="index" :key="index">
						<view class="box">
							<image class="img" :src="c.MenuName" mode=""></image>
							<view class="grid-text">{{c.title}}</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</uni-section>
	
		<!-- <uni-section title="IPQC" type="line" titleFontSize='18px' >
			<uni-grid :column="4" :show-border="false" @change="goToFist">
				<uni-grid-item v-for="(item,index) in meun" :index="index" :key="index">
					<view class="box">
						<image class="img" :src="item.img" mode=""></image>
						<view class="grid-text">{{item.text}}</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</uni-section> -->
	</view>
	<!-- <tabar/> -->
</template>

<script setup>
	import tabar from '@/pages/tabar/index.vue'
	import {
		checkPermi
	} from '@/utils/permission'
	import mesMESStore from '@/stores/mes.js'
	import useUserStore from '@/stores/user.js'
	import {
		storeToRefs
	} from 'pinia'
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onReady
	} from "@dcloudio/uni-app"
	const mesStore = mesMESStore()
	const userStore = useUserStore()
	const {
		permissions
	} = storeToRefs(userStore)
	// const meun = ref([{
	// 		text: '首检',
	// 		color: 'rgb(84 184 249)',
	// 		code: 'FI',
	// 		img: '../static/svg/first.svg'
	// 	},
	// 	{
	// 		text: '巡检',
	// 		color: 'rgb(211 142 247)',
	// 		code: 'RI',
	// 		img: '../static/svg/inset.svg'
	// 	}, {
	// 		text: '设备点检',
	// 		color: 'rgb(79 215 94)',
	// 		code: 'EI',
	// 		img: '../static/svg/eq.svg'
	// 	},
	// 	{
	// 		text: '4M点检',
	// 		color: 'rgb(69 152 251)',
	// 		code: '4I',
	// 		img: '../static/svg/wo.svg'
	// 	},
	// 	{
	// 		text: '开班点检',
	// 		color: 'rgb(69 152 251)',
	// 		code: 'CI',
	// 		img: '../static/svg/class.svg'
	// 	}
	// ])
	onReady(() => {
		uni.createSelectorQuery().select('.bigBox').boundingClientRect(data => {
			// console.log(data.height);
		}).exec()
		// console.log(secthe.value);
	})
	// const goToFist = ({
	// 	detail
	// }) => {
	// 	// console.log(detail);
	// 	mesStore.SET_interfaceData({
	// 		inspectType: meun.value[detail.index].code
	// 	})
	// 	uni.navigateTo({
	// 		url: '/pages/mes/firstInspection/index?type=' + meun.value[detail.index].code
	// 	});
	// }
	const goToFist1 = ({
		detail
	}, title, m) => {
		// console.log(title);
		if (title == '质量管理') {
			mesStore.SET_interfaceData({
				inspectType: m[detail.index].component
			})
			// console.log(mesStore.interfaceData.value);
			// console.log(m[detail.index].component);
		}
		uni.navigateTo({
			url: m[detail.index].redirect
		});
		// console.log(detail.index,m);
	}
</script>

<style lang="scss" scoped>
	.content {
		// width: 100%;
		height: 100%;
		background-color: #fff;

		.imgbg {
			width: 100%;
		}

		.bigBox {
			// position: sticky;
			// top: 0;
			// left: 0;
			// display:;
			width: 100%;
			height: 350rpx;
			overflow: hidden;
			// z-index: 999;
		}

		.con {
			width: 100%;
			background-color: #000;
		}

		.box {
			// flex: 1;
			// padding:0 0 0 30rpx ;
			display: flex;
			flex-direction: column;
			align-items: center;

			.img {
				width: 110rpx;
				height: 110rpx;
			}



			.grid-text {
				padding: 10rpx;
				font-size: 26rpx;
				text-align: center;

			}
		}
	}
</style>