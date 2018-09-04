<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>逛展览</span>
        </div>
        <div class="homeCenter" style="margin-bottom: 0rem">
            <div class="pofixed">
                <div class="search">
                    <div class="searchText" :style="textAlign?'text-align:left':'text-align:right'">
                        <div style="padding:0 0.4rem;">
                            <i v-if="!textAlign" class="iconfont icon-sousuo1"></i>
                            <input @focus="handleFocus"
                                   @blur="handleBlur"
                                   @input="getData"
                                   v-model="searchText"
                                   type="search"
                                   placeholder="搜索活动">
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
                        <div>{{ activity }}</div>
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

            <div style="padding-top: 2.8rem;overflow: auto;background-color: #e5e5e5">
                <div @click="handleLink(item)" v-for="(item,index) in contents" :key="index" class="Accontent"
                     style="border-bottom:none" :style="index===0?'margin-top:0':'margin-top:0.2rem'">
                    <div class="images">
                        <img v-lazy="url+item.imageurl" alt="">
                        <!--<span>{{ item.state | IsEnroll }}</span>-->
                    </div>
                    <div class="title">{{ item.exhname | fontNum }}</div>
                    <div class="tags">
                        <span v-if="item.shape" class="tagShape">{{ item.shape }}</span>
                        <!--<span v-for="(type,index) in item.arttype" :key="index" class="tagType">{{ type }}</span>-->
                        <span v-for="(arttypename,index) in arttypeName" :key="" class="tagType">{{ arttypename }}</span>
                        <!--<span class="tagType" >{{ item.arttypename }}</span>-->
                    </div>
                    <div class="venue">
                        <div>{{ item.addOrgName }}</div>
                        <div>展览时间：<b>{{ item.starttime | times }} 至 {{ item.endtime | times }}</b></div>
                    </div>
                </div>
                <div @click="clickMore" v-if="contents.length>0" class="clickMore">{{ loadingTxt }}</div>
            </div>

            <!--日期选择-->
            <!--<mt-datetime-picker :startDate="new Date()" ref="picker" type="date" v-model="datetime"-->
                                <!--@confirm="handleConfirm"></mt-datetime-picker>-->
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
    import { areas, restype, basecode, exhibitioListshow, allExhibitioListshow, activityKey } from '../../api/api'
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
                content:[],
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
                activity: '时间不限',            // 活动形式文字标识
                activityId: '',                   //活动形式Id,用于请求数据
                // 类型
                typePop: false,                 // 类型 弹窗控制器
                typeArry: [],                   // 存储类型数组（包含ID等）
                type: '艺术类型',                // 类型标识
                typeId: '',                     // 类型ID，用于请求数据
                // 时间选择数组
                pickTime: ['时间不限', '今天', '明天', '后天', '周末', '选择日期'],
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
            }
        },
        watch: {
            contents(s) {
                this.loadingTxt = s.length >= this.total ? '所有数据已加载完毕' : '点击加载'
            }
        },
        computed: {},
        methods: {
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
	            exhibitioListshow(this.searchText, this.areaId, this.typeId, this.startTime, this.endTime, this.limit, this.offset).then(res => {
                    console.log(res)
                    res.data.map(m => m.arttype = m.arttype.split(','))
                    this.contents = res.data
                    this.contents.map(m => m.arttype.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.arttype[i] = t.codeName : '')))
                }).catch(err => {
                    console.log(err.response)
                })
            },
            clickMore() {
              this.offset=this.offset+this.limit
                if (this.total > this.contents.length) {
                    this.loading = true
                    this.loadingTxt = '正在加载...'
                    exhibitioListshow(this.searchText, this.areaId, this.typeId, this.startTime, this.endTime, this.limit, this.offset).then(res => {
                        console.log(res)
                        res.data.map(m => m.arttype = m.arttype.split(','))
                        let arr = res.data
                        arr.map(m => m.arttype.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.arttype[i] = t.codeName : '')))
                        arr.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                        this.contents.push(...arr)
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
            // 获取参活动数据
            getData() {
                Indicator.open()
                this.offset = 0
                exhibitioListshow(this.searchText, this.areaId, this.typeId, this.startTime, this.endTime, this.limit, this.offset).then(res => {
                    console.log(res)
                    console.log('dddd')
                    // 取出在头部的总条数
                    // this.content = res
                    // this.arttypeName=this.content.arttypename.split(',');
                    let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                    this.total = JSON.parse(headers).x_total_count
                    res.data.map(m => m.arttype = m.arttype.split(','))
                    this.contents = res.data
                    this.contents.map(m => m.arttype.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.arttype[i] = t.codeName : '')))
                    this.contents.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                    Indicator.close()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            //第一次获取数据，获取所有
            firstGetData() {
                Indicator.open()
                let isCity=true;
                if (IS_WX) {
                    let area = localStorage.getItem('area')
                    if (!area) {
                        this.area = '选择区域'
                        this.areaId = 0
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
                    allExhibitioListshow(this.areaId, this.limit, this.allCount).then(res => {
                        console.log(res)
	                    console.log('dddd')
                        // 取出在头部的总条数
	                    this.content = res
	                    this.arttypeName=this.content.arttypename.split(',');
                        let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                        this.total = JSON.parse(headers).x_total_count
                        res.data.map(m => m.arttype = m.arttype.split(','))
                        this.contents = res.data
                        this.contents.map(m => m.arttype.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.arttype[i] = t.codeName : '')))
                        this.contents.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                        Indicator.close()
                    }).catch(err => {
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
                        }
                        this.offset = 0
                        allExhibitioListshow(this.areaId, this.limit, this.allCount).then(res => {
                            console.log(res)
                            // 取出在头部的总条数
                            let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                            this.total = JSON.parse(headers).x_total_count
                            res.data.map(m => m.arttype = m.arttype.split(','))
                            this.contents = res.data
                            this.contents.map(m => m.arttype.map((mt, i) => this.typeArry.map(t => mt === t.codeStr ? m.arttype[i] = t.codeName : '')))
                            this.contents.map(m => this.activityArry.map(t => m.shape === t.codeStr ? m.shape = t.codeName : ''))
                            Indicator.close()
                        }).catch(err => {
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
                let pick = Date.parse(v)+24*60*60*1000-1000;
                let todayStartTime = new Date(new Date().toLocaleDateString()).getTime()
                this.startTime = '';
                this.endTime = pick;
                this.activity = v.toLocaleString().split(' ')[0]
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
                    console.log('获取活动形式')
                    console.log(res)
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
                this.activityPop = false
                if (index === 0) {
                    this.startTime = ''
                    this.endTime = ''
                } else if (index === 1) {
                    this.startTime = this.todayStartTime
                    this.endTime = this.todayEndTime
                } else if (index === 2) {
                    this.startTime = this.tomorrowStartTime
                    this.endTime = this.tomorrowEndTime
                } else if (index === 3) {
                    this.startTime = this.tdatStratTime
                    this.endTime = this.tdatEndTime
                } else if (index === 4) {
                    this.startTime = this.saturday
                    this.endTime = this.sunday
                } else {
                    this.$refs.picker.open();
                    return;
                }
                this.getData()
            },

            //获取 类型 数据
            getBasecode() {
                let code = '022'
                basecode(code).then(res => {
                    console.log('获取类型')
                    console.log(res)
                    this.typeArry = res
                   this.typeArry.splice(0, 0, { codeStr: '', codeName: '不限' })
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
                this.type=item.codeName
                this.typeId=item.codeStr
                this.typePop=false
                this.getData()
                // item.codeStr !== '' ? this.artArr.splice(0, 0, { codeStr: '', codeName: '不限' }) : ''
                // this.typeNum=-1
                // if(this.artArr.length>0){
                //     this.dialogType=true
                // }else {
                //     this.type=item.codeName
                //     this.typeName=item.codeName
                //     this.typeId=item.codeStr
                //     this.getData()
                //     this.typePop=false
                // }
            },

            // 跳转到享课程详情页
            handleLink(item) {
                console.log(item.oid)
                this.$router.push('/ExhibitionDetail/' + item.oid)
            },

            // 获取今天的时间戳-->由此可获得明天和后台的时间戳
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
                console.log(todayStartTime)
                // 今天午夜
                this.todayEndTime = todayEndTime
                console.log(todayEndTime)
                // 明天凌晨
                this.tomorrowStartTime = tomorrowStartTime
                console.log(tomorrowStartTime)
                // 明天午夜
                this.tomorrowEndTime = tomorrowEndTime
                console.log(tomorrowEndTime)
                // 后天凌晨
                this.tdatStratTime = tdatStratTime
                console.log(tdatStratTime)
                // 后天午夜
                this.tdatEndTime = tdatEndTime
                console.log(tdatEndTime)
            },

            // 获取周六和周末的时间
            getSunday() {
                var now = new Date();
                now.setHours(0);
                now.setMinutes(0);
                now.setSeconds(0);
                var nowTime = now.getTime();
                var day = now.getDay();
                var oneDayLong = 24 * 60 * 60 * 1000;

                var SaturdayTime = nowTime + (6 - day) * oneDayLong;
                var SundayTime = nowTime + (7 - day+1) * oneDayLong;

                var saturday = new Date(SaturdayTime);
                var sunday = new Date(SundayTime);
                this.saturday = SaturdayTime
                this.sunday = SundayTime-1000;
                console.log(saturday);
                console.log(sunday);
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
                this.artId=item.codeStr
                this.typeNum=index
            }
        },
        created() {
            this.getArea()
        },
        filters: {
            IsEnroll(y) {
                return y === 1 ? '前往观看' : '已经结束'
            },
            pickerTime(t) {
                return t.toLocaleString().split(' ')[0]
            },
            fontNum(f) {
                return f.length > 20 ? f.substr(0, 20) + '...' : f
            }
        }
    }
</script>

<style>

</style>
