<template>
	<view class="content_container">
		<image :src="tempFilePaths[0]" v-if="tempFilePaths.length>0" mode="widthFix" style="width:100%;height:auto;"></image>
		<!-- <view v-if="tempFilePaths.length>0">{{tempFilePaths[0]}}</view> -->
		<button @click="chooseImage" class="btn-style">选择图片并转为base64</button>
		<view class="break-text overflow">得到base64: {{base64Str}}</view>
		
		<button @click="base64ToPath" class="btn-style">base64转为path</button>
		<view class="break-text">得到path: {{parsePath}}</view>
	</view>
</template>
<script>
	import imageTools from '../util/image-tools.js'
	export default {
		data() {
			return {
				tempFilePaths:[],
				base64Str:'',
				parsePath:''
			}
		},
		methods:{
			chooseImage(){
				uni.chooseImage({
					success: (chooseImageRes) => {
						this.tempFilePaths = chooseImageRes.tempFilePaths;
						imageTools.pathToBase64(this.tempFilePaths[0]).then(base64 => {
							this.base64Str = base64
						})
						.catch(error => {
							console.error(error)
						})
					}
				})
			},
			base64ToPath(){
				imageTools.base64ToPath(this.base64Str).then(path => {
					console.log(path)
					this.parsePath = path
				  })
				  .catch(error => {
					console.error(error)
				  })
			}

		}
	}
</script>
<style lang="scss">
	@import './uni-forms-style.scss';
	.content_container{
		padding:30rpx 35rpx;
	}
	.btn-style{
		width: 100%;
		background: $theme-color;
		color:#fff;
		margin: 10rpx 0;
		font-size: 35rpx;
	}
	.break-text{
		word-break:break-all;
	}
	.overflow{
		overflow:scroll;
		max-height:420rpx;
	}
	/** 引入真实项目时，请将以下样式拷贝到全局样式uni.scss中，不需要每个页面都定义 ----start**/
	view,
	image,
	text {
	  box-sizing: border-box;
	  flex-shrink: 0;
	}
	
	#app {
	  width: 100vw;
	  height: 100vh;
	}
	
	.flex-row {
	  display: flex;
	  flex-direction: row;
	}
	
	.flex-col {
	  display: flex;
	  flex-direction: column;
	}
	
	.justify-start {
	  display: flex;
	  justify-content: flex-start;
	}
	
	.justify-center {
	  display: flex;
	  justify-content: center;
	}
	
	.justify-end {
	  display: flex;
	  justify-content: flex-end;
	}
	
	.justify-evenly {
	  display: flex;
	  justify-content: space-evenly;
	}
	
	.justify-around {
	  display: flex;
	  justify-content: space-around;
	}
	
	.justify-between {
	  display: flex;
	  justify-content: space-between;
	}
	
	.items-start {
	  display: flex;
	  align-items: flex-start;
	}
	
	.items-center {
	  display: flex;
	  align-items: center;
	}
	
	.items-end {
	  display: flex;
	  align-items: flex-end;
	}
	/** 引入真实项目时，请将以下样式拷贝到全局样式uni.scss中，不需要每个页面都定义 ----end**/
</style>
