<template>
	<view class="content">
		<view class="search">
			<u-search placeholder="搜索商品" v-model="keyword" :focus='true' :show-action='false' />
		</view>
		<view class="swiper">
			<u-swiper height='330' :effect3d='true' :list="list" />
		</view>
		<view class="notice">
			<u-notice-bar mode="horizontal" :list="notice"></u-notice-bar>
		</view>

		<view class="tabs">
			<u-tabs :list="lists" :is-scroll="false" bar-width='80' item-width="160" :current="current"
				@change="change"></u-tabs>
		</view>

		<!-- 商品列表 -->
		<view class="wrap u-skeleton">
			<u-row gutter="16">
				<!-- 商品列表 -->
				<u-col span="6" v-for="(item,index) in goodsInfo" :key="item.goodsId">
					<goods-card :goodsId='item.goodsId' :goodsName='item.goodsName' :coverPhoto='item.coverPhoto' :newPrice="item.newPrice" :goodsNum="item.goodsNum" />
				</u-col>
			</u-row>
		</view>
		<!-- 骨架屏 -->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import GoodsCard from "@/components/goods-card/goods-card.vue"
	export default {
		components: {
			GoodsCard
		},
		data() {
			return {
				keyword: '',
				//轮播图片
				list: [
					'https://img1.baidu.com/it/u=2128198512,1967583574&fm=26&fmt=auto&gp=0.jpg',
					'https://img1.baidu.com/it/u=3692647261,401841183&fm=26&fmt=auto&gp=0.jpg',
					'https://img2.baidu.com/it/u=1830509290,2347906732&fm=26&fmt=auto&gp=0.jpg'
				],
				//消息通知栏
				notice: ['请注意交易安全，谨慎辨别虚假信息'],

				//tabs标签栏
				lists: [{
					name: '最新发布'
				}, {
					name: '闲置出售'
				}, {
					name: '意向求购',
				}],
				goodsInfo: [], //商品信息
				current: 0, //默认选中
				pageNum: 1, //当前页数
				pageSize: 10, //每页的数量
				shopType: '' //查询的商品类型
			};
		},
		created() {
			this.getGoodsInfo()
		},
		onPullDownRefresh() {
			this.getGoodsInfo()
			setTimeout(()=>{
				 uni.stopPullDownRefresh()
			},1000)
			
		},
		methods: {
			// 选取哪个导航
			change(index) {
				this.current = index;
				if(index == 1){
					this.shopType = 0
					this.getGoodsInfo()
				}else if(index == 2){
					this.shopType = 1
					this.getGoodsInfo()
				}else{
					this.shopType = ''
					this.getGoodsInfo()
				}
			},
			// 获取商品列表
			async getGoodsInfo() {
				const {
					data
				} = await this.$u.api.getGoodsInfo({
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					shopType: this.shopType
				})
				this.goodsInfo = data.res
			
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		background-color: #f8f8f8;

		.search {
			height: 90rpx;
			padding-top: 20rpx;
		}

		.swiper {
			margin-top: 20rpx;
		}

		.notice {
			margin-top: 15rpx;
		}
	}
</style>
