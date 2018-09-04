<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>网上活动</span>
        </div>
        <div id="top" class="homeCenter" :style="2<1?'margin-bottom: 1.16rem':'margin-bottom: 0'">
            <div class="contents" style="margin-bottom: 0.28rem">
                <div class="Accontent" style="margin-bottom: 0;border-bottom: none">
                    <div class="images">
                        <img v-lazy="url+content.imgurl" alt="">
                        <!--<span>{{ content.enrollWay | IsEnroll }}</span>-->
                    </div>
                    <div class="title">{{ content.title }}</div>
                    <div class="tags">
                        <span class="tagShape" v-for="(art,index) in content.artType" :key="index">{{ art }}</span>
                        <span v-for="(type,index) in content.type" :key="" class="tagType">{{ type }}</span>
                    </div>
                </div>
                <div class="activitiesTime">
                    <div style="color: #666666">{{ content.netGamesName }}</div>
                    <div style="margin-top: 0.2rem" class="flexBettwens">
                        <div style="color: #666666">{{ content.issureTime | times }}</div>
                    </div>
                </div>
                <div class="operation">
                    <div class="browse"><i class="iconfont icon-liulan"></i>{{ content.pageviews }}</div>
                    <div @click="handleAddPraises" class="good">
                        <i :class="isZan?'iconfont icon-duduyinleappicon1501':'iconfont icon-dianzan'"></i>{{ content.praises }}
                    </div>
                    <div @click="handleShare" class="share"><i class="iconfont icon-fenxiang"></i>{{ content.shares }}</div>
                    <div @click="handleAddCollection" class="collection">
                        <i :class="isCollection?'iconfont icon-shoucang':'iconfont icon-shoucang1'"></i>{{ content.scount }}
                    </div>
                </div>
            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce flexBettwens" style="padding: 0.4rem 0.4rem 0.4rem 0">
                    <div class="flex">
                        作品简介
                        <i></i>
                    </div>
                    <!--<div class="iconfont icon-down"></div>-->
                </div>
                <div class="contentIntroduce" v-html="content.description"></div>
            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce flexBettwens" style="padding: 0.4rem 0.4rem 0.4rem 0">
                    <div class="flex">
                        作品详情
                        <i></i>
                    </div>
                    <!--<div class="iconfont icon-down"></div>-->
                </div>
                <div v-if="isVideo" style="width: 100%;overflow: hidden">
                    <video style="width: 100%" controls="controls" :poster="url+content.imgurl" :src="videoPath">
                        <!--<source :src="'http:'+u+'/'+video[0].qiniu.key">-->
                    </video>
                </div>
                <div v-if="isAudio" style="width: 100%;overflow: hidden">
                    <audio style="width: 100%" controls="controls" :src="videoPath">
                        <!--<source :src="'http:'+u+'/'+video[0].qiniu.key">-->
                    </audio>
                </div>
                <div v-if="isFile" style="width: 100%;overflow: hidden">
                    <a target="_parent" :href="url+fileUrl">{{fileName | fontNum}}</a>
                </div>
                <div style="padding: 0.4rem" v-if="isImg" class="images">
                    <img :src="url+content.url" alt="" style="width: 100%">
                </div>
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
        addCollection,
        basecode,
        cancelPraiseFront,
        checkUserPraise,
        deleteCollection,
        getWorkInfo,
        isCollection,
        praises,
        restype,
        wxShare,
        qiniuUrl,
        qiniuPrefix,
	    shares
    } from '../../api/api'
    import {Indicator, Toast} from 'mint-ui';

    export default {
        name: '',
        data() {
            return {
                u:'',
                url: URL,
                content: {},
                isZan: false,                    // 是否点赞
                isCollection: false,             // 是否收藏
                activityArry: [],
                typeArry: [],
                isShare: false,
                wxImg: require('../../assets/ac.png'),
                isImg:false,
                isVideo:false,
                isAudio:false,
                isFile:false,
                fileName:'',
                fileUrl:'',
                video:'',
                videoPath:'',
            }
        },
        methods: {
            handleBack() {
                this.$router.go(-1)
            },
            getData() {
                Indicator.open()
                let id = this.$route.params.id
                getWorkInfo(id).then(res => {
                    res.artType = res.artType.split(',')
                    res.url=JSON.parse(res.url)
                    this.content = res
                    this.content.artType.map((m, i) => this.typeArry.map(t => m === t.codeStr ?this.content.artType[i] = t.codeName : ''))
                    if(this.content.resourceType==='1001'||this.content.resourceType==='1002'){
                        this.video=this.content.url
                        if(this.content.resourceType==='1002'){
                            this.isAudio=true;
                        }else{
                            this.isVideo=true;
                        }
                        qiniuUrl(res.areaid).then(data=>{
                          this.u=data.url
                          console.log(data);
                          qiniuPrefix(this.video[0].qiniu.persistentId).then(value=>{
                            console.log(value);
                            this.videoPath='http:'+this.u+'/'+value.data.items[0].key;
                          })
                        })
                    }else if(this.content.resourceType=='1004'){
                        let fileData=res.url[0];
                        this.isFile=true;
                        this.fileName=fileData.name;
                        this.fileUrl=fileData.value;
                    }else{
                        this.isImg=true;
                        this.content.url=res.url[0];
                    }
                    // 执行其他方法获取数据
                    this.getIsZan()
                    this.getIsCollection()
                    Indicator.close()
                }).catch(err => {
                    Indicator.close()
                })
            },
            checkFileType(url){
                console.log(url);
                if(this.isVideoType(url)){
                    this.isVideo=true;
                }else if(this.isAudioType(url)){
                    this.isAudio=true
                }else{
                    console.log("nothing");
                }
            },
            isVideoType(name){
                let videoTypes=['mp4','mov','avi','rm','wmv','flv'];
                for(let i=0;i<videoTypes.length;i++){
                    if(name.toLowerCase().indexOf(videoTypes[i])!=-1){
                        return true;
                    }
                }
            },
            isAudioType(name){
                let videoTypes=['mp3','m4a','ogg','wav','wma','midi'];
                for(let i=0;i<videoTypes.length;i++){
                    if(name.toLowerCase().indexOf(videoTypes[i])!=-1){
                        return true;
                    }
                }
            },
            // 查询用户是否点赞
            getIsZan() {
                checkUserPraise(this.content.oid, USERINFO).then(res => {
                    this.isZan = res
                }).catch(err => {
                })
            },
            // 新增点赞
            handleAddPraises() {
                let userId = USERINFO.id
                if (this.isZan) {
                    cancelPraiseFront(this.content.oid, userId).then(res => {
                        this.content.praises=Number(this.content.praises)-1
                        this.getIsZan()
                    }).catch(err => {
                    })
                } else {
                    let self = this.content
                    let source = self.resourceAttribute === 5 ? InfoSource.SPECIAL_RESOURCE : InfoSource.FREE_RESOURCE
                    let params = {
                        imageurl: self.inageUrl,
                        reloid: self.oid,
                        source: source,
                        title: self.title,
                        url: window.location.href,
                        userid: userId,
                        username: USERINFO.nickname
                    }
                    praises(params).then(res => {
                        this.content.praises=Number(this.content.praises)+1
                        this.getIsZan()
                    }).catch(err => {
                    })
                }
            },
            // 查询用户是否收藏
            getIsCollection() {
                isCollection(this.content.oid).then(res => {
                    this.isCollection = res
                }).catch(err => {
                })
            },
            // 新增/取消 收藏
            handleAddCollection() {
                if (this.isCollection) {
                    deleteCollection(this.content.oid).then(res => {
                        this.content.scount=Number(this.content.scount)-1
                        this.getIsCollection()
                    }).catch(err => {
                    })
                } else {
                    let self = this.content
                    let source = self.resourceAttribute === 5 ? InfoSource.SPECIAL_RESOURCE : InfoSource.FREE_RESOURCE
                    let params = {
                        imageurl: self.imgurl,
                        reloid: self.oid,
                        source: source,
                        title: self.title,
                        url: window.location.href,
                        userid: USERINFO.id,
                        username: USERINFO.nickname
                    }
                    addCollection(params).then(res => {
                        this.content.scount=Number(this.content.scount)+1
                        this.getIsCollection()
                    }).catch(err => {
                    })
                }
            },

            // 获取 活动形式 数据 一级分类
            getRestype() {
                restype().then(res => {
                    this.activityArry = res
                    this.getBasecode()
                }).catch(err => {
                })
            },
            //获取 类型 数据 艺术类型
            getBasecode() {
                let code = '011'
                basecode(code).then(res => {
                    this.typeArry = res
                    this.getData()
                }).catch(err => {
                })
            },
            // 页面顶部距离，会置顶
            handleTop() {
                let id = document.getElementById('top')
                id.scrollIntoView(true)
            },
	        // 新增分享
	        handleShare() {
		        if(!IS_WX){
			        let data = {
				        title: this.content.title,
				        img: URL + this.content.imgurl,
				        desc: self.content.title,
				        url: window.location.href.replace('code', 'none')
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
				        imageurl: self.url + self.content.imgurl,
				        reloid: self.$route.params.id,
				        source: InfoSource.SPECIAL_RESOURCE,
				        title: self.content.title,
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
            // 分享初始化
            initShare() {
                let t = Date.parse(new Date())
                let u = window.location.href
                //let codeUrl = ''
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
		                    "title":self.content.title,
		                    "link":u,
		                    "desc":self.content.title,
		                    "imgUrl":URL + self.content.imgurl,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: self.url + self.content.imgurl,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.SPECIAL_RESOURCE,
				                    title: self.content.title,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    self.isShare = false;
				                    setTimeout(function (){
					                    self.viewCount.shares++;
				                    },1000);
			                    }).catch(res=>{
				                    alert(JSON.stringify(res));
			                    })
		                    }
	                    });

	                    //分享给朋友
	                    wx.onMenuShareAppMessage({
		                    "title":self.content.title,
		                    "link":u,
		                    "desc":self.content.title,
		                    "imgUrl":URL + self.content.imgurl,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: URL + self.content.imgurl,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.NETGAMES,
				                    title: self.content.title,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    self.isShare = false;
				                    setTimeout(function (){
					                    self.viewCount.shares++;
				                    },1000);
			                    }).catch(res=>{
				                    alert(JSON.stringify(res));
			                    })
		                    }
	                    });
	                    //分享到QQ
	                    wx.onMenuShareQQ({
		                    "title":self.content.title,
		                    "link":u,
		                    "desc":self.content.title,
		                    "imgUrl":URL + self.content.imgurl,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: self.url + self.content.imgurl,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.SPECIAL_RESOURCE,
				                    title: self.content.title,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    self.isShare = false;
				                    setTimeout(function (){
					                    self.viewCount.shares++;
				                    },1000);
			                    }).catch(res=>{
				                    alert(JSON.stringify(res));
			                    })
		                    }
	                    });
	                    //分享到QQ空间
	                    wx.onMenuShareQZone({
		                    "title":self.content.title,
		                    "link":u,
		                    "desc":self.content.title,
		                    "imgUrl":URL + self.content.imgurl,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: self.url + self.content.imgurl,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.SPECIAL_RESOURCE,
				                    title: self.content.title,
				                    url: window.location.href,
				                    userid: USERINFO.id,
				                    username: USERINFO.username
			                    }
			                    shares(params).then(res => {
				                    self.isShare = false;
				                    setTimeout(function (){
					                    self.viewCount.shares++;
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
                return y === 0 ? '正在征集' : '征集结束'
            },
            fontNum(f) {
                return f.length > 20 ? f.substr(0, 20) + '...' : f
            }
        }
    }
</script>

<style>

</style>
