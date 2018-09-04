<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>参活动</span>
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
        <div id="top" class="homeCenter" :style="content.enrollWay===1?'margin-bottom: 1.16rem':'margin-bottom: 0'">
            <div class="contents" style="margin-bottom: 0.28rem">
                <div class="Accontent">
                    <div class="images">
                        <img v-lazy="url+content.cover" alt="">
                        <span v-if="content.waitState!=-1">{{ content.waitState | IsEnroll }}</span>
                    </div>
                    <div class="title"><img v-lazy="mf" alt="">{{ content.name }}</div>
                    <div class="tags">
                        <span class="tagShape">{{ content.shapename }}</span>
                        <span v-for="(typename,index) in typeName" :key="" class="tagType">{{ typename }}</span>
                    </div>
                </div>
                <div class="activitiesTime">
                    <div style="color: #666666">活动时间：{{ content.startTime }} 至 {{ content.endTime }}
                    </div>
                    <div v-if="content.enrollWay===1" style="margin-top: 0.2rem" class="flexBettwens">
                        <div style="color: #666666">报名时间：{{ content.enrollStartTime }} 至 {{ content.enrollEndTime }}</div>
                    </div>
                    <div v-if="content.enrollWay===1">剩余名额: <span>{{ content.enrollNumber - content.enrollCount-(content.enrollReserveNumber||0) }}</span></div>
                </div>
                <div class="operation">
                    <div class="browse"><i class="iconfont icon-liulan"></i>{{ content.vcount }}</div>
                    <div @click="handleAddPraises" class="good">
                        <i :class="isZan?'iconfont icon-duduyinleappicon1501':'iconfont icon-dianzan'"></i>{{ content.count
                        }}
                    </div>
                    <div @click="handleShare" class="share"><i class="iconfont icon-fenxiang"></i>{{ content.sharecount
                        }}
                    </div>
                    <div @click="handleAddCollection" class="collection">
                        <i :class="isCollection?'iconfont icon-shoucang':'iconfont icon-shoucang1'"></i>{{ content.scount
                        }}
                    </div>
                </div>
            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce">
                    活动介绍
                    <i></i>
                </div>
                <div class="contentIntroduce" v-html="content.introduction"></div>
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
                        <b>{{ content.linkman }}</b>
                    </div>
                    <div class="rows">
                        <div style="width: 2rem">联系方式：</div>
                        <b>{{ content.phone }}</b>
                    </div>
                    <div class="flexBettwens rows">
                        <div>
                            <div style="width: 2rem">活动地址：</div>
                            <b>{{ content.cityName}}{{ content.areaName }}{{ content.streetName }}{{content.address}}</b>
                        </div>
                        <div @click="handleToMap" class="iconfont icon-map"></div>
                    </div>
                </div>
            </div>
            <div class="service">
                <div v-if="content.volunteer">
                    <div class="serviceIntroduce">
                        <div class="flexBettwens">
                            <div class="flexs">服务提供方 <i></i></div>
                            <div class="iconfont icon-down"></div>
                        </div>
                    </div>
                    <div class="serviceContent">
                        <img v-lazy="url+content.volHeadImg" alt="">
                        <div style="width: 7rem">
                            <div class="serviceName">{{ content.volunteer }}</div>
                            <div v-html="content.volContent"></div>
                        </div>
                    </div>
                </div>

                <div v-if="content.itemNames" class="list">
                    <div class="listName">节目清单</div>
                    <div class="lists">
                        <div class="listContent">
                            <div>1</div>
                            <span>五掌十三式</span>
                        </div>
                        <div class="listContent">
                            <div>2</div>
                            <span>五掌十四式</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="activiteisMap">
                活动地址： <b>{{ content.cityName}}{{ content.areaName }}{{ content.streetName }}{{content.address}}</b>
            </div>
            <div class="acAmap">
                <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
                    <el-amap-marker v-for="(marker,index) in markers" :position="marker.position"
                                    :visible="marker.visible" :key="index"></el-amap-marker>
                </el-amap>
            </div>
            <div class="comment">
                <div class="commentName">学员评论 <i></i></div>
                <div class="comments" v-for="(item,index) in comment" :key="index">
                    <div class="commentContent">
                        <img :src="item.imageurl" alt="">
                        <div class="commentUser">
                            <span>{{ item.username }}</span>
                            <div>{{ item.opertime | times }}</div>
                        </div>
                    </div>
                    <div class="commentText">
                        {{ item.content }}
                    </div>
                </div>
                <div @click="getMoreEvaList" v-if="comment.length>0" class="clickMore">{{ loadingTxt }}</div>
            </div>
            <div @click="isShare=false" v-if="isShare" class="shareBg">
                <div class="bg"></div>
                <img :src="wxImg" alt="" width="100%">
            </div>
        </div>
        <div @click="handleEnroll" v-if="content.enrollState===1&&(content.enrollNumber - content.enrollCount-(content.enrollReserveNumber||0))>0" class="bottomBtn">
            {{ isEnroll ? '报 名' : '已 报 名' }}
        </div>
        <div id="container"></div>
        <div style="display: none;" id="panel"></div>
    </div>
