<template>
	<view>
		<u-swipe-action :index="index" :show='show' v-for="(item, index) in goodsInfo" :key="item.goodsId"
			@click="click" :options="options" @open='getGoodsId(item.goodsId)'>
			<view class="item u-border-bottom">
				<image mode="aspectFill" :src="item.coverPhoto" />
				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<view class="title-wrap">
					<text class="title u-line-2">{{ item.goodsName }}</text>
				</view>
			</view>
		</u-swipe-action>
	</view>
</template>

<script>
	export default {
		name: "goods-swiperAction",
		props: {
			goodsInfo: {
				type: Array
			}
		},
		data() {
			return {
				btnWidth: 180,
				options: [{
						text: '上架',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '下架',
						style: {
							backgroundColor: '#999999'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				goodsId: null //点击操作的商品Id
			};
		},
		methods: {
			getGoodsId(goodsId) {
				this.goodsId = goodsId
				
			},
			click(index, index1) {
				let goodsId = this.goodsId
				this.$emit("changeGoods",{index,index1,goodsId})
			}

		}
	}
</script>

<style lang="less">
	.item {
		display: flex;
		padding: 20rpx;
	}

	image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}

	.title {
		text-align: left;
		font-size: 28rpx;

		margin-top: 20rpx;
	}
</style>
