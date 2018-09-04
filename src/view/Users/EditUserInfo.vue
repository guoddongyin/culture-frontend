<template>
    <div id="news">
        <div class="leftTop">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>我的资料</span>
            <div @click="handleBtn" class="right">
                <span class="getUpInfo">保存</span></div>
        </div>
        <div class="center">
            <div class="userInfoInput">
                <div class="textName"><i style="color: red">*</i>昵称</div>
                <input v-model.trim="nickname" type="text" placeholder="请输入昵称" maxlength="20">
            </div>
            <div class="userInfoInput">
                <div class="textName"><i style="color: #ffffff">*</i>真实姓名</div>
                <input v-model.trim="name" type="text" placeholder="请输入真实姓名" maxlength="20">
            </div>
            <div class="userInfoInput">
                <div class="textName"><i style="color: #ffffff">*</i>性别</div>
                <div style="margin-left: 0.4rem">
                    <yd-radio-group v-model="sex" color="#fa711b">
                        <yd-radio val="女"></yd-radio>
                        <yd-radio val="男"></yd-radio>
                    </yd-radio-group>
                </div>
            </div>
            <div class="userInfoInput">
                <div class="textName"><i style="color: #ffffff">*</i>生日</div>
                <input style="width: 75%" v-model.trim="birthday" type="text" placeholder="请输入生日，格式如：1988-08-08" maxlength="10">
            </div>
            <div class="userInfoInput">
                <div class="textName"><i style="color: #ffffff">*</i>所属区域</div>
                <div style="margin-left: 0.4rem" @click="showArea=true">
                    <select read-only style="width:5rem;border:none;padding:0 20px;" v-model="areaID">
                        <option style="text-indent: 20px;"  v-for="(item,index) in areaList" :key="index" v-bind:value="item.id">
                            {{item.name}}
                        </option>
                    </select>
                </div>
                <!--<input v-model.trim="education" type="text" placeholder="请输入学历" maxlength="20">-->
            </div>
            <div class="userInfoInput">
                <div class="textName"><i style="color: #ffffff">*</i>学历</div>
                <div style="margin-left: 0.4rem" @click="show=true">{{ education | state }}</div>
                <!--<input v-model.trim="education" type="text" placeholder="请输入学历" maxlength="20">-->
            </div>
            <div class="userInfoInput">
                <div class="textName"><i style="color: red">*</i>手机</div>
                <input v-model.trim="mobile" type="tel" placeholder="请输入手机号" maxlength="11">
            </div>
            <div class="userInfoInput">
                <div class="textName"><i style="color: #ffffff">*</i>QQ</div>
                <input v-model.trim="qq" type="text" placeholder="请输入QQ" maxlength="14">
            </div>
            <div class="userInfoInput">
                <div class="textName"><i style="color: #ffffff">*</i>邮箱</div>
                <input v-model.trim="email" type="text" placeholder="未填写" maxlength="20">
            </div>
            <div class="userInfoInput">
                <div class="textName"><i style="color: #ffffff">*</i>现居地址</div>
                <input v-model.trim="addr" type="text" placeholder="未填写" maxlength="20">
            </div>
            <div class="userInfoInput">
                <div class="textName"><i style="color: #ffffff">*</i>个人介绍</div>
                <input v-model.trim="ucontent" type="text" placeholder="未填写" maxlength="30">
            </div>
            <div style="padding: 0.4rem;background-color: #f5f5f5">
                为了保证报名真实有效性，以及更好的了解您的需求为您提供更优质的服务请提供您的真实信息。请您放心你的资料其他任何人均无法查看
            </div>
            <!--<div style="padding: 0.4rem;background-color: #f5f5f5">-->
            <!--<div @click="handleBtn" class="editUserInfoBtn">-->
            <!--提交信息-->
            <!--</div>-->
            <!--</div>-->
            <yd-popup v-model="show" position="center" width="60%">
                <div style="font-size: 0.4rem;padding: 0.4rem;border-bottom: 1px solid #e5e5e5"
                     @click="_getItem(item)"
                     v-for="(item,index) in xlArr" :key="index">{{item.codeName}}
                </div>
            </yd-popup>
        </div>
    </div>
</template>

