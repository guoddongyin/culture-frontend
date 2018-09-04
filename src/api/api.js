import axios from 'axios'
import { JsBridge } from "../jsbridge/jsbridge"

axios.defaults.withCredentials = true;


//接口路径
// let base = 'http://192.168.2.11/';
// 区分开发环境(development)的域名和生产环境(production)的域名

  //let base = process.env.NODE_ENV === 'development' ? '/new/api/culture-app-gateway' : 'https://www.culturetest.com/culture-app';
 //let base = process.env.NODE_ENV === 'development' ? '/new/api/culture-app-gateway' : 'http://192.168.2.11/culture-app-gateway';
//let base = process.env.NODE_ENV === 'development' ? '/new/api/culture-app-gateway' : 'http://culture.gec123.com:86/culture-app';
//正式
//let commonPath='https://www.cqqyg.cn';
//gec123
//let commonPath='http://culture.gec123.com:86';
//测试
let commonPath='http://www.culturetest.com';
let base = process.env.NODE_ENV === 'development' ? '/new/api/culture-app-gateway' : commonPath+'/culture-app';
let authPath=commonPath+'/h5/';
let nginxPath=commonPath;
// 上传接口
const uploadUrl = process.env.NODE_ENV === 'development' ? '/new/api/culture' : 'http://www.culturetest.com/culture';
//const uploadUrl = process.env.NODE_ENV === 'development' ? '/new/api/culture' : 'http://culture.gec123.com:86/culture'
//const uploadUrl = process.env.NODE_ENV === 'development' ? '/new/api/culture' : 'wlw.cqqyg.cn/culture';
const imgUrl = process.env.NODE_ENV === 'development' ? '/new/api/' : commonPath+'/';
// 正式

//内外测试
//let base = process.env.NODE_ENV === 'development' ? '/new/api/culture-app-gateway' : 'https://www.culture.com/culture-app';
//正式

//内外测试
//let authPath='https://www.culture.com/h5/';
//let authPath='http://culture.gec123.com:86/h5/';
//let authPath='https://www.culturetest.com/h5/';
//正式
//内外测试
//let nginxPath='https://www.culture.com';
//let nginxPath='http://culture.gec123.com:86';
//let nginxPath='https://www.culturetest.com/';

// 正式

//内外测试
//const uploadUrl = process.env.NODE_ENV === 'development' ? '/new/api/culture' : 'https://www.culture.com/culture'


// 图片路径
  //const imgUrl = process.env.NODE_ENV === 'development' ? '/new/api/' : 'https://www.culturetest.com/'
//const imgUrl = process.env.NODE_ENV === 'development' ? '/new/api/' : 'http://culture.gec123.com:86/'
// 正式
//内外测试
//const imgUrl = process.env.NODE_ENV === 'development' ? '/new/api/' : 'https://www.culture.com/'

//全局链接
global.LIVEPATH=commonPath;
global.URL = imgUrl;
global.upUrl=base;
global.upImg=uploadUrl;
global.authPath=authPath;
global.isAll=false;
global.CITYNAME='全市';
global.CITYAREA='市  级';
global.isStateOne=false; //是否是活动接收
global.isAuth=false; //是否是活动接收

//是否需要userAgent
var isUserAgent=false;

// 全局判断客户端
var isWx=true;
var ua = window.navigator.userAgent.toLowerCase();
if(isUserAgent){
	if(ua){
		isWx=ua.match(/MicroMessenger/i) == 'micromessenger'||ua.indexOf('culturalapp')===-1;
	}
}else{
    isWx = ua.match(/MicroMessenger/i) == 'micromessenger';
}
global.IS_WX = isWx;
global.IS_USERAGENT=isUserAgent;
// if (isWx) {
//     var u = localStorage.getItem('userInfo')
//     global.USERINFO = JSON.parse(u)
//     console.log(JSON.parse(u))
// } else {
//     var data = ''
// 	console.log("ffgggfff")
//     JsBridge.callHandler(
//         'getUserInfo',
//         data,
//         function (responseData) {
//             global.USERINFO = JSON.parse(responseData)
//         }
//     )
// }

