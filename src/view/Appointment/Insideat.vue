<template>
    <div id="news">
        <div class="leftTop">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>我的预约配送单</span>
        </div>
        <div class="center" style="background-color: #ffffff">
            <!--<div class="tabNav">-->
                <!--<div @click="pickNum=9" :style="pickNum===9?'color:#fa711b':''">全部</div>-->
                <!--<div @click="pickNum=0" :style="pickNum===0?'color:#fa711b':''">暂存与退回({{ stateZero | count }})</div>-->
                <!--<div @click="pickNum=1" :style="pickNum===1?'color:#fa711b':''">待接收与配送({{ stateOne | count }})</div>-->
                <!--<div @click="pickNum=2" :style="pickNum===2?'color:#fa711b':''">待确认与评价({{ stateTwo | count }})</div>-->
            <!--</div>-->
            <div class="tabNav">
                <div @click="freshData(item.ord)"
                     v-for="(item,index) in tabArr"
                     :style="pickNum===item.ord?'color:#fa711b':''"
                     :key="index">{{ item.typename }}({{ item.count | count }})</div>
            </div>
            <div class="appointmentOrders">
                <all v-if="pickNum===9"></all>
                <state-zero v-if="pickNum===0"></state-zero>
                <state-one v-if="pickNum===1"></state-one>
                <state-two v-if="pickNum===2"></state-two>
                <!--<list-demo></list-demo>-->
            </div>
        </div>
    </div>
</template>

<script>
    import { applyWait, waitcount } from '../../api/api'
    import All from './All.vue'
    import ListDemo from './Listdemo.vue'
    import StateZero from './StateZero.vue'
    import StateOne from './StateOne.vue'
    import StateTwo from './StateTwo.vue'
    export default {
        name: '',
        components: {
            All,StateZero,StateOne, StateTwo,ListDemo
        },
        data() {
            return {
                pickNum:9,                  // 对应页面
                stateZero: '',                // 暂存与退回
                stateOne: '',                // 活动接收与配送
                stateTwo: '',                // 活动确认和评论
                tabArr:[],                  // tab数组
            }
        },
        methods: {
            // 返回
            handleBack() {
                this.$router.go(-1)
            },
            freshData(ord){
              this.tabArr=[];
              this.pickNum=ord;
              this.getCount();
            },
            // 获取数据
           // getData() {
           //     let index = 0
           //     let size = 6
           //     let status = 9
           //     applyWait(index, size, status).then(res => {
           //         console.log(res)
           //         // 1未接收 ,2已接收 ，3配送完成， 4，配送完成并发布 5，撤销，6暂存
           //         this.allList = res
           //         this.allListLength = res.length
           //     }).catch(err => {
           //         console.log(err.response)
           //     })
           // },
            // 获取数量
            getCount() {
                waitcount().then(res => {
                	console.log(res)
                    res.sort((a,b)=>b.ord-a.ord)
                    this.tabArr=res
//                    res.map(m => {
//                        m.typdid === '0' ? this.stateZero = m.count : ''
//                        m.typdid === '1' ? this.stateOne = m.count : ''
//                        m.typdid === '2' ? this.stateTwo = m.count : ''
//                    })
                }).catch(err => {
                    console.log(err.response)
                })
            }
        },
        created() {
//            this.getData()
            this.getCount()
            isAll=false;
            isStateOne=false;
        },
        filters: {
            count(c) {
                return c > 10 ? '10+' : c === '' ? 0 : c
            }
        }
    }
</script>

<style>

</style>
