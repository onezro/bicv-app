import{M as e,N as t,O as a,P as l,R as o,Q as s,v as u,x as i,o as n,d as r,w as m,J as d,G as c,D as p,E as h,e as b,H as f,i as y,I as g,an as _,b as v,ao as x,c as S,s as T,n as C,r as B,ap as V,f as k,t as N,a9 as P,K as D}from"./index-BGMMYpLj.js";import{_ as M}from"./uni-data-checkbox.BZqLlmt3.js";import{_ as j,a as w}from"./u-form.Q5Xs4RHm.js";import{_ as Q}from"./uni-icons.DYEN23k6.js";import{_ as $}from"./u-input.Coqpc1Jd.js";import{_ as I}from"./u-icon.B26jy-l1.js";import{_ as L}from"./_plugin-vue_export-helper.BCo6x5W8.js";import{_ as W}from"./uni-section.CCDL9Cq2.js";import{_ as z}from"./u-button.Dr9wKWVi.js";import{c as H}from"./config.C9WjKJqE.js";import{b as F,a as U}from"./prompt.CRqnvq7m.js";import{u as O}from"./user.CJRpAqDR.js";import"./uni-cloud.es.BPDmVjNF.js";import"./uni-load-more.BR-FgQCx.js";import"./u-line.CTRc1Fj8.js";/* empty css                                                               */import"./u-loading-icon.DEWftbaH.js";const E=L({name:"u-number-box",mixins:[a,l,e({props:{name:{type:[String,Number],default:()=>t.numberBox.name},modelValue:{type:[String,Number],default:()=>t.numberBox.value},min:{type:[String,Number],default:()=>t.numberBox.min},max:{type:[String,Number],default:()=>t.numberBox.max},step:{type:[String,Number],default:()=>t.numberBox.step},integer:{type:Boolean,default:()=>t.numberBox.integer},disabled:{type:Boolean,default:()=>t.numberBox.disabled},disabledInput:{type:Boolean,default:()=>t.numberBox.disabledInput},asyncChange:{type:Boolean,default:()=>t.numberBox.asyncChange},inputWidth:{type:[String,Number],default:()=>t.numberBox.inputWidth},showMinus:{type:Boolean,default:()=>t.numberBox.showMinus},showPlus:{type:Boolean,default:()=>t.numberBox.showPlus},decimalLength:{type:[String,Number,null],default:()=>t.numberBox.decimalLength},longPress:{type:Boolean,default:()=>t.numberBox.longPress},color:{type:String,default:()=>t.numberBox.color},buttonSize:{type:[String,Number],default:()=>t.numberBox.buttonSize},bgColor:{type:String,default:()=>t.numberBox.bgColor},cursorSpacing:{type:[String,Number],default:()=>t.numberBox.cursorSpacing},disablePlus:{type:Boolean,default:()=>t.numberBox.disablePlus},disableMinus:{type:Boolean,default:()=>t.numberBox.disableMinus},iconStyle:{type:[Object,String],default:()=>t.numberBox.iconStyle}}})],data:()=>({currentValue:"",longPressTimer:null}),watch:{watchChange(e){this.check()},modelValue:{handler:function(e,t){e!==this.currentValue&&(this.currentValue=this.format(this.modelValue))},immediate:!0}},computed:{getCursorSpacing(){return o(this.cursorSpacing)},buttonStyle(){return e=>{const t={backgroundColor:this.bgColor,height:s(this.buttonSize),color:this.color};return this.isDisabled(e)&&(t.backgroundColor="#f7f8fa"),t}},inputStyle(){this.disabled||this.disabledInput;return{color:this.color,backgroundColor:this.bgColor,height:s(this.buttonSize),width:s(this.inputWidth)}},watchChange(){return[this.integer,this.decimalLength,this.min,this.max]},isDisabled(){return e=>"plus"===e?this.disabled||this.disablePlus||this.currentValue>=this.max:this.disabled||this.disableMinus||this.currentValue<=this.min}},mounted(){this.init()},emits:["update:modelValue","focus","blur","overlimit","change","plus","minus"],methods:{init(){this.currentValue=this.format(this.modelValue)},format(e){return e=""===(e=this.filter(e))?0:+e,e=Math.max(Math.min(this.max,e),this.min),null!==this.decimalLength&&(e=e.toFixed(this.decimalLength)),e},filter(e){return e=String(e).replace(/[^0-9.-]/g,""),this.integer&&-1!==e.indexOf(".")&&(e=e.split(".")[0]),e},check(){const e=this.format(this.currentValue);e!==this.currentValue&&(this.currentValue=e,this.emitChange(e))},onFocus(e){this.$emit("focus",{...e.detail,name:this.name})},onBlur(e){this.format(e.detail.value),this.$emit("blur",{...e.detail,name:this.name})},onInput(e){const{value:t=""}=e.detail||{};if(""===t)return;let a=this.filter(t);if(null!==this.decimalLength&&-1!==a.indexOf(".")){const e=a.split(".");a=`${e[0]}.${e[1].slice(0,this.decimalLength)}`}a=this.format(a),this.emitChange(a)},emitChange(e){this.asyncChange||this.$nextTick((()=>{this.$emit("update:modelValue",e),this.currentValue=e,this.$forceUpdate()})),this.$emit("change",{value:e,name:this.name})},onChange(){const{type:e}=this;if(this.isDisabled(e))return this.$emit("overlimit",e);const t="minus"===e?-this.step:+this.step,a=this.format(this.add(+this.currentValue,t));this.emitChange(a),this.$emit(e)},add(e,t){const a=Math.pow(10,10);return Math.round((e+t)*a)/a},clickHandler(e){this.type=e,this.onChange()},longPressStep(){this.clearTimeout(),this.longPressTimer=setTimeout((()=>{this.onChange(),this.longPressStep()}),250)},onTouchStart(e){this.longPress&&(this.clearTimeout(),this.type=e,this.longPressTimer=setTimeout((()=>{this.onChange(),this.longPressStep()}),600))},onTouchEnd(){this.longPress&&this.clearTimeout()},clearTimeout(){clearTimeout(this.longPressTimer),this.longPressTimer=null}}},[["render",function(e,t,a,l,o,s){const _=y,v=u(i("u-icon"),I),x=g;return n(),r(_,{class:"u-number-box"},{default:m((()=>[e.showMinus&&e.$slots.minus?(n(),r(_,{key:0,class:"u-number-box__slot cursor-pointer",onClick:t[0]||(t[0]=d((e=>s.clickHandler("minus")),["stop"])),onTouchstart:t[1]||(t[1]=e=>s.onTouchStart("minus")),onTouchend:d(s.clearTimeout,["stop"])},{default:m((()=>[c(e.$slots,"minus",{},void 0,!0)])),_:3},8,["onTouchend"])):e.showMinus?(n(),r(_,{key:1,class:p(["u-number-box__minus cursor-pointer",{"u-number-box__minus--disabled":s.isDisabled("minus")}]),onClick:t[2]||(t[2]=d((e=>s.clickHandler("minus")),["stop"])),onTouchstart:t[3]||(t[3]=e=>s.onTouchStart("minus")),onTouchend:d(s.clearTimeout,["stop"]),"hover-class":"u-number-box__minus--hover","hover-stay-time":"150",style:h([s.buttonStyle("minus")])},{default:m((()=>[b(v,{name:"minus",color:s.isDisabled("minus")?"#c8c9cc":"#323233",size:"15",bold:"",customStyle:e.iconStyle},null,8,["color","customStyle"])])),_:1},8,["onTouchend","class","style"])):f("",!0),c(e.$slots,"input",{},(()=>[b(x,{disabled:e.disabledInput||e.disabled,"cursor-spacing":s.getCursorSpacing,class:p([{"u-number-box__input--disabled":e.disabled||e.disabledInput},"u-number-box__input"]),modelValue:o.currentValue,"onUpdate:modelValue":t[4]||(t[4]=e=>o.currentValue=e),onBlur:s.onBlur,onFocus:s.onFocus,onInput:s.onInput,type:"number",style:h([s.inputStyle])},null,8,["disabled","cursor-spacing","class","modelValue","onBlur","onFocus","onInput","style"])]),!0),e.showPlus&&e.$slots.plus?(n(),r(_,{key:2,class:"u-number-box__slot cursor-pointer",onClick:t[5]||(t[5]=d((e=>s.clickHandler("plus")),["stop"])),onTouchstart:t[6]||(t[6]=e=>s.onTouchStart("plus")),onTouchend:d(s.clearTimeout,["stop"])},{default:m((()=>[c(e.$slots,"plus",{},void 0,!0)])),_:3},8,["onTouchend"])):e.showPlus?(n(),r(_,{key:3,class:p(["u-number-box__plus cursor-pointer",{"u-number-box__minus--disabled":s.isDisabled("plus")}]),onClick:t[7]||(t[7]=d((e=>s.clickHandler("plus")),["stop"])),onTouchstart:t[8]||(t[8]=e=>s.onTouchStart("plus")),onTouchend:d(s.clearTimeout,["stop"]),"hover-class":"u-number-box__plus--hover","hover-stay-time":"150",style:h([s.buttonStyle("plus")])},{default:m((()=>[b(v,{name:"plus",color:s.isDisabled("plus")?"#c8c9cc":"#323233",size:"15",bold:"",customStyle:e.iconStyle},null,8,["color","customStyle"])])),_:1},8,["onTouchend","class","style"])):f("",!0)])),_:3})}],["__scopeId","data-v-bccae677"]]);const G=e=>{const t=!1===(H.headers||{}).isToken;return e.header=H.header||{},_()&&!t&&(e.header.Authorization=_()),new Promise(((t,a)=>{v({mask:!0,title:"加载中~"}),x({url:H.scrUrl+e.url,data:e.data||{},timeout:1e4,method:e.method||"GET",header:e.header}).then((e=>{S();const l=e.data.msg;1==e.data.success?t(e.data):(console.log(e),T({title:l,icon:"none",duration:2500}),a("500"))})).catch((e=>{S(),console.log(e,1)}))}))};const A=L({__name:"unboxing",setup(e){const t=O(),{name:a}=C(t),l=B({SplitType:"1",ContainerName:"",ProductName:"",ProductDescription:"",SplitQty:0,Remark:"",workstationName:"",userAccount:a,txnDate:""}),o=B([{text:"单件",value:"1"},{text:"批次",value:"2"},{text:"模组",value:"0"}]),s=B({ContainerName:"",Qty:"",MaterialName:"",MaterialDesc:"",SpecName:"",SpecDesc:"",VendorLotNumber:"",DueDate:""}),d=B(!0),c=B(!0),p=B(!0);V((()=>l.value.SplitType),((e,t)=>{c.value="2"!=e}),{deep:!0,immediate:!0});const h=()=>{var e;(e=l.value,G({url:"/api/materialcheck/MaterialSplitVerify",method:"post",data:e})).then((e=>{s.value={...e.content[0]},l.value.SplitQty=e.content[0].Qty,p.value=!1,0==e.content[0].Qty&&(p.value=!0)})).catch((()=>{l.value.ContainerName="",p.value=!0}))},f=()=>{P({onlyFromCamera:!0,scanType:["qrCode","barCode","datamatrix","pdf417"],success:e=>{l.value.ContainerName=e.result,h()}})},g=()=>{l.value.ContainerName="",l.value.SplitQty="",l.value.SplitType="1",s.value.ContainerName="",s.value.DueDate="",s.value.MaterialDesc="",s.value.MaterialName="",s.value.Qty="",s.value.SpecDesc="",s.value.SpecName="",s.value.VendorLotNumber="",p.value=!0,d.value=!1,setTimeout((()=>{d.value=!0}),100)},_=()=>{var e;(e=l.value,G({url:"/api/materialcheck/MaterialSplit",method:"post",data:e})).then((e=>{F(),T({title:e.msg,icon:"none"}),p.value=!0,console.log(e)})).catch((()=>{p.value=!1,U()}))};return(e,t)=>{const a=u(i("uni-data-checkbox"),M),v=u(i("up-form-item"),j),x=u(i("uni-icons"),Q),S=u(i("u-input"),$),T=u(i("up-number-box"),E),C=u(i("up-form"),w),B=y,V=u(i("uni-section"),W),P=D,I=u(i("up-button"),z);return n(),r(B,{class:"content"},{default:m((()=>[b(V,{title:"拆包信息",type:"line"},{default:m((()=>[b(B,{class:"box"},{default:m((()=>[b(C,{labelPosition:"left",model:l.value,ref:"form1",labelWidth:"120"},{default:m((()=>[b(v,{label:"类型",prop:"SplitType",borderBottom:""},{default:m((()=>[b(a,{modelValue:l.value.SplitType,"onUpdate:modelValue":t[0]||(t[0]=e=>l.value.SplitType=e),localdata:o.value},null,8,["modelValue","localdata"])])),_:1}),b(v,{label:"物料批次条码",prop:"ContainerName",borderBottom:""},{default:m((()=>[b(S,{placeholder:"扫描物料批次条码",modelValue:l.value.ContainerName,"onUpdate:modelValue":t[1]||(t[1]=e=>l.value.ContainerName=e),focus:d.value,onConfirm:h},{suffix:m((()=>[b(x,{type:"scan",color:"#bdbdbd",onClick:f,size:"24"})])),_:1},8,["modelValue","focus"])])),_:1}),b(v,{label:"拆分数量",prop:"SplitQty",borderBottom:""},{default:m((()=>[b(T,{inputWidth:"80",disabled:c.value,modelValue:l.value.SplitQty,"onUpdate:modelValue":t[2]||(t[2]=e=>l.value.SplitQty=e)},null,8,["disabled","modelValue"])])),_:1})])),_:1},8,["model"])])),_:1})])),_:1}),b(V,{title:"物料明细",type:"line"},{default:m((()=>[b(B,{class:"box"},{default:m((()=>[b(C,{labelPosition:"left",model:s.value,ref:"form1"},{default:m((()=>[b(v,{label:"物料编码",prop:"material.type",labelWidth:"80"},{default:m((()=>[b(P,null,{default:m((()=>[k(N(s.value.MaterialName),1)])),_:1})])),_:1}),b(v,{label:"物料名称",labelWidth:"80",prop:"material.barCode"},{default:m((()=>[b(P,null,{default:m((()=>[k(N(s.value.MaterialDesc),1)])),_:1})])),_:1}),b(v,{label:"制造日期",labelWidth:"80",prop:"material.splitQt"},{default:m((()=>[b(P,null,{default:m((()=>[k(N(s.value.DueDate),1)])),_:1})])),_:1}),b(v,{label:"物料批次",labelWidth:"80",prop:"material.splitQt"},{default:m((()=>[b(P,null,{default:m((()=>[k(N(s.value.VendorLotNumber),1)])),_:1})])),_:1}),b(v,{label:"数量",labelWidth:"80",prop:"material.splitQt"},{default:m((()=>[b(P,null,{default:m((()=>[k(N(s.value.Qty),1)])),_:1})])),_:1})])),_:1},8,["model"])])),_:1})])),_:1}),b(B,{class:"subox"},{default:m((()=>[b(I,{text:"重置",onClick:g}),b(I,{type:"primary",text:"确定",disabled:p.value,onClick:_},null,8,["disabled"])])),_:1})])),_:1})}}},[["__scopeId","data-v-4878e067"]]);export{A as default};