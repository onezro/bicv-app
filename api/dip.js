import {
	request
} from '@/request/dipRequest.js'


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
