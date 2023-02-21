<template>
	<view>

		<view class="goods_item" @click="goGoodsInfo">
			<u-image class="u-skeleton-fillet" width="100%" height="300rpx" :src="coverPhoto" />

			<view class="title u-line-1 u-skeleton-rect">
				{{goodsName ? goodsName :'商品名称'}}
			</view>
			<view class="goods_sbox">
				<view class="price ">￥ {{newPrice}}</view>
				<view class="num u-skeleton-rect">x {{goodsNum}}</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "goods-card",
		props:{
			goodsId:{
				type:Number,
				required:true
			},
			goodsName:{
				type:String,
				required:true
			},
			newPrice:{
				type:Number,
				required:true
			},
			goodsNum:{
				type:Number,
				required:true
			},
			coverPhoto:{
				type:String
			}
		},
		data() {
			return {

			};
		},
		methods:{
			goGoodsInfo(){
				this.$u.route({
								url: 'pages/goods/good-info/good-info',
								params: {
									goodsId: this.goodsId
								}
							})
			}
		}
	}
</script>

<style lang="less">
	.goods_item {
		padding: 40rpx;
		margin-top: 30rpx;
		box-shadow: 0 12rpx 20rpx 0 rgba(0, 0, 0, .1);
        background-color: #FFFFFF;
		.title {
			margin: 20rpx 0;
			font-weight: 500;
			font-size: 32rpx;
			width: 100%;

		}

		.goods_sbox {
			display: flex;
			justify-content: space-between;

			.price {
				color: red;
				width: 40%;
			}

			.num {
				padding-left: 20px;
				color: #888;
				width: 40%;
			}
		}
	}
</style>