</template>

<script>
    import {
        activities,                             // 获取数据
        restype,                                // 活动类型
        basecode,                               // 获取基础数据 011：艺术分类  019:评论选项
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
        shares,
        wxShare,
    } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';
    import { JsBridge } from '../../jsbridge/jsbridge'

    export default {
        name: '',
	    watch: {
		    comment(s) {
			    this.loadingTxt = s.length >= this.total ? '所有数据已加载完毕' : '点击加载'
		    }
	    },
        data() {
            return {
                url: URL,
                rightPop: false,                    // 右侧弹窗控制器
                zoom: 14,
                center: [0, 0],
                markers: [
                    {
                        position: [0, 0],
                        visible: true,
                        draggable: false
                    }
                ],
                mf: require('../../assets/mf.png'),
                content: [],
                serImg: require('../../assets/re1.png'),
                comment: [],
                evArr: [],
                isFollow: false,                  // 是否关注
                isEnroll: true,                  // 是否报名
                isZan: false,                    // 是否点赞
                isCollection: false,             // 是否收藏
                activityArry: [],
                typeArry: [],
                tolat: '',
                tolng: '',
                isShare: false,
                wxImg: require('../../assets/ac.png'),
                lng: '',
                lat: '',
                test:'',
                tempUserID:'',
	            offset:'',
	            total:0,
	            typeName:''
            }
        },
        methods: {
            // 地图定位经纬度
            init() {
                // var self = this
                // var map, geolocation;
                // //加载地图，调用浏览器定位服务
                // map = new AMap.Map('container', {
                // });
                // map.plugin('AMap.Geolocation', function () {
                //     geolocation = new AMap.Geolocation({
                //         enableHighAccuracy: true,//是否使用高精度定位，默认:true
                //         timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                //         buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                //         zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                //         buttonPosition: 'RB',
                //         zoom: 10 //地图显示的缩放级别
                //     });
                //     map.addControl(geolocation);
                //     geolocation.getCurrentPosition();
                //     AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                //     AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
                // });
              let o = amapManager.getMap();
              let marker = new AMap.Marker({
                position: [121.59996, 31.177646]
              });

              marker.setMap(o);

                //解析定位结果
                function onComplete(data) {
                    self.mapAddr = data.formattedAddress
                    self.lng = data.position.getLng()
                    self.lat = data.position.getLat()
                }

                //解析定位错误信息
                function onError(data) {
//                    Toast('定位失败' )
                    self.mapAddr = '定位失败'
                }
            },
            // 打开导航
            handleToMap() {
                let self = this
                let data = {
                    targetLatitude: this.tolat,
                    targetLongitute: this.tolng,
                    toName: this.content.address
                }
                if (IS_WX) {
                    var map = new AMap.Map('container')
                    var walking = new AMap.Driving({
                        map: map,
                        panel: 'panel',
                    })
                    walking.search([self.lng, self.lat], [data.targetLongitute, data.targetLatitude], function (status, result) {
                        console.log(result)
                        walking.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
                    map.addControl(new AMap.ToolBar());
                } else {
                    JsBridge.callHandler('MapNav', data, (data) => {
                    })
                }
            },
            // 返回
            handleBack() {
                this.$router.go(-1)
            },
            // 通过路由传的ID获取详情数据
            getData() {
                Indicator.open()
                let id = this.$route.params.id
                activities(id).then(res => {
                    console.log(res)
                    // 如果需要报名，则显示报名起止时间，并分割字符

                    if (res.enrollWay === 1) {
                        res.enrollStartTime = res.enrollStartTime.substr(0, 16)
                        res.enrollEndTime = res.enrollEndTime.substr(0, 16)
                    }
                    res.startTime = res.startTime.substr(0, 16)
                    res.endTime = res.endTime.substr(0, 16)
                    res.type = res.type.split(',')
                    this.content = res
	                this.typeName=this.content.typename.split(',');
                    ///console.log(this.typeName)
                    console.log('dddddd')
                    this.content.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? this.content.type[i] = t.codeName : ''))
                    this.activityArry.map(t => t.codeStr === this.content.shape ? this.content.shape = t.codeName : '')
                    this.center = [res.lng, res.lat]
                    this.markers[0].position = [res.lng, res.lat]
                    this.tolat = res.lat
                    this.tolng = res.lng
                    // 执行其他方法获取数据
                  if (USERINFO) {
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
                    this.getEvaluationList()
                }).catch(err => {
                    console.log('错了？')
                    console.log(err)
                    Indicator.close()
                    Toast('获取失败')
                    this.$router.go(-1)
                })
            },
            // 查询用户是否关注机构
            getIsFollow() {
                let id = this.content.sponsorId
                isFollow(id).then(res => {
                    console.log(res)
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
            },
            // 添加/取消 关注
            handleToFollow() {
                if (USERINFO) {
                  Indicator.open();
                    let type = this.isFollow ? -1 : 0
                    let userInfo = USERINFO
                    let params = {
                        clientid: '',
                        id: userInfo.id,
                        orgid: this.content.sponsorId,
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
            },
            // 查询用户是否已报名
            getEnrollInfo() {
                // let id = this.$route.params.id
                // let userInfo = USERINFO
                // let phone = userInfo.mobile
                // isenroll(id, phone).then(res => {
                //     console.log(res)
                //     if (res.applyState === 1) {
                //         this.isEnroll = false
                //     }
                // }).catch(err => {
                //     console.log(err.response)
                // })
            },

            // 获取评论资源
            getEvaluationList() {
                let id = this.$route.params.id   // 资源标识
                let limit = 10                    // 返回条数。范围[1,100],缺省20
                let count = true                  // 是否查询总条数.缺省true
                let offset=0;
                console.log(1)
                getResourceEvaluationList(id, offset,limit, count).then(res => {
                    console.log(res)
                    this.comment = res
                    this.total=res.length;
                }).catch(err => {
                    console.log(err.response)
                })
                Indicator.close()
            },
            getMoreEvaList(){
	            let id = this.$route.params.id   // 资源标识
	            let limit = 5                    // 返回条数。范围[1,100],缺省20
	            let count = true                  // 是否查询总条数.缺省true
	            this.offset+=limit;
	            getResourceEvaluationList(id, this.offset,limit, count).then(res => {
		            this.comment.concat(res);
	            }).catch(err => {
		            console.log(err.response)
	            })
	            Indicator.close()
            },
            // 查询用户是否点赞
            getIsZan() {
                checkUserPraise(this.content.id, this.tempUserID).then(res => {
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
                        cancelPraiseFront(this.content.id, userId).then(res => {
                            console.log(res)
                            this.content.count = Number(this.content.count) - 1
//                            this.isZan=!this.isZan
                            this.getIsZan()
                        }).catch(err => {
                            console.log(err.response)
                        })
                    } else {
                        let self = this.content
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
                            this.content.count = Number(this.content.count) + 1
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
              let self = this;
                if (!IS_WX) {
                    let data = {
                        title: this.content.name,
                        desc:this.content.name,
                        img: URL + this.content.cover,
                        url: window.location.href.replace('code','none'),
                    }
                    JsBridge.callHandler(
                        'share',
                        data,
                        function (r) {

                        }
                    )
                  let params = {
                    content: "string",
                    destination: 1,
                    imageurl: URL + self.content.cover,
                    reloid: self.$route.params.id,
                    source: InfoSource.ACTIVITY,
                    title: self.content.name,
                    url: window.location.href,
                    userid: USERINFO.id,
                    username: USERINFO.username
                  }
                  shares(params).then(res => {
                    console.log(res);
                    setTimeout(function (){
                      self.content.sharecount++;
                    },1000);
                  }).catch(res=>{
                  })
                } else {
                    this.isShare = true;
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
                      self.test=JSON.stringify(res);
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
                isCollection(this.content.id).then(res => {
                    console.log('是否收藏' + res)
                    this.isCollection = res
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 新增/取消 收藏
            handleAddCollection() {
                if (USERINFO) {
                    if (this.isCollection) {
                        deleteCollection(this.content.id).then(res => {
                            console.log(res)
                            this.content.scount = Number(this.content.scount) - 1
//                            this.isCollection=!this.isCollection
                            this.getIsCollection()
                        }).catch(err => {
                            console.log(err.response)
                        })
                    } else {
                        let self = this.content
                        let params = {
                            imageurl: self.cover,
                            reloid: self.id,
                            source: InfoSource.ACTIVITY,
                            title: self.name,
                            url: window.location.href,
                            userid: USERINFO.id,
                            username: USERINFO.nickname
                        }
                        addCollection(params).then(res => {
                            console.log(res)
                            this.content.scount = Number(this.content.scount) + 1
//                            this.isCollection=!this.isCollection
                            this.getIsCollection()
                        }).catch(err => {
                            console.log(err.response)
                        })
                    }
                } else {
                    this.$router.push('/Login')
                }

            },

            // 获取 活动形式 数据 一级分类
            getRestype() {
                restype().then(res => {
                    console.log(res)
                    this.activityArry = res
                    this.getBasecode()
                }).catch(err => {
                    console.log(err.response)
                })
            },
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
            },

            // 发表评论
            handleEv(item) {
                let user = USERINFO
                console.log(user)
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
            handleOpenEv() {
                if (USERINFO) {
                    this.rightPop = true
                } else {
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

            // 前往报名页面
            handleEnroll() {
                console.log(this.content)
                if (this.isEnroll === false) {
                    Toast('已报名')
                } else {
                    if (this.content.enrollState === 1) {
                        let id = this.$route.params.id
                        this.$router.push('/OnlineEnroll/' + id)
                    } else if (this.content.enrollState === 2) {
                        Toast('已经结束')
                    }
                }
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
                let openid='';
                if(USERINFO&&USERINFO.openid){
                    openid=USERINFO.openid;
                }else{
                  openid='ouCdR0q0TIFNS86gSiNI0TCTAx7A';
                }
                wxShare(t, '1', u,openid).then(res => {
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
                            title:self.content.name,
                            link:u,
	                        desc:self.content.name,
                            imgUrl:URL + self.content.cover,
                            success:function () {
                              let params = {
                                content: "string",
                                destination: 1,
                                imageurl: URL + self.content.cover,
                                reloid: self.$route.params.id,
                                source: InfoSource.ACTIVITY,
                                title: self.content.name,
                                url: window.location.href,
                                userid: USERINFO.id,
                                username: USERINFO.username
                              }
                              shares(params).then(res => {
                                console.log(res);
                                self.isShare = false;
                                setTimeout(function (){
                                  self.content.sharecount++;
                                },1000);
                              }).catch(res=>{
                              })
                            }
                        })
                        wx.onMenuShareAppMessage({
                            //分享到朋友
                            title:self.content.name,
                            link:u,
	                        desc:self.content.name,
                            imgUrl:URL + self.content.cover,
                            success:function () {
                              let params = {
                                content: "string",
                                destination: 1,
                                imageurl: URL + self.content.cover,
                                reloid: self.$route.params.id,
                                source: InfoSource.ACTIVITY,
                                title: self.content.name,
                                url: window.location.href,
                                userid: USERINFO.id,
                                username: USERINFO.username
                              }
                              shares(params).then(res => {
                                //console.log(res);
                                self.isShare = false;
                                setTimeout(function (){
                                  self.content.sharecount++;
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
            this.getEvList()
            this.init()
        },
        mounted() {
            this.handleTop()
            this.handleShareOver()
            this.initShare()
        },
        filters: {
            IsEnroll(s) {
                return s===-1?'还未开始':s === 0 ? '即将开始' : s === 1 ? '正在进行' : '已经结束'
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
