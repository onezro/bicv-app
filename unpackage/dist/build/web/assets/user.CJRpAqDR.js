import{aD as a,aE as e,aJ as s,ak as t,r as n,an as o,aK as r}from"./index-BGMMYpLj.js";const u="vuex_name",i="vuex_permissions";let _=["vuex_avatar",u,"vuex_roles",i];const v=function(s,t){if(-1!=_.indexOf(s)){let n=a("storage_data");n=n||{},n[s]=t,e("storage_data",n)}},x=function(e){return(a("storage_data")||{})[e]||""},E=function(){s("storage_data")},c=t("user",(()=>{const a=n(o()),e=n(x(u)),s=n(x(i)),t=e=>{a.value=e},_=a=>{s.value=a,v(i,a)};return{token:a,name:e,permissions:s,SET_TOKEN:t,SET_NAME:a=>{e.value=a,v(u,a)},SET_PERMISSIONS:_,LOGOUT:()=>{t(""),_([]),r(),E()}}}));export{c as u};
