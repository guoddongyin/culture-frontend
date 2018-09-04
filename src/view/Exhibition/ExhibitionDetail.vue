<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>逛展览</span>
        </div>
        <div id="top" class="homeCenter" :style="content.enrollWay===1?'margin-bottom: 1.16rem':'margin-bottom: 0'">
            <div class="contents" style="margin-bottom: 0.28rem">
                <div class="Accontent" style="margin-bottom: 0">
                    <div class="images">
                        <img v-lazy="url+content.imageurl" alt="">
                        <!--<span>{{ content.enrollWay | IsEnroll }}</span>-->
                    </div>
                    <div class="title">{{ content.exhname }}</div>
                    <div class="tags" style="border-bottom: none">
                        <span v-for="(item,index) in content.arttypename" :key="index" class="tagType">{{ item }}</span>
                    </div>
                </div>
                <div class="activitiesTime">
                    <div style="color: #666666">展览时间：{{ content.starttime | times }} 至 {{ content.endtime | times }}
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
            <div class="activitiesContent">
                <div class="activitiesIntroduce">
                    展览主题
                    <i></i>
                </div>
                <div class="contentIntroduce" v-html="content.content"></div>
                <div class="contact" style="padding: 0.2rem 0.2rem 0.2rem 0;border-bottom: 1px solid #e5e5e5">
                    <div class="flexBettwens rows">
                        <div>
                            <div style="width: 1.5rem">主办方：</div>
                            <b>{{ content.addOrgName }}</b>
                        </div>
                        <i @click="handleToFollow">{{ isFollow | follow }}</i>
                    </div>
                </div>
                <div class="contact">
                    <div>{{ content.sname }}</div>
                    <div>{{ content.spaceAddr }}</div>
                </div>
            </div>
            <div class="activitiesContent" style="padding-left: 0;margin-bottom:0.8rem;">
                <div class="activitiesIntroduce flexBettwens" style="padding-right: 0.4rem;margin: 0 0 0.4rem 0.4rem;">
                    <div class="flex">
                        展览作品
                        <i></i>
                    </div>
                    <div class="searchAuth">
                        <input v-model="searchTxt" @input="handleSearch" type="text" placeholder="作品">
                        <span class="iconfont icon-sousuo1"></span>
                    </div>
                </div>
                <div @click="handleWork(item)" v-for="(item,index) in workArr" :key="index">
                    <div class="worksImg">
                        <img v-lazy="url+item.imageurl" alt="">
                        <div class="worker">{{ item.author }} {{ item.addtime | times }}</div>
                    </div>
                    <div class="worksInfo" style="padding: 0.4rem">
                        <p>{{ item.content }}</p>
                    </div>
                </div>
                <div @click="clickMore"  class="clickMore" v-if="workArr.length>0">{{loadingTxt}}</div>
            </div>
        </div>
        <div @click="handleEnroll" v-if="content.activityId" class="bottomBtn">
            前往参观活动
        </div>
        <div @click="isShare=false" v-if="isShare" class="shareBg">
            <div class="bg"></div>
            <img :src="wxImg" alt="" width="100%">
        </div>
    </div>
</template>

