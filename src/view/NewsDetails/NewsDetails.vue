<template>
    <div id="news">
        <div class="leftTop">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>我的消息</span>
        </div>
        <div class="center" style="background-color: #ffffff">
            <div class="titles">{{ msg.title }}</div>
            <div class="txt">
                {{ msg.content }}
            </div>
        </div>
    </div>
</template>

<script>
    import { msgId ,putMsgId} from '../../api/api'

    export default {
        name: '',
        data() {
            return {
                msg: {}
            }
        },
        methods: {
            // 返回
            handleBack() {
                this.$router.go(-1)
            },
            // 获取数据
            getData() {
                let id = this.$route.params.id
                msgId(id).then(res => {
                    console.log(res)
                    this.msg = res
                    this.handleClear()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 根据ID消除未读消息
            handleClear(){
                let id = this.$route.params.id
                putMsgId(id).then(res=>{
                    console.log(res)
                }).catch(err=>{
                    console.log(err.response)
                })
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style>

</style>
