<template>
	<view class="container">
		<view class="content-article-detail">   <!-- :style="{display:display}" -->
			<view class="entry-title">{{detail.title.rendered}}</view>
			<view class="entry-date">		
	            <image src="../../../static/img/index/calendar.png" style="height:24upx;width:24upx;"></image>
				<text class="entry-date-text">{{detail.date_to_show}}</text>
				<block ><!-- v-if="detail.category_name != null" -->
					<image src="../../../static/img/index/category.png" style="height:24upx;width:24upx;margin-left: 20upx;"></image>
					<text class="entry-icon-text">{{detail.category_name}}</text>
				</block>
				<image src="../../../static/img/index/comments.png" style="height:24upx;width:24upx;margin-left: 20upx;"></image>
				<text class="entry-icon-text">{{detail.total_comments}}</text>
				<image src="../../../static/img/index/pageviews.png" style="height:24upx;width:24upx;margin-left: 20upx;"></image>
				<text class="entry-icon-text">{{detail.pageviews}}</text>
				<image src="../../../static/img/index/home-like.png" style="height:24upx;width:24upx;margin-left: 20upx;"></image>
				<text class="entry-icon-text">{{detail.like_count}}</text>
	        </view>
				
			<view class="entry-summary">
				<u-parse :content="detail.content.rendered" @preview="clickPreview" @navigate="toNavigate" />
			</view>
		</view>
		
		<!--  上一篇，下一篇  -->
		<view class="pagination">
			<view v-if="detail.previous_post_id" class="nav-previous">
				<navigator :url="'../index/detail?id='+detail.previous_post_id" open-type="redirect" hover-class="relatedNavigator">←{{detail.previous_post_title}}</navigator>
			</view>
			<view v-if="detail.next_post_id" class="nav-next">
				<navigator :url="'../index/detail?id='+detail.next_post_id" open-type="redirect" hover-class="relatedNavigator">{{detail.next_post_title}}→</navigator>
			</view>
		</view>
		
		<!-- 猜你喜欢 -->
		<view class="relatedPost" :style="{display:display}"><!--  -->
			<view class="relatedTitle">猜你喜欢</view>
			<view class="entry-gap-like"></view>
			<view class="relatedText">
				<block v-for="(postList1, index)  in postList" :key="index">
					<navigator :url="'../index/detail?id='+postList1.id" open-type="redirect" hover-class="relatedNavigator">{{index+1}}.{{postList1.title.rendered}}</navigator>
				</block>
			</view>
		</view>
	
		<!-- 点赞 -->
		<view class="likePost" :style="{display:displayLike}"> <!--  -->
			<view class="relatedTitle">点 赞</view>
			<view class="entry-gap-zan"></view>
			<view class="likeTitle">
				<label v-if="detail.like_count">{{detail.like_count}}人已赞</label>
				<label v-else>0人已赞</label>
			</view>
	
			<view class="likeTitle-img">
				<image src="../../../static/img/index/home-like.png" class="img-like" id="liketop" @catchtap="clickLike"></image>
			</view>
			<view class="likeText">
				<block v-for="(likeList1,index2) in likeList" :key="index2">
					<image :src="likeList1" class="gravatarLikeImg"></image>
				</block>
			</view>
		</view>
		
		<!-- 评论 -->		
		<view style="margin-bottom: 50upx;" v-if="wp_enable_comment_option == 1">
            <view class="relatedTitle">评论交流</view>
            <view class="entry-gap-like"></view>
            <view class="commentheader">有{{detail.total_comments}}条评论</view>

            <block  v-for="(item, index) in commentsList" :key="index">
                <view v-if="item.parent == 0">
                    <view class="comment">
                        <view class="comment-user">
                            <image :src="item.author_url" class="gravatarImg"></image>
                            <view style='display:flex;flex-direction: row; justify-content: space-between;width: 100%'>
                                <view style='font-weight:bold;'>{{item.author_name}}</view>
                                <view>{{item.date}}</view>
                            </view>
                        </view>
                        <view class="comment-summary" v-html="item.content.rendered"></view>
                    </view>
                </view>
            </block>
			
			<view :style="{display:display}">
			    <view>
			        <view class="no-more">---无更多评论---</view>
			    </view>
			</view>
		</view>
		
        <view class="canvas-box">
            <canvas style="width: 600px;height: 1290px;" canvas-id="mycanvas" />
        </view>
        <view class="ditail-copyright">
			{{copyright_text}}
        </view>

		<!-- 评论底部功能块 -->
		<view :style="wp_enable_comment_option == 1?'display:block':'display:none'">
			<view class="menuBackground" @catchtap="hiddenMenubox" :style="menuBackgroup ? 'display:block' : 'display:none'"></view>
			<view><!-- :style="{display:display}" -->
				<view class="comment-fixed">
					<form @submit="formSubmit" report-submit="true">
						<view class="comment-respond">
							<input class="comment-input" maxlength="200" name="inputPostID" :value="detail.id" style="display:none" />
							<view class="comment-box">
								<image src="../../../static/img/detail/entry-home.png" class="img-plus" style="margin-left:20upx;margin-right:20upx" @tap="goHome"></image>
								<input class="comment-input" type='text' confirm-type="send" 
									@focus="onRepleyFocus"
									cursor-spacing="10" maxlength="100" name="inputComment" 
									:value="content" :placeholder="placeholder" :focus="focus" 
									 />
								<button class="comment-button touch-active" formType="submit">发送</button>
								<image src="../../../static/img/detail/plus.png" class="img-plus" @tap="ShowHideMenu" mode=""></image>
							</view>
							
							<!--功能图标-->
							<view class="menu-box" :class="isShow ? 'emoji-move-in' : 'emoji-move-out'+isLoad ? 'no-emoji-move' : ''">
								<view class="iconList">
									<view class="iconLine">
										<view style="width:20%; position: relative; float:left; text-align:center">
											<view>
												<image src="../../../static/img/detail/forwarding.png" class="img-menu"></image>
											</view>
											<view>
												<text>转发</text>
											</view>
											<button class="share-button touch-active" open-type="share"></button>
										</view>
										<view style="width:20%; float:left; text-align:center">
											<view>
												<image src="../../../static/img/detail/poster.png" :data-src001="poster_url" @tap="showPhoto" data-name='5' data-target="Image" class="img-menu"></image>
											</view>
											<view>
												<text>海报</text>
											</view>
										</view>
										<view style="width:20%; float:left; text-align:center">
											<view>
												<image src="../../../static/img/detail/copy.png" class="img-menu" :data-url="detail.link" @tap="copyLink"></image>
											</view>
											<view>
												<text>复制链接</text>
											</view>
										</view>
										<view style="width:20%; float:left; text-align:center">
											<view>
												<image :src="'../../../static/img/detail/'+likeImag" @tap="Islike" id="likebottom" class="img-menu"></image>
											</view>
											<view>
												<text>点赞</text>
											</view>
										</view>
										<view style="width:20%; float:left; ">
											
											<view>
												<image src="../../../static/img/detail/appreciation.png" :data-src001="wp_zanshang_shoukuan_img_url" @tap="showPhoto" data-name='6' data-target="Image" class="img-menu"></image>
											</view>
											<view>
												<text>转载</text>
											</view>
											
											<view class="cu-modal" :class="modalName=='Image'?'show':''">
												<view class="cu-dialog">
													<view class="bg-img">
														<view style="padding: 60upx;">
															<view class="action" @tap="hideModal">
																<!--<image :src="targetName=='6'? wp_zanshang_shoukuan_img_url:poster_url" mode="widthFix"></image>-->
																<image :src="targetSrc" mode="widthFix"></image>
															</view>
														</view>
													</view>
													<view class="cu-bar bg-white">
														<view class="action margin-0 flex-sub text-green solid-left" @tap="hideModal">取消</view>
														<view class="action margin-0 flex-sub  solid-left" @tap="getPhoto">保存</view>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</form>
				</view>
			</view>
		</view>
		<!-- 评论区end -->
	</view>
