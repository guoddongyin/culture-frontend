<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>验票</span>
        </div>
        <div class="typeList" style="padding-top: 1.2rem">
            <div class="title">报名信息</div>
            <div class="list">
                <div class="flexBase">
                    <div class="left">学员姓名</div>
                    <div class="right">{{ u.applyName }}</div>
                </div>
                <div class="flexBase">
                    <div class="left">学员性别</div>
                    <div class="right">{{ u.applySex | sex }}</div>
                </div>
                <div class="flexBase">
                    <div class="left">学员年龄</div>
                    <div class="right">{{ u.applyAge }}</div>
                </div>
                <div class="flexBase">
                    <div class="left">联系电话</div>
                    <div class="right">{{ u.telphone }}</div>
                </div>
                <div class="flexBase">
                    <div class="left">报名时间</div>
                    <div class="right">{{ u.addTime | times }}</div>
                </div>
                <div class="flexBase">
                    <div class="left">活动名称</div>
                    <div class="right">{{ u.activityName }}</div>
                </div>
                <!--<div class="flexBase">-->
                    <!--<div class="left">地址</div>-->
                    <!--<div class="right">？？？</div>-->
                <!--</div>-->
            </div>
        </div>
        <div style="color: #fa711b;padding: 0.4rem">请确认验证信息无误在确认验票，一经验票将再无法使用!</div>
        <div @click="handleOk" class="okBtn">确 认</div>
        <!--Success弹窗-->
        <yd-popup v-model="successPop" position="right" width="100%">
            <div class="tops">
                <i @click="successPop=false" class=" iconfont icon-left"></i>
                <span>验票</span>
            </div>
            <div class="typePop">
                <div class="flexCenter">
                    <i style="font-size:80px;color: #53f28b" class="iconfont icon-zhengque"></i>
                </div>
                <div style="text-align: center;font-size: 0.5rem">验票成功</div>
                <div @click="handleHome" class="typeBack">
                    返回首页
                </div>
            </div>
        </yd-popup>
        <!--fail弹窗-->
        <yd-popup v-model="failPop" position="right" width="100%">
            <div class="tops">
                <i @click="failPop=false" class=" iconfont icon-left"></i>
                <span>验票</span>
            </div>
            <div class="typePop">
                <div class="flexCenter">
                    <i style="font-size:80px;color: #b3b3b3" class="iconfont icon-error-20170103"></i>
                </div>
                <div style="text-align: center;font-size: 0.5rem">对不起，你还未报名！</div>
                <div @click="handleHome" class="typeBack">
                    返回首页
                </div>
            </div>
        </yd-popup>
    </div>
</template>

<script>
    import { getEnrollInfoById, affirm } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';

    export default {
        name: '',
        data() {
            return {
                u: {},
                successPop: false,
                failPop: false,
            }
        },
        methods: {
            // 返回
            handleBack() {
                this.$router.go(-1)
            },
            // 获取信息
            getData() {
                let id = this.$route.params.id
                getEnrollInfoById(id).then(res => {
                    console.log(res)
                    this.u = res
                }).catch(err => {
                    console.log(err.response)
                    Toast(err.response.res.msg)
                    this.$router.replace('/Home')
                })
            },
            // 点击 确认到场状态
            handleOk() {
                let id = this.$route.params.id
                // state===1,确认状态为 已到场
                let state = 1
                let params = {
                    affirmState: state
                }
                affirm(id, params).then(res => {
                    console.log(res)
                    this.successPop = true
                }).catch(err => {
                    this.failPop=true
                    console.log(err.response)
                })
            },
            // 返回首页
            handleHome(){
                this.$router.push('/Home')
            }
        },
        created() {
            this.getData()
        },
        filters: {
            sex(s) {
                return s === 0 ? '女' : '男'
            }
        }
    }
</script>

<style>

</style>
