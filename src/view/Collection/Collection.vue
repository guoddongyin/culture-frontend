<template>
    <div id="news">
        <div class="leftTop">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>我的收藏</span>
        </div>
        <div class="center">
            <div style="font-size: 20px;text-align: center;position:absolute;top:40%;width:100%;" v-if="content.length<=0">
                暂无数据
            </div>
            <div class="collections" @click="toDetail(item.reloid,item.source)" v-for="(item,index) in content">
                <div class="collection">
                    <img :src="url+item.imageurl" alt="">
                    <!--<div class="collectionTime">-->
                        <!--<i class="iconfont icon-qietu19"></i>-->
                        <!--<span>{{ item.opertime | times }}</span>-->
                    <!--</div>-->
                </div>
                <div class="flexBettwens">
                    <div>{{ item.title }}</div>
                    <div>
                        <i style="color: #fa711b" class="iconfont icon-qietu19"></i>
                        <span>{{ item.opertime | times }}</span>
                    </div>
                </div>
            </div>
            <div @click="clickMore" v-if="content.length>0" class="clickMore">{{ loadingTxt }}</div>
        </div>
    </div>
</template>

<script>
    import { collection } from '../../api/api'

    export default {
        name: '',
        data() {
            return {
                url: URL,
                bg: require('../../assets/re1.png'),
                content: [],
                offset: 0,                       // 页数，默认0
                limit: 10,                       // 每次查询的条数
                loading: false,                  // 滚动加载提示
                total: 0,                        // 总数
                loadingTxt: '点击加载...',        // 正在加载的显示
                allCount: true,                  // 是否加载全部
            }
        },
        watch: {
            content(s) {
                s.length >= this.total ? this.loadingTxt = '所有数据已加载完毕' : '点击加载'
            }
        },
        methods: {
            // 返回
            handleBack() {
                window.history.back()
            },
	        // 前往作品详情页
            toDetail(id,source){
                let pageName='';
                switch (source){
                    case 0:pageName="Courses";break;
                    case 1:pageName="Activities";break;
                    case 2:pageName="";break;
                    case 3:pageName="";break;
                    case 4:pageName="";break;
                    case 5:pageName="ExhibitionDetail";break;
                    case 6:pageName="";break;
                    case 7:pageName="";break;
                    case 8:pageName="";break;
                    case 9:pageName="";break;
                    case 10:pageName="Creatives";break;
                    case 11:pageName="";break;
                    case 12:pageName="";break;
                    case 13:pageName="";break;
                    case 14:pageName="";break;
                    case 15:pageName="";break;
                    case 16:pageName="";break;
                    case 17:pageName="";break;
                    case 18:pageName="";break;
                    case 19:pageName="";break;
                    case 20:pageName="VoteId";break;
                    case 21:pageName="WorkInfo";break;
                    case 22:pageName="";break;
                    case 23:pageName="";break;
                    case 24:pageName="";break;
                    case 25:pageName="";break;
                    case 26:pageName="";break;
                    case 100:pageName="";break;
                    case 101:pageName="";break;
                    case 102:pageName="";break;
                    case 103:pageName="";break;
                    case 104:pageName="";break;
                    case 105:pageName="";break;
                    case 106:pageName="";break;
                    case 107:pageName="";break;
                    case 108:pageName="Login";break;
                    case 109:pageName="Regsiter";break;
                }
                //console.log(pageName+"gggggg");
                if(pageName!=""){
                    this.$router.push('/'+pageName+'/'+id.id);
                }
            },
            clickMore() {
              this.offset=this.offset+this.limit
                if (this.total > this.content.length) {
                    this.loading = true
                    this.loadingTxt = '正在加载...'
                    let id = this.$route.params.id    // 用户ID
                    collection(id, this.offset, this.limit, this.allCount).then(res => {
                        console.log(res)
                        let arr = res.data
                        this.content.push(...arr)
                        this.loading = false
                        console.log(this.content.length)
                        this.loadingTxt = '点击加载...'
                    }).catch(err => {
                        console.log(err.response)
                    })
                } else {
                    this.loadingTxt = '所有数据已加载完毕'
                }
            },
            // 获取收藏信息
            getCollection() {
                let id = this.$route.params.id    // 用户ID
                this.offset = 0
                collection(id, this.offset, this.limit, this.allCount).then(res => {
                    console.log(res)
                    // 取出在头部的总条数
                    let headers = JSON.stringify(res.headers).replace(/-/g, '_')
                    this.total = JSON.parse(headers).x_total_count
                    this.content = res.data
                }).catch(err => {
                    console.log(err.response)
                })
            }

        },
        created() {
            this.getCollection()
        }
    }
</script>

<style>

</style>
