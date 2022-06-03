<template>
	<view>
		<view class="topic-common-list" :style="{display:isCategoryPage}">
			<view class="topic-list-item" :style="{backgroundColor:wxa_shop_nav_bg_color}">
				<image :src="categoriesImage" class="cover"></image>
				<view class="topic-content-title">
					<block v-if="post_list_option.categoryName">
						<text>分类：</text>
						<text>{{post_list_option.categoryName}}</text>
					</block>
					<text v-else>全部分类</text>
				</view>
				<view class="topic-content-title-line" :style="{borderBottom:'solid 1rpx ' + wxa_shop_nav_font_color}"></view>
				<view class="topic-content-brief" style="width:80%;">
					<text v-if="post_list_option.categoryDescription">
						{{post_list_option.categoryDescription}}</text>
					<text v-else>以下是最近更新的内容</text>
				</view>
			</view>
		</view>


		<view class="topic-common-list" :style="{display:isSearchPage}">
			<view class="topic-list-item">
				<view><image :src="header_bg_img_of_search_list" class="cover"></image></view>
				<view class="topic-content-title">
					<text>搜索：</text>
					<text>{{searchValue}}</text>
				</view>
				<view class="topic-content-title-line" :style="{borderBottom:'solid 1rpx ' + wxa_shop_nav_font_color}"></view>
				<view class="topic-content-brief">
					<text>以下是“{{searchValue}}”相关的内容</text>
				</view>
			</view>
		</view>
		
		<view class="topic-common-list" :style="{display:isTagPage}">
			<view class="topic-list-item">
				<view><image :src="header_bg_img_of_tag_list" class="cover"></image></view>
				<view class="topic-content-title">
					<text>标签：</text>
					<text>{{post_list_option.tag_name}}</text>
				</view>
				<view class="topic-content-title-line" :style="{borderBottom:'solid 1rpx ' + wxa_shop_nav_font_color}"></view>
				<view class="topic-content-brief">
					<text>以下是标签“{{post_list_option.tag_name}}”相关的内容{{post_list_option.tag_name}}{{post_list_option.tag_name}}{{post_list_option.tag_name}}</text>
				</view>
			</view>
		</view>
		
		<view class="topic-common-list" :style="{display:isMyFavoriteList}">
			<view class="topic-list-item">
				<view><image :src="header_bg_img_of_tag_list" class="cover"></image></view>
				<view class="topic-content-title">
					<text>{{MyFavoriteListTitle}}</text>
					<text>{{post_list_option.tag_name}}</text>
				</view>
				<view class="topic-content-title-line" :style="{borderBottom:'solid 1rpx ' + wxa_shop_nav_font_color}"></view>
				<view class="topic-content-brief">
					<text>{{wxa_shop_new_name}}</text>
				</view>
			</view>
		</view>

		<view class="container">
			<view class="showerror" v-if="!fetch_list">
				<image src="static/wp-article-img/smile.png" style="height:100rpx;width:100rpx"></image>

				<view class="errortext">
					列表数据加载中……
					<view class="">
						<button class="more-button" size="mini" @tap="reload_all_list">重新加载</button>
					</view>
				</view>
			</view>
			
			<!-- 文章列表-->
			<fetchList :articleList="fetch_list"
						@redictDetail="redictDetail">
			</fetchList>
					  

			<view class="copyright" v-if="is_OK">
				<view>{{copyright_text}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	//参数
	//var search;
	//var categoryID;
	//var categorySrc;
	//var tag
	
	import fetchList from '../../components/wp-article-list.vue'
	
	
	export default {
		components:{
			fetchList
		},
		
		data() {
			return {
				post_list_option:null,
				
				//页面头部显示的风格
				isCategoryPage:"none",
				isSearchPage:'none',
				isTagPage:'none',
				isMyFavoriteList:'none',
				
				MyFavoriteListTitle:'我的收藏',
				MyFavoriteList_postid_list_str:null,
				
				page: 1,
				per_page:10,
				is_OK:false,
				
				fetch_list:'',
				
				is_http_working:false,

				searchValue:"",
				categoriesId:'',
				
				categoriesImage:null,

				copyright_text:'',
				
				header_bg_img_of_search_list: 'https://yanyubao.tseo.cn/Tpl/static/wordpress/website-search.png',
				header_bg_img_of_tag_list: 'https://yanyubao.tseo.cn/Tpl/static/wordpress/website-search.png',
				
				wxa_shop_new_name:'',
				wxa_shop_nav_bg_color: '',
				wxa_shop_nav_font_color: '',
				
				//随机返回10篇文章，同时排除指定ID
				flag_get_rand_10:false,
				//请求是否完成了（避免请求第二次）
				flag_get_rand_10:false,
				flag_get_rand_exclude_ids:null,
				
			}
		},
		onLoad: function (options) {
			console.log("options",options);
			
			var that = this;
			
			that.post_list_option = options;
			
			
			this.abotapi.set_option_list_str(this, this.callback_function);
			
			
			
			
			
			
			//设置标题
			if(that.post_list_option.categoryName){
				uni.setNavigationBarTitle({
					title:that.post_list_option.categoryName,
				});
			}
			
			//如果指定了分类的图片
			if(that.post_list_option.categorySrc){
				that.categoriesImage = that.post_list_option.categorySrc;
			}
			
			
			
			
			if (that.post_list_option.categoryID && that.post_list_option.categoryID != 0) {
				that.categoriesId = that.post_list_option.categoryID;
				
				that.isCategoryPage = "block"
				
				//that.fetchCategoriesData();
		    }
			else if (that.post_list_option.search && that.post_list_option.search != '') {
				console.log(1111111);
				
				that.isSearchPage = "block";
				that.searchValue = that.post_list_option.search;
				
				uni.setNavigationBarTitle({
					title: "搜索关键字："+that.post_list_option.search,
				});
		    }
			else if(that.post_list_option.categorySlug){
				that.isCategoryPage = "block";
				
				that.categorySlug = that.post_list_option.categorySlug;
				
				
				//根据分类的别名，获取分类的ID，然后再请求
				this.abotapi.abotRequest({
					 url:that.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/categories',
					 method: 'get',
					 data:{
						slug:that.post_list_option.categorySlug,						
					 	sellerid:that.abotapi.globalData.default_sellerid,
					 },
					 success(res) {
						console.log('categories slug ====>>>>', res.data);
						
						if(res.data){
							var cataItem = res.data[0];
							
							console.log('categories slug ====>>>>', cataItem);
							
							that.post_list_option.categoryID = cataItem['id'];
							that.post_list_option.categoryName = cataItem['name'];
							
							that.post_list_option.categoriesImage = cataItem['category_thumbnail_image'];
							
							that.post_list_option.categoryDescription = cataItem['description'];
							
							uni.setNavigationBarTitle({
								title: that.post_list_option.categoryName,
							});
							
							
							that.categoriesId = that.post_list_option.categoryID;							
							that.categoriesImage = that.post_list_option.categoriesImage;							
							//that.isCategoryPage = "block";
							
							
							//设置百度小程序中的页面SEO信息
							// #ifdef MP-BAIDU
								swan.setPageInfo({
									title: that.post_list_option.categoryName,
									keywords: that.post_list_option.categoryName,
									description: that.post_list_option.categoryDescription,
									articleTitle: that.post_list_option.categoryName,
									releaseDate: res.data.mp_baidu_seo_releaseDate,
									image: [that.post_list_option.categoriesImage],
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
			else if(that.post_list_option.tag_id){
				that.isTagPage = 'block';
				
				//#ifdef MP-WEIXIN
					that.post_list_option.tag_id = decodeURIComponent(that.post_list_option.tag_id);
				//#endif
				
				console.log('根据标签获取文章列表：', that.post_list_option.tag_id);
				
			}
			else if(that.post_list_option.action && (that.post_list_option.action == 'my_favorite')){
				that.isMyFavoriteList = 'block';
				that.MyFavoriteListTitle = '我的收藏列表';
				
				console.log('获取我收藏的文章列表。');
				
				this.__check_my_favortie('favorite', 'list', (response_data)=>{
					if(response_data.code == 1){
						that.MyFavoriteList_postid_list_str = response_data.data;
					}
					else{
						that.MyFavoriteList_postid_list_str = '-1';
					}
					
					that.fetchCategoriesData();
					
				})
				
			}
			else if(that.post_list_option.action && (that.post_list_option.action == 'my_like')){
				that.isMyFavoriteList = 'block';
				that.MyFavoriteListTitle = '我的点赞列表';
				
				console.log('获取我点赞的文章列表。');
				
				this.__check_my_favortie('like', 'list', (response_data)=>{
					if(response_data.code == 1){
						that.MyFavoriteList_postid_list_str = response_data.data;
					}
					else{
						that.MyFavoriteList_postid_list_str = '-1';
					}
					
					that.fetchCategoriesData();
					
				})
				
				
				
			}
			else{
				that.isCategoryPage = "block";
			}
			
			
			
			if(!that.categoriesImage){
				that.categoriesImage = 'https://yanyubao.tseo.cn/Tpl/static/wordpress/vip.jpg';
			}
			
			
			
			that.fetchCategoriesData();
			
			
			
		},

		
		
		//下拉刷新
		onPullDownRefresh: function () {
			var that = this;
			
			that.reload_all_list();
			
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1500);

		},
		
		
		//触底方法
		onReachBottom: function () {
			var that = this;
			
			if(this.is_OK){				
				uni.showToast({
					title: '到底啦~',
					duration: 2000
				});
				return;
			}

			that.fetchCategoriesData();
		},	  
		methods:{
			reload_all_list:function(e){
				var that = this;
				
				
				
				that.page = 1;
				that.fetch_list = [];
				
				that.fetchCategoriesData();
				
				
			},
			
			//获取网站基础信息配置项
			callback_function:function(that, option_list){
				
				if(!option_list){
					return;
				}
				
				console.log('option_list====', option_list);
				
				
				//====1、更新界面的颜色
				this.abotapi.getColor();
				
				that.wxa_shop_nav_bg_color  = option_list.wxa_shop_nav_bg_color;
				that.wxa_shop_nav_font_color  = option_list.wxa_shop_nav_font_color;
				
				//====2、其他的设置选项：商品列表风格、头条图标等等
				
				
				//网站名称
				if (option_list.wxa_shop_new_name) {
				  
					 this.wxa_shop_new_name = option_list.wxa_shop_new_name
				  
				}
				
				
				//网站版权
				if (option_list.copyright_text) {
					
					this.copyright_text = option_list.copyright_text
					
				}
				
				
				uni.setNavigationBarTitle({
					title:this.wxa_shop_new_name
				})
				
				//搜索后的文章列表页面头部地图
				if(option_list.header_bg_img_of_search_list && !that.post_list_option.categorySrc){
					that.header_bg_img_of_search_list = option_list.header_bg_img_of_search_list;
				}
				
				//点击标签后的文章列表页面头部地图
				if(option_list.header_bg_img_of_tag_list && !that.post_list_option.categorySrc){
					that.header_bg_img_of_tag_list = option_list.header_bg_img_of_tag_list;
				}
				
				
			},
			
			
			
			formSubmit: function (e) {
			  var url = '/pages/wordpress/list'
			  if (e.detail.value.input != '') {
				url = url + '?search=' + e.detail.value.input;
			  }
			  wx.navigateTo({
				url: url
			  })
			},
			
			
			//获取 分类下的 文章 列表
			fetchCategoriesData: function (id) {
				var that = this;
				
				//如果是  我的收藏 并且 没有设置需要获取的文章ID，则不请求。
				if((that.isMyFavoriteList == 'block') && !that.MyFavoriteList_postid_list_str){
					return;
				}
				
				var post_data = {
						per_page: that.per_page,
						page: that.page,
						orderby: 'date',
						order: 'desc',
						sellerid: that.abotapi.globalData.default_sellerid,
					};
					
				//如果是随机获取10篇
				if(that.flag_get_rand_10 && !that.flag_get_rand_10_ok){
					//获取第一页
					post_data.page = 1;
					//每页10个
					post_data.per_page = 10;
					//exclude 排除指定的ID
					post_data.exclude = that.flag_get_rand_exclude_ids;
					//按照最后修改时间排序
					post_data.orderby = 'modified';
					
					//已经请求了随机的10篇
					that.flag_get_rand_10_ok  = true;
				}
				else{
					
					if(that.categoriesId){
						post_data.categories = that.categoriesId;
					}
					else if(that.categorySlug){
						post_data.category_name = that.categorySlug;
					}
					
					if(that.searchValue){
						post_data.search = that.searchValue;
					}
					
					if(that.post_list_option.tag_id){
						post_data.tags = that.post_list_option.tag_id;
					}
					
					//根据ID获取文章列表
					if(that.isMyFavoriteList && that.MyFavoriteList_postid_list_str){
						post_data.include = that.MyFavoriteList_postid_list_str;
					}
					
				}
				
				
				
				console.log('fetchCategoriesData post_data ===>>>', post_data);
				
				if(!that.is_http_working){
					that.is_http_working = true;
				}
				
				this.abotapi.abotRequest({
					url:this.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/posts',
					method: 'get',
					data: post_data,					
					success(res) {
						
						that.is_http_working = false;
					
						if(res.data.code){
							uni.showToast({
								title:'到底啦~'
							})
							return;
						}
						
						
						that.is_OK = false;
						
						console.log('当前页码===>>>' + that.page)
						
						if(!that.fetch_list){
							that.fetch_list = [];
						}
						
						that.page ++;
						
						that.fetch_list = that.fetch_list.concat(res.data);
						
						console.log('that.fetch_list  ===>>>', that.fetch_list);
						
						if(res.data.length < that.per_page){
							that.is_OK = true;
						}
						
						//2022.5.21. 如果文章内容少于4篇，则随机返回10篇
						
						console.log('that.flag_get_rand_10 ===>>', that.flag_get_rand_10);
						console.log('that.isMyFavoriteList ===>>', that.isMyFavoriteList);
						console.log('res.data.length ===>>', res.data.length);
						
						if(!that.flag_get_rand_10 
							&& ( that.isMyFavoriteList != 'block')  
							&& (res.data.length <= 3) ){
								
							that.flag_get_rand_10 = true;
							that.flag_get_rand_10_ok = false;
							
							var flag_get_rand_exclude_id_list = [];
							
							for(var ii=0; ii<res.data.length; ii++) {
								flag_get_rand_exclude_id_list.push( res.data[ii]['id'] );
							}
							
							that.flag_get_rand_exclude_ids = flag_get_rand_exclude_id_list.join(',');
							
							console.log('准备请求最新的10篇，同时排除ID：' + that.flag_get_rand_exclude_ids);
							
							that.fetchCategoriesData();
						}
						//=========== End ==============
						
						
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
				console.log("id",id);
				uni.navigateTo({
					url:'../wordpress/detail?id='+id
				})
			},
			
			__check_my_favortie(data_type, action, callback_function){
				var that = this;
				
				var userInfo = this.abotapi.get_user_info();
				
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
			  
		},
	}  
</script>

<style>
	.topic-common-list {
	  /* padding:30rpx 30rpx; */
	}
	
	.topic-list-item {
		position: relative;
		overflow: hidden;
		clear: both;
		margin-bottom: 30rpx;
		background: #fff;
	}
	
	.topic-list-item  image.cover {
		width: 100%;
		height: 375rpx;
		/*filter: blur(2rpx)  opacity(0.4);*/
		filter: blur(2rpx);
	}
	
	.topic-content-title {
		padding: 16rpx 0rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		position: absolute;
		z-index: 2;
		left: 60rpx;
		top: 120rpx;
		font-size:48rpx;
		font-weight: bold;
	}
	
	.topic-content-title text {
	  font-size: 40rpx;
	  line-height: 48rpx;
	  color: #fff;
	  text-shadow: -1rpx 1rpx 0 #000000, 1rpx 1rpx 0 #000000, 1rpx -1rpx 0 #000000, -1rpx -1rpx 0 #000000;
	}
	
	.topic-content-title-line{
	  width: 300rpx;
	  padding: 16rpx 0rpx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	  position: absolute;
	  border-bottom: 1rpx solid #fff; 
	  z-index: 2;
	  left: 64rpx;
	  top: 180rpx;
	}
	
	
	.topic-content-brief {
		position: absolute;
		z-index: 2;
		left: 60rpx;
		top: 240rpx;
		margin-right: 60rpx;
	}
	
	.topic-content-brief text {
		font-size: 30rpx;
		text-shadow: -1rpx 1rpx 0 #000000, 1rpx 1rpx 0 #000000, 1rpx -1rpx 0 #000000, -1rpx -1rpx 0 #000000;
		line-height: 32rpx;
		color: #ffffff;
		
		overflow: hidden; 
		
		/* 显示2行，没有省略号的方案，兼容主流设备 */
		height: 64rpx;
		
		/* 显示2行，有省略号的方案，只在主流的Web浏览器中生效*/
		/*white-space: nowrap; 
		
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;*/
	}
	
</style>
