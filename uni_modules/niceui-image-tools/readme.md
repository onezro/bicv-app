### API
|  api  |     说明    |   参数  | 返回值示例 |
|  ---- |  --------  | ----  |  ----  |
| pathToBase64  | 从图像路径转换为base64。注意：uni-app、微信小程序和5+APP使用的路径不支持网络路径，如果是网络路径需要先使用下载API下载下来。 |  path：本地图像路径 |  data:image/png;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHCAkIBgoJCAkMCwoMDxoRDw4ODx8WGBMaJSEnJiQhJCMpLjsyKSw4LCMkM0Y0....  |
| base64ToPath | 将图像base64保存为文件，返回文件路径。 |  base64：base64字符串 |  http://usr/1693659240628.png  |
### 参考代码
```
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
</style>

```