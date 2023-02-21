<template>
	<view class="fabu-content">
		<u-form :model="form" ref="uForm" :error-type="errorType">
			<view class="firstBox">
				<u-form-item label="求购名称" label-width='160' label-align='center' prop="goodsName">

					<u-input v-model="form.goodsName" input-align='right' :clearable='false' placeholder="请输入求购物品名称(必填)"
						placeholder-style="margin-left:-10rpx" />

				</u-form-item>
			</view>

			<view class="twoBox">
				<u-form-item class="shopnum" label="物品数量" label-width='160' label-align='center' prop='goodsNum'>
					<template #right>
						<u-input v-model="form.goodsNum" input-align='right' :clearable='false' placeholder="请输入物品数(必填)"
							placeholder-style="margin-left:-10rpx" />
					</template>
				</u-form-item>
				<u-form-item label="意向价格" label-width='160' label-align='center' prop='newPrice'>
					<u-input type="number" :clearable='false' v-model="form.newPrice" input-align='right'
						placeholder="请输入意向价格(必填)" placeholder-style="margin-left:-10rpx" />
					<template #right>
						<text class="priceLabel">￥</text>
					</template>
				</u-form-item>
				<u-form-item label="添加备注" label-width='160' label-align='center' prop='desc'>
					<u-input type="number" :clearable='false' v-model="form.oldPrice" input-align='right'
						placeholder="(选填)" placeholder-style='margin-left:-10rpx' />
				</u-form-item>
			</view>

			<view class="three-box">
				<u-form-item>
					<textarea class="productDetails" v-model="form.desc" placeholder="请输入意向物品详情" value=""
						maxlength='-1' />
				</u-form-item>
			</view>

			<view class="four-box">
				<view class="text">
					上传求购物品封面图片(选填)
				</view>
				<u-form-item :border-bottom='false'>
					<u-upload ref="uUpload" :action="action" max-count='1'></u-upload>
				</u-form-item>
			</view>

			<view class="five-box">
				<view class="text">
					上传求购物品详情图片(选填)
				</view>
				<u-form-item :border-bottom='false'>
					<u-upload ref="uUploadTwo" :action="action" max-count='9'></u-upload>
				</u-form-item>
			</view>
		</u-form>

		<view class="btn-box">
			<view class="first-btn">
				<u-button type="success" size="default" @click="submit">点击上传</u-button>
			</view>
		</view>

	</view>

</template>

<script>
	export default {
		data() {
			return {
				form: {
					goodsId: Date.now(), //商品Id
					goodsName: '',
					authorId:'',
					goodsNum: 1, //数量
					newPrice: "", //价格
					desc: '', //商品详情
					coverPhoto: '', //封面图
					contentPhoto: [], //内容图
					shopType: 1 // 商品类型区分  0为出售 1为求购				
				},
				action: 'http://127.0.0.1:7001/goods/upload', //服务器上传地址

				errorType: ['border-bottom', 'message'], //表单验证错误提示
				// 验证规则
				rules: {
					goodsName: [
						// 必填验证
						{
							required: true,
							message: '请填写物品名',
							trigger: ['blur']
						}
					],
					goodsNum: [{
						required: true,
						message: '请输入物品数量',
						trigger: ['blur'],
						type: 'number'
					}],
					newPrice: [{
						required: true,
						message: '请输入意向价格',
						trigger: ['blur'],
						type: 'number'
					}]

				}
			}
		},
		methods: {
			async submit() {
				this.$refs.uForm.validate(valid => {
					if (!valid) return this.$u.toast("商品内容填写出错")
				});
				try {
					// 上传封面图
					const files = this.$refs.uUpload.lists
					if (files.length !== 0) {
						this.form.coverPhoto = files[0].file.path
					} else {
						this.form.coverPhoto =
							"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201704%2F20%2F20170420203840_xcX3s.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644670966&t=7f96652e0ca0338fe5d76361844e45e1"
					}

					// 上传内容图
					const filelist = this.$refs.uUploadTwo.lists
					let imgArray = []
					filelist.forEach(item => {
						return imgArray.push(item.file.path)
					})
					this.form.contentPhoto = imgArray

					if (this.form.coverPhoto !== "") {
						// 调用接口发布商品
						const {
							data
						} = await this.$u.api.createGoods(this.form)
						if (data.code == 200) {
							this.$u.toast("发布成功")
							setTimeout(() => {
								// 重置表单
								this.form = {
									goodsId: Date.now(), //商品Id
									goodsName: '',
									authorId:'',
									goodsNum: 1, //数量
									newPrice: "", //价格
									desc: '', //商品详情
									coverPhoto: '', //封面图
									contentPhoto: [],
								} //清空图片列表
								this.$refs.uUpload.clear()
								this.$refs.uUploadTwo.clear()
							}, 500)
						}
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e)
					this.$u.toast("发布失败")
				}

			}
		},
		// 挂载验证规则
		onReady() {
			this.form.authorId = this.vuex_user.openId ? this.vuex_user.openId : ""
			this.$refs.uForm.setRules(this.rules);
		}
	};
</script>

<style lang="less" scoped>
	/deep/ .u-input__input.data-v-460c1d26 {
		padding-right: 25rpx;
	}

	.priceLabel {
		position: absolute;
		right: 0;
	}

	.fabu-content {
		background-color: #eee;

		.firstBox {
			background-color: #FFFFFF;
		}

		.twoBox {
			margin-top: 40rpx;
			background-color: #FFFFFF;
		}

		.three-box {
			margin-top: 40rpx;
			background-color: #FFFFFF;

			textarea {
				width: 100%;
			}
		}

		.four-box {
			margin-top: 40rpx;
			background-color: #FFFFFF;

			.text {
				padding: 30rpx 0 0 10rpx;
			}
		}

		.five-box {
			margin-top: 40rpx;
			background-color: #FFFFFF;

			.text {
				padding: 30rpx 0 0 10rpx;
			}
		}

		.btn-box {
			padding: 20rpx;

			.first-btn {
				margin-bottom: 10rpx;
			}
		}

	}
</style>
