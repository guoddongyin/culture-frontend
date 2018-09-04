import Vue from 'vue'
import VueRouter from 'vue-router'
import { JsBridge } from "../jsbridge/jsbridge"


Vue.use(VueRouter)

let router = new VueRouter({
    routes: [ {
        path: '/',
        redirect: '/Home'
    }, {
        path: '/Home',
        component: resolve => require(['../view/Home/Home.vue'], resolve),
        name: '首页',
        meta: {
            showNav: true
        }
    }, {
        path: '/Users',
        component: resolve => require(['../view/Users/Users.vue'], resolve),
        name: '用户界面',
        meta: {
            showNav: true
        }
    }, {
        path: '/UserInfo/:id',
        component: resolve => require(['../view/Users/UserInfo.vue'], resolve),
        name: '用户信息'
    }, {
        path: '/EditUserInfo/:id',
        component: resolve => require(['../view/Users/EditUserInfo.vue'], resolve),
        name: '修改个人信息',
    }, {
        path: '/News/:id',
        component: resolve => require(['../view/News/News.vue'], resolve),
        name: '消息列表',
        meta: {
            showNav: true
        }
    }, {
        path: '/NewsDetails/:id',
        component: resolve => require(['../view/NewsDetails/NewsDetails.vue'], resolve),
        name: '消息详情页',
    }, {
        path: '/Collection/:id',
        component: resolve => require(['../view/Collection/Collection.vue'], resolve),
        name: '收藏列表',
    }, {
        path: '/Enroll/:id',
        component: resolve => require(['../view/Enroll/Enroll.vue'], resolve),
        name: '报名',
    }, {
        path: '/Help',
        component: resolve => require(['../view/Help/Help.vue'], resolve),
        name: '帮助',
    }, {
        path: '/Integral/:id',
        component: resolve => require(['../view/Integral/Integral.vue'], resolve),
        name: '积分',
    }, {
        path: '/IntegralRule',
        component: resolve => require(['../view/Integral/IntegralRule.vue'], resolve),
        name: '积分规则',
    }, {
        path: '/Login',
        component: resolve => require(['../view/Login/Login.vue'], resolve),
        name: '登录',
    }, {
        path: '/Regsiter',
        component: resolve => require(['../view/Regsiter/Regsiter.vue'], resolve),
        name: '注册',
    }, {
        path: '/Editpwd/:id',
        component: resolve => require(['../view/Editpwd/Editpwd.vue'], resolve),
        name: '修改密码',
    }, {
        path: '/Publicat/:id',
        component: resolve => require(['../view/Appointment/Publicat.vue'], resolve),
        name: '公众用户预约列表',
    }, {
        path: '/Insideat/:id',
        component: resolve => require(['../view/Appointment/Insideat.vue'], resolve),
        name: '基层用户预约列表',
    }, {
        path: '/Activity',
        component: resolve => require(['../view/Activities/Activity.vue'], resolve),
        name: '参加活动',
    }, {
        path: '/Activities/:id',
        component: resolve => require(['../view/Activities/Activities.vue'], resolve),
        name: '活动详情',
    }, {
        path: '/OnlineEnroll/:id',
        component: resolve => require(['../view/Activities/OnlineEnroll.vue'], resolve),
        name: '活动报名',
    }, {
        path: '/Course',
        component: resolve => require(['../view/Course/Course.vue'], resolve),
        name: '享课程',
    }, {
        path: '/Courses/:id',
        component: resolve => require(['../view/Course/Courses.vue'], resolve),
        name: '享课程详情页',
    }, {
        path: '/CourseEnroll/:id',
        component: resolve => require(['../view/Course/CourseEnroll.vue'], resolve),
        name: '享课程报名页',
    }, {
        path: '/Open',
        component: resolve => require(['../view/Open/Open.vue'], resolve),
        name: '开班了',
    }, {
        path: '/VoteList',
        component: resolve => require(['../view/Vote/VoteList.vue'], resolve),
        name: '投票列表',
    }, {
        path: '/VoteId/:id',
        component: resolve => require(['../view/Vote/VoteId.vue'], resolve),
        name: '投票详情页',
    }, {
        path: '/VoteInfo/:id',
        component: resolve => require(['../view/Vote/VoteInfo.vue'], resolve),
        name: '投票作品详情页',
    }, {
        path: '/Exhibition',
        component: resolve => require(['../view/Exhibition/Exhibition.vue'], resolve),
        name: '逛展览',
    }, {
        path: '/ExhibitionDetail/:id',
        component: resolve => require(['../view/Exhibition/ExhibitionDetail.vue'], resolve),
        name: '逛展览详情',
    }, {
        path: '/WorkPage/:id',
        component: resolve => require(['../view/Exhibition/WorkPage.vue'], resolve),
        name: '作品详情页',
    }, {
        path: '/DisList',
        component: resolve => require(['../view/Distribution/DisList.vue'], resolve),
        name: '约配送',
    }, {
        path: '/DisListId/:id',
        component: resolve => require(['../view/Distribution/DisListId.vue'], resolve),
        name: '约配送详情页',
    }, {
        path: '/ToOrder/:id',
        component: resolve => require(['../view/Distribution/ToOrder.vue'], resolve),
        name: '预约申请',
    }, {
        path:'/Order/:id',
        component: resolve=>require(['../view/Appointment/Order.vue'],resolve),
        name:'',
    },{
        path: '/OverOrder/:id',
        component: resolve => require(['../view/Distribution/OvevOrder.vue'], resolve),
        name: '提交预约',
    }, {
        path: '/Creative',
        component: resolve => require(['../view/Works/Creative.vue'], resolve),
        name: '作品征集首页',
    }, {
        path: '/Creatives/:id',
        component: resolve => require(['../view/Works/Creatives.vue'], resolve),
        name: '作品列表详情页',
    }, {
        path: '/WorkInfo/:id',
        component: resolve => require(['../view/Works/WorkInfo.vue'], resolve),
        name: '作品详情页',
    }, {
        path: '/UploadWorks/:id',
        component: resolve => require(['../view/Works/UploadWorks.vue'], resolve),
        name: '作品上传',
    }, {
        path: '/TypeOne/:id',
        component: resolve => require(['../view/Type/TypeOne.vue'], resolve),
        name: '验票1',
    }, {
        path: '/TypeTwo/:id',
        component: resolve => require(['../view/Type/TypeTwo.vue'], resolve),
        name: '验票2',
    }, {
        path: '/wechatLogin/:id',
        component: resolve => require(['../view/wechatLogin/wechatLogin.vue'], resolve),
        name: '微信登录',
    }, {
        path: '/itemInfo/:id',
        component: resolve => require(['../view/itemInfo/itemInfo.vue'], resolve),
        name: '产品详情',
    }]
})

