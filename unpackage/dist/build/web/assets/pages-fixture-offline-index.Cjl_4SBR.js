import{r as e,L as a,v as l,x as t,d as o,w as u,i as n,o as s,e as i,A as r}from"./index-BGMMYpLj.js";import{_ as d}from"./uni-data-select.DrmDTM-h.js";import{_ as m,a as c}from"./u-form.Q5Xs4RHm.js";import{_ as f}from"./uni-section.CCDL9Cq2.js";import{f as p}from"./login.B4FiVUnw.js";import{_}from"./_plugin-vue_export-helper.BCo6x5W8.js";import"./uni-cloud.es.BPDmVjNF.js";import"./uni-icons.DYEN23k6.js";import"./u-icon.B26jy-l1.js";/* empty css                                                               */import"./u-line.CTRc1Fj8.js";import"./config.C9WjKJqE.js";const v=_({__name:"index",setup(_){const v=e(""),j=e(""),h=e([]),x=e(""),g=e([]),D=e([]);a((()=>{I()}));const I=()=>{p().then((e=>{let a=e.content.filter((e=>null!==e.FID&&""!==e.FID));a=a.map((e=>({value:e.Name,text:e.Desc,...e}))),D.value=b(a),a=a.filter((e=>3!==e.Level)),h.value=a}))},b=e=>{const a=new Map;return e.forEach((e=>{a.set(e.ID,{...e,children:[]})})),e.forEach((e=>{if(e.FID!==e.ID){const l=a.get(e.FID);l&&l.children.push(a.get(e.ID))}})),Array.from(a.values())},V=e=>{let a=D.value.find((a=>e===a.value));g.value=a.children,j.value=a.text},F=e=>{const a=D.value.find((a=>e===a.value));r({url:`/pages/fixture/offline/edit?workStation=${a.value}&workStationDec=${a.text}&line=${j.value}`})};return(e,a)=>{const r=l(t("uni-data-select"),d),p=l(t("up-form-item"),m),_=l(t("up-form"),c),j=n,D=l(t("uni-section"),f);return s(),o(j,{class:"content"},{default:u((()=>[i(D,{title:"工位选择",type:"line"},{default:u((()=>[i(j,{class:"box"},{default:u((()=>[i(_,{labelAlign:"left",model:e.form,ref:"formRef",labelWidth:"50"},{default:u((()=>[i(p,{label:"产线"},{default:u((()=>[i(r,{modelValue:v.value,"onUpdate:modelValue":a[0]||(a[0]=e=>v.value=e),localdata:h.value,onChange:V},null,8,["modelValue","localdata"])])),_:1}),i(p,{label:"工位"},{default:u((()=>[i(r,{modelValue:x.value,"onUpdate:modelValue":a[1]||(a[1]=e=>x.value=e),localdata:g.value,onChange:F},null,8,["modelValue","localdata"])])),_:1})])),_:1},8,["model"])])),_:1})])),_:1})])),_:1})}}},[["__scopeId","data-v-0b3a5c5b"]]);export{v as default};
