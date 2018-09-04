<template>
    <div id="nav">
        <router-link tag="div" to="/Home" class="nav">
            <i class="iconfont icon-shouye"></i>
            <span>首页</span>
        </router-link>
        <router-link tag="div" to="/News/1" class="nav" style="position: relative">
            <i class="iconfont icon-lingdang"></i>
            <span>消息</span>
            <div v-if="count.unreadCount>0" class="msgPoint"></div>
        </router-link>
        <router-link tag="div" to="/Users" class="nav">
            <i class="iconfont icon-wode"></i>
            <span>我的</span>
        </router-link>
    </div>
</template>

<script>
    import { unreadCount } from '../api/api'

    export default {
        name: '',
        data() {
            return {
                count: ''
            }
        },
        methods: {
            getData() {
                unreadCount().then(res => {
                    this.count = res
                }).catch(err => {
                })
            },
        },
        created() {
            this.getData()
        }
    }
</script>

<style>

</style>
