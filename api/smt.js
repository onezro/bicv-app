import {
	request
} from '@/request/smtRequest.js'


//获取装箱信息
export function QueryPackingInfoByCarrierName(data) {
    return request({
        url: `/api/packing/QueryPackingInfoByCarrierName?carrierName=${data}`,
        method: "post",
    });
}
//拆箱
export function SubmitPcbToPacking(data) {
    return request({
        url: "/api/packing/SplitPcbToPacking",
        method: "post",
		data
    });
}
//一键拆箱
export function SplitPcbToPacking(data) {
    return request({
        url: "/api/packing/SplitCarrierToPacking",
        method: "post",
		data
    });
}
//获取工位
export function QuerySpecStation(data) {
    return request({
        url: `/api/packing/QuerySpecStation?specName=${data}`,
        method: "post",
    });
}
//根据工位查询
export function QueryCarrierList(data) {
    return request({
     url: `/api/packing/QueryCarrierList?workStationName=${data}`,
     method: "post",
    });
}
//周转箱条码扫描
export function LoadCarrier(data) {
    return request({
        url: "/api/packing/LoadCarrier",
        method: "post",
		data
    });
}
//物料上料
export function LoadMaterialQueue(data) {
    return request({
        url: "/api/workstation/LoadMaterialQueue",
        method: "post",
        data
    })
}
export function UnloadCarrier(data) {
    return request({
     url: `/api/packing/UnloadCarrier?CarrierName=${data}`,
     method: "post",
    });
}
//工单查询
export function OrderQuery(data) {
    return request({
        url: "/api/workstation/OrderQuery",
        method: "post",
        data
    })
}
//上料详情
export function QueryOrderMaterialRequired(data) {
    return request({
        url: "/api/workstation/QueryOrderMaterialRequired",
        method: "post",
        data
    })
}
export function QuerySpecBystation(data) {
    return request({
        url: `/api/workstation/QuerySpecBystation?workStation=${data}`,
        method: "post",
      
    })
}
//物料明细
export function QueryMaterialQueueDetails(data) {
    return request({
        url: "/api/workstation/QueryMaterialQueueDetails",
        method: "post",
        data
    })
}
//物料下料
export function UnLoadMaterialQueue(data) {
    return request({
        url: "/api/workstation/UnLoadMaterialQueue",
        method: "post",
        data
    })
}
//SMT半成品入库工单验证
export function CheckOrder(data){
	return request({
		url:`/api/packing/CheckWarehousingOrder?OrderName=${data}`,
		method:'POST',
	})
}
//SMT半成品入库提交
export function PackingWarehousing(data){
	return request({
		url:`/api/packing/PackingCarrierWarehousing`,
		method:'POST',
		 data
	})
}
//SMT半成品入库验证
export function checkWarehousingcarrier(data){
	return request({
		url:`/api/packing/CheckWarehousingCarrier?OrderName=${data.OrderName}&CarrierName=${data.CarrierName}`,
		method:'POST',
	})
}
//SMT烧录半成品工单验证
export function CheckContainers(data){
	return request({
		url:`/api/Burn/CheckBurnContainer?ContainerName=${data}`,
		method:'POST',
	})
}
//SMT烧录半成品入库
export function SubmitBurnToStock(data){
	return request({
		url:`/api/Burn/SubmitBurnToStock`,
		method:'POST',
		 data
	})
}
//物料拆分验证物料条码及返回拆分条码
export function VerifySpliteMaterial(data){
	return request({
		url:`/api/material/VerifySpliteMaterial?ContainerName=${data}`,
		method:'POST',
	})
}


//提交物料拆分
export function SpliteMaterial(data){
	return request({
		url:`/api/material/SpliteMaterial`,
		method:'POST',
		 data
	})
}