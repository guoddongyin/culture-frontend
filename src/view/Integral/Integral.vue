<template>
    <div id="news">
        <div class="leftTop">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>我的积分</span>
        </div>
        <div class="center">
            <div :style="bg">
                <div class="integralBg">
                    <span style="font-size: 1.05rem;">
                        <yd-countup
                                :endnum="endnum"
                                duration="1"
                        ></yd-countup>
                    </span>
                    <span style="font-size: 0.37333rem">分</span>
                </div>
                <!--<router-link to="/IntegralRule" tag="div" class="integralRule">-->
                    <!--<i class="iconfont icon-nav-set-help"></i>-->
                    <!--<span>积分规则</span>-->
                <!--</router-link>-->
                <div @click="toRules" class="integralRule">
                    <i class="iconfont icon-nav-set-help"></i>
                    <span class="integralText">积分规则</span>
                </div>
            </div>
            <div class="integralDetails">
                <div class="integralInfoTitle">
                    <div style="width: 40%">日期</div>
                    <div style="width: 20%">收入</div>
                    <div style="width: 40%">详细说明</div>
                </div>
                <integrals></integrals>

            </div>
        </div>
    </div>
</template>

<script>
    import { allintegral } from '../../api/api'
    import Integrals from './Integrals.vue'
    export default {
        name: '',
        components:{
            Integrals
        },
        data() {
            return {
                bg: {
                    backgroundImage: "url(" + require("../../assets/jf.png") + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% auto",
                    height: '5.6rem',
                    color: '#ffffff'
                },
                endnum: 0,
            }
        },
        created() {
            this.allCount()
        },
        mounted() {
        },
        methods: {
            toRules(){
              this.$router.push("/IntegralRule");
            },
            handleBack() {
                this.$router.go(-1)
            },
            allCount() {
                allintegral().then(res => {
                    this.endnum = res.count
                })
            }
        },
    }
</script>

<style>

</style>
