<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>参活动</span>
        </div>
        <div id="top" class="homeCenter" :style="1===1?'margin-bottom: 1.16rem':'margin-bottom: 0'">
            <div class="contents" style="margin-bottom: 0.28rem">
                <div class="Accontent" style="margin-bottom: 0;border-bottom: none">
                    <div class="images">
                        <img v-lazy="url+content.imageurl" alt="">
                    </div>
                    <div class="title" style="padding: 0.4rem">{{ content.detname }}</div>
                </div>

                <div class="operation">
                    <div class="browse"><i class="iconfont icon-liulan"></i>{{ viewCount.vcount }}</div>
                    <div @click="handleAddPraises" class="good">
                        <i :class="isZan?'iconfont icon-duduyinleappicon1501':'iconfont icon-dianzan'"></i>{{ viewCount.count }}
                    </div>
                    <div class="share" @click="handleShare">
                        <i class="iconfont icon-fenxiang"></i>
                        {{ viewCount.sharecount }}
                    </div>
                    <div @click="handleAddCollection" class="collection">
                        <i :class="isCollection?'iconfont icon-shoucang':'iconfont icon-shoucang1'"></i>{{ viewCount.scount }}
                    </div>
                </div>
            </div>
            <div class="activitiesContent">
                <div class="flexBettwens" style="padding: 0.4rem 0.4rem 0.4rem 0;border-bottom: 1px solid #e5e5e5">
                    <div>作者：{{ content.author }}</div>
                    <div>发布时间：{{ content.addtime | times }}</div>
                </div>
                <div class="activitiesIntroduce flexBettwens" style="padding-right: 0.4rem">
                    <div class="flex">
                        作品简介
                        <i></i>
                    </div>
                    <span class="iconfont icon-down"></span>
                </div>
                <div style="border-bottom: none" class="contentIntroduce" v-html="content.content"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        workShow,                             // 获取数据
        isenroll,                               // 验证是否报名
        checkUserPraise,                        // 验证是否点赞
        praises,                                // 新增点赞
        cancelPraiseFront,                      // 取消点赞
        isCollection,                           // 验证是否收藏
        addCollection,                          // 新增收藏
        deleteCollection,                       // 取消收藏
	    wxShare,                                // 微信分享签名
	    shares,
    } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';

    export default {
        name: '',
        data() {
            return {
                url: URL,
                content: [],
                serImg: require('../../assets/re1.png'),
                isEnroll: true,                  // 是否报名
                isZan: false,                    // 是否点赞
                isCollection: false,             // 是否收藏
                viewCount: [],                  // 浏览量点赞量等
            }
        },
        methods: {
            // 返回
            handleBack() {
                window.history.back()
            },
            // 通过路由传的ID获取详情数据
            getData() {
                let id = this.$route.params.id
                workShow(id).then(res => {
                    console.log(res)
                    this.content = res.detail
                    console.log(this.content)
                    this.viewCount = res.viewCount
                    // 执行其他方法获取数据
                    this.getIsZan()
                    this.getIsCollection()
                    Indicator.close()
                }).catch(err => {
                    console.log(err.response)
                })
            },
	        // 新增分享
	        handleShare() {
		        if (!IS_WX) {
			        let data = {
				        title: this.content.detname,
				        img: URL + this.content.imageurl,
				        desc:this.content.detname,
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
				        imageurl: URL + self.content.imageurl,
				        reloid: self.$route.params.id,
				        source: InfoSource.EXHIBITIONDETAIL,
				        title: self.content.detname,
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
		        } else {
			        this.isShare = true
		        }
	        }
	        ,
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
				          imageurl: URL + self.content.imageurl,
				          reloid: self.$route.params.id,
				          source: InfoSource.ACTIVITY,
				          title: self.content.detname,
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
            // 查询用户是否点赞
            getIsZan() {
                checkUserPraise(this.content.oid, USERINFO.id).then(res => {
                    console.log('是否点赞' + res)
                    this.isZan = res
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 新增点赞
            handleAddPraises() {
                let userId = USERINFO.id
                if (this.isZan) {
                    cancelPraiseFront(this.content.oid, userId).then(res => {
                        console.log(res)
                        this.getIsZan()
                    }).catch(err => {
                        console.log(err.response)
                    })
                } else {
                    let self = this.content
                    let params = {
                        imageurl: self.imageurl,
                        reloid: self.oid,
                        source: InfoSource.EXHIBITIONDETAIL,
                        title: self.detname,
                        url: window.location.href,
                        userid: userId,
                        username: USERINFO.nickname
                    }
                    praises(params).then(res => {
                        console.log(res)
                        this.getIsZan()
                    }).catch(err => {
                        console.log(err.response)
                    })
                }
                this.getData()
            },
            // 查询用户是否收藏
            getIsCollection() {
                isCollection(this.content.oid).then(res => {
                    console.log('是否收藏'+res)
                    this.isCollection = res
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 新增/取消 收藏
            handleAddCollection() {
                if (this.isCollection) {
                    deleteCollection(this.content.oid).then(res => {
                        console.log(res)
                        this.getIsCollection()
                    }).catch(err => {
                        console.log(err.response)
                    })
                } else {
                    let self = this.content
                    let params = {
                        imageurl: self.imageurl,
                        reloid: self.oid,
                        source: InfoSource.EXHIBITIONHISTORY,
                        title: self.detname,
                        url: window.location.href,
                        userid: USERINFO.id,
                        username: USERINFO.nickname
                    }
                    addCollection(params).then(res => {
                        console.log(res)
                        this.getIsCollection()
                    }).catch(err => {
                        console.log(err.response)
                    })
                }
                this.getData()
            },
            // 分享初始化
	        initShare() {
		        let t = Date.parse(new Date())
		        let u = window.location.href
		        let self=this
		        wxShare(t, '1', u).then(res => {
			        console.log('-------------')
			        console.log(res)
			        console.log('-------------')
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
					        title:self.content.detname,
					        link:u,
					        desc:self.content.detname,
					        imgUrl:self.url+content.imageurl,
					        success:function () {
						        let params = {
							        content: "string",
							        destination: 1,
							        imageurl: URL + self.content.imageurl,
							        reloid: self.$route.params.id,
							        source: InfoSource.EXHIBITIONDETAIL,
							        title: self.content.detname,
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

						        })
					        }
				        })
				        //分享到朋友
				        wx.onMenuShareAppMessage({
					        title:self.content.detname,
					        link:u,
					        desc:self.content.detname,
					        imgUrl:URL + self.content.imageurl,
					        success:function () {
						        let params = {
							        content: "string",
							        destination: 1,
							        imageurl: URL + self.content.imageurl,
							        reloid: self.$route.params.id,
							        source: InfoSource.EXHIBITIONDETAIL,
							        title: self.content.detname,
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

						        })
					        }
				        })
				        //分享到QQ
				        wx.onMenuShareQQ({
					        title:self.content.detname,
					        link:u,
					        desc:self.content.detname,
					        imgUrl:self.url+content.imageurl,
					        success:function () {
						        let params = {
							        content: "string",
							        destination: 1,
							        imageurl: URL + self.content.imageurl,
							        reloid: self.$route.params.id,
							        source: InfoSource.EXHIBITIONDETAIL,
							        title: self.content.detname,
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

						        })
					        }
				        })
				        //分享到QQ空间
				        wx.onMenuShareQZone({
					        title:self.content.detname,
					        link:u,
					        desc:self.content.detname,
					        imgUrl:self.url+content.imageurl,
					        success:function () {
						        let params = {
							        content: "string",
							        destination: 1,
							        imageurl: URL + self.content.imageurl,
							        reloid: self.$route.params.id,
							        source: InfoSource.EXHIBITIONDETAIL,
							        title: self.content.detname,
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

						        })
					        }
				        })
			        })
		        }).catch(err => {
			        console.log(err)
		        })
	        },

            // 页面顶部距离，会置顶
            handleTop() {
                let id = document.getElementById('top')
                id.scrollIntoView(true)
            }
        },
        created() {
            this.getData()
        },
        mounted() {
            this.handleTop()
	        this.initShare()
        },
    }
</script>

<style>

</style>