</template>

<script>
	import uParse from '../../../components/gaoyia-parse/parse.vue';
	var current_post_id;
	var userInfo;
	export default {
		components: {
			uParse
		},
		data() {
			return {
				content:'',
				postID:'',
				toFromId: '',
				formId:'',
				
				commentsList:'',
				result:'',
				
				is_OK:false,
				displayLike: 'none',
				likeList:'',
				parentID: "0",
				placeholder: "评论...",
				userid: "",
				focus: false,
				menuBackgroup: false,
				isShow: false,//控制menubox是否显示
				isLoad: true,//解决menubox执行一次
				page:1,
				per_page:5,
				current_post_id:'',
				detail:'',
				tags:'',
				postList: '',
				display: 'none',
				likeImag: "like.png",
				user_info:'',
				mobile:"",
				modalName:null,
				targetName:null,
				targetSrc:'',
				poster_url:'',
				//popup插件变量
				AlertClass: 0,
				AlertPosition: '',
				
				//网站设置项
				copyright_text:'',
				wp_enable_comment_option:'',
				wp_zanshang_shoukuan_img_url:'',
				wxa_shop_new_name:'',
			}
		},
		
		
		//下拉刷新
		onPullDownRefresh: function () {
			var that = this;
			that.fetchDetailData();

			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1500);
		},
		
		//触底方法
		onReachBottom: function () {  
			var that = this;
			// var that = this;
			if(this.is_OK){
				//that.page = page;
				uni.showToast({
					title: '暂无数据',
					duration: 2000
				});
				return;
			}
			
			that.page++;
			console.log('page',that.page);
			
			that.abotapi.abotRequest({
				url: that.abotapi.globalData.weiduke_server_url + 'openapi/Wordpress/restapi/wp-json/wp/v2/comments',
				method: "get",
				data: {
					per_page: that.per_page,
					orderby: 'date',
					order: 'asc',
					post: that.current_post_id,
					page:that.page,
					sellerid:that.abotapi.globalData.default_sellerid,
				},
				success(res){
					
					
					
					console.log("pinglun_res",res);
					if(res.statusCode == 200 && res.data.length != 0){
						that.is_OK = false;
						that.commentsList = that.commentsList.concat(res.data);
						console.log('超过一页',that.commentsList);
						that.display = 'none';
						var str = that.commentsList;
						
						for(var i=0; i<str.length; i++){
						   str[i].date = str[i].date.replace('T',' ');
						}
						
						that.commentsList = str;
						console.log("commentsList",that.commentsList);

					}else{
						that.display = 'block';
						that.is_OK = true;

						return;
					}
				}
			});
		},

		
		onLoad: function (options) {
			console.log("options",options);
			console.log('rendered====0', this.rendered)
			console.log('placeholder===', this.placeholder);
			
		    console.log('detail onLoad', options);
			this.current_post_id = options.id
			
			var that = this;
			
			this.abotapi.set_option_list_str(this, this.callback_function);
		},
		
		
		//分享文章
		onShareAppMessage: function () {
			return {
		        //title: '关于“' + config.getWebsiteName +'”官方小程序',
		        title: this.detail.title.rendered,
				imageUrl: this.detail.content_first_image,
		        path: '/pages/tabBar/index/detail?id=' + this.detail.id,
		        success: function (res) {
					// 转发成功
					uni.showToast({
						title: '转发成功',
						icon: 'success',
						duration: 2000
					})
		        },
		        fail: function (res) {
					// 转发失败
					uni.showToast({
						title: '转发失败，请重试',
						icon: 'none',
						duration: 2000
					})
		        }
			}
		},

	
		// onShow:function(){
		// 	this.fetchDetailData();
		// },
		
		methods: {
			//获取网站基础信息配置项
			callback_function:function(that, cb_params){
				
				if(!cb_params){
					return;
				}
				
				console.log('cb_params====', cb_params);
				
				if(cb_params.shutdown_website_status == 1){
					//跳转到网站关闭的提示页面
					console.log("???????????");
					uni.reLaunch({
						url:'/pages/shutdown_website/shutdown_website'
					})
					return;
				}
				
				
				//====1、更新界面的颜色
				this.abotapi.getColor();
				
				//====2、其他的设置选项：商品列表风格、头条图标等等
				

				//网站名称
				if (cb_params.wxa_shop_new_name) {
				  
				    this.wxa_shop_new_name = cb_params.wxa_shop_new_name
				  
				}

				
				//是否开启评论
				if (cb_params.wp_enable_comment_option) {
					
					this.wp_enable_comment_option = cb_params.wp_enable_comment_option
					
				}
				
				//网站版权
				if (cb_params.copyright_text) {
					
					this.copyright_text = cb_params.copyright_text
					
				}
				
				
				//赞赏文章图片
				if (cb_params.wp_zanshang_shoukuan_img_url) {
					
					this.wp_zanshang_shoukuan_img_url = cb_params.wp_zanshang_shoukuan_img_url
					
				}
				
				uni.setNavigationBarTitle({
					title:this.wxa_shop_new_name
				})
				
				
				
				this.fetchCommentData();
				this.fetchDetailData();
				
				setTimeout(() => {
					that.getPoster();
				}, 2000);
				
				
			},
			
			
			//获取文章内容
			fetchDetailData: function () {
				var that = this;
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.weiduke_server_url+'openapi/Wordpress/restapi/wp-json/wp/v2/posts/'+that.current_post_id,
				    method: 'get',
				    data:{
				    	sellerid:this.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
				    	
						if(!res.data.code){
							var tyu = '';
							that.detail = res.data;
							that.tags = that.detail.tags.join(',');
							console.log("that.detail",that.detail);
							console.log("that.tags",that.tags);
							console.log("that.detail.title.rendered",that.detail.title.rendered);
							console.log("that.detail.content.rendered",that.detail.content.rendered);
							
							// 调用API从本地缓存中获取阅读记录并记录
							var logs = uni.getStorageSync('usercenters') || [];
										
							console.log('44444444444',logs);
										
							// 过滤重复值
							if (logs.length > 0) {
								logs = logs.filter(function (log) {
									return log[0] !== that.detail.id;
								});
							}
										
							console.log('5555555555555');
										
							// 如果超过指定数量
							if (logs.length > 19) {
								logs.pop();//去除最后一个
							}
							logs.unshift([that.detail.id, that.detail.title.rendered]);
							uni.setStorageSync('usercenters', logs);
							//end 
							
							
							
							if(!that.tags){
								return;
							}else{
								that.display = '';
								that.showLikeImg();
							}
							
						}
				    
				    },
				    fail: function (e) {
						uni.showToast({
							title: '网络异常！',
							duration: 2000
						});
				    },
				});
			},
			
			
			clickPreview:function(src, e) {
			      // do something
			},
			
			
			onRepleyFocus: function (e) {
				var that = this;
				var userInfo = this.abotapi.get_user_info();
				// var getUserid = userInfo.userid;
				
				console.log('onRepleyFocus========>>>>>', userInfo);
				
				if (!userInfo || userInfo.userid == null) {
					uni.showModal({
						title:'提示',
						content: '请先登录',
						showCancel:false,
						success(res){
							var last_url = '/pages/tabBar/index/detail?id='+that.current_post_id;
							that.abotapi.goto_user_login(last_url,'normal');
							return;
						}
					})
				}else{
					if (!that.focus) {
						that.focus = true
					}
				}
				
				
			},


			//文章详情链接跳转
			toNavigate:function(href, e) {
				console.log("href",href);
				var url = href;
				console.log("e",e);
				var var_list = Object();
				this.abotapi.call_h5browser_or_other_goto_url(url, var_list, '');
			      // do something
			},
			
			
			//猜你喜欢文章
			showLikeImg:function(){
				var that = this;
				
				console.log("that.tags22222",that.tags);
				this.abotapi.abotRequest({
				    url:that.abotapi.globalData.weiduke_server_url+'openapi/Wordpress/restapi/wp-json/wp/v2/posts',
				    method: 'get',
				    data:{
						page:1,
						per_page:that.per_page,
						exclude:that.current_post_id,
						tags:that.tags,
				    	sellerid:that.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
				    	console.log("showLikeImg_res",res);
						that.postList = res.data;
				    },
				    fail: function (e) {
						uni.showToast({
							title: '网络异常！',
							duration: 2000
						});
				    },
				});
			},
		
		
			//显示或隐藏功能菜单
			ShowHideMenu: function () {
				this.isShow = !this.isShow;
				this.isLoad = false;
				this.menuBackgroup = !this.false
			},
			//点击非评论区隐藏功能菜单
			hiddenMenubox: function () {
				this.isShow = false;
				this.menuBackgroup = false
			},
			
			//返回首页
			goHome: function () {
				uni.switchTab({
					url: '/pages/tabBar/index/index'
				})
			},
			
			
			//复制链接
			copyLink: function (e) {
				console.log("e==>>",e);
				this.ShowHideMenu();
				uni.setClipboardData({
					data: e.target.dataset.url,
					success: function (res) {
						uni.getClipboardData({
							success: function (res) {
								uni.showToast({
									title: '链接已复制',
									image: '../../../static/img/detail/link.png',
									duration: 2000
								})
							}
						})
					}
				})
			},
			
			
			//文章点赞
			clickLike: function () {
				var that = this;
				var userInfo = this.abotapi.get_user_info();
				// var getUserid = userInfo.userid;
				
				if (!userInfo || userInfo.userid == null) {
					uni.showModal({
						title:'提示',
						content: '请先登录',
						showCancel:false,
						success(res){
							var last_url2 = '/pages/tabBar/index/detail?id='+that.current_post_id;
							
							that.abotapi.goto_user_login(last_url2,'normal');
							
							return;
						}
					})
				}else{
					var userdelite = uni.getStorageSync('userDelite');
					console.log('user???????????',userdelite);
					
					this.abotapi.abotRequest({
					    url:that.abotapi.globalData.weiduke_server_url+'openapi/Wordpress/restapi/wp-json/yanyubao-wp-api/v1/post/like',
					    method: 'post',
					    data:{
							// openid:that.abotapi.get_current_openid(),
							userid:userdelite.userid,
							postid:that.current_post_id,
					    	sellerid:that.abotapi.globalData.default_sellerid,
					    },
						
					    success(res) {
					    	console.log("dianzan_res",res);
							if(res.data.code == 'success'){
								uni.showToast({
									title:'点赞成功',
									icon:'success',
									duration:2000
								})
								that.displayLike = 'block';
							}
					    },
					    fail: function (e) {
							uni.showToast({
								title: '网络异常！',
								duration: 2000
							});
					    },
					});
				}
				
			},
			
			
			//是否点赞
			Islike:function(){
				var that = this;
				var userdelite = uni.getStorageSync('userDelite');
				console.log('user???????????',userdelite);
				
				this.abotapi.abotRequest({
				    url:that.abotapi.globalData.weiduke_server_url+'openapi/Wordpress/restapi/wp-json/yanyubao-wp-api/v1/post/islike',
				    method: 'post',
				    data:{
						userid:userdelite.userid,
						postid:that.current_post_id,
				    	sellerid:that.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
				    	console.log("isdianzan_res",res);
						if(res.data.status == 200){
							uni.showToast({
								title:'已经点过了',
								icon:'success',
								duration:2000
							})
						}else{
							that.clickLike();
						}
				    },
				    fail: function (e) {
						uni.showToast({
							title: '网络异常！',
							duration: 2000
						});
				    },
				});
			},
			
			
			
			//转载文章
			praise:function(Class, Position) {
				this.$nextTick(function() {
					this.AlertClass = Class;
					this.AlertPosition = Position;
					this.$nextTick(function() {
						this.$refs.openAlert.Show();
					});
				});
			},
			
			
			//提交评论
			formSubmit: function (e) {
				var that = this;
				console.log("e22",e);
				that.postID = e.detail.value.inputPostID;
				// var userid = self.userid;
				that.content = e.detail.value.inputComment;
				that.toFromId = e.detail.toFromId;
				that.formId = e.detail.formId;
				if (that.content == '') {
					uni.showToast({
						title: '评论不能为空',
						icon: 'none',
						duration: 2000
					});
					return;
				} else {
					that.setCommon();
				}
			},
			
			
			//重置输入框内容
			setCommon:function(){
				var that = this;
				console.log("userInfo",that.abotapi.get_user_info());
				var userdelite = uni.getStorageSync('userDelite');
				console.log('user???????????',userdelite);
				
				that.abotapi.abotRequest({
					url: that.abotapi.globalData.weiduke_server_url + 'openapi/Wordpress/restapi/wp-json/yanyubao-wp-api/v1/comment/add',
					method: "POST",
					data: {
						author_email: userdelite.email,
						author_name: userdelite.nickname,
						author_url: userdelite.headimgurl,
						company: '来自小程序的评论',
						content: that.content,
						formId:that.formId,
						mobile:userdelite.mobile,
						// openid:userdelite.openid,
						parent:that.parentID,
						post:that.current_post_id,
						userid:userdelite.userid,
						sellerid:that.abotapi.globalData.default_sellerid,
					},
					success(res){
						console.log("delite_res",res);
						if(res.data.code == 'success'){
							that.content = '';
							uni.showToast({
								title: '评论成功',
								icon: 'success',
								duration: 2000
							});
						}else{
							uni.showToast({
								title: '评论失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				});
			},


			//获取评论
			fetchCommentData: function () {
				var that = this;
				if(that.is_OK){

					return;
				}
				that.abotapi.abotRequest({
					url: that.abotapi.globalData.weiduke_server_url + 'openapi/Wordpress/restapi/wp-json/wp/v2/comments',
					method: "get",
					data: {
						per_page: that.per_page,
						orderby: 'date',
						order: 'asc',
						post: that.current_post_id,
						page:1,
						sellerid:that.abotapi.globalData.default_sellerid,
					},
					success(res){
						console.log("pinglun_res",res);
						if(res.statusCode == 200 && res.data.length != 0){
							that.is_OK = false;
							if(that.page == 1){
								that.commentsList = res.data;
								that.display = 'none';
								var str = that.commentsList;
								
								for(var i=0; i<str.length; i++){
								   str[i].date = str[i].date.replace('T',' ');
								}
								
								that.commentsList = str;
								console.log("commentsList",that.commentsList);
							}
							
						}
					}
				});
			},


			//弹出层设置
			showPhoto:function(e) {
				console.log("e111",e);
				this.modalName = e.currentTarget.dataset.target;
				
				this.targetName = e.currentTarget.dataset.name;
				
				this.targetSrc = e.currentTarget.dataset.src001;
			},
			
			//取消模态弹框
			hideModal:function(e) {
				this.modalName = null
				this.targetName = null
				this.targetSrc = '';
			},
			
			
			//保存图片到本地
			getPhoto:function(){
				var that = this;
				uni.downloadFile({
					url: this.abotapi.globalData.weiduke_server_url+ 'openapi/Wordpress/download_file?url='+ encodeURIComponent(that.targetSrc)+'&type=image',
					success: (res) =>{
						console.log('uni.downloadFile======>>>>', res);
						
						//if (res.statusCode === 200){
						if(res.tempFilePath){
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: "保存成功",
										icon: "none"
									});
								},
								fail: function() {
									uni.showToast({
										title: "保存失败，请稍后重试",
										icon: "none"
									});
								}
							});
						}
					}
				})
			},
			
			
			//获取海报
			getPoster:function(){
				var that = this;
				var qrcode_type = 'qrcode';
				
				// #ifdef MP-WEIXIN
				qrcode_type = 'weixin_qrcode';
				// #endif
				
				// #ifdef MP-BAIDU
				qrcode_type = 'baidu_qrcode';
				// #endif
				
				// #ifdef MP-ALIPAY
				qrcode_type = 'alipay_qrcode';
				// #endif
				
				this.abotapi.abotRequest({
					url: this.abotapi.globalData.weiduke_server_url + 'openapi/Wordpress/rest_qrcode_poster',
					method: "get",
					data: {
						postid: this.current_post_id,
						sellerid:this.abotapi.globalData.default_sellerid,
						qrcode_type:qrcode_type
					},
					success(res){
						console.log("Poster_res",res);
						if(res.data.code == 1){
							that.poster_url = res.data.url;
						}
					}
				});
			},
		
		},
	}
