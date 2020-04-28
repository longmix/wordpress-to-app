<template>
	<view class="content">
		<view class="index-header">
		    <swiper class="index-swiper"    
				circular="true" 
				autoplay="true" 
				@change="swiperChange" 
				:style="{height:current_imgheight + 'px'}"
				indicator-dots="true" 
				interval="2000"
				indicator-color="rgba(255, 255, 255, .2)" 
				indicator-active-color="rgba(255, 255, 255, .7)" >
				<swiper-item v-for="(item, index)  in index_image" :key="index" @tap="onNavRedirect(item.url)">   <!-- :id="item.id" :data-redicttype="item.type" :data-appid="item.appid" :data-url="item.url" @tap="redictAppDetail()" -->
					<image @load="imageLoad($event)"  :src="item.image" mode="widthFix">
					<view class="swiper-mask"></view>
					<view class="swiper-desc">
						<text>{{item.name}}</text>
					</view>
				</swiper-item>
		    </swiper>
		</view>

		<view>
		    <view>
		        <!-- 图标导航 -->
		        <view class="top-Nav">
		            <block v-for="(item2,index2) in index_icon_list" :key="index2">
		                <view class="top-item" @tap="onNavRedirect(item2.url)">
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
		
		        <form @submit="formSubmit" @reset="formReset" id="search-form">
		            <view class="search-pancel">
		                <input value="" id="search-input" name="input" confirm-type="search" class="search-input" placeholder="搜索你感兴趣的内容..."></input>
		                <button class="search-button" form-type="submit" size="mini" plain="true">
		                    <icon type="search" color="#959595" size="12" />
		                </button>
		            </view>
		        </form>
		
		    </view>
			
			<view class="container">
			<!-- 加载图文列表 -->
				<view class="index-container">
					<view class="common-list" v-if="fetch_list">
						<block >
							<view class="list-item has-img" :index="index" :key="index" v-for="(item3,index) in fetch_list" :id="item3.id" @tap="redictDetail">
								<view class="content-title">
									<text>{{item3.title.rendered}}</text>
								</view>
								<view class="content-date">
									<image src="../../../static/img/index/calendar.png"></image>
									<text>{{item3.date_to_show}}</text>
									<image src="../../../static/img/index/comments.png"></image>
									<text class="">{{item3.total_comments}}</text>
									<image src="../../../static/img/index/pageviews.png"></image>
									<text class="">{{item3.pageviews}}</text>
									<image src="../../../static/img/index/home-like.png"></image>
									<text class="">{{item3.like_count}}</text>        
								</view>
								<image :src="item3.post_thumbnail_image" mode="aspectFill" class="cover"></image>
							</view>
						</block>
					</view>
			
			        <view class="loadingmore" v-if="is_OK">
			            <view class="no-more">-暂无文章-</view>
			        </view>
					
					<view class="copyright" v-if="is_OK">
						<view>{{copyright_text}}</view>
					</view>
			    </view>
			</view>
		    
		</view>
		
		<view class="u-tap-btn" v-if="wap_h5_show_kefu_button==1">
			<block v-if="wap_h5_kefu_bg_no_color_flag == 0">
				<block v-if="wap_h5_kefu_button_type==1">
					<button plain="true" class="u-go-home2" @tap="call_seller" :style="{backgroundColor:wap_h5_kefu_bg_color}">
						<image :src="wap_h5_kefu_button_icon" mode="widthFix"></image>
					</button>
				</block>
				<block v-if="wap_h5_kefu_button_type==2">
					<button plain="true" class="u-go-home2" @tap="onNavRedirect(wap_h5_kefu_form_url)" :style="{backgroundColor:wap_h5_kefu_bg_color}">
						<image :src="wap_h5_kefu_button_icon" mode="widthFix"></image>
					</button>
				</block>
			</block>
			<block v-else>
				<block v-if="wap_h5_kefu_button_type==1">
					<button plain="true" class="u-go-home2" @tap="call_seller">
						<image :src="wap_h5_kefu_button_icon" mode="widthFix"></image>
					</button>
				</block>
				<block v-if="wap_h5_kefu_button_type==2">
					<button plain="true" class="u-go-home2" @tap="onNavRedirect(wap_h5_kefu_form_url)">
						<image :src="wap_h5_kefu_button_icon" mode="widthFix"></image>
					</button>
				</block>
			</block>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				roll_picture:'',
				index_image:'',
				imgheights:[],
				current_imgheight:0,
				per_page:10,
				page:1,
				current:0,
				fetch_list:'',
				is_OK:false,
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
				
				wap_h5_show_kefu_button:'',
				
				
				
				wp_enable_comment_option:'',
				copyright_text:'',
				all_option_list:null
				
			}
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
				path: '/pages/tabBar/index/index',
				success: function (res) {
					// 转发成功
				},
				fail: function (res) {
					// 转发失败
				}
			}
		},
		
		
		onReady:function () {
			
		},
		
		
		//下拉刷新
		onPullDownRefresh: function () {
			var that = this;
			that.page=0;
			
			uni.removeStorageSync('wordpress_data_list_str');
			this.abotapi.set_option_list_str(this, this.callback_function);
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1500);
		},
		  
		  
		//触底方法
		onReachBottom: function () {  
			var that = this;

			// var that = this;
			if(this.is_OK){
				that.page = page;
				return;
			}
			
			that.page++;
			console.log('page',that.page);
			
			this.abotapi.abotRequest({
			    url:this.abotapi.globalData.weiduke_server_url+'openapi/Wordpress/restapi/wp-json/wp/v2/posts',
			    method: 'get',
			    data:{
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
						
					} else {
						
						that.is_OK = true;
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
		},
		  
		  
		onLoad: function (options) {
		    
			var that = this;
			
			uni.setNavigationBarTitle({
				title:that.abotapi.globalData.wxa_website_name
			})
			
			uni.getSystemInfo({
			    success: function (res) {
					
					that.windowHeight = res.windowHeight;
					that.windowWidth = res.windowWidth;
					
			    }
			});
			
			uni.showLoading({
				title:'正在加载...',
				mask:true,
				fail: function (e) {
					uni.showToast({
						title: '网络异常！',
						duration: 2000
					});
				},
			})
			
			setTimeout(function () {
			    uni.hideLoading();
			}, 2000);
			
			this.abotapi.set_option_list_str(this, this.callback_function);
		},
		
		
		
		onShow: function (options){
			uni.setStorageSync('openLinkCount', 0);
		
		},
		
		
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
					
					this.wap_h5_show_kefu_button = cb_params.wap_h5_show_kefu_button
					
				}
				
				//客服按钮类型
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
				
				//客服按钮背景颜色
				if (cb_params.wap_h5_kefu_bg_color) {
					
					this.wap_h5_kefu_bg_color = cb_params.wap_h5_kefu_bg_color
					
				}
				
				if (cb_params.wap_h5_kefu_bg_no_color_flag) {
					
					this.wap_h5_kefu_bg_no_color_flag = cb_params.wap_h5_kefu_bg_no_color_flag
					
				}
				
				
				//是否开启评论
				if (cb_params.wp_enable_comment_option) {
					
					this.wp_enable_comment_option = cb_params.wp_enable_comment_option
					
				}
				
				//网站版权
				if (cb_params.copyright_text) {
					
					this.copyright_text = cb_params.copyright_text
					
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
					that.index_image = cb_params.roll_picture_list;
				}
				else{
					that.get_shop_index_images();
				}
				
				
				
				that.fetchPostsData();
			},
			
			
			//拨打客服电话
			call_seller: function () {
			    console.log('wap_h5_kefu_mobile_num', this.wap_h5_kefu_mobile_num)
			    uni.makePhoneCall({
					phoneNumber: this.wap_h5_kefu_mobile_num,
			    })
			},
			

			//首页图标、轮播图及其他h5链接跳转
			onNavRedirect:function(url){
				var var_list = Object();
				this.abotapi.call_h5browser_or_other_goto_url(url, var_list, '');
			},
			
			
			//输入搜索值
			formSubmit: function (e) {
				var url = '/pages/list/list'
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
				    url:this.abotapi.globalData.yanyubao_server_url+'Yanyubao/ShopApp/get_shop_icon_list',
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
			get_shop_index_images:function(){
				console.log("22222");
				var that = this;
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.yanyubao_server_url+'Yanyubao/ShopApp/get_shop_ad_image_list',
				    method: 'post',
				    data:{
						ad_type:that.roll_picture,
				    	sellerid:this.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
				    	var data = res.data;
				    	if(data.code == 1){
				    		that.index_image = data.data;
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
			
			
			//轮播图指示器
			swiperChange:function(event) {
				this.currentSwiper = event.detail.current;
			},
			
			
			//获取图片真实宽度  
			imageLoad: function(e) {
				console.log("e",e);
			    var imgwidth = e.detail.width;
				var imgheight = e.detail.height;
				//宽高比  
				var ratio = imgwidth / imgheight;
				console.log('imgwidth==>>',imgwidth);
				console.log('imgheight==>',imgheight);
				console.log('ratio==',ratio);
				//return;
				
				console.log("windowWidth", this.windowWidth);
				console.log("windowWidth", uni.upx2px(this.windowWidth));
				
				//计算的高度值  
				var viewHeight = this.windowWidth / ratio;
				
				
				//this.current_imgheight = uni.upx2px(viewHeight); //  this.windowHeight 本身就是像素
				this.current_imgheight = viewHeight;
				
				console.log("viewHeight",viewHeight);
				console.log("viewHeight",this.current_imgheight);
				
				return;
				
			    var imgheight = viewHeight;
				
			    var imgheights = this.imgheights;
			    //把每一张图片的对应的高度记录到数组里  
			    imgheights[e.target.dataset.id] = uni.upx2px(imgheight);
				this.imgheights = imgheights
				console.log('this.imgheights',this.imgheights);
				
				
			},
			
			//获取文章列表
			fetchPostsData:function(){
				var that = this;
				
				if(that.is_OK){
					return;
				}
				
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.weiduke_server_url+'openapi/Wordpress/restapi/wp-json/wp/v2/posts',
				    method: 'get',
				    data:{
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
			redictDetail: function (e) {
				// console.log('查看文章');
				var id = e.currentTarget.id,
				url = '/pages/tabBar/index/detail?id=' + id;
				uni.navigateTo({
					url: url
				})
				
			},

		}
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
		box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
		position: relative;
		z-index: 1;
	}
	
	swiper.index-swiper {
	  position: relative;
	  height: 420upx;
	}
	
	swiper .swiper-mask {
	  position: absolute;
	  top: 0;
	  left: 0;
	  bottom: 0;
	  width: 100%;
	}
	
	swiper image {
	  display: block;
	  width: 100%;
	}
	
	swiper .swiper-desc {
	  position: absolute;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  width: 100%;
	  background: linear-gradient(to bottom, rgba(0, 0, 0, 0)0%, rgba(63, 76, 88, 0.3)100%);
	  color: #fff;
	  line-height: 150upx;
	  margin: 0 auto;
	  font-weight: 700;
	  overflow: hidden;
	  white-space: nowrap;
	  text-overflow: ellipsis;
	  font-size: 30upx;
	  text-shadow: 0px 0px 16px #646d75;
	}
	
	.search-button {
	  border-left: 0 !important;
	  border-top: 1px solid #fff !important;
	  border-right: 1px solid #fff !important;
	  border-bottom: 1px solid #fff !important;
	  background-color: #fff !important;
	  border-bottom-left-radius: 0;
	  border-top-left-radius: 0;
	  border-top-right-radius: 4px;
	  border-bottom-right-radius: 4px;
	  color: #296fd0 !important;
	  width: 20%;
	  margin: 0 !important;
	  box-shadow: 1px 1px 6px #ecf0f0;
	  height: 83upx;
	}
	
	.search-button icon {
	  position: absolute;
	  margin: 28upx 16upx;
	}
	
	.search-input {
	  background-color: #fff;
	  padding: 16upx 0 16upx 32upx;
	  min-height: 1rem;
	  font-size: 30upx;
	  border-bottom-left-radius: 4px;
	  border-top-left-radius: 4px;
	  border-top-right-radius: 0;
	  border-bottom-right-radius: 0;
	  border-right: 0 !important;
	  height: 83upx;
	  width: 80%;
	  text-align: left;
	  box-shadow: 1px 1px 6px #ecf0f0;
	}

	.search-pancel {
	  display: flex;
	  flex-direction: row;
	  background-color: #f5f7f7;
	  padding: 24upx 24upx;
	  height: 130upx;
	}
	
	.search-pancel image {
	  width: 50upx;
	  height: 50upx;
	  margin-left: 20upx;
	  vertical-align: middle;
	}
	
	.top-Nav{
		display: flex;
		padding: 25upx 0;
		background: #fff;
		justify-content:space-around;
		border-bottom: 1px solid #eee;
	}
	
	.top-item{
		text-align: center;
	}
	.top-item image{
		width: 88upx;
		height: 88upx;
	}
	.top-item text{
		line-height: 20upx;
		font-size: 30upx;
	}
	
	.u-go-home2{
		border:0;
	}

</style>
