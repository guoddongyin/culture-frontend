<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>投上一票</span>
        </div>
        <div class="homeCenter" style="margin-bottom: 0">
            <div class="pofixed">
                <div class="filter" style="padding: 0.2rem 2.5rem;">
                    <div @click="handleAreaPop" class="filters">
                        <div>{{ area }}</div>
                        <i class="iconfont icon-down"></i>
                    </div>
                    <div @click="handlePickType" class="filters">
                        <div>{{ isSolicitation }}</div>
                        <i class="iconfont icon-down"></i>
                    </div>
                    <!--地区选择栏-->
                    <div v-if="areaPop" class="area">
                        <!--<div @click="handleAreaName(item)" v-for="(item,index) in areaArry" :key="index" class="areaName">-->
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
                    <!--投票状态选择-->
                    <div v-if="typePop" class="area pickTimePop">
                        <div @click="hanelActiName(item,index)"
                             v-for="(item,index) in pickState"
                             class="pickTime"
                             :key="index">
                            {{ item }}
                        </div>
                    </div>
                </div>
            </div>

            <div style="padding-top: 1rem;overflow: auto;background-color: #e5e5e5">
                <div @click="handleLink(item)"
                     v-for="(item,index) in contents"
                     :key="index"
                     v-if="isState===''?2>1:isState===item.vote.voteState"
                     class="Accontent first"
                     :style="index===0?'margin-top:0':'margin-top:0.2rem'">
                    <div class="images" style="margin-bottom: 0">
                        <img v-lazy="url+item.vote.imgUrl" alt="">
                        <span>{{ item.vote.voteState  | state }}</span>
                        <div style="padding:0.4rem;border-bottom: 1px solid #e5e5e5;font-size: 0.4rem" class="ell">{{ item.vote.name | fontNum }}</div>
                    </div>
                    <div class="venue" style="border: none">
                        <div>{{ item.vote.conductOrg  }}</div>
                        <div>投票时间：{{ item.vote.startTime | times }}至{{ item.vote.endTime | times }}</div>
                    </div>
                </div>
                <div @click="clickMore" v-if="contents.length>0" class="clickMore">{{ loadingTxt }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { allVoteList,voteList, frontArea, areas } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';
    import { JsBridge } from '../../jsbridge/jsbridge'

    export default {
        name: '',
        data() {
            return {
                url: URL,
                contents: [],
                offset: 0,                       // 页数，默认0
                limit: 20,                       // 每次查询的条数
                loading: false,                  // 滚动加载提示
                total: 0,                        // 总数
                loadingTxt: '点击加载...',        // 正在加载的显示
                allCount: true,                  // 是否加载全部
                // 区域
                city: [{ name: CITYNAME }, { name: CITYAREA }],
                areaPop: false,                 // 区域弹窗控制器
                areaArry: [],                   // 存储区域数组（包含ID等）
                area: '选择区域',                // 区域标识
                areaId: '',                      // 区域ID--用于请求数据
                // 投票状态
                isSolicitation: '投票状态',       // 投票状态
                typePop: false,                  // 投票状态控制器
                pickState: ['状态不限', '正在进行', '投票结束'],
                isState: '',                     // 状态代码
                chatArr: 'BCDFHJKLNPQRSTWXYZ'.split(''),

            }
        },
        watch: {
            contents(s) {
                this.loadingTxt = s.length >= this.total ? '所有数据已加载完毕' : '点击加载'
            }
        },
        methods: {
            // 返回
            handleBack() {
                Indicator.close()
                this.$router.push('/Home')
            },
            clickMore(){
              this.offset=this.offset+this.limit
                if (this.total > this.contents.length) {
                    this.loading = true
                    this.loadingTxt = '正在加载...'
                    voteList(this.areaId,this.offset ,this.limit, this.allCount,this.isState).then(res => {
                        console.log(res)
                        let arr = res.data
                        this.contents.push(...arr)
                        this.loading = false
                        console.log(this.contents.length)
                        this.loadingTxt = '点击加载'
                    }).catch(err => {
                        console.log(err.response)
                    })
                } else {
                    this.loadingTxt = '所有数据已加载完毕'
                }
            },
            getData() {
                Indicator.open()
                this.offset=0;
                // console.log(this.isState);
                // return ''
                voteList(this.areaId,this.offset ,this.limit, this.allCount,this.isState).then(res => {
                    console.log(res)
                    // 取出在头部的总条数
                    let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                    this.total = JSON.parse(headers).x_total_count
                    this.contents = res.data
                    Indicator.close()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 页面第一次获取数据
            getFirstData() {
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
                    allVoteList(this.areaId,this.offset,this.limit,this.allCount).then(res => {
                        console.log(res)
                        // 取出在头部的总条数
                        let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                        this.total = JSON.parse(headers).x_total_count
                        this.contents = res.data
                        Indicator.close()
                    }).catch(err => {
                        console.log(err.response)
                        Indicator.close()
                        Toast(err.response.data.msg)
                        this.$router.go(-1)
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
                        allVoteList(this.areaId,this.offset,this.limit,this.allCount).then(res => {
                            console.log(res)
                            // 取出在头部的总条数
                            let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                            this.total = JSON.parse(headers).x_total_count
                            this.contents = res.data
                            Indicator.close()
                        }).catch(err => {
                            console.log(err.response)
                            Indicator.close()
                            Toast(err.response.data.msg)
                            this.$router.go(-1)
                        })
                    })
                }
            },
            // 获取区域数据
            getArea() {
                let areaId = 0
                areas(areaId).then(res => {
                   //res.splice(0, 0, { headChar: 'C', id: '', name: '重庆市' })
                    // 区域排序
                    res.sort((a, b) => a.headChar.charCodeAt(0) - b.headChar.charCodeAt(0))
                    this.areaArry = res
                    this.getFirstData()
                }).catch(err => {
                })
            },
            //打开区域选择组件
            handleAreaPop() {
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
            // 打开投票状态栏
            handlePickType() {
                this.areaPop = false
                this.typePop = !this.typePop
            },
            // 投票状态选择
            hanelActiName(item, index) {
                this.isSolicitation = item
                if (index === 0) {
                    this.isState = ''
                } else if (index === 1) {
                    this.isState = 1
                } else if (index === 2) {
                    this.isState = 2
                }
                this.typePop = false
	            this.getData()
            },
            // 跳转到详情页
            handleLink(item) {
                console.log(item.vote.id)
                this.$router.push('/VoteId/' + item.vote.id)
            }
        },
        created() {
            this.getArea()
        },
        beforeDestroy(){
            Indicator.close()
        },
        filters: {
            state(s) {
                return s === 0 ? '即将开始' : s === 1 ? '正在投票' : '已经结束'
            },
            fontNum(f) {
                return f.length > 20 ? f.substr(0, 20) + '...' : f
            }
        }
    }
</script>

<style>

</style>
