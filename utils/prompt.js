export function audioSuccessPlay() {
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	innerAudioContext.src = '../../../static/mp3/success.mp3';
	// console.log(innerAudioContext.src);
	innerAudioContext.onPlay(() => {
		console.log('开始播放');
	});
	innerAudioContext.onError((res) => {
		// console.log(res);
		console.log(res.errMsg);
		console.log(res.errCode);
	});
	innerAudioContext.onEnded(() => {
		// console.log(1111);
		innerAudioContext.destroy();
	});
}
export function audiofailPlay() {
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	innerAudioContext.src = '../../../static/mp3/fail.mp3';
	innerAudioContext.onPlay(() => {
		console.log('开始播放');
	});
	innerAudioContext.onError((res) => {
		console.log(res.errMsg);
		console.log(res.errCode);
	});
	innerAudioContext.onEnded(() => {
		innerAudioContext.destroy();
	});
}