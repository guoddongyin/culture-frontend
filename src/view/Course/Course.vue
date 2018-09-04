<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>享课程</span>
        </div>
        <div class="homeCenter" style="margin-bottom: 0">
            <div class="pofixed">
                <div class="search">
                    <div class="searchText" :style="textAlign?'text-align:left':'text-align:right'">
                        <div style="padding: 0 0.4rem;">
                            <i v-if="!textAlign" class="iconfont icon-sousuo1"></i>
                            <input @focus="handleFocus"
                                   @blur="handleBlur"
                                   @input="handleKey"
                                   v-model="searchText"
                                   type="search"
                                   placeholder="搜索培训班">

                        </div>

                    </div>
                    <span @click="handleCancel">取消</span>
                </div>
                <div class="filter">
                    <div @click="handleAreaPop" class="filters">
                        <div>{{ area }}</div>
                        <i class="iconfont icon-down"></i>
                    </div>
                    <div @click="handlePickType" class="filters">
                        <div>{{ type }}</div>
                        <i class="iconfont icon-down"></i>
                    </div>
                    <div @click="handlePickActivity" class="filters">
                        <div>{{ activity | limitStr}}</div>
                        <i class="iconfont icon-down"></i>
                    </div>
                    <!--地区选择栏-->
                    <div v-if="areaPop" class="area">
                        <!--<div @click="handleAreaName(item)" v-for="(item,index) in areaArry" :key="index"-->
                             <!--class="areaName">-->
                            <!--{{ item.name }}-->
                        <!--</div>-->
                        <div v-for="(citys,j) in city">
                            <div @click="handleAreaName(citys,0)" style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5">
                                {{ citys.name }}
                            </div>
                        </div><div style="background-color: #999999;color: #ffffff;padding: 0.4rem;border-bottom: 1px solid #ffffff;">                    区县（按首字母排序）                </div>
                        <div v-for="(c,i) in chatArr" :key="i">
                            <div style="background-color: #999999;color: #ffffff;padding: 0.4rem">{{ c }}
                            </div>
                            <div v-for="(item,index) in areaArry" :key="index">
                                <div @click="handleAreaName(item)" style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5"
                                     v-if="item.id!='0'&&item.headChar===c">{{ item.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--艺术门类或活动类型选择-->
                    <div v-if="typePop" class="area">
                        <div @click="hanelTypeName(item)" v-if="!item.upCodeStr" v-for="(item,index) in typeArry" class="areaName"
                             :key="index">
                            {{ item.codeName }}
                        </div>
                    </div>
                    <!--时间选择-->
                    <div v-if="activityPop" class="area pickTimePop">
                        <div @click="hanelActiName(item,index)"
                             v-for="(item,index) in pickTime"
                             class="pickTime"
                             :key="index">
                            {{ item }}
                        </div>
                    </div>
                </div>
            </div>
            <DatePicker @on-change="selectDate" confirm class="datePicker" :open="datePickerOpen" type="daterange" placement="bottom" placeholder="Select date"></DatePicker>
            <div id="listHeight" style="padding-top: 2.8rem;overflow: auto;background-color: #e5e5e5">
                <div @click="handleLink(item)" v-for="(item,index) in contents" :key="index" class="Accontent"
                     style="border-bottom:none" :style="index===0?'margin-top:0':'margin-top:0.2rem'">
                    <div class="images">
                        <img v-lazy="url+item.img" alt="">
                        <span v-if="item.waitState!=-1">{{ item.waitState | IsEnroll }}</span>
                    </div>
                    <div class="title"><img v-lazy="mf" alt="">{{ item.name |fontNum }}</div>
                    <div class="tags">
                        <span v-if="item.shape" class="tagShape">{{ item.shape }}</span>
                        <span v-for="(type,index) in item.type" :key="index" class="tagType">{{ type }}</span>
                    </div>
                    <div class="venue">
                        <div>{{ item.orgname }}</div>
                        <div>开班时间：<b>{{ item.stattime | times }} 至 {{ item.endtime | times }}</b></div>
                    </div>
                </div>
                <div @click="clickMore" v-if="contents.length>0" class="clickMore">{{ loadingTxt }}</div>
            </div>


            <!--日期选择-->
            <mt-datetime-picker ref="picker" type="date" v-model="datetime"
                                @confirm="handleConfirm"></mt-datetime-picker>
            <!--艺术门类弹出框-->
            <mu-dialog :open="dialogType" title="艺术分类" @close="closeType">
                <mu-menu>
                    <mu-menu-item :id="index" :class="typeNum===index?'menuColor':''" @click="handleCheck(item,index)"
                                  :title="item.codeName" v-for="(item,index) in artArr" :key="index"/>
                </mu-menu>
                <mu-flat-button slot="actions" @click="closeType" primary label="取消"/>
                <mu-flat-button slot="actions" primary @click="pickTypeClose" label="确定"/>
            </mu-dialog>
        </div>
    </div>
</template>

<script>
    import { areas, restype, basecode, freeItems, allFreeItems, activityKey,freeItemKey } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';
    import { JsBridge } from '../../jsbridge/jsbridge'

    export default {
        name: '',
        data() {
            return {
                url: URL,                       // 设置全局URL变量
                mf: require('../../assets/mf.png'),
                offset: 0,                       // 页数，默认0
                limit: 10,                       // 每次查询的条数
                loading: false,                  // 滚动加载提示
                total: 0,                        // 总数
                loadingTxt: '点击加载...',        // 正在加载的显示
                allCount: true,                  // 是否加载全部
                textAlign: false,               // 文本类型
                searchText: '',                  // 搜索内容
                contents: [],                   // 活动列表
                picktime: new Date(),           // 选择的时间
                datetime: new Date(),           // 默认显示的时间
                startTime: '',                   // 开班开始时间，时间戳格式
                endTime: '',                     // 开班结束时间，时间戳格式
                // 区域
                city: [{ name: CITYNAME }, { name: CITYAREA }],
                areaPop: false,                 // 区域弹窗控制器
                areaArry: [],                   // 存储区域数组（包含ID等）
                area: '选择区域',                // 区域标识
                areaId: '',                      // 区域ID--用于请求数据
                // 活动形式
                activityPop: false,             // 活动形式弹窗控制器
                activityArry: [],               // 存储活动形式数组（包含ID等）
                activity: '正在报名',            // 活动形式文字标识
                activityId: '',                   //活动形式Id,用于请求数据
                // 类型
                typePop: false,                 // 类型 弹窗控制器
                typeArry: [],                   // 存储类型数组（包含ID等）
                type: '艺术类型',                // 类型标识
                typeId: '',                     // 类型ID，用于请求数据
                // 时间选择数组
                pickTime: ['即将报名','正在报名','正在培训', '历史开班', '选择日期'],
                todayStartTime: '',
                todayEndTime: '',
                tomorrowStartTime: '',
                tomorrowEndTime: '',
                tdatStratTime: '',
                tdatEndTime: '',
                saturday: '',
                sunday: '',
                chatArr: 'BCDFHJKLNPQRSTWXYZ'.split(''),
                dialogType: false,
                artArr:[],
                typeNum:-1,
                artId:'',
              enrollTime:'',//正在报名的时间
              datePickerOpen:false,
              searchtype:1,//搜索类型
            }
        },
        watch: {
            contents(s) {
                this.loadingTxt = s.length >= this.total ? '所有数据已加载完毕' : '点击加载'
            }
        },
        computed: {},
        methods: {
          selectDate(date){
            this.datePickerOpen=false;
            this.enrollTime='';
            if(date&&date.length>0&&date[0]){
              this.startTime=new Date(date[0]).getTime();
              var endDate=new Date(date[1]);
              endDate.setHours(23);
              endDate.setMinutes(59);
              endDate.setSeconds(59);
              this.endTime=endDate.getTime();
              this.activity=date[0]+'-'+date[1];
            }else{
              this.startTime='';
              this.endTime='';
              this.activity='选择日期';
            }
            this.getData();
          },
            //返回
            handleBack() {
                this.$router.push('/Home')
            },
            // 焦点获取事件
            handleFocus() {
                console.log('focus')
                this.textAlign = true
            },
            // 焦点失去事件
            handleBlur() {
                console.log('blur')
                if (this.searchText === '') {
                    this.textAlign = false
                }
            },
            // 取消搜索文本
            handleCancel() {                this.searchText = '';                this.textAlign = false;                this.firstGetData();
            },
            // 搜索框搜索
            handleKey() {
	            freeItems(this.searchText,this.areaId, this.startTime, this.endTime, this.typeId, this.offset, this.limit, this.allCount,this.enrollTime,this.searchtype).then(res => {
		            res.data.data.map(m => m.type = m.type.split(','))
		            this.contents = res.data.data;
		            this.contents.map(m => {console.log(m);m.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.type[i] = t.codeName : ''))})
	            }).catch(err => {
		            Indicator.close()
		            console.log(err.response)
	            })
            },
            clickMore() {
                this.offset=this.offset+this.limit
                if (this.total > this.contents.length) {
                    this.loading = true
                    this.loadingTxt = '正在加载...'
                    freeItems(this.searchText,this.areaId, this.startTime, this.endTime, this.typeId, this.offset, this.limit, this.allCount,this.enrollTime,this.searchtype).then(res => {
                        console.log(res)
                        res.data.map(m => m.type = m.type.split(','))
                        let arr = res.data
                        arr.map(m => m.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.type[i] = t.codeName : '')))
                        arr.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                        this.loading = false
                        this.contents.push(...arr)
                        console.log(this.contents.length)
                        this.loadingTxt = '点击加载...'
                    }).catch(err => {
                        console.log(err.response)
                    })
                } else {
                    this.loadingTxt = '所有数据已加载完毕'
                }
            },
            // 获取参活动数据
            getData() {
                Indicator.open()
                this.offset = 0
                freeItems(this.searchText,this.areaId, this.startTime, this.endTime, this.typeId, this.offset, this.limit, this.allCount,this.enrollTime,this.searchtype).then(res => {
                    console.log(res)
                    // 取出在头部的总条数
                    this.total = res.count
                    res.data.map(m => m.type = m.type.split(','))
                    this.contents = res.data
                    this.contents.map(m => m.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.type[i] = t.codeName : '')))
                    this.contents.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                    Indicator.close()
                }).catch(err => {
                    Indicator.close()
                    console.log(err.response)
                })
            },
            //第一次获取数据，获取所有
            firstGetData() {
                let isCity=true;
                if (IS_WX) {
                    let area = localStorage.getItem('area')
                    if (!area) {
                        this.area = '选择区域'
                        this.areaId = area===global.CITYNAME?'':0;
                    } else {
                        this.area = area
                        this.areaArry.map(f => {
                            if(f.name === area){
                                this.areaId = f.id;
                                isCity=false;
                            }
                        })
                        if(isCity&&area.indexOf(" ")!=-1){
                            this.areaId = 0;
                        }
                      if(isCity&&area===CITYNAME){
                        this.areaId = '';
                      }
                    }
                    this.offset = 0
                  this.enrollTime=new Date().getTime();
                  freeItems(this.searchText,this.areaId, this.startTime, this.endTime, this.typeId, this.offset, this.limit, this.allCount,this.enrollTime,this.searchtype).then(res => {
                        // 取出在头部的总条数
                        this.total = res.count
                        res.data.map(m => m.type = m.type.split(','))
                        this.contents = res.data
                        this.contents.map(m => m.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.type[i] = t.codeName : '')))
                        this.contents.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                        Indicator.close()
                    }).catch(err => {
                        Indicator.close()
                        console.log(err.response)
                    })
                } else {
                    JsBridge.callHandler('getArea', '', (data) => {
                        if (data === 'null') {
                            this.area = '选择区域'
                            this.areaId = 0
                        } else {
                            this.area = data
                            this.areaArry.map(f => {
                                if(f.name === data){
                                    this.areaId = f.id;
                                    isCity=false;
                                }
                            })
                            if(isCity&&data.indexOf(" ")!=-1){
                                this.areaId = 0;
                            }
                          if(isCity&&data===CITYNAME){
                            this.areaId = '';
                          }
                        }
                      this.offset = 0
                      this.enrollTime=new Date().getTime();
                      freeItems(this.searchText,this.areaId, this.startTime, this.endTime, this.typeId, this.offset, this.limit, this.allCount,this.enrollTime,this.searchtype).then(res => {
                            // 取出在头部的总条
                            res.data.map(m => m.type = m.type.split(','))
                            this.contents = res.data
                            this.contents.map(m => m.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.type[i] = t.codeName : '')))
                            this.contents.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                            Indicator.close()
                        }).catch(err => {
                            Indicator.close()

                            console.log(err.response)
                        })
                    })
                }
            },
            // 打开时间选择组件
            handlePickDate() {
                this.$refs.picker.open();
            },
            //点击确定
            handleConfirm(v) {
                console.log(Date.parse(v))
                let pick = Date.parse(v)
                let todayStartTime = new Date(new Date().toLocaleDateString()).getTime()
                this.startTime = todayStartTime
                this.endTime = pick
                this.activity = v.toLocaleString().split(' ')[0]
                this.getData()
            },

            // 获取区域数据
            getArea() {
                Indicator.open()
                let areaId = 0
                areas(areaId).then(res => {
                   //res.splice(0, 0, { headChar: 'C', id: '', name: '重庆市' })
                    // 区域排序
                    res.sort((a, b) => a.headChar.charCodeAt(0) - b.headChar.charCodeAt(0))
                    this.areaArry = res
                    this.getRestype()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            //打开区域选择组件
            handleAreaPop() {
                this.sortPop = false
                this.activityPop = false
                this.typePop = false
                this.areaPop = !this.areaPop
            },
            // 选择区域数据
            handleAreaName(item,isArr) {
                this.area = item.name
                if(IS_WX){
                    localStorage.setItem('area', this.area)
                }else {
                    JsBridge.callHandler('setArea',this.area,(res)=>{})
                }
                if (isArr === 0) {
                    this.areaId = item.name === '市  级' ? 0 : ''
                }else {
                    this.areaArry.map(f => f.name === item.name ? this.areaId = f.id : '')
                }
                this.areaPop = false
//                this.areaId = item.id
                this.getData()
            },


            // 获取 活动形式 数据 一级分类
            getRestype() {
                restype().then(res => {
                    this.activityArry = res
                    this.getBasecode()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            //打开 活动形式 选择组件
            handlePickActivity() {
                this.getToday()
                this.getSunday()
                this.sortPop = false
                this.areaPop = false
                this.typePop = false
                this.activityPop = !this.activityPop
            },
            // 选择活动形式 选择组件  change事件
            hanelActiName(item, index) {
                this.activity = item
                console.log(this.activity)
	            console.log(index)
                this.activityPop = false
                if (index === 0) {
                  this.startTime = ''
                  this.endTime = ''
                  this.enrollTime=this.getTimeStamp(1);
                  this.searchtype=0;
                } else if (index === 1) {
                  this.startTime = ''
                  this.endTime = ''
                  this.enrollTime=new Date().getTime();
                  this.searchtype=1;
                } else if (index === 2) {
                  this.startTime = this.getTimeStamp(0);
                  this.endTime = ''
                  this.enrollTime='';
                  this.searchtype=2;
                } else if (index === 3) {
                  this.startTime = '';
                  this.endTime = this.getTimeStamp(0)
                  this.enrollTime='';
                  this.searchtype=3;
                } else {
                	this.datePickerOpen=true;
                  this.searchtype=4;
                }

                if(!this.datePickerOpen){
                  this.getData()
                }
            },
            getTimeStamp(num){
              var date=new Date();
              var newDate= date.setDate(date.getDate()+num);
              return newDate;
            },
            //获取 类型 数据
            getBasecode() {
                let code = '011'
                basecode(code).then(res => {
                    console.log('获取类型')
                    console.log(res)
                    this.typeArry = res
                    this.typeArry.splice(0, 0, { codeStr: '', codeName: '不限', upCodeStr: null })
                    this.firstGetData()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 打开 类型 选择组件
            handlePickType() {
                this.sortPop = false
                this.areaPop = false
                this.activityPop = false
                this.typePop = !this.typePop
            },
            // 选择 类型 change事件
            hanelTypeName(item) {
                this.artArr=this.typeArry.filter(f=>f.upCodeStr===item.codeStr)
                item.codeStr !== '' ? this.artArr.splice(0, 0, { codeStr: '', codeName: '不限' }) : ''
                this.typeNum=-1
                if(this.artArr.length>0){
                    this.dialogType=true
                    this.typeId=item.codeStr
                }else {
                    this.type=item.codeName
                    this.typeName=item.codeName
                    this.typeId=item.codeStr
                    this.getData()
                    this.typePop=false
                }
            },

            // 跳转到享课程详情页
            handleLink(item) {
          	console.log()
	            this.$router.push({path:
		            '/Courses/' + item.id,
		            query: {waitStatename:
			            this.activity}})
            },

            // 获取今天的时间戳-->由此可获得明天和后天的时间戳
            getToday() {
                var oneDayLong = 24 * 60 * 60 * 1000;
                var todayStartTime = new Date(new Date().toLocaleDateString()).getTime()
                var todayEndTime = new Date(new Date().toLocaleDateString()).getTime() + oneDayLong - 1
                var tomorrowStartTime = todayStartTime + oneDayLong
                var tomorrowEndTime = todayEndTime + oneDayLong
                // 后天-->The day after tomorrow-->tdat
                var tdatStratTime = todayStartTime + oneDayLong * 2
                var tdatEndTime = todayEndTime + oneDayLong * 2
                // 今天凌晨
                this.todayStartTime = todayStartTime
                // 今天午夜
                this.todayEndTime = todayEndTime
                // 明天凌晨
                this.tomorrowStartTime = tomorrowStartTime
                // 明天午夜
                this.tomorrowEndTime = tomorrowEndTime
                // 后天凌晨
                this.tdatStratTime = tdatStratTime
                // 后天午夜
                this.tdatEndTime = tdatEndTime
            },

            // 获取周六和周末的时间
            getSunday() {
                var now = new Date();
                var nowTime = now.getTime();
                var day = now.getDay();
                var oneDayLong = 24 * 60 * 60 * 1000;

                var SaturdayTime = nowTime + (6 - day) * oneDayLong;
                var SundayTime = nowTime + (7 - day) * oneDayLong;

                this.saturday = SaturdayTime
                this.sunday = SundayTime
            },

            //时间格式转换 如：2017-9-6 ==> 2017-09-06
            getLocalTime(time, format) {
                time = new Date(time);
                let o = {
                    "M+": time.getMonth() + 1, //month
                    "D+": time.getDate(), //day
                    "h+": time.getHours(), //hour
                    "m+": time.getMinutes(), //minute
                    "s+": time.getSeconds(), //second
                    "q+": Math.floor((time.getMonth() + 3) / 3), //quarter
                    "S": time.getMilliseconds() //millisecond
                }
                if (/(Y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return format;
            },
            // 设置列表高度
            setHeight() {
                let id = document.getElementById('listHeight')
                if (IS_WX) {
                    id.style.height = 15.6 + 'rem'
                } else {
                    id.style.height = 16.2 + 'rem'
                }
            },
            // 关闭艺术分类
            closeType() {
                this.dialogType = false
            },
            // 已选，关闭艺术分类
            pickTypeClose() {
                this.dialogType = false
                this.typePop = false
                this.type=this.typeName
                this.typeId=this.artId
                this.getData()
            },
            // 艺术分类选择
            handleCheck(item, index) {
                this.typeName=item.codeName
                this.artId=item.codeStr||this.typeId;
                this.typeNum=index
            }
        },
        created() {
            this.getArea()
            let h = document.body.offsetHeight
            console.log(h)
        },
        mounted() {
            this.setHeight()
        },
        filters: {
            IsEnroll(y) {
                var statusName='';
                switch (y){
                  case 0:statusName='即将开始';break;
                  case 1:statusName='正在进行';break;
                  case 2:statusName='已经结束';break;
                };
                return statusName;
            },
            pickerTime(t) {
                return t.toLocaleString().split(' ')[0]
            },
            fontNum(f) {
                return f.length > 18 ? f.substr(0, 18) + '...' : f
            },
            limitStr(f){
                return f.length > 8 ? f.substr(0, 8) + '...' : f
            },
        }
    }
</script>

<style>
    .ivu-date-picker-with-range .ivu-picker-panel-body{
        width:100%!important;
        min-width: auto!important;
    }

    .ivu-date-picker-with-range .ivu-picker-panel-content{
        float:none!important;
    }

    .ivu-input-wrapper{
        visibility: hidden!important;
    }
    .datePicker{
        position: fixed;
        top:0;
        left:30%;
        z-index:1000;
    }
    .ivu-picker-panel-icon-btn{
        visibility: hidden!important;
    }
</style>
