<template>
    <div id="login" :style="bg">
        <div class="logo">

        </div>
        <div @click="handleBack" class="goBack">
            <i class="iconfont icon-left">返回</i>
        </div>
        <div class="logoInput">
            <div class="textInput">
                <i class="iconfont icon-contextphone"></i>
                <input v-model="phone" type="tel" @focus="pageToView" placeholder="请输入手机号" maxlength="11">
            </div>
            <div class="textInput">
                <i class="iconfont icon-iconfontyonghuming"></i>
                <input v-model="nickname" @focus="pageToView" type="text" placeholder="请输入真实姓名" maxlength="20">
            </div>
            <div class="textInput">
                <i class="iconfont icon-suo"></i>
                <input v-model="pwd" @focus="pageToView" type="password" placeholder="6-20位字母加数字组合" maxlength="20">
            </div>
            <div class="textInput">
                <i class="iconfont icon-suo"></i>
                <input v-model="repwd" @focus="pageToView" type="password" placeholder="再次确认密码" maxlength="20">
            </div>
            <!--<div class="textInput" style="position: relative;top: 0;left: 0;">-->
                <!--<i class="iconfont icon-suo"></i>-->
                <!--<input v-model="code" @focus="pageToView" type="tel" placeholder="请输入验证码" maxlength="6">-->
                <!--<div v-if="!isSend" @click="handleGetCode" class="getCode">获取验证码</div>-->
                <!--<div v-if="isSend" class="getCode">{{ times }}秒后获取</div>-->
            <!--</div>-->
        </div>
        <div @click="handleRegsiter" class="login">
            完 成
        </div>
        <span class="loginTag">
          温馨提示：公共用户注册登陆后，享有提出点单需求、评价等权利。
        </span>
    </div>
</template>

