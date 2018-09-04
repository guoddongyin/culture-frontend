<template>
    <div id="news">
        <div class="leftTop">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>我的报名</span>
        </div>
        <div class="center">
            <div style="font-size: 20px;text-align: center;position:absolute;top:40%;width:100%;" v-if="contents.length<=0">
                暂无数据
            </div>
            <div class="enroll" v-for="(item,index) in contents">
                <div class="enrollTop">
                    <div>
                        报名时间：{{ item.addTime | times }}
                    </div>
                    <span>{{ item.state | applyState }}</span>
                </div>
                <div class="enrollContent">
                    <div class="enrollInfo">
                        <!--<img v-lazy="img" alt="">-->
                        <div class="enrollTxt">
                            <div class="enrollTxtTitle" style="font-weight: bold;">{{ item.activityName | limit }}</div>
                            <div class="enrollTxtTitle">报名人：{{ item.applyName | limit }}</div>
                            <div class="enrollTxtTitle">身份证：{{ item.idcard}}</div>
                            <div>{{item.type==0?'开班时间':'活动时间'}}：{{item.startTime | times}}到{{ item.endTime | times }}</div>
                            <div>{{item.type==0?'培训地址':'活动地址'}}：{{addressList[index]}}</div>
                            <div class="enrollBottom">
                                <div class="enrollIcon">
                                    <i v-if="item.codeUrl" @click="handleCode(item)" class="iconfont icon-erweima"></i>
                                    <i @click="handleToMap(item)" class="iconfont icon-map"></i>
                                </div>
                                <!--<div v-if="item.applyState===1" @click="openEnrollDialog(item)" class="enrollCancle">-->
                                    <!--取消报名-->
                                <!--</div>-->
                            </div>
                        </div>
                    </div>
                    <div v-if="item.applyState===2" style="margin-top: 0.2rem">取消原因：{{ item.cancelRemark }}</div>
                </div>
            </div>
            <div @click="clickMore" v-if="contents.length>0" class="clickMore">{{ loadingTxt }}</div>
        </div>
        <!--右侧二维码弹窗-->
        <mt-popup
                v-model="codePop"
                position="right">
            <div @click="handleCloseCode" class="codeImg">
                <img v-lazy="url+codeImg" alt="">
            </div>
        </mt-popup>

        <!--取消报名按钮弹窗-->
        <mu-dialog :open="enrollDialog" title="真的要取消？" @close="closeEnrollDialog">
            <input v-model="cancelRemark" type="text" placeholder="请输入取消原因(必填)" class="cancelRemark" maxlength="30">
            <mu-flat-button slot="actions" @click="closeEnrollDialog" primary label="不取消了"/>
            <mu-flat-button slot="actions" @click="handelCancel" primary label="确定取消"/>
        </mu-dialog>
        <div id="container"></div>
        <div style="display: none;" id="panel"></div>
        <div id="bitmap"></div>
    </div>
</template>

