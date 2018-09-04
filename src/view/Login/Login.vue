<template>
    <div id="login" :style="bg">
        <div class="logo" style="padding-top: 4rem">

        </div>
        <div @click="handleBack" class="goBack">
            <i class="iconfont icon-left"></i>
        </div>
        <div class="logoInput">
            <div class="textInput">
                <i class="iconfont icon-iconfontyonghuming"></i>
                <input v-model="username" type="text" placeholder="请输入用户名" maxlength="20">
            </div>
            <div class="textInput">
                <i class="iconfont icon-suo"></i>
                <input v-model="pwd" type="password" placeholder="请输入密码" maxlength="20">
            </div>
        </div>
        <div class="forgetPwd">
            <div>大众用户可 <span @click="handleReg">免费注册</span></div>
            <span @click="handleGetPwd">忘记密码</span>
        </div>
        <div @click="handleLogin" class="login">
            登 录
        </div>
        <span class="loginTag">
          温馨提示：如果您是重庆市公共文化物联网服务平台的文化馆用户或基层服务中心用户，请使用平台的账号进行登录！
        </span>
        <mt-popup v-model="rightPop" position="right">
            <forget @closeRight="handleCloseRight"></forget>
        </mt-popup>
    </div>
</template>

<script>
    import Forget from './Forget.vue'
    import { login, userInfo,channelLog } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui'
    import { JsBridge } from '../../jsbridge/jsbridge'
    import md5 from 'js-md5'

    export default {
        name: '',
        components: {
            Forget
        },
        data() {
            return {
                bg: {
                    backgroundImage: "url(" + require("../../assets/zc.jpg") + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% auto",
                },
                logo: require('../../assets/logo.png'),
                username: '',
                pwd: '',
                rightPop: false
            }
        },
        methods: {
            //返回
            handleBack() {
                window.history.back()
            },
            //注册
            handleReg() {
                this.$router.replace('/Regsiter')
            },
            //忘记密码
            handleGetPwd() {
                this.rightPop = true
            },
            //关闭右侧弹窗
            handleCloseRight(s) {
                this.rightPop = false;
                console.log(s)
            },
            //登录
            handleLogin() {
                console.log(document.cookie)
                var self=this;
                // 密码正则
                let pwdReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
                if (this.username === '') {
                    Toast('请输入用户名')
                } else if (this.pwd === '') {
                    Toast('请输入密码')
//                }else if(!pwdReg.test(this.pwd)){
//                    Toast('密码格式不符合规则')
                }else {
                    Indicator.open()
                    let params = {
                        password: md5(this.pwd),
                        username: this.username
                    }
	                login(params).then(res => {
		                console.log(res)
		                Indicator.close()
		                this.getData()
	                }).catch(err => {
		                console.log(err.response)
		                Indicator.close()
		                Toast(err.response.data.msg)
	                })
                    // if(IS_WX){
                    //   login(params).then(res => {
                    //     console.log(res)
                    //     Indicator.close()
                    //     this.getData()
                    //   }).catch(err => {
                    //     console.log(err.response)
                    //     Indicator.close()
                    //     Toast(err.response.data.msg)
                    //   })
                    // }else{
                      //绑定获取百度推送信息方法
                      // JsBridge.callHandler(
                      //   'baiduPush',
                      //   '',
                      //   function (e) {
                      //     var devType=window.navigator.userAgent.toLowerCase().indexOf('ios')!=-1?4:3,
                      //         pushObj=JSON.parse(e);
                      //     login(params).then(res => {
                      //       channelLog(pushObj.channel_id,devType,pushObj.user_id).then(res=>{
                      //         Indicator.close()
                      //         self.getData()
                      //       }).catch(err => {
                      //         alert(JSON.stringify(err));
                      //         console.log(err.response)
                      //         Indicator.close()
                      //         Toast(err.response.data.msg)
                      //       });
                      //     }).catch(err => {
                      //       console.log(err.response)
                      //       Indicator.close()
                      //       Toast(err.response.data.msg)
                      //     })
                      //   }
                      // )
                    // }
                }
            },
            // 获取登录信息
            getData() {
                userInfo().then(res => {
                    console.log(res)
                    // 存储用户信息
                    let data =JSON.stringify(res)
                    if (IS_WX) {
                        // 微信方法
                        // 存储用户信息到 localStorage
                        localStorage.setItem('userInfo', data)
                        this.$router.go(-1)
                    } else {
                        // webView方法
                        let self=this
                        JsBridge.callHandler(
                            'userInfo',
                            data,
                            function (rp) {
                                self.$router.go(-1)
                            }
                        )
                    }
                })
            }
        },
        mounted() {

        }
    }
</script>

<style>

</style>
