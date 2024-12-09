import {
	request
} from '@/request/scrRequest.js'

//物料拆包
export function MaterialSplit(data) {
    return request({
        url: `/api/materialcheck/MaterialSplit`,
        method: "post",
		data
    });
}
//拆包明细
export function MaterialSplitVerify(data) {
    return request({
        url: `/api/materialcheck/MaterialSplitVerify`,
        method: "post",
		data
    });
}
//判断屏条码
export function JudgeScreenBarCodeNews(data) {
    return request({
        url: `/api/packing/JudgeScreenBarCodeNews`,
        method: "post",
		data
    });
}
//提交入库
export function AssociationScreenAndBoxBarCodeNews(data) {
    return request({
        url: `/api/packing/AssociationScreenAndBoxBarCodeNews`,
        method: "post",
		data
    });
}
//入库工单
export function CheckScreenWarehousingOrder(data) {
    return request({
        url: `/api/packing/CheckScreenWarehousingOrder`,
        method: "post",
		data
    });
}
//入库工单
export function CheckScreenWarehousingCarrier(data) {
    return request({
        url: `/api/packing/CheckScreenWarehousingCarrier`,
        method: "post",
		data
    });
}
//入库工单
export function PackingCarrierScreenWarehousing(data) {
    return request({
        url: `/api/packing/PackingCarrierScreenWarehousing`,
        method: "post",
		data
    });
}