// 全局点赞模块
global.InfoSource = {
    FREEITEMS: 0,            // 免费开放项目
    ACTIVITY: 1,             // 活动预告
    EXHIBITIONHISTORY: 5,    // 展览历史
    EXHIBITIONDETAIL: 6,     // 展览作品
    NETGAMES: 10,            // 征集作品
    FREE_RESOURCE: 20,       // 自由投稿
    SPECIAL_RESOURCE: 21,    // 专题作品
    RESOURCE_TYPE_VIDEO:1001,   // 视频资源
    RESOURCE_TYPE_MUSIC:1002,   // 音频资源
    RESOURCE_TYPE_IMAGE:1003,   // 图片资源
    RESOURCE_TYPE_LITERATURE:1004,  //文学资源
    RESOURCE_UPCHANNEL_SPECIAL:3001,    // 专题作品征集
    RESOURCE_UPCHANNEL_FREE:3002,       // 公众自由投稿
}

// http请求拦截器
axios.interceptors.request.use(config => {
    // console.log('请求拦截')
    if (config.status === 401) {
        if (config.url.indexOf('unreadCount') < 1) {
            IS_WX ? localStorage.clear() : JsBridge.callHandler('clearUserInfo', '', (res) => {
              channelCancel().then(res => {
                self.$router.push('/Home')
              }).catch(err => {
                console.log(err.response)
              })
            })
        }
    }
    return config
}, error => {
    // console.log('请求错误')
    // console.log(error)
    return Promise.reject(error)
});

// http响应拦截器
axios.interceptors.response.use(res => {
    // console.log('响应拦截')
    return res
}, error => {
    // console.log('响应错误')
    // console.log(error)
    Promise.reject(error).then(res=>{

    }, err=>{
      if(err.response.status==401){
        IS_WX ? localStorage.clear() : JsBridge.callHandler('clearUserInfo', '', (res) => {
        })
      }
    });
    return Promise.reject(error)
})


//验证是否账号合并
export const valphone = phone => {
    return axios.get(`${base}/wiki/valphone?openid=${phone}`)
        .then(res => res.data);
};

//验证手机号是否注册过
export const valphones = phone => {
    return axios.post(`${base}/user/valphone/${phone}`)
        .then(res => res.data);
};

//发送短信
export const sendmsg = (phone, title,type,relid) => {
    return axios.get(`${base}/user/sendmsg/${phone}?type=${type}&relid=${relid}`)
        .then(res => res);
};

//验证短信
export const valsendmsg = (phone, code) => {
    return axios.get(`${base}/user/valsendmsg/` + phone + `/` + code)
        .then(res => res.data);
};

//用户注册
export const reg = params => {
    return axios.post(`${base}/user/reg`, params)
        .then(res => res.data);
};

//忘记密码
export const forgetpwd = (phone, params) => {
    return axios.post(`${base}/user/forgetpwd/${phone}`, params)
        .then(res => res.data);
};


export const login = params => {
    return axios.post(`${base}/tokens`, params)
        .then(res => res.data);
};

// 获取登录用户详细
export const userInfo = params => {
    return axios.get(`${base}/user/info`, params)
        .then(res => res.data);
};

// 合并登录用户
export const mergeUser = (openid,phone,params) => {
    return axios.get(`${base}/wiki/merge-u?openid=`+openid+"&phone="+phone, params)
        .then(res => res.data);
};

// 获取openid
export const openUser = (openid,status,params) => {
    return axios.get(`${base}/wiki/open?code=`+openid+"&state="+status, params)
        .then(res => res.data);
};

// 获取登录用户详细
export const wxlogin = (openid,params) => {
    return axios.patch(`${base}/tokens/${openid}/open`, params)
        .then(res => res.data);
};

// 获取用户总积分
export const allintegral = () => {
    return axios.get(`${base}/integral/count`)
        .then(res => res.data);
};

// 获取用户积分详情
export const integral = (id, page, size) => {
    return axios.get(`${base}/integral?userid=${id}&timeState=2&offset=${page}&limit=${size}&count=true`)
        .then(res => res);
};
//获取区域名称及ID
export const area = areaId => {
    return axios.get(`${base}/area/${areaId}`)
        .then(res => res.data);
};

