<template>
	<view class="shop-manger">
		<goods-swiperAction :goodsInfo="goodsInfo" @changeGoods='changeGoods'></goods-swiperAction>
		<!-- 确认删除模态框 -->
		<u-modal v-model="show" :content="content" @confirm="confirm" :show-cancel-button="true"></u-modal>
		
	</view>
</template>

<script>
	export default {
		name: "shopManger",
		data() {
			return {
				pageNum: 1,
				pageSize: 5,
				goodsInfo: [],
				show:false,
				content:"确认删除该商品？",
				options:{}//子组件传递过来的数据
			};
		},
		onLoad() {
			this.getGoodsInfo()
		},
		methods: {
			async getGoodsInfo() {
				const {
					data
				} = await this.$u.api.getGoodsByAuthorId({
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					authorId: this.vuex_user.openId
				})
				this.goodsInfo = data.res.res
			},
			
			// 确认按钮
			async confirm(){
				const res2= await this.$u.api.delGoods({
					goodsId:this.options.goodsId
				})
				if (res2.data.code = 200){
						this.goodsInfo.splice(this.options.index,1)
						this.$u.toast(res2.data.msg);
				}
			},
			
			// 修改商品状态  供子组件调用
		async changeGoods(options){
				switch (options.index1){
					case 0:
						const res = await this.$u.api.changeShopStatus({
							goodsId:options.goodsId,
							delStatus: 0
						})
						if (res.data.code = 200) return this.$u.toast(res.data.msg);
						break;
					case 1:
						const res1= await this.$u.api.changeShopStatus({
							goodsId:options.goodsId,
							delStatus: 1
						})
						if (res1.data.code = 200) return this.$u.toast(res1.data.msg);
						break;
					default:
					    this.show = true
						this.options = options
				}
			}
		}
	}
</script>

<style lang="less">

</style>
