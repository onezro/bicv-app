<template>
	<view class="content">
		<uni-section title="基本信息" type="line">
			<view class="box">
				<up-form labelPosition="left" :model="userInfo">
					<up-row gutter="30">
						<up-col span="6">
							<up-form-item label="班别" prop="class">
								<uni-data-select v-model="userInfo.class" :clear="true"
									:localdata="range"></uni-data-select>
							</up-form-item>
						</up-col>
						<up-col span="6">
							<up-form-item label="班组" prop="class" borderBottom>
								<uni-data-select v-model="userInfo.team" :clear="true"
									:localdata="range1"></uni-data-select>
							</up-form-item>
						</up-col>
					</up-row>
					<up-row gutter="30">
						<up-col span="6">
							<up-form-item label="线体" prop="class" borderBottom>
								<uni-data-select v-model="userInfo.line" :clear="true"
									:localdata="range2"></uni-data-select>
							</up-form-item>
						</up-col>
					</up-row>
				</up-form>
				<!-- <up-row gutter="30">
					<up-col span="4">
					</up-col>
					<up-col span="8">
						
					</up-col>
				</up-row> -->
			</view>

		</uni-section>
		<uni-section title="人员上岗信息" class="sect" type="line" style="flex: 1;">
			<view class="" style="padding: 0 10px 10px 10px;">
				<up-input placeholder="输入" clearable suffixIcon="search" v-model="search"
					suffixIconStyle="font-size: 22px;color: #909399"></up-input>
			</view>
			<scroll-view scroll-y="true" :style="{height:secthe}">
				<view class="box-msg"  v-for="d in tableData">
					<view class="info">
						<view class="info-header">
							<view class="header-left">
								<view class="list">
									<view class="item">
										<text class="title">班别</text>
										<text>{{d.class}}</text>
									</view>
									<view class="item">
										<text class="title">班组</text>
										<text>{{d.team}}</text>
									</view>
								</view>
								<view class="list">
									<view class="item">
										<text class="title">工号</text>
										<text>{{d.number}}</text>
									</view>
									<view class="item">
										<text class="title">姓名</text>
										<text>{{d.name}}</text>
									</view>
								</view>
								<view class="list">
									<view class="item">
										<text class="title">职称</text>
										<text>{{d.zc}}</text>
									</view>
									<view class="item">
										<text class="title">电话</text>
										<text>{{d.phone}}</text>
									</view>
								</view>
							</view>
							<view class="img" style="width:150rpx;height: 150rpx;background-color: bisque;"></view>
						</view>
						<view class="">
							<view class="list">
								<view class="item">
									<text class="title">上岗时间</text>
									<text>{{d.onWork}}</text>
								</view>
								<view class="item">
									<text class="title">上岗时长</text>
									<text>{{d.workTime}}</text>
								</view>
							</view>
						</view>
						<view class="">
							<view class="list">
								<view class="item">
									<text class="title">下岗时间</text>
									<text>{{d.downWork}}</text>
								</view>
								<view class="item">
									<text class="title">工站/机台</text>
									<text>{{d.poit}}</text>
								</view>
							</view>
						</view>
						<view class="" style="display: flex;justify-content: space-between;">
							<up-button  text="上岗" style="margin: 0;width: 60px;height: 25px;"></up-button>
							<up-button color="#006487"  text="下岗" style="margin: 0;width: 60px;height: 25px;"></up-button>
						</view>
					</view>
					
				</view>
			</scroll-view>

		</uni-section>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import {
		onReady
	} from "@dcloudio/uni-app"
	const userInfo = ref({
		line: '',
		class: '',
		team: ''
	})
	const range = reactive([{
			value: 0,
			text: "白班"
		},
		{
			value: 1,
			text: "夜班"
		}
	])
	const range1 = reactive([{
			value: 0,
			text: "A班"
		},
		{
			value: 1,
			text: "B班"
		}
	])
	const range2 = reactive([{
			value: 0,
			text: "SMT01线"
		},
		{
			value: 1,
			text: "SMT02线"
		}
	])
	const search = ref('')
	const secthe = ref(0)
	const tableData = reactive([{
		class: '白班',
		team: 'A班',
		number: '100932',
		name: '唐智勇',
		zc: '印刷机操作工',
		phone: '1234567890',
		onWork: '07-23 10:10:20',
		workTime: '5小时48分16秒',
		downWork: '07-23 20:10:20',
		poit: 'SMT01-AM'
	},
	{
		class: '白班',
		team: 'A班',
		number: '100314',
		name: '王杰',
		zc: '贴片机操作工',
		phone: '1234567890',
		onWork: '07-23 10:10:20',
		workTime: '5小时48分16秒',
		downWork: '07-23 20:10:20',
		poit: 'SMT01-AM'
	},
	{
		class: '白班',
		team: 'A班',
		number: '100314',
		name: '王杰',
		zc: '贴片机操作工',
		phone: '1234567890',
		onWork: '07-23 10:10:20',
		workTime: '5小时48分16秒',
		downWork: '07-23 20:10:20',
		poit: 'SMT01-AM'
	}])
	onReady(() => {
		uni.createSelectorQuery().select('.sect').boundingClientRect(data => {
			secthe.value = ((data.height) - 91) + 'px'
		}).exec()
		// console.log(secthe.value);
	})
</script>

<style lang="scss" scoped>
	.content {
		height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;

		.box {
			padding: 0 10px;
			// height: 300rpx;
		}

		.info {

			display: flex;
			flex-direction: column;
			gap: 30rpx;

			// background: #005781;
			.info-header {
				display: flex;

				.header-left {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: 30rpx; 
					// justify-content: space-between;


				}
			}
		}

		.list {
			display: flex;

			// gap: 20px;
			// justify-content: space-around;
			.item {
				flex: 1;
				font-size: 25rpx;

				.title {
					margin-right: 10px;
				}
			}

		}

		.scroll-Y {
			height: 500rpx;
		}
		.box-msg{
			margin: 0 10px;
			padding: 10px 0;
			border-bottom: 1px solid #dadbde ;
		}

	}
</style>