<template>
    <div id="news">
        <div class="leftTop">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>我的预约需求</span>
        </div>
        <div class="center">
            <div class="enroll" v-for="(item,index) in content" :key="index" @click="handleGet(item)">
                <div class="enrollTop">
                    <div>
                        服务方：{{ item.volunteerPubName | length }}
                    </div>
                    <span>{{ item.isreply | status }}</span>
                </div>
                <div class="enrollContent" style="padding: 0.4rem">
                    <div class="enrollInfo flexBettwen">
                        <img v-lazy="url+item.itemImg" alt="">
                        <div class="enrollTxt" style="width: 45%;height: 2.4rem">
                            <div class="enrollTxtTitle" style="margin-bottom: 0.4rem">{{ item.itemName }}</div>
                            <div>区域：{{ item.itemareaidname }}</div>
                            <div>类别：{{ item.resTypeName }}</div>
                        </div>
                        <!--<div class="enrollCancle">取消预约</div>-->
                    </div>
                    <div class="appointmentBottom">
                        <p>需求地点：{{ item.addr }}</p>
                        <span>提交时间：{{ item.createDate }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getLove } from '../../api/api'

    export default {
        name: '',
        data() {
            return {
                url:URL,
                img: require('../../assets/bm1.png'),
                content: [],
            }
        },
        methods: {
            handleBack() {
                this.$router.go(-1)
            },
            getData() {
                let index = 0
                let size = 20
                getLove(index, size).then(res => {
                    console.log(res)
                    this.content = res
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 前往服务方介绍页面
            handleGet(item){
                this.$router.push('/DisListId/'+item.volunteerPubId)
            }
        },
        created() {
            this.getData()
        },
        filters:{
            // 服务方名字长度处理
            length(l){
                return l.length>10?l.substr(0,10)+'...':l
            },
            // 状态显示
            status(s){
                return s==='1'?'需求已提交':s==='2'?'配送中':'未配送'
            }
        }
    }
</script>

<style>

</style>
