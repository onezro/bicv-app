<template>
	<view class="content">
		<view class="myclass">
			<view class="combox-container">
				<view class="combox"><uni-combox :candidates="list" v-model="searchValue"></uni-combox></view>
				<!-- <view class="">重置</view> -->
				<up-button text="重置" class="custom-style" @click="resetTask"></up-button>
				<!-- <uni-icons type="scan" color="#bdbdbd" @click="iconClickQRCode" size="24"></uni-icons> -->
			</view>
			<!-- <up-search v-model="searchValue" height="25px" shape="square"  @change="searchData"
				:animation="true"></up-search> -->

			<!-- 	<uni-search-bar class="unisearchbar" style="height: 25px;" placeholder="请输入计划单号" @input="searchData" @confirm="searchData"
				v-model="searchValue" /> -->
		</view>
		<view class="listview">
			<uni-card margin="10px" padding="5px" spacing='0px' v-for="o in orderList1" :key="o.TaskNo+o.Item"
				@click="onClick(o)">
				<up-form :model="o" :borderBottom='true' labelAlign='right' labelWidth="60">
					<wd-row gutter="5">
						<wd-col :span="16">
							<up-form-item label="计划单号" :borderBottom='true' class='test'>
								<text class="header-text">{{o.TaskNo}}</text>
							</up-form-item>
						</wd-col>
						<wd-col :span="8">
							<up-form-item label="序号" :borderBottom='true' class='test'>
								<text class="header-text" style="color:#">{{o.Item}}</text>
							</up-form-item>
						</wd-col>
					</wd-row>
					<wd-row gutter="5">
						<wd-col :span="16">
							<up-form-item label="工单号" :borderBottom='true' class='test'>
								<text class="header-text">{{o.OrderNumber}}</text>
							</up-form-item>
						</wd-col>
						<wd-col :span="8">
							<up-form-item label="面别" :borderBottom='true' class='test'>
								<text class="header-text">{{o.Side}}</text>
							</up-form-item>
						</wd-col>
					</wd-row>
					<wd-row gutter="5">
						<wd-col :span="24">
							<up-form-item label="工序" :borderBottom='true' class='test'>
								<text class="header-text">{{o.ProcedureDsc}}</text>
							</up-form-item>
						</wd-col>

					</wd-row>
					<wd-row gutter="5">
						<wd-col :span="24">
							<up-form-item label="类型" :borderBottom='true' class='test'>
								<text class="header-text">{{o.CompName}}</text>
							</up-form-item>
						</wd-col>
					</wd-row>
					<wd-row gutter="5">
						<wd-col :span="8">
							<up-form-item label="需求数" :borderBottom='true' class='test'>
								<text class="header-text">{{o.Amount}}</text>
							</up-form-item>
						</wd-col>
						<wd-col :span="8">
							<up-form-item label="出库数" :borderBottom='true' class='test'>
								<text class="header-text">{{o.IssuedQuantity}}</text>
							</up-form-item>
						</wd-col>
						<wd-col :span="8">
							<up-form-item label="库存数" :borderBottom='true' class='test'>
								<text class="header-text">{{o.stockQty}}</text>
							</up-form-item>
						</wd-col>
					</wd-row>
					<view class="" style="width: 100%;display: flex;align-items:center;padding-top: 5px;">
						<up-button type="info" size="small" text="取消任务" class="custom-style"
							@click="submitList"></up-button>
						<up-button type="success" size="small" text="完成任务" class="custom-style"
							@click="submitList"></up-button>
					</view>
				</up-form>

			</uni-card>
		</view>
		<uni-load-more :status="status"></uni-load-more>
	</view>
</template>