// 首页获取市级
export const areas = areaId => {
    return axios.get(`${base}/area/${areaId}?isshowparent=1`)
        .then(res => res.data);
};

//获取首页推荐数据
export const recommend = areaId => {
    return axios.get(`${base}/activity/recommend?addAreaId=${areaId}`)
        .then(res => res.data);
};

// 获取参活动 预告列表
export const activity = (key,type, shape, sortType, addAreaId, startTime,endTime,enrollTime,enrollWay, offset, limit) => {
	if(enrollWay==1) {
		return axios.get(`${base}/activity/home?keyWord=${key}&type=${type}&shape=${shape}&sortType=${sortType}&addAreaId=${addAreaId}&startTime=${startTime}&endTime=${endTime}&enrollTime=${enrollTime}&enrollWay=${enrollWay}&offset=${offset}&limit=${limit}`)
		  .then(res => res);
	}else{
		return axios.get(`${base}/activity/home?keyWord=${key}&type=${type}&shape=${shape}&sortType=${sortType}&addAreaId=${addAreaId}&startTime=${startTime}&endTime=${endTime}&enrollTime=${enrollTime}&offset=${offset}&limit=${limit}`)
		  .then(res => res);
    }
};

// 获取参活动 关键词搜索 预告列表
export const activityKey = (key,type, shape, sortType, addAreaId, startTime,endTime,enrollTime,enrollWay, offset, limit) => {
    if(enrollWay==1){
	    return axios.get(`${base}/activity/home?keyWord=${key}&type=${type}&shape=${shape}&sortType=${sortType}&addAreaId=${addAreaId}&startTime=${startTime}&endTime=${endTime}&enrollTime=${enrollTime}&enrollWay=${enrollWay}&offset=${offset}&limit=${limit}`)
	      .then(res => res);
    }else{
	    return axios.get(`${base}/activity/home?keyWord=${key}&type=${type}&shape=${shape}&sortType=${sortType}&addAreaId=${addAreaId}&startTime=${startTime}&endTime=${endTime}&enrollTime=${enrollTime}&offset=${offset}&limit=${limit}`)
	      .then(res => res);
    }
};

// 通过ID获取 参活动 详情页
export const activities = id => {
    return axios.get(`${base}/activity/${id}/show`)
        .then(res => res.data);
};

// 根据活动标识和电话获取报名信息 验证是否报名
export const isenroll = (id, phone) => {
    return axios.get(`${base}/enroll/isenroll?activityId=${id}&phone=${phone}`)
        .then(res => res.data);
};

// 根据主键获取报名
export const getEnrollInfoById = id => {
    return axios.get(`${base}/enroll/${id}`)
        .then(res => res.data);
};

// 确认到场状态
export const affirm = (id, params) => {
    return axios.patch(`${base}/enroll/${id}/affirm`, params)
        .then(res => res.data);
};

// 获取资源浏览量，分享量，点赞量，收藏量
export const viewcount = (id, source) => {
    return axios.get(`${base}/viewcount/${id}?source=${source}`)
        .then(res => res.data);
};

// 验证用户是否点过赞
export const checkUserPraise = (reloId, userId) => {
    return axios.get(`${base}/praises/checkUserPraise?reloId=${reloId}&userId=${userId}`)
        .then(res => res.data);
};

// 新增点赞
export const praises = params => {
    return axios.post(`${base}/praises`, params)
        .then(res => res.data);
};

// 取消点赞
export const cancelPraiseFront = (reloId, userId,) => {
    return axios.patch(`${base}/praises/cancelPraiseFront?reloId=${reloId}&userId=${userId}`)
        .then(res => res.data);
};

// 验证用户是否收藏过:true已收藏，false未收藏
export const isCollection = id => {
    return axios.get(`${base}/collection/checkUserCollection?reloId=${id}`)
        .then(res => res.data);
};

// 新增收藏
export const addCollection = params => {
    return axios.post(`${base}/collection`, params)
        .then(res => res.data);
};

