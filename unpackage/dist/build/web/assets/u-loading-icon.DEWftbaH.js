import{M as e,N as o,O as t,P as i,aY as n,Q as a,S as r,aM as d,o as l,d as s,w as c,D as u,E as g,y as m,F as f,z as y,H as p,f as h,t as v,i as w,K as S}from"./index-BGMMYpLj.js";import{_}from"./_plugin-vue_export-helper.BCo6x5W8.js";const x=_({name:"u-loading-icon",mixins:[t,i,e({props:{show:{type:Boolean,default:()=>o.loadingIcon.show},color:{type:String,default:()=>o.loadingIcon.color},textColor:{type:String,default:()=>o.loadingIcon.textColor},vertical:{type:Boolean,default:()=>o.loadingIcon.vertical},mode:{type:String,default:()=>o.loadingIcon.mode},size:{type:[String,Number],default:()=>o.loadingIcon.size},textSize:{type:[String,Number],default:()=>o.loadingIcon.textSize},text:{type:[String,Number],default:()=>o.loadingIcon.text},timingFunction:{type:String,default:()=>o.loadingIcon.timingFunction},duration:{type:[String,Number],default:()=>o.loadingIcon.duration},inactiveColor:{type:String,default:()=>o.loadingIcon.inactiveColor}}})],data:()=>({array12:Array.from({length:12}),aniAngel:360,webviewHide:!1,loading:!1}),computed:{otherBorderColor(){const e=n(this.color,"#ffffff",100)[80];return"circle"===this.mode?this.inactiveColor?this.inactiveColor:e:"transparent"}},watch:{show(e){}},mounted(){this.init()},methods:{addUnit:a,addStyle:r,init(){setTimeout((()=>{}),20)},addEventListenerToWebview(){const e=d(),o=e[e.length-1].$getAppWebview();o.addEventListener("hide",(()=>{this.webviewHide=!0})),o.addEventListener("show",(()=>{this.webviewHide=!1}))}}},[["render",function(e,o,t,i,n,a){const r=w,d=S;return e.show?(l(),s(r,{key:0,class:u(["u-loading-icon",[e.vertical&&"u-loading-icon--vertical"]]),style:g([a.addStyle(e.customStyle)])},{default:c((()=>[n.webviewHide?p("",!0):(l(),s(r,{key:0,class:u(["u-loading-icon__spinner",[`u-loading-icon__spinner--${e.mode}`]]),ref:"ani",style:g({color:e.color,width:a.addUnit(e.size),height:a.addUnit(e.size),borderTopColor:e.color,borderBottomColor:a.otherBorderColor,borderLeftColor:a.otherBorderColor,borderRightColor:a.otherBorderColor,"animation-duration":`${e.duration}ms`,"animation-timing-function":"semicircle"===e.mode||"circle"===e.mode?e.timingFunction:""})},{default:c((()=>["spinner"===e.mode?(l(!0),m(f,{key:0},y(n.array12,((e,o)=>(l(),s(r,{key:o,class:"u-loading-icon__dot"})))),128)):p("",!0)])),_:1},8,["class","style"])),e.text?(l(),s(d,{key:1,class:"u-loading-icon__text",style:g({fontSize:a.addUnit(e.textSize),color:e.textColor})},{default:c((()=>[h(v(e.text),1)])),_:1},8,["style"])):p("",!0)])),_:1},8,["style","class"])):p("",!0)}],["__scopeId","data-v-2da858c9"]]);export{x as _};