<script>
    import { sendmsg, valphones, valsendmsg, reg,login,userInfo,areas } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';
    import 'whatwg-fetch'
    import { JsBridge } from '../../jsbridge/jsbridge'
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
                //code: '',
                //times: 60,             // 验证码倒计时
                areaArry: [],            //存储地区数据
                area: '' ,         //区域标识
                areaId: 0,
                city: [{ name: CITYNAME }, { name: CITYAREA }],
                rightPop: false,             // 右侧弹窗
                //isSend: false        //是否已发送短信
            }
        },
        methods: {
            //返回
            handleBack() {
                this.$router.replace('/Login')
            },
            //获取验证码
//             handleGetCode() {
//                 // 手机正则
//                 let pReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
//                 if (this.phone === '') {
//                     Toast('请输入手机号')
//                 }else if(pReg.test(this.phone) === false){
//                     Toast('手机号不正确')
//
//                 } else {
//                     Indicator.open();
//                     valphones(this.phone).then(res => {
//                         console.log(res)
//                     }).catch(err => {
//                         console.log(err.response);
//                         // 如果返回的代码为51004，则此手机号没有注册过，发送验证码
//                         if (err.response.data.res === 51004) {
//                             let tit = '手机注册';
//                             let type=2;
//                             sendmsg(this.phone, tit,type).then(res => {
// //                                this.$http.get(`/new/api/culture-app-gateway/user/sendmsg/${this.phone}?title=手机注册`).then(res=>{
//                                 console.log(res);
//                                 Indicator.close();
//                                 Toast('短信已发送');
//                                 let _this = this;
//                                 _this.isSend = true;
//                                 let interval = window.setInterval(function () {
//                                     if ((_this.times--) <= 1) {
//                                         _this.times = 60;
//                                         _this.isSend = false;
//                                         window.clearInterval(interval);
//                                     }
//                                 }, 1000);
//                             }).catch(err => {
//                                 console.log(err.response)
//                                 Indicator.close()
//                                 Toast(err.response.data.msg)
//                             })
//                         } else {
//                             Toast(err.response.data.msg)
//                             Indicator.close()
//                         }
//                     })
//                 }
//
//             },
            //注册
            handleRegsiter() {
                let self=this;
	            // 手机正则
                let pReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
                // 密码正则
                let pwdReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
                if (this.phone === '') {
                    Toast('请输入手机号')
                } else if(pReg.test(this.phone) === false){
                     Toast('手机号不正确')
                } else if (this.nickname === '') {
                    Toast('请输入真实姓名')
                } else if (this.pwd === '') {
                    Toast('请输入密码')
                }else if(!pwdReg.test(this.pwd)){
                    Toast('密码格式不符合规则')
                }else if (this.repwd !== this.pwd) {
                    Toast('两次密码不一样')
                }
                // else if (this.code === '') {
                //     Toast('请输入验证码')
                // }
                else {
                    Indicator.open()
                  let isCity=true;
                  if (IS_WX) {
                    let area = localStorage.getItem('area')
                    if (!area) {
                      this.area = '选择区域'
                      this.areaId = area==global.CITYNAME?'':0;
                    } else {
                      this.area = area
                      this.areaArry.map(f => {
                        if(f.name === area){
                          this.areaId = f.id;
                          isCity=false;
                        }
                      })
                      if(isCity){
                        this.areaId = area==global.CITYNAME?'':0;
                      }
                    }
                    self.register();
                  } else {
                    JsBridge.callHandler('getArea', '', (data) => {
                      if (data === 'null') {
                        this.area = '选择区域'
                        this.areaId = 0;
                      } else {
                        this.area = data
                        this.areaArry.map(f => {
                          if(f.name === data){
                            this.areaId = f.id;
                            isCity=false;
                          }
                        })
                        if(isCity){
                          this.areaId = area==global.CITYNAME?'':0;
                        }
                      }
                      self.register();
                    })
                  }
                }
            },
            register(){
              let params = {
                //code: this.code,
                from: "1",
                mobile: this.phone,
                nickname: this.nickname,
                password: md5(this.pwd),
                username:'',
                pwd:'',
                mainAdminAreaId:this.areaId,
              }
              reg(params).then(res => {
                console.log(res)
                Indicator.close()
                Toast('注册成功')
                self.username=self.phone;
                //self.handleLogin();
//
                let data = JSON.stringify(res)
                if (IS_WX) {
                  // 微信方法
                  // 存储用户信息到 localStorage
                  //localStorage.setItem('userInfo', data)
                  this.$router.replace('/Login')
                } else {
                  // webView方法
                  let self = this
	                self.$router.replace('/Login')
                  // JsBridge.callHandler(
                  //   'userInfo',
                  //   data,
                  //   function (rp) {
                  //
                  //   }
                  // )

                }
              }).catch(err => {
                Toast(err.response.data.msg?err.response.data.msg:"注册失败")
                Indicator.close()
              })
              Indicator.close()
            },
            //登录
            handleLogin() {
                console.log(document.cookie)
                // 密码正则
                let pwdReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
                let self=this
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
                        self.getData()
                    }).catch(err => {
                        console.log(err.response)
                        Indicator.close()
                    })

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
                        // 存储用户信息
                        this.$router.replace('/Home')
                    } else {
                        // webView方法
                        let self=this
                        JsBridge.callHandler(
                            'userInfo',
                            data,
                            function (rp) {
                                self.$router.replace('/Home')
                            }
                        )
                    }
                })
            },
          pageToView(){
            setTimeout(function (){
                var panel=document.getElementById('logoInput');

              panel.scrollIntoView(true);
              panel.scrollIntoViewIfNeeded();
            },200);
          },
          getArea() {
            let areaId = 0
            areas(areaId).then(res => {
              //res.splice(0, 0, { headChar: 'C', id: '', name: '重庆市' })
              // 区域排序
              res.sort((a, b) => a.headChar.charCodeAt(0) - b.headChar.charCodeAt(0))
              this.areaArry = res
              this.getRestype()
            }).catch(err => {
              console.log(err.response)
            })
          },
        },
        mounted() {
          this.getArea();
        }
    }
</script>

<style>

</style>
