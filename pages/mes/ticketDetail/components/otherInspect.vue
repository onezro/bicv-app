<template>
	<view class="detail">
		<view class="content">
			<uni-section :title="option.title" titleFontSize="20px" type="line">
				<view class="check-content" v-for="item in list" :key="item.Step">
					<up-form ref="baseForm" :borderBottom='true' :modelValue="item">
						<up-form-item :borderBottom='true' label="检验名称" label-width="100">
							<text>{{item.SubItemName}}</text>
						</up-form-item>
						<up-form-item :borderBottom='true' label="检验目标" label-width="100">
							<text>{{item.SubItemAim}}</text>
						</up-form-item>
						<up-form-item :borderBottom='true' label="检验方法" label-width="100">
							<text>{{item.SubItemMethod}}</text>
						</up-form-item>
						<up-form-item :borderBottom='true' label="检查标准" label-width="100">
							<text style="word-wrap: break-word;
							word-break: break-all;">{{item.SubItemBasic}}</text>
						</up-form-item>
						<up-form-item :borderBottom='true' label="解决方法" label-width="100">
							<text style="word-wrap: break-word;
							word-break: break-all;">{{item.SubItemSolution}}</text>
						</up-form-item>
					</up-form>
					<!-- 	<up-form ref="baseForm" :borderBottom='true' :modelValue="item">
						<up-form-item :borderBottom='true' label="检验名称" label-width="100">
							<text>{{item.SubItemName}}</text>
						</up-form-item>
						<up-row gutter="30">
							<up-col span="6">
								<up-form-item :borderBottom='true' label="下限值" label-width="100">
									<text>{{item.SubItemMethod}}</text>
								</up-form-item>
							</up-col>
							<up-col span="6">
								<up-form-item :borderBottom='true' label="上限值" label-width="100">
									<text>{{item.SubItemAim}}</text>
								</up-form-item>
							</up-col>
						</up-row>
						<up-form-item :borderBottom='true' label="单位" label-width="100">
							<text style="word-wrap: break-word;
							word-break: break-all;">{{item.SubItemBasic}}</text>
						</up-form-item>
						<up-form-item :borderBottom='true' label="实际值" label-width="100">
							<input border='false' :id='i' v-model="item.SubItemSolution" @blur="changeValue"
								type="textarea" :disabled="judgmentFun" placeholder="请输入实际值" />
						</up-form-item>
					</up-form> -->
				</view>
			</uni-section>

		</view>
		<view class="bottom">
			<view class="result" v-if="judgmentFun">
				<view class="">结果：
					<text v-if="openTaskStep[0].Status==9" style="color: #4CAF50;">OK</text>
					<text v-if="openTaskStep[0].Status==1" style="color: red;">NG</text>
					<text v-if="openTaskStep[0].Status==2" style="color: #ffa726;">报修</text>
					<text v-if="openTaskStep[0].Status==3" style="color: #bdbdbd;">故障</text>
				</view>

			</view>
			<view class="thumbnail">
				<view class="imgtu" v-for="(item,index) in img" :key="index">
					<view class="del" @click.stop="deleteImg(index)"><uni-icons type="clear" size="40"
							color="rgb(250 0 0 / 80%)"></uni-icons>
					</view>
					<image class="img" :src="item" mode="" @click.stop="getImgIndex(index)"></image>
				</view>
			</view>

			<view class="choose">
				<view class="decision" v-if="!judgmentFun">
					<button class="custom-style" style="color: #ffffff;backgroundColor:#4CAF50;borderColor:#4CAF50"
						@click="photograph()">
						拍照
					</button>

					<button v-if="option.type == 'EI'" class="custom-style"
						style="color: #ffffff;backgroundColor:#ffa726;borderColor:#ffa726" @click="repair()">
						报修
					</button>
					<button v-if="option.type == 'EI'" class="custom-style" type="warn"
						style="color: #ffffff;backgroundColor:#bdbdbd;borderColor:#bdbdbd" @click=" fault()">
						故障
					</button>
					<button class="custom-style" type="warn" @click="ngRemark()">
						NG
					</button>
					<button class="custom-style" type="primary" @click="taskPassed()">
						OK
					</button>
				</view>
			</view>
			<view class="end">
				<button :disabled="previous" class="custom-style" @click="goToPreStep()">
					UP
				</button>
				<button class="custom-style" style="color: #ffffff;backgroundColor:#0094D9;borderColor:#0094D9"
					@click="goToNextStep()">
					NE
				</button>
			</view>
		</view>
		<view>
			<!-- 输入框示例 -->
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose" mode="input" title="备注" placeholder="请输入内容"
					@confirm="dialogInputConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
		<view>
			<!-- 提示窗示例 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog type="error" cancelText="否" confirmText="是" title="确认提示" content="确认检查无误"
					@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
		<view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		defineProps,
		computed
	} from "vue"
	import {
		uploadResults
	} from '@/api/login.js'
	import {
		pathToBase64,
		base64ToPath
	} from '@/utils/image-tools.js'
	// getBase64FromLocalAsync
	// import {
	// 	getBase64FromLocalAsync
	// } from '@/utils/tool.js'

	import {
		storeToRefs
	} from 'pinia'
	import mesMESStore from '@/stores/mes.js'
	const mesStore = mesMESStore()
	const {
		taskData,
		tagName
	} = storeToRefs(mesStore)
	const {
		option,
		list
	} = defineProps(['option', 'list'])
	const order = ref('')
	const title = ref('')
	const titleType = ref('')
	const img = ref([])
	const show = ref(false)
	const imgFile = ref([])
	const imgType = ref('')
	const searchValue = ref('')
	const inputDialog = ref(null)
	const alertDialog = ref(null)
	const submitData = ref({
		InspectOrder: '',
		DetailList: [{
			Step: 0,
			SubStatus: '',
			Remark: "",
			Attachment1: {
				Type: "",
				Base64String: "",
				Filename: ""
			},
			Attachment2: {
				Type: "",
				Base64String: "",
				Filename: ""
			},
			Attachment3: {
				Type: "",
				Base64String: "",
				Filename: ""
			},
			Attachment4: {
				Type: "",
				Base64String: "",
				Filename: ""
			}
		}]
	})
	const judgment = ref(false)
	const reportData = ref([])

	const openTaskStep = computed(() => {
		// console.log(taskData.value, option);
		return taskData.value.filter(({
			Step
		}) => Step == option.step)
	})

	const previous = computed(() => {
		let pre = taskData.value.findIndex(({
			Step
		}) => Step == option.step)
		if (pre == 0) {
			return true
		}
		return false
	})
	const judgmentFun = computed(() => {
		return openTaskStep.value[0].Status == 9 || openTaskStep.value[0].Status == 1 || openTaskStep.value[0]
			.Status == 2 || openTaskStep.value[0].Status == 3
	})

	const photograph = () => {
		uni.chooseImage({
			count: 4,
			sizeType: ['original', 'compressed'],
			sourceType: ['camera', 'album'], //这要注意，camera掉拍照，album是打开手机相册
			success: (res) => {
				img.value.push(...res.tempFilePaths);
				// console.log(res.tempFilePaths);
				res.tempFilePaths.forEach(item => {
					let imgpath = item
					let pathName = imgpath.lastIndexOf('/')
					let imgName = imgpath.substr(pathName + 1)
					uni.getImageInfo({
						src: item,
						success: (res) => {
							imgType.value = res.type
							// console.log(res)
						}
					});
					// console.log(imgType.value);
					pathToBase64(item)
						.then(base64 => {
							// console.log(base64);
							imgFile.value.push({
								Type: imgType.value,
								Base64String: base64,
								Filename: imgName
							})
							// console.log(imgFile.value)
						})
						.catch(error => {
							console.error("转换失败==>", error)
						})
				})
				// console.log(this.imgFile);
			}
		});
	}
	//放大预览
	const getImgIndex = (index) => {
		uni.previewImage({
			current: index,
			urls: img.value
		});
	}
	//删除图片
	const deleteImg = (id) => {
		img.value = img.value.filter((item, index) => {
			return id != index
		})
		imgFile.value = imgFile.value.filter((item, index) => {
			return id != index
		})
	}
	// 		//图片处理
	const imgDataProce = (num, text) => {
		submitData.value.InspectOrder = option.order
		submitData.value.DetailList[0].Step = parseInt(option.step)
		submitData.value.DetailList[0].SubStatus = num
		submitData.value.DetailList[0].Remark = text
		imgFile.value.forEach((item, index) => {
			submitData.value.DetailList[0]['Attachment' + (index + 1)] = item
		})
		console.log(submitData.value);
	}
	//NG弹窗
	const ngRemark = () => {
		if (imgFile.value.length == 0) {
			uni.showToast({
				title: '缺少拍照结果',
				icon: 'error'
			})
			return
		}
		inputDialog.value.open()
	}
	//OK弹窗
	const taskPassed = () => {
		if (imgFile.value.length == 0) {
			uni.showToast({
				title: '缺少拍照结果',
				icon: 'error'
			})
			return
		}

		// imgDataProce(9, '')
		// console.log(submitData.value);
		// uploadResults(submitData.value).then((res) => {
		// 	judgment.value = true
		// 	goToNextStep()
		// 	console.log(res);
		// })
		alertDialog.value.open()
	}
	//NG备注
	const dialogInputConfirm = (value) => {
		if (value) {
			imgDataProce(1, value)
			uploadResults(submitData.value).then(res => {
				// console.log(res);
				judgment.value = true
				goToNextStep()
			})
		} else {
			uni.showToast({
				title: '请备注后再确认',
				icon: 'none'
			})
		}
	}
	//通过确认
	const dialogConfirm = () => {
		imgDataProce(9, '')
		// console.log(submitData.value);
		uploadResults(submitData.value).then((res) => {
			judgment.value = true
			goToNextStep()
			console.log(res);
		})
	}
	//维修
	const repair = () => {
		if (imgFile.value.length == 0) {
			uni.showToast({
				title: '缺少拍照结果',
				icon: 'error'
			})
			return
		}
		uni.showModal({
			title: '提示',
			content: '是否报修',
			success: (res) => {
				if (res.confirm) {
					imgDataProce(2, '')
					uploadResults(submitData.value).then((res) => {
						judgment.value = true
						goToNextStep()
						// console.log(res);
					})
				} else if (res.cancel) {
					console.log(1);
				}
			}
		})
	}
	const fault = () => {
		if (imgFile.value.length == 0) {
			uni.showToast({
				title: '缺少拍照结果',
				icon: 'error'
			})
			return
		}
		uni.showModal({
			title: '提示',
			content: '是否故障',
			success: (res) => {
				if (res.confirm) {
					imgDataProce(3, '')
					uploadResults(submitData.value).then((res) => {
						judgment.value = true
						goToNextStep()
						console.log(res);
					})
				} else if (res.cancel) {

				}
			}
		})
	}

	const goToPreStep = () => {
		let pre = taskData.value.findIndex(({
			StepName
		}) => StepName == option.title)
		if (pre != 0) {
			uni.redirectTo({
				url: '/pages/mes/ticketDetail/index?order=' + option.order + '&step=' + taskData.value[
						pre - 1]
					.Step +
					'&type=' + option.type + '&title=' + taskData.value[pre - 1].StepName
			});
		}
	}
	//下一项
	const goToNextStep = () => {
		if (judgment.value || judgmentFun.value) {
			let pre = taskData.value.findIndex(({
				StepName
			}) => StepName == option.title)
			console.log(pre, taskData.value.length);
			if (pre == taskData.value.length - 1) {
				uni.showToast({
					title: '没有下一项了'
				})
				uni.navigateBack({
					delta: 1
				})
				return
			} else {
				uni.redirectTo({
					url: '/pages/mes/ticketDetail/index?order=' + option.order + '&step=' + taskData.value[
							pre + 1].Step +
						'&type=' + option.type + '&title=' + taskData.value[pre + 1].StepName
				});
			}
		} else {
			uni.showToast({
				title: '请先完成结果判定',
				icon: 'none'
			})
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		box-sizing: border-box;
		height: 100vh;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.popup-content {
			background: #fff;
			height: 60vh;
			// padding: 0 30rpx;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;

			.header-title {
				position: relative;

				.shutDown {
					position: absolute;
					top: 30rpx;
					right: 20rpx;
				}
			}

			.list-card {
				box-sizing: border-box;
				padding: 20rpx 0;
				border-top: 1px solid #e7e7e7;
				display: flex;

				.img {
					width: 90rpx;
					height: 90rpx;
					margin-right: 20rpx;
				}

				.box {
					flex: 1;
					display: flex;
					justify-content: space-between;

					.box-title,
					.box-result {
						display: flex;
						flex-direction: column;
						justify-content: space-between;

					}

					.box-result {
						align-items: flex-end;

						.result-text {
							font-weight: bold;
							color: #00AC6A;
						}

						.active {
							color: #D71103;
						}
					}
				}
			}

		}

		.content {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			// padding: 20rpx;
			background-color: #fff;
			padding-bottom: 250rpx;

			.check-content {
				// width: 100%;  
				box-sizing: border-box;
				margin: 10rpx 30rpx 30rpx 30rpx;
				padding: 30rpx;
				border-radius: 10rpx;
				box-shadow: 0 0 10rpx #888;
				font-size: 28rpx;
				overflow: auto;
				background-color: #ffffff;

				.list {
					.title {
						.title-text {
							font-weight: bold;
						}

						.list-content {
							word-wrap: break-word;
							word-break: break-all;
						}
					}
				}
			}

			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.btn {
					width: 200rpx;
				}
			}
		}

		.bottom {
			position: fixed;
			bottom: 0;
			right: 0;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			// gap: 40rpx;
			box-sizing: border-box;
			padding: 0 20rpx;
			width: 100%;
			background: #fff;

			.result {
				padding: 0 30rpx;
				font-size: 32rpx
			}

			.thumbnail {
				display: flex;
				margin-bottom: 10rpx;
				// width: 100vw;
				overflow-x: auto;

				.imgtu {
					position: relative;
					flex: 0 0 100rpx;
					width: 100rpx;
					height: 100rpx;
					overflow: hidden;

					&:nth-child(n+2) {
						margin-left: 20rpx;
					}

					.img {
						width: 100%;
						height: 100%;
					}

					.del {
						position: absolute;
						right: -20rpx;
						top: -20rpx;
						z-index: 2;
					}
				}

			}

			.choose {
				display: flex;
				flex-direction: column;
				margin-bottom: 15rpx;

				.decision {
					display: flex;

					.custom-style {
						width: 100rpx;
						height: 60rpx;
						font-size: 28rpx;
						line-height: 60rpx;
						text-align: center;
					}
				}
			}

			.end {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.period {
					font-size: 32rpx;
				}

				.custom-style {
					margin: 10rpx 0;
					width: 100rpx;
					height: 60rpx;
					font-size: 28rpx;
					text-align: center;
					line-height: 60rpx;
				}
			}
		}
	}
</style>