<template>

	<view class="container" ><!-- :style="{display:display}" -->
	
		<view class="header" style="display:none;">
			<image :src="wxa_shop_operation_logo_url" style="width:10%;margin:0 3%" mode="widthFix"></image>
			<view class="headerTitle">
				{{article_title}}
			</view>
		</view>
	
	
		<WpArticleDetail :article_title="article_title"
					:content_html="index_rich_html_content"
					:content_v_html="article_content_html"
					:content_array_html="article_content_array"
					:attr_list="attr_list" />
		</WpArticleDetail>
		
		
		
		<view class="box_img">
			<view style="width: 50%;float:left;text-align:center;">
				<!-- #ifdef APP-PLUS -->
				<button class="xg_button" style="width:90%;margin: 0 auto;" @tap="call_seller" type="primary">联系客服</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<button class="xg_button" style="width:90%;margin: 0 auto;" @tap="call_seller" type="primary">联系客服</button>
				<!-- #endif -->
				<!-- #ifdef MP-TOUTIAO -->
				<button class="xg_button" style="width:90%;margin: 0 auto;" @tap="call_seller" type="primary">联系客服</button>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<button class="xg_button" style="width:90%;margin: 0 auto;" open-type="contact" type="primary">小程序客服</button>
				<!-- #endif -->
				<!-- #ifdef MP-BAIDU -->
				<!-- <button class="xg_button" style="width:90%;margin: 0 auto;" @tap="call_seller" type="primary">联系客服</button> -->
				<button class="xg_button" style="width:90%;margin: 0 auto;" open-type="contact"  bindcontact="baidu_mp_contactCB" type="primary">小程序客服</button>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<button class="xg_button" style="width:90%;margin: 0 auto;" @tap="call_seller" type="primary">联系客服</button>
				<!-- #endif -->
			</view>
			
			<view style="width: 50%;float:left;text-align:center;">
				<button
					@tap="gotowebpage()" 
					class="xg_button" 
					style="width:90%;margin: 0 auto;background-color: #eee;color:#222;"
					type="primary">问题反馈</button>
			</view>
			
		</view>
		
		
		
		
		
		<!-- #ifdef MP-WEIXIN -->
			<view style='text-align:center'>
				<button class="praise-button" formType="submit" @tap="praise_our">赞赏软件开发记</button>
			</view>
			
		<!-- #endif --> 
		
		<!-- #ifndef MP-BAIDU || MP-TOUTIAO -->
			<view class="praisePost">
				<view style='text-align:center'>
					<button class="payonline-button" formType="submit" @tap="pay_online_qrcode">扫码付款</button>
				</view>
			</view>
		<!-- #endif -->
		
		<view class="copyright" style="color: #666;">
			<view>版本号： {{current_version_str}}</view>
			
			<view style="margin-top: 50rpx;"
				@tap="clearStorageIncludeSellerid"
				:style="{display:show_clear_all_data_include_sellerid}">
				重置此应用数据
			</view>
			
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
	
	import WpArticleDetail from '../../components/wp-article-detail.vue'
	
	export default {
		components: {
			//uParse
			WpArticleDetail
		},
		data() {
			return {
				userInfo:'',
				isLoginPopup: false,
				
				aboutus_pageid:0,
				
				current_pageid:0,
				current_page_request_url:'',
				
				wxa_shop_new_name:'',
				copyright_text:'',
				wxa_shop_operation_logo_url:'',
				
				article_title:'',
				
				//v-html使用
				article_content_html:'',				
				//rich-text使用
				article_content_array:null,
				//uparse使用
				index_rich_html_content:'<h1></h1>',
				
				
				article_detail:'',
				attr_list:'',
				
				current_version_str:'',
				
				//是否显示删除所有业务数据的按钮
				show_clear_all_data_include_sellerid:'none',
				
				//客服电话
				usercenter_kefu_telephone:'',
				
			}
		},		
		onLoad: function (options) {
			var that = this;
			
			if(options.pageid){
				this.current_pageid = options.pageid;
			}
			
			if(!that.abotapi.globalData.force_sellerid){
				that.show_clear_all_data_include_sellerid = 'block';
			}
			
			//var test001 = '<p><a href="http://www.abot.cn/988.html" target="_blank" rel="noopener"><img class="size-large aligncenter" src="http://www.abot.cn/wp-content/themes/abotcn/uploads/2018/05/2018050103263341.jpg" width="800" height="267" /></a></p>';
			//test001 = test001.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
			//test001 = test001.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
			//console.log('test001 test001====>>>>', test001);
			//return;
			
			this.current_version_str = this.abotapi.globalData.version_str;
			
		    this.abotapi.set_option_list_str(this, this.callback_function);
			
			
		},
		onPullDownRefresh: function () {
			var that = this;
			
			
			
			
			setTimeout(function () {
				
			}, 1500);
			
			
			uni.removeStorage({
				key: 'wordpress_page_data_' + that.current_pageid,
				success: (res) => {
					console.log('删除文章缓存成功：'+ that.current_pageid);
					
					uni.stopPullDownRefresh();  //停止下拉刷新动画
					
					//因为 关于页面  需要 读取 一个pageid，所以从 set_option_list_str 这里调用
					that.abotapi.set_option_list_str(this, this.callback_function);
				}
			});
			
			
		},
		onShareAppMessage: function () {
			return {
		        //title: '关于“' + config.getWebsiteName +'”官方小程序',
		        title: this.article_detail.title.rendered,
		        path: '/pages/about/about?id='+this.article_detail.id,
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
				
				if(!that.current_pageid){
					that.current_pageid = that.aboutus_pageid;
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
				
				console.log('渲染数据完毕，准备更新文章详情');
				
				//2022.4.21. 如果没有设置pageid，或者设置了diy_tmp_sn_default_aboutus_page_url则优先使用。
				if(cb_params.diy_tmp_sn_default_aboutus_page_url){					
					that.current_page_request_url = decodeURIComponent(cb_params.diy_tmp_sn_default_aboutus_page_url);
				}
				else{					
					that.current_page_request_url = that.abotapi.globalData.wordpress_rest_api_url + '/wp-json/wp/v2/pages/'+that.current_pageid;
					that.current_page_request_url += '?sellerid=' + that.abotapi.globalData.default_sellerid;
				}
				
				console.log('that.current_page_request_url ===>>> ' + that.current_page_request_url);
				
				
				//读取客服电话
				if(cb_params.usercenter_kefu_telephone){
					that.usercenter_kefu_telephone = cb_params.usercenter_kefu_telephone;
				}
				
				
				
				
				that.fetchPageData();
				
				
				
			},
			
			__handle_page_data:function(page_data){
				var that = this;
				
				if(page_data.title.rendered){
					page_data.title.rendered.replace(/&#8211;/g, '——');
				}
				
				that.article_detail = page_data;
				
				that.article_title = page_data.title.rendered;
				
				
				
				//uparse使用
				that.index_rich_html_content = page_data.content.rendered;
				
				
				//v-html使用
				that.article_content_html = page_data.content.rendered;
				
				const filter = that.$options.filters["formatRichText"];
				that.article_content_html = filter(that.article_content_html);
				
				
				//const filter = that.$options.filters["formatRichText"];
				//that.article_content_array = filter(that.index_rich_html_content);
				
				//console.log('that.article_content====>>>>', that.article_content_array);
				
				
// #ifdef MP-ALIPAY
				
				
				
				
				let data001 = that.article_content_html;
				let newArr = [];
				let arr = parseHtml(data001);
				arr.forEach((item, index)=>{
					newArr.push(item);
				});
				
				console.log('arr arr arr====>>>>', arr);
				//console.log('newArr newArr newArr====>>>>', newArr);
				
				that.article_content_array = newArr;

// #endif


			},

			//获取页面数据
			fetchPageData:function(){
				var that = this;
				
				
				
				console.log('准备更新文章ID：' + that.current_pageid);
				
				var detail_data = uni.getStorageSync('wordpress_page_data_' + that.current_pageid)
				
				if(detail_data){
					console.log('文章ID：' + that.current_pageid + ' 有缓存，直接使用') ;
					
					that.__handle_page_data(detail_data);
					
					return;
				}
				
				
				
				this.abotapi.abotRequest({
				    url:that.current_page_request_url,
				    method: 'get',
				    data:{
				    	//sellerid:this.abotapi.globalData.default_sellerid,
				    },
					
				    success:function(res) {
						console.log('网络请求获取文章详情：res====>>>', res);
						
						if(!res.data.title){
							return;
						}
						
						uni.setStorage({
							key: 'wordpress_page_data_' + that.current_pageid,
							data: res.data
						})
						
						that.__handle_page_data(res.data);
						
						
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
			
			pay_online_qrcode:function(){
				var src = this.abotapi.globalData.img_url_for_weixinpay;
				var src2 = this.abotapi.globalData.img_url_for_alipay;
				uni.previewImage({
				  urls: [src, src2],
				});
			},
			
			//拨打客服电话
			call_seller: function() {
				// #ifdef MP-WEIXIN
					//return;
				// #endif
				
				var that = this;
			
				uni.makePhoneCall({
					phoneNumber: that.usercenter_kefu_telephone,
				})
			},
			
			//删除sellerid，使用系统默认的
			clearStorageIncludeSellerid: function() {
				uni.getStorage({
					key:'org_sellerid',
					success: (res) => {
						
						console.log('获取原始的sellerid成功==>>>', res);
						
						this.abotapi.globalData.default_sellerid = res.data;
						
						this.abotapi.set_sellerid(this.abotapi.globalData.default_sellerid);
						
						this.abotapi.clearStorage();
						
						uni.reLaunch({
							url:'/pages/index/index'
						})
					},
					fail: (res) => {
						uni.showToast({
							title:'获取原始sellerid失败'
						})
					}
				})
				
				
				
			},
			
			
			
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
	
	/*.gotowebpage-button {
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
	}*/
	
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
	
	.box_img {
		height: 100rpx;
		margin: 0 auto;
		padding-top: 60rpx;
	
	}
	
</style>
