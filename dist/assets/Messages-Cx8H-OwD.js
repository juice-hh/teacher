import{o,c as r,b as s,w as l,r as i,D as f,a as n,h as c,j as p,M as u,F as T,p as U,R as H,C as J,q as _,f as K,a5 as Q,y as C,n as W,a6 as X,a7 as Y,O as $}from"./index-BQs85f6M.js";import{_ as Z}from"./_plugin-vue_export-helper-DlAUqK2U.js";const ee={class:"messages"},te={class:"card-header"},ae={class:"tab-label"},ne={class:"tab-label"},le={class:"message-list"},se=["onClick"],oe={class:"message-icon"},ie={class:"message-content"},de={class:"message-header"},ue={class:"message-title"},re={class:"message-time"},ce={class:"message-preview"},pe={key:0,class:"pagination"},_e={key:0,class:"message-detail"},ve={class:"detail-meta"},me={class:"meta-time"},fe={class:"detail-content"},ge={key:1,class:"detail-attachments"},ye={class:"attachment-list"},be={__name:"Messages",setup(he){const v=f("all"),g=f(!1),d=f(null),m=f({page:1,size:10}),y=f([{id:1,type:"评价通知",title:"2024年度教师自评开始",preview:"请于2024年3月31日前完成年度自我评价，逾期将影响考核...",content:`尊敬的老师：

2024年度教师自评工作现已开始，请您于2024年3月31日前登录系统完成自我评价。

评价内容包括：
1. 教学态度（20分）
2. 教学方法（25分）
3. 育人成效（25分）
4. 专业发展（20分）
5. 社会服务（10分）

请注意：逾期未完成将影响您的年度考核结果。

如有疑问，请联系教务处。`,time:"2小时前",read:!1,attachments:[]},{id:2,type:"评价通知",title:"同行评审任务分配通知",preview:"您已被分配对李老师、王老师进行同行评审，请在截止日期前完成...",content:`尊敬的老师：

您已被分配以下同行评审任务：

1. 李老师（数学学院）- 截止日期：2024-03-20
2. 王老师（英语学院）- 截止日期：2024-03-25

请客观公正地完成评审工作。`,time:"1天前",read:!1,attachments:[]},{id:3,type:"系统通知",title:"系统维护通知",preview:"系统将于2月25日凌晨2:00-4:00进行维护，届时将无法访问...",content:`尊敬的用户：

为了提供更好的服务，系统将于2024年2月25日凌晨2:00-4:00进行系统维护和升级。

维护期间系统将无法访问，请您提前安排好相关工作。

给您带来的不便，敬请谅解。`,time:"3天前",read:!0,attachments:[]},{id:4,type:"系统通知",title:"评分标准更新说明",preview:"根据学校要求，本次评价指标体系进行了以下调整，请仔细阅读...",content:`各位老师：

根据学校最新要求，本次评价指标体系进行了以下调整：

1. 教学方法指标分值由20分调整为25分
2. 新增信息技术应用作为评分参考项
3. 科研成果认定标准更新

详情请查看系统中的评价指标说明。`,time:"5天前",read:!0,attachments:["评分标准更新说明.pdf","评价指标体系2024版.docx"]},{id:5,type:"评价通知",title:"评价结果已公布",preview:"2023年度教师评价结果已公布，恭喜您获得优秀等级...",content:`尊敬的老师：

2023年度教师评价工作已结束，您的评价结果已公布。

总分：91.0分
排名：10/128
等级：优秀

感谢您在过去一年中的辛勤付出！`,time:"1周前",read:!0,attachments:[]}]),w=C(()=>y.value.length),k=C(()=>y.value.filter(t=>!t.read).length),b=C(()=>{let t=y.value;return v.value==="unread"?t=t.filter(e=>!e.read):v.value==="system"?t=t.filter(e=>e.type==="系统通知"):v.value==="evaluation"&&(t=t.filter(e=>e.type==="评价通知")),t});function E(t){return t==="系统通知"?W:t==="评价通知"?X:Y}function I(t){return t==="系统通知"?"#1890ff":t==="评价通知"?"#52c41a":"#faad14"}function A(){m.value.page=1}function F(t){d.value=t,t.read=!0,g.value=!0}function R(){y.value.forEach(t=>t.read=!0),$.success("已全部标记为已读")}function S(t){$.success(`正在下载：${t}`)}return(t,e)=>{var D;const z=i("el-button"),V=i("el-badge"),h=i("el-tab-pane"),j=i("el-tabs"),M=i("el-icon"),x=i("el-tag"),q=i("el-empty"),L=i("el-pagination"),O=i("el-card"),B=i("el-divider"),P=i("el-link"),G=i("el-dialog");return o(),r("div",ee,[s(O,{class:"page-card",shadow:"hover"},{header:l(()=>[n("div",te,[e[6]||(e[6]=n("span",{class:"card-title"},"消息中心",-1)),s(z,{onClick:R,disabled:k.value===0},{default:l(()=>[...e[5]||(e[5]=[c(" 全部标为已读 ",-1)])]),_:1},8,["disabled"])])]),default:l(()=>[s(j,{modelValue:v.value,"onUpdate:modelValue":e[0]||(e[0]=a=>v.value=a),onTabChange:A},{default:l(()=>[s(h,{name:"all"},{label:l(()=>[n("span",ae,[e[7]||(e[7]=c(" 全部消息 ",-1)),w.value>0?(o(),p(V,{key:0,value:w.value},null,8,["value"])):u("",!0)])]),_:1}),s(h,{name:"unread"},{label:l(()=>[n("span",ne,[e[8]||(e[8]=c(" 未读消息 ",-1)),k.value>0?(o(),p(V,{key:0,value:k.value},null,8,["value"])):u("",!0)])]),_:1}),s(h,{name:"system"},{label:l(()=>[...e[9]||(e[9]=[n("span",{class:"tab-label"},"系统通知",-1)])]),_:1}),s(h,{name:"evaluation"},{label:l(()=>[...e[10]||(e[10]=[n("span",{class:"tab-label"},"评价通知",-1)])]),_:1})]),_:1},8,["modelValue"]),n("div",le,[(o(!0),r(T,null,U(b.value,a=>(o(),r("div",{class:H(["message-item",{unread:!a.read}]),key:a.id,onClick:N=>F(a)},[n("div",oe,[s(M,{size:20,color:I(a.type)},{default:l(()=>[(o(),p(J(E(a.type))))]),_:2},1032,["color"])]),n("div",ie,[n("div",de,[n("span",ue,_(a.title),1),n("span",re,_(a.time),1)]),n("div",ce,_(a.preview),1),a.read?u("",!0):(o(),p(x,{key:0,size:"small",type:"danger"},{default:l(()=>[...e[11]||(e[11]=[c("未读",-1)])]),_:1}))])],10,se))),128)),b.value.length===0?(o(),p(q,{key:0,description:"暂无消息"})):u("",!0)]),b.value.length>0?(o(),r("div",pe,[s(L,{"current-page":m.value.page,"onUpdate:currentPage":e[1]||(e[1]=a=>m.value.page=a),"page-size":m.value.size,"onUpdate:pageSize":e[2]||(e[2]=a=>m.value.size=a),"page-sizes":[10,20,50],total:b.value.length,layout:"total, sizes, prev, pager, next"},null,8,["current-page","page-size","total"])])):u("",!0)]),_:1}),s(G,{modelValue:g.value,"onUpdate:modelValue":e[4]||(e[4]=a=>g.value=a),title:(D=d.value)==null?void 0:D.title,width:"600px"},{footer:l(()=>[s(z,{onClick:e[3]||(e[3]=a=>g.value=!1)},{default:l(()=>[...e[13]||(e[13]=[c("关闭",-1)])]),_:1})]),default:l(()=>[d.value?(o(),r("div",_e,[n("div",ve,[s(x,{size:"small"},{default:l(()=>[c(_(d.value.type),1)]),_:1}),n("span",me,_(d.value.time),1)]),s(B),n("div",fe,_(d.value.content),1),d.value.attachments&&d.value.attachments.length>0?(o(),p(B,{key:0})):u("",!0),d.value.attachments&&d.value.attachments.length>0?(o(),r("div",ge,[e[12]||(e[12]=n("div",{class:"attachment-title"},"附件：",-1)),n("div",ye,[(o(!0),r(T,null,U(d.value.attachments,(a,N)=>(o(),p(P,{key:N,type:"primary",underline:!1,onClick:ke=>S(a)},{default:l(()=>[s(M,null,{default:l(()=>[s(K(Q))]),_:1}),c(" "+_(a),1)]),_:2},1032,["onClick"]))),128))])])):u("",!0)])):u("",!0)]),_:1},8,["modelValue","title"])])}}},ze=Z(be,[["__scopeId","data-v-93a41e35"]]);export{ze as default};
