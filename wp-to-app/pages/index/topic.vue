<template>
	<view>

		
		<!-- 显示所有的tag列表 -->
		<view class="topic-common-list" v-if="tagList != null">
			<view style="padding:40rpx; text-align: center;">
				-- 热门标签 --
			</view>
			
		</view>
		
		<view class="topic-common-list">
			<view style="padding:10rpx;">
				<view v-for="(tagItem, index) in tagList"
					:key="index"
					@tap="goto_post_list(tagItem.id, tagItem.name)"
					class="tag_cloud"
					:style="{
						textShadow: '-1rpx 1rpx 0 '+wxa_shop_nav_font_color +', 1rpx 1rpx 0 '+wxa_shop_nav_font_color+', 1rpx -1rpx 0 '+wxa_shop_nav_font_color+', -1rpx -1rpx 0 '+wxa_shop_nav_font_color,
						color:tagItem.font_color, 
						fontSize:tagItem.font_size+'rpx'}">
					{{tagItem.name}}<text :style="{color:tagItem.font_color}">({{tagItem.count}})</text>
				</view>
			</view>
			
		</view>
		
		<!--
		<view class="topic-common-list">
			<view style="padding:10rpx;">
				<view v-for="(tagItem, index) in tagList"
					:key="index"
					@tap="goto_post_list(tagItem.id, tagItem.name)"
					class="tag_item"
					:style="{backgroundColor:wxa_shop_nav_bg_color, color:wxa_shop_nav_font_color}">
					{{tagItem.name}}<text>({{tagItem.count}})</text>
				</view>
			</view>
			
		</view> -->
		
		<!-- 分类名称列表 -->
		<view class="topic-common-list">
			<view style="padding:40rpx; text-align: center;">
				-- 内容分类 --
			</view>
			
		</view>
		<view class="topic-common-list">
			<block v-if="cata_topic_list_type == 1">
				<block :key="index" v-for="(item,index) in cata_topic_list" >
					<view class="list-item" @tap="redictToTopic(item.url)">
						<view>
							<image class="cover" mode="widthFix"
								:src="item.src"></image>
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
						@tap="goto_post_list_by_cataid(item.id, item.slug)" 
						
						:data-id="item.id"
						:data-slug="item.slug"
						:data-name="item.name"
						
						:data-description="item.description"
						:data-src="item.category_thumbnail_image">
						<image class="cover" mode="widthFix"
							
							:src="item.category_thumbnail_image" ></image>
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
			this.abotapi.set_option_list_str(this, this.callback_function);
			
			
		},
		
		onShow:function() {
			//this.abotapi.set_option_list_str(this, this.callback_function);
			
			
		},
		
		
		//下拉刷新
		onPullDownRefresh: function () {
			var that = this;
			
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1500);
			
			that.page = 1;
			
			that.categoriesList = null;
			
			uni.removeStorage({
				key:'wordpress_topic_list_data',
				success: () => {
					that.getTopicList();
				}
			});
			
			uni.removeStorage({
				key:'wordpress_tag_list_data',
				success: () => {
					that.getTagList();
				}
			});
			
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
				
				//====1、更新界面的颜色
				that.abotapi.getColor();
				
				that.wxa_shop_nav_bg_color  = cb_params.wxa_shop_nav_bg_color;
				that.wxa_shop_nav_font_color  = cb_params.wxa_shop_nav_font_color;
				
				
				that.all_option_list = cb_params;
				
				
				// 0  使用Wordpress默认的
				// 1  使用延誉宝“网站转APP后台”指定的内容分类列表
				if(cb_params.cata_topic_list_type && (cb_params.cata_topic_list_type == 1)){
					that.cata_topic_list_type = 1;
					
					that.cata_topic_list = cb_params.cata_topic_list;
				}
				else{
					that.cata_topic_list_type = 0;
					
					that.getTopicList();
					
					
				}
				
				
				
				that.getTagList();
				
				
				
				
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
				
				//2021.10.27. 如果有缓存，则直接使用缓存
				var topic_list_data = uni.getStorageSync('wordpress_topic_list_data');
				
				if(topic_list_data){
					if(!that.categoriesList){
						that.categoriesList = topic_list_data;
					}
					else{
						that.categoriesList = that.categoriesList.concat(topic_list_data);
					}
					
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
							
							
							uni.setStorage({
								key: 'wordpress_topic_list_data',
								data: res.data
							});
							
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
			goto_post_list_by_cataid:function(cataid, cataSlug){
				//console.log("goto_post_cata_list e ===>>> ", e);
				
				var new_url = '/pages/wordpress/list?';
				
				//new_url += 'categoryID='+e.target.dataset.id;
				//new_url += '&categorySrc='+e.target.dataset.src+'&categoryName='+e.target.dataset.name+'&categoryDescription'+e.target.dataset.description;
				
				//2021.2.24. 通过slug请求分类的信息，包括了分类图标和分类名称以及分类描述
				//new_url += 'categorySlug='+e.target.dataset.slug;
				
				new_url += 'categorySlug=' + cataSlug;
				
				uni.navigateTo({
					url:new_url
				})
			},
			//跳转至分类详情
			goto_post_list:function(tag_id, tag_name){
				console.log("goto_post_list tag ===>>> ", tag_id);
				
				var new_url = '/pages/wordpress/list?';
				
				new_url += 'tag_id=' + tag_id + '&tag_name=' + tag_name;
				
				uni.navigateTo({
					url:new_url
				})
			},
			
			redictToTopic:function(url){
				if(!url){
					return;
				}
				
				var var_list = {};
				
				this.abotapi.call_h5browser_or_other_goto_url(url, var_list, '');
			},
			
			__getRandomInt:function(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			},
			
			getTagList:function(){
				var that = this;
				
				
				//2021.10.27. 如果有缓存，则直接使用缓存
				var tagList = uni.getStorageSync('wordpress_tag_list_data');
				
				//console.log('tagList ==>>', tagList);
				//console.log('type of tagList ==>>'+ typeof(tagList))
				
				
				
				if(tagList){
					
					that.tagList = tagList;
					
					return;
				}
				
				
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/tags',
				    method: 'get',
				    data:{
				    	sellerid:this.abotapi.globalData.default_sellerid,
						orderby:'count',
						order:'desc',
						hide_empty:1,
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
						
						var tagList = res.data;
						
						if(!tagList){
							return;
						}
						
						//=====2022.5.2. 美化标签列表 Begin ===
						//将数组随机排序
						const randomSort = () => {
							return Math.random() > 0.5 ? -1 : 1;
						};
						
						tagList.sort(() => randomSort());
						
						//为了防止数字过大造成文字大小显示扩张，统一减去一个基数
						var min_counter = 0;
						for(var i=0; i<tagList.length; i++){
							if(min_counter == 0){
								min_counter = tagList[i]['count'];
							}
							
							if(tagList[i]['count'] < min_counter){
								min_counter = tagList[i]['count'];
							}
						}
						
						console.log('标签文章数量最小值===>>>' + min_counter);
						
						var min_counter_span = 0;
						if(min_counter > 1){
							min_counter_span = min_counter - 1;
						}
						
						for(var i=0; i<tagList.length; i++){
							//定义文字大小
							var tag_counter = tagList[i]['count'];
							if(tag_counter > 10){
								tag_counter = 10;
							}
							if(tag_counter == 0){
								tag_counter = 1;
							}
							
							tag_counter = 1 + parseFloat( (tag_counter - min_counter_span)/5 );
							tagList[i]['font_size'] = parseInt(tag_counter * 32);
							
							//定义字体颜色
							const getRandomInt = (min, max) => {
								return Math.floor(Math.random() * (max - min)) + min;
							};
							
							tagList[i]['font_color'] = '#' + getRandomInt(10, 99) + getRandomInt(10, 99) + getRandomInt(10, 99);
						
							//console.log("tagList[i]['font_color'] ===>>>" + tagList[i]['font_color']);
						}
						
						//=====2022.5.2. 美化标签列表 End ===
						
						
						
						
						that.tagList = tagList;
						
						console.log('获取标签列表', that.tagList)
						
						uni.setStorage({
							key: 'wordpress_tag_list_data',
							data: res.data
						});
						
						
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
	   padding: 0; 
	   margin: 0;
	   width: 100%;
		float: left;
	}
	
	.list-item {
		position: relative;
		float: left;
		overflow: hidden;
		width: 40%;
		margin-bottom: 0rpx;
		margin-right: 0rpx;
		text-align: center;
		padding:20rpx;
	}
	
	.list-item  image.cover {
		width: 240rpx;
		border-radius: 12rpx;
		margin:0 auto;
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
		height: 50rpx;
		line-height: 50rpx;
	}
	
	.tag_cloud {
	  color: #a33;
	  display: block;
	  font-size: 32rpx;
	  padding: 5rpx 10rpx;
	  text-decoration: none;
	  position: relative;
	  float:left;
	}
	.tag_cloud text, .tag_cloud uni-text, .tag_cloud span {
		font-size: 30rpx;
	}
	
</style>