<script>
    import {
        exhibitioshow,                             // 获取数据
        restype,                                // 活动类型
        basecode,                               // 获取基础数据 011：艺术分类  019:评论选项
        addevaluation,                          // 新增评论
        getResourceEvaluationList,              // 获取评论列表
        edetailAll,                             // 获取作品列表
        edetailName,                            // 通过作品名称搜索作品列表
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
        shares,
    } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';
    import { JsBridge } from '../../jsbridge/jsbridge'

    export default {
        name: '',
        data() {
            return {
                url: URL,
                content: [],
                serImg: require('../../assets/re1.png'),
                searchTxt: '',
                isFollow: false,                  // 是否关注
                isEnroll: true,                  // 是否报名
                isZan: false,                    // 是否点赞
                isCollection: false,             // 是否收藏
                viewCount: [],                  // 浏览量点赞量等
                activityArry: [],               // 活动门类数组
                typeArry: [],                   // 艺术类型数组
                workArr: [],                     // 作品数组
                isShare: false,
                wxImg: require('../../assets/ac.png'),
                tempUserID:'',
	            loadingTxt: '点击加载',        // 正在加载的显示
	            total: 0,                        // 总数
	            offset: 0,                       // 页数，默认0
	            limit: 10,                       // 每次查询的条数
	            loading: false,                  // 滚动加载提示
            }
        },
	    watch: {
		    workArr(s) {
			    this.loadingTxt = s.length >= this.total ? '所有数据已加载完毕' : '点击加载'
		    }
	    },
        methods: {
            // 返回
            handleBack() {
                window.history.back()
            },
	        clickMore(){
		        let allCount = true
		        let id = this.$route.params.id
		        this.offset=this.offset+this.limit;
		        if (this.total > this.offset) {
			        this.loading = true
			        this.loadingTxt = '正在加载...';
			        //console.log(this.idid);
			        //edetailAll(this.idid ,this.offset,this.limit,this.athor).then(res=>{
				        edetailAll(id,this.limit,allCount,this.offset).then(res=>{
				        	console.log(res.data)
				        let arr = res.data;
				        this.workArr.push(...arr);
				        this.loading = false
				        this.loadingTxt = '点击加载'
			        }).catch(err=>{
				        console.log(err.response)
			        })
		        } else {
			        this.loadingTxt = '所有数据已加载完毕'
		        }
	        },
            // 通过路由传的ID获取详情数据
            getData() {
                let id = this.$route.params.id
                exhibitioshow(id).then(res => {
                    res.exhibition.arttype = res.exhibition.arttype.split(',')
                    this.content = res.exhibition
	                console.log('------uuuuuu')
                    console.log(this.content)
//                    this.content.arttype.map((m, i) => this.typeArry.map(t => this.content.arrtype[i] === t.codeStr ? this.content.arttype[i] = t.codeName : ''))
                    this.typeArry.map(t => this.content.arttype.map((m, i) => this.content.arttype[i] === t.codeStr ? this.content.arttype[i] = t.codeName : ''))
                    console.log('------')
                    console.log(this.content.arttype)
//                    this.typeArry.map(t => this.content.arttype === t.codeStr ? this.content.arttype = t.codeName : '')
                    this.viewCount = res.viewCount
                    // 执行其他方法获取数据
                    if (USERINFO) {
                      this.tempUserID=USERINFO.id;
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
                    this.getEdetailAll()
                    Indicator.close()
                }).catch(err => {
                    console.log(err.response)
                })
            },
	        // 获取作品列表
	        getEdetailAll() {
		        let id = this.$route.params.id
		        //let limit = 1
		        let allCount = true
		        edetailAll(id, this.limit,allCount,this.offset).then(res => {
			        console.log(res)
			        this.total = res.headers['x-total-count'];
			        console.log(this.total)
			        this.workArr=res.data;
		        }).catch(err => {
			        console.log(err.response)
		        })
	        },
            // 查询用户是否关注机构
            getIsFollow() {
                let id = this.content.addOrg
                isFollow(id).then(res => {

                }).catch(err => {
                    console.log(err.response)
                    if (err.response.data.res === 51301) {
                        console.log('已关注')
                        this.isFollow = true
                    } else if (err.response.data.res === 51302) {
                        console.log('未关注')
                        this.isFollow = false
                    }
                })
            }
            ,
            // 添加/取消 关注
            handleToFollow() {
                if (USERINFO) {
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
                      Indicator.close();
                      this.getIsFollow()
                    }).catch(err => {
                        console.log(err.response)
                      Indicator.close();
                    })
                } else {
                    this.$router.push('/Login')
                }
            }
            ,
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
                this.viewCount.count = Number(this.viewCount.count) - 1
//                            this.isZan=!this.isZan
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
                title: self.exhname,
                url: window.location.href,
                userid: userId,
                username: USERINFO?USERINFO.nickname:'',
              }
              praises(params).then(res => {
                console.log(res)
                this.viewCount.count = Number(this.viewCount.count) + 1
//                            this.isZan=!this.isZan
                this.getIsZan()
              }).catch(err => {
                console.log(err.response)
              })
            }
