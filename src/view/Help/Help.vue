<template>
    <div id="news">
        <div class="leftTop">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>帮助中心</span>
        </div>
        <div class="center">
            <div class="cells">
                <div class="cell" style="padding-left: 0.4rem">
                    <div class="flexCenter">
                        <span>客服中心</span>
                    </div>
                    <div>
                        023-6378-2227
                        <!--<i class="iconfont icon-right"></i>-->
                    </div>
                </div>
                <div class="cell" style="padding-left: 0.4rem">
                    <div class="flexCenter">
                        <span>传真</span>
                    </div>
                    <div>
                        023-6842-3735
                        <!--<i class="iconfont icon-right"></i>-->
                    </div>
                </div>
            </div>
        </div>
        <div style="padding: 0.4rem">大家软件地址：重庆市渝中区两路口重庆村55号新干线A栋28楼附4号</div>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {

            }
        },
        methods:{
            handleBack(){
                this.$router.go(-1)
            }
        }
    }
</script>

<style>

</style>
