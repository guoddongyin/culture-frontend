<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>预约申请</span>
        </div>
        <div class="homeCenter" style="margin-bottom: 0rem;background-color: #e5e5e5">
            <div class="orderInfo">
                <div>预约单号：{{ applyInit.applyno }}</div>
                <div>预约时间：{{ applyInit.applydate | times }}</div>
                <div>申请单位：{{ applyInit.applyUnit }}</div>
            </div>
            <div style="margin-bottom: 0.2rem">
                <div class="orderAddr" style="padding: 0.2rem">
                    <div class="orderAddrTit"><i style="color: red">*</i>需求地点</div>
                    <div style="width: 60%">
                        <div>重庆市 <span @click="_openPop">{{area}}</span><span @click="openAreaPop" style="margin-left: 0.2rem">{{ areatxt
                            }}</span>
                        </div>
                        <div class="flexs">
                            <input v-model.trim="areaName" type="text" class="orderInput" :disabled="allIsDisable">
                            <i class="iconfont icon-map"></i>
                        </div>
                    </div>
                </div>
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText" style="border-right: 1px solid #666666"><i style="color: red">*</i>联系人
                        </div>
                        <input type="text" :disabled="allIsDisable" placeholder="请输入联系人" v-model="linkMan">
                    </div>
                </div>
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText" style="border-right: 1px solid #666666"><i style="color: red">*</i>联系电话
                        </div>
                        <input type="text" :disabled="allIsDisable" maxlength="11" placeholder="请输入联系电话" v-model="linkTel">
                    </div>
                </div>
            </div>
            <div style="margin-bottom: 0.2rem">
                <div class="orderText">
                    <div class="flexs flexAs">
                        <div class="leftText"><i style="color: red">*</i>文化产品</div>
                        <div class="flexBettwens flexAs" style="width: 75%">
                            <div style="width: 60%;word-break:break-all">{{ volsInfo.itemname }}</div>
                            <div v-if="!allIsDisable" class="changeBtn" @click="handleOpenRight">更换产品</div>
                        </div>

                    </div>
                </div>
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText"><i style="color: #ffffff">*</i>资源类别</div>
                        <span>{{ volsInfo.restypename }}</span>
                    </div>
                </div>
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText"><i style="color: #ffffff">*</i>志愿者</div>
                        <span>{{ volsInfo.volname }}</span>
                    </div>
                </div>
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText"><i style="color: #ffffff">*</i>联系人</div>
                        <span>{{ volsInfo.vollinkman }}</span>
                    </div>
                </div>
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText"><i style="color: #ffffff">*</i>联系电话</div>
                        <span>{{ volsInfo.voltel }}</span>
                    </div>
                </div>
            </div>
            <div style="margin-bottom: 0.2rem">
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText"><i style="color: #ffffff">*</i>服务形式</div>
                        <span>{{ volsInfo.serverType | type }}</span>
                    </div>
                </div>
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText" style="border-right: 1px solid #666666"><i style="color: red">*</i>受众人数
                        </div>
                        <input :disabled="allIsDisable" type="text" placeholder="请输入人数" v-model.trim="people">
                    </div>
                </div>
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText" style="border-right: 1px solid #666666"><i style="color: red">*</i>配送时间
                        </div>
                        <div style="width: 70%">
                            <yd-datetime v-if="!allIsDisable" :start-date="startTime" ref="datetime" v-model="dispatchTime"
                                         slot="right"></yd-datetime>
                            <div v-else>{{dispatchTime}}</div>
                        </div>

                        <!--<input type="text" placeholder="请输入时间" v-model.trim="dispatchTime">-->
                    </div>
                </div>

                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText" style="border-right: 1px solid #666666"><i
                                style="color: #ffffff">*</i>{{ type }}
                        </div>
                        <input type="tel" :placeholder="type==='展览时长'?'（天数）':'（分钟）'" v-model.trim="exhibitTime" readonly>
                    </div>
                </div>
                <!--<div class="orderText">-->
                <!--<div class="flexs">-->
                <!--<div class="leftText" style="border-right: 1px solid #666666">承办单位</div>-->
                <!--<input type="text" placeholder="请输入承办单位" v-model.trim="organizer">-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="orderText">-->
                <!--<div class="flexs">-->
                <!--<div class="leftText" style="border-right: 1px solid #666666">活动描述</div>-->
                <!--<input type="text" placeholder="请输入描述" v-model.trim="ad">-->
                <!--</div>-->
                <!--</div>-->
                <div class="orderText flexBettwens">
                    <div style="font-size: 0.4rem">
                        <i style="color: #ffffff">*</i>是否服从调配
                    </div>
                    <div class="flex">
                        <div v-for="(item,index) in mix"
                             :key="index"
                             @click="handleMin(item,index)"
                             class="mix"
                             :style="index===mixNum?'border: 1px solid #fa711b;color: #fa711b':''">{{ item.txt }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!allIsDisable" @click="handleOver" class="orderBtn">
                提 交
            </div>
            <!--更换产品弹窗-->
            <yd-popup v-model="rightPop" position="right" width="100%">
                <div class="tops">
                    <i @click="handleRightClose" class=" iconfont icon-left"></i>
                    <span>选择产品</span>
                </div>
                <div style="margin-top: 1.2rem">
                    <div class="orderText">
                        <div class="flexs">
                            <div class="leftText" style="border-right: 1px solid #666666;width: 30%">产品名称</div>
                            <input v-model="changeItem" type="text" placeholder="输入产品名称">
                        </div>
                    </div>
                    <div class="orderText">
                        <div class="flexs">
                            <div class="leftText" style="border-right: 1px solid #666666;width: 30%">产品服务方</div>
                            <input v-model="changeVol" type="text" placeholder="输入产品服务方">
                        </div>
                    </div>
                    <div class="orderSearchBtn" @click="getChangeitemlist">
                        搜 索
                    </div>
                </div>
                <div style="background-color: #ffffff">
                    <div v-for="(item,index) in volsItem"  style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5" @click="handleChoice(item)">
                        <div style="font-size: 0.4rem">{{item.volname}}</div>
                        <div style="color: #666666">{{ item.itemname }}</div>
                    </div>
                </div>
            </yd-popup>
            <!--右侧弹窗-->
            <mt-popup
                    v-model="pop"
                    popup-transition="popup-fade">
                <div @click="pop = false;" class="tops"><i class=" iconfont icon-left"></i> <span></span></div>
                <div class="area-list" style="overflow: auto;height: 16rem">
                    <div v-for="(c,i) in chatArr" :key="i">
                        <div style="background-color: #999999;color: #ffffff;padding: 0.4rem">{{ c }}
                        </div>
                        <div v-for="(item,index) in areaArry" :key="index">
                            <div @click="handleAreaName(item)" style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5"
                                 v-if="item.id!='0'&&item.headChar===c">{{ item.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </mt-popup>
        </div>
        <!--specialApply设置为0-->
        <mu-dialog :open="dialogZero" title="确认提交？" @close="closeZero">

            <mu-flat-button slot="actions" @click="closeZero" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="handleZero" label="确认"/>
        </mu-dialog>

        <!--specialApply设置为1-->
        <mu-dialog :open="dialogOne" title="确认提交？" @close="closeOne">
            <span>是否特殊申请</span>
            <mu-flat-button slot="actions" @click="closeOne" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="handleConfirm" label="确认"/>
        </mu-dialog>
        <!--备注输入框-->
        <mu-dialog :open="dialogSpecial" title="特殊申请原因备注" @close="closeOne">
            <div>
                <div>
                    <i style="color: red">*</i>联系人
                </div>
                <input type="text" placeholder="请输入联系人" v-model.trim="specialinkMain">
            </div>
            <div>
                <div>
                    <i style="color: red;">*</i>联系电话
                </div>
                <input type="text" maxlength="11" placeholder="请输入联系电话" v-model.trim="speciaLinkTel">
            </div>
            <div>
                <div>
                    <i style="color: red">*</i>备注
                </div>
                <textarea v-model="speciaRemark" placeholder="请输入备注"></textarea>
            </div>
            <mu-flat-button slot="actions" @click="closeOne" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="handleOne" label="确认"/>
        </mu-dialog>
        <!--区域下级菜单弹窗-->
        <mu-dialog :open="dialogArea" title="区域选择" @close="closeArea1">
            <mu-menu>
                <mu-menu-item :id="index" :class="areaTreeNum===index?'menuColor':''"
                              @click="handleCheckArea(item,index)"
                              :title="item.name" v-for="(item,index) in areaArr" :key="index"/>
            </mu-menu>
            <mu-flat-button slot="actions" @click="closeArea1" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="handleSubmit" label="提交"/>
        </mu-dialog>
    </div>
</template>

<script>
    import { changeitemlist, itemvol, apply, applyInit, areas, area,applyId } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui'

    export default {
        name: '',
        data() {
            var d = new Date();
            var n = d.toLocaleString().split(' ')[0];
            return {
                rightPop: false,
                changeVol: '',
                changeItem: '',
                applyInit: {},
                volsInfo: {},
                type: '展览时长',
                mix: [{
                    txt: '服从调配'
                }, {
                    txt: '不服从调配'
                }],
                areaName: '',                  // 地方栏目
                linkMan: '',                  // 联系人
                specialinkMain : '',                  // 特殊联系人
                linkTel: '',                  // 联系电话
                speciaLinkTel : '',                  // 特殊联系电话
                speciaRemark : '',                  // 特殊申请备注
                mixNum: 0,
                people: '',                  // 受众人数
                dispatchTime: '',            // 配送时间
                disTime: '',                  // 转换为时间戳后的时间
                startTime: n,                // 配送时间选择起始范围
                exhibitTime: '',             // 展览时长
                organizer: '',               // 承办单位
                ad: '',                      // 活动描述
                dialogZero: false,            // 弹窗控制器 specialApply设置为0
                dialogOne: false,             // 弹窗控制器 specialApply设置为1
                dialogSpecial: false,
                specialApply: 0,
                volsItem: [],
                itemOid: '',
                params: {},                      // 记住提交的参数
                pop: false,
                chatArr: 'BCDFHJKLNPQRSTWXYZ'.split(''),
                areaArry: [],
                area: '区域选择',
                areaId: '',
                areapop: false,
                namepop: false,
                areatxt: '选择街道',
                dialogArea: false,
                areaArr: [],
                areaTreeNum: '',
                remark:'',
	            allIsDisable:''
            }
        },
        watch: {
            dispatchTime() {
//                console.log('格式时间：' + this.dispatchTime)
                this.disTime = Date.parse(this.dispatchTime)
//                console.log('转换为时间戳：' + this.disTime)
            }
        },
        computed: {},
        methods: {
            handleBack() {
                this.$router.go(-1)
            },
            // 打开右侧弹窗
            handleOpenRight() {
                this.rightPop = true
            },
            // 关闭右侧弹窗
            handleRightClose() {
                this.rightPop = false
            },
            // 预约选择产品后获取作品联系人
            getData(pid) {
                Indicator.open()
                let id = pid?pid:this.$route.params.id
                applyId(id).then(res => {
                    console.log(res)
                    this.order = res
                    this.order.areaName = res.venueCity + res.venueCounty + res.venueStreet
                    this.getShowtime = this.order.showtime
                    this.isDisable = this.order.status === 1 || this.order.status === 2 ? true : false
                    console.log('1，2：' + this.isDisable)
                    this.isDisableOther = this.order.status === 3 ? true : false
                    console.log('3：' + this.isDisableOther)
                    this.mixNum = this.order.hasupdate
                    this.area=this.order.venueCounty
                    this.areatxt=this.order.venueStreet
                    this.areaName=this.order.venueSpecific
                    this.people=this.order.pcount
                    itemvol(this.order.itemOid).then(res => {
                        console.log(res)
                        this.linkMan=res.vollinkman;
                        this.linkTel=res.voltel;
                        this.handleInit()
                        this.volsInfo = res
                        this.exhibitTime=res.duration
                        this.volsInfo.restypename.indexOf('展览') >= 0 ? this.type = '展览时长' : this.type = '产品时长'
                        Indicator.close();
                    }).catch(err => {
                        console.log(err.response)
                    })
                    this.allIsDisable =isAll;
                }).catch(err => {
                    itemvol(id).then(res => {
                        console.log(res)
                        //this.linkMan=res.vollinkman;
                        //this.linkTel=res.voltel;
                        this.handleInit()
                        this.volsInfo = res
                        this.exhibitTime=res.duration
                        this.volsInfo.restypename.indexOf('展览') >= 0 ? this.type = '展览时长' : this.type = '产品时长'
                        Indicator.close();
                    }).catch(err => {
                        console.log(err.response)
                    })
                    console.log(err.response)
                })
            },
            // 申请预约接口初始化
            handleInit() {
                applyInit().then(res => {
                    console.log(res)
                    this.applyInit = res
                    Indicator.close()
                }).catch(err => {
                    console.log(err.response)
                    Toast(err.response.data.msg)
                    this.$router.go(-1)
                })
            },
            // 搜索更换的产品
            getChangeitemlist() {
                // if (this.changeVol !== '' || this.changeItem !== '') {
                //
                // }
	            let page = 0
	            let size = 20
	            let volsname = this.changeVol
	            let itemname = this.changeItem
	            changeitemlist(page, size, volsname, itemname).then(res => {
		            console.log(res)
		            this.volsItem = res
                    if(this.volsItem.length == 0){
	                    Toast('无搜索结果');
                    }
	            }).catch(err => {
		            console.log(err.response)
		            //Toast(err.response);
	            })
            },
            // 选择更换的产品
            handleChoice(item) {
                console.log(item)
                this.itemOid = item.id
                this.volsInfo.itemname=item.itemname
                this.rightPop = false
                this.getData(item.id)
            },
            // 是否服从调配选择
            handleMin(item, index) {
                this.mixNum = index
                console.log(item.txt)
            },
            // 前往提交页面
            handleOver() {
                let reg = /^[0-9]+$/;
                if (this.areaName === '') {
                    Toast('请填写详细地址')
                } else if (this.areatxt === '') {
                    Toast('请选择街道')
                }else if (this.area === '') {
                    Toast('请选择区域')
                }else if (this.linkMan === '') {
                    Toast('请输入联系人')
                } else if (this.linkTel === '') {
                        Toast('请输入联系电话')
                }else if (this.linkTel.length<11) {
                    Toast('请输入正确的号码格式')
                }else if (this.people === '') {
                    Toast('请输入受众人数')
                } else if (!(reg.test(this.people))) {
                    Toast('请输入正确的受众人群')
                } else if (this.disTime === '') {
                    Toast('请选择配送时间')
                } else if (this.exhibitTime === '') {
                    Toast('请输入展览时长')
                } else if (!(reg.test(this.exhibitTime))) {
                    Toast('请输入正确的展览时长')
                } else {
                    this.params = {
                        applyno: this.applyInit.applyno,
                        content: "",
                        duration: this.exhibitTime,
                        hasupdate: this.mixNum,
                        id: "",
                        itemOid: this.itemOid || this.$route.params.id,
                        itemname: this.volsInfo.restypename,
                        linkMan: this.linkMan,
                        specialinkMain: this.specialinkMain,
                        speciaLinkTel: this.speciaLinkTel,
                        speciaRemark: this.speciaRemark,
                        pcount: this.people,
                        planId: "",
                        resTypeId: this.volsInfo.restype,
                        showTime: this.disTime,
                        showUnit: this.organizer,
                        showtitle: this.volsInfo.restypename,
                        specialApply: 0,
                        telphone: this.linkTel,
                        venueCity: "重庆市",
                        venueCounty: this.area,
                        venueLatitude: 0,
                        venueLongitude: 0,
                        venueProvince: "重庆市",
                        venueSpecific: this.areaName,
                        venueStreet: this.areatxt
                    }
                    apply(0, this.params).then(res => {
                        console.log(res)
                        let id = this.$route.params.id
                        Toast('预约成功')
                        let userInfo = USERINFO
                        if (userInfo.usertype === '1') {
                            this.$router.push('/Publicat/' + userInfo.id)
                        } else {
                            this.$router.push('/Insideat/' + userInfo.id)
                        }
//                        this.$router.push('/OverOrder/' + id)
                    }).catch(err => {
                        console.log(err.response)
                        let status = err.response.data.res
                        let msg = err.response.data.msg
                        Toast({
                            message:msg,
                            position:'top',
                        })
                        if (status === 51028 || status === 51029 || status === 51020 || status === 51022) {
                            // 以上弹出提示 返回确认消息 进行确认，如果点取消 就不提交，确认继续提交
                            this.dialogZero = true
                            this.handleZero(params)
                        } else if (status===51026 || status === 51035 || status === 51037 || status === 51041 || status===51043 || status===51044) {
                            // 以上弹出提示 返回确认消息，确认消息后加“，是否特殊申请”， 进行确认 ，如果点取消 就不提交，确认继续提交（将:specialApply 设置为1）
                            this.dialogOne = true
                        } else if (status === 51040) {
                            // 弹出返回消息，清空节目相关信息，其他不清空，重新调初始化，把id赋值个新增Id
                            this.handleInit()
                            this.linkMan = ''
                            this.linkTel = ''
                            this.exhibitTime = ''
                        }
                    })
                }
            },
            // isinit设置为1，specialApply设置为0，再次提交
            handleZero() {
                apply(1, this.params).then(res => {
                    console.log(res)
                    let userInfo = USERINFO
                    if (userInfo.usertype === '1') {
                        this.$router.push('/Publicat/' + userInfo.id)
                    } else {
                        this.$router.push('/Insideat/' + userInfo.id)
                    }
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 设置备注输入框显示
            handleConfirm() {
                this.dialogSpecial=true;
                this.specialinkMain=this.linkMan;
                this.speciaLinkTel=this.linkTel;
            },
            // isinit设置为1，specialApply设置为1，再次提交
            handleOne() {
                if(!this.specialinkMain){
                    alert('请填写联系人');
                }else if(!this.speciaLinkTel){
                    alert('请填写电话格式');
                }else if(!this.speciaRemark){
                    alert('请填写备注');
                }else{
                    let params = {
                        applyno: this.applyInit.applyno,
                        content: "",
                        duration: this.exhibitTime,
                        hasupdate: this.mixNum,
                        id: "",
                        itemOid: this.itemOid || this.$route.params.id,
                        itemname: this.volsInfo.restypename,
                        linkMan: this.linkMan,
                        linkTel: this.linkTel,
                        specialinkMain: this.specialinkMain,
                        speciaLinkTel: this.speciaLinkTel,
                        speciaRemark: this.speciaRemark,
                        pcount: this.people,
                        planId: "",
                        resTypeId: this.volsInfo.restype,
                        showTime: this.disTime,
                        showUnit: this.organizer,
                        showtitle: this.volsInfo.restypename,
                        specialApply: 1,
                        telphone: this.linkTel,
                        venueCity: "重庆市",
                        venueCounty: this.area,
                        venueLatitude: 0,
                        venueLongitude: 0,
                        venueProvince: "重庆市",
                        venueSpecific: this.areaName,
                        venueStreet: this.areatxt
                    }
                    apply(1, params).then(res => {

                        console.log(res)
                        let userInfo = USERINFO
                        if (userInfo.usertype === '1') {
                            this.$router.push('/Publicat/' + userInfo.id)
                        } else {
                            this.$router.push('/Insideat/' + userInfo.id)
                        }
                        Toast('预约成功');
                    }).catch(err => {
                        console.log(err.response)
                    })
                }
            },
            // 关闭zero
            closeZero() {
                this.dialogZero = false
            },
            // 关闭one
            closeOne() {
                this.dialogOne = false
            },
            // 获取区域数据
            getArea() {
                let areaId = 0
                areas(areaId).then(res => {
                    console.log(res)
                    // 区域排序
                    res.sort((a, b) => a.headChar.charCodeAt(0) - b.headChar.charCodeAt(0))
                    this.areaArry = res
                    let userArea=USERINFO.adminareaname
                    let areaID=USERINFO.mainAdminAreaId
                    console.log(USERINFO);
                    let areaName='';
                    if(areaID&&USERINFO.adminareaid.indexOf("-")!=-1){
                        for(let i=0;i<res.length;i++){
                            if(res[i].id==areaID){
                                areaName=res[i].name;
                            }
                        }
                    }
                    if(userArea&&USERINFO.adminareaid!='0'){
                        if(areaName){
                            this.area=areaName;
                            this.areatxt=userArea;
                        }else{
                            this.area=userArea
                        }
                    }
                }).catch(err => {
                    console.log(err.response)
                })
            },
            //打开区域选择组件
            handleAreaPop() {
                this.sortPop = false
                this.activityPop = false
                this.typePop = false
                this.areaPop = !this.areaPop
            },
            // 打开区域选择栏目
            _openPop() {
                if(!this.allIsDisable){
                    this.pop = true
                    this.areapop = true
                    this.areaName = ''
                }
            },

            openAreaPop(){
                if(!this.allIsDisable){
                    if(this.area==='区域选择'){
                        this._openPop()
                    }else {
                        let road;
                        this.areaArry.map((m,i)=>this.area===m.name?road=m.id:'')
                        area(road).then(res => {
                            this.areaArr = res
                            this.dialogArea = true
                        })
                    }
                }
            },

            // 选择区域
            handleAreaName(item, index) {
                this.area = item.name
                area(item.id).then(res => {
                    console.log(res)
                    this.areaArr = res
                    this.dialogArea = true
                })
                this.areaNum = index
            },
            // 选择下级区域
            handleCheckArea(item, index) {
                this.pickArea = item.id
                this.areaTreeNum = index
                this.areatxt = item.name
                this.pop = false
                this.dialogArea = false
            },
            // 关闭弹窗
            closeArea1() {
                this.dialogArea = false
            },
            // 关闭弹窗
            closeArea() {
                this.dialogSpecial = false
            },
            // 提交
            handleSubmit() {
              this.dialogArea = false
            },
        },
        created() {
            this.getData()
            this.getArea()
            console.log(USERINFO)
        },
        filters: {
            type(t) {
                return t === '1' ? '志愿服务产品' : '政府服务产品'
            },
        }
    }
</script>

<style>

</style>
