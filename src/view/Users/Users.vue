<template>
    <div id="users">
        <div class="top">
            我的
        </div>
        <div class="center">
            <div class="banner" :style="bg">
                <div @click="handleUserInfo" class="avatar">
                    <img :src="user.photo || avatar" alt="">
                </div>
                <div class="nick">{{ user.username }}</div>
                <span @click="handleIntegral" class="integral">积分：{{ userCount }}</span>
            </div>
            <div class="cells">
                <div @click="handleNews" class="cell">
                    <div class="flexCenter">
                        <i class="iconfont icon-msg"></i>
                        <span>我的消息</span>
                    </div>
                    <div class="iconfont icon-right"></div>
                </div>
                <div @click="handleCollection" class="cell">
                    <div class="flexCenter">
                        <i class="iconfont icon-qietu19"></i>
                        <span>我的收藏</span>
                    </div>
                    <div class="iconfont icon-right"></div>
                </div>
                <div @click="handleEnroll" class="cell">
                    <div class="flexCenter">
                        <i class="iconfont icon-baoming"></i>
                        <span>我的报名</span>
                    </div>
                    <div class="iconfont icon-right"></div>
                </div>
                <div @click="handleOrder" class="cell">
                    <div class="flexCenter">
                        <i class="iconfont icon-icon-test"></i>
                        <span>预约服务</span>
                    </div>
                    <div class="iconfont icon-right"></div>
                </div>
                <div @click="handleEditPwd" class="cell">
                    <div class="flexCenter">
                        <i class="iconfont icon-mima01"></i>
                        <span>修改密码</span>
                    </div>
                    <div class="iconfont icon-right"></div>
                </div>
                <div @click="handleHelp" class="cell">
                    <div class="flexCenter">
                        <i class="iconfont icon-icon1"></i>
                        <span>帮助</span>
                    </div>
                    <div class="iconfont icon-right"></div>
                </div>
                <div @click="handleClear" class="cell">
                    <div class="flexCenter">
                        <i class="iconfont icon-tuichu"></i>
                        <span>退出登录</span>
                    </div>
                    <div class="iconfont icon-right"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getUserInfo, getUserCount,channelCancel } from '../../api/api'
    import { JsBridge } from '../../jsbridge/jsbridge'

    export default {
        name: '',
        data() {
            return {
                url:URL,
                bg: {
                    backgroundImage: "url(" + require("../../assets/bg1.png") + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% auto",
                    height: '4.8rem',
                },
                user: USERINFO,
                userCount: '',
                avatar: require('../../assets/p2.jpg'),
                userInfo: '',
                id: USERINFO.id      // 获取用户ID
            }
        },
        methods: {
            // 获取个人信息
//            getData(){
//                let id=this.id
//                getUserInfo(id).then(res=>{
//                    console.log(res)
//                    this.user=res
//                    this.getCount()
//                }).catch(err=>{
//                    console.log(err.response)
//                })
//            },
            // 获取积分
            getCount() {
                getUserCount().then(res => {
                    console.log(res)
                    this.userCount = res.count
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 个人资料页面
            handleUserInfo() {
                this.$router.push('/UserInfo/' + this.id)
            },
            // 积分页面
            handleIntegral() {
                this.$router.push('/Integral/' + this.id)
            },
            // 消息页面
            handleNews() {
                this.$router.push('/News/' + this.id)
            },
            // 收藏页面
            handleCollection() {
                this.$router.push('/Collection/' + this.id)
            },
            // 预约界面
            handleOrder() {
                let userInfo = USERINFO
                if (userInfo.usertype === '1') {
                    this.$router.push('/Publicat/' + this.id)
                } else {
                    this.$router.push('/Insideat/' + this.id)
                }

            },
            // 报名页面
            handleEnroll() {
                this.$router.push('/Enroll/' + this.id)
            },
            // 修改密码页面
            handleEditPwd() {
                this.$router.push('/Editpwd/' + this.id)
            },
            // 帮助页面
            handleHelp() {
                this.$router.push('/Help')
            },
            // 退出登录
            handleClear() {
                if (IS_WX) {
                    localStorage.clear()
                    this.$router.push('/Home')
                } else {
                    let data = ''
                    let self = this
                    JsBridge.callHandler(
                        'clearUserInfo',
                        data,
                        function (res) {
                            channelCancel().then(res => {
                              self.$router.push('/Home')
                            }).catch(err => {
                              console.log(err.response)
                            })
                        }
                    )
                }
            }
        },
        created() {
            this.getCount()
        }
    }
</script>

<style>

</style>
