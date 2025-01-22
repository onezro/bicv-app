<template>
	<view class="detail">
		<view class="content">
			<uni-section :title="option.title" titleFontSize="20px" type="line">
				<view class="check-content" v-for="item in openTaskStep" :key="item.Step">
					<text>{{item.InspectContent}}</text>
				</view>
			</uni-section>

		</view>
		<view class="bottom">
			<view class="result" v-if="judgmentFun">
				<view class="">结果：<text v-if="openTaskStep[0].Status==9" style="color: #4CAF50;">OK</text><text
						v-if="openTaskStep[0].Status==1" style="color: red;">NG</text></view>
			</view>
			<view class="thumbnail">
				<view class="imgtu" v-for="(item,index) in img" :key="index">
					<view class="del" @click.stop="deleteImg(index)"><uni-icons type="clear" size="40"
							color="rgb(250 0 0 / 80%)"></uni-icons>
					</view>
					<image class="img" :src="item" mode="" @click="getImgIndex(index)"></image>
				</view>
			</view>

			<view class="choose">
				<view class="decision" v-if="!judgmentFun">
					<button class="custom-style" style="color: #ffffff;backgroundColor:#4CAF50;borderColor:#4CAF50"
						@click="photograph()">
						拍照
					</button>
					<button class="custom-style" type="warn" @click="ngRemark()">
						NG
					</button>
					<button class="custom-style" type="primary" @click="taskPassed()">
						OK
					</button>
				</view>
				<!-- <view class="decision" v-if="!judgmentFun">
					<button class="custom-style" style="color: #ffffff;backgroundColor:#4CAF50;borderColor:#4CAF50"
						@click="photograph()">
						拍照
					</button>
					<button class="custom-style" style="color: #ffffff;backgroundColor:#ffa726;borderColor:#ffa726"
						@click="repair()">
						报修
					</button>
					<button class="custom-style" type="warn" @click="fault()">
						故障
					</button>
					<button class="custom-style" type="primary" @click="confirmResult()">
						OK
					</button>
				</view> -->
			</view>
			<view class="end">
				<button :disabled="previous" class="custom-style" @click="goToPreStep()">
					UP
				</button>
				<button class="custom-style" style="color: #ffffff;backgroundColor:#0094D9;borderColor:#0094D9"
					@click="goToNextStep()">
					NEXT
				</button>
			</view>
		</view>
		<!-- <view>
		
			<uni-popup ref="inputListRemark" type="dialog">
				<uni-popup-dialog ref="inputClose2" mode="input" title="备注" placeholder="请输入内容"
					@confirm="listFail"></uni-popup-dialog>
			</uni-popup>
		</view>

		<view>
			
			<uni-popup ref="repairDialog" type="dialog">
				<uni-popup-dialog type="error" cancelText="否" confirmText="是" title="确认提示" content="确认检查无误"
					@confirm="repairConfirm()" @close="dialogClose()"></uni-popup-dialog>
			</uni-popup>
		</view> -->
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
		<!-- <view>
		
			<uni-popup ref="faultDialog" type="dialog">
				<uni-popup-dialog type="error" cancelText="否" confirmText="是" title="确认提示" content="确认检查无误"
					@confirm="faultConfirm()" @close="dialogClose()"></uni-popup-dialog>
			</uni-popup>
		</view> -->

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		uploadResults,
		confirmDeviceStatus
	} from '@/api/smt.js'
	import {
		pathToBase64,
		base64ToPath
	} from '@/utils/image-tools.js';
	export default {
		props: ['option', 'detailList'],
		data() {
			return {
				order: '',
				title: '',
				titleType: '',
				img: [],
				show: false,
				imgFile: [],
				submitData: {
					inspectOrder: '',
					detailList: [{
						step: 0,
						subStatus: '',
						remark: "",
						attachment1: {
							type: "string",
							base64String: "string",
							filename: "string"
						},
						attachment2: {
							type: "string",
							base64String: "string",
							filename: "string"
						},
						attachment3: {
							type: "string",
							base64String: "string",
							filename: "string"
						},
						attachment4: {
							type: "string",
							base64String: "string",
							filename: "string"
						}
					}]
				},
				judgment: false,
			}
		},
		computed: {
			...mapState(['taskData', 'tagName']),
			openTaskStep() {
				return this.taskData.filter(({
					Name
				}) => Name == this.option.title)
			},
			previous() {
				let pre = this.taskData.findIndex(({
					Name
				}) => Name == this.option.title)

				if (pre == 0) {
					return true
				}
				return false
			},
			judgmentFun() {
				return this.openTaskStep[0].Status == 9 || this.openTaskStep[0].Status == 1
			}
		},
		methods: {
			//返回上一页
			back() {
				uni.navigateBack({
					delta: 1,
				})
			},
			//拍照
			photograph() {
				uni.chooseImage({
					sizeType: ['original', 'compressed'],
					sourceType: ['camera', 'album'], //这要注意，camera掉拍照，album是打开手机相册
					success: (res) => {
						// console.log(res);
						this.img.push(...res.tempFilePaths);
						let imgpath = res.tempFilePaths[0]
						let pathName = imgpath.lastIndexOf('/')
						let imgName = imgpath.substr(pathName + 1)
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: (res) => {
								this.imgType = res.type
							}
						});
						pathToBase64(res.tempFilePaths[0])
							.then(base64 => {
								this.imgFile.push({
									type: this.imgType,
									base64String: base64,
									filename: imgName
								})
								// console.log(this.imgFile);
								// console.log("转换成功==>",base64)
							})
							.catch(error => {
								console.error("转换失败==>", error)
							})
					}
				});

			},
			//放大预览
			getImgIndex(index) {
				uni.previewImage({
					current: index,
					urls: this.img
				});
			},
			//删除图片
			deleteImg(id) {
				this.img = this.img.filter((item, index) => {
					return id != index
				})
				this.imgFile = this.img.filter((item, index) => {
					return id != index
				})
				// console.log(this.img);
			},
			//图片处理
			imgDataProce(num, text) {
				this.submitData.inspectOrder = this.option.order
				this.submitData.detailList[0].step = this.option.step
				this.submitData.detailList[0].subStatus = num
				this.submitData.detailList[0].remark = text
				this.imgFile.forEach((item, index) => {
					this.submitData.detailList[0]['attachment' + (index + 1)] = item
				})
			},
			//单个设备点检项确认
			listPass(item) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.equipmentInspecData.subSetUpList[0].subItem = item.SubItem
				this.equipmentInspecData.subSetUpList[0].subItemName = item.SubItemName
				this.equipmentInspecData.subSetUpList[0].sumItemStatus = '0'
				confirmDeviceStatus(this.equipmentInspecData).then(res => {
					// console.log(res);
					setTimeout(function() {
						uni.hideLoading();
					}, 500);
					this.$emit('getEquipmentStep')
				})

			},
			//单设备点检弹窗备注
			openListRemark(item) {
				this.$refs.inputListRemark.open()
				this.equipmentInspecData.subSetUpList[0].subItem = item.SubItem
				this.equipmentInspecData.subSetUpList[0].subItemName = item.SubItemName
			},
			//单个设备点检ng
			listFail(value) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.equipmentInspecData.subSetUpList[0].sumItemStatus = '1'
				this.equipmentInspecData.subSetUpList[0].submItemRemark = value
				confirmDeviceStatus(this.equipmentInspecData).then(res => {
					setTimeout(function() {
						uni.hideLoading();
					}, 500);
					this.$emit('getEquipmentStep')
				})
			},
			confirmResult() {
				console.log(this.checkComplete);
				if (!this.checkComplete) {
					uni.showToast({
						title: '请先完成检查',
						icon: 'none'
					})
				} else {
					this.imgDataProce(0, '')
					console.log(this.submitData);
					uploadResults(this.submitData).then((res) => {
						this.goToNextStep()
						console.log(res);
					})
				}
			},
			//确认弹窗
			repair() {
				this.$refs.repairDialog.open()
			},
			//故障报修确认
			repairConfirm() {
				if (!this.checkComplete) {
					uni.showToast({
						title: '请先完成检查',
						icon: 'none'
					})
				} else {
					this.imgDataProce(2, '')
					uploadResults(this.submitData).then((res) => {
						this.goToNextStep()
						console.log(res);
					})
				}
			},
			//确认弹窗
			fault() {
				this.$refs.faultDialog.open()
			},
			//故障报修确认
			faultConfirm() {
				if (!this.checkComplete) {
					uni.showToast({
						title: '请先完成检查',
						icon: 'none'
					})
				} else {
					this.imgDataProce(3, '')
					uploadResults(this.submitData).then((res) => {
						this.goToNextStep()
						console.log(res);
					})
				}
			},
			//故障报修取消
			dialogClose() {

			},
			ngRemark() {
				this.$refs.inputDialog.open()
			},
			//OK弹窗
			taskPassed() {
				this.$refs.alertDialog.open()
			},
			//NG备注
			dialogInputConfirm(value) {
				if (value) {
					this.imgDataProce(1, value)
					uploadResults(this.submitData).then(res => {
						// console.log(res);
						this.judgment = true
						this.goToNextStep()
					})
				} else {
					uni.showToast({
						title: '请备注后再确认',
						icon: 'none'
					})
				}
			},
			//通过确认
			dialogConfirm() {
				this.imgDataProce(9, '')
				uploadResults(this.submitData).then((res) => {
					this.judgment = true
					this.goToNextStep()
					console.log(res);
				})

			},
			//通过取消
			dialogClose() {

			},
			goToPreStep() {
				let pre = this.taskData.findIndex(({
						Name
					}) =>
					Name == this.option.title)
				if (pre != 0) {
					uni.redirectTo({
						url: '/pages/mes/ticketDetail/index?order=' + this.option.order + '&step=' + this.taskData[
								pre - 1]
							.Step +
							'&type=' + this.option.type + '&title=' + this.taskData[pre - 1].InspectContent
					});
				}
			},
			//下一项
			goToNextStep() {
				if (this.judgment || this.judgmentFun) {
					let pre = this.taskData.findIndex(({
						Name
					}) => Name == this.option.title)
					console.log(pre);
					if (pre == this.taskData.length - 1) {
						uni.showToast({
							title: '没有下一项了'
						})
						uni.navigateBack({
							delta: 1
						})
						return
					} else {
						uni.redirectTo({
							url: '/pages/mes/ticketDetail/index?order=' + this.option.order + '&step=' + this
								.taskData[pre + 1].Step +
								'&type=' + this.option.type + '&title=' + this.taskData[pre + 1].Name
						});
					}
				} else {
					uni.showToast({
						title: '请先完成结果判定',
						icon: 'none'
					})
				}
			},
		},
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

		.content {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.check-content {
				box-sizing: border-box;
				margin: 0 30rpx 30rpx 30rpx;
				padding: 20rpx;
				border-radius: 10rpx;
				box-shadow: 0 0 10rpx #888;
				font-size: 28rpx;
				overflow: auto;
			}

			.box {
				padding-bottom: 250rpx;
				overflow: auto;

				.card {
					display: flex;
					justify-content: space-between;
					align-items: center;
					box-sizing: border-box;
					border-radius: 10rpx;
					margin: 30rpx;
					padding: 20rpx 30rpx;
					box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3px 1px;

					.result-text {
						max-width: 150rpx;
						word-break: break-all;
						word-wrap: break-word;
						// text-align: center;
					}

					.text {
						box-sizing: border-box;
						width: 520rpx;
						padding-right: 30rpx;
						font-size: 26rpx;

						.list {
							display: flex;
							flex-wrap: wrap;
							align-items: center;
							padding: 5rpx 0;

							.title {

								// width: 150rpx;
								.title-text {
									font-weight: bold;
								}
							}
						}
					}

					.btn {
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.custom-style {
							margin: 10rpx 0;
							width: 80rpx;
							height: 60rpx;
							font-size: 28rpx;
							text-align: center;
							line-height: 60rpx;
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
			// height: 200rpx;
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
				// margin-bottom: 10rpx;

				.decision {
					display: flex;
					justify-content: space-between;

					.custom-style {
						height: 60rpx;
						font-size: 28rpx;
						line-height: 60rpx;

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