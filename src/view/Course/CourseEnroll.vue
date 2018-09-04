<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>在线报名</span>
        </div>
        <div class="homeCenter">
            <div class="venue" style="font-size: 0.4rem">
                {{ content.name }}
            </div>
            <div class="enrollText">
                <div>报名须知<i></i></div>
                <div class="iconfont icon-down"></div>
            </div>
            <div class="enrolltxt">
                <div class="enrollContents">
                    {{ content.bmyq }}
                </div>
                <div style="margin-top: 0.2rem">
                    <yd-checkbox-group v-model="checkbox">
                        <yd-checkbox val="1" shape="circle">我已阅读</yd-checkbox>
                    </yd-checkbox-group>
                </div>
            </div>
            <div v-if="checkbox.length">
                <div class="enrollText">
                    <div>报名信息<i></i></div>
                </div>
                <div id="logoInput" class="enrollTextCenter" style="background-color: #ffffff">
                    <div class="userInfoInput">
                        <div class="textName"><i style="color: red">*</i>学员姓名</div>
                        <input v-model="username" @focus="pageToView" type="text" placeholder="请输入真实姓名">
                    </div>
                    <div class="userInfoInput">
                        <div class="textName"><i style="color: red">*</i>学员性别</div>
                        <div style="margin-left: 0.4rem">
                            <yd-radio-group v-model="sex" color="#fa711b">
                                <yd-radio val="女"></yd-radio>
                                <yd-radio val="男"></yd-radio>
                            </yd-radio-group>
                        </div>
                    </div>
                    <div class="userInfoInput">
                        <div class="textName"><i style="color: red">*</i>身份证号</div>
                        <input v-model="card" @focus="pageToView" type="text" placeholder="请输入身份证号码">
                    </div>
                    <!--<div class="userInfoInput">-->
                        <!--<div class="textName">学员年龄</div>-->
                        <!--<input v-model="birthday" type="text" placeholder="请输入生日" readonly>-->
                    <!--</div>-->
                    <div class="userInfoInput">
                        <div class="textName"><i style="color: red">*</i>联系电话</div>
                        <input v-model="phone" @focus="pageToView" type="tel" placeholder="请输入手机号">
                    </div>
                    <div class="userInfoInput">
                        <div class="textName"><i style="color: red">*</i>验证码</div>
                        <div class="flexBettwens" style="width: 75%">
                            <input style="width: 2rem" v-model="code" @focus="pageToView" type="text" placeholder="请输入验证码">
                            <div v-if="!isSend" @click="handleGetCode" class="getCode">获取验证码</div>
                            <div v-if="isSend" class="getCode">{{ times }}秒后获取</div>
                        </div>
                    </div>
                    <div style="padding: 0.4rem;background-color: #f5f5f5">
                        <div @click="handleEnroll" class="editUserInfoBtn">
                            提交信息
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import { freeItemsDetail, sendmsg, courseEnroll } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';

    export default {
        name: '',
        data() {
            return {
                checkbox: [],         // 多选框
                sex: '',              // 单选框
                isSend: false,           //是否发送短信
                times: 60,               //倒计时
                username: '',             // 真实姓名
                card: '',                // 身份证号码
                birthday: '',             // 生日
                phone: '',               // 手机号
                code: '',                // 验证码
                content: []
            }
        },
        watch: {
            checkbox(v) {
                console.log(v)
            }
        },
        methods: {
          pageToView(){
            setTimeout(function (){
              var panel=document.getElementById('logoInput');

              panel.scrollIntoView(true);
              panel.scrollIntoViewIfNeeded();
            },200);
          },
            // 返回
            handleBack() {
                window.history.back()
            },
            // 通过路由传的ID获取详情数据
            getData() {
                Indicator.open()
                let id = this.$route.params.id
                freeItemsDetail(id).then(res => {
                    console.log(res)
                    // 如果需要报名，则显示报名起止时间，并分割字符
                    if (res.enrollWay === 1) {
                        res.enrollStartTime = res.enrollStartTime.split(' ')[0]
                        res.enrollEndTime = res.enrollEndTime.split(' ')[0]
                    }
                    this.content = res
                    this.getUserInfo()
                    Indicator.close()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 获取用户个人信息
            getUserInfo() {
                let userInfo = USERINFO
                console.log(userInfo)
                this.username = userInfo.realname || ''
                this.phone = userInfo.mobile
                this.birthday = userInfo.birthday
                this.sex = userInfo.sex || '女'
            },
            // 获取手机验证码
            handleGetCode() {
                // 手机正则
                let pReg = /^1(3|4|5|6|7|8|9)\d{9}$/
                if (this.phone === '') {
                    Toast('请输入手机号')
                } else if (pReg.test(this.phone) === false) {
                    Toast('手机号不正确')
                } else {
                    let title = '活动报名'
                    sendmsg(this.phone, title,5,this.$route.params.id).then(res => {
//                this.$http.get(`/new/api/culture-app-gateway/user/sendmsg/${this.phone}?title=活动报名`).then(res => {
                        console.log(res)
                        let _this = this;
                        _this.isSend = true;
                        let intervals = window.setInterval(function () {
                            if ((_this.times--) <= 1) {
                                _this.times = 60;
                                _this.isSend = false;
                                window.clearInterval(intervals);
                            }
                        }, 1000);
                        Toast('验证码已发送');
                    }).catch(err => {
                        //Toast('验证码已发送');
	                    Toast(err.response.data.msg)

                    })
                }
            },
            // 提交报名信息
            handleEnroll() {
                var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
                // 手机正则
                let pReg = /^1(3|4|5|6|7|8|9)\d{9}$/
                if (this.username === '') {
                    Toast('请输入姓名')
                } else if (reg.test(this.card) === false) {
                    Toast('身份证号码不正确')
                } else if (this.phone === '') {
                    Toast('请输入手机号')
                } else if (pReg.test(this.phone) === false) {
                    Toast('手机号不正确')
                } else if (this.code === '') {
                    Toast('请输入验证码')
                } else {
                    let self = this.content
                    let params = {
                        activityId: this.$route.params.id,
                        addAreaId: self.addAreaId,
                        addAreaNo: self.addAreaNo,
                        addOrg: self.addOrg,
                        applyName: this.username,
                        applySex: this.sex === '女' ? 0 : 1,
                        idcard: this.card,
                        telphone: this.phone,
                        verifyCode: this.code
                    }
                    courseEnroll(params).then(res => {
                        console.log(res)
                        this.$router.go(-2);
                        Toast('提交成功，待管理员审核')
                    }).catch(err => {
                        console.log(err.response)
                        Toast(err.response.data.msg)
                    })
                }
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style>

</style>
