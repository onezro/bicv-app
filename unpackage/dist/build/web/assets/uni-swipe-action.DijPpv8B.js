import{o as t,d as e,w as o,e as s,G as n,y as i,F as a,z as r,E as h,J as l,f as c,t as u,K as d,i as p}from"./index-BGMMYpLj.js";import{_ as f}from"./_plugin-vue_export-helper.BCo6x5W8.js";let g={},m=null;m=function(){var t=navigator.userAgent,e=["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"],o=!0;for(let s=0;s<e.length-1;s++)if(t.indexOf(e[s])>0){o=!1;break}return o}(),g={data:()=>({is_show:"none"}),watch:{show(t){this.is_show=this.show}},created(){this.swipeaction=this.getSwipeAction(),this.swipeaction&&Array.isArray(this.swipeaction.children)&&this.swipeaction.children.push(this)},mounted(){this.is_show=this.show},methods:{closeSwipe(t){this.autoClose&&this.swipeaction&&this.swipeaction.closeOther(this)},change(t){this.$emit("change",t.open),this.is_show!==t.open&&(this.is_show=t.open)},appTouchStart(t){if(m)return;const{clientX:e}=t.changedTouches[0];this.clientX=e,this.timestamp=(new Date).getTime()},appTouchEnd(t,e,o,s){if(m)return;const{clientX:n}=t.changedTouches[0];let i=Math.abs(this.clientX-n),a=(new Date).getTime()-this.timestamp;i<40&&a<300&&this.$emit("click",{content:o,index:e,position:s})},onClickForPC(t,e,o){m&&this.$emit("click",{content:e,index:t,position:o})}}};var w=!1;function v(t,e){var o=t.instance,s=o.getDataset().disabled,n=o.getState();x(o,e),(s=("string"==typeof s?JSON.parse(s):s)||!1)||(o.requestAnimationFrame((function(){o.removeClass("ani"),e.callMethod("closeSwipe")})),n.x=n.left||0,function(t){var e=t.instance,o=e.getState();C(e);var s=t.touches[0];w&&_()&&(s=t);o.startX=s.clientX,o.startY=s.clientY}(t))}function b(t,e){var o=t.instance,s=o.getDataset().disabled,n=o.getState();(s=("string"==typeof s?JSON.parse(s):s)||!1)||(!function(t){var e=t.instance.getState(),o=t.touches[0];w&&_()&&(o=t);e.deltaX=o.clientX-e.startX,e.deltaY=o.clientY-e.startY,e.offsetY=Math.abs(e.deltaY),e.offsetX=Math.abs(e.deltaX),e.direction=e.direction||function(t,e){if(t>e&&t>10)return"horizontal";if(e>t&&e>10)return"vertical";return""}(e.offsetX,e.offsetY)}(t),"horizontal"===n.direction&&(t.preventDefault&&t.preventDefault(),S(n.x+n.deltaX,o)))}function y(t,e){var o=t.instance,s=o.getDataset().disabled,n=o.getState();(s=("string"==typeof s?JSON.parse(s):s)||!1)||function(t,e,o){var s=e.getState(),n=s.threshold;s.position;var i=s.isopen||"none",a=s.leftWidth,r=s.rightWidth;if(0===s.deltaX)return void T("none",e,o);T("none"===i&&r>0&&-t>n||"none"!==i&&r>0&&r+t<n?"right":"none"===i&&a>0&&t>n||"none"!==i&&a>0&&a-t<n?"left":"none",e,o)}(n.left,o,e)}function S(t,e,o){t=t||0;var s,n,i,a=e.getState(),r=a.leftWidth,h=a.rightWidth;a.left=(s=t,n=-h,i=r,Math.min(Math.max(s,n),i)),e.requestAnimationFrame((function(){e.setStyle({transform:"translateX("+a.left+"px)","-webkit-transform":"translateX("+a.left+"px)"})}))}function x(t,e){var o,s,n=t.getState(),i=e.selectComponent(".button-group--left"),a=e.selectComponent(".button-group--right");o=i.getBoundingClientRect(),s=a.getBoundingClientRect(),n.leftWidth=o.width||0,n.rightWidth=s.width||0,n.threshold=t.getDataset().threshold}function T(t,e,o){var s=e.getState(),n=s.leftWidth,i=s.rightWidth,a="";switch(s.isopen=s.isopen?s.isopen:"none",t){case"left":a=n;break;case"right":a=-i;break;default:a=0}s.isopen!==t&&(s.throttle=!0,o.callMethod("change",{open:t})),s.isopen=t,e.requestAnimationFrame((function(){e.addClass("ani"),S(a,e)}))}function C(t){var e=t.getState();e.direction="",e.deltaX=0,e.deltaY=0,e.offsetX=0,e.offsetY=0}function _(){for(var t=navigator.userAgent,e=["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"],o=!0,s=0;s<e.length-1;s++)if(t.indexOf(e[s])>0){o=!1;break}return o}"object"==typeof window&&(w=!0);var X=!1;const k={showWatch:function(t,e,o,s){var n=s.getState();x(s,o),t&&"none"!==t?T(t,s,o):(n.left&&T("none",s,o),C(s))},touchstart:v,touchmove:b,touchend:y,mousedown:function(t,e){w&&_()&&(v(t,e),X=!0)},mousemove:function(t,e){w&&_()&&X&&b(t)},mouseup:function(t,e){w&&_()&&(y(t,e),X=!1)},mouseleave:function(t,e){w&&_()&&(X=!1)}},D=t=>{t.$wxs||(t.$wxs=[]),t.$wxs.push("wxsswipe"),t.mixins||(t.mixins=[]),t.mixins.push({beforeCreate(){this.wxsswipe=k}})},$={showWatch(t,e,o,s,n){var i=n.state;(o.$el||o.$vm&&o.$vm.$el)&&(this.getDom(s,o,n),t&&"none"!==t?this.openState(t,s,o,n):(i.left&&this.openState("none",s,o,n),this.resetTouchStatus(s,n)))},touchstart(t,e,o){let s=t.instance,n=s.getDataset().disabled,i=o.state;this.getDom(s,e,o),n=this.getDisabledType(n),n||(s.requestAnimationFrame((function(){s.removeClass("ani"),e.callMethod("closeSwipe")})),i.x=i.left||0,this.stopTouchStart(t,e,o))},touchmove(t,e,o){let s=t.instance;if(!s)return;let n=s.getDataset().disabled,i=o.state;if(n=this.getDisabledType(n),n)return;if(this.stopTouchMove(t,o),"horizontal"!==i.direction)return;t.preventDefault&&t.preventDefault();let a=i.x+i.deltaX;this.move(a,s,e,o)},touchend(t,e,o){let s=t.instance,n=s.getDataset().disabled,i=o.state;n=this.getDisabledType(n),n||this.moveDirection(i.left,s,e,o)},move(t,e,o,s){t=t||0;let n=s.state,i=n.leftWidth,a=n.rightWidth;n.left=this.range(t,-a,i),e.requestAnimationFrame((function(){e.setStyle({transform:"translateX("+n.left+"px)","-webkit-transform":"translateX("+n.left+"px)"})}))},getDom(t,e,o){var s=o.state,n=e.$el||e.$vm&&e.$vm.$el,i=n.querySelector(".button-group--left"),a=n.querySelector(".button-group--right");s.leftWidth=i.offsetWidth||0,s.rightWidth=a.offsetWidth||0,s.threshold=t.getDataset().threshold},getDisabledType:t=>("string"==typeof t?JSON.parse(t):t)||!1,range:(t,e,o)=>Math.min(Math.max(t,e),o),moveDirection(t,e,o,s){var n=s.state,i=n.threshold;n.position;var a=n.isopen||"none",r=n.leftWidth,h=n.rightWidth;0!==n.deltaX?"none"===a&&h>0&&-t>i||"none"!==a&&h>0&&h+t<i?this.openState("right",e,o,s):"none"===a&&r>0&&t>i||"none"!==a&&r>0&&r-t<i?this.openState("left",e,o,s):this.openState("none",e,o,s):this.openState("none",e,o,s)},openState(t,e,o,s){let n=s.state,i=n.leftWidth,a=n.rightWidth,r="";switch(n.isopen=n.isopen?n.isopen:"none",t){case"left":r=i;break;case"right":r=-a;break;default:r=0}n.isopen!==t&&(n.throttle=!0,o.callMethod("change",{open:t})),n.isopen=t,e.requestAnimationFrame((()=>{e.addClass("ani"),this.move(r,e,o,s)}))},getDirection:(t,e)=>t>e&&t>10?"horizontal":e>t&&e>10?"vertical":"",resetTouchStatus(t,e){let o=e.state;o.direction="",o.deltaX=0,o.deltaY=0,o.offsetX=0,o.offsetY=0},stopTouchStart(t,e,o){let s=t.instance,n=o.state;this.resetTouchStatus(s,o);var i=t.touches[0];n.startX=i.clientX,n.startY=i.clientY},stopTouchMove(t,e){t.instance;let o=e.state,s=t.touches[0];o.deltaX=s.clientX-o.startX,o.deltaY=s.clientY-o.startY,o.offsetY=Math.abs(o.deltaY),o.offsetX=Math.abs(o.deltaX),o.direction=o.direction||this.getDirection(o.offsetX,o.offsetY)}},W={mounted(t,e,o){this.state={}},methods:{showWatch(t,e,o,s){$.showWatch(t,e,o,s,this)},touchstart(t,e){$.touchstart(t,e,this)},touchmove(t,e){$.touchmove(t,e,this)},touchend(t,e){$.touchend(t,e,this)}}},F=t=>{t.$renderjs||(t.$renderjs=[]),t.$renderjs.push("renderswipe"),t.mixins||(t.mixins=[]),t.mixins.push({beforeCreate(){this.renderswipe=this},mounted(){this.$ownerInstance=this.$gcd(this,!0)}}),t.mixins.push(W)},Y={mixins:[g,{},{}],emits:["click","change"],props:{show:{type:String,default:"none"},disabled:{type:Boolean,default:!1},autoClose:{type:Boolean,default:!0},threshold:{type:Number,default:20},leftOptions:{type:Array,default:()=>[]},rightOptions:{type:Array,default:()=>[]}},unmounted(){this.__isUnmounted=!0,this.uninstall()},methods:{uninstall(){this.swipeaction&&this.swipeaction.children.forEach(((t,e)=>{t===this&&this.swipeaction.children.splice(e,1)}))},getSwipeAction(t="uniSwipeAction"){let e=this.$parent,o=e.$options.name;for(;o!==t;){if(e=e.$parent,!e)return!1;o=e.$options.name}return e}}};D(Y),F(Y);const A=f(Y,[["render",function(f,g,m,w,v,b){const y=d,S=p;return t(),e(S,{class:"uni-swipe"},{default:o((()=>[s(S,{class:"uni-swipe_box","change:prop":f.wxsswipe.showWatch,prop:f.is_show,"data-threshold":m.threshold,"data-disabled":m.disabled,onTouchstart:f.wxsswipe.touchstart,onTouchmove:f.wxsswipe.touchmove,onTouchend:f.wxsswipe.touchend},{default:o((()=>[s(S,{class:"uni-swipe_button-group button-group--left"},{default:o((()=>[n(f.$slots,"left",{},(()=>[(t(!0),i(a,null,r(m.leftOptions,((n,i)=>(t(),e(S,{key:i,style:h({backgroundColor:n.style&&n.style.backgroundColor?n.style.backgroundColor:"#C7C6CD"}),class:"uni-swipe_button button-hock",onTouchstart:l(f.appTouchStart,["stop"]),onTouchend:l((t=>f.appTouchEnd(t,i,n,"left")),["stop"]),onClick:l((t=>f.onClickForPC(i,n,"left")),["stop"])},{default:o((()=>[s(y,{class:"uni-swipe_button-text",style:h({color:n.style&&n.style.color?n.style.color:"#FFFFFF",fontSize:n.style&&n.style.fontSize?n.style.fontSize:"16px"})},{default:o((()=>[c(u(n.text),1)])),_:2},1032,["style"])])),_:2},1032,["style","onTouchstart","onTouchend","onClick"])))),128))]),!0)])),_:3}),s(S,{class:"uni-swipe_text--center"},{default:o((()=>[n(f.$slots,"default",{},void 0,!0)])),_:3}),s(S,{class:"uni-swipe_button-group button-group--right"},{default:o((()=>[n(f.$slots,"right",{},(()=>[(t(!0),i(a,null,r(m.rightOptions,((n,i)=>(t(),e(S,{key:i,style:h({backgroundColor:n.style&&n.style.backgroundColor?n.style.backgroundColor:"#C7C6CD"}),class:"uni-swipe_button button-hock",onTouchstart:l(f.appTouchStart,["stop"]),onTouchend:l((t=>f.appTouchEnd(t,i,n,"right")),["stop"]),onClick:l((t=>f.onClickForPC(i,n,"right")),["stop"])},{default:o((()=>[s(y,{class:"uni-swipe_button-text",style:h({color:n.style&&n.style.color?n.style.color:"#FFFFFF",fontSize:n.style&&n.style.fontSize?n.style.fontSize:"16px"})},{default:o((()=>[c(u(n.text),1)])),_:2},1032,["style"])])),_:2},1032,["style","onTouchstart","onTouchend","onClick"])))),128))]),!0)])),_:3})])),_:3},8,["change:prop","prop","data-threshold","data-disabled","onTouchstart","onTouchmove","onTouchend"])])),_:3})}],["__scopeId","data-v-b7fe1903"]]);const M=f({name:"uniSwipeAction",data:()=>({}),created(){this.children=[]},methods:{resize(){},closeAll(){this.children.forEach((t=>{t.is_show="none"}))},closeOther(t){this.openItem&&this.openItem!==t&&(this.openItem.is_show="none"),this.openItem=t}}},[["render",function(s,i,a,r,h,l){const c=p;return t(),e(c,null,{default:o((()=>[n(s.$slots,"default")])),_:3})}]]);export{A as _,M as a};