// 获取url中的参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg);  //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}

//路由钩子，判断是否登录，如果没有登录，就返回登录页面
router.beforeEach((to, from, next) => {
    var ua = window.navigator.userAgent.toLowerCase();
    // var isWx = ua.match(/MicroMessenger/i) == 'micromessenger'||ua!=='culturalapp';
    var noAuth = to.path.indexOf('/wechatLogin/')===-1&&to.path.indexOf('/WorkInfo/')===-1&&to.path.indexOf('/WorkPage/')===-1&&to.path.indexOf('/VoteInfo/')===-1&&to.path != '/Home' && to.path!='/Login' && to.path!='/Activity'&& to.path!='/Course'&& to.path!='/Exhibition'&& to.path!='/DisList'&& to.path!='/Open'&& to.path!='/Creative'&& to.path!='/VoteList' && to.path!='/Regsiter'&& to.path.indexOf('/Activities/')===-1 && to.path.indexOf('/Courses/')===-1 && to.path.indexOf('/ExhibitionDetail/')===-1 && to.path.indexOf('/DisListId/')===-1 && to.path.indexOf('/Creatives/')===-1 && to.path.indexOf('/VoteId/')===-1
  if (IS_WX) {
        // 微信方法
        let userInfo = localStorage.getItem('userInfo');
        global.USERINFO = JSON.parse(userInfo)
        // console.log(userInfo)
        if (!userInfo && noAuth) {
            next({ path: '/Login' })
        } else {
            next();
        }
        //获取openid
        if(getUrlParam("code")){

        }
    } else{
        let data = ''
        JsBridge.callHandler(
            'getUserInfo',
            data,
            function (responseData) {
                global.USERINFO = JSON.parse(responseData)
                if (responseData==='null' && noAuth) {
                    next({path:'/Login'})
                } else {
                    next();
                }
            }
        )
    }

});

export default router