// 取消收藏
export const deleteCollection = id => {
    return axios.patch(`${base}/collection/cancelCollectionFront?reloId=${id}`)
        .then(res => res.data);
};

// 报名(活动)
export const activityEnroll = params => {
    return axios.post(`${base}/enroll/activity`, params)
        .then(res => res.data);
};

// 报名(培训)
export const courseEnroll = params => {
    return axios.post(`${base}/enroll`, params)
        .then(res => res.data);
};

//获取活动形式一级分类
export const restype = params => {
    return axios.get(`${base}/restype`, params)
        .then(res => res.data);
};

//获取艺术门类数据 code等于011 获取所有
export const basecode = params => {
    return axios.get(`${base}/basecode/${params}`)
        .then(res => res.data);
};

// 获取基础数据
export const basecodeOne = params => {
    return axios.get(`${base}/basecode/one/${params}`)
        .then(res => res.data);
};

// 获取已报名人数
export const enrollnum = id => {
    return axios.get(`${base}/enroll/enrollnum?activityId=${id}`)
        .then(res => res.data);
};

// 用户行为 新增评论
export const addevaluation = params => {
    return axios.post(`${base}/evaluation`, params)
        .then(res => res.data);
};

// 用户行为 获取资源的评论列表
export const getResourceEvaluationList = (id, offset,limit, count) => {
    return axios.get(`${base}/evaluation/getResourceEvaluationList?reloId=${id}&limit=${limit}&count=${count}&offset=${offset}`)
        .then(res => res.data);
};

// 用户获取个人信息
export const getUserInfo = id => {
    return axios.get(`${base}/user/info-web/${id}`)
        .then(res => res.data);
};

// 用户修改个人信息
export const editUserInfo = params => {
    return axios.put(`${base}/user/info`, params)
        .then(res => res.data);
};

// 获取当前用户积分
export const getUserCount = () => {
    return axios.get(`${base}/integral/count`)
        .then(res => res.data);
};

// 用户收藏列表
export const collection = (userid, offset, limit, count) => {
    return axios.get(`${base}/collection?userid=${userid}&offset=${offset}&limit=${limit}&count=${count}`)
        .then(res => res);
};

// 用户已报名列表
export const myEnroll = (userid, offset, limit, count) => {
    return axios.get(`${base}/enroll/my?userId=${userid}&offset=${offset}&limit=${limit}&queryCount=${count}`)
        .then(res => res);
};

// 用户 取消报名
export const enrollCancel = (id, params) => {
    return axios.patch(`${base}/enroll/${id}/cancel`, params)
        .then(res => res.data);
};


// 登录用户修改密码
export const changepwd = params => {
    return axios.put(`${base}/user/changepwd`, params)
        .then(res => res.data);
};

// 获取所有 免费开放项目列表
export const allFreeItems = (limit, allCount, areaId) => {
    return axios.get(`${base}/freeitems/detail/search?limit=${limit}&queryCount=${allCount}&areaid=${areaId}`)
        .then(res => res.data);
};

// 根据选项获取 免费开放项目列表
export const freeItems = (keyword,areaid, starttime, endtime, artType, offset, limit, allCount,signupstarttime,searchtype) => {
    return axios.get(`${base}/freeitems/detail/search?keyword=${keyword}&offset=${offset}&limit=${limit}&queryCount=${allCount}&areaid=${areaid}&artType=${artType}&starttime=${starttime}&endtime=${endtime}&signupstarttime=${signupstarttime}&searchtype=${searchtype}`)
        .then(res => res.data);
};

// 根据ID获取免费开放项目详细列表
export const freeItemsDetail = id => {
    return axios.get(`${base}/freeitems/detail/${id}`)
        .then(res => res.data);
};

// 获取 网上活动列表
export const works = (id,limit,offset,count) => {
    return axios.get(`${base}/netgames/front?areaId=${id}&limit=${limit}&offset=${offset}&queryCount=${count}`)
        .then(res => res);
};
// 根据 区域ID获取列表
export const frontArea = (id, offset, limit, count,waitState) => {
    return axios.get(`${base}/netgames/front?areaId=${id}&offset=${offset}&limit=${limit}&queryCount=${count}&waitState=${waitState}`)
        .then(res => res);
};

