<template>
	<view class="page">
		<view class="box">
			<view class="msg">
				<up-avatar shape="square" size='50'
					src="https://uview-plus.jiangruyi.com/uview-plus/album/1.jpg"></up-avatar>
				<view class="avatar-info">
					<view class="">{{name}}</view>
					<!-- <view class="role">管理员 </view> -->
				</view>
			</view>
			<!-- <uni-icons type="right" color="#ffffffc4" size="24"></uni-icons> -->
		</view>
		<view class="content">
			<view class="areas">
				<view class="about">
					<view class="item">
						<image class="img" src="../../static/svg/mineUser.svg" mode=""></image>
						<text>账号与安全</text>
					</view>
					<uni-icons type="right" color="#c8c8c8" size="16"></uni-icons>
				</view>
				<view class="about">
					<view class="item">
						<image class="img" src="../../static/svg/about.svg" mode=""></image>
						<text>关于</text>

					</view>
					<view class="item" style="font-size: 28rpx;color: #a2a2a2;">
						<text>版本号</text>
						<text>{{version_number}}</text>
						<text style="padding: 5px;font-size: 28rpx;color:red" v-if="isNewVersion"
							@click="handleToUpgrade">更新</text>
						<uni-icons type="right" color="#c8c8c8" size="16"></uni-icons>
					</view>
				</view>
				<view class="about" @click="clearApp">
					<view class="item">
						<image class="img" src="../../static/svg/clear.svg" mode=""></image>
						<text>清除安装包缓存</text>
					</view>
					<uni-icons type="right" color="#c8c8c8" size="16"></uni-icons>
				</view>

			</view>
			<view class="out" @click.stop="logOut">退出登录</view>
		</view>
		<up-modal :show="showModal" :showCancelButton="true" @confirm="confirm" @cancel="cancel" ref="uModal"
			:title="'发现新版本'+newVerMess.CurrentVer">
			<view class="slot-content" style="color: red;font-size: 30rpx;">
				<text>{{newVerMess.UpdateLog}}</text>

			</view>
		</up-modal>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="下载进度" value="对话框预置提示内容!" placeholder="请输入内容"
				@confirm="dialogInputConfirm">
				<view class="">
					<wd-progress :percentage="percent" />
					<!-- <progress :percent="percent" activeColor="#10AEFF" show-info stroke-width="3" /> -->
					</view>
			</uni-popup-dialog>
		</uni-popup>
	</view>
	<!-- <tabar/> -->
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onReady,
		onShow
	} from "@dcloudio/uni-app"
	import tabar from '@/pages/tabar/index.vue'
	import useUserStore from '@/stores/user.js'
	import {
		storeToRefs
	} from 'pinia'
	import {
		compare
	} from "@/utils/compareVers.js"
	import {
		GetPDAVersion
	} from "@/api/login.js"
	import {updateApp}  from "@/utils/updateApp.js"
	const userStore = useUserStore()
	const {
		name
	} = storeToRefs(userStore)
	const version_number = ref('')
	const inputDialog = ref()
	const showModal = ref(false)
	const percent = ref(0)
	const savedFilePath = ref('')
	const isNewVersion = ref(false)
	const newVerMess = ref({
		CurrentVer: "",
		UpdateLog: "",
		UpdateUrl: ""
	})
	const logOut = () => {
		userStore.LOGOUT()
		uni.reLaunch({
			url: '/pages/index'
		})
	}
	onLoad(() => {
		const systemInfo = uni.getSystemInfoSync();
		version_number.value = systemInfo.appWgtVersion
		getVersion()

	})
	onShow(() => {
		getVersion()

	})
	const getVersion = () => {
		GetPDAVersion().then(res => {
			if (compare(res.content.CurrentVer, version_number.value)) {
				isNewVersion.value = true
				newVerMess.value = {
					...res.content
				}
				// console.log(newVerMess.value);
			} else {
				isNewVersion.value = false
			}
		})
	}
	const handleToUpgrade = () => {
		uni.showModal({
			title: `发现新版本${newVerMess.value.CurrentVer}`,
			content: newVerMess.value.UpdateLog,
			cancelText: "暂不更新",
			confirmText: "更新",
			success: data => {
				if (data.confirm) {
				updateApp(newVerMess.value.UpdateUrl)
				} else if (data.cancel) {
					uni.showToast({
						title: '已取消更新',
						icon: 'error',
					})
				}
			}
		})
		// uni.showModal({
		// 	title: '提示',
		// 	content: '是否更新',
		// 	success: res => {
		// 		if (res.confirm) {
		// 			inputDialog.value.open()
		// 			// this.showzx = true
		// 			// this.$refs.inputDialog.open()
		// 			// this.Download()
		// 		} else if (res.cancel) {
		// 			console.log('用户点击取消');
		// 		}
		// 	}
		// })
		// showModal.value = true
	}
	const confirm = () => {
		showModal.value = false
		inputDialog.value.open()
		Download()
		// console.log(newVerMess.value.UpdateUrl);
	}
	const cancel = () => {
		showModal.value = false
	}
	const dialogInputConfirm = () => {
		inputDialog.value.close()
		uni.openDocument({
			filePath: savedFilePath.value,
			success: function(res) {
				// console.log('打开文档成功');
			}
		});
	}
	const Download = () => {
		const downloadTask = uni.downloadFile({
			url: newVerMess.value.UpdateUrl, //下载地址接口返回
			success: (data) => {
				if (data.statusCode === 200) {
					//文件保存到本地
					uni.saveFile({
						tempFilePath: data.tempFilePath, //临时路径
						success: function(res) {
							uni.showToast({
								icon: 'none',
								mask: true,
								title: '文件已保存：' + res.savedFilePath, //保存路径
								duration: 3000,
							});
							savedFilePath.value = res.savedFilePath
							setTimeout(() => {
								//打开文档查看
								uni.openDocument({
									filePath: res.savedFilePath,
									success: function(res) {
										// console.log('打开文档成功');
									}
								});
							}, 3000)
						}
					});
				}
			},
			fail: (err) => {
				console.log(err);
				uni.showToast({
					icon: 'none',
					mask: true,
					title: '失败请重新下载',
				});
			},
		});
		downloadTask.onProgressUpdate((res) => {
			console.log('下载进度' + res.progress);
			percent.value = res.progress
		})
	}
	const delFile = (filePath) => {

		//获取文件对象
		plus.io.resolveLocalFileSystemURL(filePath, function(entry) {

			//删除文件
			entry.removeRecursively(success => {
				// console.log(success)
				uni.showToast({
					title: '清除成功',
					icon: 'success',
				})
			}, err => {
				uni.showToast({
					title: '清除失败',
					icon: 'error',
				})
				console.log(err)
			});

		}, function(e) {
			console.log('可能没有目录', e)
		})
	}
	const clearApp=()=>{
		uni.showModal({
			title: '提示',
			content: `是否清除apk`,
			success: (res) => {
				if (res.confirm) {
				delFile('_doc/uniapp_save/')
				delFile('_doc/update/')
				} else if (res.cancel) {
		
				}
			}
		});
	}
