const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'http://127.0.0.1:7001',
		loadingText: '努力加载中~',
		loadingTime: 800,
		//这个绝对要配置 卡了一天 吐了
		originalData: true, // 是否在拦截器中返回服务端的原始数据

	});


	// 请求拦截器
	Vue.prototype.$u.http.interceptor.request = (config) => {
	// 	// 方式一，存放在vuex的token，假设使用了uView封装的vuex方式
	// 	// 见：https://uviewui.com/components/globalVariable.html
	// 	// config.header.token = vm.token;
		config.header.Authorization = "Bearer " + vm.vuex_token

	}
	
	

}

export default {
	install
}
