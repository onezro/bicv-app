import{M as t,N as i,O as s,P as e,Q as a,R as n,X as u,S as r,o as l,d as o,w as f,G as h,D as c,E as d,i as g,aH as y}from"./index-BGMMYpLj.js";import{_ as p}from"./_plugin-vue_export-helper.BCo6x5W8.js";const m=p({name:"u-col",mixins:[s,e,t({props:{span:{type:[String,Number],default:()=>i.col.span},offset:{type:[String,Number],default:()=>i.col.offset},justify:{type:String,default:()=>i.col.justify},align:{type:String,default:()=>i.col.align},textAlign:{type:String,default:()=>i.col.textAlign}}})],data:()=>({width:0,parentData:{gutter:0},gridNum:12}),options:{virtualHost:!0},computed:{uJustify(){return"end"==this.justify||"start"==this.justify?"flex-"+this.justify:"around"==this.justify||"between"==this.justify?"space-"+this.justify:this.justify},uAlignItem(){return"top"==this.align?"flex-start":"bottom"==this.align?"flex-end":this.align},colStyle(){const t={paddingLeft:a(n(this.parentData.gutter)/2),paddingRight:a(n(this.parentData.gutter)/2),alignItems:this.uAlignItem,justifyContent:this.uJustify,textAlign:this.textAlign,flex:`0 0 ${100/this.gridNum*this.span}%`,marginLeft:100/12*this.offset+"%"};return u(t,r(this.customStyle))}},mounted(){this.init()},emits:["click"],methods:{async init(){this.updateParentData(),this.width=await this.parent.getComponentWidth()},updateParentData(){this.getParentData("u-row")},clickHandler(t){this.$emit("click")}}},[["render",function(t,i,s,e,a,n){const u=g;return l(),o(u,{class:c(["u-col",["u-col-"+t.span]]),ref:"u-col",style:d([n.colStyle]),onClick:n.clickHandler},{default:f((()=>[h(t.$slots,"default",{},void 0,!0)])),_:3},8,["class","style","onClick"])}],["__scopeId","data-v-63620d36"]]);const j=p({name:"u-row",mixins:[s,e,t({props:{gutter:{type:[String,Number],default:()=>i.row.gutter},justify:{type:String,default:()=>i.row.justify},align:{type:String,default:()=>i.row.align}}})],data:()=>({}),computed:{uJustify(){return"end"==this.justify||"start"==this.justify?"flex-"+this.justify:"around"==this.justify||"between"==this.justify?"space-"+this.justify:this.justify},uAlignItem(){return"top"==this.align?"flex-start":"bottom"==this.align?"flex-end":this.align},rowStyle(){const t={alignItems:this.uAlignItem,justifyContent:this.uJustify};return this.gutter&&(t.marginLeft=a(-Number(this.gutter)/2),t.marginRight=a(-Number(this.gutter)/2)),u(t,r(this.customStyle))}},emits:["click"],methods:{clickHandler(t){this.$emit("click")},async getComponentWidth(){return await y(),new Promise((t=>{this.$uGetRect(".u-row").then((i=>{t(i.width)}))}))}}},[["render",function(t,i,s,e,a,n){const u=g;return l(),o(u,{class:"u-row",ref:"u-row",style:d([n.rowStyle]),onClick:n.clickHandler},{default:f((()=>[h(t.$slots,"default",{},void 0,!0)])),_:3},8,["style","onClick"])}],["__scopeId","data-v-90ab5632"]]);export{m as _,j as a};