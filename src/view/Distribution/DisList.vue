<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>我要预约-服务产品</span>
            <!--<div class="rights iconfont icon-sousuo1" style="font-size: 20px"></div>-->
        </div>
        <div class="pofixed">
            <div class="homeCenter" style="margin-bottom: 0rem;padding-top: 0">
                <div class="filter" style="padding: 0.2rem 0.5rem;">
                    <div @click="handleAreaPop" class="filters">
                        <div>{{ area }}</div>
                        <i class="iconfont icon-down"></i>
                    </div>
                    <div @click="handlePickActivity" class="filters">
                        <div>{{ activity }}</div>
                        <i class="iconfont icon-down"></i>
                    </div>
                    <!--<div @click="handlePickType" class="filters">-->
                        <!--<div>{{ type }}</div>-->
                        <!--<i class="iconfont icon-down"></i>-->
                    <!--</div>-->
                    <div @click="handlePickSort" class="filters">
                        <div>{{ sort }}</div>
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
                    <!--活动形式选择栏-->
                    <div v-if="activityPop" class="area">
                        <div @click="hanelActiName(item)" v-for="(item,index) in activityArry" class="areaName"
                             :key="index">
                            {{ item.codeName }}
                        </div>
                    </div>
                    <!--艺术门类或活动类型选择-->
                    <!--<div v-if="typePop" class="area">-->
                        <!--<div @click="hanelTypeName(item)" v-if="item.upCodeStr===null" v-for="(item,index) in typeArry" class="areaName"-->
                             <!--:key="index">-->
                            <!--{{ item.codeName }}-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--排序方式-->
                    <div v-if="sortPop" class="area">
                        <div @click="hanelSortName(item)" v-for="(item,index) in sortArr" class="areaName" :key="index">
                            {{ item }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="flexBettwens" style="padding:0.4rem;background-color: #f5f5f5">
                <div>
                    共有志愿者（团队）（{{ total }}）
                </div>
                <!--<div class="pickSort">-->
                <!--按服务次序排序     <i class="iconfont icon-down"></i>-->
                <!--</div>-->
            </div>
        </div>

        <div style="padding-top: 3.7rem;overflow: auto">
            <div @click="handleGo(item)" class="vols" v-for="(item,index) in list" :key="index"
                 style="width: 100%;margin-top: 0.2rem;margin-bottom: 0" :style="index===0?'margin-top:0':''">
                <div class="flex">
                    <div style="position: relative;margin-right: 0.2rem">
                        <img v-lazy="url+item.headimg" alt="">
                        <div class="pa">{{ item.name | lengthName }}</div>
                    </div>
                    <div style="width: 100%">
                        <div class="flexBettwens">
                            <div>热门课程</div>
                            <div class="typeBtn">{{ item.srestypename }}</div>
                        </div>
                        <div style="font-size: 0.4rem;border-bottom: 1px solid #e5e5e5">{{ item.items[0].itemname }}
                        </div>
                        <div class="flexBettwens">
                            <div>工作单位：</div>
                            <div>{{ item.adminareaidname }}</div>
                        </div>
                        <div style="font-size: 0.2rem;color: #666666;border-bottom: 1px solid #e5e5e5">{{ item.unit }}
                        </div>
                        <div class="flex">
                            <div class="flex">配送次数： {{ item.sendnums }} 次</div>
                            <div class="flex" style="margin-left: 0.2rem">点赞次数： {{ item.praisenums }} 次</div>
                        </div>
                    </div>
                </div>
            </div>
            <div @click="clickMore" v-if="list.length>0" class="clickMore">{{ loadingTxt }}</div>
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
    import { volsAll, areas, basecode,restype } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';
    import { JsBridge } from '../../jsbridge/jsbridge'

    export default {
        name: '',
        data() {
            return {
                url: URL,
                img: require('../../assets/re1.png'),
                offset: 1,                       // 页数，默认0
                limit: 20,                       // 每次查询的条数
                loading: false,                  // 滚动加载提示
                total: 0,                        // 总数
                loadingTxt: '点击加载...',        // 正在加载的显示
                allCount: true,                  // 是否加载全部
                key: '',                          // 搜索的关键词
                list: [],                        // 列表数据
                total: '',                       // 总计
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
                typeId: '',                     // 类型ID，用于请求数据
                // 排序方式
                sortPop: false,                  // 排序方式弹窗控制器
                sortArr: ['服务次数', '评分', '点赞'], // 排序方式数组
                sort: '服务次数',                        // 排序方式
                sortId: '',                      // 暂无使用
                chatArr: 'BCDFHJKLNPQRSTWXYZ'.split(''),
                dialogType: false,
                artArr:[],
                typeNum:-1,
                artId:'',
            }
        },
        watch: {
            list(s) {
                this.loadingTxt = s.length >= this.total ? '所有数据已加载完毕' : '点击加载'
            }
        },
        methods: {
            handleBack() {
                this.$router.push('/Home')
            },
            clickMore() {
                this.offset++
                if (this.total > this.list.length) {
                    this.loading = true
                    this.loadingTxt = '正在加载...'
                    volsAll(this.areaId, this.key, this.offset, this.limit, this.sort, this.activityId).then(res => {
                        console.log(res)
                        let arr = res.data
                        this.list.push(...arr)
                        this.loading = false
                        console.log(this.list)
                        this.loadingTxt = '点击加载...'
                    }).catch(err => {
                        console.log(err.response)
                    })
                } else {
                    this.loadingTxt = '所有数据已加载完毕'
                }
            },
            getData() {
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
                    volsAll(this.areaId, this.key, this.offset, this.limit, this.sort, this.activityId).then(res => {
                        console.log(res)
                        this.list = res.data
                        // 取出在头部的总条数
                        let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                        this.total = JSON.parse(headers).x_total_count
                        console.log(this.total)
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
                        volsAll(this.areaId, this.key, this.offset, this.limit, this.sort, this.activityId).then(res => {
                            console.log(res)
                            this.list = res.data
                            // 取出在头部的总条数
                            let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                            this.total = JSON.parse(headers).x_total_count
                            console.log(this.total)
                            Indicator.close()
                        }).catch(err => {
                            console.log(err.response)
                        })
                    })
                }
            },
            // 获取区域数据
            getArea() {
                let areaId = 0
                Indicator.open()
                areas(areaId).then(res => {
                   //res.splice(0, 0, { headChar: 'C', id: '', name: '重庆市' })
                    // 区域排序
                    res.sort((a, b) => a.headChar.charCodeAt(0) - b.headChar.charCodeAt(0))
                    this.areaArry = res
                    this.getBasecode()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            //打开区域选择组件
            handleAreaPop() {
                this.typePop = false
                this.activityPop =false
                this.areaPop = !this.areaPop
            },
            // 选择区域数据
            handleAreaName(item,isArr) {
                this.area = item.name
                if (IS_WX) {
                    localStorage.setItem('area', this.area)
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
                    this.activityArry.splice(0, 0, { codeStr: '', codeName: '不限', id:''})
                }).catch(err => {
                    console.log(err.response)
                })
            },
            //打开 活动形式 选择组件
            handlePickActivity() {
                console.log(1)
                this.sortPop = false
                this.areaPop = false
                this.typePop = false
                this.activityPop = !this.activityPop
            },
            // 选择活动形式 选择组件  change事件
            hanelActiName(item) {
                this.activity = item.codeName
                this.activityPop = false
                this.activityId = item.id
                this.getData()
            },
            //获取 类型 数据
            getBasecode() {
                let code = '011'
                basecode(code).then(res => {
                    console.log('获取类型')
                    console.log(res)
                    this.typeArry = res
                    this.typeArry.splice(0, 0, { codeStr: '', codeName: '不限', upCodeStr: null })
                    this.getData()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 打开 类型 选择组件
            handlePickType() {
                this.sortPop = false
                this.areaPop = false
                this.typePop = !this.typePop
            },
            // 选择 类型 change事件
            hanelTypeName(item) {
                this.artArr=this.typeArry.filter(f=>f.upCodeStr===item.codeStr)
                item.codeStr !== '' ? this.artArr.splice(0, 0, { codeStr: '', codeName: '不限' }) : ''
                this.typeNum=-1
                if(this.artArr.length>0){
                    this.dialogType=true
                }else {
                    this.type=item.codeName
                    this.typeName=item.codeName
                    this.typeId=item.codeStr
                    this.getData()
                    this.typePop=false
                }
            },
            // 打开排序选择
            handlePickSort() {
                this.areaPop = false
                this.typePop = false
                this.activityPop =false
                this.sortPop = !this.sortPop
            },
            // 选择 排序方式
            hanelSortName(item) {
                this.sort = item
                this.sortPop = false
                this.getData()
            },
            // 前往页面详情
            handleGo(item) {
                this.$router.push('/DisListId/' + item.id)
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
            this.getRestype()
        },
        mounted() {
        },
        filters: {
            lengthName(l) {
                return l.length > 6 ? l.substr(0, 6) + '...' : l
            }
        }
    }
</script>

<style>

</style>
