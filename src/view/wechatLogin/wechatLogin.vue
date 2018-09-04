<template>
    <div class="container">
        <div class="input-container">
            <label for="weixin-phone">手机号</label>
            <input type="text" maxlength="11" style="font-size: 15px" id="weixin-phone" placeholder="请输入手机号" v-model="phone">
        </div>
        <div class="btn-container">
            <button @click="weLogin">登录</button>
        </div>
    </div>
</template>
<style>

    .container{
        height:14rem;
        width:90%;
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        margin:auto;
    }

    .input-container{
        width:100%;
        display: flex;
    }

    .input-container label{
        font-size: 15px;
        flex: 1;
        background-color: #ebebeb;
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: center;
        color:#333333;
        border: 1px solid #e5e5e5;
        font-weight: bold;
    }

    .input-container input{
        flex: 4;
        background-color: #ffffff;
        height: 1.2rem;
        line-height: 1.2rem;
        text-indent: 2em;
        color:#666666;
    }

    .btn-container{
        width:100%;
        margin-top: 16px;
    }

    .btn-container button{
        background-color: rgb(17,222,191);
        width:100%;
        border: none;
        height:1rem;
        font-size: 16px;
        color: #ffffff;
    }
</style>
<script>
    import { wxlogin,mergeUser,openUser,userInfo } from '../../api/api'
    import {Toast} from 'mint-ui';
    export default {
        components: {
        },
        name: '',
        data() {
            return {
                phone:'',
                localOpenID:'',
                router:'Home',
            }
        },
        watch: {},
        methods: {
            setReqUrl() {
                var code = this.$route.params.id;
                this.localOpenID=code;
                this.router=this.getUrlParam('router')||'Home';
            },
              // 获取url中的参数
              getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; //返回参数值
              },
            weLogin(){
                var code = this.$route.params.id;
                if(this.phone===""|| this.phone.length<11){
                    Toast('请输入正确的手机格式');
                }else{
                    mergeUser(code,this.phone,{}).then(res=>{
                        wxlogin(code,{}).then(res=>{
                            userInfo().then(res => {
                                // 存储用户信息
                                let data =JSON.stringify(res)
                                if (IS_WX) {
                                    // 微信方法
                                    // 存储用户信息到 localStorage
                                    localStorage.setItem('userInfo', data)
                                    this.$router.push('/'+this.router);
                                } else {
                                    // webView方法
                                    let self=this
                                    JsBridge.callHandler(
                                        'userInfo',
                                        data,
                                        function (rp) {
                                          this.$router.push('/'+this.router);
                                        }
                                    )
                                }
                            })
                        })
                    })
                }
            },
        },
        mounted() {
            this.setReqUrl()
            // if (IS_WX) {
            //     this.setReqUrl()
            // }
        }
    }
</script>
<style>

</style>
