<template>
    <div style="height: 7rem;background-color: #ffffff;overflow: auto">
        <div class="integralInfo">
            <div class="integralInfos" v-for="(item,index) in arr" :key="index">
                <div style="width: 40%">{{ item.opertime | times }}</div>
                <div style="width: 20%;color: #fb7724"><span>{{ item.operstate | state
                    }}</span>{{ item.integral }}
                </div>
                <div style="width: 40%">{{ item.intesourceName }}</div>

            </div>
        </div>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" loadingText="加载中..." @load="loadMore"/>
    </div>
</template>

<script>
    import { integral } from '../../api/api'

    export default {
        name: '',
        data() {
            return {
                arr: [],
                page: 1,
                size: 20,
                total: '',
                loading: false,
                scroller: null,
            }
        },
        mounted() {
            this.getCount()
            this.scroller = this.$el
        },
        methods: {
            getCount() {
                let id = this.$route.params.id
                let page = 0
                integral(id, page, this.size).then(res => {
                    let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                    this.total = JSON.parse(headers).x_total_count
                    this.arr = res.data
                })
            },
            loadMore() {
                this.loading = true
                if (this.arr.length < this.total) {
                    let id = this.$route.params.id
                    integral(id, this.page, this.size).then(res => {
                        this.arr.push(...res.data)
                        this.page++
                        this.loading = false
                    })
                }
                this.loading = false
            },
        },
        filters: {
            state(s) {
                return s === 1 ? '-' : '+'
            },
            tt(t) {
                return new Date(t).toLocaleString()
            }
        }
    }
</script>

<style>

</style>
