import{M as e,N as t,O as i,P as r,Q as s,X as l,S as n,o,d as a,E as d,i as h}from"./index-BGMMYpLj.js";import{_ as m}from"./_plugin-vue_export-helper.BCo6x5W8.js";const p=m({name:"u-line",mixins:[i,r,e({props:{color:{type:String,default:()=>t.line.color},length:{type:[String,Number],default:()=>t.line.length},direction:{type:String,default:()=>t.line.direction},hairline:{type:Boolean,default:()=>t.line.hairline},margin:{type:[String,Number],default:()=>t.line.margin},dashed:{type:Boolean,default:()=>t.line.dashed}}})],computed:{lineStyle(){const e={};return e.margin=this.margin,"row"===this.direction?(e.borderBottomWidth="1px",e.borderBottomStyle=this.dashed?"dashed":"solid",e.width=s(this.length),this.hairline&&(e.transform="scaleY(0.5)")):(e.borderLeftWidth="1px",e.borderLeftStyle=this.dashed?"dashed":"solid",e.height=s(this.length),this.hairline&&(e.transform="scaleX(0.5)")),e.borderColor=this.color,l(e,n(this.customStyle))}}},[["render",function(e,t,i,r,s,l){const n=h;return o(),a(n,{class:"u-line",style:d([l.lineStyle])},null,8,["style"])}],["__scopeId","data-v-e76fbe42"]]);export{p as _};