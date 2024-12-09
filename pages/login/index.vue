<template>
	<view class="normal-login-container">
		<view class="logo-content align-center justify-center flex">
			<image class="img-a" src="/static/images/b-1.png"></image>
			<image class="img-b" src="/static/images/b-2.png"></image>
			<!-- 标题 -->
			<view class="text">
				<view class="t-b">{{ title }}</view>
				<view class="t-b2">{{ subTitle }}</view>
			</view>
		</view>
		<view class="login-form-content">
			<view class="input-item flex align-center">
				<view class="iconfont icon-user icon"></view>
				<input v-model="loginForm.EmployeeName" class="input" type="text" placeholder="请输入账号" maxlength="30" />
			</view>
			<view class="input-item flex align-center">
				<view class="iconfont icon-password icon"></view>
				<input v-model="loginForm.DocManagerUser" type="password" class="input" placeholder="请输入密码"
					maxlength="20" />
			</view>
			<view class="action-btn">
				<button @click="handleLogin" class="login-btn cu-btn block bg-blue lg round">登录</button>
			</view>

			<view class="xieyi text-center">
				<!-- <text class="text-grey1">登录即代表同意</text>
	        <text @click="handleUserAgrement" class="text-blue">《用户协议》</text>
	        <text @click="handlePrivacy" class="text-blue">《隐私协议》</text> -->
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		getToken,
		setToken,
		removeToken
	} from '@/utils/auth'
	import {
		loginApp,
		getInfo,
		getMenu
	} from '@/api/login.js'
	import useUserStore from '@/stores/user.js'
	import toastObj from '@/utils/toast.js'
	import {
		ref,
		unref
	} from 'vue'
	import msgMEStore from "@/stores/msg.js"
	const msgStore = msgMEStore()
	const title = ref('MES管理平台')
	const subTitle = ref('欢迎回来，开始工作吧！')
	const loginForm = ref({
		EmployeeName: 'CamstarAdmin',
		DocManagerUser: '123456',
	})
	const textArr=ref([])
	const userStore = useUserStore()
	const handleLogin = () => {
		if (unref(loginForm).username == '') {
			toastObj.msgError('请输入您的账号')
		} else if (unref(loginForm).password === "") {
			toastObj.msgError("请输入您的密码")
		} else {
			toastObj.loading("登录中，请耐心等待...")
			pwdLogin()
		}
	}
	const pwdLogin = () => {
		loginApp(unref(loginForm)).then(res => {
			const dataText = res.content
			setToken(dataText.Token)
			userStore.SET_TOKEN(dataText.Token)
			// console.log(dataText.Token)
			getEmployInfo()

		})

	}
	const getEmployInfo = () => {
		getInfo().then(res1 => {
			// console.log(res1.content);
			userStore.SET_NAME(res1.content)
			if (res1.code == 100200) {
				getMenu().then(res => {
					const dataText = res.content
					const systemRouter = dataText.filter((v) => v.MenuName == 'PDA')
					systemRouter.length>0&&userStore.SET_PERMISSIONS(systemRouter[0].childMenu)
					// console.log(systemRouter[0].childMenu);
					// systemRouter.length>0&&dataParmisson(systemRouter[0])
					// console.log(textArr.value);
					// userStore.SET_PERMISSIONS(textArr.value)
				})
			}
			// msgStore.initSocket()
			uni.reLaunch({
				url: '/pages/index'
			})
		}) 
	}
	const dataParmisson=(data)=>{
		let str=data.MenuName
		data.childMenu.forEach(v=>{
			let str2=str+':'+v.MenuName
			textArr.value.push(str2)
			if(v.childMenu.length>0&&v.childMenu!==null){
				v.childMenu.forEach(d=>{
					let str3=str2+':'+d.MenuName
					textArr.value.push(str3)
				})
			}
		})
		
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.normal-login-container {
		width: 100%;

		.logo-content {
			width: 100%;
			font-size: 21px;
			text-align: center;
			padding-top: 15%;

			image {
				border-radius: 4px;
			}

			.title {
				margin-left: 10px;
			}
		}

		.login-form-content {
			text-align: center;
			margin: 20px auto;
			// margin-top: 3%;
			width: 80%;

			.input-item {
				margin: 20px auto;
				background-color: #f5f6f7;
				height: 45px;
				border-radius: 20px;

				.icon {
					font-size: 38rpx;
					margin-left: 10px;
					color: #999;
				}

				.input {
					width: 100%;
					font-size: 14px;
					line-height: 20px;
					text-align: left;
					padding-left: 15px;
				}

			}

			.login-btn {
				margin-top: 40px;
				height: 45px;
			}

			.reg {
				margin-top: 15px;
			}

			.xieyi {
				color: #333;
				margin-top: 20px;
			}

			.login-code {
				height: 38px;
				float: right;

				.login-code-img {
					height: 38px;
					position: absolute;
					margin-left: 10px;
					width: 200rpx;
				}
			}
		}
	}

	.img-a {
		position: absolute;
		width: 100%;
		top: -74px;
		right: 0;
		z-index: 100;
	}

	.img-b {
		position: absolute;
		width: 50%;
		bottom: 0;
		left: -50rpx;
		z-index: 100;
	}

	.text {
		margin-left: -111px;
		margin-top: 28px;
	}

	.t-b {
		text-align: left;
		font-size: 29px;
		color: #000;
		padding: 60px 0 10px 0;
		font-weight: bold;
	}

	.t-b2 {
		text-align: left;
		font-size: 32rpx;
		color: #aaaaaa;
		padding: 0rpx 0 60rpx 0;
	}
</style>