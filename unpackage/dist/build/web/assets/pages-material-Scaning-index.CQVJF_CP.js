import{r as e,_ as o,aD as a,ao as t,aE as l,A as u,v as r,x as s,d as i,w as p,i as n,o as d,e as m}from"./index-BGMMYpLj.js";import{_}from"./u-input.Coqpc1Jd.js";import{_ as c,a as f}from"./u-form.Q5Xs4RHm.js";import{_ as v}from"./u-button.Dr9wKWVi.js";import{_ as b}from"./_plugin-vue_export-helper.BCo6x5W8.js";import"./u-icon.B26jy-l1.js";/* empty css                                                               */import"./u-line.CTRc1Fj8.js";import"./u-loading-icon.DEWftbaH.js";const j=b({__name:"index",setup(b){const j=e({ip:"",port:""});o((()=>{let e=a("NIS_IPFORM");void 0!==e&&(j.value={...e},x())}));const x=()=>{t({url:`http://${j.value.ip}:${j.value.port}/api/v1.0/ping?DisableErrorHandling=`,method:"POST"}).then((e=>{204===e.statusCode&&(l("NIS_IPFORM",j.value),u({url:"/pages/material/Scaning/mcid"}))}))};return(e,o)=>{const a=r(s("up-input"),_),t=r(s("up-form-item"),c),l=r(s("up-button"),v),u=r(s("up-form"),f),b=n;return d(),i(b,{class:"content",onClick:e.getFocus},{default:p((()=>[m(b,{class:"box"},{default:p((()=>[m(u,{model:j.value,ref:"form1","label-width":"60",labelPosition:"top"},{default:p((()=>[m(t,{label:"IP地址",prop:"ip",borderBottom:!0},{default:p((()=>[m(a,{modelValue:j.value.ip,"onUpdate:modelValue":o[0]||(o[0]=e=>j.value.ip=e),adjustPosition:"",border:"none"},null,8,["modelValue"])])),_:1}),m(t,{label:"端口",prop:"port",borderBottom:!0},{default:p((()=>[m(a,{modelValue:j.value.port,"onUpdate:modelValue":o[1]||(o[1]=e=>j.value.port=e),adjustPosition:"",border:"none"},null,8,["modelValue"])])),_:1}),m(t,null,{default:p((()=>[m(l,{plain:"true",text:"返回"}),m(l,{type:"primary",text:"确定",onClick:x})])),_:1})])),_:1},8,["model"])])),_:1})])),_:1},8,["onClick"])}}},[["__scopeId","data-v-1248aec6"]]);export{j as default};
