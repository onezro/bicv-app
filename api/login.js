import {
	request
} from '@/request/request.js'
export function loginApp(data) {
	return request({
		'url': '/api/employee/login',
		'method': 'post',
		'data': data
	})
}

export function getInfo(data) {
	return request({
		'url': '/api/employee/findUserInfoBytoken',
		'method': 'post'
	})
}


export function getMenu() {
    return request({
        url: "/api/employee/findMenuBytoken",
        method: "post",
    });
}

export function getTacketData(data) {
    return request({
        url: "/api/firstinspect/Get_FirstInspect_Info",
        method: "post",
		data
    });
}
export function getTacketStep(data) {
    return request({
        url: "/api/firstinspect/Get_Inspect_Detail_Info",
        method: "post",
		data
    });
}
export function getStepContent(data) {
    return request({
        url: "/api/firstinspect/Get_Inspect_Step_Info",
        method: "post",
		data
    });
}
export function uploadResults(data){
	return request({
		url:'/api/firstinspect/Upload_Inspect_Result',
		method:'POST',
		data
	})
}
export function bindTicket(data){
	return request({
		url:'/api/firstinspect/Create_FirstInspect_Info',
		method:'POST',
		data
	})
}

export function findWorkstationListByOPUI(data){
	return request({
		url:'/api/employee/findWorkstationListByOPUI',
		method:'POST',
	})
}
export function GetPDAVersion(data){
	return request({
		url:'/api/system/GetPDAVersion',
		method:'POST',
	})
}

