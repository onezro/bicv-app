import{r as e,ap as a,v as l,x as u,d as o,w as t,i as r,o as m,e as d,f as s,t as i,H as n,a9 as p,K as b}from"./index-BGMMYpLj.js";import{_ as f}from"./uni-data-checkbox.BZqLlmt3.js";import{_,a as c}from"./u-form.Q5Xs4RHm.js";import{_ as v}from"./uni-icons.DYEN23k6.js";import{_ as x}from"./u-input.Coqpc1Jd.js";import{_ as N}from"./uni-section.CCDL9Cq2.js";import{_ as y}from"./u-button.Dr9wKWVi.js";import{_ as j}from"./_plugin-vue_export-helper.BCo6x5W8.js";import"./uni-cloud.es.BPDmVjNF.js";import"./uni-load-more.BR-FgQCx.js";import"./u-icon.B26jy-l1.js";/* empty css                                                               */import"./u-line.CTRc1Fj8.js";import"./u-loading-icon.DEWftbaH.js";const C=j({__name:"screenUnbox",setup(j){const C=e([{text:"拆箱",value:0},{text:"一键拆箱",value:1}]),V=e({type:0,turnNumber:"",barCode:""}),h=e([]),k=e(!1),g=e(),U=e(),P=e({orderNum:"12312323",itemNumber:"",itemName:"",boxNumber:""});a((()=>V.value.type),((e,a)=>{k.value=0!==e,e!==a&&(P.value.orderNum="",P.value.itemNumber="",P.value.itemName="",P.value.boxNumber="",V.value.turnNumber="",V.value.barCode="")}),{deep:!0,immediate:!0});const W=()=>{p({onlyFromCamera:!0,scanType:["qrCode","barCode","datamatrix","pdf417"],success:e=>{console.log(e)}})},F=()=>{if(0==V.value.type);else{let e=V.value.barCode;h.value.push(e),V.value.barCode="",console.log(h.value)}},H=()=>{g.value.resetFields()};return(e,a)=>{const p=l(u("uni-data-checkbox"),f),j=l(u("up-form-item"),_),h=l(u("uni-icons"),v),K=l(u("up-input"),x),R=l(u("up-form"),c),T=r,q=l(u("uni-section"),N),w=b,z=l(u("up-button"),y);return m(),o(T,{class:"content"},{default:t((()=>[d(q,{title:"拆箱",type:"line"},{default:t((()=>[d(T,{class:"box"},{default:t((()=>[d(R,{labelPosition:"left",model:V.value,ref_key:"formRef",ref:g,labelWidth:"100"},{default:t((()=>[d(j,{label:"类型",prop:"type"},{default:t((()=>[d(p,{modelValue:V.value.type,"onUpdate:modelValue":a[0]||(a[0]=e=>V.value.type=e),localdata:C.value},null,8,["modelValue","localdata"])])),_:1}),d(j,{label:"扫描条码",prop:"barCode"},{default:t((()=>[d(K,{placeholder:"请扫描条码",modelValue:V.value.barCode,"onUpdate:modelValue":a[1]||(a[1]=e=>V.value.barCode=e),onConfirm:F},{suffix:t((()=>[d(h,{type:"scan",color:"#bdbdbd",onClick:W,size:"24"})])),_:1},8,["modelValue"])])),_:1}),d(j,{label:"周转箱条码",prop:"turnNumber"},{default:t((()=>[d(K,{modelValue:V.value.turnNumber,"onUpdate:modelValue":a[2]||(a[2]=e=>V.value.turnNumber=e),disabled:!k.value},null,8,["modelValue","disabled"])])),_:1})])),_:1},8,["model"])])),_:1})])),_:1}),d(q,{title:"装箱明细",type:"line"},{default:t((()=>[d(T,{class:"box"},{default:t((()=>[d(R,{labelPosition:"left",model:P.value,ref_key:"materRef",ref:U,labelWidth:"80"},{default:t((()=>[d(j,{label:"工单号",prop:"orderNum"},{default:t((()=>[d(w,null,{default:t((()=>[s(i(P.value.orderNum),1)])),_:1})])),_:1}),d(j,{label:"物料编号",prop:"itemNumber"},{default:t((()=>[d(w,null,{default:t((()=>[s(i(P.value.itemNumber),1)])),_:1})])),_:1}),d(j,{label:"物料名称",prop:"itemName"},{default:t((()=>[d(w,null,{default:t((()=>[s(i(P.value.itemName),1)])),_:1})])),_:1}),d(j,{label:"箱数量",prop:"boxNumber"},{default:t((()=>[d(w,null,{default:t((()=>[s(i(P.value.boxNumber),1)])),_:1})])),_:1})])),_:1},8,["model"])])),_:1})])),_:1}),d(T,{class:"subox"},{default:t((()=>[d(z,{text:"重置",onClick:H}),k.value?(m(),o(z,{key:0,type:"primary",text:"一键拆箱"})):n("",!0)])),_:1})])),_:1})}}},[["__scopeId","data-v-72ebc4be"]]);export{C as default};
