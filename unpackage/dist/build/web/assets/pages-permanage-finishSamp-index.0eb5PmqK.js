import{r as e,L as a,v as t,x as s,d as o,w as n,i as l,o as i,e as u,A as r}from"./index-BGMMYpLj.js";import{_ as d}from"./uni-data-select.DrmDTM-h.js";import{_ as c}from"./uni-section.CCDL9Cq2.js";import{b as m}from"./index.C_bR71-q.js";import{_ as p}from"./_plugin-vue_export-helper.BCo6x5W8.js";import"./uni-cloud.es.BPDmVjNF.js";import"./uni-icons.DYEN23k6.js";import"./config.C9WjKJqE.js";const f=p({__name:"index",setup(p){const f=e([]),_=e("");a((()=>{v()}));const v=()=>{m("P1825").then((e=>{let a=e.content;f.value=a.map((e=>({value:e.EQUIPMENTNAME,text:e.EQUIPMENTDESC})))}))},x=e=>{const a=f.value.find((a=>e===a.value));r({url:`/pages/permanage/finishSamp/edit?workStation=${a.value}&workStationDec=${a.text}`})};return(e,a)=>{const r=t(s("uni-data-select"),d),m=l,p=t(s("uni-section"),c);return i(),o(m,{class:"content"},{default:n((()=>[u(p,{title:"工位选择",type:"line"},{default:n((()=>[u(m,{class:"box"},{default:n((()=>[u(r,{modelValue:_.value,"onUpdate:modelValue":a[0]||(a[0]=e=>_.value=e),localdata:f.value,onChange:x},null,8,["modelValue","localdata"])])),_:1})])),_:1})])),_:1})}}},[["__scopeId","data-v-2edca040"]]);export{f as default};
