<template>
	<view class="my-box">
		<view class="first">
			<!-- 登录后显示的 -->
			<view class="avaterbox" v-if="vuex_token">
				<view class="img">
					<image :src="vuex_user.avatarUrl" mode=""></image>
				</view>
				<view class="u-font-14 u-tips-color">{{vuex_user.nickName}}</view>
			</view>

			<!-- 未登录时显示的用户 -->
			<view class="avaterbox" v-else @click="login">
				<view class="img">
					<image src="../../static/icon/youke.png" mode=""></image>
				</view>
				<view class="u-font-14 u-tips-color">游客</view>
			</view>

			<view class="salesNum u-flex">
				<view class="trade u-flex u-flex-1  ">
					<text class="num">{{vuex_user.saleNum ? vuex_user.saleNum :0}}</text>
					<text class="name">总交易数</text>
				</view>
				<view class="release u-flex u-flex-1 ">
					<text class="num">{{vuex_user.shopNum ? vuex_user.shopNum : 0}}</text>
					<text class="name">总发布数</text>
				</view>
			</view>

		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="个人信息" @click="$u.route('pages/my/baseInfo')"></u-cell-item>
				<u-cell-item title="我的交易">
					<u-icon slot='icon' color="red" size="34" name="rmb-circle" />
				</u-cell-item>
				<u-cell-item title="我发布的商品" @click="$u.route('pages/my/shopManger/shopManger')">
					<u-icon slot='icon' color="blue" size="34" name="file-text" />
				</u-cell-item>
				<u-cell-item icon="star" title="商品收藏"></u-cell-item>
				<u-cell-item icon="chat" title="意见反馈"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="reload" title="退出登录" @click='logout'></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {
			// 登录功能
			login() {
				// 实现微信登录
				uni.getUserProfile({
					desc: "请求一波",
					success: (res) => {
						const {
							userInfo
						} = res
						uni.login({
							provider: 'weixin',
							success: res => {
								const {
									code
								} = res
								// 调用接口获取token
								this.$u.api.wxLogin({
									userInfo,
									code
								}).then(res => {
									const {
										data
									} = res
									// // 登陆成功之后将token和用户数据保存
									this.$u.vuex("vuex_token", data.token)
									// 调用接口获取用户信息
									this.getUserInfo()
									this.$u.toast("登陆成功")
								})
							},
							// 登录失败时的回调
							fail: () => {
								this.$u.toast("登录时发生错误")
							}
						})
					},
					fail: (err) => {
						console.log(err)
						this.$u.toast('登录失败')
					}
				})

			},

			// 获取用户信息
			async getUserInfo() {
				try {
					const {
						data
					} = await this.$u.api.getUserInfo()
					console.log(data.userInfo)
					this.$u.vuex("vuex_user", data.userInfo)
				} catch (e) {
					//TODO handle the exception
					console.log(e)
					this.$u.toast("获取用户信息失败")
				}

			},


			// 退出功能
			logout() {
				uni.showModal({
					title: '退出提示',
					content: '是否确认退出',
					success: res => {
						if (res.confirm) {
							this.$u.vuex("vuex_token",null)
							this.$u.vuex("vuex_user",null)
							setTimeout(()=>{
								this.$u.toast("退出成功")
							}
							,500)
						} else {
							this.$u.toast("已取消")
						}

					}
				});

			}
		}

	}
</script>

<style lang="scss" scoped>
	.my-box {
		background-color: #efefef;
	}

	.first {
		box-shadow: 0 2px 4px rgba(72, 72, 72, 0.5);
		background-color: #fff;

		.avaterbox {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.img {
				width: 80px;
				height: 80px;
				border: 1px solid #eee;
				border-radius: 50%;
				margin: 25rpx 0;

				image {
					border-radius: 50%;
					width: 100%;
					height: 100%;
				}
			}
		}


	}

	.salesNum {
		height: 200rpx;
		background-color: #fff;

		.trade,
		.release {
			display: flex;
			flex-direction: column;

			.num {
				font-size: 20px;
				color: #827dfa;
				padding-bottom: 10rpx;
			}

			.name {
				font-size: 15px;
				color: #8b8b8b;
			}
		}

	}
</style>