<script>
    import { editUserInfo, userInfo, basecode,areas } from '../../api/api'
    import { JsBridge } from '../../jsbridge/jsbridge'
    import { Indicator, Toast } from 'mint-ui';

    export default {
        name: '',
        data() {
            return {
                nickname: '',
                name: '',
                sex: '',
                birthday: '',
                education: '',
                mobile: '',
                qq: '',
                email: '',
                addr: '',
                ucontent: '',
                show: false,
                showArea:false,
                xlArr: [],               // 学历数组
                xlId: '',
                areaName:'',
                areaID:'',
                areaList:[],
            }
        },
        methods: {
            // 返回
            handleBack() {
                this.$router.go(-1)
            },
            // 选择学历
            _getItem(item) {
                this.xlId = item.codeStr
                this.education = item.codeName
                this.show = false
            },
          _getArea(items,e){
              alert(JSON.stringify(items));
              console.log(e);
              // this.areaID=item.id;
              // this.areaName=item.name;
          },
            // 提交修改
            handleBtn() {
                // 姓名正则
                let zw = /[\u4E00-\u9FA5]{2,4}/
                // 手机正则
                let pReg = /^1(3|4|5|7|8)\d{9}$/
                // QQ正则
                let qReg = /[1-9][0-9]{4,14}/
                // 邮箱正则
                let eReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                // 日期正则
                let dataReg = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/
                let sex = ''
//                if (this.nickname === '' || this.name === '' || this.sex === '' || this.birthday === '' || this.education === '' || this.mobile === '' || this.qq === '' || this.email === '' || this.addr === '' || this.ucontent === '') {
              if (this.nickname === '') {
                    Toast('请输入昵称')
                } else if (this.mobile === '') {
                    Toast('请输入手机号码')
                // } else if (this.name !== '' && !(zw.test(this.name))) {
                } else if (!this.name) {
                    Toast('请输入正确的姓名')
                } else if (this.birthday !== '' && !(dataReg.test(this.birthday))) {
                    Toast('请输入生日，格式如：1988-08-08')
                } else if (!pReg.test(this.mobile)) {
                    Toast('请输入正确的手机号')
                } else if (this.qq !== '' && !(qReg.test(this.qq))) {
                    Toast('请输入正确的QQ号')
                } else if (this.email !== '' && !(eReg.test(this.email))) {
                    Toast('邮箱有误')
                } else {
                    let params = {
                        addr: this.addr,
                        birthday: Date.parse(new Date(this.birthday)),
                        education: this.education,
                        email: this.email,
                        mobile: this.mobile,
                      mainAdminAreaId:this.areaID,
                        nickName: this.nickname,
                        qq: this.qq,
                        realName: this.name,
                        sex: this.sex === '女' ? 0 : 1,
                        tel: this.mobile,
                        ucontent: this.ucontent
                    }
                    editUserInfo(params).then(res => {
                        // 存储用户信息
                        let data = JSON.stringify(res)
                        if (IS_WX) {
                            // 微信方法
                            // 存储用户信息到 localStorage
                            localStorage.setItem('userInfo', data)
                            this.$router.go(-1)
                        } else {
                            // webView方法
                            let self = this
                            JsBridge.callHandler(
                                'userInfo',
                                data,
                                function (rp) {
                                    self.$router.go(-1)
                                }
                            )

                        }
                    }).catch(err => {
                        console.log(err.response)
                        Toast(err.response.res.msg)
                    })
                }
            },
            getData() {
                userInfo().then(res => {
                    let userinfo = res
                    this.nickname = userinfo.nickname
                    this.name = userinfo.realname
                    this.sex = Number(userinfo.sex) === 1 ? '男' : '女'
                    this.birthday = userinfo.birthday
                    this.education = userinfo.education
                    this.mobile = userinfo.mobile
                    this.qq = userinfo.qq
                    this.email = userinfo.email
                    this.addr = userinfo.addr
                    this.ucontent = userinfo.ucontent
                    this.areaID = userinfo.mainAdminAreaId
                })
            },
            getBase() {
                let code = '003'
                basecode(code).then(res => {
                    console.log(res)
                    this.xlArr = res
                })
            },
          getArea(){
            //let userType=USERINFO?USERINFO.usertype.charAt(0):'1';
            let areaId = 0,
              self=this;
            areas(areaId).then(res => {
              //res.splice(0, 0, { headChar: 'C', id: '', name: '重庆市' })
              // 区域排序
              res.sort((a, b) => a.headChar.charCodeAt(0) - b.headChar.charCodeAt(0))
              self.areaList = res;
            }).catch(err => {
              Toast('区域获取失败')
            });
          },
        },
        created() {
            this.getData()
            this.getBase()
            this.getArea();
        },
        filters: {
            state(s) {
                return s === 'null' ? '选择学历' : s===''?'选择学历':s
            },
          areaState(s) {
            return s === 'null' ? '选择学历' : s===''?'选择学历':s
          }
        }
    }
</script>

<style>

</style>