<script setup>
	import {
		GetToolsOrderTask
	} from '@/api/work.js'

	import {
		ref,
		onMounted,
		watch
	} from 'vue'
	import {
		onShow,

		onReachBottom,
		onPullDownRefresh,
	} from "@dcloudio/uni-app"
	import {
		debounce
	} from "@/utils/de.js"
	const searchValue = ref('')
	const orderList = ref([])
	const orderList1 = ref([])
	const total = ref(0)
	const page = ref(1)
	const pageSize = ref(4)
	const status = ref("more")
	const list = ref([])
	const task = ref("")
	watch(
		() => searchValue.value,
		(newdata) => {

			console.log(newdata);
			if (newdata !== "") {
				getPageData()
			} else {
				orderList1.value = orderList.value.filter((o, i) => i < pageSize.value * page.value)
			}
			// if (newdata == "") {
			//   orderList1.value = orderList.value;
			// } else {
			//   orderList1.value = table1(newdata);
			// }
		}
	);
	onMounted(() => {
		// getData()

	})

	const resetTask = () => {
		searchValue.value = ""
	}
	onShow(() => {
		getData()
	})
	onPullDownRefresh(() => {
		page.value = 1
		pageSize.value = 4
		getData()
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	})
	onReachBottom(() => {
		let allTotal = page.value * pageSize.value;
		if (allTotal < total.value) {
			status.value = 'loading'; //加载中状态
			page.value++;
			getPageData()
		} else {
			status.value = 'noMore'; //加载完状态
		}

	})
	const table1 = (newdata) => {
		let searchName = newdata.toLowerCase();
		return orderList.value.filter((v) => {
			return String(v.TaskNo).toLowerCase().indexOf(searchName) > -1;
		});
	};
	const searchData = debounce(() => {
		getPageData()
	}, 500)
	// (val) => {
	// // getPageData(val)
	// 	fuzzySearch()
	// 	// orderList1.value =orderList1.value.filter(o => o.TaskNo.includes(val));
	// }
	const getData = () => {
		// list.value=[]
		GetToolsOrderTask().then(res => {
			if (res.content.length == 0 || res.content == null) {
				orderList.value = []
				return
			}
			total.value = res.content.length
			orderList.value = res.content
			// 收集所有的 TaskNo
			const allTaskNos = res.content.map(r => r.TaskNo);
			// 使用 Set 去重
			const uniqueTaskNosSet = new Set(allTaskNos);
			// 转换回数组并赋值给 list.value
			list.value = Array.from(uniqueTaskNosSet);
			getPageData()
		})
	}
	const getPageData = (val) => {
		if (searchValue.value == "") {
			orderList1.value = orderList.value.filter((o, i) => i < pageSize.value * page.value)
		} else {
			fuzzySearch()
		}

	}

	const fuzzySearch = () => {
		// orderList1.value = orderList.value.filter(task =>
		// 	task.TaskNo.toString().includes(searchValue.value.toString())
		// );

		orderList1.value = orderList.value.filter(task =>
			task.TaskNo == searchValue.value
		);
		console.log(orderList1.value);
		status.value = 'noMore';

	}


	const onClick = (val) => {

		if (val.stockQty == 0) {
			uni.showToast({
				title: '库存为0，不可出库！！',
				icon: 'none',
			})
			return
		}
		uni.navigateTo({
			url: `/pages/fixture/issue/edit?compName=${val.CompName}&toolsTaskDetailGuid=${val.ToolsTaskDetailGuid}&orderNumber=${val.OrderNumber}&taskNo=${val.TaskNo}&amount=${val.Amount}&IssuedQuantity=${val.IssuedQuantity}`
		})
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100%;
		background: #fff;
		padding: 30px 0 30px 0;

		.item {
			display: flex;
			gap: 10px;
		}

		.header-text {
			margin-left: 5px;
		}

		.myclass {
			position: fixed;
			width: 100%;
			// padding: 5px;
			background-color: #ffffff;
			left: 0;
			top: 0;
			z-index: 99;

			.combox-container {
				display: flex;
				align-items: center;
			}

			.combox {
				flex: 1;
			}

			.custom-style {
				width: 50px;
				height: 35px;
			}

			// .clear-button {
			//   margin-left: 10px; /* 根据需要调整按钮与combox之间的间距 */
			//   padding: 5px 10px;
			//   background-color: #f00;
			//   color: #fff;
			//   border: none;
			//   border-radius: 4px;
			//   cursor: pointer;
			// }

		}

		.listview {
			// background: #fff;
			// padding-top:30px;
			// z-index: 1;
		}

		.custom-style {
			width: 60px;
			height: 25px;
		}
	}
</style>
<style lang="scss">
	.test .u-form-item__body__left__content__label {
		font-size: 13px;
	}

	.test .u-form-item__body {
		padding: 2px 0;
		font-size: 13px;
	}
</style>