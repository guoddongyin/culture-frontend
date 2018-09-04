<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>参活动</span>
        </div>
        <div class="homeCenter" style="margin-bottom:0">
            <div class="pofixed" style="background-color: #ffffff">
                <div class="search">
                    <div class="searchText" :style="textAlign?'text-align:left':'text-align:right'">
                        <div style="padding-left: 0.4rem;">
                            <i v-if="!textAlign" class="iconfont icon-sousuo1"></i>
                            <input @focus="handleFocus"
                                   @blur="handleBlur"
                                   @input="handleKey"
                                   @compositionend="handleKey"
                                   v-model="searchText"
                                   type="search"
                                   placeholder="搜索活动">
                        </div>

                    </div>
                    <span @click="handleCancel">取消</span>
                </div>
                <!--<div @click="handlePickDate" class="datePick">-->
                <!--<div class="flexBettwens">-->
                <!--<div class="iconfont icon-date"></div>-->
                <!--<div class="timeNum">日期 <span>(活动场数：{{ contents.length }}场)</span></div>-->
                <!--</div>-->
                <!--<div style="font-size: 0.3466rem">-->
                <!--{{ picktime | pickerTime}}-->
                <!--<i class="iconfont icon-right"></i>-->
                <!--</div>-->

                <!--</div>-->
                <!--时间选择-->
                <!--<div class="flex">-->
                    <!--<div class="flexCenter"-->
                         <!--style="text-align: center;background-color: #ffffff;border-right: 1px solid #e5e5e5">-->
                        <!--<div style="width: 2rem">{{ showday }}</div>-->
                    <!--</div>-->
                    <!--<div class="flex" style="background-color: #ffffff;overflow: auto">-->
                        <!--<div v-for="(item,index) in dayArr" :key="index" class="calendarLi">-->
                            <!--<div style="  border-bottom: 1px solid #e5e5e5;">{{ item | day }}</div>-->
                            <!--<div :class="today===item?'calendarDay':''"-->
                                 <!--:id="index"-->
                                 <!--:style="pickDay===item?'border:1px solid #fa711b':''"-->
                                 <!--@click="_pickDay(item)"-->
                                 <!--class="shortDay">{{ item | short }}-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->

                <div class="filter" style="border-top: 1px solid #e5e5e5">
                    <div @click="handlePickSort" class="filters">
                        <div>{{ sort }}</div>
                        <i class="iconfont icon-down"></i>
                    </div>
                    <div @click="handleAreaPop" class="filters">
                        <div>{{ area }}</div>
                        <i class="iconfont icon-down"></i>
                    </div>
                    <div @click="handlePickActivity" class="filters">
                        <div>{{ activity }}</div>
                        <i class="iconfont icon-down"></i>
                    </div>
                    <div @click="handlePickTime" class="filters">
                        <div>{{ time | limitStr}}</div>
                        <i class="iconfont icon-down"></i>
                    </div>
                    <!--<div @click="handlePickType" class="filters">-->
                        <!--<div>{{ type }}</div>-->
                        <!--<i class="iconfont icon-down"></i>-->
                    <!--</div>-->

                    <!--排序方式选择栏-->
                    <div v-if="sortPop" class="area">
                        <div @click="handleSortName(item,index)" v-for="(item,index) in sorts" class="areaName"
                             :key="index">{{item.name}}
                        </div>
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
                                <div @click="handleAreaName(item)"
                                     style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5"
                                     v-if="item.id!='0'&&item.headChar===c">{{ item.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--活动形式选择栏-->
                    <div v-if="activityPop" class="area">
                        <div @click="hanelActiName(item)" v-for="(item,index) in activityArry" class="areaName"
                             :key="index">
                            {{ item.codeName }}
                        </div>
                    </div>
                    <!--艺术门类或活动类型选择-->
                    <div v-if="typePop" class="area">
                        <div @click="hanelTypeName(item)" v-if="!item.upCodeStr" v-for="(item,index) in typeArry"
                             class="areaName"
                             :key="index">
                            {{ item.codeName }}
                        </div>
                    </div>
                    <!--时间选择-->
                    <div v-if="timePop" class="area pickTimePop">
                        <div @click="hanelTimeName(item,index)"
                             v-for="(item,index) in pickTime"
                             class="pickTime"
                             :key="index">
                            {{ item }}
                        </div>
                    </div>
                </div>
            </div>
            <DatePicker @on-change="selectDate" confirm class="datePicker" :open="datePickerOpen" type="daterange" placement="bottom-end" placeholder="Select date"></DatePicker>
            <div id="listHeight" style="padding-top: 3rem;overflow: auto;background-color: #e5e5e5">
                <div @click="handleLink(item)" v-for="(item,index) in contents" :key="index" class="Accontent"
                     style="border-bottom:none" :style="index===0?'margin-top:0':'margin-top:0.2rem'">
                    <div class="images">
                        <img v-lazy="url+item.cover" alt="">
                        <span v-if="item.waitState!=-1">{{item.waitState | IsState}}</span>
                    </div>
                    <div class="title"><img v-lazy="mf" alt="">{{ item.name | fontNum }}</div>
                    <div class="tags">
                        <div class="tagShape">{{ item.shapename }}</div>
                        <div v-for="(t,index) in item.type" class="tagType">{{ t }}</div>
                    </div>
                    <div class="venue">
                        <div class="flexBettwens">
                            <div v-if="item.source==1">{{ item.sponsor }}</div>
                            <div v-else-if="item.source==3">{{ item.addOrgName }}</div>
                            <div style="font-size: 0.29rem" class="enrollState"
                                 :style="item.enrollState===2?'background-color: #bfbfbf':''">
                                {{ item.enrollWay | IsEnroll }}
                            </div>
                        </div>
                        <div>活动时间：<b>{{ item.startTime.substr(0, 16) }}</b></div>
                    </div>
                </div>
                <div @click="clickMore" v-if="contents.length>0" class="clickMore">{{ loadingTxt }}</div>
            </div>
            <!--日期选择-->
            <!--<mt-datetime-picker ref="picker" type="date" v-model="datetime"-->
                                <!--@confirm="handleConfirm"></mt-datetime-picker>-->
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
    import { areas, restype, basecode, activity, activityKey, dayStart, dayEnd } from '../../api/api'
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
                loadingTxt: '正在加载...',        // 正在加载的显示
                textAlign: false,               // 文本类型
                searchText: '',                  // 搜索内容
                contents: [],                   // 活动列表
                picktime: new Date(),           // 选择的时间
                datetime: new Date(),           // 默认显示的时间
                // 排序方式
                sorts: [ {name:'最新发布',value:2}, {name:'人气最高',value:3},{ name:'评价最好',value:4},{name:'综合排序',value:1}],
                sortPop: false,                 // 排序方式弹窗控制器
                sortArry: [],                   // 存储排序方式数组
                sort: '最新发布',                // 默认显示
                sortId: 2,                      // 默认ID为2
                // 区域
                city: [{ name: CITYNAME }, { name: CITYAREA }],

                areaPop: false,                 // 区域弹窗控制器
                areaArry: [],                   // 存储区域数组（包含ID等）
                area: '选择区域',                // 区域标识
                areaId: '',                      // 区域ID--用于请求数据
                // 活动形式
                activityPop: false,             // 活动形式弹窗控制器
                activityArry: [],               // 存储活动形式数组（包含ID等）
                activity: '活动形式',            // 活动形式文字标识
                activityId: '',                   //活动形式Id,用于请求数据
                // 类型
                typePop: false,                 // 类型 弹窗控制器
                typeArry: [],                   // 存储类型数组（包含ID等）
                type: '艺术类型',                // 类型标识
                typeId: '',                       // 类型ID，用于请求数据
              // 类型
              timePop: false,                 // 时间 弹窗控制器
              timeArry: [],                   // 存储时间数组（包含ID等）
              time: '正在报名',                // 时间标识
              timeId: '',                       // 时间ID，用于请求数据
              // 时间选择数组
              pickTime: ['正在报名', '即将开始', '近一个月', '选择日期'],
                dayArr: [],                     // 日期数组
                today: this.getLocalTime(new Date(),"YYYY-MM-DD"),
                pickDay: '',                     // 选择的日期
                showday: '',                     // 显示的时间
                chatArr: 'BCDFHJKLNPQRSTWXYZ'.split(''),
                dialogType: false,
                artArr: [],
                typeNum: -1,
                artId: '',
                endTime:'',//报名结束时间
              enrollTime:'',//正在报名的时间
              enrollWay:1,//正在报名的时间
              datePickerOpen:false,
            }
        },
        watch: {
            contents(s) {
		        this.loadingTxt = s.length >= this.total ? '所有数据已加载完毕' : '点击加载'
	        }
        },
        computed: {
            startTime(t) {
                return t.split(' ')[0]
            },
        },
        methods: {
          selectDate(date){
           this.datePickerOpen=false;
           this.enrollTime='';
           if(date.length>0&&date[0]){
             this.pickDay=date[0];
             this.endTime=date[1];
             this.time=date[0]+'-'+date[1];
           }else{
             this.pickDay='';
             this.endTime='';
             this.time='选择日期';
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
	            this.offset = 0
                activityKey(this.searchText,this.typeId, this.activityId, this.sortId, this.areaId, this.pickDay,this.endTime,this.enrollTime,this.enrollWay, this.offset, this.limit).then(res => {
                    console.log(res)
                    // 取出在头部的总条数
                    let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                    this.total = JSON.parse(headers).x_total_count
                    if (res.data === '') {
                        this.contents = ''
                    } else {
                        res.data.map(m => m.type = m.type.split(','))
                        console.log(res.data)
                        this.contents = res.data
                        this.contents.map(m => m.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.type[i] = t.codeName : '')))
                        this.contents.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                    }
                }).catch(err => {
                    console.log(err.response)
                })
            },
            clickMore() {
              this.offset=this.offset+this.limit;
                if (this.total > this.contents.length) {
                    this.loading = true
                    this.loadingTxt = '正在加载...'
                    activity(this.searchText,this.typeId, this.activityId, this.sortId, this.areaId, this.pickDay,this.endTime,this.enrollTime,this.enrollWay, this.offset, this.limit).then(res => {
                        console.log(res)
                        res.data.map(m => m.type = m.type.split(','))
                        let arr = res.data
                        arr.map(m => m.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.type[i] = t.codeName : '')))
                        arr.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                        this.contents.push(...arr)
                        this.loading = false
                        page++;
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
                this.offset = 0
                //alert(this.areaId);
                activity(this.searchText,this.typeId, this.activityId, this.sortId, this.areaId, this.pickDay,this.endTime,this.enrollTime,this.enrollWay, this.offset, this.limit).then(res => {
                  //alert(JSON.stringify(res));
                    // 取出在头部的总条数
                    let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                    this.total = JSON.parse(headers).x_total_count
                    if (res.data === '') {
                        this.contents = ''
                    } else {
                        res.data.map(m => m.type = m.type.split(','))
                        console.log(res.data)
                        this.contents = res.data
                        this.contents.map(m => m.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.type[i] = t.codeName : '')))
                        this.contents.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                    }
                }).catch(err => {
                    //alert(JSON.stringify(err));
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
                      this.areaId = area==global.CITYNAME?'':0;
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
                    }
                    this.offset = 0
                    let typeId = ''
                    let activityId = ''
                    let sortId = '2'
                    let areaId = this.areaId
                    let picktime = ''
                    this.enrollTime=this.today
                    //筛选条件全部限定于时间
                    this.pickDay=picktime
                    this._getLastDate()
                    activity(this.searchText,typeId, activityId, sortId, areaId, picktime,this.endTime,this.enrollTime,this.enrollWay, this.offset, this.limit).then(res => {
                        console.log(res)
                        // 取出在头部的总条数
                        let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                        this.total = JSON.parse(headers).x_total_count
                        res.data.map(m => m.type = m.type.split(','))
                        console.log(res.data[0].type)
                        this.contents = res.data
                        this.contents.map(m => m.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.type[i] = t.codeName : '')))
                        this.contents.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                        Indicator.close()
                    }).catch(err => {
                        console.log(err.response)
                        Indicator.close()
                    })
                } else {
                    JsBridge.callHandler('getArea', '', (data) => {
                        if (data === 'null') {
                            this.area = '选择区域'
                            this.areaId = 0;
                        } else {
                            this.area = data
                            this.areaArry.map(f => {
                                if(f.name === data){
                                    this.areaId = f.id;
                                    isCity=false;
                                }
                            })
                            if(isCity&&data.indexOf(" ")!=-1){
                              this.areaId = this.area==global.CITYNAME?'':0;
                            }
                        }
                        this.offset = 0
                        let typeId = ''
                        let activityId = ''
                        let sortId = '2'
                        let areaId = this.areaId
                        let picktime = ''
                        this.enrollTime=this.today
                        //筛选条件全部限定于时间
                        this.pickDay=picktime
                        this._getLastDate()
                        activity(this.searchText,typeId, activityId, sortId, areaId, picktime,this.endTime,this.enrollTime,this.enrollWay, this.offset, this.limit).then(res => {
                            console.log(res)
                            // 取出在头部的总条数
                            let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                            this.total = JSON.parse(headers).x_total_count
                            res.data.map(m => m.type = m.type.split(','))
                            console.log(res.data[0].type)
                            this.contents = res.data
                            this.contents.map(m => m.type.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.type[i] = t.codeName : '')))
                            this.contents.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                            Indicator.close()
                        }).catch(err => {
                            console.log(err.response)
                            Indicator.close()
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
                console.log(v.toLocaleString().split(' ')[0])
                this.picktime = v.toLocaleString().split(' ')[0]
                this.getData()
            },

            //获取 排序数据
            getSort() {
                setTimeout(() => {
                    Indicator.open()
                    this.sortArry = this.sorts
                    this.getArea()
                }, 20)
            },
            // 打开 排序方式 选择组件
            handlePickSort() {
                this.areaPop = false
                this.activityPop = false
                this.typePop = false
              this.timePop=false
                this.sortPop = !this.sortPop
            },
            // 选择排序方式
            handleSortName(item, index) {
                this.sort = item.name
                this.sortId = item.value
                this.sortPop = false
                this.getData()
            },

            // 获取区域数据
            getArea() {
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
              this.timePop=false
                this.areaPop = !this.areaPop
            },
            // 选择区域数据
            handleAreaName(item,isArr) {
                this.area = item.name
                console.log(this.area)
                if (IS_WX) {
                    localStorage.setItem('area', this.area)
	                //var area = localStorage.getItem('area');
                    //console.log(area)
                } else {
                    JsBridge.callHandler('setArea', this.area, (res) => {
                    })
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
                    console.log(res)
                    this.activityArry = res
                    this.activityArry.splice(0,0,{codeStr:'',codeName:'不限'})
                    this.getBasecode()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            //打开 活动形式 选择组件
            handlePickActivity() {
                this.sortPop = false
                this.areaPop = false
                this.typePop = false
              this.timePop=false
                this.activityPop = !this.activityPop
            },
            //打开 时间 选择组件
            handlePickTime() {
                this.sortPop = false
                this.areaPop = false
                this.typePop = false
                this.activityPop = false
                this.timePop = !this.timePop
            },
            // 选择活动形式 选择组件  change事件
            hanelActiName(item) {
                this.activity = item.codeName
                this.activityPop = false
                this.activityId = item.codeStr
                this.getData()
            },
          // 选择活动形式 选择组件  change事件
          hanelTimeName(item, index) {
            this.time = item
            this.timePop = false
            if (index === 0) {
              this.enrollTime = this.today;
              this.pickDay='';
              this.endTime='';
              this.enrollWay=1;
            } else if (index === 1) {
              this.pickDay = this.getLocalTime(this.timeAdd(new Date(),0),'YYYY-MM-DD');
              this.enrollTime='';
              this.endTime = this.getLocalTime(this.timeAdd(new Date(),15),'YYYY-MM-DD');
              this.enrollWay=0;
            } else if (index === 2) {
              this.pickDay = this.getLocalTime(this.timeAdd(new Date(),0),'YYYY-MM-DD');
              this.endTime = this.getLocalTime(this.timeAdd(new Date(),30),'YYYY-MM-DD');
              this.enrollTime='';
              this.enrollWay=0;
            }  else {
              //this.$refs.picker.open();
              this.datePickerOpen=true;
              this.enrollWay=0;
            }
            if(!this.datePickerOpen){
              this.getData()
            }
          },
          timeAdd(date,num){
              var newDate= date.setDate(date.getDate()+num);
              return newDate;
          },
            //获取 类型 数据 艺术类型
            getBasecode() {
                let code = '011'
                basecode(code).then(res => {
                    console.log(res)
                    this.typeArry = res
                    this.typeArry.splice(0, 0, { codeStr: '', codeName: '不限', upCodeStr: null })
                    setTimeout(() => {
                        this.firstGetData()
                    }, 20)
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
                this.artArr = this.typeArry.filter(f => f.upCodeStr === item.codeStr)
                item.codeStr !== '' ? this.artArr.splice(0, 0, { codeStr: '', codeName: '不限' }) : ''
                this.typeNum = -1
                if (this.artArr.length > 0) {
                    this.dialogType = true
                } else {
                    this.type = item.codeName
                    this.typeName = item.codeName
                    this.typeId = item.codeStr
                    this.getData()
                    this.typePop = false
                }


            },

            // 跳转到预告详情页
            handleLink(item) {
                if(item.source!=3){
                  this.$router.push('/Activities/' + item.id)
                }else{
	                //this.$router.push('/Courses/' + item.id)
	                this.$router.push({path:
		                '/Courses/' + item.id,
		                query: {waitStatename:
			                this.time}})
                }
	                // this.$router.push({path:
		             //    '/Courses/' + item.id,
            },

            // 获取活动时间
//            _getDate() {
//                let id = this.areaId
//                let day = new Date().toLocaleString().split(' ')[0].replace(/\//g, '-')
//                let size = 5
//                dayStart(id, day, size).then(res => {
//                    console.log(res)
//                }).catch(err => {
//                    console.log(err)
//                })
//            },

            // 获取活动最晚时间
            _getLastDate() {
                dayEnd(this.areaId).then(res => {
                    console.log(res)
                    let tid = ''
                    let oneDay = 24 * 60 * 60 * 1000        // 一天的毫秒数
                    let todayId = Date.parse(new Date()) + oneDay * 3
                    let twoDay = new Date(todayId).toLocaleString().split(' ')[0].replace(/\//g, '-')
                    let lastDay = Date.parse(new Date(res.endDate)) + oneDay
                    let day = Date.parse(new Date('2017-06-01'))            // 需要后台提供开始时间
                    let dayX = Math.ceil((lastDay - day) / oneDay)        // 中间相差的天数
                    let dayArr = []
                    for (var i = 0; i < dayX; i++) {
                        this.dayArr.push(new Date(day).toLocaleString().split(' ')[0].replace(/\//g, '-'))
                        day = day + oneDay
                    }
                    this.dayArr.map((m, i) => {
                        if (m === twoDay) {
                            setTimeout(() => {
                                let id = document.getElementById(i)
                                id.scrollIntoView(true)
                            }, 100)
                        }
                    })
                })
            },
            // 选择的日期
            _pickDay(item) {
                this.pickDay = item
                let time = item.split('-')
                this.showday = `${time[0]}年${time[1]}月`
                this.getData()
                console.log(item)
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
            setHeight() {
                let id = document.getElementById('listHeight')
                if (IS_WX) {
                    id.style.height = 15 + 'rem'
                } else {
                    id.style.height = 17.5 + 'rem'
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
                this.type = this.typeName
                this.typeId = this.artId
                this.getData()
            },
            // 艺术分类选择
            handleCheck(item, index) {
                this.typeName = item.codeName
                this.artId = item.codeStr
                this.typeNum = index
            }
        },
        created() {
            this.getSort()
            let time = new Date().toLocaleString().split(' ')[0].replace(/\//g, '-').split('-')
            this.showday = `${time[0]}年${time[1]}月`
        },
        mounted() {
            this.scroller = this.$el
            this.setHeight()
        },
        filters: {
            IsState(s) {
                return s===-1?'还未开始':s === 0 ? '即将开始' : s === 1 ? '正在进行' : '已经结束'
            },
            IsEnroll(y) {
                return y === 0 ? '直接前往' : '前往报名'
            },
            pickerTime(t) {
                return t.toLocaleString().split(' ')[0]
            },
            short(s) {
                let arr = s.split('-')
                return `${arr[2]}`
            },
            day(d) {
                let day = (new Date(d)).getDay()
                return day === 0 ? '日' : day === 1 ? '一' : day === 2 ? '二' : day === 3 ? '三' : day === 4 ? '四' : day === 5 ? '五' : '六'
            },
            fontNum(f) {
                return f.length > 20 ? f.substr(0, 20) + '...' : f
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
        top:-1rem;
        left:30%;
        z-index:1000;
    }
    .ivu-picker-panel-icon-btn{
        visibility: hidden!important;
    }
</style>