// 根据ID获取网上活动详情
export const workId = id => {
    return axios.get(`${base}/netgames/front/${id}`)
        .then(res => res.data);
};

// 根据ID获取 网上活动详情下 已征集到的作品 列表
export const netGamesResource = (id, limit, count) => {
    return axios.get(`${base}/resources/front/netGamesResource?netGamesID=${id}&limit=${limit}&queryCount=${count}`)
        .then(res => res.data);
};
// 根据ID获取 网上活动详情下 已征集到的作品 列表
export const netGamesResourceSearch = (id, key, limit, count) => {
    return axios.get(`${base}/resources/front/netGamesResource?netGamesID=${id}&keyWord=${key}&limit=${limit}&queryCount=${count}`)
        .then(res => res.data);
};
// 根据ID获取网上活动里作品的详情数据
export const getWorkInfo = id => {
    return axios.get(`${base}/resources/front/${id}`)
        .then(res => res.data);
};

// 获取所有展览历史列表
export const allExhibitioListshow = (areaId, limit, count) => {
    return axios.get(`${base}/exhibition/exhibitioListshow?areaId=${areaId}&limit=${limit}&count=${count}`)
        .then(res => res);
};

// 获取展览历史列表
export const exhibitioListshow = (key, areaId, artType, startTime, endTime, limit, count) => {
    return axios.get(`${base}/exhibition/exhibitioListshow?name=${key}&areaId=${areaId}&artType=${artType}&startTime=${startTime}&endTime=${endTime}&limit=${limit}&offset=${count}`)
        .then(res => res);
};

// 获取展览列表详情页
export const exhibitioshow = id => {
    return axios.get(`${base}/exhibition/${id}/exhibitioshow`)
        .then(res => res.data);
};

// 通过ID获取作品列表
export const edetailAll = (id, limit, count,offset) => {
    return axios.get(`${base}/exhibition/edetail?exhibitionId=${id}&count=${count}&limit=${limit}&offset=${offset}`)
        .then(res => res);
};

// 通过 作品名称 ==》name 获取数据
export const edetailName = (id, name, limit, count) => {
    return axios.get(`${base}/exhibition/edetail?exhibitionId=${id}&name=${name}&limit=${limit}&count=${count}`)
        .then(res => res.data);
};

// 通过作品ID 获取作品详情数据(展览)
export const workShow = id => {
    return axios.get(`${base}/exhibition/edetail/${id}/detailshow`)
        .then(res => res.data);
};

// 获取所有投票列表
export const allVoteList = (areaId, offset, limit, allCount) => {
    return axios.get(`${base}/voting/showList?areaId=${areaId}&offset=${offset}&limit=${limit}&queryCount=${allCount}`)
        .then(res => res);
};

// 投票列表 根据区域获取数据
export const voteList = (id, offset, limit, allCount,voteState) => {
    return axios.get(`${base}/voting/showList?areaId=${id}&offset=${offset}&limit=${limit}&queryCount=${allCount}&voteState=${voteState}`)
        .then(res => res);
};

// 根据ID获取活动投票信息
export const voteId = id => {
    return axios.get(`${base}/voting/${id}/show`)
        .then(res => res.data);
};

// 根据ID获取投票列表
export const activityVoteId = (id,offset, limit, athor) => {
    return axios.get(`${base}/entries/show?activityVoteId=${id}&athor=${athor}&offset=${offset}&limit=${limit}`)
        .then(res => res);
};

// 按标识(id)获取参赛作品信息-前端展示（包含浏览量等）
export const voteInfoId = id => {
    return axios.get(`${base}/entries/${id}/show`)
        .then(res => res.data);
};
// 给参赛作品投票
export const voteDetail = params => {
    return axios.post(`${base}/entries/voteDetail`, params)
        .then(res => res.data);
};

// 约配送列表
export const volsAll = (areaid, key, page, size, order, restype) => {
    return axios.get(`${base}/vols/search?areaid=${areaid}&keyword=${key}&pageindex=${page}&pagesize=${size}&order=${order}&isshowitem=2&restype=${restype}`,)
        .then(res => res);
};

