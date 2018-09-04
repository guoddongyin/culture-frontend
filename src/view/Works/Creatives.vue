<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>网上活动</span>
            <div @click="handleOpenEv" class="rights">评一下</div>
        </div>
        <yd-popup v-model="rightPop" position="right" width="80%">
            <div style="font-size: 0.4rem;padding-left: 0.4rem">
                <div style="border-bottom: 1px solid #e5e5e5;padding: 0.1rem 0"
                     v-for="(item,index) in evArr"
                     @click="handleEv(item)"
                     :key="index">{{ item.codeName }}
                </div>
            </div>
        </yd-popup>
        <div id="top" class="homeCenter" :style="2>1?'margin-bottom: 1.16rem':'margin-bottom: 0'">
            <div class="contents" style="background-color: #f5f5f5;">
                <div class="Accontent" style="margin-bottom: 0.2rem">
                    <div class="images">
                        <img v-lazy="url+content.inageUrl" alt="">
                        <span>{{ content.waitState | state }}</span>
                    </div>
                    <div class="title" style="padding-bottom: 0.4rem;border-bottom: 1px solid #e5e5e5">
                        {{ content.subject }}
                    </div>
                    <div class="activitiesTime">
                        <div style="color: #666666">征集时间：{{ content.startTime | times }} 至 {{ content.endTime | times
                            }}
                        </div>
                    </div>
                    <div class="operation">
                        <div class="browse"><i class="iconfont icon-liulan"></i>{{ content.pageviews }}</div>
                        <div @click="handleAddPraises" class="good">
                            <i :class="isZan?'iconfont icon-duduyinleappicon1501':'iconfont icon-dianzan'"></i>
                            {{ content.praises }}
                        </div>
                        <div @click="handleShare" class="share"><i class="iconfont icon-fenxiang"></i>
                            {{ content.shares }}
                        </div>
                        <div @click="handleAddCollection" class="collection">
                            <i :class="isCollection?'iconfont icon-shoucang':'iconfont icon-shoucang1'"></i>
                            {{ content.scount }}
                        </div>
                    </div>
                </div>

            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce">
                    活动介绍
                    <i></i>
                </div>
                <div class="contentIntroduce" v-html="content.introduce">
                </div>
                <div class="contact">
                    <div class="flexBettwens rows">
                        <div>
                            <div style="width: 2rem">主办方：</div>
                            <b>{{ content.sponsor }}</b>
                        </div>
                        <i @click="handleToFollow">{{ isFollow | follow }}</i>
                    </div>
                    <div class="rows">
                        <div style="width: 2rem">联系人：</div>
                        <b>{{ content.linkPerson }}</b>
                    </div>
                    <div class="rows">
                        <div style="width: 2rem">联系方式：</div>
                        <b>{{ content.linkTel }}</b>
                    </div>
                </div>
            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce">
                    参与方式
                    <i></i>
                </div>
                <div class="contentIntroduce" v-html="content.partakeType"></div>
            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce">
                    评选流程
                    <i></i>
                </div>
                <div class="contentIntroduce" v-html="content.aspectsProcesse"></div>
            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce">
                    奖项设置
                    <i></i>
                </div>
                <div class="contentIntroduce" v-html="content.awards"></div>
            </div>
            <div class="activitiesContent" style="padding-left: 0">
                <div class="activitiesIntroduce flexBettwens" style="padding-right: 0.4rem;margin: 0 0 0.4rem 0.4rem;">
                    <div class="flex">
                        已征集作品
                        <i></i>
                    </div>
                    <div class="searchAuth">
                        <input v-model="searchTxt" @input="handleSearch" type="text" placeholder="作者">
                        <span class="iconfont icon-sousuo1"></span>
                    </div>
                </div>
                <div v-if="workArr.length>0" @click="handleWorkInfo(work)" v-for="(work,index) in workArr">
                    <div class="worksImg">
                        <img v-lazy="url+work.imgurl" alt="">
                        <div class="worker">{{ work.addUserName }} {{ Number(work.issureTime) | times }}</div>
                    </div>
                    <div class="worksInfo" style="padding: 0.4rem">
                        <p>{{ work.title }}</p>
                        <div class="flexBettwens">
                            <div class="worksTag">{{ work.artType }}</div>
                            <div class="operation flexBettwens">
                                <div class="browse"><i class="iconfont icon-liulan"></i>{{ work.pageviews }}</div>
                                <div @click="handleAddPraises" class="good">
                                    <i :class="isZan?'iconfont icon-duduyinleappicon1501':'iconfont icon-dianzan'"></i>
                                    {{ work.praises }}
                                </div>
                                <div class="share"><i class="iconfont icon-fenxiang"></i>{{ work.shares }}</div>
                                <div @click="handleAddCollection" class="collection">
                                    <i :class="isCollection?'iconfont icon-shoucang':'iconfont icon-shoucang1'"></i>
                                    {{ work.scount }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="workArr.length===0">
                    <p style="text-align: center">暂无显示</p>
                </div>
            </div>
            <div class="comment">
                <div class="commentName">学员评论 <i></i></div>
                <div class="comments" v-for="(item,index) in comment" :key="index">
                    <div class="commentContent">
                        <img :src="url+item.imageurl" alt="">
                        <div class="commentUser">
                            <span>{{ item.username }}</span>
                            <div>{{ item.opertime | times }}</div>
                        </div>
                    </div>
                    <div class="commentText">
                        {{ item.content }}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="content.waitState===1" @click="handleSubmit" class="bottomBtn">
            我要投稿
        </div>
        <div @click="isShare=false" v-if="isShare" class="shareBg">
            <div class="bg"></div>
            <img :src="wxImg" alt="" width="100%">
        </div>
    </div>
</template>

<script>
    import {
        workId,                                 // 获取数据
        basecode,                               // 获取基础数据 011：艺术分类  019:评论选项
        netGamesResource,                       // 已征集作品列表
        netGamesResourceSearch,                 // 搜索已征集列表
        addevaluation,                          // 新增评论
        getResourceEvaluationList,              // 获取评论列表
        isenroll,                               // 验证是否报名
        checkUserPraise,                        // 验证是否点赞
        praises,                                // 新增点赞
        cancelPraiseFront,                      // 取消点赞
        isCollection,                           // 验证是否收藏
        addCollection,                          // 新增收藏
        deleteCollection,                       // 取消收藏
        isFollow,                               // 是否关注
        follows,                                // 添加/取消 关注
        wxShare,                                // 微信分享签名
        shares,                                // 新增分享
    } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';
    import { JsBridge } from '../../jsbridge/jsbridge';

    export default {
        name: '',
        data() {
            return {
                url: URL,
                rightPop: false,
                content: [],
                serImg: require('../../assets/re1.png'),
                comment: [{
                    avatar: require('../../assets/re2.png'),
                    name: '会做饭的帅小厨',
                    times: '2016-12-12',
                    text: '音乐的整体节奏感很强，尤其是重金属部分感觉 太震撼了。'
                }, {
                    avatar: require('../../assets/re2.png'),
                    name: '会做饭的帅大厨',
                    times: '2016-12-19',
                    text: '音乐的整体节奏感很强，尤其是重金属部分感觉 太震撼对对对了。'
                }],
                baseArr:[],                      // 类型列表
                evArr: [],                       // 评论列表
                workArr:[],                      // 已征集列表
                isFollow: false,                  // 是否关注
                isEnroll: true,                  // 是否报名
                isZan: false,                    // 是否点赞
                isCollection: false,             // 是否收藏
                searchTxt: '',                    // 搜索关键词
                isShare: false,
                wxImg: require('../../assets/ac.png'),
              tempUserID:'',
	            offset:0,
            }
        },
        methods: {
            // 返回
            handleBack() {
                window.history.back()
            },
            // 通过路由传的ID获取详情数据
            getData() {
                Indicator.open()
                let id = this.$route.params.id
                workId(id).then(res => {
                    console.log(res)
                    // 如果需要报名，则显示报名起止时间，并分割字符
                    if (res.enrollWay === 1) {
                        res.enrollStartTime = res.enrollStartTime.split(' ')[0]
                        res.enrollEndTime = res.enrollEndTime.split(' ')[0]
                    }
                    this.content = res
                    // 执行其他方法获取数据
                    if(USERINFO){
                      this.tempUserID=USERINFO.id;
                        this.getEnrollInfo()
                        this.getIsFollow()
                        this.getIsCollection()
                    }else{
                      if(IS_WX){
                        if(localStorage.getItem('tempUserID')){
                          this.tempUserID=localStorage.getItem('tempUserID');
                        }else{
                          this.tempUserID='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                            return v.toString(16);
                          });
                          localStorage.setItem('tempUserID',this.tempUserID);
                        }
                        this.getIsZan()
                      }else {
                        var self=this;
                        JsBridge.callHandler(
                          'getUniqueID',
                          '',
                          function (r) {
                            self.tempUserID=r;
                            self.getIsZan()
                          }
                        )
                      }
                    }
                    this.getBase()
                    this.getEvaluationList()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 查询用户是否关注机构
            getIsFollow() {
                let id = this.content.createrOrg
                isFollow(id).then(res => {

                }).catch(err => {
                    console.log(err.response)
                    if(err.response.data.res===51301){
                        console.log('已关注')
                        this.isFollow = true
                    }else if(err.response.data.res===51302){
                        console.log('未关注')
                        this.isFollow = false
                    }
                })
            },
            // 添加/取消 关注
            handleToFollow() {
                if(USERINFO){
                  Indicator.open();
                    let type = this.isFollow ? -1 : 0
                    let userInfo = USERINFO
                    let params = {
                        clientid: '',
                        id: userInfo.id,
                        orgid: this.content.createrOrg,
                        type: type
                    }
                    follows(params).then(res => {
                      Indicator.close();
                        console.log(res)
                      this.getIsFollow()
                    }).catch(err => {
                      Indicator.close();
                        console.log(err.response)
                    })
                }else {
                    this.$router.push('/Login')
                }
            },
            // 查询用户是否已报名
            getEnrollInfo() {
                let id = this.$route.params.id
                let userInfo = USERINFO
                let phone = userInfo.mobile
                isenroll(id, phone).then(res => {
                    console.log(res)
                    if (res.applyState === 1) {
                        this.isEnroll = false
                    }
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 获取评论资源
            getEvaluationList() {
                let id = this.$route.params.id   // 资源标识
                let limit = 20                    // 返回条数。范围[1,100],缺省20
                let count = true                  // 是否查询总条数.缺省true
                getResourceEvaluationList(id,this.offset ,limit, count).then(res => {
                    console.log(res)
                    this.comment = res
                }).catch(err => {
                    console.log(err.response)
                })
                Indicator.close()
            },
            // 查询用户是否点赞
            getIsZan() {
                checkUserPraise(this.content.oid, this.tempUserID).then(res => {
                    console.log('是否点赞' + res)
                    this.isZan = res
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 新增点赞
            handleAddPraises() {
                let userId = USERINFO?USERINFO.id:this.tempUserID;
                if (this.isZan) {
                    cancelPraiseFront(this.content.oid, userId).then(res => {
                        console.log(res)
                        this.content.praises=Number(this.content.praises)-1
                        this.getIsZan()
                    }).catch(err => {
                        console.log(err.response)
                    })
                } else {
                    let self = this.content
                    let params = {
                        imageurl: self.inageUrl,
                        reloid: self.oid,
                        source: InfoSource.NETGAMES,
                        title: self.subject,
                        url: window.location.href,
                        userid: userId,
                        username: USERINFO?USERINFO.nickname:'',
                    }
                    praises(params).then(res => {
                        console.log(res)
                        this.content.praises=Number(this.content.praises)+1
                        this.getIsZan()
                    }).catch(err => {
                        console.log(err.response)
                    })
                }
            },
            // 新增分享
            handleShare() {
                if(!IS_WX){
                    let data = {
                        title: (this.content.subject||'文化到家'),
                        img: URL + (this.content.inageUrl),
	                    desc:self.content.subject,
                        url: window.location.href.replace('code','none')
                    }
                    JsBridge.callHandler(
                        'share',
                        data,
                        function (r) {
                        }
                    )
                  let self=this;
                  let params = {
                    content: "string",
                    destination: 1,
                    imageurl: URL + self.content.inageUrl,
                    reloid: self.$route.params.id,
                    source: InfoSource.FREE_RESOURCE,
                    title: self.content.subject,
                    url: window.location.href,
                    userid: USERINFO.id,
                    username: USERINFO.username
                  }
                  shares(params).then(res => {
                    console.log(res);
                    setTimeout(function (){
                      self.content.shares++;
                    },1000);
                  }).catch(res=>{
                  })
                }else {
                    this.isShare = true
                }
            },
            // 监听是否分享
            handleShareOver() {
                let data = ''
                let self = this
                JsBridge.registerHandler(
                    'shareOver',
                    data,
                    function (res) {
                        let params = {
                            content: "string",
                            destination: res,
                            imageurl: URL + self.content.cover,
                            reloid: self.$route.params.id,
                            source: InfoSource.ACTIVITY,
                            title: self.content.subject,
                            url: window.location.href,
                            userid: USERINFO.id,
                            username: USERINFO.username
                        }
                        shares(params).then(res => {
                            console.log(res)
                        })
                    }
                )
            },
            // 查询用户是否收藏
            getIsCollection() {
                isCollection(this.content.oid).then(res => {
                    console.log(res)
                    this.isCollection = res
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 新增/取消 收藏
            handleAddCollection() {
                if(USERINFO){
                    if (this.isCollection) {
                        deleteCollection(this.content.oid).then(res => {
                            console.log(res)
                            this.content.scount=Number(this.content.scount-1)
                            this.getIsCollection()
                        }).catch(err => {
                            console.log(err.response)
                        })
                    } else {
                        let self = this.content
                        let params = {
                            imageurl: self.imageUrl,
                            reloid: self.oid,
                            source: InfoSource.NETGAMES,
                            title: self.subject,
                            url: window.location.href,
                            userid: USERINFO.id,
                            username: USERINFO.nickname
                        }
                        addCollection(params).then(res => {
                            console.log(res)
                            this.content.scount=Number(this.content.scount+1)
                            this.getIsCollection()
                        }).catch(err => {
                            console.log(err.response)
                        })
                    }
                }else {
                    this.$router.push('/Login')
                }
            },
            // 发表评论
            handleEv(item) {
                let user = USERINFO
                let params = {
                    content: item.codeName,
                    imageurl: user.photo,
                    reloid: this.$route.params.id,
                    source: InfoSource.ACTIVITY,
                    starlevel: 5,
                    title: this.content.name,
                    url: window.location.href,
                    userid: user.id,
                    username: user.nickname?user.nickname:user.realname
                }
                addevaluation(params).then(res => {
                    console.log(res)
                    Toast('评论成功')
                    // 时间转换
                    let t = new Date()
                    let time = t.toLocaleString().split(' ')[0].replace(/\//g, '-')
                    // 整理数据
                    let ev = {
                        imageurl: user.photo,
                        opertime: time,
                        username: params.username,
                        content: item.codeName
                    }
                    // 添加到数组的第一位
                    this.comment.unshift(ev)
                    // 关闭弹窗
                    this.rightPop = false
                    setTimeout(() => {
                        this.getEvaluationList()
                    }, 6000)
                }).catch(err => {
                    console.log(err)
                })
            },
            // 打开评论列表
            handleOpenEv(){
                if(USERINFO){
                    this.rightPop=true
                }else {
                    this.$router.push('/Login')
                }
            },
            // 获取 可发表的评论列表
            getEvList() {
                let code = '019'
                basecode(code).then(res => {
                    console.log(res)
                    this.evArr = res
                }).catch(err => {
                    console.log(err.response)
                })
            },
            getBase(){
                let code='011'
                basecode(code).then(res=>{
                    console.log(res)
                    this.baseArr=res
                    this.getNetGamesResource()
                }).catch(err=>{
                    console.log(err.response)
                })
            },
            // 已征集作品 列表
            getNetGamesResource() {
                let id = this.$route.params.id
                let limit = 20
                let count = true
                netGamesResource(id,limit,count).then(res=>{
                    console.log('----')
                    console.log(res)
                    this.workArr=res
                    this.workArr.map(m=>this.baseArr.map(mb=>m.artType===mb.codeStr?m.artType=mb.codeName:''))
                }).catch(err=>{
                    console.log(err.response)
                })
            },
            // 搜索已征集作品
            handleSearch(){
                let id = this.$route.params.id
                let limit = 20
                let count = true
                let name = this.searchTxt
                netGamesResourceSearch(id,name,limit,count).then(res=>{
                    console.log('----')
                    console.log(res)
                    this.workArr=res
                    this.workArr.map(m=>this.baseArr.map(mb=>m.artType===mb.codeStr?m.artType=mb.codeName:''))
                }).catch(err=>{
                    console.log(err.response)
                })
            },
            // 前往作品详情页
            handleWorkInfo(item){
                this.$router.push('/WorkInfo/'+item.oid)
            },
            // 前往投稿页面
            handleSubmit() {
                let id = this.$route.params.id
                this.$router.push('/UploadWorks/' + id)
            },
            // 页面顶部距离，会置顶
            handleTop() {
                let id = document.getElementById('top')
                id.scrollIntoView(true)
            },
            // 分享初始化
            initShare() {
                let t = Date.parse(new Date())
                let u = window.location.href
                let codeUrl = ''
                let self=this
                wxShare(t, '1', u).then(res => {
                    wx.config({
                        debug:false,
                        appId: res.appid, // 必填，公众号的唯一标识
                        timestamp: res.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.noncestr, // 必填，生成签名的随机串
                        signature: res.signature,// 必填，签名，见附录1
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'scanQRCode', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    })
                    wx.ready(function () {
                    	//分享到朋友圈
                        wx.onMenuShareTimeline({
                            title:self.content.subject,
                            link:u,
	                        desc:self.content.subject,
                            imgUrl:URL + self.content.inageUrl,
                            success:function () {
                              let params = {
                                content: "string",
                                destination: 1,
                                imageurl: URL + self.content.inageUrl,
                                reloid: self.$route.params.id,
                                source: InfoSource.FREE_RESOURCE,
                                title: self.content.subject,
                                url: window.location.href,
                                userid: USERINFO.id,
                                username: USERINFO.username
                              }
                              shares(params).then(res => {
                                console.log(res);
                                self.isShare = false;
                                setTimeout(function (){
                                  self.content.shares++;
                                },1000);
                              }).catch(res=>{
                              })
                            }
                        })
                        //分享到朋友
                        wx.onMenuShareAppMessage({
                            title:self.content.subject,
                            link:u,
	                        desc:self.content.subject,
                            imgUrl:URL + self.content.inageUrl,
                            success:function () {
                              let params = {
                                content: "string",
                                destination: 1,
                                imageurl: URL + self.content.inageUrl,
                                reloid: self.$route.params.id,
                                source: InfoSource.FREE_RESOURCE,
                                title: self.content.subject,
                                url: window.location.href,
                                userid: USERINFO.id,
                                username: USERINFO.username
                              }
                              shares(params).then(res => {
                              	self.isShare = false;
                                //console.log(res);
                                setTimeout(function (){
                                  self.content.shares++;
                                },1000);
                              }).catch(res=>{
                              })
                            }
                        })
	                    //分享到QQ
	                    wx.onMenuShareAppMessage({
		                    title:self.content.subject,
		                    link:u,
		                    desc:self.content.subject,
		                    imgUrl:URL + self.content.inageUrl,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: URL + self.content.inageUrl,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.FREE_RESOURCE,
				                    title: self.content.subject,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    self.isShare = false;
				                    //console.log(res);
				                    setTimeout(function (){
					                    self.content.shares++;
				                    },1000);
			                    }).catch(res=>{
			                    })
		                    }
	                    })
	                    //分享到QQ空间
	                    wx.onMenuShareQZone({
		                    title:self.content.subject,
		                    link:u,
		                    desc:self.content.subject,
		                    imgUrl:URL + self.content.inageUrl,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: URL + self.content.inageUrl,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.FREE_RESOURCE,
				                    title: self.content.subject,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    self.isShare = false;
				                    //console.log(res);
				                    setTimeout(function (){
					                    self.content.shares++;
				                    },1000);
			                    }).catch(res=>{
			                    })
		                    }
	                    })
                    })
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        created() {
//            alert(USERINFO)
            this.getData()
            this.getEvList()
        },
        mounted() {
            this.handleTop()
            this.initShare()
        },
        filters: {
            state(s) {
                return s === 0 ? '即将开始' : s === 1 ? '正在进行' : '已经结束'
            },
            follow(f) {
                return f === false ? '关注' : '已关注'
            },
            text(t){
                return t.length>15?t.substr(0,15)+'...':t
            },
            fontNum(f) {
                return f.length > 18 ? f.substr(0, 18) + '...' : f
            }
        }
    }
</script>

<style>

</style>
