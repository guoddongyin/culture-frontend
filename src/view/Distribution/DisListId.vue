<template>
    <div id="users">
        <div class="top">
            <i @click="handleBack" class=" iconfont icon-left"
               style="position: absolute;top: 0rem; left: 0rem;margin-left: 0.4rem"></i>
            <span>我要预约-服务产品</span>
            <!--<div class="rights topSearch iconfont icon-sousuo1" style="font-size: 20px"></div>-->
        </div>
        <div class="center" style="margin-bottom: 0rem">
            <div class="banner" :style="bg" style="color: #ffffff">
                <div class="avatar">
                    <img :src="content.headimg || img" alt="">
                </div>
                <div class="nick">{{ content.name }}</div>
                <span>{{ content.telphone }}</span>
                <span></span>
            </div>
            <div class="flex" style="background-color: #ffffff;border-bottom: 1px solid #e5e5e5">
                <!--团队content.vtype==='1'-->
                <div class="yyTitle"
                     v-if="content.vtype==='1'"
                     v-for="(item,index) in type"
                     :key="index"
                     @click="handleTab(item,index)"
                     :class="index===typeNum?'yyColor':''"
                     style="border-right: 1px solid #e5e5e5;">
                    {{ item.text }}
                </div>
                <!--志愿者个人content.vtype==='0'-->
                <div class="yyTilteZero"
                     v-if="content.vtype==='0'&&index<3"
                     v-for="(item,index) in type"
                     :key="index"
                     @click="handleTab(item,index)"
                     :class="index===typeNum?'yyColor':''"
                     :style="index===1?'border-right: 1px solid #e5e5e5;border-left: 1px solid #e5e5e5;':''">
                    {{ item.text }}
                </div>
            </div>
            <!--产品-->
            <div v-if="typeNum===2" style="padding: 0.4rem;background-color: #ffffff;margin-top: 0.2rem">
                <div @click="toItemInfo(item)" v-for="(item,index) in content.items" :key="index"
                     style="border-bottom: 1px solid #e5e5e5;margin-bottom: 0.2rem">
                    <div class="flexBettwens">
                        <div style="font-size: 0.4rem">{{ item.itemname }}</div>
                        <div class="flex">
                            <div @click.stop="_toEva(item,index)" class="rateBtn">评分</div>
                            <div @click.stop="handleToOrder(item)" class="yyBtn">预约</div>
                        </div>
                    </div>
                    <div class="flexs">
                        <yd-rate active-color="#fa711b" slot="left" size="16px" v-model="item.startnumber"
                                 :readonly="true"></yd-rate>
                        <div style="margin: 0 0.2rem">
                            [{{ item.restypename }}]
                        </div>
                        <div style="color: #fa711b">{{ item.serverType | type }}</div>
                    </div>
                    <div>
                        {{ item.itemcontent }}
                    </div>
                </div>
            </div>
            <!--相册-->
            <div v-if="typeNum===1" class="listPhoto">
                <img v-lazy="url+item.imgurl" v-for="(item,index) in content.picture" :key="index" alt="">
            </div>
            <!--简介-->
            <div v-if="typeNum===0" style="padding: 0.4rem;background-color: #ffffff;margin-top: 0.2rem">
                <div v-if="content.vtype==='1'">
                    <div>机构法人:{{ content.mangername }}</div>
                </div>
                <div v-if="content.vtype==='0'">
                    <div>职 称：{{ content.jobTitle }}</div>
                    <div>职 业：{{ content.position }}</div>
                    <div>学 历：{{ content.education }}</div>
                </div>
                <div>
                    团队简介：{{ content.content }}
                </div>
            </div>
            <!--团队-->
            <div v-if="typeNum===3" class="teamPhoto">
                <div v-for="(item,index) in content.member" :key="index" class="team">
                    <img v-lazy="(item.imgurl) || img " alt="">
                    <div>{{ item.name }}</div>
                </div>
            </div>
        </div>
        <!--评分弹窗-->
        <yd-popup v-model="popCenter" position="center" width="60%">
            <div style="padding: 0.4rem">
                <div class="flexBettwens" style="margin: 0 0.8rem">
                    <div>评分：</div>
                    <div>
                        <yd-rate active-color="#fa711b" slot="right" size="16px" v-model="rate"></yd-rate>
                    </div>
                </div>
                <div class="flexBettwens" style="margin:0.4rem 0.8rem 0 0.8rem">
                    <div @click="_rateSave" class="rateBtn">保存</div>
                    <div @click="popCenter=false" class="rateBtn">取消</div>
                </div>
            </div>
        </yd-popup>
        <!--地区选择-->
        <yd-popup v-model="rightPop" position="right" width="100%">
            <div class="top">
                <i @click="rightPop=false" class=" iconfont icon-left"
                   style="position: absolute;top: 0rem; left: 0rem;margin-left: 0.4rem"></i>
                <span>预约申请</span>
                <!--<div @click="handleSubmit" class="rightPopBtn">-->
                    <!--<div class="btn">提交</div>-->
                <!--</div>-->
            </div>
            <div class="areaList">
                <!--<div class="list" v-for="(item,index) in areaName"-->
                <!--:key="index"-->
                <!--@click="handlePick(item,index)"-->
                <!--:style="areaNum===index?'background-color:#999999':''">-->
                <!--重庆市{{ item.name }}-->
                <!--</div>-->
                <div v-for="(c,i) in chatArr" :key="i">
                    <div style="background-color: #999999;color: #ffffff;padding: 0.4rem">{{ c }}
                    </div>
                    <div v-for="(item,index) in areaName" :key="index">
                        <div @click="handlePick(item)" style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5"
                             :style="areaNum===index?'background-color:#999999':''"
                             v-if="item.id!='0'&&item.headChar===c">{{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
        </yd-popup>
        <!--区域下级菜单弹窗-->
        <mu-dialog :open="dialogArea" title="区域选择" @close="closeArea">
            <mu-menu>
                <mu-menu-item :id="index" :class="areaTreeNum===index?'menuColor':''"
                              @click="handleCheckArea(item,index)"
                              :title="item.name" v-for="(item,index) in areaArr" :key="index"/>
            </mu-menu>
            <mu-flat-button slot="actions" @click="closeArea" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="handleSubmit" label="提交"/>
        </mu-dialog>
    </div>
</template>

<script>
    import { volsId, area, userLove, isEvaluation, postEvaluation } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui'

    export default {
        name: '',
        data() {
            return {
                url: URL,
                img: require('../../assets/re1.png'),
                type: [{ text: '简介' },{ text: '相册' },{ text: '服务产品' },   { text: '成员' }],
                typeNum: 0,                     // 选择的页面编号，默认0
                content: [],
                areaName: [],
                bg: {
                    backgroundImage: "url(" + require("../../assets/bg1.png") + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% auto",
                    height: '4.8rem',
                },
                disName: '',                     // 记录选择的预约项目
                rightPop: false,                 // 右侧弹窗控制器
                areaNum: '',
                itemId: '',                      // 记录item的ID
                dialogArea: false,               // 区域下级菜单弹窗 控制器
                areaTreeNum: '',                 // 记录下级选择的区域ID
                areaArr: [],                      // 子级区域数组
                chatArr: 'BCDFHJKLNPQRSTWXYZ'.split(''),
                popCenter: false,
                rate: 5,
                itemId: '',
            }
        },
        methods: {
            toItemInfo(item){
                this.$router.push("/itemInfo/"+item.id);
            },
            handleBack() {
                this.$router.go(-1)
            },
            // 获取资料
            getData() {
                Indicator.open()
                let id = this.$route.params.id
                volsId(id).then(res => {
                    this.content = res
                    this.getArea()

                }).catch(err => {
                    console.log(err.response)
                    Indicator.close()
                })
            },
            // 切换页面
            handleTab(item, index) {
                this.typeNum = index
            },
            // 获取区域名称
            getArea() {
                let areaId = 0
                area(areaId).then(res => {
                    console.log(res)
                    // 区域排序
                    res.sort((a, b) => a.headChar.charCodeAt(0) - b.headChar.charCodeAt(0))
                    this.areaName = res
                    Indicator.close()
                }).catch(err => {
                    console.log(err.response)
                    Indicator.close()
                })
            },
            // 选择区域
            handlePick(item, index) {
                area(item.id).then(res => {
                    console.log(res)
                    this.areaArr = res
                    this.dialogArea = true
                })
                this.areaNum = index
            },
            // 选择下级区域
            handleCheckArea(item, index) {
                this.pickArea = item.id
                this.areaTreeNum = index
            },
            // 关闭弹窗
            closeArea() {
                this.dialogArea = false
            },
            // 提交
            handleSubmit() {
                let userInfo = USERINFO
                console.log(userInfo)
                let params = {
                    adminAreaId: this.pickArea,
                    itemId: this.itemId,
                    linkman: userInfo.realname || userInfo.nickname,
                    phone: userInfo.tel,
                    userId: userInfo.id,
                    userName: userInfo.username
                }
                if (this.areaNum === '') {
                    Toast('请选择区域')
                } else {
                    userLove(params).then(res => {
                        console.log(res)
                        this.$router.push('/Publicat/' + userInfo.id)
                    }).catch(err => {
                        console.log(err.response)
                        Toast(err.response.data.msg)
                    })
                }

            },
            // 去预约
            handleToOrder(item) {
                console.log(item)
                this.itemId = item.id
                let userinfo = USERINFO
                console.log(userinfo)
                if (USERINFO) {
                    if (userinfo.usertype === '1') {
                        // 公众用户
                        this.rightPop = true
                    } else {
                        // 基层用户
                        this.$router.push('/ToOrder/' + item.id)
                    }
                } else {
                    this.$router.push('/Login')
                }
            },
            // 评分
            _rateSave() {
                let params = {
                    clientid: '',
                    ip: '',
                    itemid: this.itemId,
                    starnumber: this.rate,
                    userid: USERINFO.id,
                    username: USERINFO.username
                }
                postEvaluation(params).then(res => {
                    console.log(res)
                    this.popCenter=false
                    Toast('评价成功')
                }).catch(err=>{
                    this.popCenter=false
                    Toast(err.response.data.msg)
                })
            },
            _toEva(item, index) {
                this.itemId = item.id
                let userID=USERINFO?USERINFO.id:new Date().getTime()
                isEvaluation(this.itemId,userID,'').then(res => {
                    console.log(res)
                }).catch(err=>{
                    if(err.response.data.res===51502){
                        this.popCenter = true
                    }else {
                        Toast(err.response.data.msg)
                    }
                })
            },
    }
    ,
    created(){
        this.getData()
    }
    ,
    filters: {
        type(t)
        {
            return t === '1' ? '志愿服务' : '政府购买'
        }
    }
    }
</script>

<style>

</style>
