import{n as e,r as a,ap as u,v as l,x as t,d as o,w as r,i as s,o as d,e as m,f as n,t as i,H as c,aq as p,a9 as v,s as b,K as f}from"./index-BGMMYpLj.js";import{_}from"./uni-data-checkbox.BZqLlmt3.js";import{_ as N,a as y}from"./u-form.Q5Xs4RHm.js";import{_ as x}from"./uni-icons.DYEN23k6.js";import{_ as C}from"./u-input.Coqpc1Jd.js";import{_ as P}from"./uni-section.CCDL9Cq2.js";import{_ as j}from"./u-button.Dr9wKWVi.js";import{S as h,Q as g,a as V}from"./index.C_bR71-q.js";import{b as Q,a as k}from"./prompt.CRqnvq7m.js";import{u as D}from"./user.CJRpAqDR.js";import{_ as O}from"./_plugin-vue_export-helper.BCo6x5W8.js";import"./uni-cloud.es.BPDmVjNF.js";import"./uni-load-more.BR-FgQCx.js";import"./u-icon.B26jy-l1.js";/* empty css                                                               */import"./u-line.CTRc1Fj8.js";import"./u-loading-icon.DEWftbaH.js";import"./config.C9WjKJqE.js";const T=O({__name:"turnBox",setup(O){const T=D(),{name:U}=e(T),W=a([{text:"拆箱",value:0},{text:"一键拆箱",value:1}]),q=a({type:0,turnNumber:"",barCode:""});a([]);const A=a(!1),F=a(),H=a(),I=a({OrderNumber:"",ProductName:"",ProductDescription:"",Column1:""}),K=()=>{I.value.OrderNumber="",I.value.ProductName="",I.value.ProductDescription="",I.value.PanelQty="",I.value.PcbQty="",q.value.turnNumber="",q.value.barCode=""},R=a(!0),S=a(!0);u((()=>q.value.type),((e,a)=>{A.value=0!==e,e!==a&&(S.value=!0,w(),K())}));const w=()=>{R.value=!1,setTimeout((()=>{R.value=!0}),100)},z=()=>{p()},B=()=>{v({onlyFromCamera:!0,scanType:["qrCode","barCode","datamatrix","pdf417"],success:e=>{q.value.barCode=e.result,G()}})},G=()=>{if(""==q.value.turnNumber)Y(q.value.barCode);else if(0==q.value.type){let e={CarrierName:q.value.turnNumber,PcbNumber:q.value.barCode,userAccount:U.value};h(e).then((e=>{Q(),Y(q.value.turnNumber),b({title:e.msg,icon:"success",duration:2500})})).catch((e=>{k()})),q.value.barCode="",w()}else Y(q.value.barCode)},L=()=>{K(),w()},Y=e=>{g(e).then((a=>{q.value.turnNumber=e,I.value={...a.content},Q(),A.value&&(S.value=!1)})).catch((a=>{I.value.OrderNumber="",I.value.ProductName="",I.value.ProductDescription="",I.value.PanelQty="",I.value.PcbQty="",k(),A.value&&(""!==q.value.turnNumber&&(q.value.turnNumber=e),S.value=!0,w())})),q.value.barCode="",A.value||w()},Z=()=>{let e={CarrierName:q.value.turnNumber,userAccount:U.value};V(e).then((e=>{Q(),b({title:e.msg,icon:"success"}),I.value.OrderNumber="",I.value.ProductName="",I.value.ProductDescription="",I.value.PanelQty="",I.value.PcbQty="",S.value=!0})).catch((e=>{k()})),q.value.barCode="",w()};return(e,a)=>{const u=l(t("uni-data-checkbox"),_),p=l(t("up-form-item"),N),v=l(t("uni-icons"),x),b=l(t("up-input"),C),h=l(t("up-form"),y),g=s,V=l(t("uni-section"),P),Q=f,k=l(t("up-button"),j);return d(),o(g,{class:"content"},{default:r((()=>[m(V,{title:"拆箱",type:"line"},{default:r((()=>[m(g,{class:"box"},{default:r((()=>[m(h,{labelPosition:"left",model:q.value,ref_key:"formRef",ref:F,labelWidth:"100"},{default:r((()=>[m(p,{label:"类型",prop:"type"},{default:r((()=>[m(u,{modelValue:q.value.type,"onUpdate:modelValue":a[0]||(a[0]=e=>q.value.type=e),localdata:W.value},null,8,["modelValue","localdata"])])),_:1}),m(p,{label:"扫描条码",prop:"barCode"},{default:r((()=>[m(b,{placeholder:"请扫描条码",onFocus:z,focus:R.value,modelValue:q.value.barCode,"onUpdate:modelValue":a[1]||(a[1]=e=>q.value.barCode=e),onConfirm:G},{suffix:r((()=>[m(v,{type:"scan",color:"#bdbdbd",onClick:B,size:"24"})])),_:1},8,["focus","modelValue"])])),_:1}),m(p,{label:"周转箱条码",prop:"turnNumber"},{default:r((()=>[m(b,{modelValue:q.value.turnNumber,"onUpdate:modelValue":a[2]||(a[2]=e=>q.value.turnNumber=e),disabled:!0},null,8,["modelValue"])])),_:1})])),_:1},8,["model"])])),_:1})])),_:1}),m(V,{title:"装箱明细",type:"line"},{default:r((()=>[m(g,{class:"box"},{default:r((()=>[m(h,{labelPosition:"left",model:I.value,ref_key:"materRef",ref:H,labelWidth:"80"},{default:r((()=>[m(p,{label:"工单号",prop:"orderNum"},{default:r((()=>[m(g,{class:"textlog"},{default:r((()=>[n(i(I.value.OrderNumber),1)])),_:1})])),_:1}),m(p,{label:"物料编码",prop:"itemNumber"},{default:r((()=>[m(Q,{class:"textlog"},{default:r((()=>[n(i(I.value.ProductName),1)])),_:1})])),_:1}),m(p,{label:"物料名称",prop:"itemName"},{default:r((()=>[m(Q,null,{default:r((()=>[n(i(I.value.ProductDescription),1)])),_:1})])),_:1}),m(p,{label:"大板数量",prop:"boxNumber"},{default:r((()=>[m(Q,{class:"textlog"},{default:r((()=>[n(i(I.value.PanelQty),1)])),_:1})])),_:1}),m(p,{label:"小板数量",prop:"boxNumber"},{default:r((()=>[m(Q,{class:"textlog"},{default:r((()=>[n(i(I.value.PcbQty),1)])),_:1})])),_:1})])),_:1},8,["model"])])),_:1})])),_:1}),m(g,{class:"subox"},{default:r((()=>[m(k,{text:"重置",onClick:L}),A.value?(d(),o(k,{key:0,type:"primary",text:"一键拆箱",onClick:Z,disabled:S.value},null,8,["disabled"])):c("",!0)])),_:1})])),_:1})}}},[["__scopeId","data-v-2d97370b"]]);export{T as default};