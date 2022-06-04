<template>
	<view class="container">
		<WpArticleDetail :article_title="article_title"					
					:content_html="index_rich_html_content"
					:content_v_html="article_content_html"
					:content_array_html="article_content_array"
					:attr_list="detail" />
		</WpArticleDetail>
		

		<view class="topic-common-list" style="padding:10rpx;">
			<view v-for="(detail_item, index) in detail.tags_name" 
				:key="index"
				@tap="goto_post_list(index)"
				class="tag_item"
				:style="{backgroundColor:wxa_shop_nav_font_color, border:'solid 1rpx ' + wxa_shop_nav_bg_color, color:wxa_shop_nav_bg_color}">
				{{detail_item}}
			</view>
		</view>
		
		
		
		<!--  上一篇，下一篇  -->
		<view class="pagination" v-if="show_more_article == 1">
			<view v-if="detail.previous_post_id" class="nav-previous">
				<navigator :url="'../wordpress/detail?id='+detail.previous_post_id" open-type="redirect" hover-class="relatedNavigator">←{{detail.previous_post_title}}</navigator>
			</view>
			<view v-if="detail.next_post_id" class="nav-next">
				<navigator :url="'../wordpress/detail?id='+detail.next_post_id" open-type="redirect" hover-class="relatedNavigator">{{detail.next_post_title}}→</navigator>
			</view>
		</view>
		
		
		<view style="display: block; height:50rpx;clear: both;">
			
		</view>
		
		
		<!-- 猜你喜欢 -->
		<view class="relatedPost" v-if="show_more_article == 1"><!--  -->
			<view class="relatedTitle">猜你喜欢</view>
			<view class="entry-gap-like"></view>
			<view class="relatedText">
				<block v-if="related_post_list != null">
					<block v-for="(postList1, index)  in related_post_list" :key="index">
						<navigator :url="'../wordpress/detail?id='+postList1.id" open-type="redirect" hover-class="relatedNavigator">{{index+1}} - {{postList1.title.rendered}}</navigator>
					</block>
				</block>
				<block v-else>
					<view style="text-align: center;">
						<image src="https://yanyubao.tseo.cn/Tpl/static/images/empty_order.png" 
							style="width:200rpx;height:200rpx;" mode="widthFix"></image>
						<view style="color:#555">暂无相关内容</view>
					</view>
					
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
				<image src="static/wp-article-img/home-like.png" class="img-like" id="liketop" @catchtap="clickLike"></image>
			</view>
			<view class="likeText">
				<block v-for="(likeList1,index2) in likeList" :key="index2">
					<image :src="likeList1" class="gravatarLikeImg"></image>
				</block>
			</view>
		</view>
		
		<!-- 评论 -->		
		<view style="margin-bottom: 50rpx;" v-if="wp_enable_comment_option == 1">
            <view class="relatedTitle">评论交流</view>
            <view class="entry-gap-like"></view>
            <view class="commentheader" v-if="detail && detail.total_comments">有{{detail.total_comments}}条评论</view>

            <block v-if="commentsList != null" >
                <block  v-for="(item, index) in commentsList" :key="index">
					<view v-if="item.parent == 0">
						<view class="comment">
							<view class="comment-user">
								<image :src="item.author_url" class="gravatarImg" mode="widthFix"></image>
								<view style='display:flex;flex-direction: row; justify-content: space-between;width: 100%'>
									<view style='font-weight:bold;'>{{item.author_name}}</view>
									<view>{{item.date}}</view>
								</view>
							</view>
							<view class="comment-summary" 
								 v-if="item.content"
								v-html="item.content.rendered">
							</view>
							<!-- 二级评论 -->
							<block  v-for="(item02, index02) in commentsList" :key="index02">
								<view v-if="item02.parent == item.id"  class="comment-summary-02">								
									{{item02.author_name}}回复{{item.author_name}}：
									<view class="comment-summary" style="margin-left: 0;font-size: 26rpx;"
										 v-if="item02.content"
										v-html="item02.content.rendered">
									</view>
								</view>
							</block>
							
						</view>
					</view>
				</block>
            </block>
			<block v-else>
				<view style="text-align: center;">
					<image src="https://yanyubao.tseo.cn/Tpl/static/images/empty_remark.png" 
						style="width:200rpx;height: 200rpx;" mode="widthFix"></image>
					<view style="color:#555">哎呀，还没有评论哦，抢个沙发吧！</view>
				</view>
				
			</block>
			
			<view  style="margin: 50rpx 0rpx 50rpx;" :style="{display:commentsList_display}">
			    <view>
			        <view class="no-more" style="font-size:25rpx;">一篇文章水有多深？到这里清可见底 ~</view>
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
							<input maxlength="200" name="inputPostID" :value="detail.id" style="display:none" />
							<view class="comment-box">
								<image src="static/post_detail/entry-home.png" 
									class="img-plus" 
									style="margin-left:20rpx;margin-right:20rpx" 
									@tap="goHome"></image>
								<input class="comment-input" type='text' confirm-type="send" 
									@focus="onRepleyFocus"
									cursor-spacing="10" maxlength="100" name="inputComment" 
									:value="input_comment_content" 
									:placeholder="placeholder"
									:focus="focus" 
									 />
								<button class="comment-button touch-active" formType="submit">发送</button>
								<image src="static/post_detail/plus.png" class="img-plus" @tap="ShowHideMenu" mode=""></image>
							</view>
							
							<!--功能图标-->
							<view class="menu-box" 
								:class="isShow ? 'emoji-move-in' : 'emoji-move-out' + isLoad ? 'no-emoji-move' : ''"
								:style="menuBackgroup ? 'display:block' : 'display:none'">
								<view class="iconList">
									<view class="iconLine">
										
										
										<view v-if="is_showPhotoModel" @tap="is_showPhotoModel = false" class="show_modal_mask"></view>
										
									
										<view style="width:20%; float:left; text-align:center">
											<view>
												<image src="static/post_detail/poster.png" :data-src001="poster_url" @tap="getPoster()"  class="img-menu" mode="widthFix"></image>
											</view>
											<view>
												<text>海报</text>
											</view>
											
											<view v-if="is_PhotoModel" @tap="is_PhotoModel = false" class="show_modal_mask" ></view>
											<view v-if="is_PhotoModel" class="show_modal_pop">
												<image :src="poster_url" mode="heightFix" style="height: 800rpx;"></image>											
												<view class="baocun" @tap="getPhoto('pirce_poster')">保存</view>
											</view>
											
										</view>
										
										<view style="width:20%; float:left; text-align:center">
											<view>
												<image :src="'static/post_detail/' + icon_favoriteImg"
													@tap="set_my_favorite()"  class="img-menu" mode="widthFix"></image>
											</view>
											<view>
												<text>收藏</text>
											</view>
											
											
										</view>
										
										
										
										
										
										<!--
										<view style="width:20%; float:left; ">
											
											<view>
												<image src="static/post_detail/appreciation.png" :data-src001="wp_zanshang_shoukuan_img_url" @tap="is_showPhotoModel = true"   class="img-menu"></image>
											</view>
											<view>
												<text>转载</text>
											</view>
										
											<view v-if="is_showPhotoModel" class="show_modal_pop">
												
												<image :src="wp_zanshang_shoukuan_img_url" mode="" style="background-color: #FFFFFF;"></image>
																						
												<view class="baocun" @tap="getPhoto('pirce_reprint')">保存</view>
											</view>
											
										</view>
										-->
										
										
										
										
										<!-- #ifdef MP-BAIDU -->
										<view style="width:20%; float:left; text-align:center; display:none;">
											<view>
												<image src="static/post_detail/entry-home.png" class="img-menu" :data-url="detail.link" @tap="goHome()"></image>
											</view>
											<view>
												<text>返回首页</text>
											</view>
										</view>
										<view style="width:20%; float:left; text-align:center">
											<view>
												<image :src="wap_h5_kefu_button_icon" mode="widthFix" class="img-menu" :data-url="detail.link" @tap="call_seller()"></image>
											</view>
											<view>
												<text>客服</text>
											</view>
										</view>
										<!-- #endif -->
										<!-- #ifndef MP-BAIDU -->
										<view style="width:20%; float:left; text-align:center">
											<view>
												<image src="static/post_detail/copy.png" class="img-menu" :data-url="detail.link" @tap="copyLink"></image>
											</view>
											<view>
												<text>复制链接</text>
											</view>
										</view>
										<!-- #endif -->
										
										
										
										
										
										
										
										<view style="width:20%; float:left; text-align:center">
											<view>
												<image :src="'static/post_detail/' + icon_likeImg" @tap="set_my_like" id="likebottom" class="img-menu"></image>
											</view>
											<view>
												<text>点赞</text>
											</view>
										</view>
										
										<view style="width:20%; position: relative; float:left; text-align:center">
											<view>
												<image src="static/post_detail/forwarding.png" class="img-menu"></image>
											</view>
											<view>
												<text>分享</text>
											</view>
											<button class="share-button touch-active" open-type="share"></button>
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
	
	// #ifdef MP-ALIPAY
		import parseHtml from "../../common/html-parser.js"
	// #endif	

	import WpArticleDetail from '../../components/wp-article-detail.vue'
	
	
	var current_post_id;
	var userInfo;
	
	export default {
		
		components: {
			WpArticleDetail
			
		},
		data() {
			return {
				article_title:'',
				
				//v-html使用
				article_content_html:'',				
				//rich-text使用
				article_content_array:null,
				//uparse使用
				index_rich_html_content:'<h1></h1>',
				
				postID:'',
				toFromId: '',
				formId:'',
				
				//根据tag读取相关文章列表的时候，单次返回的数量
				per_page: 10, 
				
				commentsList: null,
				commentsList_display: 'none',
				commentsList_is_load_all_ok:false,
				commentsList_is_loading:false,
				comment_current_page:1,
				comment_per_page:10,
				
				result:'',
				
				input_comment_content:'',
				
				
				
				
				displayLike: 'none',
				likeList:'',
				parentID: "0",
				placeholder: "评论...",
				userid: "",
				focus: false,
				menuBackgroup: false,
				
				isShow: false,//控制menubox是否显示
				isLoad: true,//解决menubox执行一次
				
				
				
				current_post_id:'',
				detail:[],
				
				tags:'',
				related_post_list: null,
				
				
				icon_likeImg : "like.png",
				icon_favoriteImg : 'favorite.png',
				
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
				
				show_more_article:1,
				
				wxa_shop_nav_bg_color: '',
				wxa_shop_nav_font_color: '',
				
				//模态框
				is_PhotoModel:false,
				is_showPhotoModel:false,
				
				wap_h5_kefu_button_icon:'',
				wap_h5_kefu_mobile_num:''
			}
		},
		
		onLoad: function (options) {
			//console.log("options",options);
			//console.log('rendered====0', this.rendered)
			//console.log('placeholder===', this.placeholder);
			
		    console.log('detail onLoad options ===>>> ', options);
			this.current_post_id = options.id
			
			if(options.one_article && (options.one_article == 1)){
				this.show_more_article = 0;
			}
			
			var that = this;
			
			this.detail['total_comments'] = 0;
			
			console.log('====>>>>>>', this.detail);
			
			this.abotapi.set_option_list_str(this, this.callback_function);
		},
		// onShow:function(){
		// 	this.fetchDetailData();
		// },
		
		
	
		
		
		//下拉刷新
		onPullDownRefresh: function () {
			var that = this;
			
			uni.removeStorage({
				key: 'wordpress_detail_data_' + that.current_post_id,
				success: (res) => {
					
					uni.stopPullDownRefresh();  //停止下拉刷新动画
					
					that.fetchDetailData();
				}
			});
			

			setTimeout(function () {
				
			}, 1500);
		},
		
		//触底方法
		onReachBottom: function () {  
			this.fetchCommentData();
		},
	 	
		//分享文章
		onShareAppMessage: function () {
			return {
		        //title: '关于“' + config.getWebsiteName +'”官方小程序',
		        title: this.detail.title.rendered,
				imageUrl: this.detail.content_first_image,
		        path: '/pages/wordpress/detail?id=' + this.detail.id,
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
		
		onShareTimeline: function () {
			return this.share_return();
		},
		onAddToFavorites: function () {
			return this.share_return();
		},
		

	
		
		methods: {
			share_return: function() {
				
				var share_title = this.detail.title.rendered;
	
				var imageUrl = this.detail.content_first_image;				
				
				var share_path = 'id=' + this.detail.id;
								
				return {
					title: share_title,
					query: share_path,
					imageUrl: imageUrl,
				}
			},
			
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
				that.abotapi.getColor();
				
				that.wxa_shop_nav_bg_color  = cb_params.wxa_shop_nav_bg_color;
				that.wxa_shop_nav_font_color  = cb_params.wxa_shop_nav_font_color;
				
				
				//====2、其他的设置选项：商品列表风格、头条图标等等
				
				//客服按钮图标
				if (cb_params.wap_h5_kefu_button_icon) {
					
					that.wap_h5_kefu_button_icon = cb_params.wap_h5_kefu_button_icon
					
				}
				that.wap_h5_kefu_button_icon = 'https://yanyubao.tseo.cn/Tpl/static/images/kefu_icon/kefu04.png';
				
				console.log('cb_params.wap_h5_kefu_button_icon ===>>> ' + cb_params.wap_h5_kefu_button_icon);
				
				//客服电话
				if (cb_params.wap_h5_kefu_mobile_num) {
					
					that.wap_h5_kefu_mobile_num = cb_params.wap_h5_kefu_mobile_num
					
				}
				

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
				console.log('wp_zanshang_shoukuan_img_url',this.wp_zanshang_shoukuan_img_url)
				uni.setNavigationBarTitle({
					title:this.wxa_shop_new_name
				})
				
				
				
				
				this.fetchDetailData();
				this.fetchCommentData();
				
				this.__check_my_favortie('favorite', 'check', (response_data)=>{
					if(response_data.code == 1){
						this.icon_favoriteImg = 'favorite-on.png';
					}
					else{
						this.icon_favoriteImg = 'favorite.png';
					}
				})
				
				
				this.__check_my_favortie('like', 'check', (response_data)=>{
					if(response_data.code == 1){
						this.icon_likeImg = 'like-on.png';
					}
					else{
						this.icon_likeImg = 'like.png';
					}
				})
				
				
				
				/*
				setTimeout(() => {
					that.getPoster();
				}, 2000);
				*/
				
			},
			
			
			__handle_detail_data:function(detail_data){
				var that = this;
				
				var tyu = '';
				
				that.detail = detail_data;
				console.log('detail_data00000000000000000000000000000',that.detail)
				that.tags = that.detail.tags.join(',');
				console.log("that.detail",that.detail);
				console.log("that.tags",that.tags);
				
				if(!that.detail.title){
					return;
				}
				
				if(that.detail.title.rendered){
					that.detail.title.rendered.replace(/&#8211;/g, '——');
				}
				
				that.article_title = that.detail.title.rendered;
				
				//设置页面的标题以便更好的SEO
				var new_title = that.article_title;
				
				//标题只保留9个字符
				if(new_title && (new_title.length > 9)){
					//new_title = new_title.substring(0, 9);
					new_title = that.abotapi.globalData.wxa_website_name;
				}
				
				uni.setNavigationBarTitle({
					title: new_title
				})
				
				/* uni.setStorageSync('mykeymas',JSON.stringify(this.msg)) */
				
				/* if (wx.getStorageSync("cache_options")) {
				commentsList = JSON.parse(wx.getStorageSync("cache_options"));
				}
				 */
				
				
				//uparse使用
				that.index_rich_html_content = that.detail.content.rendered;
				
				
				//v-html使用
				that.article_content_html = that.detail.content.rendered;
				
				//console.log('that.article_content_html====>>>>111', that.article_content_html);
				
				const filter = that.$options.filters["formatRichText"];
				that.article_content_html = filter(that.article_content_html);
				
				//console.log('that.article_content_html====>>>>', that.article_content_html);


				//设置百度小程序中的页面SEO信息
	// #ifdef MP-BAIDU				
				//2021.7.22. 删除所有的超链接和对应的超链文本
				that.index_rich_html_content = that.index_rich_html_content.replace(/(<\/?a.*?>)[^>]*<\/a>/g, '');
				
	// #endif	

				
	// #ifdef MP-ALIPAY 
				
				
				
				let data001 = that.article_content_html;
				let newArr = [];
				let arr = parseHtml(data001);
				arr.forEach((item, index)=>{
					newArr.push(item);
				});
				
				//console.log('arr arr arr====>>>>', arr);
				//console.log('newArr newArr newArr====>>>>', newArr);
				
				//rich-text使用
				that.article_content_array = newArr;

	// #endif						
				
				
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
				
			},
			
			//获取文章内容
			fetchDetailData: function () {
				
				var that = this;
				
				var detail_data = uni.getStorageSync('wordpress_detail_data_' + that.current_post_id)
				
				if(detail_data){
					that.__handle_detail_data(detail_data);
					
					return;
				}
				
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/posts/'+that.current_post_id,
				    method: 'get',
				    data:{
				    	sellerid:this.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
				    	
						if(res.data.code){
							return;
						}
						
						uni.setStorage({
							key: 'wordpress_detail_data_' + that.current_post_id,
							data: res.data
						})
						
						//设置that变量
						that.__handle_detail_data(res.data);
						
						
						//设置百度小程序中的页面SEO信息
						// #ifdef MP-BAIDU
								swan.setPageInfo({
									title: that.article_title,
									keywords: that.detail.seo_keywords,
									description: that.detail.seo_description,
									articleTitle: that.detail.mp_baidu_seo_articleTitle,
									releaseDate: that.detail.mp_baidu_seo_releaseDate,
									image: that.detail.mp_baidu_seo_image,
									video: that.detail.mp_baidu_seo_video,
									visit: {},
									likes: '75',
									comments: '13',
									collects: '23',
									shares: '8',
									followers: '35',
									success: res => {
										console.log('setPageInfo success');
									},
									fail: err => {
										console.log('setPageInfo fail', err);
									}
								});
								
								//2021.7.22. 删除所有的超链接和对应的超链文本
								that.index_rich_html_content = that.index_rich_html_content.replace(/(<\/?a.*?>)[^>]*<\/a>/g, '');
								
						// #endif	
				    
				    },
				    fail: function (e) {
						uni.showToast({
							title: '网络异常！',
							duration: 2000
						});
				    },
				});
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
							var last_url = '/pages/wordpress/detail?id='+that.current_post_id;
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
			toNavigate1111:function(href, e) {
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
				    url:that.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/posts',
				    method: 'get',
				    data:{
						page:1,
						per_page:that.per_page,
						exclude:that.current_post_id,
						tags:that.tags,
				    	sellerid:that.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
				    	console.log("showLikeImg 猜你喜欢的内容 ==>> ",  res);
						
						if(res && res.data && (res.data.length > 0) ){
							that.related_post_list = res.data;
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
		
		
			//显示或隐藏功能菜单
			ShowHideMenu: function () {
				this.isShow = !this.isShow;
				this.isLoad = false;
				
				this.menuBackgroup = !this.menuBackgroup;
			},
			//点击非评论区隐藏功能菜单
			hiddenMenubox: function () {
				this.isShow = false;
				
				this.menuBackgroup = false
			},
			
			//返回首页
			goHome: function () {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			
			
			//复制链接
			copyLink: function (e) {
				console.log("e==>>",e);
				console.log("e==>>",e.target.dataset.url);
				
				
				// #ifdef MP-BAIDU
					//return;
				// #endif
				
				
				this.ShowHideMenu();
				
				
				uni.setClipboardData({
					data: e.target.dataset.url,
					success: function (res) {
						uni.getClipboardData({
							success: function (res) {
								uni.showToast({
									title: '链接已复制',
									image: 'static/post_detail/link.png',
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
				
				console.log('click like ===>>>', userInfo);
				
				if (!userInfo || userInfo.userid == null) {
					uni.showModal({
						title:'提示',
						content: '请先登录',
						showCancel:false,
						success(res){
							var last_url2 = '/pages/wordpress/detail?id='+that.current_post_id;
							
							that.abotapi.goto_user_login(last_url2,'normal');
							
							return;
						}
					})
					
					return;
				}
				
				//开始点赞
				var userDetail = that.abotapi.get_user_account_info();
				
				console.log('user???????????',userDetail);
				
				this.abotapi.abotRequest({
				    url:that.abotapi.globalData.wordpress_rest_api_url + '/wp-json/yanyubao-wp-api/v1/post/like',
				    method: 'post',
				    data:{
						// openid:that.abotapi.get_current_openid(),
						userid:userDetail.userid,
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
							that.icon_likeImg = 'like-on.png';
							
							
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
			
			
			//是否点赞 
			//2021.10.29 这个函数不再使用，用  set_my_like
			Islike:function(){
				var that = this;
				
				var userInfo = this.abotapi.get_user_info();
				// var getUserid = userInfo.userid;
				
				console.log('click like ===>>>', userInfo);
				
				if (!userInfo || userInfo.userid == null) {
					uni.showModal({
						title:'提示',
						content: '请先登录',
						showCancel:false,
						success(res){
							var last_url2 = '/pages/wordpress/detail?id='+that.current_post_id;
							
							that.abotapi.goto_user_login(last_url2,'normal');
							
							return;
						}
					})
					
					return;
				}
				
				var userDetail = that.abotapi.get_user_account_info();
				
				console.log('user???????????', userDetail);
				
				this.abotapi.abotRequest({
				    url:that.abotapi.globalData.wordpress_rest_api_url + '/wp-json/yanyubao-wp-api/v1/post/islike',
				    method: 'post',
				    data:{
						userid:userDetail.userid,
						postid:that.current_post_id,
				    	sellerid:that.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
				    	console.log("isdianzan_res ===>>>", res);
						
						if(res.data.status == 200){
							uni.showToast({
								title:'已经点过了',
								icon:'success',
								duration:2000
							})
							
							that.icon_likeImg = 'like-on.png';
							
						}
						else{
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
				
				//that.input_comment_content = 'sss';				
				//return;
				
				/*that.input_comment_content = ' dd';				
				that.commentsList_is_load_all_ok = false;
				that.commentsList_is_loading = false;
				that.comment_current_page = 1;
				that.fetchCommentData();
				return;
				*/
				
				that.postID = e.detail.value.inputPostID;
				// var userid = self.userid;
				var comment_content = e.detail.value.inputComment;
				that.toFromId = e.detail.toFromId;
				that.formId = e.detail.formId;
				if (comment_content == '') {
					uni.showToast({
						title: '评论不能为空',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				
				console.log("userInfo",that.abotapi.get_user_info());
				
				var userDetail = that.abotapi.get_user_account_info();
				
				console.log('user???????????',userDetail);
				
				if(!userDetail){
					return;
				}
				
				that.abotapi.abotRequest({
					url: that.abotapi.globalData.wordpress_rest_api_url + '/wp-json/yanyubao-wp-api/v1/comment/add',
					method: "POST",
					data: {
						author_email: userDetail.email,
						author_name: userDetail.nickname,
						author_url: userDetail.headimgurl,
						
						company: '来自小程序的评论',
						
						content: comment_content,
						formId:that.formId,
						mobile:userDetail.mobile,
						// openid:userDetail.openid,
						parent:that.parentID,
						post:that.current_post_id,
						userid:userDetail.userid,
						sellerid:that.abotapi.globalData.default_sellerid,
						
					},
					success(res){
						console.log("delite_res==>>>", res);
						
						if(res.data.code == 'success'){
							
							//如果设置 ''，前端没有变化，所以只能设置为 ' '，加了一个空格。
							
							that.input_comment_content = ' ';		

							//刷新评论列表
							that.commentsList_is_load_all_ok = false;							
							that.commentsList_is_loading = false;
							that.comment_current_page = 1;
							that.commentsList = null;
							that.fetchCommentData();
							
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
				
				if(that.commentsList_is_load_all_ok){
					//that.page = page;
					
					/*
					uni.showToast({
						title: '到底啦~',
						duration: 2000
					});*/
					return;
				}
				
				if(that.commentsList_is_loading){
					return;
				}
				
				//判断ajax是否正在请求过程中的开关
				that.commentsList_is_loading = true;
				
				console.log('comment_current_page===>>>当前请求的页码：', that.comment_current_page);
				
				that.abotapi.abotRequest({
					url: that.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/comments',
					method: "get",
					data: {
						per_page: that.comment_per_page,
						orderby: 'date',
						order: 'desc',
						post: that.current_post_id,
						page:that.comment_current_page,
						sellerid:that.abotapi.globalData.default_sellerid,
					},
					success(res){
						
						console.log("获取评论数据 ====>>>> ", res);
						
						if(res.statusCode == 200 && res.data.length > 0){
							
							that.commentsList_is_loading = false;
							
							if(that.commentsList){
								that.commentsList = that.commentsList.concat(res.data);
							}
							else{
								that.commentsList = res.data;
							}
							
							
							that.comment_current_page ++;
							
							console.log('comment_current_page===>>>下一次请求的页码：', that.comment_current_page);
							
							console.log("commentsList ===>>> ", that.commentsList);
							for(var i=0; i<that.commentsList.length; i++){
							   that.commentsList[i].date = that.commentsList[i].date.replace('T',' ');
							}
							
							console.log("commentsList ===>>> ", that.commentsList);
							
							that.commentsList_is_load_all_ok = false;
							that.commentsList_display = 'none';
							
							
							
				
						}
						else{
							that.commentsList_display = 'block';
							that.commentsList_is_load_all_ok = true;
				
							
						}
						
						console.log("当前评论====>>>>", that.commentsList);
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
			hideRichTextModal:function(e) {
				this.modalName = null
				this.targetName = null
				this.targetSrc = '';
			},
			
			
			//保存图片到本地
			getPhoto:function(data_type='pirce_poster'){
				var that = this;
				
				if (data_type == 'pirce_reprint' ){
					var new_url = this.abotapi.globalData.weiduke_server_url + '/openapi/Wordpress/download_file?url='+ encodeURIComponent(that.wp_zanshang_shoukuan_img_url)+'&type=image';
					
				}
				if (data_type == 'pirce_poster' ){
					var new_url = this.abotapi.globalData.weiduke_server_url + '/openapi/Wordpress/download_file?url='+ encodeURIComponent(that.poster_url)+'&type=image';
					
				}
				
				uni.downloadFile({
					url:new_url,
			
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
					url: this.abotapi.globalData.weiduke_server_url + '/openapi/Wordpress/rest_qrcode_poster',
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
						
						console.log('poster_url2222222===>>>',that.poster_url)
						that.is_PhotoModel = !that.is_PhotoModel;
						
					}
				});
			},
			
			//2021.2.17. 富媒体 链接点击事件
			//富媒体 图片被点击
			index_rich_html_preview_image:function(img_src, e){
				console.log('99999999999>>>>>', img_src);
				console.log('88888888888>>>>>', e);
			},
			
			//富媒体 链接点击事件
			index_rich_html_click_link:function(new_url, e){
				
				console.log('99999999999>>>>>', new_url);
				console.log('88888888888>>>>>', e);
				
				// #ifdef MP-BAIDU
					console.log('index_rich_html_click_link====>>>>>百度小程序不做任何处理');
					return;
				// #endif
				
				this.abotapi.call_h5browser_or_other_goto_url(new_url);
				
				
			},
			
			goto_post_list:function(tag_index){
				
				var tag_id = this.detail.tags[tag_index];
				var tag_name = this.detail.tags_name[tag_index];
				
				console.log("goto_post_list tag ===>>> ", tag_id);
				console.log("goto_post_list tag ===>>> ", tag_name);
				
				var new_url = '/pages/wordpress/list?';
				
				new_url += 'tag_id=' + tag_id + '&tag_name=' + tag_name;
				
				uni.navigateTo({
					url:new_url
				})
			},
			//拨打客服电话
			call_seller: function () {
			    console.log('wap_h5_kefu_mobile_num', this.wap_h5_kefu_mobile_num)
			    uni.makePhoneCall({
					phoneNumber: this.wap_h5_kefu_mobile_num,
			    })
			},
			
			__check_my_favortie(data_type, action, callback_function){
				var that = this;
				
				var userInfo = this.abotapi.get_user_info();
				
				if(!userInfo && (action == 'check')){
					return;
				}
				
				if (!userInfo || userInfo.userid == null) {
					uni.showModal({
						title:'提示',
						content: '请先登录',
						showCancel:false,
						success(res){
							var last_url2 = '/pages/wordpress/detail?id='+that.current_post_id;
							
							that.abotapi.goto_user_login(last_url2,'normal');
							
							return;
						}
					})
					
					return;
				}
				
				var post_url = that.abotapi.globalData.yanyubao_server_url + '/openapi/Wordpress/my_favortie';
				var post_data = {
					sellerid:that.abotapi.get_sellerid(),
					userid:userInfo.userid,
					checkstr:userInfo.checkstr,
					postid:that.current_post_id,
					data_type : data_type,
					action: action
				};
				
				this.abotapi.abotRequest({
				    url: post_url,
				    method: 'post',
				    data: post_data,
					
				    success(res) {
				    	console.log("isdianzan_res ===>>>", res);
						
						typeof callback_function == "function" && callback_function(res.data);
						
					}
				});
				
				
			},
			set_my_favorite:function(){				
				this.__check_my_favortie('favorite', 'add', (response_data)=>{
					uni.showToast({
						title: response_data.msg
					})
					
					if(response_data.code == 1){
						this.icon_favoriteImg = 'favorite-on.png';
					}
					else if(response_data.code == 2){
						this.icon_favoriteImg = 'favorite.png';
					}
				});	
			},
			set_my_like:function(){
				this.__check_my_favortie('like', 'add', (response_data)=>{
					
					uni.showToast({
						title: response_data.msg
					})
					
					if(response_data.code == 1){
						this.icon_likeImg = 'like-on.png';
					}
					else if(response_data.code == 2){
						this.icon_likeImg = 'like.png';
					}
				});				
				
			}
			
			
		
		},
		
		
		
		filters: {
			/**
			 * 处理富文本里的图片宽度自适应
			 * 1.去掉img标签里的style、width、height属性
			 * 2.img标签添加style属性：max-width:100%;height:auto
			 * 3.修改所有style里的width属性为max-width:100%
			 * 4.去掉<br/>标签
			 * @param html
			 * @returns {void|string|*}
			 */
			formatRichText (html) { //控制小程序中图片大小
				let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				
				newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
					return match;
				});
				//newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				
				newContent = newContent.replace(/<p[^>]*>/gi, '<p class="article_content_p_css">');
				
				newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;vertical-align: middle;"');
				//newContent = newContent.replace(/\<img/gi, '<img width="5rem"');
				
				newContent = newContent.replace(/<h2[^>]*>/gi, '<h2 class="content-article-detail_h2">');
				
				newContent = newContent.replace(/<blockquote[^>]*>/gi, '<blockquote class="article_blockquote_css">');
				newContent = newContent.replace(/<pre[^>]*>/gi, '<pre class="article_pre_css">');
				
				//newContent = newContent.replace(/(<\/?a.*?>)|(<\/?span.*?>)/g, '');
				//2021.7.22. 删除所有的超链接和对应的超链文本
				newContent = newContent.replace(/(<\/?a.*?>)[^>]*<\/a>/g, '');
				
				return newContent;
			}	
		},
		
	}
</script>

<style>
	
	
	
	.article_content_p_css{
		margin:40rpx;
		word-wrap: break-word;
		white-space: normal;
		word-break: break-all;
	}
	
	.article_blockquote_css{
		margin:20rpx 0 20rpx 0;
		border-left: 6rpx solid #999;
		padding-left: 10rpx;
		font-size:25rpx;
	}
	
	.article_pre_css {
		white-space:pre;
	}
	
	/* 需要使用CSS穿透，在H5中才会生效。 */
	.entry-summary >>> .content-article-detail_h2 {
		border-left: 10rpx solid #EA6418;
		padding: 10rpx;
		text-indent: 0em;
		font-size: 40rpx;
		margin: 20rpx 0rpx;
	}
	
	
	
	
	.entry-gap-like {
	  width: 120rpx;
	  height: 2px;
	  background-color: #4c4c4c;
	  margin-bottom: 32rpx;
	}
	.entry-gap-zan {
	  width: 70rpx;
	  height: 2px;
	  background-color: #4c4c4c;
	  margin-bottom: 32rpx;
	}
	
	
	
	.entry-summary image {
	  width: 100% !important;
	}
	
	.entry-summary .wxParse .p {
		line-height: 1.9;
	}
	
	
	
	
	


	.commentheader {
	  padding: 20rpx 0;
	  text-align: left;
	  font-weight: normal;
	  font-size: 28rpx;
	  line-height: 40rpx;
	  color: #959595;
	}
	
	.comment {
	  background-color: #f5f7f7;
	  padding: 20rpx 24rpx;
	  border-radius: 12rpx;
	  margin: 12rpx 0;
	}

	.comment-user {
	  display: flex;
	  align-items: center;
	  font-size: 28rpx;
	  font-weight: normal;
	  outline: none;
	  color: #959595;
	  margin: 10rpx 0;
	}
	

	.comment-user image {
	  margin-right: 16rpx;
	}

	.comment-summary {
	  color: #4c4c4c;
	  font-size: 28rpx;
	  line-height: 1.5;
	  margin-bottom: 10rpx;
	  margin-left: 60rpx;
	}
	
	.comment-summary-02{
		margin: 20rpx;
		font-size: 26rpx;
		color: #666;
	}
	
	.comment-respond {
	  margin-top: 10rpx;
	}
	
	.comment-fixed {
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  background-color: #fff;
	  box-shadow: 0 0 10rpx rgba(30, 20, 20, 0.1);
	  z-index: 100;
	}
	
	.comment-box {
	  padding: 16rpx 4rpx;
	  display: flex;
	  justify-content: center;
	  height:90rpx;
	}

	.comment-button {
	  width: 160rpx;
	  height:65rpx;
	  display: flex !important;
	  flex-direction: column;
	  justify-content: center;
	  margin-right: 22rpx;
	  border-bottom-left-radius: 0;
	  border-top-left-radius: 0;
	  border-top-right-radius: 10rpx !important;
	  border-bottom-right-radius: 10rpx !important;
	  text-align: center;
	  padding: 0 10rpx !important;
	  font-size: 32rpx;
	  background-color: #eee;
	  color: #959595;
	}
	
	.comment-button::after {
	  border: none;
	}

	.comment-input {
	  background-color: #f5f7f7;
	  padding: 4rpx 6rpx 4rpx 20rpx;
	  font-size: 28rpx;
	  height: 50rpx;
	  max-height: 50rpx;
	  min-height: 30px;
	  width: 51%;
	  text-align: left;
	  border-bottom-left-radius: 10rpx;
	  border-top-left-radius: 10rpx;
	  border-top-right-radius: 0;
	  border-bottom-right-radius: 0;
	}

	.gravatarImg {
	  border-radius: 50%;
	  height: 48rpx;
	  width: 48rpx;
	}
	
	.img-plus {
	  width: 48rpx !important;
	  height: 48rpx !important;
	  margin-right: 20rpx;
	  margin-top: 10rpx;
	  background-size: 48rpx;
	}
		
	.relatedPost {
	  position: relative;
	  text-align: left;
	  margin: 60rpx 0 60rpx;
	}
	
	.relatedTitle {
	  text-align: left;
	  font-weight: normal;
	  line-height: 40rpx;
	  
	  margin-top: 100rpx;
	  margin-bottom: 20rpx;
	  
	  font-size: 32rpx;
	  
	  color: #4c4c4c !important;
	}
	
	.relatedText {
	  text-align: left;
	  font-weight: normal;
	  font-size: 28rpx;
	  line-height: 60rpx;
	  color: #4c4c4c !important;
	}
	
	.likePost {
	  position: relative;
	  text-align: left;
	  margin-top: 30rpx;
	  margin-bottom: 60rpx;
	}
	
	.likeTitle {
	  text-align: left;
	  font-weight: normal;
	  margin-top: 20rpx;
	  margin-bottom: 20rpx;
	  font-size: 28rpx;
	  color: #959595 !important;
	  vertical-align: middle;
	  position: absolute;
	  top: 120rpx;
	  left: 0;
	}
	
	.likeTitle-img {
	  position: absolute;
	  top: 120rpx;
	  left: 160rpx;
	}
	
	.likeText {
	  text-align: left;
	  font-weight: normal;
	  font-size: 26rpx;
	  line-height: 30rpx;
	  color: #0000fe !important;
	  margin: 140rpx 0 20rpx;
	}
	
	.img-like {
	  width: 50rpx;
	  height: 50rpx;
	  display: inline-block;
	  text-align: center;
	  margin-right: 20rpx;
	  margin-top: 8rpx;
	}
	
	.gravatarLikeImg {
	  margin-top: 8rpx;
	  border-radius: 50%;
	  height: 60rpx;
	  width: 60rpx;
	  margin-right: 20rpx;
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
	  font-size: 26rpx;
	  line-height: 1.2;
	  font-weight: normal;
	  text-align: center;
	  color: #999;
	  margin-top: 20rpx;
	  padding-bottom: 150rpx;
	}

	.menu-box {
	  position: relative;
	  height: 160rpx;
	  padding: 10rpx 0;
	  box-sizing: border-box;
	  margin-bottom: -160rpx;
	  display:none;
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
	  border-top: 2rpx solid #eee;
	}
	
	.iconLine {
	  margin-top: 20rpx;
	}
	
	.iconLine text {
	  font-size: 24rpx;
	  text-align: center;
	  color: #959595;
	}
	
	.iconLine view {
	  text-align: center;
	}

	.img-menu {
	  width: 50rpx;
	  height: 50rpx;
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
	    margin-bottom: -160rpx;
	  }
	
	  100% {
	    margin-bottom: 0;
	  }
	}
	
	@keyframes emoji-move-in {
	  0% {
	    margin-bottom: -160rpx;
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
	    margin-bottom: -160rpx;
	  }
	}
	
	@keyframes emoji-move-out {
	  0% {
	    margin-bottom: 0;
	  }
	
	  100% {
	    margin-bottom: -160rpx;
	  }
	}
	
	.pagination{
		font-weight: normal;
		font-size: 28rpx;
		line-height: 60rpx;
		color: #4c4c4c !important;
		border-bottom: 2rpx solid #eee;
	
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
	  top: 999999rpx;
	  left: 0;
	}
	
	/* 从wordpress中带过来的CSS */
	.size-large {
		max-width: 100%;
	}
	.alignnone {
		max-width: 100%  !important;
	}
	
	
	
	
	/*    2121.10.27    */
	.show_modal_pop{
		position: fixed;
		z-index: 999;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	.show_modal_mask{
		background-color: #000;
		opacity: 0.7;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
	}
	.baocun{
		font-size: 40rpx;
		width: 580rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #1aad19;
		color: #FFFFFF;
		border-radius:50rpx ;
		margin: 0 auto;
	}
	.topic-common-list {
	   padding: 48rpx 0rpx 48rpx 48rpx; 
	   margin: 0 auto;
	   width: 100%;
		float: left;
	}
	.tag_item {
		font-size: 30rpx;
		border-radius: 8rpx;
		background-color:  #ffffff;
		border:solid 1rpx #2d96ff;
		color:#2d96ff;
		display: block;
		float: left;
		margin: 10rpx;
		padding: 10rpx;
		height: 40rpx;
		line-height: 40rpx;
	}
</style>
