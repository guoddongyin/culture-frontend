<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>享课程</span>
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
        <div id="top" class="homeCenter" :style="content.waitState===1?'margin-bottom: 1.16rem':'margin-bottom: 0'">
            <div class="contents" style="margin-bottom: 0.28rem">
                <div class="Accontent">
                    <div class="images">
                        <img v-lazy="url+content.img" alt="">
                        <span v-if="content.waitState!=-1">{{ content.waitState | IsEnroll }}</span>
                    </div>
                    <div class="title" style="position: relative;">
                        <img v-lazy="mf" alt="">{{ content.name }}
                        <!--<div style="background-color: #ff883e;color: #ffffff;text-align: center;margin-left:0.5rem;-->
                        <!--font-size: 0.3466rem;display: inline-block;width:2rem;height:0.7rem;line-height: 0.7rem;border-radius: 20px;"-->
                             <!--@click="handleEnroll" v-if="content.bmfs==='2'&&(content.waitState===0)&&(Number(content.allnumber)-Number(enrollNum)-(Number(content.reservenumber )||0))>0">-->
                            <!--{{ isEnroll ? '报 名' : '已 报 名' }}-->
                        <!--</div>-->
                    </div>
                    <div class="tags">
                        <span v-if="content.shape" class="tagShape">{{ content.shape }}</span>
                        <span v-for="(item,index) in content.type" class="tagType">{{ item }}</span>
                    </div>
                </div>
                <div class="activitiesTime">
                    <div style="color: #666666">开班时间：{{ content.stattime | formatDate }} 至 {{ content.endtime | formatDate }}
                    </div>
                    <div v-if="content.bmfs==2" style="margin-top: 0.2rem" class="flexBettwens">
                        <div style="color: #666666">报名时间：{{ content.signupstarttime | formatDate}}至{{ content.signupendtime | formatDate }}
                        </div>
                    </div>
                    <div>剩余名额: <span>{{ Number(content.allnumber)-Number(enrollNum)-(Number(content.reservenumber )||0) }}</span></div>
                </div>
                <div class="operation">
                    <div class="browse"><i class="iconfont icon-liulan"></i>{{ content.vcount }}</div>
                    <div @click="handleAddPraises" class="good">
                        <i :class="isZan?'iconfont icon-duduyinleappicon1501':'iconfont icon-dianzan'"></i>
                        {{ content.count }}
                    </div>
                    <div @click="handleShare" class="share"><i class="iconfont icon-fenxiang"></i>
                        {{ content.sharecount }}
                    </div>
                    <div @click="handleAddCollection" class="collection">
                        <i :class="isCollection?'iconfont icon-shoucang':'iconfont icon-shoucang1'"></i>
                        {{ content.scount }}
                    </div>
                </div>
            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce">
                    培训介绍
                    <i></i>
                </div>
                <div class="contentIntroduce" v-html="content.shortcontent"></div>
                <div class="contact">
                    <div class="flexBettwens rows">
                        <div>
                            <div style="width: 2rem">主办方：</div>
                            <b>{{ content.orgname }}</b>
                        </div>
                        <i @click="handleToFollow">{{ isFollow | follow }}</i>
                    </div>
                    <div class="rows">
                        <div style="width: 2rem">联系人：</div>
                        <b>{{ content.linkman }}</b>
                    </div>
                    <div class="rows">
                        <div style="width: 2rem">联系方式：</div>
                        <b>{{ content.telphone }}</b>
                    </div>
                    <div class="rows">
                        <div style="width: 2rem">培训教师：</div>
                        <b>{{ content.volname }}</b>
                    </div>
                    <div class="flexBettwens rows">
                        <div>
                            <div style="width: 2rem">培训地址：</div>
                            <b v-if="content.addr">{{ content.addr.city }}{{ content.addr.district }}{{ content.addr.street }}{{ content.addr.detail }}</b>
                        </div>
                        <div @click="handleToMap" class="iconfont icon-map"></div>
                    </div>
                </div>
            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce">
                    开班信息
                    <i></i>
                </div>
                <div class="contentIntroduce">
                    <div>
                        <span @click="ToChinese">上课时间：</span>
                        <span v-if='content.teachtimetype==1'>{{ '每天'+content.teachtime }}</span>
                        <span v-else-if='content.teachtimetype==2'>{{'每周'+ chinese + content.teachtime }}</span>
                    </div>
                    <div>
                        <span>开班时间：</span>
                        <span>{{ content.stattime | formatDate }} 至 {{ content.endtime | formatDate }}</span>
                    </div>
                    <!--<div>-->
                        <!--<span>开班要求：</span>-->
                        <!--<span>{{ content.content | state }}</span>-->
                    <!--</div>-->
                    <div>
                        <span>报名须知：</span>
                        <span>{{ content.bmyq || '无' }}</span>
                    </div>
                    <div>
                        <span>学习地址：</span>
                        <span v-if="content.addr">{{ content.addr.city }}{{ content.addr.district }}{{ content.addr.street }}{{ content.addr.detail }}</span>
                    </div>

                </div>
            </div>
            <div class="activitiesContent">
                <div class="activitiesIntroduce">
                    课程安排
                    <i></i>
                </div>
                <div class="contentIntroduce">
                    <div class="flexBettwens">
                        <div style="text-align: center;width: 33%">课程名称</div>
                        <div style="text-align: center;width: 33%">培训时间</div>
                        <div style="text-align: center;width: 33%">课程简介</div>
                    </div>
                    <div v-for="(item,index) in content.course" :key="index" class="flexBS"
                         style="padding: 0.1rem 0.2rem;">
                        <div v-if="item.cn" style="text-align: center;width: 33%">
                            {{ item.cname | txt }}
                            <span @click="handleCn(item,index)" style="color: #fa711b">查看详情</span>
                        </div>
                        <div v-if="!item.cn" style="text-align: center;width: 33%">{{ item.cname }}
                            <span v-if="item.cname.length>15" @click="handleCn(item,index)"
                                  style="color: #fa711b">收起</span>
                        </div>
                        <div style="text-align: center;width: 33%">{{ item.showtime | times }}</div>
                        <div v-if="item.cc" style="text-align: center;width: 33%">
                            {{ item.content | txt }}<span @click="handleCc(item,index)"
                                                          style="color: #fa711b">查看详情</span>
                        </div>
                        <div v-if="!item.cc" style="text-align: center;width: 33%">{{ item.content }}
                            <span v-if="item.content.length>15" @click="handleCc(item,index)"
                                  style="color: #fa711b">收起</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="activiteisMap">
                培训地址： <b v-if="content.addr">{{ content.addr.city }}{{ content.addr.district }}{{ content.addr.street }}{{ content.addr.detail }}</b>
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
        <div @click="handleEnroll" v-if="content.bmfs==='2'&&(content.waitKBState ===1)&&(Number(content.allnumber)-Number(enrollNum)-(Number(content.reservenumber )||0))>0" class="bottomBtn">
            {{ isEnroll ? '报 名' : '已 报 名' }}
        </div>
        <div @click="isShare=false" v-if="isShare" class="shareBg">
            <div class="bg"></div>
            <img :src="wxImg" alt="" width="100%">
        </div>
        <div id="container"></div>
        <div style="display: none;" id="panel"></div>
    </div>
