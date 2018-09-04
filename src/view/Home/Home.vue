
<template>
    <div id="home">
        <div class="top">
            <div @click="rightPop=true" class="left">
                <span>{{ area }}</span>
                <i class="iconfont icon-down"></i>
            </div>
            <span @click="getUser" class="center">文化到家</span>
            <div @click="scan()" class="right">
                <i style="font-size: 20px" class="iconfont icon-saoyisao"></i>
            </div>
        </div>
        <div class="homeCenter">
            <mt-swipe :auto="4000" class="swipes">
                <mt-swipe-item v-if="index<4" v-for="(item,index) in cover" :key="index">
                    <img @click="handleImg(item)" v-lazy="url+item.cover" alt="" class="swipes">
                </mt-swipe-item>
            </mt-swipe>
            <div class="topNav">
                <div @click="handleActivity" class="topNavs">
                    <img :src="icon.chd" alt="">
                    <span>
                        参活动
                    </span>
                </div>
                <div @click="handleCourse" class="topNavs">
                    <img :src="icon.xkc" alt="">
                    <span>
                        享课程
                    </span>
                </div>
                <div @click="handleExhibition" class="topNavs">
                    <img :src="icon.kzl" alt="">
                    <span>
                        逛展览
                    </span>
                </div>
                <div @click="handelYY" class="topNavs">
                    <img :src="icon.yps" alt="">
                    <span>
                        约配送
                    </span>
                </div>
            </div>
            <div class="activity">
                <div @click="handleOpen" class="flexCenter">
                    <i class="iconfont icon-laba2"></i>
                    <a @click="toLive"><span>网络直播</span></a>
                </div>
                <div @click="handleWorks" class="flexCenter">
                    <i class="iconfont icon-idea"></i>
                    <span>网上活动</span>
                </div>
                <div @click="handleVote" class="flexCenter">
                    <i class="iconfont icon-toupiao"></i>
                    <span>投上一票</span>
                </div>
            </div>
            <div class="recommend">
                <i class="iconfont icon-dianying"></i>
                <span>为您推荐</span>
            </div>
            <div class="contents" style="background-color: #e5e5e5">
                <div v-for="(item,index) in content" class="content"
                     :key="index"
                     style="background-color: #ffffff"
                     @click="handleActivities(item)">
                    <div class="images">
                        <img v-lazy="url+item.cover" alt="">
                        <span v-if="item.bm">{{ item.bm}}</span>
                    </div>
                    <div class="title">{{ item.name | fontNum }}</div>
                    <div class="tags">
                        <div v-for="(t,index) in item.type" :key="index" class="tag">{{ t }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!--右侧弹窗-->
        <mt-popup
                v-model="rightPop"
                popup-transition="popup-fade"> popup-transition="popup-fade">
            <div @click="rightPop = false;" class="tops area-list-return"><i class=" iconfont icon-left"></i> <span></span></div>
            <div class="area-list" style="overflow: auto;height: 16rem">
                <div v-for="(citys,j) in city">
                    <div @click="handleAreaPick(citys,0)" style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5">
                        {{ citys.name }}
                    </div>
                </div>
                <div style="background-color: #999999;color: #ffffff;padding: 0.4rem;border-bottom: 1px solid #ffffff;">
                    区县（按首字母排序）
                </div>
                <div v-for="(c,i) in chatArr" :key="i">
                    <div style="background-color: #999999;color: #ffffff;padding: 0.4rem">{{ c }}
                    </div>
                    <div v-for="(item,index) in areaArry" :key="index">
                        <div @click="handleAreaPick(item)" style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5"
                             v-if="item.id!='0'&&item.id!='0'&&item.headChar===c">{{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
        </mt-popup>
        <div id="map-container"></div>
    </div>
</template>

<script>
	import { areas, recommend, basecode, homeTarget, wiki,valphone,openUser,wxlogin,userInfo,channelLog } from '../../api/api'
	import app from '../../App'
	import { JsBridge } from '../../jsbridge/jsbridge'
	import { Indicator, Toast } from 'mint-ui';

	export default {
		name: '',
		data() {
			return {
				url: URL,
				swipeImg: [{
					ImgUrl: require('../../assets/swipe1.png')
				}, {
					ImgUrl: require('../../assets/swipe1.png')
				}, {
					ImgUrl: require('../../assets/swipe1.png')
				}],
				content: [],
				re1: require('../../assets/re3.png'),
				icon: {
					chd: require('../../assets/chd.png'),
					xkc: require('../../assets/xkc.png'),
					kzl: require('../../assets/kzl.png'),
					yps: require('../../assets/yps.png')
				},
				city: [{ name: CITYNAME }, { name: CITYAREA }],
				areaArry: [],            //存储地区数据
				area: '' ,         //区域标识
				areaId: 0,
				chatArr: 'BCDFHJKLNPQRSTWXYZ'.split(''),
//                chatArr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
				rightPop: false,             // 右侧弹窗
				rrr: false,
				slots: [{
					values: [],
				}],
				lng: '',
				lat: '',
				evArr: '',
				cover: [],                    // 轮播图
				liveArea:'all',
			}
		},
		watch: {
			rightPop(v) {
				//监听bottomPop是否关闭，如果关闭，则获取选择的区域数据
				if (v === false) {
					if (IS_WX) {
						localStorage.setItem('area', this.area)
					} else {
						JsBridge.callHandler('setArea', this.area, (res) => {
						})
					}
					this.getData()
				}
			},
			rrr(r) {
				if (r === false) {
					if (IS_WX) {
						localStorage.setItem('area', this.area)
					} else {
						JsBridge.callHandler('setArea', this.area, (res) => {
						})
					}
					this.getData()
				}
			}
		},
		methods: {
			toLive(){
				if(this.areaId||this.areaId===0){
					this.liveArea=this.areaId;
				}
				var u = navigator.userAgent.toLowerCase();
				var isiOS = u.indexOf('ios')!=-1;
				if(IS_WX){
					window.location.href=LIVEPATH+'/'+this.liveArea+'/activity/live/detail/';
				}else{
					JsBridge.callHandler('openLive', LIVEPATH+'/'+this.liveArea+'/activity/live/detail/', (res) => {
					})
				}
			},
			// 获取微信code
			getCode() {
				wiki().then(res => {
					console.log(res)
				})
			},
			// 扫一扫
			scan() {
				var u = navigator.userAgent;
				var ua = window.navigator.userAgent.toLowerCase();
				var isWx = ua.match(/MicroMessenger/i) == 'micromessenger'
				var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
				var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
				var data = ''
				if (isWx) {
					// 微信方法
				} else {
					if (isAndroid) {
						// 安卓方法
						JsBridge.callHandler(
						  'scanClick',
						  data,
						  function (responseData) {
							  //alert(responseData)
						  }
						)
					} else {
						// 苹果方法
						JsBridge.callHandler(
						  'scanClick',
						  data,
						  function (responseData) {
							  //alert(responseData)
						  }
						)
					}
				}
			},
			// 扫完后执行的方法
			scanOver() {
				let self = this
				JsBridge.registerHandler(
				  'scanOver',
				  function (responseData) {
					  let res = JSON.parse(responseData)
					  if (res.type === '1') {
						  self.$router.push('/TypeOne/' + res.id)
					  } else {
						  self.$router.push('/TypeTwo/' + res.id)
					  }
				  }
				)
			},
			getUser() {
				let data = ''
				JsBridge.callHandler(
				  'getUserInfo',
				  data,
				  function (responseData) {
					  //alert(responseData)
				  }
				)
			},
			// 跳转到参活动
			handleActivity() {
				this.$router.push('/Activity')
			},
			// 跳转到享课程
			handleCourse() {
				this.$router.push('/Course')
			},
			// 跳转 逛展览
			handleExhibition() {
				this.$router.push('/Exhibition')
			},
			// 跳转到预约（调试APP为跳转到登录）
			handelYY() {
				this.$router.push('/DisList')
			},
			// 跳转到 开班了
			handleOpen() {

			},
			// 跳转到网上活动
			handleWorks() {
				this.$router.push('/Creative')
			},
			// 跳转到投票
			handleVote() {
				this.$router.push('/VoteList')
			},
			// 跳转到活动详情页
			handleActivities(item) {
				if(item.source!=3){
					this.$router.push('/Activities/' + item.id)
				}else{
					this.$router.push('/Courses/' + item.id)
				}
			},
			handleImg(item) {
				if (item.url !== '') {
					window.location.href = item.url
				}
			},
			// 通过区域ID获取推荐数据
			getData() {
				recommend(this.areaId).then(res => {
					res.map(m => m.type = m.type.split(','))
					this.content = res
					this.content.map(m => m.type.map((mt, i) => this.evArr.map(t => mt === t.codeStr ? m.type[i] = t.codeName : '')))
					this.getImg()
				}).catch(err => {
				})
			},
			// 获取区域数据
			getArea() {
				var area = localStorage.getItem('area');
				console.log(area)

				let userType=USERINFO?USERINFO.usertype.charAt(0):'1';
				let areaId = 0
				areas(areaId).then(res => {
					//res.splice(0, 0, { headChar: 'C', id: '', name: '重庆市' })
					// 区域排序
					res.sort((a, b) => a.headChar.charCodeAt(0) - b.headChar.charCodeAt(0))
					this.areaArry = res
					setTimeout(() => {
						if (IS_WX) {
							// 取出区域信息
							//
							console.log(localStorage);
							// if (!area||userType=='1') {
							if (!area) {
								this.init()
							} else {
								this.area = area;

								this.areaArry.filter(f => f.name === area ? this.areaId = f.id : '')
								if(area==global.CITYNAME){
									this.areaId='';
								}


								this.getData()
							}
							localStorage.setItem('area',area);
							//console.log(localStorage.getItem('area'))
							//console.log('sdsssss')
						} else {
							JsBridge.callHandler('getArea', '', (data) => {
								// if (data === 'null' || data === ''||data===null||userType=='1') {
								if (data === 'null' || data === ''||data===null) {
									JsBridge.callHandler('area', '', (res) => {
										  JsBridge.callHandler('setArea', res, (r) => {
										  })
										  this.area = res
										  // 获取对应区域ID
										  this.areaArry.map(m => m.name === this.area ? this.areaId = m.id : '')
										  if(this.area==global.CITYNAME){
											  this.areaId='';
										  }
										  this.getData()
									  }
									)
								} else {
									this.area = data
									this.areaArry.filter(f => f.name === data ? this.areaId = f.id :'')
									if(this.area==global.CITYNAME){
										this.areaId='';
									}
									this.getData()
								}
							})
						}
						// 如果是普通用户
						// alert(USERINFO)
						// if(USERINFO==='null'){
						//     alert(IS_WX)
						//     if (IS_WX) {
						//         // 取出区域信息
						//         var area = localStorage.getItem('area')
						//         alert(area)
						//         if (!area) {
						//             this.init()
						//         } else {
						//             this.area = area
						//             this.areaArry.filter(f => f.name === area ? this.areaId = f.id : '')
						//             this.getData()
						//         }
						//     } else {
						//         JsBridge.callHandler('getArea', '', (data) => {
						//             alert(data)
						//             if (data === 'null') {
						//                 JsBridge.callHandler('area', '', (res) => {
						//                         this.area = res
						//                         // 获取对应区域ID
						//                         this.areaArry.map(m => m.name === this.area ? this.areaId = m.id : '')
						//                         this.getData()
						//                     }
						//                 )
						//             } else {
						//                 this.area = data
						//                 this.areaArry.filter(f => f.name === data ? this.areaId = f.id : '')
						//                 this.getData()
						//             }
						//         })
						//     }
						// }else {
						//     if (USERINFO.usertype.indexOf('1') === 0) {
						//         if (IS_WX) {
						//             // 取出区域信息
						//             var area = localStorage.getItem('area')
						//             if (!area) {
						//                 this.init()
						//             } else {
						//                 this.area = area
						//                 this.areaArry.filter(f => f.name === area ? this.areaId = f.id : '')
						//                 this.getData()
						//             }
						//         } else {
						//             JsBridge.callHandler('getArea', '', (data) => {
						//                 alert(data)
						//                 if (data === 'null') {
						//                     JsBridge.callHandler('area', '', (res) => {
						//                             this.area = res
						//                             // 获取对应区域ID
						//                             this.areaArry.map(m => m.name === this.area ? this.areaId = m.id : '')
						//                             this.getData()
						//                         }
						//                     )
						//                 } else {
						//                     this.area = data
						//                     this.areaArry.filter(f => f.name === data ? this.areaId = f.id : '')
						//                     this.getData()
						//                 }
						//             })
						//         }
						//     } else {
						//         this.area = '重庆市'
						//         this.areaId = ''
						//         this.rrr = true
						//         setTimeout(() => {
						//             this.rrr = false
						//         }, 10)
						//     }
						// }

					}, 100)
				}).catch(err => {
				})
			},
			// 选择区域
			handleAreaPick(item, isArr) {
				this.area = item.name
				if (isArr === 0) {
					this.areaId = item.name === '市  级' ? 0 : ''
				}else {
					this.areaArry.map(f => f.name === item.name ? this.areaId = f.id : '')
				}
				if(IS_WX){
					localStorage.setItem('area', this.area)
				}else{
					JsBridge.callHandler('setArea', this.area, (r) => {
					})
				}
				this.rightPop = false
			},
			// 获取 艺术形式
			getEvList() {
				let code = '011'
				basecode(code).then(res => {
					this.evArr = res
				}).catch(err => {
				})
			},
			// 获取轮播图
			getImg() {
				let id = 2        // 手机端标识
				let areaid = this.areaId
				homeTarget(id, areaid).then(res => {
					this.cover = res
					Indicator.close()
				}).catch(err => {
					Indicator.close()
//                    Toast(err.response.data.msg)
				})
			},
			// 定位初始化
			init() {
				var self = this
				var mapObj = new AMap.Map('map-container', {
					center: [117.00923, 36.675807],
					zoom: 6
				})
				mapObj.plugin(['AMap.ToolBar', 'AMap.MapType'], function () {
					mapObj.addControl(new AMap.ToolBar())
					mapObj.addControl(new AMap.MapType({ showTraffic: false, showRoad: false }))
				})
				mapObj.plugin(['AMap.Geolocation'], function () {
					Indicator.open('获取定位加载数据中')
					let geolocation = new AMap.Geolocation({
						enableHighAccuracy: true, //  是否使用高精度定位，默认:true
						timeout: 10000, //  超过10秒后停止定位，默认：无穷大
						maximumAge: 0, // 定位结果缓存0毫秒，默认：0
						convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
						showButton: true, //  显示定位按钮，默认：true
						buttonPosition: 'LB',  // 定位按钮停靠位置，默认：'LB'，左下角
						buttonOffset: new AMap.Pixel(10, 20), //  定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
						showMarker: true, //  定位成功后在定位到的位置显示点标记，默认：true
						showCircle: true, //  定位成功后用圆圈表示定位精度范围，默认：true
						panToLocation: true,  //  定位成功后将定位到的位置作为地图中心点，默认：true
						zoomToAccuracy: true  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					})
					mapObj.addControl(geolocation)
					geolocation.getCurrentPosition()
					// 获取当前位置经纬度
					AMap.event.addListener(geolocation, 'complete', (result) => {
						console.log(result)
						self.lng = result.position.lng
						self.lat = result.position.lat
						mapObj.setCenter(result.position)
						// 根据经纬度获取地址
						mapObj.plugin(['AMap.Geocoder'], function () {
							//实例化Geocoder
							var geocoder = new AMap.Geocoder({
								city: "010"//城市，默认：“全国”
							});
							var lnglatXY = [self.lng, self.lat];//地图上所标点的坐标
							geocoder.getAddress(lnglatXY, function (status, result) {
								// Toast(status)
								if (status === 'complete' && result.info === 'OK') {
									// 获得了有效的地址信息:
									// 即，result.regeocode.formattedAddress
									// alert(result.regeocode.formattedAddress)
									// 截取区域位置
									var add = result.regeocode.formattedAddress
									var s = add.indexOf('市') + 1
									var q = ''
									var x = ''
									if (add.indexOf('区') > 0) {
										q = add.indexOf('区') + 1 - s
										self.area = add.substr(s, q)
									}
									if (add.indexOf('县') > 0) {
										x = add.indexOf('县') + 1 - s
										self.area = add.substr(s, x)
									}
									// 获取对应区域ID
									self.areaArry.map(m => m.name === self.area ? self.areaId = m.id : '')
									var area = self.area
									localStorage.setItem('area', area)
									// 通过区域ID获取首页推荐信息
									self.getData()
								} else {
									//获取地址失败
									Indicator.close()
									self.getData()
									// Toast('定位失败')
								}
							});
						})
					})  //  返回定位信息
					AMap.event.addListener(geolocation, 'error', (result) => {
						self.area = CITYNAME
						self.areaId = ''
						self.rrr = true
						setTimeout(() => {
							self.rrr = false
						}, 10)
						Indicator.close()
						// self.getData()
						Toast('定位失败')
//                        alert('定位失败')
					})  //  返回定位出错信息
				})
			},
			// 获取url中的参数
			getUrlParam(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
				var r = window.location.search.substr(1).match(reg);  //匹配目标参数
				if (r != null) return unescape(r[2]);
				return null; //返回参数值
			},
			bindPush(){
				var self=this;
				JsBridge.registerHandler(
				  'pushClick',
				  function (responseData) {
					  self.$router.push('/News/1');
				  }
				)
			},
		},
		created() {
			this.bindPush()
			this.getCode()
			this.getEvList()
			this.getArea()
			var code = this.getUrlParam("code");
			if(code&&!isAuth){
				openUser(code,0,{}).then(res=>{
					let data=res;
					wxlogin(data.openid,{}).then(res=>{
						//绑定获取百度推送信息方法
						// JsBridge.callHandler(
						//   'baiduPush',
						//   '',
						//   function (e) {
						//     var devType=window.navigator.userAgent.toLowerCase().indexOf('ios')!=-1?4:3,
						//       pushObj=JSON.parse(e);
						//     channelLog(pushObj.channel_id,devType,pushObj.user_id).then(res=>{
						//
						//     }).catch(err => {
						//       console.log(err.response)
						//       Indicator.close()
						//       Toast(err.response.data.msg)
						//     });
						//   }
						// )
						userInfo().then(res => {
							isAuth=true;
							// 存储用户信息
							let data =JSON.stringify(res)
							if (IS_WX) {
								// 微信方法
								// 存储用户信息到 localStorage
								localStorage.setItem('userInfo', data)
							} else {
								// webView方法
								let self=this
								JsBridge.callHandler(
								  'userInfo',
								  data,
								  function (rp) {

								  }
								)
							}
						})
						valphone(data.openid).then(res=>{
							this.$router.push('/wechatLogin/'+data.openid)
						}).catch(err=>{
							if(err.response.data.res==51004){
								//重新授权
								app.methods.getopenid();
							}else{
								//Toast(err.err.response.data.msg);
							}
						});
					})
				});
			}
		},
		mounted() {
			this.scanOver()
		},
		filters: {
			fontNum(f) {
				return f.length > 20 ? f.substr(0, 20) + '...' : f
			}
		}
	}
</script>

<style>
    @import "../../assets/style.scss";
</style>