<script>
	import {enrollCancel, myEnroll} from '../../api/api'
	import {Indicator, MessageBox, Toast} from 'mint-ui';
	import {JsBridge} from '../../jsbridge/jsbridge'

	var map=null;
    export default {
        name: '',
        data() {
            return {
                url: URL,
                img: require('../../assets/bm1.png'),
                contents: [],
                offset: 0,                       // 页数，默认0
                limit: 30,                       // 每次查询的条数
                loading: false,                  // 滚动加载提示
                total: 0,                        // 总数
                loadingTxt: '点击加载...',        // 正在加载的显示
                allCount: true,                  // 是否加载全部
                codeImg: '',                         // 二维码
                codePop: false,                      // 二维码图片弹窗控制器
                cancelRemark: '',                    // 取消报名的原因
                cancelId: '',                        // 取消用的id
                enrollDialog: false,                  // 取消报名 弹窗控制器
                lng: '',
                lat: '',
                mapAddr: '',
                addressList:[],
            }
        },
        watch: {
            contents(s) {
                s.length >= this.total ? this.loadingTxt = '所有数据已加载完毕' : '点击加载'
            },
        },
        methods: {
            // 返回
            handleBack() {
                window.history.back()
            },
            clickMore() {
              var self=this;
              this.offset=this.offset+this.limit
                if (this.total > this.contents.length) {
                    this.loading = true
                    this.loadingTxt = '正在加载...'
                    let id = this.$route.params.id    // 用户ID
                    myEnroll(id, this.offset, this.limit, this.allCount).then(res => {
                        console.log(res)
                        let arr = res.data
                        this.contents.push(...arr)
                      this.addressList=new Array(this.contents.length);
                          this.contents.forEach((item,index)=>{
                            self.address(item.address,index);
                          });
                        this.loading = false
                        console.log(this.contents.length)
                        this.loadingTxt = '点击加载...'
                    }).catch(err => {
                        console.log(err.response)
                    })
                } else {
                    this.loadingTxt = '所有数据已加载完毕'
                }
            },
            // 获取报名信息
            getEnroll() {
                let id = this.$route.params.id    // 用户ID
                var self=this;
                myEnroll(id, this.offset, this.limit, this.allCount).then(res => {
                    console.log(res)
                    // 取出在头部的总条数
                    let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                    this.total = JSON.parse(headers).x_total_count
                    this.contents = res.data
                    this.addressList=new Array(res.data.length);
                    this.contents.forEach((item,index)=>{
                      self.address(item.address,index,false);
                    });
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 打开二维码
            handleCode(item) {
                this.codePop = true
                // 给img赋值
                this.codeImg = item.codeUrl
            },
            // 关闭二维码
            handleCloseCode() {
                this.codePop = false
            },
            // 打开取消报名 弹窗
            openEnrollDialog(item) {
                // 打开
                this.enrollDialog = true
                // 赋值
                this.cancelId = item.id
            },
            // 取消报名
            handelCancel() {
                if (this.cancelRemark === '') {
                    Toast({
                        message: '请输入取消原因',
                        position: 'top',
                        duration: 3000
                    });
                } else {
                    let params = {
                        remark: this.cancelRemark
                    }
                    enrollCancel(this.cancelId, params).then(res => {
                        this.enrollDialog=false
                        this.getEnroll()
                    }).catch(err => {
                        console.log(err.response)
                    })
                }
            },
            // 关闭取消报名 弹窗
            closeEnrollDialog() {
                this.enrollDialog = false
            },
            // 打开导航
            handleToMap(item) {
                let self = this
                let data=''
                // if (item.type === 0) {
                //     let add = JSON.parse(item.address)
                //     data = {
                //         targetLatitude: add.location.lat,
                //         targetLongitute: add.location.lng,
                //         toName: add.city + add.district + add.street
                //     }
                // }else {
                //     data={
                //         toName:item.cityName+item.areaName+item.streetName
                //     }
                // }
	            let add = JSON.parse(item.address)
                if(add.location){
	                data = {
		                targetLatitude: add.location.lat,
		                targetLongitute: add.location.lng,
		                toName: add.city + add.district + add.street
	                }
                }else{
	                data={
		                toName:item.province+item.city+item.street+item.district+item.detail,
	                }
                }
                if (IS_WX) {
                    var map = new AMap.Map('container')
                    var walking = new AMap.Driving({
                        map: map,
                        panel: 'panel',
                    })
                    walking.search([{ keyword: self.mapAddr }, { keyword: data.toName }], function (status, result) {
                        var _origin=result.origin,
                            _destination=result.destination;
                        if(data.targetLatitude&&data.targetLongitute){
	                        _destination=new AMap.LngLat(data.targetLongitute,data.targetLatitude);
                        }
                        walking.searchOnAMAP({
                            origin: _origin,
                            destination:_destination,
                        });
                    });
                    map.addControl(new AMap.ToolBar());
                } else {
                    JsBridge.callHandler('MapNav', data, (data) => {
                    })
                }
            },
            // 地图定位经纬度
            init() {
                var self = this
                var geolocation;
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
                    self.mapAddr = '重庆市'
                }
            },
            address(s,index,isLocation){
              setTimeout(function (){
                self.addressList.push('');
              },2000);
              var self=this;
              if(s){
                var addressObj=JSON.parse(s);
                if(addressObj.location&&isLocation){
                  // 根据经纬度获取地址
                  map.plugin(['AMap.Geocoder'], function () {
                    //实例化Geocoder
                    var geocoder = new AMap.Geocoder({
                      city: "010"//城市，默认：“全国”
                    });
                    var lnglatXY = [addressObj.location.lng, addressObj.location.lat];//地图上所标点的坐标
                    geocoder.getAddress(lnglatXY, function (status, result) {
                      // Toast(status)
                      if (status === 'complete' && result.info === 'OK') {
                        // 获得了有效的地址信息:
                        // 即，result.regeocode.formattedAddress
                        // alert(result.regeocode.formattedAddress)
                        // 截取区域位置
                        var add = result.regeocode.formattedAddress
                        self.addressList[index]=add;
                      } else {
                        self.addressList[index]='暂无';
                      }
                    });
                  })
                }else{
                  self.addressList[index]=addressObj.province+addressObj.city+addressObj.district+addressObj.street+addressObj.detail;
                }
                //self.addressList[index]=addressObj.province+addressObj.city+addressObj.district+addressObj.street+addressObj.detail;
              }else{
                self.addressList[index]='暂无';
              }
            }
        },
        created() {
            this.getEnroll()
            this.init()
        },
        filters: {
            applyState(s) {
                return s === 1 ? '报名成功' : s === 3 ? '审核中' : s === 4 ? '报名失败' : ''
            },
          limit(s){
            if(s.length>30){
              s=s.substring(0,30)+"...";
            }
            return s;
          },
        }
    }
</script>

<style>

</style>
