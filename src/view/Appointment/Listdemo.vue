<template>
    <div  class="demo-infinite-container">
        <mu-list>
            <div v-for="item,index in list">
                <div class="flexBettwens">
                    <div style="width: 80%" class="flexs">
                        <div class="left">申请单位：</div>
                        <div class="right">{{ item.applyunit }}</div>
                    </div>
                    <div class="rightStatus">{{ item.statusname }}</div>
                </div>
                {{ index }}
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
                    <div class="insideatBtn">办理</div>
                </div>
            </div>
        </mu-list>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
    </div>
</template>

<script>
    export default {
        data () {
            const list = []
            for (let i = 0; i < 10; i++) {
                list.push('item' + (i + 1))
            }
            return {
                list,
                num: 10,
                loading: false,
                scroller: null
            }
        },
        mounted () {
            this.scroller = this.$el
        },
        methods: {
            loadMore () {
                this.loading = true
                setTimeout(() => {
                    for (let i = this.num; i < this.num + 10; i++) {
                        this.list.push('item' + (i + 1))
                    }
                    this.num += 10
                    this.loading = false
                }, 20000)
            }
        }
    }
</script>

<style lang="css">
    .demo-infinite-container{
        width: 100%;
        height: 15rem;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        border: 1px solid #d9d9d9;
    }
</style>