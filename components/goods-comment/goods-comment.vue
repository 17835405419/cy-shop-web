<template>
	<view class="comment-box">
		<view class="create-comment">
			<!-- 上方发表评论区 -->
			<u-avatar :src="src" mode="circle" size='60'></u-avatar>
			<u-input v-model="createComment" :border="true" height='45' :clearable='false' :placeholder="placeholder"
				@click='isShow=true' @blur='isShow=false' :trim='true' />
			<view class="buttonShow" v-show="isShow">
				<u-button shape="circle" size='mini' type='success' @click='publish'>发表</u-button>
			</view>
		</view>
		<!-- 主要评论区 -->
		<view class="comment" v-for="(comment,index) in commentList" :key='index'>
			<view class="avater">
				<u-avatar :src="comment.avatarUrl" mode="circle" size='60'></u-avatar>
				<view class="name-top">
					<text class="nickname">{{comment.nickName}}</text>
					<view class="create-time">
						·{{$u.timeFrom(comment.commentTime, false)}}
					</view>
				</view>
			</view>

			<view class="content-box">
				<view class="content" @click="showPop({commentId:comment.commentId,openId:comment.openId})">
					{{comment.commentContent}}
				</view>

				<!-- 输入框的弹出层 -->
				<u-popup v-model="isShowPop" mode='bottom' :height='popHeight' :mask='false'>
					<view class="replyPop">
						<view class="replyInput">
							<u-input v-model="replyComment" :border="true" height='45' :clearable='false'
								:placeholder="comment.nickName" :trim='true' @click="isReplyShow = true" />
						</view>
						<view class="buttonShow" v-show="isReplyShow">
							<u-button shape="circle" size='mini' type='success' @click='reply'>回复</u-button>
						</view>
					</view>
				</u-popup>


				<!-- 回复区 -->
				<view class="reply-box" v-for="(reply,indexTwo) in comment.childComment" :key="indexTwo">
					<view class="avater">
						<u-avatar :src="reply.avatarUrl" mode="circle" size='60'></u-avatar>
						<view class="name-top">
							<text class="nickname">{{reply.nickName}}</text>
							<view class="create-time">
								·{{$u.timeFrom(reply.createTime, false)}}
							</view>
						</view>
					</view>
					<view class="reply-content">
						{{reply.childComment}}
					</view>
				</view>




			</view>

		</view>


	</view>



	</view>
</template>

<script>
	export default {
		name: "goods-comment",
		props: {
			tranId: {
				type: Number,

			},
			tranAuthorId: {
				type: String,
			},
			tranGoodsTitle: {
				type: String,
			},
			limitNum: {
				type: Number
			}
		},
		data() {
			return {
				src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbj-yuantu.fotomore.com%2Fcreative%2Fvcg%2Fnew%2FVCG211363439424.jpg%3FExpires%3D1643621485%26OSSAccessKeyId%3DLTAI2pb9T0vkLPEC%26Signature%3DV7ZL3VtfrWsfGDmJDiahAW3pOgo%253D%26x-oss-process%3Dimage%252Fauto-orient%252C0%252Fsaveexif%252C1%252Fresize%252Cm_lfit%252Ch_1200%252Cw_1200%252Climit_1%252Fsharpen%252C100%252Fquality%252CQ_80%252Fwatermark%252Cg_se%252Cx_0%252Cy_0%252Cimage_d2F0ZXIvdmNnLXdhdGVyLTIwMDAucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLG1fbGZpdCxoXzE3MSx3XzE3MSxsaW1pdF8x%252F&refer=http%3A%2F%2Fbj-yuantu.fotomore.com&app=2002&size=f10000,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1646574296&t=aa802fffe5aff80249e16e840884c9cd',
				commentList: [],
				replyList:[],
				placeholder: '看对眼的话，就留言评论一下吧',
				createComment: '', //输入框内容
				isShow: false, //发布按钮显示控制
				isReplyShow: false, //回复按钮显示控制
				isShowPop: false, //是否显示弹出层
				replyComment: '', //回复的内容
				popHeight: 60, //键盘升起的高度
				option: {}, //回复所需要的信息
			}
		},
		mounted() {
			this.getComment()
		},
		
		methods: {
			// 获取评论
			async getComment() {
				const {
					data
				} = await this.$u.api.findComment({
					goodsId: this.tranId,
					num: this.limitNum //返回的数据
				})
				this.commentList = data.msg
			},
			// 发布评论
			async publish() {
				const {
					data
				} = await this.$u.api.createComment({
					openId: this.vuex_user.openId,
					goodsId: this.tranId,
					commentId: Date.now(), //这条评论的Id
					nickName: this.vuex_user.nickName,
					avatarUrl: this.vuex_user.avatarUrl,
					authorId: this.tranAuthorId,
					goodsTitle: this.tranGoodsTitle,
					commentContent: this.createComment
				})
				if (data.code == 200) {
					this.commentList.unshift(data.res)
					this.$u.toast(data.msg)
					this.createComment = ''

				} else {
					this.$u.toast('发布评论失败')
					this.createComment = ''
				}
				
			},

			// 回复评论
			async reply() {
				const {
					data
				} = await this.$u.api.replyComment({
					commentId: this.option.commentId, //回复那条评论的Id
					replyId: this.option.openId, //被回复者的Id
					replyCommentId: Date.now(), //这条回复评论的Id
					nickName: this.vuex_user.nickName,
					avatarUrl: this.vuex_user.avatarUrl,
					childComment: this.replyComment,
					createTime: Date.now()
				})
				if (data.code == 200) {
					// 为回复添加数据
					this.commentList.some((item,index)=>{
						if(item.openId ===  data.res.replyId){
							item.childComment.push(data.res)
							return true
						}
					})
					this.$u.toast(data.msg)
					this.replyComment = ''
				} else {
					this.$u.toast('回复失败')
					this.replyComment = ''
				}
			},


			// 显示回复弹窗
			showPop(option) {
				this.option = option
				uni.onKeyboardHeightChange(res => {
					console.log(res.height)
					this.popHeight = res.height + 60
				})
				this.isShowPop = true
			}



		}


	};
</script>

<style lang="less" scoped>
	.comment-box {
		.create-comment {
			display: flex;
			align-items: center;
			margin-top: 20rpx;

			u-input {
				margin-left: 20rpx;
				width: 70vw;

			}
		}

		.comment {
			margin-top: 30rpx;
			position: relative;

			// 头像
			.avater {
				display: flex;
				align-items: top;

				.name-top {
					display: flex;
					color: #acacac;
					margin-left: 20rpx;

					.create-time {
						font-size: 12px;
						line-height: 30rpx;
						padding-left: 15rpx;
					}
				}
			}

			// 内容区
			.content-box {
				width: 80vw;
				padding: 0 0 0 80rpx;
				margin-top: -20rpx;
				font-size: 13px;

				// 回复区
				.reply-box {
					margin-top: 20rpx;
					position: relative;

					// 回复内容区
					.reply-content {
						width: 70vw;
						position: absolute;
						top: 45rpx;
						left: 90rpx;
						font-size: 13px;
					}
				}

			}

		}

		.replyPop {
			display: flex;
			flex-direction: row;

			.replyInput {
				width: 85vw;
			}
		}


	}
</style>
