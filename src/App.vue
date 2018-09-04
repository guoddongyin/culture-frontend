<template>
    <div id="app">
        <router-view></router-view>
        <navs v-if="$route.meta.showNav"></navs>
    </div>
</template>

<script>
    import Navs from './components/Nav.vue'
    import { wxCode,wxlogin,wiki } from './api/api'

    export default {
        components: {
            Navs
        },
        name: 'app',
        data() {
            return {}
        },
        watch: {},
        methods: {
            // 获取url中的参数
            getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; //返回参数值
            },
            setReqUrl() {
                var code = this.getUrlParam("code");
                var openid = this.getUrlParam("openid");
                var routerArray=window.location.href.split("/");
                var router=routerArray.length>1?routerArray[routerArray.length-1]:'';
                if(parseInt(router)){
                  router=routerArray.length>1?routerArray[routerArray.length-2]:'';
                }
                if(!code){
                    this.getopenid(code,router);
                }else{
                    var routerName=this.getUrlParam("router");
                    if(routerName){
                      this.$router.push('/'+routerName);
                    }
                    // wxlogin(openid,{}).then(res=>{
                    //     // console.log("openid:     ");
                    //     // console.log(res);
                    // })
                }
                // if (code && code.length > 0) {
                //     if (code !== "") {
                //
                //         return;
                //     }
                // }
            },
            getopenid(code,router) {
                var appid = "";
                var url = "//www.culturetest.com/culture-app/wiki/open?code={code}";
                var toapp_url = '/index.html?openid={id}'
                var weixin_url='https://open.weixin.qq.com/connect/oauth2/authorize?appid={id}&redirect_uri={ret_url}&response_type=code&scope=snsapi_userinfo&state='
                var temp_open_url = url.replace("{code}", code);
                if(code){
                    // wxCode(url).then(res=>{
                    //     console.log("openid:     ");
                    //     aconsole.log(res);
                    //     toapp_url=toapp_url.replace('{id}',res.openid);
                    //     window.location.href=toapp_url;
                    // })
                }else{
                    wiki().then(res => {
                        appid = res.appid;
                        var temp_weixin_url = weixin_url.replace("{id}",appid);
                         temp_weixin_url = temp_weixin_url.replace("{ret_url}",authPath+'index.html?router='+router);
                      //temp_weixin_url = temp_weixin_url.replace("{ret_url}",authPath+'/index.html/');
                        //console.log(temp_weixin_url);
                        window.location.href = temp_weixin_url;
                    })
                }
            }
        },


    mounted() {
            if (IS_WX) {
		    if(IS_USERAGENT){
			    var ua = window.navigator.userAgent.toLowerCase();
			    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
				    this.setReqUrl();
			    }
		    }else{
			    //this.setReqUrl();
		    }
	    }
    }
    }
</script>

<style lang="scss">
    @import 'assets/style.scss';
</style>