// 获取志愿者详情
export const volsId = id => {
    return axios.get(`${base}/vols/${id}`)
        .then(res => res.data);
};

// 获取产品详情
export const volsItemId = id => {
    return axios.get(`${base}/vols/item/${id}`)
        .then(res => res.data);
};

// 公众用户提交预约
export const userLove = params => {
    return axios.post(`${base}/user/love`, params)
        .then(res => res.data);
};

// 公众用户已提交的申请列表
export const getLove = (index, size) => {
    return axios.get(`${base}/user/love?pageindex=${index}&pagesize=${size}`)
        .then(res => res.data);
};

// 基层用户已提交的申请列表
export const applyWait = (index, size, status) => {
    return axios.get(`${base}/apply/wait?pageindex=${index}&pagesize=${size}&status=${status}`)
        .then(res => res.data);
};

// 获取预约列表各个状态的数量
export const waitcount = () => {
    return axios.get(`${base}/apply/waitcount`)
        .then(res => res.data);
};

// 更换产品
export const changeitemlist = (page, size, volname, itemname) => {
    return axios.get(`${base}/apply/changeitemlist?pageindex=${page}&pagesize=${size}&volname=${volname}&itemname=${itemname}`)
        .then(res => res.data);
};

// 预约选择作品后获取作品联系人
export const itemvol = id => {
    return axios.get(`${base}/apply/itemvol/${id}`)
        .then(res => res.data);
};

// 预约申请初始化
export const applyInit = () => {
    return axios.get(`${base}/apply/init`)
        .then(res => res.data);
};

// 提交预约申请 基层用户
export const apply = (isinit, params) => {
    return axios.post(`${base}/apply?isinit=${isinit}`, params)
        .then(res => res.data);
};

//提交特殊申请
export const applySpecial = (isinit, applyID) => {
    return axios.put(`${base}/apply/complete_ts/${applyID}/${isinit}`)
        .then(res => res.data);
};

// 完成预约
export const applyComplete = (applyid, isinit, itemid, showtime) => {
    return axios.put(`${base}/apply/complete/${applyid}/${isinit}?itemid=${itemid}&showtime=${showtime}`)
        .then(res => res.data);
};

// 状态为3的预约单号完成预约
export const applyShure = (id, params) => {
    return axios.post(`${base}/apply/shure/${id}`, params)
        .then(res => res.data);
};

// 退回申请
export const backApply = id => {
    return axios.put(`${base}/apply/back/${id}`)
        .then(res => res.data);
};

// 已提交的预约详情页
export const applyId = id => {
    return axios.get(`${base}/apply/${id}`)
        .then(res => res.data);
};

// 未接收的预约变为已接收
export const changeViewApply = id => {
    return axios.put(`${base}/apply/changeview/${id}`)
        .then(res => res.data);
};


// 消息列表
export const pushMsg = (offset, limit) => {
    return axios.get(`${base}/message/user/push_msgs?offset=${offset}&limit=${limit}`)
        .then(res => res);
};

// 所有消息
export const allMsg = limit => {
    return axios.get(`${base}/message/user/push_msgs?limit=${limit}`)
        .then(res => res);
};

// 获取未读消息数量
export const unreadCount = () => {
    return axios.get(`${base}/message/user/push_msgs/unreadCount`)
        .then(res => res.data);
};

// 根据ID获取消息详情页
export const msgId = id => {
    return axios.get(`${base}/message/push_msgs/${id}`)
        .then(res => res.data);
};

// 根据ID消除未读消息
export const putMsgId = id => {
    return axios.put(`${base}/message/user/push_msgs/${id}/markRead`)
        .then(res => res.data);
};

// 用户是否关注
export const isFollow = id => {
    return axios.get(`${base}/user/follows/${id}/find`)
        .then(res => res.data);
};

// 新增分享
export const shares = params => {
    return axios.post(`${base}/shares`, params)
        .then(res => res.data);
};

// 添加/取消 关注
export const follows = params => {
    return axios.post(`${base}/user/follows`, params)
        .then(res => res.data);
};