//                    this.getData()
          },
            // 新增分享
            handleShare() {
                if (!IS_WX) {
                    let data = {
                        title: this.content.exhname,
                        img: URL + this.content.imageurl,
	                    desc:this.content.exhname,
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
                    source: InfoSource.EXHIBITIONHISTORY,
                    title: self.content.exhname,
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
                            source: InfoSource.EXHIBITIONHISTORY,
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
                isCollection(this.content.oid).then(res => {
                    console.log('是否收藏' + res)
                    this.isCollection = res
                }).catch(err => {
                    console.log(err.response)
                })
            }
            ,
            // 新增/取消 收藏
            handleAddCollection() {
                if (USERINFO) {
                    if (this.isCollection) {
                        deleteCollection(this.content.oid).then(res => {
                            console.log(res)
                            this.viewCount.scount=Number(this.viewCount.scount)-1
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
                            title: self.exhname,
                            url: window.location.href,
                            userid: USERINFO.id,
                            username: USERINFO.nickname
                        }
                        addCollection(params).then(res => {
                            console.log(res)
                            this.viewCount.scount=Number(this.viewCount.scount)+1
                            this.getIsCollection()
                        }).catch(err => {
                            console.log(err.response)
                        })
                    }
                } else {
                    this.$router.push('/Login')
                }

            }
            ,
            // 获取 活动形式 数据 一级分类
            getRestype() {
                Indicator.open()
                restype().then(res => {
                    console.log(res)
                    this.activityArry = res
                    this.getBasecode()
                }).catch(err => {
                    console.log(err.response)
                })
            }
            ,
            //获取 类型 数据 艺术类型
            getBasecode() {
                let code = '011'
                basecode(code).then(res => {
                    console.log(res)
                    this.typeArry = res
                    this.getData()
                }).catch(err => {
                    console.log(err.response)
                })
            }
            ,

            // 根据名字搜索作品
            handleSearch() {
                console.log(this.searchTxt)
                let id = this.$route.params.id
                let name = this.searchTxt
                let limit = 20
                let allCount = true
                edetailName(id, name, limit, allCount).then(res => {
                    console.log(res)
                    this.workArr = res
                }).catch(err => {
                    console.log(err.response)
                })
            }
            ,
            // 前往作品详情页
            handleWork(item) {
                this.$router.push('/WorkPage/' + item.oid)
            }
            ,
            // 前往报名页面
            handleEnroll() {
//                let id = this.$route.params.id
                this.$router.push('/Activities/' + this.content.activityId)
            }
            ,
            // 页面顶部距离，会置顶
            handleTop() {
                let id = document.getElementById('top')
                id.scrollIntoView(true)
            },
            // 分享初始化
            initShare() {
            	//alert(dddd)
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
                            title:self.content.exhname,
                            link:u,
	                        desc:self.content.exhname,
                            imgUrl:self.url+self.content.imageurl,
                            success:function () {
                            	console.log('ssssss')
                              let params = {
                                content: "string",
                                destination: 1,
                                imageurl: URL + self.content.imageurl,
                                reloid: self.$route.params.id,
                                source: InfoSource.EXHIBITIONHISTORY,
                                title: self.content.exhname,
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
	                              console.log('ssssss')
                              })
                            }
                        })
                        //分享到朋友
                        wx.onMenuShareAppMessage({
                            title:self.content.exhname,
                            link:u,
	                        desc:self.content.exhname,
                            imgUrl:URL + self.content.imageurl,
                            success:function () {
                              let params = {
                                content: "string",
                                destination: 1,
                                imageurl: URL + self.content.imageurl,
                                reloid: self.$route.params.id,
                                source: InfoSource.EXHIBITIONHISTORY,
                                title: self.content.exhname,
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
		                    title:self.content.exhname,
		                    link:u,
		                    desc:self.content.exhname,
		                    imgUrl:self.url+self.content.imageurl,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: URL + self.content.imageurl,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.EXHIBITIONHISTORY,
				                    title: self.content.exhname,
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
		                    title:self.content.exhname,
		                    link:u,
		                    desc:self.content.exhname,
		                    imgUrl:self.url+self.content.imageurl,
		                    success:function () {
			                    let params = {
				                    content: "string",
				                    destination: 1,
				                    imageurl: URL + self.content.imageurl,
				                    reloid: self.$route.params.id,
				                    source: InfoSource.EXHIBITIONHISTORY,
				                    title: self.content.exhname,
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
            }
        },
        created() {
            this.getRestype()
        }
        ,
        mounted() {
            this.handleTop()
	        this.initShare()
        }
        ,
        filters: {
            IsEnroll(y) {
                return y === 0 ? '无需报名，直接进入' : '前往观看'
            }
            ,
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
