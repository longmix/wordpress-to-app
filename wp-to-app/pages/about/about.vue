<template>

	<view class="container" ><!-- :style="{display:display}" -->
		<view class="header">
		    <image :src="wxa_shop_operation_logo_url" style="width:10%;margin:0 3%" mode="widthFix"></image>
		    <view class="headerTitle">
				{{article_title}}
			</view>
		</view>
		
		<view class="wrapper">
						
			<view class="excerpt">
<!-- #ifdef MP-ALIPAY -->
				<rich-text :nodes="article_content"></rich-text>
<!-- #endif -->				
<!-- #ifndef MP-ALIPAY -->
				<rich-text :nodes="article_content|formatRichText"></rich-text>
<!-- #endif -->	
			</view>
			
			<!-- #ifdef MP-WEIXIN -->	
			
			<view style='text-align:center'>
				<button class="gotowebpage-button" formType="submit" size="mini" @tap="gotowebpage()">问题反馈收集表</button>
			</view>
			<view style='text-align:center'>
				<button class="praise-button" formType="submit" size="mini" @tap="praise">赞赏软件开发记</button>
			</view>
			
			
			
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

// #ifdef MP-ALIPAY
	import parseHtml from "../../common/html-parser.js"
// #endif	
	

	export default {
		components: {
			//uParse
		},
		data() {
			return {
				userInfo:'',
				isLoginPopup: false,
				
				aboutus_pageid:0,
				
				current_pageid:0,
				
				dialog:'',
				wxa_shop_new_name:'',
				copyright_text:'',
				wxa_shop_operation_logo_url:'',
				
				article_title:'',
				article_content:'',
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
			if(options.pageid){
				this.current_pageid = options.pageid;
			}
			
			//var test001 = '<p><a href="http://www.abot.cn/988.html" target="_blank" rel="noopener"><img class="size-large aligncenter" src="http://www.abot.cn/wp-content/themes/abotcn/uploads/2018/05/2018050103263341.jpg" width="800" height="267" /></a></p>';
			//test001 = test001.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
			//test001 = test001.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
			//console.log('test001 test001====>>>>', test001);
			//return;
			
		    this.abotapi.set_option_list_str(this, this.callback_function);
		},
		
		onShareAppMessage: function () {
			return {
		        //title: '关于“' + config.getWebsiteName +'”官方小程序',
		        title: this.dialog.title.rendered,
		        path: '/pages/about/about?id='+this.dialog.id,
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
				that.abotapi.getColor();
				
				//====2、其他的设置选项：商品列表风格、头条图标等等
				
				
				//网站返回'关于页面'ID值
				if (cb_params.aboutus_pageid) {
				  
				    that.aboutus_pageid = cb_params.aboutus_pageid
				  
				}
				
				//网站名称
				if (cb_params.wxa_shop_new_name) {
				  
				    that.wxa_shop_new_name = cb_params.wxa_shop_new_name
				  
				}
				
				//网站Logo
				if (cb_params.wxa_shop_operation_logo_url) {
				  
				    that.wxa_shop_operation_logo_url = cb_params.wxa_shop_operation_logo_url
				  
				}
				
				//网站版权
				if (cb_params.copyright_text) {
					
					that.copyright_text = cb_params.copyright_text
					
				}
				
				
				uni.setNavigationBarTitle({
					title:that.wxa_shop_new_name
				})
				
				that.fetchData();
				
			},

			//获取页面数据
			fetchData:function(){
				var that = this;
				
				if(!that.current_pageid){
					that.current_pageid = that.aboutus_pageid;
				}
				
				this.abotapi.abotRequest({
				    url:this.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/pages/'+that.current_pageid,
				    method: 'get',
				    data:{
				    	sellerid:this.abotapi.globalData.default_sellerid,
				    },
					
				    success:function(res) {
						console.log('res====>>>', res);
						
						if(!res.data.title){
							return;
						}
						
						if(res.data.title.rendered){
							res.data.title.rendered.replace(/&#8211;/g, '——');
						}
						
						that.dialog = res.data;
						
						that.article_title = res.data.title.rendered;
						that.article_content = res.data.content.rendered;
						
						
// #ifdef MP-ALIPAY
						
						
						const filter = that.$options.filters["formatRichText"];
						that.article_content = filter(that.article_content);
						
						//that.article_content = that.article_content.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
						
						console.log('that.article_content====>>>>', that.article_content);
						
						
						let data001 = that.article_content;
						let newArr = [];
						let arr = parseHtml(data001);
						arr.forEach((item, index)=>{
							newArr.push(item);
						});
						
						console.log('arr arr arr====>>>>', arr);
						//console.log('newArr newArr newArr====>>>>', newArr);
						
						that.article_content = newArr;

// #endif
						
						
						//console.log(res.data.title.rendered)
						//console.log(res.data.content.rendered)
						
						
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
					match = match.replace(/width:[^;]+;/gi, 'max-width:100% important;').replace(/width:[^;]+;/gi, 'max-width:100% important; ');
					return match;
				});
				//newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				
				newContent = newContent.replace(/<p[^>]*>/gi, '<p style="margin:20px;">');
				
				//newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;vertical-align: middle;"');
				
				//newContent = newContent.replace(/width="[^"]+"/gi, 'width="5rem"').replace(/width='[^']+'/gi, '');
					
					//console.log('newContent newContent newContent ===>>>', newContent);
				
				//如果是在支付宝中，直接去掉图片
				//newContent = newContent.replace(/<img[^>]*>/gi, '');	
					
					
					  
				return newContent;
			}	
		},
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
	
	/* 从wordpress中带过来的CSS */
	.size-large {
		max-width: 100%  !important;
	}
	.alignnone {
		max-width: 100%  !important;
	}
</style>