// 专题资源上传
export const addSpecialResource = params => {
    return axios.post(`${base}/resources/addSpecialResource`, params)
        .then(res => res.data);
};

// 资源上传
export const addFreeResource = params=>{
    return axios.post(`${base}/resources/addFreeResource`, params)
        .then(res=>res.data);
};

// 轮播图
export const homeTarget = (id, areaid) => {
    return axios.get(`${base}/propaganda/home?target=${id}&targetAreaId=${areaid}&queryCount=false`)
        .then(res => res.data);
};

// 上传图片
export const uploadImg = params => {
    return axios.post(`${uploadUrl}/loading/img2m`, params)
        .then(res => res.data);
};

// 上传文本
export const uploadTxt = params => {
    return axios.post(`${uploadUrl}/loading/txt20m`, params)
        .then(res => res.data);
};

// 上传视频
export const appupload = params => {
    return axios.post(`${uploadUrl}/upload/appupload`, params)
        .then(res => res.data);
};

// 获取上传token
export const qiniuToken = (type, areaId) => {
    return axios.get(`${base}/qiniu/token?type=${type}&areaId=${areaId}`)
        .then(res => res.data);
};

// 上传到七牛云 视频或音频
export const upQiniu = params => {
    return axios.post(`http://upload-z2.qiniup.com`, params)
        .then(res => res.data);
};

// 判断区域是否可以上传(视频，音频)
export const isUpload=(areaId)=>{
    return axios.get(`${base}/storagespace/canUploadFile/${areaId}`)
}

// 提交审核
export const examineSubmit=(id)=>{
    return axios.patch(`${base}/resources/examineSubmit/${id}`)
        .then(res=>res.data)
}

// 找回密码时发送短信
export const findPwd = (phone,title,type) => {
    return axios.get(`${base}/user/sendmsg/${phone}?type=${type}`,)
        .then(res => res);
};

// 获取活动日历时间
export const dayStart = (id, day, size) => {
    return axios.get(`${base}/activity/start?areaid=${id}&startdate=${day}&pagesize=${size}`)
        .then(res => res.data);
};

// 获取活动最晚时间
export const dayEnd = id => {
    return axios.get(`${base}/activity/enddate?areaid=${id}`)
        .then(res => res.data);
};

// 分享签名
export const wxShare = (time,str,url,openid) => {
    return axios.get(`${base}/wiki/sign?timestamp=${time}&noncestr=${str}&openid=${openid}&url=${url}`)
        .then(res => res.data);
};

// 获取播放url
export const qiniuUrl = id => {
    return axios.get(`${base}/qiniu/url?areaId=${id}`)
        .then(res => res.data);
};

// 获取appid
export const wiki = () => {
    return axios.get(`${base}/wiki`)
        .then(res => res.data);
};

// 获取code
export const wxCode = (url) => {
    return axios.get(`${url}`)
        .then(res => res.data);
};

// 是否评价
export const isEvaluation = (itemid,uid,cid) => {
    return axios.get(`${base}/user/evaluation?itemid=${itemid}&clientid=${cid}&userid=${uid}`)
        .then(res => res.data);
};

// 添加评价
export const postEvaluation = params => {
    return axios.post(`${base}/user/evaluation`,params)
        .then(res => res.data);
};

// 获取参活动 关键词搜索 预告列表
export const freeItemKey = key => {
    return axios.get(`${base}/freeitems/detail/search?limit=10&queryCount=true&keyword=${key}`)
        .then(res => res);
};

// 获取七牛云播放地址
export const qiniuPrefix = id => {
    return axios.get(`${nginxPath}/qiniu-prefix?id=${id}`)
        .then(res => res);
};

//登录推送通道
export const channelLog = (channel_num ,dev_type ,push_user_id) => {
  return axios.post(`${base}/message/user/channel`,{
    channel_num:channel_num,
    dev_type:dev_type,
    push_user_id:push_user_id,
  }).then(res => res);
};

// 注销推送通道
export const channelCancel = () => {
  return axios.delete(`${base}/message/user/channel`)
    .then(res => res);
};

/****************************************************公共方法**********************************************************/

/*********************************************************************************************************************/
