<template>
    <div id="login" :style="bg">
        <div class="logo">

        </div>
        <div @click="handleBack" class="goBack">
            <i class="iconfont icon-left"></i>
        </div>
        <div class="logoInput" style="margin-top: 4.2rem">
            <div class="textInput">
                <i class="iconfont icon-contextphone"></i>
                <input v-model="phone" type="tel" placeholder="请输入手机号" maxlength="11">
            </div>
            <div class="textInput">
                <i class="iconfont icon-suo"></i>
                <input v-model="pwd" type="password" placeholder="6-20位字母加数字组合" maxlength="20">
            </div>
            <div class="textInput">
                <i class="iconfont icon-suo"></i>
                <input v-model="repwd" type="password" placeholder="再次确认新密码" maxlength="20">
            </div>
            <div class="textInput" style="position: relative;top: 0;left: 0;">
                <i class="iconfont icon-suo"></i>
                <input v-model="code" type="tel" placeholder="请输入验证码" maxlength="6" ref="code1">
                <div v-if="!isSend" @click="handleGetCode" class="getCode">获取验证码</div>
                <div v-if="isSend" class="getCode">{{ times }}秒后获取</div>
            </div>
        </div>
        <div @click="handleGetPwd" class="login">
            确 定
        </div>
    </div>
</template>

<script>
    import { findPwd, forgetpwd,valphones } from '../../api/api'
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
                nickname: '',
                pwd: '',
                repwd: '',
                code: '',
                times: 60,             // 验证码倒计时
                isSend: false        //是否已发送短信
            }
        },
        methods: {
            //返回
            handleBack() {
                this.$emit('closeRight', 'close')
            },
            //获取短信验证码
            handleGetCode() {
	            // 密码正则
	            let pwdReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
                if (this.phone === '') {
                    Toast('请输入手机号')
                } else if (this.pwd === ''){
                	Toast('请输入密码')
                } else if(!pwdReg.test(this.pwd)){
	                Toast('密码格式不符合规则')
                }else if (this.repwd !== this.pwd) {
	                Toast('两次密码不一样')
                }else {
	                Indicator.open();
	                valphones(this.phone).then(res => {
		                console.log(res)
	                }).catch(err => {
	                	if (err.response.data.res === 51008){
			                let title = '忘记密码';
			                findPwd(this.phone, title,3).then(res => {
//                    this.$http.get(`/new/api/culture-app-gateway/user/sendmsg/${this.phone}?title=忘记密码`).then(res => {
				                //console.log(res);
				                Indicator.close();
				                // if (res.status === 200) {
					             //    Toast('短信已发送');
					                let _this = this;
					                _this.isSend = true;
					                let interval = window.setInterval(function () {
						                if ((_this.times--) <= 1) {
							                _this.times = 60;
							                _this.isSend = false;
							                window.clearInterval(interval);
						                }
					                }, 1000);
				                // }
			                }).catch(err => {
				                console.log(err.response);
				                Indicator.close();
				                Toast(err.response.data.msg)
			                })
                        }else {
			                Toast(err.response.data.msg)
			                Indicator.close()
                        }
                    })




                }
            },
            //设置新密码
            handleGetPwd() {
                // 手机正则
                let pReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
                // 密码正则
                let pwdReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
                if (this.phone === '') {
                    Toast('请输入手机号')
                }else if(pReg.test(this.phone) === false){
                    Toast('手机号不正确')
                }else if (this.pwd === '') {
                    Toast('请输入新密码')
                }else if(!pwdReg.test(this.pwd)){
                    Toast('密码格式不符合规则')
                }else if (this.repwd !== this.pwd) {
                    Toast('两次密码输入不一样')
                } else if (this.code === '') {
                    Toast('请输入验证码')
                } else {
                    Indicator.open();
                    let params = {
                        code: this.code,
                        password: md5(this.pwd)
                    };
                    forgetpwd(this.phone, params).then(res => {
                        console.log(res);
                        Indicator.close();
                        if(this.code !== this.$refs.code1.value){
                        	Toast('验证码不正确');
                        }else {
	                        Toast('重置密码成功');
                        }
                        setTimeout(() => {
                            this.phone = '';
                            this.pwd = '';
                            this.repwd = '';
                            this.code = '';
                            this.handleBack()
                        }, 2000)
                    }).catch(err => {
                        console.log(err.response);
                        Indicator.close();
                        Toast(err.response.data.msg)
                    })
                }
            }
        },
        mounted() {
        }
    }
</script>

<style>

</style>
