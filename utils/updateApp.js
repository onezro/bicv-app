export function updateApp(url){
	plus.nativeUI.toast("正在准备环境，请稍后!");
	// console.log(res.result.androidUpdateUrl, )
	var dtask = plus.downloader.createDownload(url, {
			method: 'GET',
			filename: '_doc/update/'
		},
		function(d, status) {
			if (status == 200) {
				var path = d.filename; //下载apk
				plus.runtime.install(path); // 自动安装apk文件
			} else {
				plus.nativeUI.alert('版本更新失败:' + status);
			}
		});
	
	try {
		dtask.start(); // 开启下载的任务
		var prg = 0;
		var showLoading = plus.nativeUI.showWaiting(
			"正在下载"); //创建一个showWaiting对象 
		dtask.addEventListener('statechanged', (
			task,
			status
		) => {
			// 给下载任务设置一个监听 并根据状态  做操作
			switch (task.state) {
				case 1:
					showLoading.setTitle("正在下载");
					break;
				case 2:
					showLoading.setTitle("已连接到服务器");
					break;
				case 3:
					prg = parseInt(
						(parseFloat(task
								.downloadedSize
							) /
							parseFloat(task
								.totalSize)) *
						100
					);
					showLoading.setTitle("  正在下载" +
						prg + "%  ");
					break;
				case 4:
					plus.nativeUI.closeWaiting();
					//下载完成
					break;
			}
		});
	} catch (err) {
		plus.nativeUI.closeWaiting();
		uni.showToast({
			title: '更新失败-03',
			mask: false,
			duration: 1500
		});
	}
}