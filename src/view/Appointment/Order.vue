<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>预约申请</span>
        </div>
        <div class="homeCenter" style="margin-bottom: 0rem">
            <div class="orderInfo">
                <div>预约单号：{{ applyInit.applyno }}</div>
                <div>预约时间：{{ applyInit.applydate | times }}</div>
                <div>申请单位：{{ applyInit.applyUnit }}</div>
            </div>
            <div style="margin-bottom: 0.2rem">
                <div class="orderAddr" style="padding: 0.2rem">
                    <div class="orderAddrTit"><i style="color: red">*</i>需求地点</div>
                    <div style="width: 60%">
                        <div style="width: 80%">
                            <div>重庆市 <span @click="_openPop">{{area}}</span><span @click="openAreaPop" style="margin-left: 0.2rem">{{ areatxt | emptyArea}}</span>
                            </div>
                            <div class="flexs">
                                <input v-model.trim="areaName" type="text" class="orderInput" :disabled="allIsDisable">
                                <i class="iconfont icon-map"></i>
                            </div>
                        </div>
                        <!--<div class="flexs">-->
                            <!--<input v-model.trim="order.areaName"-->
                                   <!--type="text"-->
                                   <!--class="orderInput"-->
                                   <!--:disabled="isDisableOther||isDisable">-->
                            <!--<i class="iconfont icon-map"></i>-->
                        <!--</div>-->
                    </div>
                </div>
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText" style="border-right: 1px solid #666666"><i style="color: red">*</i>联系人</div>
                        <input type="text"
                               placeholder="请输入联系人"
                               v-model="order.linkMan"
                               :disabled="isDisableOther||isDisable">
                    </div>
                </div>
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText" style="border-right: 1px solid #666666"><i style="color: red">*</i>联系电话</div>
                        <input type="text"
                               placeholder="请输入联系电话"
                               v-model="order.telphone"
                               :disabled="isDisableOther||isDisable">
                    </div>
                </div>
            </div>
            <div style="margin-bottom: 0.2rem">
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText"><i style="color: red">*</i>文化产品</div>
                        <div v-if="!isAllowChange" class="flexBettwens" style="width: 75%">
                            <span style="width: 52%">{{ volsInfo.itemname }}</span>
                            <div v-if="!allIsDisable" class="changeBtn" @click="handleOpenRight">更换产品</div>
                            <small v-if="specialApply==1" style="color:red;">(特殊)</small>
                        </div>
                        <div v-else class="flexBettwens" style="width: 75%">
                            <span style="width: 52%">{{ volsInfo.itemname }}</span>
                            <div v-if="!allIsDisable" class="changeBtn" @click="toItemInfo(volsInfo.itemOid)">产品详情</div>
                            <small v-if="specialApply==1" style="color:red;">(特殊)</small>
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
                        <div class="leftText" style="border-right: 1px solid #666666"><i style="color: red">*</i>受众人数</div>
                        <input type="text"
                               placeholder="请输入人数"
                               v-model.trim="order.pcount"
                               :disabled="isDisableOther||isDisable">
                    </div>
                </div>
                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText" style="border-right: 1px solid #666666"><i style="color: red">*</i>配送时间</div>
                        <div style="width: 70%">
                            <yd-datetime :start-date="order.showTime"
                                         ref="datetime"
                                         :readonly="order.hasupdate!==0||this.isDisableOther"
                                         v-model="showTimes"
                                         slot="right"></yd-datetime>
                        </div>

                        <!--<input type="text" placeholder="请输入时间" v-model.trim="dispatchTime">-->
                    </div>
                </div>

                <div class="orderText">
                    <div class="flexs">
                        <div class="leftText" style="border-right: 1px solid #666666"><i style="color: #ffffff">*</i>{{ type }}</div>
                        <input type="tel"
                               :placeholder="type==='展览时长'?'（天数）':'（分钟）'"
                               v-model.trim="order.duration"
                               :disabled="isDisableOther||isDisable"
                        readonly>
                    </div>
                </div>
                <!--<div class="orderText">-->
                    <!--<div class="flexs">-->
                        <!--<div class="leftText" style="border-right: 1px solid #666666">承办单位</div>-->
                        <!--<input type="text"-->
                               <!--placeholder="请输入承办单位"-->
                               <!--v-model.trim="order.showUnit"-->
                               <!--:disabled="isDisableOther||isDisable">-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="orderText">-->
                    <!--<div class="flexs">-->
                        <!--<div class="leftText" style="border-right: 1px solid #666666">活动描述</div>-->
                        <!--<input type="text"-->
                               <!--placeholder="请输入描述"-->
                               <!--v-model.trim="order.content"-->
                               <!--:disabled="isDisableOther||isDisable">-->
                    <!--</div>-->
                <!--</div>-->
                <div class="orderText flexBettwens">
                    <div style="font-size: 0.4rem">
                        是否服从调配
                    </div>
                    <div class="flex">
                        <div v-for="(item,index) in mix"
                             :key="index"
                             @click="handleMin(item,index)"
                             class="mix"
                             :style="index===mixNum?'border: 1px solid #fa711b;color: #fa711b':''">{{ item.txt
                            }}
                        </div>
                    </div>
                </div>
            </div>
            <div @click="handleOk" class="orderBtn" v-if="!allIsDisable&&!isDisable">
                提 交
            </div>
            <div class="flexAround" v-if="!allIsDisable&&isDisable">
                <div @click="handleOver" class="orderBtn" style="width: 3rem;background-color: #6dcc3a">
                    {{specialApply?(isCity?'同意特殊申请配送':'特殊申请'):'完成预约公告'}}
                </div>
                <div @click="handleBackApply" class="orderBtn" style="width: 3rem;background-color: #fa711b">
                    退回申请单位
                </div>
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
                    <div style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5"
                         v-for="(item,index) in volsItem"
                         :key="index"
                         @click="handleChoice(item)">
                        <div style="font-size: 0.4rem">{{ item.itemname }}</div>
                        <div style="color: #666666">{{ item.volname }}</div>
                    </div>
                </div>
            </yd-popup>
            <mt-popup
                    v-model="pop"
                    popup-transition="popup-fade">
                <div @click="pop=false;" class="tops area-list-return"><i class=" iconfont icon-left"></i> <span></span></div>
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

            <span>提交特殊申请？</span>
            <mu-flat-button slot="actions" @click="closeOne" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="handleOne" label="确认"/>
        </mu-dialog>

        <!--two-->
        <mu-dialog :open="dialogTwo" title="确认提交？" @close="closeTwo">

            <mu-flat-button slot="actions" @click="closeTwo" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="handleTwo" label="确认"/>
        </mu-dialog>
        <!--three-->
        <mu-dialog :open="dialogThree" title="确认提交？" @close="closeThree">
            <span>是否特殊申请</span>
            <mu-flat-button slot="actions" @click="closeThree" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="handleThree" label="确认"/>
        </mu-dialog>
        <!--four-->
        <mu-dialog :open="dialogFour" :title="specialTitle" @close="closeFour">
            <span>{{specialText}}</span>
            <mu-flat-button slot="actions" @click="closeFour" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="handleOver" label="确认"/>
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
    import { changeitemlist, itemvol, applyId, apply, applyComplete, applyInit, backApply,applySpecial,areas,area } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui'

    export default {
        name: '',
        data() {
            var d = new Date();
            var n = d.toLocaleString().split(' ')[0];
            return {
                order: '',
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
                linkTel: '',                  // 联系电话
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
                dialogTwo: false,                // 状态为6的预约弹窗  0
                dialogThree: false,              // 状态为6的预约弹窗  1
                dialogFour: false,              // 状态为6的预约弹窗  1
                specialApply: 0,
                isDisable: false,            // 是否禁用
                isDisableOther: false,            // 其它情况是否禁用
                allIsDisable: false,            // 点击全部禁用
                volsItem: [],
                getitemOid: '',              // 记录产品ID是否变化
                getShowtime: '',             // 记录时间是否变化
                params: {},                      // 记录参数
                isCity:false,
                specialStatus:0,//特殊申请提交步骤
                specialText:'',
                specialTitle:'特殊申请需提交到市级',
                isAllowChange:isStateOne,
              pop:false,
              chatArr: 'BCDFHJKLNPQRSTWXYZ'.split(''),
              areaArry: [],
              area: '区域选择',
              areaId: '',
              areapop: false,
              namepop: false,
              areatxt: '选择街道',
              dialogArea: false,
              areaArr: [],
	            showTimes:'',
            }
        },
        watch: {
            dispatchTime() {
                this.getShowtime = this.dispatchTime
                this.disTime = Date.parse(this.dispatchTime)
            }
        },
        computed: {},
        methods: {
            toItemInfo(id){
                this.$router.push("/itemInfo/"+id);
            },
            handleBack() {
                this.$router.go(-1)
            },
            // 打开右侧弹窗
            handleOpenRight() {
                if (this.order.hasupdate !== 0) {
                    Toast('此预约不服从调配')
                } else {
                    if (this.isDisableOther) {
                        Toast('订单已完成')
                    } else {
                        this.rightPop = true
                    }
                }
            },
            // 关闭右侧弹窗
            handleRightClose() {
                this.rightPop = false
            },
            // 获取数据
            getData() {
                Indicator.open()
                let id = this.$route.params.id
                applyId(id).then(res => {
	                this.showTimes=res.showTime?res.showTime:this.getLocalTime(new Date(),'YYYY-MM-DD hh:mm:ss');
                    this.order = res;
                    this.areaName = res.venueSpecific;
                    this.area=res.venueCounty;
                    this.areatxt=res.venueStreet;
                    this.getShowtime = this.order.showtime
                    this.isDisable = this.order.status === 1 || this.order.status === 2 ? true : false
                    this.isDisableOther = this.order.status === 3 ? true : false
                    this.mixNum = this.order.hasupdate
                    if(res.itemOid){
                      this.getItem(res.itemOid)
                    }else{
                      this.applyInit={
                        applyno:this.order.applyno,
                        applydate:this.order.applydate,
                        applyUnit:this.order.applyUnit,
                      };
                      Indicator.close();
                    }
                    this.allIsDisable =isAll;
                    this.specialApply=this.order.status!='6'?this.order.specialApply:0;
                    //退回
                    if(this.order.status==0||this.order.status==6){
                        this.isDisable=false;
                    }
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 根据作品ID获取信息 预约选择产品后获取作品联系人
            getItem(vols) {
                itemvol(vols).then(res => {
                    console.log(res)
                    this.volsInfo = res
                    this.getitemOid = this.volsInfo.itemOid
                    this.volsInfo.restypename.indexOf('展览') >= 0 ? this.type = '展览时长' : this.type = '产品时长'
                    if(!this.order.applyno){
                        this.handleInit()
                    }else{
                        this.applyInit={
                            applyno:this.order.applyno,
                            applydate:this.order.applydate,
                            applyUnit:this.order.applyUnit,
                        };
                        Indicator.close();
                    }
                }).catch(err => {
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
                })
            },
            // 搜索更换的产品
            getChangeitemlist() {
                if (this.changeVol !== '' || this.changeItem !== '') {
                    let page = 0
                    let size = 20
                    let volsname = this.changeVol
                    let itemname = this.changeItem
                    changeitemlist(page, size, volsname, itemname).then(res => {
                        console.log(res)
                        this.volsItem = res
                    }).catch(err => {
                        console.log(err.response)
                    })
                }
            },
            // 选择更换的产品
            handleChoice(item) {
                console.log(item)
                this.volsInfo.itemname = item.itemname
                this.volsInfo.itemOid = item.id
                this.order.itemOid = item.id
                this.rightPop = false
            },
            // 是否服从调配选择
            handleMin(item, index) {
               if (this.order.hasupdate === 0 || !this.isDisable || this.isDisableOther === false) {
                   this.mixNum = index
                   console.log(item.txt)
               } else {
                   Toast('不能修改')
               }
                //Toast('不能修改')
            },
	        //时间格式转换 如：2017-9-6 ==> 2017-09-06
	        getLocalTime(time, format) {
		        time = new Date(time);
		        let o = {
			        "M+": time.getMonth() + 1, //month
			        "D+": time.getDate(), //day
			        "h+": time.getHours(), //hour
			        "m+": time.getMinutes(), //minute
			        "s+": time.getSeconds(), //second
			        "q+": Math.floor((time.getMonth() + 3) / 3), //quarter
			        "S": time.getMilliseconds() //millisecond
		        }
		        if (/(Y+)/.test(format)) {
			        format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
		        }
		        for (var k in o) {
			        if (new RegExp("(" + k + ")").test(format)) {
				        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			        }
		        }
		        return format;
	        },
            // 前往提交页面
            handleOver() {
                let id = this.$route.params.id
                let itemid = this.getitemOid !== this.volsInfo.itemOid ? this.order.itemOid : ''
                let showtime = this.getShowtime !== this.order.showtime ? this.dispatchTime : ''
                if(this.specialApply=='0'){//市级完成
                    applyComplete(id, 0, itemid, showtime).then(res => {
                        console.log(res)
                        Toast('提交成功')
                        this.$router.go(-1);
                    }).catch(err => {
                        console.log(err.response)
                        let status = err.response.data.res
                        let msg = err.response.data.msg
                        if (status === 51028 || status === 51029 || status === 51020 || status === 51022) {
                            // 以上弹出提示 返回确认消息 进行确认，如果点取消 就不提交，确认继续提交
                            this.dialogZero = true
                        } else if (status === 51035 || status === 51037 || status === 51041|| status===51043 || status===51044) {
                            // 以上弹出提示 返回确认消息，确认消息后加“，是否特殊申请”， 进行确认 ，如果点取消 就不提交，确认继续提交（将:specialApply 设置为1）
                            //this.dialogOne = true
                        } else if (status === 51040) {
                            // 弹出返回消息，清空节目相关信息，其他不清空，重新调初始化，把id赋值个新增Id
                            this.handleInit()
                            this.linkMan = ''
                            this.linkTel = ''
                            this.exhibitTime = ''
                        }
                        Toast(msg)
                    })
                }else{//非市级提交
                    if(this.isCity){
                        applyComplete(id, this.specialStatus, itemid, showtime).then(res => {
                            Toast('提交成功')
                            this.$router.go(-1);
                        }).catch(err => {
                            console.log(err.response)
                            let status = err.response.data.res
                            let msg = err.response.data.msg
                            if (status === 51028 || status === 51029 || status === 51020 || status === 51022) {
                                // 以上弹出提示 返回确认消息 进行确认，如果点取消 就不提交，确认继续提交
                                this.dialogZero = true
                            } else if (status === 51035 || status === 51037 || status === 51041|| status===51043 || status===51044) {
                                // 以上弹出提示 返回确认消息，确认消息后加“，是否特殊申请”， 进行确认 ，如果点取消 就不提交，确认继续提交（将:specialApply 设置为1）
                                //this.dialogOne = true
                            } else if (status === 51040) {
                                // 弹出返回消息，清空节目相关信息，其他不清空，重新调初始化，把id赋值个新增Id
                                this.handleInit()
                                this.linkMan = ''
                                this.linkTel = ''
                                this.exhibitTime = ''
                            }
                            if(this.specialStatus===0){
                                this.dialogFour=true;
                                this.specialStatus=1;
                            }
                            this.specialText=msg;
                            this.specialTitle='完成特殊申请';
                        })
                    }else{
                        applySpecial(this.specialStatus,id).then(res => {
                            Toast('提交成功')
                            this.$router.go(-1);
                        }).catch(err => {
                            let status = err.response.data.res
                            let msg = err.response.data.msg
                            if (status === 51028 || status === 51029 || status === 51020 || status === 51022) {
                                // 以上弹出提示 返回确认消息 进行确认，如果点取消 就不提交，确认继续提交
                                this.dialogZero = true
                            } else if (status === 51035 || status === 51037 || status === 51041|| status===51043 || status===51044) {
                                // 以上弹出提示 返回确认消息，确认消息后加“，是否特殊申请”， 进行确认 ，如果点取消 就不提交，确认继续提交（将:specialApply 设置为1）
                                //this.dialogOne = true
                            } else if (status === 51040) {
                                // 弹出返回消息，清空节目相关信息，其他不清空，重新调初始化，把id赋值个新增Id
                                this.handleInit()
                                this.linkMan = ''
                                this.linkTel = ''
                                this.exhibitTime = ''
                            }
                            if(this.specialStatus===0){
                                this.dialogFour=true;
                                this.specialStatus=1;
                            }
                            this.specialText=msg;
                        })
                    }
                }

            },
            // isinit设置为1，specialApply设置为0，再次提交
            handleZero(params) {
                console.log(params)
                apply(1, params).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // isinit设置为1，specialApply设置为1，再次提交
            handleOne() {
                let id = this.$route.params.id
                let itemid = this.getitemOid !== this.volsInfo.itemOid ? this.order.itemOid : ''
                let showtime = this.getShowtime !== this.order.showtime ? this.dispatchTime : ''
                applyComplete(id, 1, itemid, showtime).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 退回申请
            handleBackApply() {
                console.log(this.order);
                backApply(this.order.id).then(res => {
                    console.log(res)
                    Toast('退回成功')
                    this.$router.go(-1)
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 关闭zero
            closeZero() {
                this.dialogZero = false
            },
            // 关闭one
            closeOne() {
                this.dialogOne = false
            },
            // 点击提交
            handleOk() {
                if (this.order.status === 3) {
                    this.$router.go(-1)
                } else {
                    let reg = /^[0-9]+$/;
                    if (this.order.areaName === '') {
                        Toast('请填写详细地址')
                    } else if (this.order.pcount === '') {
                        Toast('请输入受众人数')
                    } else if (!(reg.test(this.order.pcount))) {
                        Toast('请输入正确的受众人群')
                    } else if (this.disTime === '') {
                        Toast('请选择配送时间')
                    } else if (this.order.duration === '') {
                        Toast('请输入展览时长')
                    } else if (!(reg.test(this.order.duration))) {
                        Toast('请输入正确的展览时长')
                    } else {
                        console.log(this.order);
                        this.params = {
                            applyno: this.order.applyno,
                            content: this.order.content,
                            duration: this.order.duration,
                            hasupdate: this.mixNum,
                            id: this.order.id,
                            itemOid: this.order.itemOid || this.$route.params.id,
                            itemname: this.order.itemname,
                            linkMan: this.order.linkMan,
                            pcount: this.order.pcount,
                            planId: "",
                            resTypeId: this.order.resTypeId,
                            showTime: this.disTime,
                            showUnit: this.order.showUnit,
                            showtitle: this.volsItem.restypename,
                            specialApply: 0,
                            telphone: this.order.telphone,
                            venueCity: "重庆市",
                            venueCounty: this.order.venueCounty,
                            venueLatitude: 0,
                            venueLongitude: 0,
                            venueProvince: "重庆市",
                            venueSpecific: this.order.venueSpecific,
                            venueStreet: this.order.venueStreet
                        }
                        apply(0, this.params).then(res => {
                            console.log(res)
                            let id = this.$route.params.id
                            Toast('预约成功')
                            this.$router.go(-1)
//                        this.$router.push('/OverOrder/' + id)
                        }).catch(err => {
                            console.log(err.response)
                            let status = err.response.data.res
                            let msg = err.response.data.msg
                            if (status === 51028 || status === 51029 || status === 51020 || status === 51022) {
                                // 以上弹出提示 返回确认消息 进行确认，如果点取消 就不提交，确认继续提交
                                this.dialogTwo = true
                            } else if (status === 51035 || status === 51037 || status === 51041 || status===51043 || status===51044) {
                                // 以上弹出提示 返回确认消息，确认消息后加“，是否特殊申请”， 进行确认 ，如果点取消 就不提交，确认继续提交（将:specialApply 设置为1）
                                this.dialogThree = true
                            } else if (status === 51040) {
                                // 弹出返回消息，清空节目相关信息，其他不清空，重新调初始化，把id赋值个新增Id
                                this.handleInit()
                                this.linkMan = ''
                                this.linkTel = ''
                                this.exhibitTime = ''
                            }
                            Toast(msg)
                        })
                    }
                }
            },
            closeTwo() {
                this.dialogTwo = false
            },
            closeThree() {
                this.dialogThree = false
            },
            closeFour() {
                this.dialogFour = false
                this.specialStatus=0;
            },
            handleTwo(){
                apply(1, this.params).then(res => {
                    console.log(res)
                    this.$router.go(-1)
                }).catch(err => {
                    console.log(err.response)
                })
            },
            handleThree(){
                let reg = /^[0-9]+$/;
                if (this.order.areaName === '') {
                    Toast('请填写详细地址')
                } else if (this.order.pcount === '') {
                    Toast('请输入受众人数')
                } else if (!(reg.test(this.order.pcount))) {
                    Toast('请输入正确的受众人群')
                } else if (this.disTime === '') {
                    Toast('请选择配送时间')
                } else if (this.order.duration === '') {
                    Toast('请输入展览时长')
                } else if (!(reg.test(this.order.duration))) {
                    Toast('请输入正确的展览时长')
                }  else if (this.order.content === '') {
                    Toast('请输入活动描述')
                } else {
                    this.params = {
                        applyno: this.order.applyno,
                        content: this.order.content,
                        duration: this.order.duration,
                        hasupdate: this.mixNum,
                        id: this.order.id,
                        itemOid: this.order.itemOid || this.$route.params.id,
                        itemname: this.order.itemname,
                        linkMan: this.order.linkMan,
                        pcount: this.order.pcount,
                        planId: "",
                        resTypeId: this.order.resTypeId,
                        showTime: this.disTime,
                        showUnit: this.order.showUnit,
                        showtitle: this.volsItem.restypename,
                        specialApply: 0,
                        telphone: this.order.telphone,
                        venueCity: "重庆市",
                        venueCounty: this.order.venueCounty,
                        venueLatitude: 0,
                        venueLongitude: 0,
                        venueProvince: "重庆市",
                        venueSpecific: this.order.venueSpecific,
                        venueStreet: this.order.venueStreet
                    }
                    apply(0, this.params).then(res => {
                        console.log(res)
                        let id = this.$route.params.id
                        Toast('预约成功')
                        this.$router.go(-1)
                    }).catch(err=>{
                        console.log(err.response)
                    })
                }
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
            if(!this.allIsDisable||USERINFO.usertype=='22'){
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
          // 关闭弹窗
          closeArea1() {
            this.dialogArea = false
          },
          // 提交
          handleSubmit() {
            this.dialogArea = false
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
              // if(userArea&&USERINFO.adminareaid!='0'){
              //   if(areaName){
              //     this.area=areaName;
              //     this.areatxt=userArea;
              //   }else{
              //     this.area=userArea
              //   }
              // }
            }).catch(err => {
              console.log(err.response)
            })
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
        },
        created() {
            //判断是否是市级
            this.isCity=USERINFO.mainAdminAreaId=='0'?true:false;
            this.getData()
          this.getArea()
        },
        filters: {
            type(t) {
                return t === '1' ? '志愿服务产品' : '政府服务产品'
            },
	        emptyArea(s){
                if(s==''){
                	return '区域选择';
                }else{
                	return s;
                }
            },
        }
    }
</script>

<style>

</style>
