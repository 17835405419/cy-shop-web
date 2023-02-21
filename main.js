import Vue from 'vue'
import App from './App'
import httpInterceptor from '@/common/http.interceptor.js'
// 导入uview封装好的vuex
import store from '@/store';
import api from '@/common/api.js'
Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);


// 引入封装好的vuex
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);


const app = new Vue({
	store,
    ...App
})

// 引入拦截器
Vue.use(httpInterceptor, app)

// 引入api集中请求
Vue.use(api, app)


app.$mount()
