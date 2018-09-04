<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>投上一票</span>
        </div>
        <div id="top" class="homeCenter" :style="2>3?'margin-bottom: 1.16rem':'margin-bottom: 0'">
            <div class="contents" style="background-color: #f5f5f5;">
                <div class="Accontent" style="margin-bottom: 0.2rem">
                    <div class="images">
                        <img v-lazy="url+content.imgUrl" alt="">
                        <span>{{ content.voteState | state }}</span>
                    </div>
                    <div class="title" style="padding-bottom: 0.4rem;border-bottom: 1px solid #e5e5e5">
                        {{ content.name }}
                    </div>
                    <div class="activitiesTime">
                        <div style="color: #666666">投票时间：{{ content.startTime | times }} 至 {{ content.endTime | times
                            }}
                        </div>
                    </div>
                    <div class="operation">
                        <div class="browse"><i class="iconfont icon-liulan"></i>{{ viewCount.vcount }}</div>
                        <div @click="handleAddPraises" class="good">
                            <i :class="isZan?'iconfont icon-duduyinleappicon1501':'iconfont icon-dianzan'"></i>
                            {{ viewCount.count }}
                        </div>
                        <div @click="handleShare" class="share"><i class="iconfont icon-fenxiang"></i>
                            {{ viewCount.sharecount }}
                        </div>
                        <div @click="handleAddCollection" class="collection">
                            <i :class="isCollection?'iconfont icon-shoucang':'iconfont icon-shoucang1'"></i>
                            {{ viewCount.scount }}
                        </div>
                    </div>
                </div>

            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce">
                    活动介绍
                    <i></i>
                </div>
                <div class="contentIntroduce" v-html="content.content"></div>
                <div class="contact">
                    <div class="flexBettwens rows">
                        <div>
                            <div style="width: 2rem">主办方：</div>
                            <b>{{ content.conductOrg }}</b>
                        </div>
                        <i @click="handleToFollow">{{ isFollow | follow }}</i>
                    </div>
                    <div class="rows">
                        <div style="width: 2rem">承办方：</div>
                        <b>{{ content.organizer }}</b>
                    </div>
                    <div class="rows">
                        <div style="width: 2rem">联系方式：</div>
                        <b>{{ content.phone }}</b>
                    </div>
                </div>
            </div>

            <div class="activitiesContent" style="padding-left: 0">
                <div class="activitiesIntroduce flexBettwens" style="padding-right: 0.4rem;margin: 0 0 0.4rem 0.4rem;">
                    <div class="flexBettwens">
                        参赛作品
                        <i></i>
                        <div class="voteTotal">(总投票：{{content.totalNumber}}票)</div>
                    </div>
                    <div class="searchAuth">
                        <input v-model="athor" @input="getActivityVoteId" type="text" placeholder="作者">
                        <span class="iconfont icon-sousuo1"></span>
                    </div>
                </div>
                <div @click="handleWorkInfo(work)" v-for="(work,index) in workArr" style="padding-top: 0.4rem">
                    <div class="flexBettwens" style="border-bottom: 1px solid #e5e5e5;padding-bottom: 0.4rem">
                        <div class="voteInfo" style="border-right: 1px solid #e5e5e5">ID:{{ work.entNumber }}</div>
                        <div class="voteInfo" style="border-right: 1px solid #e5e5e5">{{ work.getVoteNumber }}票</div>
                        <div class="voteInfo">NO:{{ work.ranking }}</div>
                    </div>
                    <div class="worksImg">
                        <img v-lazy="url+work.imgPath" alt="">
                        <!--<div class="worker">{{ work.author }} {{ Number(work.addTime) | times }}</div>-->
                        <div class="worker">{{ work.author }}</div>
                    </div>
                    <div class="worksInfo flexBettwens" style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5">
                        <div>{{ work.name }}</div>
                        <div class="voteBtn">前往投票</div>
                    </div>
                </div>
                <div @click="clickMore"  class="clickMore" v-if="workArr.length>0">{{loadingTxt}}</div>
            </div>
        </div>
        <div @click="isShare=false" v-if="isShare" class="shareBg">
            <div class="bg"></div>
            <img :src="wxImg" alt="" width="100%">
        </div>
    </div>
</template>

