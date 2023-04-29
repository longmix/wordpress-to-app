<template>
	<view class="content">
		<!-- 滚动图片 -->
		<view class="index-header">
		    <swiperBanner v-if="roll_picture_list"
		    	:imgUrls="roll_picture_list" 
		    	:border_radius="0"
		    	:swiper_width_percent_value="100"
		    	:show_bottom_shadow="0"
		    	@goto_url="onNavRedirect"></swiperBanner>
			
		</view>
		
		<!-- 图标导航 -->
		<view class="top-Nav">
		    <block v-for="(item2,index2) in index_icon_list" :key="index2">
		        <view class="top-item" @click="onNavRedirect(item2.url)">
		            <view>
		                <image :src="item2.src"></image>
		            </view>
		            <view>
		                <text>{{item2.name}}</text>
		            </view>
		        </view>
		    </block>
		    
		</view>
		<!-- 图标导航end -->
		

		<view class="index-main">
			
			<form @submit="formSubmit" id="search-form" v-if="hidden_search_box_in_front_page != 1">
			    <view class="search-pancel">
			        <input value="" id="search-input" name="input" confirm-type="search" class="search-input" placeholder="搜索你感兴趣的内容..."></input>
			        <button class="search-button" form-type="submit" size="mini" plain="true">
			            <icon type="search" color="#959595" />
			        </button>
			    </view>
			</form>
		</view>
		
		<view class="index-main">
			<view style="width:100%;">
				<block v-for="(function_item, index) in function_images_list"
					:key="index" >
					<view :style="{width: '' + function_item.width_percent+'%', 'float':'left'}" 
						@click="onNavRedirect(function_item.url)">
						<image :src="function_item.image" style="width: 100%;vertical-align: middle;" mode="widthFix"></image>
					</view>
				</block>
			</view>
			
		</view>
			
		<view class="index-main">	
		    
				<!-- 广告图 -->
				<view class="banner" v-for="(tab,index) in pingpu_picture_list" :key="index" @click="onNavRedirect(tab.url)">
					<image :src="tab.image" style="width: 100%;vertical-align: middle;" mode="widthFix"></image>
				</view>
		
		
		       <!--  <view v-for="item in module_icon_list" class="mid-img">
					     <view class="head1">电商</view>
						    <image  class="img-h" :src="item.icon"></image>
							<view class="txt-h">{{item.name}}</view>
				 </view> -->
				 
		   
			<!-- 显示功能模块列表的链接 -->
			<view class="container" v-if="show_yanyubao_module_list == 1">
				<view class="banner" >
					<image :src="yanyubao_module_list_image" 
						style="width: 100%;vertical-align: middle;" 
						mode="widthFix"
						@click="goto_yanyubao_module_list"></image>
				</view>				
			</view>
			
			
			<!-- 加载图文列表 -->
			
			<view class="container">
				<view class="index-container">
					<!-- 文章列表-->
					<fetchList :articleList="fetch_list"
								@redictDetail="redictDetail">
					</fetchList>
			
			        <view class="loadingmore" v-if="is_OK">
			            <view class="no-more">~ 你问我海底有多深 这里就是我的心 ~</view>
			        </view>
					
					<view class="copyright" v-if="is_OK">
						<view>{{copyright_text}}</view>
					</view>
			    </view>
			</view>
			
			
			
			
			
		    
		</view>
		
		
		<abotKefuButton
			:wap_h5_show_kefu_button="wap_h5_show_kefu_button"
			:wap_h5_kefu_bg_no_color_flag="wap_h5_kefu_bg_no_color_flag"
			:wap_h5_kefu_bg_color="wap_h5_kefu_bg_color"
			:wap_h5_kefu_button_icon="wap_h5_kefu_button_icon"
			:wap_h5_kefu_form_url="wap_h5_kefu_form_url"
			@onNavRedirect="onNavRedirect"></abotKefuButton>

	</view>
</template>

