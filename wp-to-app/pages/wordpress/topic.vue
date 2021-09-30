<template>
	<view>
		<scroll-view style="height:100%; display:none;" scroll-y="true" lower-threshold="100rpx">
			
		</scroll-view>
		
		<view class="topic-common-list">
			<block v-if="cata_topic_list_type == 1">
				<block :key="index" v-for="(item,index) in cata_topic_list" >
					<view class="list-item" @tap="redictToTopic($event)" :data-url="item.url">
						<view>
							<image class="cover" mode="widthFix"
								:src="item.src" :data-name="item.name" :data-url="item.url"></image>
						</view>
						<view class="content-title">
							<view class="topic-name">
								<text>{{item.name}}</text>
							</view>
						</view>
						
					</view>
						
				</block>
			</block>
			<block v-else>
				<block :key="index" v-for="(item,index) in categoriesList" >
					<view class="list-item" 
						@tap="redictIndex($event)" 
						:data-id="item.id" 
						:data-name="item.name" 
						:data-description="item.description" 
						:data-src="item.category_thumbnail_image">
						<view>
							<image class="cover" mode="widthFix"
								:src="item.category_thumbnail_image" 
								:data-id="item.id" 
								:data-slug="item.slug" 
								:data-name="item.name" 
								:data-description="item.description" 
								:data-src="item.category_thumbnail_image"></image>
						</view>
						<view class="content-title">
							<view class="topic-name">
								<text>{{item.name}}</text>
							</view>
						</view>
						<view class="content-brief">
							{{item.description}}
						</view>
					</view>
						
				</block>
				
			</block>
			
		</view>
		
		<view class="topic-common-list" style="padding:10rpx;">
			<view v-for="(tagItem, index) in tagList" 
				:key="index"
				@tap="goto_post_list(tagItem.slug)"
				class="tag_item"
				:style="{backgroundColor:wxa_shop_nav_bg_color, color:wxa_shop_nav_font_color}">
				{{tagItem.name}}
			</view>
		</view>
		
		
		
		<view class="copyright_info" style="clear:both;" :style="{display:floatDisplay}">
			<view>{{copyright_text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categoriesList:null,
				
				floatDisplay:'block',
				
				per_page:50,
				page:1,
				is_OK:false,
				
				wxa_shop_new_name:'',
				
				copyright_text:'',
				
				cata_topic_list_type:0,
				cata_topic_list:null,
				
				all_option_list:null,
				
				tagList:null,
				
				wxa_shop_nav_bg_color: '',
				wxa_shop_nav_font_color: '',
				
			}
		},
		onLoad:function() {
			this.abotapi.set_option_list_str(this, function(that, option_list){
				//====1、更新界面的颜色
				that.abotapi.getColor();
				
				that.wxa_shop_nav_bg_color  = option_list.wxa_shop_nav_bg_color;
				that.wxa_shop_nav_font_color  = option_list.wxa_shop_nav_font_color;
				
				
				that.all_option_list = option_list;
				
				
				if(option_list.cata_topic_list_type && (option_list.cata_topic_list_type == 1)){
					//that.cata_topic_list_type = 1;
					
					//that.cata_topic_list = option_list.cata_topic_list;
				}
				else{
					that.cata_topic_list_type = 0;
					
					that.getTopicList();
					
					that.getTagList();
					
				}
			});
			
			
		},
		
		onShow:function() {
			this.abotapi.set_option_list_str(this, this.callback_function);
			
			
		},
		
		
		//下拉刷新
		onPullDownRefresh: function () {
			var that = this;
			
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1500);
			
			that.page = 1;
			
			that.getTopicList();
			that.getTagList();
		},
		
		
		//触底方法
		onReachBottom: function () {  
		
			
			
		},
		
		//分享文章
		onShareAppMessage: function () {
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
		
		
		methods:{
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
				
				
				//====2、其他的设置选项：商品列表风格、头条图标等等
				
				
				//网站名称
				if (cb_params.wxa_shop_new_name) {
				  
				    that.wxa_shop_new_name = cb_params.wxa_shop_new_name
				  
				}
				
				
				//网站版权
				if (cb_params.copyright_text) {
					
					that.copyright_text = cb_params.copyright_text
					
				}
				
				
				uni.setNavigationBarTitle({
					title:that.wxa_shop_new_name
				})
				
				
				if(cb_params.cata_topic_list_type && (cb_params.cata_topic_list_type == 1)){
					that.cata_topic_list_type = 1;
					
					that.cata_topic_list = cb_params.cata_topic_list;
				}
				else{
					that.cata_topic_list_type = 0;
					
				}
				
				
			},
			
			
			getTopicList:function(){
				var that = this;
				
				var page = that.page;
				
				
				console.log('page======>>>>>>', that.page);
				// var that = this;
				
				if(this.is_OK){
					that.page = page;
					/*uni.showToast({
						title: '已经到底啦~',
						duration: 2000
					});*/
					return;
				}
				
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/categories',
				    method: 'get',
				    data:{
						per_page:that.per_page,
						page:that.page,
						orderby:'id',
						order:'desc',
				    	sellerid:this.abotapi.globalData.default_sellerid,
				    },					
				    success(res) {
				    	console.log("getTopicList-res", res);
						
						if(!res.data.code && (!res.data.length == 0)){
							
							that.is_OK = false;
							
							that.page ++;
							
							if(!that.categoriesList){
								that.categoriesList = res.data;
							}
							else{
								that.categoriesList = that.categoriesList.concat(res.data);
							}
							
							console.log('获取分类列表', that.categoriesList)
							
							if(res.data.length < that.per_page){
								//that.is_OK = true;
							}
							
							//得到数据后停止下拉刷新
							//uni.stopPullDownRefresh();
							
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
			
			//跳转至分类详情
			redictIndex:function(e){
				console.log("redictIndex e ===>>> ", e);
				
				var new_url = '/pages/wordpress/list?';
				
				//new_url += 'categoryID='+e.target.dataset.id;
				//new_url += '&categorySrc='+e.target.dataset.src+'&categoryName='+e.target.dataset.name+'&categoryDescription'+e.target.dataset.description;
				
				//2021.2.24. 通过slug请求分类的信息，包括了分类图标和分类名称以及分类描述
				new_url += 'categorySlug='+e.target.dataset.slug;
				
				uni.navigateTo({
					url:new_url
				})
			},
			//跳转至分类详情
			goto_post_list:function(tag){
				console.log("goto_post_list tag ===>>> ", tag);
				
				var new_url = '/pages/wordpress/list?';
				
				new_url += 'tags=' + tag;
				
				uni.navigateTo({
					url:new_url
				})
			},
			
			redictToTopic:function(e){
				var url = e.target.dataset.url;
				
				var var_list = Object();
				console.log('redictToTopic to url ====>>>>>>', e);
				
				if(!url){
					return;
				}
				
				this.abotapi.call_h5browser_or_other_goto_url(url, var_list, '');
			},
			
			getTagList:function(){
				var that = this;
				
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/tags',
				    method: 'get',
				    data:{
				    	sellerid:this.abotapi.globalData.default_sellerid,
						orderby:'count',
						order:'desc',
						per_page:50
				    },					
				    success(res) {
				    	console.log("getTagList ====>>>> ", res);
						
						if(res.data.code){
							uni.showToast({
								title:'加载失败'
							})
							return;
						}
						
						
						that.tagList = res.data;
						
						console.log('获取标签列表', that.tagList)
						
						
				    },
				    fail: function (e) {
						uni.showToast({
							title: '网络异常！',
							duration: 2000
						});
				    },
				});
			},
			
			
		}
		
	}
</script>

<style>

	.topic-common-list {
	   padding: 48rpx 0rpx 48rpx 48rpx; 
	   margin: 0 auto;
	   width: 100%;
		float: left;
	}
	
	.list-item {
		position: relative;
		float: left;
		overflow: hidden;
		width: 303rpx;
		margin-bottom: 60rpx;
		margin-right: 48rpx;
	}
	
	.list-item  image.cover {
		width: 303rpx;
		border-radius: 12rpx;
	}
	
	.content-title {
		padding: 16rpx 0rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.content-title text {
		font-size: 30rpx;
		line-height: 30rpx;
		color: #1b1b1b;
	}
	
	.content-brief {
		padding: 0rpx 0rpx 30rpx;
		font-size: 23rpx;
		line-height: 40rpx;
		height: 40rpx;
		font-weight: 400;
		
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		
		color: #959595;
		
	}
	.topic-name {
		float: left; 
		width: 100%;
		text-align: center;
	}
	
	.tag_item {
		font-size: 36rpx;
		border-radius: 8rpx;
		border: solid 0rpx red;
		display: block;
		float: left;
		margin: 10rpx;
		padding: 10rpx;
		height: 70rpx;
	}
</style>