<script>
    import {
	    voteList,                               //
        voteId,                                 // 获取数据
        activityVoteId,                         // 根据活动ID获取作品列表
        netGamesResource,                       // 已征集作品列表
        checkUserPraise,                        // 验证是否点赞
        praises,                                // 新增点赞
        cancelPraiseFront,                      // 取消点赞
        isCollection,                           // 验证是否收藏
        addCollection,                          // 新增收藏
        deleteCollection,                       // 取消收藏
        isFollow,                               // 是否关注
        follows,                                // 添加/取消 关注
        wxShare,                                // 微信分享签名
        shares,                                 //新增分享
    } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';
    import { JsBridge } from '../../jsbridge/jsbridge'

    export default {
        name: '',
        data() {
            return {
                url: URL,
                content: [],                        // 页面数据
	            //contents: [],                        // 页面数据
                viewCount: [],                      // 浏览量等
                workArr:[],                            // 参赛作品数组
                serImg: require('../../assets/re1.png'),
                workArr: [],                      // 已征集列表
                isFollow: false,                  // 是否关注
                isZan: false,                    // 是否点赞
                isCollection: false,             // 是否收藏
                athor:'',                           // 按作者名搜索
	            loadingTxt: '点击加载...',        // 正在加载的显示
	            total: 0,                        // 总数
	            offset: 0,                       // 页数，默认0
	            limit: 20,                       // 每次查询的条数
	            loading: false,                  // 滚动加载提示
                isShare: false,
                wxImg: require('../../assets/ac.png'),
                idid:'',
              tempUserID:'',
            }
        },
	    watch: {
		    workArr(s) {
			    this.loadingTxt = s.length >= this.total ? '所有数据已加载完毕' : '点击加载...'
		    }
	    },
        methods: {
            // 返回
            handleBack() {
                this.$router.go(-1)
            },
            // 通过路由传的ID获取详情数据

	        clickMore(){
		        this.offset=this.offset+this.limit;
		        if (this.total > this.offset) {
			        this.loading = true
			        this.loadingTxt = '正在加载...';
			        //console.log(this.idid);
			        activityVoteId(this.idid ,this.offset,this.limit,this.athor).then(res=>{
				        let arr = res.data;
				        this.workArr.push(...arr);
				        this.loading = false
				        this.loadingTxt = '点击加载...'
			        }).catch(err=>{
				        console.log(err.response)
			        })
		        } else {
			        this.loadingTxt = '所有数据已加载完毕'
		        }
	        },

            getData() {
                Indicator.open()
                let id = this.$route.params.id
                voteId(id).then(res => {
                    this.content = res.vote
                    this.viewCount = res.viewCount
                    // 执行其他方法获取数据
                    if(USERINFO){
                      this.tempUserID=USERINFO.id;
                        this.getIsCollection()
                        this.getIsFollow()
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
                    this.getActivityVoteId()
                    Indicator.close()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            getActivityVoteId() {
                let id = this.$route.params.id
	            this.idid  =id;
                activityVoteId(id,this.offset,this.limit,this.athor).then(res=>{
                	this.offset = 0;
                	console.log(res)
	                this.total = res.headers['x-total-count'];
                    this.workArr=res.data;
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 查询用户是否点赞
            getIsZan() {
                checkUserPraise(this.viewCount.reloid, this.tempUserID).then(res => {
                    //console.log('是否点赞' + res)
                    this.isZan = res
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 新增点赞
            handleAddPraises() {
                let userId = USERINFO?USERINFO.id:this.tempUserID;
                if (this.isZan) {
                    cancelPraiseFront(this.viewCount.reloid, userId).then(res => {
                        console.log(res)
                        this.viewCount.count=Number(this.viewCount.count)-1
                        this.getIsZan()
                    }).catch(err => {
                        console.log(err.response)
                    })
                } else {
                    let self = this.content
                    let params = {
                        imageurl: self.imgUrl,
                        reloid: this.viewCount.reloid,
                        source: InfoSource.NETGAMES,
                        title: self.conductOrg,
                        url: window.location.href,
                        userid: userId,
                        username: USERINFO?USERINFO.nickname:'',
                    }
                    praises(params).then(res => {
                        console.log(res)
                        this.viewCount.count=Number(this.viewCount.count)+1
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
                        title: this.content.name,
                        img: URL + this.content.imgUrl,
	                    desc:this.content.name,
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
                    imageurl: URL + self.content.imgUrl,
                    reloid: self.$route.params.id,
                    source: InfoSource.NETGAMES,
                    title: self.content.name,
                    url: window.location.href,
                    userid: USERINFO.id,
                    username: USERINFO.username
                  }
                  shares(params).then(res => {
                    console.log(res);
                    setTimeout(function (){
                      self.viewCount.sharecount++;
                    },1000);
                  }).catch(res=>{
                    alert(JSON.stringify(res));
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
                            title: self.content.name,
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
                isCollection(this.viewCount.reloid).then(res => {
                    this.isCollection = res
                }).catch(err => {
                })
            },
            // 新增/取消 收藏
            handleAddCollection() {
                if(USERINFO){
                    if (this.isCollection) {
                        deleteCollection(this.viewCount.reloid).then(res => {
                            console.log(res)
                            this.viewCount.scount=Number(this.viewCount.scount-1)
                            this.getIsCollection()
                        }).catch(err => {
                            console.log(err.response)
                        })
                    } else {
                        let self = this.content
                        let params = {
                            imageurl: self.imgUrl,
                            reloid: this.viewCount.reloid,
                            source: InfoSource.FREE_RESOURCE,
                            title: self.subject,
                            url: window.location.href,
                            userid: USERINFO.id,
                            username: USERINFO.nickname
                        }
                        addCollection(params).then(res => {
                            console.log(res)
                            this.viewCount.scount=Number(this.viewCount.scount+1)
                            this.getIsCollection()
                        }).catch(err => {
                            console.log(err.response)
                        })
                    }
                }else {
                    this.$router.push('/Login')
                }
            },
            // 查询用户是否关注机构
            getIsFollow() {
                let id = this.content.addOrg
                isFollow(id).then(res => {

                }).catch(err => {
                    console.log(err.response)
                    if(err.response.data.res===51301){
                        console.log('已关注')
                        this.isFollow = true
                      Indicator.close();
                    }else if(err.response.data.res===51302){
                        console.log('未关注')
                        this.isFollow = false
                      Indicator.close();
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
                        orgid: this.content.addOrg,
                        type: type
                    }
                    follows(params).then(res => {
                        console.log(res)
                        this.getIsFollow()
                    }).catch(err => {
                        console.log(err.response)
                    })
                }else {
                    this.$router.push('/Login')
                }
            },

            // 前往作品详情页
            handleWorkInfo(item) {
                this.$router.push('/VoteInfo/' + item.id)
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
                let self=this
                wxShare(t, '1', u).then(res => {
                    console.log(res)
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
                            "title":self.content.name,
                            "link":u,
	                        "desc":self.content.name,
                            "imgUrl":self.url + self.content.imgUrl,
                            success:function () {
                              let params = {
                                content: "string",
                                destination: 1,
                                imageurl: self.url + self.content.imgUrl,
                                reloid: self.$route.params.id,
                                source: InfoSource.FREE_RESOURCE,
                                title: self.content.name,
                                url: window.location.href,
                                userid: USERINFO.id,
                                username: USERINFO.username
                              }
                              shares(params).then(res => {
                              	self.isShare = false;
                                setTimeout(function (){
                                  self.viewCount.sharecount++;
                                },1000);
                              }).catch(res=>{
                                alert(JSON.stringify(res));
                              })
                            }
                        });

	                    //分享给朋友
	                    wx.onMenuShareAppMessage({
		                    "title":self.content.name ,
		                    "link":u,
		                    "desc":self.content.name,
		                    "imgUrl":URL + self.content.imgUrl,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: URL + self.content.imgUrl,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.FREE_RESOURCE,
				                    title: self.content.name,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
                                    self.isShare = false;
				                    setTimeout(function (){
					                    self.viewCount.sharecount++;
				                    },1000);
			                    }).catch(res=>{
				                    alert(JSON.stringify(res));
			                    })
		                    }
	                    });
	                    //分享给QQ
	                    wx.onMenuShareQQ({
		                    "title":self.content.name ,
		                    "link":u,
		                    "desc":self.content.name,
		                    "imgUrl":URL + self.content.imgUrl,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: URL + self.content.imgUrl,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.FREE_RESOURCE,
				                    title: self.content.name,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    self.isShare = false;
				                    setTimeout(function (){
					                    self.viewCount.sharecount++;
				                    },1000);
			                    }).catch(res=>{
				                    alert(JSON.stringify(res));
			                    })
		                    }
	                    });
	                    //分享QQ空间
	                    wx.onMenuShareQZone({
		                    "title":self.content.name ,
		                    "link":u,
		                    "desc":self.content.name,
		                    "imgUrl":URL + self.content.imgUrl,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: URL + self.content.imgUrl,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.FREE_RESOURCE,
				                    title: self.content.name,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    self.isShare = false;
				                    setTimeout(function (){
					                    self.viewCount.sharecount++;
				                    },1000);
			                    }).catch(res=>{
				                    alert(JSON.stringify(res));
			                    })
		                    }
	                    });


                    })
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        created() {
            this.getData()
        },
        mounted() {
            this.handleTop()
            this.initShare()
        },
        beforeDestroy() {
            Indicator.close()
        },
        filters: {
            state(s) {
                return s === 0 ? '即将开始' : s === 1 ? '正在进行' : '已经结束'
            },
            follow(f) {
                return f === false ? '关注' : '已关注'
            },
            fontNum(f) {
                return f.length > 20 ? f.substr(0, 20) + '...' : f
            }
        }
    }
</script>

<style>

</style>