</script>

<style>
	
	
	.content-article-detail {
	  border-bottom: 5upx solid #eee;
	  margin-bottom: 50upx;
	}
	
	
	
	.entry-title {
	  font-size: 48upx;
	  line-height: 1.6;
	  font-weight: bold;
	  outline: none;
	  color: #3a4040;
	  margin-bottom: 24upx;
	}
	
	.entry-gap-like {
	  width: 120upx;
	  height: 2px;
	  background-color: #4c4c4c;
	  margin-bottom: 32upx;
	}
	.entry-gap-zan {
	  width: 70upx;
	  height: 2px;
	  background-color: #4c4c4c;
	  margin-bottom: 32upx;
	}
	
	.entry-summary {
	  font-size: 32upx;
	  line-height: 64upx;
	  letter-spacing: 2upx;
	}
	
	.entry-summary image {
	  width: 100% !important;
	}
	
	.entry-summary .wxParse .p {
		line-height: 1.9;
	}
	
	.entry-date {
	  font-size: 24upx;
	  line-height: 1.6;
	  color: #959595;
	  font-weight: normal;
	  outline: none;
	  margin-bottom: 30upx;
	  border-bottom:5upx solid #eee;
	}
	
	.entry-date-text {
	  margin-left: 10upx;
	}
	
	.entry-icon-text {
	  margin-left: 10upx;
	}

	.commentheader {
	  padding: 20upx 0;
	  text-align: left;
	  font-weight: normal;
	  font-size: 28upx;
	  line-height: 40upx;
	  color: #959595;
	}
	
	.comment {
	  background-color: #f5f7f7;
	  padding: 0 24upx;
	  border-radius: 12upx;
	  margin: 12upx 0;
	}

	.comment-user {
	  display: flex;
	  align-items: center;
	  font-size: 28upx;
	  font-weight: normal;
	  outline: none;
	  color: #959595;
	  margin: 10upx 0;
	}
	

	.comment-user image {
	  margin-right: 16upx;
	}

	.comment-summary {
	  color: #4c4c4c;
	  font-size: 28upx;
	  line-height: 1.5;
	  margin-bottom: 10upx;
	  margin-left: 60upx;
	}
	
	.comment-respond {
	  margin-top: 10upx;
	}
	
	.comment-fixed {
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  background-color: #fff;
	  box-shadow: 0 0 10upx rgba(30, 20, 20, 0.1);
	  z-index: 100;
	}
	
	.comment-box {
	  padding: 16upx 4upx;
	  display: flex;
	  justify-content: center;
	  height:90upx;
	}

	.comment-button {
	  width: 160upx;
	  height:60upx;
	  display: flex !important;
	  flex-direction: column;
	  justify-content: center;
	  margin-right: 22upx;
	  border-bottom-left-radius: 0;
	  border-top-left-radius: 0;
	  border-top-right-radius: 10upx !important;
	  border-bottom-right-radius: 10upx !important;
	  text-align: center;
	  padding: 0 10upx !important;
	  font-size: 32upx;
	  background-color: #eee;
	  color: #959595;
	}
	
	.comment-button::after {
	  border: none;
	}

	.comment-input {
	  background-color: #f5f7f7;
	  padding: 4upx 6upx 4upx 20upx;
	  font-size: 28upx;
	  height: 50upx;
	  max-height: 50upx;
	  min-height: 30px;
	  width: 51%;
	  text-align: left;
	  border-bottom-left-radius: 10upx;
	  border-top-left-radius: 10upx;
	  border-top-right-radius: 0;
	  border-bottom-right-radius: 0;
	}

	.gravatarImg {
	  border-radius: 50%;
	  height: 48upx;
	  width: 48upx;
	}
	
	.img-plus {
	  width: 48upx !important;
	  height: 48upx !important;
	  margin-right: 20upx;
	  margin-top: 10upx;
	  background-size: 48upx;
	}
		
	.relatedPost {
	  position: relative;
	  text-align: left;
	  margin: 32upx 0 60upx;
	}
	
	.relatedTitle {
	  text-align: left;
	  font-weight: normal;
	  line-height: 40upx;
	  margin-top: 20upx;
	  margin-bottom: 20upx;
	  font-size: 32upx;
	  color: #4c4c4c !important;
	}
	
	.relatedText {
	  text-align: left;
	  font-weight: normal;
	  font-size: 28upx;
	  line-height: 60upx;
	  color: #4c4c4c !important;
	}
	
	.likePost {
	  position: relative;
	  text-align: left;
	  margin-top: 30upx;
	  margin-bottom: 60upx;
	}
	
	.likeTitle {
	  text-align: left;
	  font-weight: normal;
	  margin-top: 20upx;
	  margin-bottom: 20upx;
	  font-size: 28upx;
	  color: #959595 !important;
	  vertical-align: middle;
	  position: absolute;
	  top: 120upx;
	  left: 0;
	}
	
	.likeTitle-img {
	  position: absolute;
	  top: 120upx;
	  left: 160upx;
	}
	
	.likeText {
	  text-align: left;
	  font-weight: normal;
	  font-size: 26upx;
	  line-height: 30upx;
	  color: #0000fe !important;
	  margin: 140upx 0 20upx;
	}
	
	.img-like {
	  width: 50upx;
	  height: 50upx;
	  display: inline-block;
	  text-align: center;
	  margin-right: 20upx;
	  margin-top: 8upx;
	}
	
	.gravatarLikeImg {
	  margin-top: 8upx;
	  border-radius: 50%;
	  height: 60upx;
	  width: 60upx;
	  margin-right: 20upx;
	}
	
	.relatedNavigator {
	  color: #21759b !important;
	}

	.share-button{
	  opacity: 0; 
	  position:absolute;
	  width: 100%;
	  height: 100%;
	  margin: 0;
	  padding: 0;
	  top:0;
	  left: 0;
	
	}

	.ditail-copyright {
	  font-size: 26upx;
	  line-height: 1.2;
	  font-weight: normal;
	  text-align: center;
	  color: #999;
	  margin-top: 20upx;
	  margin-bottom: 120upx;
	}

	.menu-box {
	  position: relative;
	  height: 160upx;
	  padding: 10upx 0;
	  box-sizing: border-box;
	  margin-bottom: -160upx;
	}
	
	.menuBackground {
	  position: fixed;
	  top: 0;
	  left: 0;
	  bottom: 0;
	  right: 0;
	  background-color: transparent;
	  z-index: 99;
	}
	
	.iconList {
	  text-align: center;
	  border-top: 2upx solid #eee;
	}
	
	.iconLine {
	  margin-top: 20upx;
	}
	
	.iconLine text {
	  font-size: 24upx;
	  text-align: center;
	  color: #959595;
	}
	
	.iconLine view {
	  text-align: center;
	}

	.img-menu {
	  width: 50upx;
	  height: 50upx;
	  display: inline-block;
	  text-align: center;
	}
	
	.emoji-move-in {
	  -webkit-animation: emoji-move-in 0.3s forwards;
	  animation: emoji-move-in 0.3s forwards;
	}
	
	.emoji-move-out {
	  -webkit-animation: emoji-move-out 0.3s forwards;
	  animation: emoji-move-out 0.3s forwards;
	}
	
	.no-emoji-move {
	  -webkit-animation: none;
	  animation: none;
	}
	
	@-webkit-keyframes emoji-move-in {
	  0% {
	    margin-bottom: -160upx;
	  }
	
	  100% {
	    margin-bottom: 0;
	  }
	}
	
	@keyframes emoji-move-in {
	  0% {
	    margin-bottom: -160upx;
	  }
	
	  100% {
	    margin-bottom: 0;
	  }
	}
	
	@-webkit-keyframes emoji-move-out {
	  0% {
	    margin-bottom: 0;
	  }
	
	  100% {
	    margin-bottom: -160upx;
	  }
	}
	
	@keyframes emoji-move-out {
	  0% {
	    margin-bottom: 0;
	  }
	
	  100% {
	    margin-bottom: -160upx;
	  }
	}
	
	.pagination{
		font-weight: normal;
		font-size: 28upx;
		line-height: 60upx;
		color: #4c4c4c !important;
		border-bottom: 2upx solid #eee;
	
	}
	.nav-previous {
	    float: left;
	    width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

	}
	
	.nav-next {
	    float: right;
	    text-align: right;
	    width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	} 
	
	.canvas-box {
	  position: fixed;
	  top: 999999upx;
	  left: 0;
	}
	


</style>
