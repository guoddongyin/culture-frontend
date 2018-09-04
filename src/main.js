import Vue from 'vue'


//引入mintUI
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import YDUI from 'vue-ydui';
import 'vue-ydui/dist/ydui.rem.css';

import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'

import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(MuseUI)

Vue.use(YDUI);

Vue.use(MintUI)

Vue.use(iView);
import App from './App.vue'
import router from './router/index'
import axios from 'axios'
Vue.prototype.$http = axios; //把axios对象挂到Vue原型上
axios.defaults.withCredentials = true

//引入全局 filters
import * as times from './filters/times.js'
Object.keys(times).forEach(key=>{
    Vue.filter(key,times[key])
})

import VueAMap from 'vue-amap';

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
    key: 'aac5e17ea31c77f34e07e8d0d3355a5c',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Driving']
});

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
