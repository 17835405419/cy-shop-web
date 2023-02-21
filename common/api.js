const install = (Vue, vm) => {

	/*
	用户相关的
	*/
          
    // 微信登录
	let wxLogin = params => {
	  return  vm.$u.post('/user/login', params)
	}
	//获取用户信息
	let getUserInfo = ()=>{
		return vm.$u.get('/user/getUserInfo')
	}
	
	/*
	 商品相关的
	*/
   // 分页查询商品数据
	let getGoodsInfo = params =>{
		return vm.$u.get('/goods/find',params)
	}
	// 根据作者Id获取商品数据
	let getGoodsByAuthorId = params =>{
		return vm.$u.get('/goods/findByOpenId',params)
	}

	
	let createGoods = params =>{
		return vm.$u.post('/goods/add',params)
	}
	
	let getGoodsInfoById = goodsId =>{
		return vm.$u.get(`/goods/findOne/${goodsId}`)
	}
	
	// 上下架商品
	let changeShopStatus = option =>{
		return vm.$u.put(`/goods/downShop/${option.goodsId}`,option)
	}
	
	// 删除商品
	let delGoods = params =>{
		return vm.$u.delete(`/goods/del/${params.goodsId}`)
	}
	
	/*
	评论相关
	*/
   let createComment = params =>{
	   return vm.$u.post('/comment/add',params)
   }
   
   let replyComment = params =>{
	   return vm.$u.put('/comment/reply',params)
   }
   
   let findComment = params =>{
	   return vm.$u.get('/comment/find',params)
   }
	vm.$u.api = {
		wxLogin,
		getUserInfo,
		getGoodsInfo,
		createGoods,
		getGoodsInfoById, //根据商品id获取详细商品信息
		getGoodsByAuthorId, //根据作者ID获取商品信息
		changeShopStatus,
		delGoods,
		createComment,
		findComment,
		replyComment
	}

}




export default {
	install
}