<script>
	import fetchList from '../../components/wp-article-list.vue'
	import swiperBanner from '../../components/swiper-banner.vue';
	import abotKefuButton from '../../components/abot-kefu-button.vue';
	
	export default {
		components:{
			fetchList,
			swiperBanner,
			abotKefuButton
		},
		
		data() {
			return {
				roll_picture:'',
				pingpu_picture:'',
				
				roll_picture_list:'',
				pingpu_picture_list:'',
				function_images_list:'',	//功能图片列表（与平铺图片不同，可以定义图片显示在屏幕上的宽度百分比）
				
				per_page:10,
				current_page:1,
				
				fetch_list:'',
				is_OK:false,
				
				is_http_working:false,
				
				wxa_shop_new_name:'',
				aboutus_pageid:'',
				index_icon_list:'',
				navigation_icon:'',
				
				
				wap_h5_kefu_button_type:'',
				wap_h5_kefu_button_icon:'',
				wap_h5_kefu_mobile_num:'',
				wap_h5_kefu_form_url:'',
				
				wap_h5_kefu_bg_color:'',
				wap_h5_kefu_bg_no_color_flag:0,
				
				wap_h5_show_kefu_button:1,
				
				wp_enable_comment_option:'',
				copyright_text:'',
				all_option_list:null,
				
				
				
				
				plugin_flag:'',
				
				hidden_article_list_in_front_page:0,
				hidden_search_box_in_front_page:0,
				
				//显示延誉宝的功能模块
				//module_icon_list:null,
				show_yanyubao_module_list:0,
				yanyubao_module_list_image: 'http://www.abot.cn/wp-content/themes/abotcn/uploads/2019/09/6163a391dbf598b587d0f8aa92c1941d.png',
				
				//隐藏的文章的ID
				hide_post_id_list:null,
				
			}
		},
		
		
		  
		onLoad: function (options) {
			
			console.log('pages/index/index====>>>>', options);
		    
			var that = this;
			
			
			
			uni.getSystemInfo({
			    success: function (res) {
					
					that.windowHeight = res.windowHeight;
					that.windowWidth = res.windowWidth;
					
			    }
			});
			
			uni.showLoading({
				title:'正在加载...',
				fail: function (e) {
					
				},
			})
			
			
			
			setTimeout(function () {
			    uni.hideLoading();
			}, 2000);
			
			
			//=====判断sellerid和parentid Begin=====
			var sellerid = null;
			
			console.log('sellerid 01：' + sellerid);
				
			if (options && options.parentid) {
			  this.abotapi.set_current_parentid(options.parentid);
			}
			else if (options && options.scene) {
			  var parentid_value = decodeURIComponent(options.scene);
				
			  console.log('来自小程序码的推荐者ID：' + parentid_value);
			  if (parentid_value && (parentid_value.indexOf('parentid_') != -1)) {
				parentid_value = parentid_value.replace('parentid_', '');
				
				this.abotapi.set_current_parentid(parentid_value);
			  }
			  else {
				console.log('推荐者ID：' + parentid_value + '不是 parentid_开头的，默认为sellerid的值');
				
				sellerid = options.scene;
				
				console.log('sellerid 0101：' + sellerid);
				
			  }
				
			}
				
			if (options || options != null) {
			  if (options.sellerid) {
				sellerid = options.sellerid;
				console.log('sellerid 02：' + sellerid);
			  }
				
			  if (!sellerid && options.scene) {
				var sellerid_scene = decodeURIComponent(options.scene);
				if (sellerid_scene && sellerid_scene.indexOf('sellerid_') != -1) {
				  sellerid = sellerid_scene.replace('sellerid_', '');
				}
				
				console.log('sellerid 03：' + sellerid);
				
			  }
			}
			
			if (!sellerid) {
			  sellerid = this.abotapi.get_sellerid();
			  console.log('sellerid 04：' + sellerid);
			}
				
			console.log('sellerid 05：' + sellerid);
				
			if (!sellerid) {
			  console.log('!!!!!!缺少商户ID，使用默认的' + this.abotapi.globalData.default_sellerid);
			  sellerid = this.abotapi.globalData.default_sellerid;
			}
				
			if (this.abotapi.globalData.force_sellerid == 1) {
			  sellerid = this.abotapi.globalData.default_sellerid;
			}
				
			console.log('sellerid 06：' + sellerid);
				
			this.abotapi.globalData.default_sellerid = sellerid
			this.abotapi.set_sellerid(sellerid);
			//========  End =======
			
			
			
			that.abotapi.set_option_list_str(that, that.callback_function);
			
			
			uni.setNavigationBarTitle({
				title:that.abotapi.globalData.wxa_website_name
			})
						
			
			//#ifdef MP-BAIDU
			swan.showFavoriteGuide({
			    type: 'tip'
			})
			//#endif
			
		},
		
		
		
		onShow: function (options){
			uni.setStorageSync('openLinkCount', 0);
		
		},
		onReady:function () {
			
		},
		
		
		//下拉刷新
		onPullDownRefresh: function () {
			var that = this;
			
			// #ifndef MP-ALIPAY
			uni.showToast({
				title: '数据更新中……',
				icon:'loading',
			});
			// #endif
			
			// #ifdef MP-ALIPAY
			uni.showToast({
				title: '数据更新中……',
				//icon:'loading', 	//支付宝不支持icon为 loading
				//duration:2000
			});
			// #endif
			
			
			
			that.current_page = 1;
			
			that.fetch_list = null;
			
			
			
			that.abotapi.set_shop_option_data_remove();
			that.abotapi.set_option_list_str(that, that.callback_function);
			
			
			uni.removeStorageSync('wordpress_data_list_str');
			uni.removeStorageSync('module_icon_list_cache');
			
			uni.stopPullDownRefresh();  //停止下拉刷新动画
			
			
			setTimeout(function () {
				uni.hideToast();
			}, 2000);
		},
		  
		  
		//触底方法
		onReachBottom: function () {
			if(this.hidden_article_list_in_front_page == 1){
				return;
			}
			
			console.log('页面触底，自动加载文章列表');
			
			this.__load_post_list();
			
		},
		
		
		
		
		
		//点击分享
		onShareAppMessage: function () {
			//var share_title = '' + config.getWebsiteName + '：一个专注软件开发的小程序！';
			var share_title = '';
			
			console.log('11111111111111111111====>>>', this.all_option_list);
			
			if(this.all_option_list.wxa_share_title){
				share_title = this.all_option_list.wxa_share_title;
			}
			
			var imageUrl = null;
			if(this.all_option_list.wxa_share_img){
				imageUrl = this.all_option_list.wxa_share_img;
			}
			
			return {
				//title: '“' + config.getWebsiteName+'”网站微信小程序,基于WordPress版小程序构建.技术支持：www.watch-life.net',
				title: share_title,
				imageUrl:imageUrl,
				path: '/pages/index/index',
				success: function (res) {
					// 转发成功
				},
				fail: function (res) {
					// 转发失败
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
			__load_post_list:function(){
				
				var that = this;
				
				// var that = this;
				if(this.is_OK){
					that.current_page = -1;
					return;
				}
				
				console.log('加载文章内容，当前页码page：'+ that.current_page);
				
				if(!that.is_http_working){
					that.is_http_working = true;
				}
				
				var post_data = {
						per_page: that.per_page,
						page: that.current_page,
						orderby: 'date',
						order: 'desc',
				    	sellerid: that.abotapi.get_sellerid(),
				    };
					
				if(that.hide_post_id_list){
					post_data.exclude = that.hide_post_id_list.join(',');
				}
				
				that.abotapi.abotRequest({
				    url:that.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/posts',
				    method: 'get',
				    data: post_data,
				    success(res) {
						
						that.is_http_working = false;
				    	
						if(res.data.code){
							that.is_OK = true;
							return;
							
							
							
							
						} 
						
						that.is_OK = false;
						
						//console.log('加载到的文章数据：', res.data)
						
						if(!that.fetch_list){
							that.fetch_list = [];
						}
						
						
						that.fetch_list = that.fetch_list.concat(res.data);
						
						that.current_page ++;
						
						//得到数据后停止下拉刷新
						//uni.stopPullDownRefresh();
						
						
				    },
				    fail: function (e) {
						uni.showToast({
							title: '网络异常！',
							duration: 2000
						});
				    },
				});
				
				
				
			},
			share_return: function() {
				
				var share_title = '';
				
				console.log('11111111111111111111====>>>', this.all_option_list);
				
				if(this.all_option_list.wxa_share_title){
					share_title = this.all_option_list.wxa_share_title;
				}
				
				var imageUrl = null;
				if(this.all_option_list.wxa_share_img){
					imageUrl = this.all_option_list.wxa_share_img;
				}
				
				
				var share_path = 'sellerid=' + this.abotapi.get_sellerid();
								
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
				
				this.all_option_list = cb_params;
				
				
				//====1、更新界面的颜色
				this.abotapi.getColor();
				
				//====2、其他的设置选项：商品列表风格、头条图标等等
				
				
				//网站导航图标返回值
				if (cb_params.navigation_icon) {
				  
				    this.navigation_icon = cb_params.navigation_icon
				  
				}
				
				//网站广告图片位置
				if (cb_params.roll_picture) {
				  
				    this.roll_picture = cb_params.roll_picture
				  
				}
				
				
				//网站名称
				if (cb_params.wxa_shop_new_name) {
				  
				    this.wxa_shop_new_name = cb_params.wxa_shop_new_name
				  
				}
				
				
				//是否存在客服按钮
				if (cb_params.wap_h5_show_kefu_button) {
					
					this.wap_h5_show_kefu_button = parseInt(cb_params.wap_h5_show_kefu_button)
					
				}
				
				//客服按钮背景颜色
				if (cb_params.wap_h5_kefu_bg_color) {
					
					this.wap_h5_kefu_bg_color = cb_params.wap_h5_kefu_bg_color
					
				}
				
				if (cb_params.wap_h5_kefu_bg_no_color_flag) {
					
					this.wap_h5_kefu_bg_no_color_flag = parseInt(cb_params.wap_h5_kefu_bg_no_color_flag)
					
				}
				
				
				//客服按钮类型   1 拨打电话   2 跳转网址
				if (cb_params.wap_h5_kefu_button_type) {
					
					this.wap_h5_kefu_button_type = cb_params.wap_h5_kefu_button_type
					
				}
				
				//客服按钮图标
				if (cb_params.wap_h5_kefu_button_icon) {
					
					this.wap_h5_kefu_button_icon = cb_params.wap_h5_kefu_button_icon
					
				}
				
				//客服电话
				if (cb_params.wap_h5_kefu_mobile_num) {
					
					this.wap_h5_kefu_mobile_num = cb_params.wap_h5_kefu_mobile_num
					
				}
				
				//客服链接
				if (cb_params.wap_h5_kefu_form_url) {
					
					this.wap_h5_kefu_form_url = cb_params.wap_h5_kefu_form_url
					
				}
				
				if(cb_params.hide_post_id_list){
					this.hide_post_id_list = cb_params.hide_post_id_list;
					
					this.abotapi.globalData.hide_post_id_list = cb_params.hide_post_id_list;
				}
				
				//如果是拨打电话
				if(this.wap_h5_kefu_button_type == 1){
					this.wap_h5_kefu_form_url = 'tel:' + this.wap_h5_kefu_mobile_num
				}
				
								
				
				
				//是否开启评论
				if (cb_params.wp_enable_comment_option) {
					
					this.wp_enable_comment_option = cb_params.wp_enable_comment_option
					
				}
				
				//网站版权
				if (cb_params.copyright_text) {
					
					this.copyright_text = cb_params.copyright_text
					
				}
				
				if(cb_params.hidden_article_list_in_front_page){
					this.hidden_article_list_in_front_page = cb_params.hidden_article_list_in_front_page;
				}
				
				if(cb_params.hidden_search_box_in_front_page){
					this.hidden_search_box_in_front_page = cb_params.hidden_search_box_in_front_page;
				}
				
				
				uni.setNavigationBarTitle({
					title:this.wxa_shop_new_name
				})
				
				//需要带配置项参数执行的函数
				if(cb_params.navigation_icon == -1){
					that.index_icon_list = cb_params.navigation_icon_list;
				}
				else{
					that.get_shop_icon_index();
				}
				
				if(cb_params.roll_picture == -1){
					that.roll_picture_list = cb_params.roll_picture_list;
				}
				else{
					that.get_shop_index_images('roll');
				}
				
				if(cb_params.pingpu_picture == -1){
					that.pingpu_picture_list = cb_params.pingpu_picture_list;
				}
				else{
					that.get_shop_index_images('pingpu');
				}
				
				if(cb_params.function_images_list){
					that.function_images_list = cb_params.function_images_list;
				}
				
				
				//定制开发的选项
				// 获取并显示延誉宝的功能图标
				if(cb_params.show_yanyubao_module_list){
					that.show_yanyubao_module_list = cb_params.show_yanyubao_module_list;
				}
				if(cb_params.yanyubao_module_list_image){
					that.yanyubao_module_list_image = cb_params.yanyubao_module_list_image;
				}
				
				
				//设置百度小程序中的页面SEO信息
				// #ifdef MP-BAIDU
					swan.setPageInfo({
						title: cb_params.wxa_share_title,
						keywords: cb_params.wxa_share_keywords,
						description: cb_params.wxa_share_description,
						articleTitle: cb_params.wxa_share_title,
						releaseDate: cb_params.wxa_share_datetime,
						image: [cb_params.wxa_share_img],
						video: [],
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
				// #endif	
							
				
				
				
				
				
				
				
				
				
				//that.fetchPostsData();
				that.__load_post_list();
				
				
			},
			
			

			//首页图标、轮播图及其他h5链接跳转  &&  拨打客服电话
			onNavRedirect:function(url){
				console.log('new url =====>>>>', url);
				
				var var_list = Object();
				this.abotapi.call_h5browser_or_other_goto_url(url, var_list, '');
			},
			
			
			//输入搜索值
			formSubmit: function (e) {
				var url = '/pages/wordpress/list'
				var key ='';
				if (e.currentTarget.id =="search-input"){
					key = e.detail.value;
				} else {
				
					key = e.detail.value.input;
				
				}
				if (key != '') {
					url = url + '?search=' +key;
					uni.navigateTo({
						url: url
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '请输入内容',
						showCancel: false,
					});
				}
			},
			
			
			//首页分类图标
			get_shop_icon_index:function(){
				console.log("11111111");
				var that = this;
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.yanyubao_server_url + '/Yanyubao/ShopApp/get_shop_icon_list',
				    method: 'post',
				    data:{
						icon_type:that.navigation_icon,
				    	sellerid:this.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
				    	var data = res.data;
				    	if(data.code == 1){
				    		that.index_icon_list = data.data;
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
			
			
			//首页广告图片
			get_shop_index_images:function(pic_type){
				console.log("22222");
				var that = this;
				
				var pic_type_id = that.roll_picture;
				if(pic_type == 'pingpu'){
					pic_type_id = that.pingpu_picture;
				}
				
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.yanyubao_server_url+'/Yanyubao/ShopApp/get_shop_ad_image_list',
				    method: 'post',
				    data:{
						ad_type:pic_type_id,
				    	sellerid:this.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
				    	var data = res.data;
				    	if(data.code == 1){
							if(pic_type == 'roll'){
								that.roll_picture_list = data.data;
							}
							else if(pic_type == 'pingpu'){
								that.pingpu_picture_list = data.data;
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
			
			
			// 跳转至查看文章详情
			redictDetail: function (item) {
				 console.log('查看文章');
				var id = item.id;
				
				var url = '/pages/wordpress/detail?id=' + id;
				
				uni.navigateTo({
					url: url
				})
				
				
			},
			
			
			//模态弹窗事件
			block_tanchuang:function(e){
			
				console.log('block_tanchuang=======>>>>>', e);
				
				var plugin_flag = e.currentTarget.dataset.plugin_flag;
				
				if(plugin_flag && (plugin_flag == 1) ){
					var plugin_name = e.currentTarget.dataset.plugin_name;
					var plugin_desc_basic = e.currentTarget.dataset.plugin_desc_basic;
					
					uni.showModal({
						title: plugin_name,
						content: plugin_desc_basic,
						showCancel: false,
						success: function (res) {
							
						}
					});
				}
				
			},
			goto_yanyubao_module_list:function(res){
				console.log('11111111111');
				
				uni.navigateTo({
					url: '../about/module_list',
					fail:function(res){
						console.log(res);
					}
				})
			}
		},
	}
</script>


<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.index-container {
		background-color: #fff;
	}
	
	.index-header {
		text-align: center;
		width: 100%;
		overflow: hidden;
		box-shadow: 0rpx 8rpx 25rpx rgba(0, 0, 0, 0.2);
		position: relative;
		z-index: 1;
	}
	
	.index-main {
		width:100%;
	}
	
	
	.banner {
		width: 100%;
		margin: 0;
		
	}
	
	.banner >>> image {
		border-radius: 0;
	}
	
	.search-button {
	  border-left: 0 !important;
	  border-top: 1rpx solid #fff !important;
	  border-right: 1rpx solid #fff !important;
	  border-bottom: 1rpx solid #fff !important;
	  background-color: #fff !important;
	  border-bottom-left-radius: 0;
	  border-top-left-radius: 0;
	  border-top-right-radius: 8rpx;
	  border-bottom-right-radius: 8rpx;
	  color: #296fd0 !important;
	  width: 20%;
	  margin: 0 !important;
	  box-shadow: 1rpx 1rpx 6px #ecf0f0;
	  height: 83rpx;
	}
	
	.search-button icon {
	  position: absolute;
	  margin: 28rpx 16rpx;
	}
	
	.search-input {
	  background-color: #fff;
	  padding-left: 16rpx;
	  min-height: 28rpx;
	  font-size: 30rpx;
	  border-bottom-left-radius: 8rpx;
	  border-top-left-radius: 8rpx;
	  border-top-right-radius: 0;
	  border-bottom-right-radius: 0;
	  border-right: 0 !important;
	  height: 83rpx;
	  width: 80%;
	  text-align: left;
	  box-shadow: 1rpx 1rpx 6px #ecf0f0;
	}

	.search-pancel {
	  display: flex;
	  flex-direction: row;
	  background-color: #f5f7f7;
	  padding: 24rpx 24rpx;
	  height: 100rpx;
	}
	
	.search-pancel image {
	  width: 50rpx;
	  height: 50rpx;
	  margin-left: 20rpx;
	  vertical-align: middle;
	}
	
	.top-Nav{
		display: flex;
		padding: 25rpx 0;
		background: #fff;
		justify-content:space-around;
		border-bottom: 1rpx solid #eee;
		width: 100%;
	}
	
	.top-item{
		text-align: center;
	}
	.top-item image{
		width: 88rpx;
		height: 88rpx;
	}
	.top-item text{
		line-height: 20rpx;
		font-size: 30rpx;
	}
	
	
	.mid-img{
      width: 100%;
	  overflow: hidden;
	  background-color:white;
	  margin-bottom:20rpx;
	}
	.head1{
		border-left:10rpx solid;
		font-size:40rpx;
		margin-top: 20rpx;
		padding-left: 20rpx;
	}
	.img-h{
		width:100rpx;
		height:100rpx;
		border-radius:20rpx;
		padding: 15rpx;
	}
	.txt-h{
		font-size: 30rpx;
		margin-top: 10rpx;
	}
	.icn-con{
		float: left;
		text-align: center;
		width: 33%;
		margin-top: 40rpx;
		position: relative;
		padding-bottom: 30rpx;
	}
	
	.icn-con .tips{
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 66rpx;
		top: -20rpx;
		z-index: 2;
	}
	
	
</style>
