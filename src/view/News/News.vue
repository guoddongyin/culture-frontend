<template>
    <div id="news">
        <div class="leftTop">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>我的消息</span>
        </div>
        <div class="center" style="background-color: #f5f5f5;margin-bottom: 1.2rem">
            <div style="font-size: 20px;text-align: center;position:absolute;top:40%;width:100%;" v-if="contents.length<=0">
                暂无数据
            </div>
            <div class="news" v-for="(item,index) in contents" :key="index" @click="handleInfo(item)">
                <div class="new">
                    <div class="title">{{ item.title }}</div>
                    <i v-if="!item.read" class="iconfont icon-yuandianzuobiao"></i>
                </div>
                <div class="content">
                    {{ item.content | txt }}
                </div>
                <div class="time">{{ item.timestamp | times }}</div>
            </div>
            <div @click="clickMore" v-if="contents.length>0" class="clickMore">{{ loadingTxt }}</div>
        </div>
    </div>
</template>

<script>
    import { pushMsg,allMsg } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui';

    export default {
        name: '',
        data() {
            return {
                contents: [],                 // 内容数组
                offset: 0,                       // 页数，默认0
                limit: 5,                       // 每次查询的条数
                loading: false,                  // 滚动加载提示
                total: 0,                        // 总数
                loadingTxt: '点击加载...',        // 正在加载的显示
                allCount: true,                  // 是否加载全部
            }
        },
        watch: {
            contents(s) {
                s.length >= this.total ? this.loadingTxt = '所有数据已加载完毕' : '点击加载'
            }
        },
        methods: {
            // 返回
            handleBack() {
                this.$router.go(-1)
            },
            clickMore(){
                this.offset=this.offset+this.limit
                if (this.total > this.contents.length) {
                    this.loading = true
                    this.loadingTxt = '正在加载...'
                    pushMsg(this.offset,this.limit).then(res => {
                        console.log(res)
                        let arr = res.data
                        this.contents.push(...arr)
                        this.loading = false
                        console.log(this.contents.length)
                        this.loadingTxt = '点击加载...'
                    }).catch(err => {
                        console.log(err.response)
                    })
                } else {
                    this.loadingTxt = '所有数据已加载完毕'
                }
            },
            // 获取数据
            getData() {
                Indicator.open()
                allMsg(this.limit).then(res => {
                    console.log(res)
                    // 取出在头部的总条数
                    let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                    this.total = JSON.parse(headers).x_total_count
                    this.contents = res.data
                    Indicator.close()
                }).catch(err => {
                    console.log(err.response)
                    Indicator.close()
                })
            },
            // 前往消息详情页面
            handleInfo(item) {
                this.$router.push('/NewsDetails/' + item.id)
            },
        },
        created() {
            this.getData()
        },
        filters: {
            txt(t) {
                return t.length > 80 ? t.substr(0, 80) + '...' : t
            }
        }
    }
</script>

<style>

</style>
