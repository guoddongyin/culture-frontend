<style>

</style>

<template>
    <div id="news">
        <div class="leftTop">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>积分规则</span>
        </div>
        <div class="center">
            <table class="center-table">
                <thead class="center-table-th">
                    <td>积分渠道</td>
                    <td>单次积分</td>
                    <td>说明</td>
                </thead>
                <tr class="center-table-tr">
                    <td>注册</td>
                    <td>100</td>
                    <td></td>
                </tr>
                <tr class="center-table-tr">
                    <td>登录</td>
                    <td>5</td>
                    <td>当天首次登录</td>
                </tr>
                <tr class="center-table-tr">
                    <td>参加征集投稿</td>
                    <td>100</td>
                    <td></td>
                </tr>
                <tr class="center-table-tr">
                    <td>活动报名</td>
                    <td>25</td>
                    <td></td>
                </tr>
                <tr class="center-table-tr">
                    <td>分享</td>
                    <td>20</td>
                    <td></td>
                </tr>
                <tr class="center-table-tr">
                    <td>评价</td>
                    <td>20</td>
                    <td></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {}
        },
        methods:{
            handleBack(){
                this.$router.go(-1)
            }
        }
    }
</script>


