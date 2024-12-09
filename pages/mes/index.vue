<template>
	<view class="wcs-first">
		<view class="header">
			<view class="header-box">
				<view class="people-name">{{name}}</view>
			</view>
		</view>
		<uni-grid :column="3" :show-border="false" @change="goToFist">
			<uni-grid-item v-for="(item,index) in meun" :index="index" :key="index">
				<view class="box">
					<view class="box-img" :style="{'background':item.color}">
						<image class="img" src="../../static/svg/logo.svg" mode=""></image>
					</view>
					<view class="grid-text">{{item.text}}</view>
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script setup>
	// import {
	// 	mapState,
	// 	mapMutations
	// } from 'vuex'
	import useUserStore from '@/stores/user.js'
	import {storeToRefs} from 'pinia'
	import {
		ref,
		onMounted
	} from 'vue'
	const userStore = useUserStore()
	const {name}=storeToRefs(userStore)
	// const name1 = ref(name)
	const meun = ref([{
			text: '首检',
			color: 'rgb(84 184 249)',
			code: 'WI'

		},
		{
			text: '巡检',
			color: 'rgb(211 142 247)',
			code: 'RI'
		}, {
			text: '设备点检',
			color: 'rgb(79 215 94)',
			code: 'EI'
		},
		{
			text: '工艺点检',
			color: 'rgb(69 152 251)',
			code: 'FI'
		}
	])
	onMounted(()=>{
		console.log(userStore.name);
	})
	// export default {

	// 	computed: {
	// 		...mapState(['interfaceData'])
	// 	},
	// 	onShow() {
	// 		this.$store.dispatch('GetInfo').then(res => {
	// 			console.log(res);
	// 		})
	// 	},
	// 	methods: {
	// 		...mapMutations(['SET_interfaceData']),
	// 		back() {
	// 			uni.navigateBack({
	// 				delta: 1,
	// 			})
	// 		},
	// 		goToFist({
	// 			detail
	// 		}) {
	// 				this.SET_interfaceData({
	// 					inspectType: this.meun[detail.index].code
	// 				})

	// 			uni.navigateTo({
	// 				url: '/pages/mes/firstInspection/index?type=' + this.meun[detail.index].code
	// 			});

	// 		}
	// 	}
	// }
</script>

<style lang="scss" scoped>
	.page {
		height: 100%;
	}

	.wcs-first {
		background-color: #fff;
		height: 100%;
		// height:calc(100vh - 45px) ;

		// padding-bottom: 100rpx;
		.header {
			display: flex;
			box-sizing: border-box;
			padding: 20rpx;
			width: 100%;
			height: 30vh;
			background-image: url(../../static/bg.jpg);
			background-repeat: no-repeat;
			background-position: -280px -160px;
			background-color: rgba(255, 255, 255, .7);

			// filter: blur(6px);
			.header-box {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 45px;

				.people-name {
					font-size: 42rpx;
					color: #fff;
				}

				.avatar {
					position: absolute;
					right: 0;
				}
			}

		}

		.box {
			flex: 1;
			padding-top: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.box-img {
				box-sizing: border-box;
				border-radius: 20rpx;
				padding: 20rpx;
				width: 90rpx;
				height: 90rpx;

				// background-color: #5d98e9;
				.img {
					width: 100%;
					height: 100%;
				}
			}

			.grid-text {
				padding-top: 10rpx;
				font-size: 28rpx;

			}
		}
	}
</style>