</script>

<style lang="scss">
	.page {

		height: 100%;
		background-color: #f6f6f6;

		.box {
			display: flex;
			// gap: 10px;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 40rpx;
			background-color: #0d7cff;
			margin-bottom: 30rpx;

			.msg {
				display: flex;
				// gap: 10px;

				// justify-content: space-between;
				.avatar {
					border-radius: 15rpx;
					width: 50px;
					height: 50px;
					background-color: #fff;
				}

				.avatar-info {
					margin-left: 10px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					// align-items: center;
					font-size: 1.3rem;
					color: #fff;


					.role {
						font-size: 0.9rem;
						color: #ffffffc4;
					}
				}
			}


		}

		.content {
			margin: 0 25rpx;

			.areas {
				box-sizing: border-box;
				padding-left: 15px;
				margin-bottom: 20rpx;
				// padding: 0 10rpx;
				border-radius: 15rpx;
				// height: 200px;
				background-color: #fff;

				.about {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 15rpx 15rpx 15rpx 0;
					border-bottom: 1px solid #efefef;

					.item {
						display: flex;
						align-items: center;
						// gap: 20rpx;
						font-size: 16px;

						.img {
							margin-right: 20rpx;
							width: 24px;
							height: 24px;

						}
					}
				}
			}

			.out {
				padding: 20rpx;
				border-radius: 15rpx;
				font-size: 32rpx;
				text-align: center;
				background-color: #fff;
			}
		}
	}
</style>