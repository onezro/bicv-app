// 应用全局配置
export default {
	
	baseUrl: 'http://192.168.9.50:12024',
	smtUrl: 'http://192.168.9.50:12026',
	scrUrl:'http://192.168.9.50:12025',
	dipUrl:'http://192.168.9.50:12022',
	asyUrl:'http://192.168.9.50:12021',
	// baseUrl2: 'http://172.20.99.21:9980', 
	// baseUrl3: 'http://172.20.99.21:5998',
	// baseUrl4: 'http://172.20.99.23:9080', 
	
	// 应用信息
	appInfo: {
		// 应用名称
		name: "仓储管理",
		// 应用版本
		version: "0.0.1",
		// 应用logo
		logo: "/static/logo.jpg",
		// 官方网站
		site_url: "http://",
		// 政策协议
		agreements: [{
				title: "隐私政策",
				url: "https://protocol.html"
			},
			{
				title: "用户服务协议",
				url: "https://protocol.html"
			}
		]
	}
}