</template>

<script>





	import {
        freeItemsDetail,                        // 获取数据
        enrollnum,                              // 已报名人数
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
                add: '',                             // 记录地址
                rightPop: false,                    // 右侧弹窗控制器
                zoom: 14,
                center: [0, 0],
	            waitStatename:this.$route.query.waitStatename,
                markers: [
                    {
                        position: [0, 0],
                        visible: true,
                        draggable: false
                    }
                ],
                mf: require('../../assets/mf.png'),
                content: '',
                serImg: require('../../assets/re1.png'),
                comment: [],
                evArr: [],
                isFollow: false,                  // 是否关注
                isEnroll: true,                  // 是否报名
                isZan: false,                    // 是否点赞
                isCollection: false,             // 是否收藏
                activityArry: [],
                typeArry: [],
                lng: '',
                lat: '',
                isShare: false,
                wxImg: require('../../assets/ac.png'),
                enrollNum: '',
                tempUserID:'',
	            chinese:'',
	            teachweek:''
            }
        },

        methods: {
            //将数字转换成中文
	        ToChinese(){
	        	var self = this;
	            var number = self.teachweek;
	            //console.log(self.teachweek)
		        var N = ["一", "二", "三", "四", "五", "六", "七", "八", "九","零"];
	            function convertToChinese(num){
		            console.log(num)
		            var str = num.toString();
		            var len = num.toString().length;
		            var C_Num = [];
		            for(var i = 0; i <=len; i++){
			            C_Num.push(N[str.charAt(i)]);
		            }
		            return C_Num.join(' ');
	            }
		        self.chinese = convertToChinese(number);
            },

	        //返回
            handleBack() {
                window.history.back()
            },
            // 地图定位经纬度
            init() {
                var self = this
                var map, geolocation;
                //加载地图，调用浏览器定位服务
                map = new AMap.Map('container', {
                    resizeEnable: true
                });
                map.plugin('AMap.Geolocation', function () {
                    geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        buttonPosition: 'RB',
                        zoom: 10 //地图显示的缩放级别
                    });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                    AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
                });

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
                let addr = this.content.addr;
                console.log(addr);
                let data = {
                    targetLatitude: addr.location.lat,
                    targetLongitute: addr.location.lng,
                    toName: addr.street
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

            // 通过路由传的ID获取详情数据
            getData() {
                Indicator.open()
                let id = this.$route.params.id
                freeItemsDetail(id).then(res => {
                    //console.log("dddddddddddddd"+res)
                    res.addr = JSON.parse(res.addr)
                    // 如果需要报名，则显示报名起止时间，并分割字符
                    if (res.bmfs === 2) {
                    	console.log()
                        res.signupstarttime = this.timestampToTime(res.signupstarttime)
                        alert(res.signupstarttime)
                        res.signupendtime = res.signupendtime.split(' ')[0]
                    }
                    res.type = res.type.split(',')
	                console.log(res)
                    this.content = res
                    var teachweek=res.teachtimeweek;
	                this.teachweek = teachweek;
	                //console.log('ddd'+this.teachweek)
                    this.content.course.map(m => m.cn = m.cname.length > 15 ? true : false)
                    this.content.course.map(m => m.cc = m.content.length > 15 ? true : false)
                    //console.log(this.content.course)
                    this.content.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? this.content.type[i] = t.codeName : ''))
                    this.activityArry.map(t => t.codeStr === this.content.shape ? this.content.shape = t.codeName : '')
                    this.center = [res.addr.location.lng, res.addr.location.lat]
                    this.markers[0].position = [res.addr.location.lng, res.addr.location.lat]
                    let addr = this.content.addr
                    this.add = addr.district + addr.street
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
                    this.getEnrollNum()
	                this.ToChinese()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 查询已报名人数
            getEnrollNum() {
                enrollnum(this.$route.params.id).then(res => {
                    this.enrollNum = res
                })
            },

	        // 查询用户是否关注机构
            getIsFollow() {
                let id = this.content.orgid
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
                        orgid: this.content.orgid,
                        type: type
                    }
                    follows(params).then(res => {
                        console.log(res)
                      Indicator.close()
                      this.getIsFollow()
                    }).catch(err => {
                        console.log(err.response)
                      Indicator.close()
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
                //     if (res.waitState  === 1) {
                //         this.isEnroll = false
                //     }
                // }).catch(err => {
                //     console.log(err.response)
                // })
            },
            // 获取评论资源
            getEvaluationList() {
                let id = this.$route.params.id   // 资源标识
                let limit = 20                    // 返回条数。范围[1,100],缺省20
                let count = true                  // 是否查询总条数.缺省true
	            let offset=0;
                console.log(1)
                getResourceEvaluationList(id, offset,limit, count).then(res => {
                    //console.log(res)
                    this.comment = res
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
                source: InfoSource.FREEITEMS,
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
                if (!IS_WX) {
                    let data = {
                        title: this.content.name,
                        img: URL + this.content.img,
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
                    imageurl: URL + self.content.img,
                    reloid: self.$route.params.id,
                    source: InfoSource.FREEITEMS,
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
                    console.log(res)
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
                            this.getIsCollection()
                        }).catch(err => {
                            console.log(err.response)
                        })
                    } else {
                        let self = this.content
                        let params = {
                            imageurl: self.img,
                            reloid: self.id,
                            source: InfoSource.FREEITEMS,
                            title: self.name,
                            url: window.location.href,
                            userid: USERINFO.id,
                            username: USERINFO.nickname
                        }
                        addCollection(params).then(res => {
                            console.log(res)
                            this.content.scount = Number(this.content.scount) + 1
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
            // 课程名称展开
            handleCn(item, index) {
                item.cn = !item.cn
                this.content.course.splice(index, 1, item)
            },
            // 课程简介展开
            handleCc(item, index) {
                item.cc = !item.cc
                this.content.course.splice(index, 1, item)
            },
            // 前往报名页面
            handleEnroll() {
                if (this.isEnroll === false) {
                    Toast('已报名')
                } else {
                    let id = this.$route.params.id
                    this.$router.push('/CourseEnroll/' + id)
                }
            },
	        // 前往报名页面
	        // handleEnroll() {
		     //    console.log(this.content)
		     //    if (this.isEnroll === false) {
			 //        Toast('已报名')
		     //    } else {
			 //        if (this.content.enrollState === 1) {
				//         let id = this.$route.params.id
				//         this.$router.push('/CourseEnroll/' + id)
			 //        } else if (this.content.enrollState === 2) {
				//         Toast('已经结束')
			 //        }
		     //    }
	        // },
            // 页面顶部距离，会置顶
            handleTop() {
                let id = document.getElementById('top')
                id.scrollIntoView(true)
            },
            // 分享初始化
            initShare() {
                let t = Date.parse(new Date())
                let u = window.location.href
                let self = this
                wxShare(t, '1', u).then(res => {
                    console.log('-------------')
                    console.log(res)
                    console.log('-------------')
                    wx.config({
                        debug: false,
                        appId: res.appid, // 必填，公众号的唯一标识
                        timestamp: res.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.noncestr, // 必填，生成签名的随机串
                        signature: res.signature,// 必填，签名，见附录1
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'scanQRCode', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    })
                    wx.ready(function () {
	                    //发送给朋友圈
                        wx.onMenuShareTimeline({
                            title: self.content.name,
                            link: u,
	                        desc:self.content.name,
                            imgUrl: self.url + self.content.img,
                            success: function () {
                              let params = {
                                content: "string",
                                destination: 1,
                                imageurl:self.url + self.content.imgUrl,
                                reloid: self.$route.params.id,
                                source: InfoSource.FREEITEMS,
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
                                alert(JSON.stringify(res));
                              })
                            }
                        })
                        //发送给朋友
                        wx.onMenuShareAppMessage({
                            title: self.content.name,
                            link: u,
	                        desc:self.content.name,
                            imgUrl: self.url + self.content.img,
                            success: function () {
                              let params = {
                                content: "string",
                                destination: 1,
                                imageurl: URL + self.content.img,
                                reloid: self.$route.params.id,
                                source: InfoSource.FREEITEMS,
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
                                alert(JSON.stringify(res));
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
            setTimeout(() => {
                this.handleTop()
            }, 200)
            this.handleShareOver()
            this.initShare()
        },
        filters: {
	        formatDate(time) {
		        var d = new Date(time),
		          month = '' + (d.getMonth() + 1),
		          day = '' + d.getDate(),
		          year = d.getFullYear(),
		          hour=d.getHours(),
                  miner=d.getMinutes() ;

		        if (month.length < 2) month = '0' + month;
		        if (day.length < 2) day = '0' + day;
		        if (hour < 10) hour = '0' + hour;
		        if (miner < 10) miner = '0' + miner;
		        console.log(hour.length)
		        return [year, month, day].join('-') +' '+ hour + ' : ' + miner
	        },
            IsEnroll(y) {
              var statusName='';
              switch (y){
                case 0:statusName='即将开始';break;
                case 1:statusName='正在进行';break;
                case 2:statusName='已经结束';break;
              };
              return statusName;
            },
            follow(f) {
                return f === false ? '关注' : '已关注'
            },
            state(s) {
                return s === null ? '暂无' : s
            },
            txt(t) {
                return t.length > 15 ? t.substr(0, 15) + '...' : s
            },
            fontNum(f) {
                return f.length > 20 ? f.substr(0, 20) + '...' : f
            }
        }
    }
</script>

<style>

</style>
