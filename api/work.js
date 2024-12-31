import {
	request
} from '@/request/workRequest.js'

//工厂模型
export function GetFactoryModelPADList(data) {
    return request({
        url: `/api/system/GetFactoryModelPADList`,
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
//转单任务单
export function QueryToolsTaskNo(data){
	return request({
		url:`/api/Tools/QueryToolsTaskNo`,
		method:'POST',
		data
	})
}
//一键转单
export function ToolChangeOrder(data){
	return request({
		url:'/api/Tools/ToolChangeOrder',
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
//查询治具
export function QueryTmpToolData(data){
	return request({
		url:`/api/Tools/QueryTmpToolData?ToolsTaskDetailGuid=${data}`,
		method:'POST',
	})
}
//删除治具
export function DeleteTmpToolData(data){
	return request({
		url:`/api/Tools/DeleteTmpToolData?compid=${data}`,
		method:'POST',
	})
}
//一键出库
export function ToolsMoveOutOnce(data){
	return request({
		url:`/api/Tools/ToolsMoveOutOnce`,
		method:'POST',
		data
	})
}
export function CancelToolTaskDetail(data){
	return request({
		url:`/api/Tools/CancelToolTaskDetail?ToolsTaskGuid=${data.ToolsTaskGuid}&ToolsTaskDetailGuid=${data.ToolsTaskDetailGuid}`,
		method:'POST',
	})
}
export function FinishToolTaskDetail(data){
	return request({
		url:`/api/Tools/FinishToolTaskDetail?ToolsTaskGuid=${data.ToolsTaskGuid}&ToolsTaskDetailGuid=${data.ToolsTaskDetailGuid}`,
		method:'POST',
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
//转产
export function findOrder(data) {
    return request({
        url: "/api/order/OrderQuery",
        method: "post",
        data
    })
}

//查询生产计划转单物料清单
export function QueryChangeOrderMaterialRequired(data) {
    return request({
        url: "/api/order/QueryChangeOrderMaterialRequired",
        method: "post",
        data
    });
}
export function ApplyChangeOrderMaterialRequired(data) {
    return request({
        url: "/api/order/ApplyChangeOrderMaterialRequired",
        method: "post",
        data
    });
}

//借料
export function LendOrderMaterialBatchNo(data) {
    return request({
        url: "/api/order/LendOrderMaterialBatchNo",
        method: "post",
        data
    });
}
//借料生产计划验证
export function LendOrderMaterialToOrder(data) {
    return request({
        url: "/api/order/LendOrderMaterialToOrder",
        method: "post",
        data
    });
}
