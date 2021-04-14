<template>
	<view>
		<view class="topic-common-list" :style="{display:isCategoryPage}">
			<view class="topic-list-item">
				<image :src="categoriesImage" class="cover"></image>
				<view class="topic-content-title">
					<label v-if="categoriesList.categoryName">{{categoriesList.categoryName}}</label>
					<label v-else></label>
				</view>
				<view class="topic-content-title-line"></view>
				<view class="topic-content-brief">
					<label v-if="categoriesList.categoryDescription">{{categoriesList.categoryDescription}}</label>
					<label v-else></label>
				</view>
			</view>
		</view>


		<view class="topic-common-list" :style="{display:isSearchPage}">
			<view class="topic-list-item">
				<view><image src="../../static/img/list/website-search.png" class="cover"></image></view>
				<view class="topic-content-title">
					<text>搜索关键字：</text>
					<text class="searchKey">{{searchKey}}</text>
				</view>
				<view class="topic-content-title-line"></view>
				<view class="topic-content-brief">
					<text>本搜索是全文搜索</text>
				</view>
			</view>
		</view>

		<view class="container">
			<view class="showerror" v-if="!fetch_list">
				<image src="../../static/wp-article-img/smile.png" style="height:100upx;width:100upx"></image>

				<view class="errortext">
					列表数据加载中……
					<view class="">
						<button class="more-button" size="mini" @tap="reload">重新加载</button>
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
	//var search;
	//var categoriesId;
	//var categorySrc;
	
	import fetchList from '../../components/wp-article-list.vue'
	
	
	export default {
		components:{
			fetchList
		},
		
		data() {
			return {
				isCategoryPage:"none",
				isSearchPage:'none',
				page: 1,
				per_page:10,
				is_OK:false,
				fetch_list:'',
				search:'',
				searchKey:"",
				categoriesId:'',
				categoriesImage:'',
				categorySrc:'',
				copyright_text:''
			}
		},
		onLoad: function (options) {
			console.log("options",options);
			
			var that = this;
			that.categoriesList = options;
			
			//设置标题
			if(that.categoriesList.categoryName){
				uni.setNavigationBarTitle({
					title:that.categoriesList.categoryName,
				});
			}
			
			if (that.categoriesList.categoryID && that.categoriesList.categoryID != 0) {
				that.categoriesId = that.categoriesList.categoryID;
				
				that.categorySrc = that.categoriesList.categorySrc;
				
				that.isCategoryPage = "block"
				
				that.fetchCategoriesData();
				
				
				
		    }
			else if (that.categoriesList.search && that.categoriesList.search != '') {
				console.log(1111111);
				that.search = that.categoriesList.search;
				that.isSearchPage = "block";
				that.searchKey = that.categoriesList.search;
				
				that.fetchPostsData();
				
				uni.setNavigationBarTitle({
					title: "搜索关键字："+that.categoriesList.search,
				});
		    }
			else if(that.categoriesList.categorySlug){
				//根据分类的别名，获取分类的ID，然后再请求
				this.abotapi.abotRequest({
				    url:that.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/categories',
				    method: 'get',
				    data:{
						slug:that.categoriesList.categorySlug,						
				    	sellerid:that.abotapi.globalData.default_sellerid,
				    },
				    success(res) {
						console.log('categories slug ====>>>>', res.data);
						
						if(res.data){
							var cataItem = res.data[0];
							
							console.log('categories slug ====>>>>', cataItem);
							
							that.categoriesList.categoryID = cataItem['id'];
							that.categoriesList.categoryName = cataItem['name'];
							that.categoriesList.categorySrc = cataItem['category_thumbnail_image'];
							that.categoriesList.categoryDescription = cataItem['description'];
							
							uni.setNavigationBarTitle({
								title: that.categoriesList.categoryName,
							});
							
							
							that.categoriesId = that.categoriesList.categoryID;							
							that.categorySrc = that.categoriesList.categorySrc;							
							that.isCategoryPage = "block";
							
							that.fetchCategoriesData();
							
							//设置百度小程序中的页面SEO信息
							// #ifdef MP-BAIDU
								swan.setPageInfo({
									title: that.categoriesList.categoryName,
									keywords: that.categoriesList.categoryName,
									description: that.categoriesList.categoryDescription,
									articleTitle: that.categoriesList.categoryName,
									releaseDate: res.data.mp_baidu_seo_releaseDate,
									image: [that.categoriesList.categorySrc],
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
			
			if(!this.categorySrc){
				this.categorySrc = '../../static/img/usercenter/vip.jpg';
			}
			
			this.abotapi.set_option_list_str(this, this.callback_function);
			
		},

		reload:function(e){
			var that = this;
			that.page=0;
			
			uni.removeStorageSync('option_list_str');
			this.abotapi.set_option_list_str(this, this.callback_function);
			
			if(that.search){
				that.fetchPostsData();
			}else if(that.categoriesId){
				that.fetchCategoriesData();
			}
		
		},
		
		
		//下拉刷新
		onPullDownRefresh: function () {
			var that = this;
			that.page=0;

			if(that.search){
				that.fetchPostsData();
			}else if(that.categoriesId){
				that.fetchCategoriesData();
			}
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1500);

		},
		
		
		//触底方法
		onReachBottom: function () {
			var that = this;
			var page = that.page;
			that.page++;
			console.log('page',that.page);
			// var that = this;
			if(this.is_OK){
				that.page = page;
				uni.showToast({
					title: '到底啦~',
					duration: 2000
				});
				return;
			}
			if(that.search){
				that.isSearchPage = 'block';
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/posts',
				    method: 'get',
				    data:{
						search:that.search,
						per_page:that.per_page,
						page:that.page,
						orderby:'date',
						order:'desc',
				    	sellerid:this.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
				    	
						if(!res.data.code){
							
							that.is_OK = false;
							that.fetch_list = that.fetch_list.concat(res.data);
							console.log('超过一页',that.fetch_list)
							
							//得到数据后停止下拉刷新
							uni.stopPullDownRefresh();
							if(res.data.length < that.per_page){
								that.is_OK = true;
							}
						} else {
							that.is_OK = true;
							uni.showToast({
								title: '暂无数据',
								duration: 2000
							});
							return;
							
						}
				    },
				    fail: function (e) {
						uni.showToast({
							title: '网络异常！',
							duration: 2000
						});
				    },
				});
			}else if(that.categoriesId){
				that.isSearchPage = 'none';
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/posts',
				    method: 'get',
				    data:{
						categories:that.categoriesId,
						per_page:that.per_page,
						page:that.page,
						orderby:'date',
						order:'desc',
				    	sellerid:this.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
				    	
						if(!res.data.code){
							
							that.is_OK = false;
							that.fetch_list = that.fetch_list.concat(res.data);
							console.log('超过一页',that.fetch_list)
							
							//得到数据后停止下拉刷新
							uni.stopPullDownRefresh();
							if(res.data.length < that.per_page){
								that.is_OK = true;
							}
						} else {
							that.is_OK = true;
							uni.showToast({
								title: '暂无数据',
								duration: 2000
							});
							return;
							
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
		methods:{
			//获取网站基础信息配置项
			callback_function:function(that, cb_params){
				
				if(!cb_params){
					return;
				}
				
				console.log('cb_params====', cb_params);
				
				
				//====1、更新界面的颜色
				this.abotapi.getColor();
				
				//====2、其他的设置选项：商品列表风格、头条图标等等
				
				
				//网站名称
				if (cb_params.wxa_shop_new_name) {
				  
				    this.wxa_shop_new_name = cb_params.wxa_shop_new_name
				  
				}
				
				
				//网站版权
				if (cb_params.copyright_text) {
					
					this.copyright_text = cb_params.copyright_text
					
				}
				
				
				uni.setNavigationBarTitle({
					title:this.wxa_shop_new_name
				})
				
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
			
			
			//获取  搜索的  文章列表数据
			fetchPostsData: function () {
				var that = this;
				console.log(2222222);
				console.log(that.search);
				this.abotapi.abotRequest({
					url:this.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/posts',
					method: 'get',
					data:{
						search:that.search,
						per_page:this.per_page,
						page:1,
						orderby:'date',
						order:'desc',
						sellerid:this.abotapi.globalData.default_sellerid,
					},
					
					success(res) {
					
						if(!res.data.code){
						
							that.is_OK = false;
						
							if(that.page == 1){
								console.log('第一页')
								that.fetch_list = res.data;
								console.log('第一页index',that.fetch_list)
							}
							
							that.categoriesImage = that.categorySrc;
							console.log('that.categoriesImage1',that.categoriesImage);
							
							if(res.data.length < that.per_page){
								that.is_OK = true;
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
			  
			
			
			//获取 分类下的 文章 列表
			fetchCategoriesData: function (id) {
			   var that = this;
			   
			   console.log('2222222====>>>fetchCategoriesData===>>');
			   console.log(that.categorySrc);
			   
			   this.abotapi.abotRequest({
					url:this.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/posts',
					method: 'get',
					data:{
						categories:that.categoriesId,
						per_page:this.per_page,
						page:1,
						orderby:'date',
						order:'desc',
						sellerid:this.abotapi.globalData.default_sellerid,
					},
					
					success(res) {
					
						if(!res.data.code){
						
							that.is_OK = false;
							if(that.page == 1){
								console.log('第一页')
								that.fetch_list = res.data;
								console.log('第一页index',that.fetch_list)
							}
							
							that.categoriesImage = that.categorySrc;
							console.log('that.categoriesImage2',that.categoriesImage);
							
							if(res.data.length < that.per_page){
								that.is_OK = true;
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
				console.log("id",id);
				uni.navigateTo({
					url:'../wordpress/detail?id='+id
				})
			},
			  
		},
	}  
</script>

<style>
	.topic-common-list {
	  /* padding:30upx 30upx; */
	}
	
	.topic-list-item {
		position: relative;
		overflow: hidden;
		clear: both;
		margin-bottom: 30upx;
		background: #fff;
	}
	
	.topic-list-item  image.cover {
		width: 100%;
		height: 375upx;
		filter: blur(4px);
	}
	
	.topic-content-title {
		padding: 16upx 0upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		position: absolute;
		z-index: 2;
		left: 60upx;
		top: 120upx;
	}
	
	.topic-content-title text {
	  font-size: 48upx;
	  line-height: 48upx;
	  color: #fff;
	}
	
	.topic-content-title-line{
	  width: 48px;
	  padding: 16upx 0upx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	  position: absolute;
	  border-bottom: 1px solid #fff; 
	  z-index: 2;
	  left: 64upx;
	  top: 180upx;
	}
	
	
	.topic-content-brief {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		position: absolute;
		z-index: 2;
		left: 60upx;
		top: 240upx;
	}
	
	.topic-content-brief text {
		font-size: 32upx;
		line-height: 32upx;
		color: #fff;
	}
	
	.searchKey {
		color: #121b23;
	}
</style>
