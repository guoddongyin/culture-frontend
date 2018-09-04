<template>
    <div style="height: 15.4rem;overflow: auto">
        <mu-list>
            <div class="appointmentOrder" v-for="(item,index) in allList" :key="index">
                <div class="flexBettwens">
                    <div style="width: 80%" class="flexs">
                        <div class="left">申请单位：</div>
                        <div class="right">{{ item.applyunit }}</div>
                    </div>
                    <div class="rightStatus">{{ item.statusname }}</div>
                </div>
                <div style="width: 80%" class="flexs">
                    <div class="left">产品：</div>
                    <div class="right">{{ item.itemname }}</div>
                </div>
                <div style="width: 80%" class="flexs">
                    <div class="left">预约时间：</div>
                    <div class="right">{{ item.applydate }}</div>
                </div>
                <div style="width: 80%" class="flexs">
                    <div class="left">配送时间：</div>
                    <div class="right">{{ item.showtime }}</div>
                </div>
                <div class="flexBettwens">
                    <div style="width: 80%" class="flexs">
                        <div class="left">类别：</div>
                        <div class="right">{{ item.restypeidname }}</div>
                    </div>
                    <div @click="handleOrder(item)" class="insideatBtn">办理</div>
                </div>
            </div>
        </mu-list>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" loadingText="加载中..." @load="loadMore"/>
    </div>
</template>

<script>
    import { applyWait,waitcount,changeViewApply } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';

    export default {
        name: '',
        data() {
            return {
                index: 2,
                size: 6,
                allList: [],
                total: '',
                loading: false,
                scroller: null,
                refreshing: false,
                trigger: null,
                state:2,                // 状态:0暂存与退回、1活动接收与配送、2活动确认和评论、9全部
            }
        },
        methods: {
            // 获取总数
            getCount(){
                waitcount().then(res=>{
                    console.log(res)
                    res.map(m=>m.typdid==='2'?this.total=m.count:'')
                    this.getData()
                }).catch(err=>{
                    console.log(err.response)
                })
            },
            // 获取数据
            getData() {
                let index = 1
                let size = 6
                let status = this.state
                let res = new Array()
                applyWait(index, size, status).then(res => {
                    console.log(res)
                    // 1未接收 ,2已接收 ，3配送完成， 4，配送完成并发布 5，撤销，6暂存
                    this.allList = res
                }).catch(err => {
                    console.log(err.response)
                })

            },
            loadMore() {
                this.loading = true
                let index = this.index
                let size = this.size
                let status = this.state
                if(this.allList.length<this.total){
                    applyWait(index, size, status).then(res => {
                        console.log(res)
                        this.allList.push(...res)
                        this.index++
                        this.loading = false
                    }).catch(err => {
                        console.log(err.response)
                    })
                }else {
                    this.loading = false
                }
            },
            // 未接收变为已接收，跳转到详情页
            handleOrder(item){
                if(item.status==='3'){
                    this.$router.push('/OverOrder/'+item.id)
                }else {
                    this.$router.push('/Order/'+item.id)
                }
            }
        },
        created() {
            this.getCount()
        },
        mounted() {
            this.scroller = this.$el
        }
    }
</script>

<style>

</style>
