<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>作品详情</span>
        </div>
        <div id="top" class="homeCenter" :style="2>3?'margin-bottom: 1.16rem':'margin-bottom: 0'">
            <div class="contents" style="margin-bottom: 0.28rem">
                <div class="Accontent">
                    <div class="images">
                        <img v-lazy="url+content.imgPath" alt="">
                    </div>

                    <div class="title">{{ content.name }}</div>
                    <div class="tags" style="border-bottom: none">
                        <span class="tagShape">{{ content.entriesType | type}}</span>
                        <!--<span v-for="(type,index) in content.entriesTypeName" :key="" class="tagType">{{ content.entriesTypeName }}</span>-->
                    </div>
                </div>
                <div class="activitiesTime">
                    <div style="color: #666666">作者：{{ content.author }}</div>
                    <div style="margin-top: 0.2rem" class="flexBettwens">
                        <div style="color: #666666">{{ content.addTime | times }}</div>
                    </div>
                </div>
                <div class="operation">
                    <div class="browse"><i class="iconfont icon-liulan"></i>{{ viewCount.vcount }}</div>
                    <div @click="handleAddPraises" class="good">
                        <i :class="isZan?'iconfont icon-duduyinleappicon1501':'iconfont icon-dianzan'"></i>
                        {{ viewCount.count }}
                    </div>
                    <div @click="handleShare" class="share"><i class="iconfont icon-fenxiang"></i>{{ viewCount.sharecount }}</div>
                    <div @click="handleAddCollection" class="collection">
                        <i :class="isCollection?'iconfont icon-shoucang':'iconfont icon-shoucang1'"></i>{{ viewCount.scount
                        }}
                    </div>
                </div>
            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce">
                    作品简介
                    <i></i>
                </div>
                <div class="contentIntroduce" style="border: none" v-html="content.shortContent"></div>
                <div class="activitiesIntroduce">
                    作品资源
                    <i></i>
                </div>
                <div class="contentIntroduce" style="border: none">
                    <div v-if="isVideo" style="width: 100%;overflow: hidden">
                        <video style="width: 100%" id="video" controls="controls" :src="videoPath" :poster="url+content.imgPath">
                            <!--<source :src="'http:'+u+'/'+video[0].qiniu.key">-->
                        </video>
                    </div>
                    <div v-if="isAudio" style="width: 100%;overflow: hidden">
                        <audio style="width: 100%" controls="controls" :src="videoPath">
                            <!--<source :src="'http:'+u+'/'+video[0].qiniu.key">-->
                        </audio>
                    </div>
                    <div v-if="isImage" style="width: 100%;overflow: hidden">
                        <img style="width:100%;" :src="url+imageUrl">
                    </div>
                    <div v-if="isFile" style="width: 100%;overflow: hidden">
                        <!--<a :href="url+fileUrl">{{fileName}}</a>-->
                        <a @click="downfile(url+fileUrl)">{{fileName}}</a>
                    </div>
                </div>
            </div>

            <div @click="voteAdd" style="margin: 0 auto;width: 9rem;padding: 0.2rem;font-size: 0.4rem" class="voteBtn">
                我要投票
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
        voteInfoId,                             // 获取数据
        restype,                                // 活动类型
        basecode,                               // 获取基础数据 011：艺术分类  019:评论选项
        checkUserPraise,                        // 验证是否点赞
        praises,                                // 新增点赞
        cancelPraiseFront,                      // 取消点赞
        isCollection,                           // 验证是否收藏
        addCollection,                          // 新增收藏
        deleteCollection,                       // 取消收藏
        voteDetail,                             // 投票
        wxShare,                                // 微信分享签名
	    shares,                                 //新增分享
        qiniuUrl,                               // 获取播放地址
      qiniuPrefix,                               // 获取播放地址
    } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';

    export default {
        name: '',
        data() {
            return {
                url: URL,
                videoPath:'',                           // 播放地址
                content: [],
                viewCount: {},                   // 浏览量等
                serImg: require('../../assets/re1.png'),
                isZan: false,                    // 是否点赞
                isCollection: false,             // 是否收藏
                activityArry: [],
                typeArry: [],
                video:'',
                isVideo:false,
                isAudio:false,
                isImage:false,
                isFile:false,
                isShare: false,
                fileName:'',
                fileUrl:'',
                imageUrl:'',
                wxImg: require('../../assets/ac.png'),
	            tempUserID:''
            }
        },
        methods: {
            // 返回
	        downfile(url){
		        downloadFile(url)
            },

            handleBack() {
                this.$router.go(-1)
            },
            // 通过路由传的ID获取详情数据
            getData() {
                Indicator.open()
                let id = this.$route.params.id
                voteInfoId(id).then(res => {
                    this.content = res.entries
                    if(this.content.entriesType==='1001'|| this.content.entriesType==='1002'){
                        if(this.content.entriesType==='1001'){
                            this.isVideo=true;
                        }else{
                            this.isAudio=true;
                        }
                        this.video=JSON.parse(this.content.videoPath)
                        qiniuUrl(res.entries.areaId).then(value=>{
                          console.log(value);
                          qiniuPrefix(this.video[0].qiniu.persistentId).then(data=>{
                            console.log(data);
                            this.videoPath="http:"+value.url+'/'+data.data.items[0].key;
	                         //console.log( this.videoPath+"cccccccccccc");

                          })
                        })
                    }else if(this.content.entriesType==='1003'){
                        this.isImage=true;
                        let data=JSON.parse(this.content.videoPath)[0];
                        this.imageUrl=data;
                    }else{
                        this.isFile=true;
                        let data=JSON.parse(this.content.videoPath)[0];
                        this.fileName=data.name;
                        this.fileUrl=data.value;
                    }
                    this.viewCount = res.viewCount
                    // 执行其他方法获取数据
                    this.getIsZan();
                    //this.getIsCollection()
                    Indicator.close()
                }).catch(err => {
                    Indicator.close()
                    console.log(err.response)
                })
            },
            checkFileType(url){
                if(url.indexOf('video')!=-1){
                    this.isVideo=true;
                }else if(url.indexOf('audio')!=-1){
                    this.isAudio=true
                }else{
                    console.log("nothing");
                }
            },
            // 投票+1
            voteAdd() {
                if(!USERINFO){
                    this.$router.push("/Login");
                }
                let uid = USERINFO.id
                let params = {
                    areaId: this.content.areaId,
                    areaName: this.content.areaName,
                    areaNo: this.content.areaNo,
                    entriesId: this.content.id,
                    userId: uid
                }
                Indicator.open()
                voteDetail(params).then(res => {
                    console.log(res)
                    Indicator.close()
                    if(res>0){
                        Toast('投票成功，还可以投' + res + '票')
                    }else {
                        Toast('投票成功，今日次数已用完')
                    }

                }).catch(err => {
                    console.log(err.response)
                    Indicator.close()
                    Toast(err.response.data.msg)
                })
            },

            // 查询用户是否点赞
            getIsZan() {
            	var me = this;
	            if(USERINFO){
		            me.tempUserID=USERINFO.id;
	            }else if(localStorage.getItem('tempUserID')){
		            me.tempUserID=localStorage.getItem('tempUserID');
                }else{
	            	console.log('77');
	            	//return ''
		            if(IS_WX){
			            if(localStorage.getItem('tempUserID')){
				            me.tempUserID=localStorage.getItem('tempUserID');
			            }else{
				            me.tempUserID='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
					            return v.toString(16);
				            });
				            localStorage.setItem('tempUserID',me.tempUserID);
			            }

		            }else {
			            var self=this;
			            JsBridge.callHandler(
			              'getUniqueID',
			              '',
			              function (r) {
				              self.tempUserID=r;
			              }

			            )
		            }
	            }

	            checkUserPraise(me.content.id, this.tempUserID).then(res => {
                    //console.log('是否点赞' + res)
		            me.isZan = res
                }).catch(err => {
                    console.log(err.response)
                })
            },
          // 新增/取消 点赞
	        handleAddPraises() {
                var me =this;
		        let userId = USERINFO?USERINFO.id:me.tempUserID;
		        if (me.isZan) {
			        cancelPraiseFront(me.viewCount.reloid, userId).then(res => {
				        console.log(res)
				        me.viewCount.count=Number(me.viewCount.count)-1
				        me.getIsZan()
			        }).catch(err => {
				        console.log(err.response)
			        })
		        } else {
			        let self = me.content
			        let params = {
				        imageurl: self.cover,
				        reloid: self.id,
				        source: InfoSource.ACTIVITY,
				        title: self.name,
				        url: window.location.href,
				        userid: userId,
				        username: USERINFO?USERINFO.nickname:'',
			        }
			        praises(params).then(res => {
				        console.log(res)
				        me.viewCount.count=Number(me.viewCount.count)+1
				        me.getIsZan()
			        }).catch(err => {
				        console.log(err.response)
			        })
		        }
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


            // 获取 活动形式 数据 一级分类
            getRestype() {
                restype().then(res => {
                    console.log(res)
                    this.activityArry = res
	                this.getData()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            //获取 类型 数据 艺术类型
            // getBasecode() {
            //     let code = '011'
            //     basecode(code).then(res => {
            //         console.log(res)
            //         this.typeArry = res
            //
            //     }).catch(err => {
            //         console.log(err.response)
            //     })
            // },


            // 页面顶部距离，会置顶
            handleTop() {
                let id = document.getElementById('top')
                id.scrollIntoView(true)
            },
            // 新增分享
            handleShare() {
                if(!IS_WX){
                    let data = {
                        title: this.content.name,
                        img: URL + this.content.imgPath,
	                    desc:self.content.activityName,
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
		                imageurl: URL + self.content.imgPath,
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
		                    "title":self.content.name,
		                    "link":u,
		                    "desc":self.content.name,
		                    "imgUrl":URL + self.content.imgPath,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: self.url + self.content.imgPath,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.NETGAMES,
				                    title: self.content.name,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    //console.log(res)
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
		                    "title":self.content.name,
		                    "link":u,
		                    "desc":self.content.name,
		                    "imgUrl":URL + self.content.imgPath,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: URL + self.content.imgPath,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.NETGAMES,
				                    title: self.content.name,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    console.log(res);
				                    self.isShare = false;
				                    setTimeout(function (){
					                    self.viewCount.sharecount++;
				                    },1000);
			                    }).catch(res=>{
				                    alert(JSON.stringify(res));
			                    })
		                    }
	                    });
	                    //分享到QQ
	                    wx.onMenuShareQQ({
		                    "title":self.content.name,
		                    "link":u,
		                    "desc":self.content.name,
		                    "imgUrl":URL + self.content.imgPath,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: self.url + self.content.imgPath,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.NETGAMES,
				                    title: self.content.name,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    //console.log(res)
				                    self.isShare = false;
				                    setTimeout(function (){
					                    self.viewCount.sharecount++;
				                    },1000);
			                    }).catch(res=>{
				                    alert(JSON.stringify(res));
			                    })
		                    }
	                    });
	                    //分享到QQ空间
	                    wx.onMenuShareQZone({
		                    "title":self.content.name,
		                    "link":u,
		                    "desc":self.content.name,
		                    "imgUrl":URL + self.content.imgPath,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: self.url + self.content.imgPath,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.NETGAMES,
				                    title: self.content.name,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    //console.log(res)
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
            this.getRestype()
        },
        mounted() {
            this.handleTop()
            this.initShare()
        },
        filters: {
            IsEnroll(y) {
                return y === 0 ? '无需报名，直接进入' : '正在报名'
            },
            type(t){
                return t=='1001'?'视频':t=='1002'?'音频':t=='1003'?'图片':'文字'
            }
        }
    }
</script>

<style>

</style>
