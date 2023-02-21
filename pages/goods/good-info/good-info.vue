<template>
	<view class="good-info">
		<view class="swiper">
			<u-swiper :list="goodsInfo.contentPhoto.length !==0 ? goodsInfo.contentPhoto : defultPhoto" height='420'
				img-mode='aspectFit'></u-swiper>
		</view>

		<view class="nameAndTag">
			<view class="name">
				{{goodsInfo.goodsName}}
			</view>
			<!-- 状态 -->
			<view class="status" v-if="goodsInfo.delStatus === 0">
				<u-tag text="在售" type="success" />
			</view>
			<view class="status" v-else>
				<u-tag text="下架" type="info" />
			</view>

		</view>


		<view class="pricebox">
			<view class="price">
				<text>价格 ￥{{goodsInfo.newPrice}} </text>
			</view>
			<view class="sales">
				<text>数量 x{{goodsInfo.goodsNum}}</text>
			</view>

		</view>

		<u-tabs class="tabs" :list="list" bar-width='80' :is-scroll="false" :current="current" @change="change">
		</u-tabs>

		<view class="centerContent">
			<!-- 商品详情 -->
			<view class="u-content" v-if="current === 0">
				<text>{{goodsInfo.desc}}</text>
				<!-- 商品评论 -->

				<GoodsComment ref='comments' :tranId='goodsId' :limitNum="2" :tranAuthorId='goodsInfo.authorId'
					:tranGoodsTitle='goodsInfo.goodsName'></GoodsComment>
				<!-- 显示加载更多 -->
				<view class="showSelect" v-show="isShowSect">
					<u-section sub-title="查看更多评论" :bold='false' :show-line='false' @click='isShowPop =true'></u-section>
				</view>
			</view>

		</view>


		<!-- 底部导航 -->
		<view class="navigation">
			<view class="left">
				<view class="item" @click="collect">
					<u-icon name="star" :size="40" :class="{color:isShowColor}"></u-icon>
					<view class="text " :class="{color:isShowColor}">收藏</view>
				</view>
				<view class="item" @click="isShowPop = true">
					<u-icon name="chat" :size="40"></u-icon>
					<view class="commentNum">12</view>
				</view>
			</view>
			<view class="right">
				<view class="buy1 btn ">我也卖</view>
				<view class="buy btn " @click="$u.route('pages/goods/chat/chat')">我想要</view>
			</view>
		</view>

		<!-- 评论弹出层 -->
		<u-popup v-model="isShowPop" mode='bottom' height='60%'>
			<view class="popComment">
				<GoodsComment :tranId='goodsId' :tranAuthorId='goodsInfo.authorId'
					:tranGoodsTitle='goodsInfo.goodsName'></GoodsComment>
			</view>
		</u-popup>
	</view>

</template>

<script>
	import GoodsComment from "@/components/goods-comment/goods-comment.vue"
	export default {
		components: {
			GoodsComment
		},
		name: 'goods-info',
		data() {
			return {
				list: [{
						name: '商品详情'
					},
					{
						name: '作者详情'

					}
				],
				defultPhoto: [], //默认图片
				current: 0, //选中的tabs导航栏
				goodsId: null, //点击的商品id
				goodsInfo: {}, //商品详情
				isShowColor: false, //收藏图标改变颜色
				isShowPop: false, //是否显示评论弹窗
				isShowSect: true, //是否显示加载更多评论
			};
		},
		onLoad(option) {
			const {
				goodsId
			} = option
			this.goodsId = goodsId
			this.getGoodsInfo(goodsId)

		},
		// 下拉刷新
		onPullDownRefresh() {
			// 调用子组件的方法
			this.$refs.comments.getComment()
			setTimeout(()=>{
				 uni.stopPullDownRefresh()
			},1000)
			
		},
		methods: {
			async getGoodsInfo(goodsId) {
				const {
					data
				} = await this.$u.api.getGoodsInfoById(goodsId)

				this.goodsInfo = data.goodsInfo
				this.defultPhoto.push(data.goodsInfo.coverPhoto)
			},

			change(index) {
				this.current = index;
			},
			//收藏
			collect() {
				//请求api
				if (this.isShowColor == false) {
					//完成之后显示提示 并改变标签状态
					this.$u.toast('已收藏')
					this.isShowColor = !this.isShowColor
				} else {
					this.$u.toast('已取消收藏')
					this.isShowColor = !this.isShowColor
				}

			}

		}
	}
</script>

<style lang="scss" scoped>
	.good-info {

		.nameAndTag {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.name {
				font-size: 18px;
				padding-left: 20rpx;
				color: #737373;
				margin: 30rpx 0;
				font-weight: 500;
			}

			.status {
				margin-right: 20rpx;
			}
		}

		.pricebox {
			font-size: 17px;
			font-weight: 500;
			display: flex;
			justify-content: space-between;
			padding: 10rpx 0;

			.price {
				color: red;
				margin-left: 20rpx;
			}

			.sales {
				color: #797979;
				margin-right: 20rpx;
			}
		}
	}

	// 图标选中颜色
	.color {
		color: red;
	}

	// 商品详情
	.centerContent {
		// 商品介绍
		height: 36vh;
		overflow-y: scroll;

		.u-content {
			padding: 20rpx;
			font-size: 14px;
		}

		.comment {
			position: fixed;
			top: 55 vh;
			bottom: 8vh;
			overflow-y: scroll;
		}

	}

	// 评论弹出层的格式
	.popComment {
		padding: 20rpx 0 0 30rpx;
	}

	// 底部导航
	.navigation {
		display: flex;
		position: fixed;
		bottom: 0;
		border: solid 2rpx #f2f2f2;
		background-color: #ffffff;
		padding: 16rpx 0;
		width: 100%;

		.left {
			display: flex;
			font-size: 20rpx;

			.item {
				margin: 0 30rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
			}
		}

		.right {
			display: flex;
			font-size: 28rpx;
			align-items: center;
			position: absolute;
			right: 0;

			.btn {
				line-height: 66rpx;
				padding: 0 30rpx;
				border-radius: 36rpx;
				color: #ffffff;
				margin: 0 20rpx;
			}

			.buy1 {
				background-color: #82858a;
			}

			.buy {
				background-color: #ff7900;
			}
		}
	}
</style>
