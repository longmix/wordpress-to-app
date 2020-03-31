<template>

	<view class="container" ><!-- :style="{display:display}" -->
		<view class="header">
		    <image :src="wxa_shop_operation_logo_url" style="width:10%;margin:0 3%" mode="widthFix"></image>
		    <view class="headerTitle">
				{{dialog.title.rendered}}
			</view>
		</view>
		
		<view class="wrapper">
			<view class="excerpt">
				<u-parse :content="dialog.content.rendered" @preview="clickPreview" @navigate="toNavigate" />
			</view>
			
			<view style='text-align:center'>
				<button class="gotowebpage-button" formType="submit" size="mini" @tap="gotowebpage()">问题反馈收集表</button>
			</view>
			<view style='text-align:center'>
				<button class="praise-button" formType="submit" size="mini" @tap="praise">赞赏软件开发记</button>
			</view>
			
			
			<!-- #ifndef MP-ALIPAY -->	
			<view class="praisePost">
				<view style='text-align:center'>
					<button class="payonline-button" formType="submit" size="mini" @tap="payonline">微信支付宝转账</button>
				</view>
			</view>
			<!-- #endif -->
			
		</view>
		<view class="copyright">
			<view>{{copyright_text}}</view>
		</view>
	</view>
</template>

<script>
	import uParse from '../../../components/gaoyia-parse/parse.vue';
	export default {
		components: {
			uParse
		},
		data() {
			return {
				userInfo:'',
				isLoginPopup: false,
				aboutus_pageid:'',
				dialog:'',
				wxa_shop_new_name:'',
				copyright_text:'',
				wxa_shop_operation_logo_url:''
			}
		},
		
		onPullDownRefresh: function () {
			var that = this;
			uni.removeStorageSync('wordpress_data_list_str');
			this.abotapi.set_option_list_str(this, this.callback_function);
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1500);
		},
		
		onLoad: function (options) {
		    this.abotapi.set_option_list_str(this, this.callback_function);
		},
		
		onShareAppMessage: function () {
			return {
		        //title: '关于“' + config.getWebsiteName +'”官方小程序',
		        title: this.dialog.title.rendered,
		        path: '/pages/tabBar/about/about?id='+this.dialog.id,
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
		
		methods: {
			//获取网站基础信息配置项
			callback_function:function(that, cb_params){
				
				if(!cb_params){
					return;
				}
				
				console.log('cb_params====', cb_params);
				
				//====1、更新界面的颜色
				this.abotapi.getColor();
				
				//====2、其他的设置选项：商品列表风格、头条图标等等
				
				
				//网站返回'关于页面'ID值
				if (cb_params.aboutus_pageid) {
				  
				    this.aboutus_pageid = cb_params.aboutus_pageid
				  
				}
				
				//网站名称
				if (cb_params.wxa_shop_new_name) {
				  
				    this.wxa_shop_new_name = cb_params.wxa_shop_new_name
				  
				}
				
				//网站Logo
				if (cb_params.wxa_shop_operation_logo_url) {
				  
				    this.wxa_shop_operation_logo_url = cb_params.wxa_shop_operation_logo_url
				  
				}
				
				//网站版权
				if (cb_params.copyright_text) {
					
					this.copyright_text = cb_params.copyright_text
					
				}
				
				
				uni.setNavigationBarTitle({
					title:this.wxa_shop_new_name
				})
				this.fetchData();
				
			},

			//获取页面数据
			fetchData:function(){
				var that = this;
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.weiduke_server_url+'openapi/Wordpress/restapi/wp-json/wp/v2/pages/'+that.aboutus_pageid,
				    method: 'get',
				    data:{
				    	sellerid:this.abotapi.globalData.default_sellerid,
				    },
					
				    success(res) {
						that.dialog = res.data;
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
			
			
			//文章详情链接跳转
			toNavigate:function(href, e) {
				console.log("href",href);
				var url = href;
				var var_list = Object();
				console.log("e",e);
				this.abotapi.call_h5browser_or_other_goto_url(url, var_list, '');
			      // do something
			},
			
			
			gotowebpage:function(){
			    var url = this.abotapi.globalData.url_for_feedback;
						  
				var var_list = Object();
				
				console.log('toAdDetails- to url ====>>>>>>', url);
				
				this.abotapi.call_h5browser_or_other_goto_url(url, var_list, '');
			},
			
			payonline:function(){
				var src = this.abotapi.globalData.img_url_for_weixinpay;
				var src2 = this.abotapi.globalData.img_url_for_alipay;
				uni.previewImage({
				  urls: [src, src2],
				});
			}
			
			
		}
	}
</script>

<style>
	.wrapper {
		padding-top:106upx;
	}
	.headerTitle{
		margin-left: 1%;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	
	.excerpt{
		color:#626262; 
		font-size:32upx;
		line-height:64upx;
		text-align: left;
	}

	.praisePost{
		position: relative;
		text-align: left;
		margin-top: 30upx;
		margin-bottom: 30upx;
	}

	.praise-button {
		font-size: 30upx;
		font-weight: normal;
		color:  #fff;
		background-color: #f85959;
		background-repeat: repeat-x;
		margin-top: 24upx;
		width: 320upx;
		height: 60upx;
		border-radius: 60upx;
		display:none;
	}
	
	.praise-button::after{
		border:none;
	}
	
	.gotowebpage-button {
		font-size: 30upx;
		font-weight: normal;
		color:  #fff;
		background-color: #118fff;
		background-repeat: repeat-x;
		line-height: 80upx;
		margin-top: 40upx;
		width: 320upx;
		height: 80upx;
		border-radius: 60upx;
	}
	
	.gotowebpage-button::after{
		border: none; 
	}
	
	.payonline-button {
		font-size: 30upx;
		font-weight: normal;
		color:  #fff;
		background-color: #f47204;
		background-repeat: repeat-x;
		line-height: 80upx;
		margin-top: 40upx;
		width: 320upx;
		height: 80upx;
		border-radius: 60upx;
	}
	
	.payonline-button::after{
	   border: none; 
	}
</style>
