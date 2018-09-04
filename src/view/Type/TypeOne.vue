<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>验票</span>
        </div>
        <div class="homeCenter">
            <input class="typeInput" v-model.trim="phone" type="tel" placeholder="输入常用手机号" maxlength="11">
            <div class="flexBettwens" style="background-color: #ffffff;border-bottom: 1px solid #e5e5e5">
                <input class="typeInputs" v-model.trim="code" type="tel" placeholder="输入验证码" maxlength="4">
                <div v-if="!isSend" @click="handleGetCode" class="typeCode">获取验证码</div>
                <div v-if="isSend" class="typeCode">{{ times }}秒后获取</div>
            </div>
            <div @click="handleTest" class="typeCodeBtn">立即验票</div>
        </div>
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
                <div class="typeList">
                    <div class="title">报名信息</div>
                    <div class="list">
                        <div class="flexBase">
                            <div class="left">学员姓名</div>
                            <div class="right">李慧</div>
                        </div>
                        <div class="flexBase">
                            <div class="left">学员性别</div>
                            <div class="right">李慧</div>
                        </div>
                        <div class="flexBase">
                            <div class="left">学员年龄</div>
                            <div class="right">李慧</div>
                        </div>
                        <div class="flexBase">
                            <div class="left">联系电话</div>
                            <div class="right">李慧</div>
                        </div>
                        <div class="flexBase">
                            <div class="left">报名时间</div>
                            <div class="right">李慧</div>
                        </div>
                        <div class="flexBase">
                            <div class="left">活动名称</div>
                            <div class="right">李慧</div>
                        </div>
                        <div class="flexBase">
                            <div class="left">地址</div>
                            <div class="right">李慧</div>
                        </div>
                    </div>
                </div>
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
    import { sendmsg, valsendmsg, isenroll } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';

    export default {
        name: '',
        data() {
            return {
                phone: '',
                code: '',
                times: 60,             // 验证码倒计时
                isSend: false,         //是否已发送短信
                successPop: false,       // 报名成功弹窗
                failPop: false,          // 报名失败弹窗
            }
        },
        methods: {
            // 返回
            handleBack() {
                this.$router.go(-1)
            },
            // 获取验证码
            handleGetCode() {
                let reg = /^1(3|4|5|7|8)\d{9}$/
                if (this.phone === '') {
                    Toast('请输入手机号')
                } else if (!(reg.test(this.phone))) {
                    Toast('手机号不正确')
                } else {
                    let title = '活动报名'
                    let phone = this.phone
                    sendmsg(phone, title).then(res => {
                        console.log(res)
                        Toast('短信已发送')
                        let _this = this;
                        _this.isSend = true;
                        let interval = window.setInterval(function () {
                            if ((_this.times--) <= 1) {
                                _this.times = 60;
                                _this.isSend = false;
                                window.clearInterval(interval);
                            }
                        }, 1000);
                    }).catch(err => {
                        console.log(err.response)
                    })
                }
            },
            // 验票
            handleTest() {
                if (this.phone === '') {
                    Toast('请输入手机号')
                } else if (this.code === '') {
                    Toast('请输入验证码')
                } else {
                    Indicator.open('验证中...');
                    let phone = this.phone
                    let code = this.code
                    valsendmsg(phone, code).then(res => {
                        console.log(res)
                        Indicator.close()
                        let id = this.$route.params.id
                        let phone = this.phone
                        isenroll(id, phone).then(res => {
                            console.log(res)
                            this.successPop = true
                        }).catch(err => {
                            console.log(err.response)
                            this.failPop = true
                        })
                    }).catch(err => {
                        console.log(err.response)
                        Toast(err.response.res.msg)
                        Indicator.close()
                    })
                }
            },
            // 返回首页
            handleHome() {
                this.$router.replace('/Home')
            }
        }
    }
</script>

<style>

</style>
