import {
	request
} from '@/request/workRequest.js'

//工厂模型
export function GetFactoryModelList(data) {
    return request({
        url: `/api/system/GetFactoryModelList`,
        method: "post",
    });
}

//工治具上线
export function ToolOnline(data){
	return request({
		url:'/api/Tools/ToolOnline',
		method:'POST',
		data
	})
}
//工治具出入库
export function ToolsMove(data){
	return request({
		url:'/api/Tools/ToolsMove',
		method:'POST',
		data
	})
}

//
export function ValidateComId(data){
	return request({
		url:`/api/Tools/ValidateComId?CompID=${data}`,
		method:'POST',
	})
}
//工治具任务单
export function GetToolsOrderTask(){
	return request({
		url:'/api/Tools/GetToolsOrderTask',
		method:'POST',
	})
}
//工治具下线
export function ToolOffline(data){
	return request({
		url:'/api/Tools/ToolOffline',
		method:'POST',
		data
	})
}
//工治具查询
export function QueryTools(data){
	return request({
		url:'/api/Tools/QueryTools',
		method:'POST',
		data
	})
}