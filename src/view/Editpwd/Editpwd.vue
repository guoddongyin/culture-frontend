<template>
    <div id="login" :style="bg">
        <div class="logo">

        </div>
        <div @click="handleBack" class="goBack">
            <i class="iconfont icon-left">返回</i>
        </div>
        <div class="logoInput">
            <!--<div class="textInput">-->
                <!--<i class="iconfont icon-contextphone"></i>-->
                <!--<input v-model="phone" type="tel" placeholder="请输入手机号" maxlength="11">-->
            <!--</div>-->
            <div class="textInput">
                <i class="iconfont icon-suo"></i>
                <input v-model="pwd" type="password" placeholder="请输入旧密码" maxlength="20">
            </div>
            <div class="textInput">
                <i class="iconfont icon-suo"></i>
                <input v-model="repwd" type="password" placeholder="请输入新密码 6-20位字母加数字组合" maxlength="20">
            </div>
            <div class="textInput" style="position: relative;top: 0;left: 0;">
                <i class="iconfont icon-suo"></i>
                <input v-model="code" type="tel" placeholder="请输入验证码" maxlength="6">
                <div v-if="!isSend" @click="handleGetCode" class="getCode">获取验证码</div>
                <div v-if="isSend" class="getCode">{{ times }}秒后获取</div>
            </div>
        </div>
        <div @click="handleEdit" class="login">
            完 成
        </div>
    </div>
</template>

<script>
    import { findPwd, valphones, valsendmsg, changepwd } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';
    import md5 from 'js-md5'

    export default {
        name: '',
        data() {
            return {
                bg: {
                    backgroundImage: "url(" + require("../../assets/zc.jpg") + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% auto",
                },
                logo: require('../../assets/logo.png'),
                phone: '',
                pwd: '',
                repwd: '',
                code:'',
                times:'60',
                isSend:false
            }
        },
        methods: {
            //返回
            handleBack() {
                this.$router.go(-1)
            },
            //获取验证码
            handleGetCode() {
                if (this.phone === '') {
                    Toast('请输入手机号')
                } else {
                    Indicator.open()
                    let tit = '忘记密码',
                        type=6;
                    findPwd(this.phone,tit,type).then(res=>{
//                  this.$http.get(`/new/api/culture-app-gateway/user/sendmsg/${this.phone}?title=手机注册`).then(res=>{
                        console.log(res)
                        Indicator.close()
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
                        Indicator.close()
                        Toast(err.response.data.msg)
                    })
                }

            },
            // 修改密码
            handleEdit(){
                let pwdReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
                if(this.phone===''){
                    Toast('请输入手机号')
                }else if(this.pwd===''){
                    Toast('请输入旧密码')
                }else if(this.repwd===''){
                    Toast('请输入新密码')
                }else if(!pwdReg.test(this.repwd)){
                    Toast('新密码格式不符合规则')
                }else if(this.code===''){
                    Toast('请输入验证码')
                }else {
                    let params={
                        code:this.code,
                        password:md5(this.pwd),
                        password_new:md5(this.repwd)
                    }
                    changepwd(params).then(res=>{
                        console.log(res)
                        Toast('修改成功')
                        window.history.back()
                    }).catch(err=>{
	                    Indicator.close()
	                    Toast(err.response.data.msg)
                    })
                }
            }
        },
        mounted() {
            this.phone=USERINFO.tel
        }
    }
</script>

<style>

</style>
