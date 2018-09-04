<template>
    <div id="news">
        <div class="leftTop">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>我的资料</span>
            <div v-if="u.usertype==='1'" @click="handleEdit" class="right">编辑</div>
        </div>
        <div class="center" style="background-color: #ffffff">
            <div class="userInfoInput flexBettwen">
                <div class="textInfo">昵称</div>
                <div>{{ u.nickname }}</div>
            </div>
            <div class="userInfoInputs">
                <div class="textInfo">实名信息</div>
            </div>
            <div class="userInfos">
                <div class="userInfoList">
                    <p>学员姓名</p>
                    <span>{{ u.realname | text }}</span>
                </div>
                <div class="userInfoList">
                    <p>性别</p>
                    <span>{{ u.sex === '0' ? '女' : u.sex === '1' ? '男' : '' | text }}</span>
                </div>
                <div class="userInfoList">
                    <p>生日</p>
                    <span>{{ u.birthday | text}}</span>
                </div>
                <div class="userInfoList">
                    <p>所属区域</p>
                    <span>{{ areaName }}</span>
                </div>
                <div class="userInfoList">
                    <p>学历</p>
                    <span>{{ u.education | text}}</span>
                </div>
                <div class="userInfoList">
                    <p>手机</p>
                    <span>{{ u.mobile | text}}</span>
                </div>
                <div class="userInfoList">
                    <p>QQ</p>
                    <span>{{ u.qq | text }}</span>
                </div>
                <div class="userInfoList">
                    <p>邮箱</p>
                    <span>{{ u.email | text}}</span>
                </div>
                <div class="userInfoList">
                    <p>现居地址</p>
                    <span>{{ u.addr | text }}</span>
                </div>
                <div class="userInfoList">
                    <p>个人介绍</p>
                    <span>{{ u.ucontent | text }}</span>
                </div>
            </div>
            <div style="padding: 0.4rem;background-color: #f5f5f5">
                为了保证报名真实有效性，以及更好的了解您的需求为您提供更优质的服务请提供您的真实信息。请您放心你的资料其他任何人均无法查看
            </div>
        </div>
    </div>
</template>

<script>
    import { userInfo,areas } from '../../api/api'

    export default {
        name: '',
        data() {
            return {
                u: USERINFO,
              areaList:[],
              areaName:'',
            }
        },
        methods: {
            // 返回
            handleBack() {
                this.$router.go(-1)
            },
            // 修改
            handleEdit() {
                this.$router.push('/EditUserInfo/' + this.u.id)
            },
            getData() {
              var self=this;
                userInfo().then(res => {
                    this.u = res
                  self.getArea(res.mainAdminAreaId);
                })
            },
          getArea(id){
            //let userType=USERINFO?USERINFO.usertype.charAt(0):'1';
            let areaId = 0,
              self=this;
            areas(areaId).then(res => {
              //res.splice(0, 0, { headChar: 'C', id: '', name: '重庆市' })
              // 区域排序
              res.sort((a, b) => a.headChar.charCodeAt(0) - b.headChar.charCodeAt(0))
              self.areaList = res;
              var name='';
              for(var i=0;i<self.areaList.length;i++){
                if(self.areaList[i].id==id){
                  name=self.areaList[i].name;
                  break;
                }
              }
              this.areaName=name;
            }).catch(err => {
              Toast('区域获取失败')
            });
          },
        },
        created() {
            this.getData()
        },
        filters: {
            text(s) {
                return s === '' || s === 'null' ? '未填写' : s
            },
            area(id){
              var name='';
                for(var i=0;i<this.areaList.length;i++){
                    if(this.areaList[i].id==id){
                      name=this.areaList[i].name;
                      break;
                    }
                }
                return name;
            }
        }
    }
</script>

<style>

</style>
