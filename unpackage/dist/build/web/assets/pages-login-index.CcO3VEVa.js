import{s as e,h as a,a as s,b as t,c as n,m as o,r as l,d as c,w as i,i as r,o as u,e as m,f as d,t as g,u as f,g as p,j as _,k as x,I as h,l as b}from"./index-BGMMYpLj.js";import{l as E,g as M,a as T}from"./login.B4FiVUnw.js";import{u as j}from"./user.CJRpAqDR.js";import{_ as v}from"./_plugin-vue_export-helper.BCo6x5W8.js";import"./config.C9WjKJqE.js";const y={msg(a){e({title:a,icon:"none"})},msgError(a){e({title:a,icon:"error"})},msgSuccess(a){e({title:a,icon:"success"})},hideMsg(e){a()},alert(e){s({title:"提示",content:e,showCancel:!1})},confirm:e=>new Promise(((a,t)=>{s({title:"系统提示",content:e,cancelText:"取消",confirmText:"确定",success:function(e){e.confirm&&a(e.confirm)}})})),showToast(a){e("object"==typeof a?a:{title:a,icon:"none",duration:2500})},loading(e){t({title:e,icon:"none"})},closeLoading(){n()}},S=v({__name:"index",setup(e){o();const a=l("MES管理平台"),s=l("欢迎回来，开始工作吧！"),t=l({EmployeeName:"CamstarAdmin",DocManagerUser:"123456"});l([]);const n=j(),v=()=>{""==f(t).username?y.msgError("请输入您的账号"):""===f(t).password?y.msgError("请输入您的密码"):(y.loading("登录中，请耐心等待..."),S())},S=()=>{E(f(t)).then((e=>{const a=e.content;p(a.Token),n.SET_TOKEN(a.Token),w()}))},w=()=>{M().then((e=>{n.SET_NAME(e.content),100200==e.code&&T().then((e=>{const a=e.content.filter((e=>"PDA"==e.MenuName));a.length>0&&n.SET_PERMISSIONS(a[0].childMenu)})),_({url:"/pages/index"})}))};return(e,n)=>{const o=x,l=r,f=h,p=b;return u(),c(l,{class:"normal-login-container"},{default:i((()=>[m(l,{class:"logo-content align-center justify-center flex"},{default:i((()=>[m(o,{class:"img-a",src:"/static/images/b-1.png"}),m(o,{class:"img-b",src:"/static/images/b-2.png"}),m(l,{class:"text"},{default:i((()=>[m(l,{class:"t-b"},{default:i((()=>[d(g(a.value),1)])),_:1}),m(l,{class:"t-b2"},{default:i((()=>[d(g(s.value),1)])),_:1})])),_:1})])),_:1}),m(l,{class:"login-form-content"},{default:i((()=>[m(l,{class:"input-item flex align-center"},{default:i((()=>[m(l,{class:"iconfont icon-user icon"}),m(f,{modelValue:t.value.EmployeeName,"onUpdate:modelValue":n[0]||(n[0]=e=>t.value.EmployeeName=e),class:"input",type:"text",placeholder:"请输入账号",maxlength:"30"},null,8,["modelValue"])])),_:1}),m(l,{class:"input-item flex align-center"},{default:i((()=>[m(l,{class:"iconfont icon-password icon"}),m(f,{modelValue:t.value.DocManagerUser,"onUpdate:modelValue":n[1]||(n[1]=e=>t.value.DocManagerUser=e),type:"password",class:"input",placeholder:"请输入密码",maxlength:"20"},null,8,["modelValue"])])),_:1}),m(l,{class:"action-btn"},{default:i((()=>[m(p,{onClick:v,class:"login-btn cu-btn block bg-blue lg round"},{default:i((()=>[d("登录")])),_:1})])),_:1}),m(l,{class:"xieyi text-center"})])),_:1})])),_:1})}}},[["__scopeId","data-v-a8f339dc"]]);export{S as default};
