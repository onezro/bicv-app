export function initPushMsg(title,content){
	// var content = "您有一条新的消息!";
	var options = {
		"cover": false, // 覆盖上次
		"when": new Date(),
		'title': title
	};
	
	var body = {
		'id': 'id',
		'key2': "key2"
	}
	var payload = JSON.stringify(body);
	plus.push.createMessage(content, payload, options);
	plus.push.setAutoNotification(true); 
	plus.push.addEventListener("click", (msg) => {
		console.log("您点击了: " + JSON.stringify(msg));
		uni.switchTab({ // 登陆成功后，点击消息跳转到消息列表页
			url: "/pages/msg/index",
			success: function(res) {
				console.log('跳转成功', res);
			},
			fail: function(err) {
				console.log('跳转失败', err);
			},
		});
	}, false);
}