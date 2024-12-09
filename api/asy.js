import {
	request
} from '@/request/asyRequest.js'

export function ProductInspect(data) {
    return request({
        url: "/api/FinishedProductInspect/ProductInspect",
        method: "post",
		data
    });
}
export function ProductInspectDetails(data) {
    return request({
        url: "/api/FinishedProductInspect/ProductInspectDetails",
        method: "post",
		data
    });
}
//老化位置验证
export function ScanLocationCode(data) {
    return request({
        url: `/api/Aging/ScanLocationCode`,
        method: "post",
		data
    });
}
//sn条码验证
export function ScanContainer(data) {
    return request({
        url: `/api/Aging/ScanContainer`,
        method: "post",
		data
    });
}
export function AgingPitted(data) {
    return request({
        url: "/api/Aging/AgingPitted",
        method: "post",
		data
    });
}
export function AgingOutbound(data) {
    return request({
        url: "/api/Aging/AgingOutbound",
        method: "post",
		data
    });
}
export function QueryPackingInfoByBox(data) {
    return request({
        url: `/api/packing/QueryPackingInfoByBox?boxBarcode=${data}`,
        method: "post",
    });
}

export function SplitFinishedSNToPacking(data) {
    return request({
        url: "/api/packing/SplitFinishedSNToPacking",
        method: "post",
		data
    });
}
export function OnekeyFinishedSNToPacking(data) {
    return request({
        url: `/api/packing/OnekeyFinishedSNToPacking?boxBarcode=${data}`,
        method: "post"
    });
}

