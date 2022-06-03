<template>
	<view>
		<block v-if="video_url">
			<video @tap='start_and_stop_other_videos()' :src="video_url"  :poster='video_cover_url' :controls="true" :autoplay="video_autoplay" :bindloadedmetadata="videometa" :style="{width:videometa_width_height[0]+'upx', height:videometa_width_height[1] + 'rpx'}">
			</video>
		</block>
		
		
		<block v-if="content_type == 'cms'">
			<view class='wenzhang_detail'>
				
				
				
				
				
	<!-- #ifdef MP-ALIPAY -->			
				<rich-text :nodes="index_rich_html_content"></rich-text>
	<!-- #endif -->

	<!-- #ifndef MP-ALIPAY -->
				
				<!-- 富媒体组件 2021.1.18. -->
				<!-- rich-text  和 v-html 都有各自的优缺点 -->
				<u-parse v-if="index_rich_html_content" 
					:content="index_rich_html_content" 
					@preview="index_rich_html_preview_image" 
					@navigate="index_rich_html_click_link" />
	<!-- #endif -->
				
			</view>
		</block>
		
		<block v-if="content_type == 'pic'">
			<view>
				<image :src="content_pic_image" :data-url="content_pic_url" mode="widthFix" style="width:100%" @tap="content_pic_click"></image>
			</view>
		</block>
		
		
		<!-- 客服功能按钮 -->
		<view v-if="usercenter_contact_status == 1">
			<!-- #ifdef MP-WEIXIN | MP-BAIDU -->
				<view v-if="usercenter_contact_btn_type == 0">
					<button type="default" style="width: 80%;margin-top: 10rpx;"
						:style="{backgroundColor:wxa_shop_nav_bg_color,color:wxa_shop_nav_font_color=='#000000' ? '#333' : wxa_shop_nav_font_color}" 
						open-type="contact" show-message-card="usercenter_contact_wxa_extend == 1 ? 'true' : 'false'" 
						:send-message-title="usercenter_contact_wxa_title"  :send-message-path="usercenter_contact_wxa_path" 
						:send-message-img="usercenter_contact_wxa_img" >{{usercenter_contact_btn_text}}</button>
				</view>
				<view v-if="usercenter_contact_btn_type == 1">
					<button type="default" style="width: 80%;padding: 0;border: 0;" 
						open-type="contact" show-message-card="usercenter_contact_wxa_extend == 1 ? 'true' : 'false'"
						:send-message-title="usercenter_contact_wxa_title"  :send-message-path="usercenter_contact_wxa_path" 
						:send-message-img="usercenter_contact_wxa_img" plain="true">
						<image style="width: 100%;" :src="usercenter_contact_btn_img" mode="widthFix"></image>
						</button>
				</view>
			<!-- #endif -->
			
			
		</view>
		
		
		
		<view class="list" v-if="wxa_show_latest_product_in_welcome_page == 1">
		    <block v-for="item in shopList" :key="item">
		        <view class="ban">
		            <navigator :url="'../product/detail?productid=' + item.productid" class="cover flex-wrp">
		                <image class="banner" :src="item.picture" mode="widthFix"></image>
		          <view class="act-item ellipsis">
		              <text class="type">{{item.name}}</text>
		            </view>
		              <view class="act-item ellipsis" >
		                <text class="kkk">{{item.seller_name}}</text>
		            </view> 
		            <view class="act-item ellipsis" >
		                <text style="color:red">¥ {{item.price}}</text>
		            </view>
		              <view class="act-item ellipsis" >
		                <text style="color:#999999;font-size:25rpx">已有{{item.sale_volume}}人购买</text>
		            </view>
		            </navigator>
		        </view> 
		        
		    </block>
		
		</view>
		<view style="padding-bottom:120rpx;"></view>
		<view class="zdy_btn_box" 
			v-if="welcome_page_btn_count > 0"
			:style="{background:welcome_page_bottom_bg_color,color:welcome_page_bottom_font_color,borderTop:'1rpx solid '+ welcome_page_bottom_font_color}">
		    <view :class="[welcome_page_btn_count > 2 ? 'btn_up_and_dow' : 'btn_left_and_right']" 
				v-for="(item,index) in welcome_page_bottom_icon_list" 
				:key="index" 
				@click="btn_to_page" 
				:data-url="item.url">
		        <image :style="{width:welcome_page_bottom_icon_size + 'rpx',height:welcome_page_bottom_icon_size + 'rpx'}" :src="item.src" style="width:40rpx;height:40rpx;"></image> 
		        <view :style="{fontSize:welcome_page_bottom_font_size + 'rpx'}">{{item.name}}</view>
		    </view>
		</view>
		
	</view>
</template>

<script>

var ttt = 0;
//高德SDK 
// import bmap from '../../common/SDK/bmap-uni.js';
// import io from '../../common/weapp.socket.io.js'; 
// import locationapi from '../../common/locationapi.js'; 

//import abotapi001 from '../../../common/abotapi.js';

import uParse from '@/components/gaoyia-parse/parse.vue'

// #ifdef MP-ALIPAY
	import parseHtml from "../../common/html-parser.js"
// #endif

//2021.11.20. 这个函数在ES6中不兼容，需要使用ES5模式编译
import md5 from '../../common/md5.min.js'

export default {
	components:{
		uParse
	},
	data() {
		return {
			//get_default_imgid:false,
			wxa_default_imgid_in_welcome_page:0,
			content_type:'cms',
			video_autoplay:false,
			
			//普通类型的文章，对应的标题和图片
			current_title : '',
			current_pic: '',
			
			//如果内容类型为图片，则图片的URL和对应点击后跳转网址
			content_pic_image:'',	// 图片的URL
			content_pic_url:'',		// 点击后跳转网址
			
			video_cover_url:'',
			video_url:'',
			wxa_show_latest_product_in_welcome_page:'',
			is_more:'',
			
			index_rich_html_content:'<div></div>',
			
			shopList:[],
			page:1,
			
			//底部导航按钮
			welcome_page_bottom_font_color:'#fff',
			welcome_page_bottom_bg_color:'#000',
			welcome_page_bottom_icon_list:[],
			welcome_page_btn_count:0,
			
			//按钮的数量控制字体和图片的大小
			welcome_page_bottom_font_size:'30',
			welcome_page_bottom_icon_size:'40',
			
			current_params_str:'',
			wxa_share_img:'',
			
			//2021.10.28. 增加缓存机制
			http_data_cache_id:null,
			current_options:null,
			
			//客服功能相关
			usercenter_contact_status:0,
			usercenter_contact_btn_type:0,
			usercenter_contact_btn_text:'',
			usercenter_contact_btn_img:'',
			usercenter_contact_wxa_extend:0,
			usercenter_contact_wxa_title:'',
			usercenter_contact_wxa_path:'',
			usercenter_contact_wxa_img:'',
			
		};
	},	
	onLoad: function (options) {
		
		console.log('welcome welcome welcome ====>>123', options);
		
		//=====分析参数=====
		if(options){
		  var arr = Object.keys(options);
		  var options_len = arr.length;
				
		  if (options_len > 0){
			var params_str = '';
				
			for(var key in options){
			  params_str += key+'='+options[key]+'&';
			}
			params_str = params_str.substr(0, params_str.length - 1);
				
			this.current_params_str = params_str;
		  }
		}
		//===== End ======
		
		this.current_options = options;
		
		this.abotapi.set_option_list_str(this, this.__handle_option_list);
		
		if (options.scene != null) {
			
			//1、指定渠道
			var url_value = decodeURIComponent(options.scene);

			console.log(url_value);

			var url_data = url_value.split('@');
			console.log(url_data);

			if (url_data.length < 3) {
				//跳转到首页
				uni.showModal({
					title:'提示',
					content:'参数错误',
					showCancel:false,
					success:function(res){
						//跳转到首页
						this.abotapi.call_h5browser_or_other_goto_url('/pages/index/index');
						
					}
				})
				
				return;
			}

			var imgid = url_data[0];
			var parentid = url_data[1];
			var platform = url_data[2];

			if(parentid){
				this.abotapi.set_current_parentid(parentid);
			}
			
			options.imgid = imgid;
			options.parentid = parentid;
			options.platform = platform;
			
		}
		
		
		
		this.__load_welcome_page_date(options);
		
	},
	onShow:function(){
		
	},
	onPageScroll: function (e) {
		
	},
	//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
	onPullDownRefresh: function () {
		var that = this;
		
		//如果没有缓存ID，则直接刷新
		if(!that.http_data_cache_id){
			
			that.__load_welcome_page_date(that.current_options);
			
			uni.stopPullDownRefresh();
			return;
		}
		
		//如果有缓存，则删除后再刷新
		uni.removeStorage({
			key: 'welcome_page_data_cache_' + that.http_data_cache_id,
			success: (res) => {
				that.__load_welcome_page_date(that.current_options);
				
				uni.stopPullDownRefresh();
			},
			fail: () => {
				uni.stopPullDownRefresh();
			}
		})
		
		
	},
	
	//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	onReachBottom: function () {
		
	},
	onShareAppMessage: function () {
		var that = this;
		
		console.log('app.globalData.shop_name : ' + this.abotapi.globalData.shop_name);
		
		var last_url = '/pages/welcome_page/welcome_page';
		if(that.current_params_str.length > 5){
			last_url = '/pages/welcome_page/welcome_page?'+that.current_params_str;
		}
		
		var share_img = that.current_pic;
		if(!share_img){
			share_img = that.wxa_share_img;
		}
		
		console.log('onShareAppMessage ==>> ' + this.current_title);
		console.log('onShareAppMessage ==>> ' + last_url);
		console.log('onShareAppMessage ==>> ' + share_img);
		
		var share_data = {
		  title: '' + this.current_title,
		  path: last_url,
		  imageUrl: share_img,
		  success: function (res) {
			// 分享成功
		  },
		  fail: function (res) {
			// 分享失败
		  }
		};
		
		//#ifdef MP-BAIDU
			share_data.content = share_data.title;
		//#endif
		
		return share_data;
		
	},
	onShareTimeline: function () {
		var that = this;
		
		console.log('app.globalData.shop_name : ' + this.abotapi.globalData.shop_name);
		
		
		var last_url = '';
		
		if(that.current_params_str.length > 5){
			last_url = ''+that.current_params_str;
		}
		
		var share_img = that.current_pic;
		if(!share_img){
			share_img = that.wxa_share_img;
		}
		
		console.log('onShareAppMessage ==>> ' + this.current_title);
		console.log('onShareAppMessage ==>> ' + last_url);
		console.log('onShareAppMessage ==>> ' + share_img);
		
		return {
		    title: '' + this.current_title,
		    query: last_url,
		    imageUrl:share_img,
		}
		
	},
	onAddToFavorites: function () {
		this.onShareTimeline();
	},
	
	
	methods: {
		__load_welcome_page_date:function(options){
			
			var parentid = options.parentid;
			
			if(parentid){
				this.abotapi.set_current_parentid(parentid);
			}
			
			if(options.data_url){
				//2、 指定网址
				this.__get_img_from_data_url(decodeURIComponent(options.data_url), this);
			
				return;
			}
			
			//3、其他方式：直接传参
			var imgid = options.imgid;
			var platform = options.platform;
			
			if(!platform){
				platform = 'cms';
			}
						
			if(platform == 'cms'){
				if(!imgid){
				  //this.get_default_imgid = true;
				  
				  imgid  = this.wxa_default_imgid_in_welcome_page;
				}
				
				this.__get_img_from_weiduke(imgid, this);
			}
			else if(platform == 'pic'){
				this.__get_pic_from_yanyubao(imgid, this);
				
				//this.setData({content_type:'pic'});
				
				this.content_type = 'pic';
			}
			
		},
		__handle_option_list:function(that, option_list){
		    //that.abotapi.getColor();
			
			console.log('1222dsfsd23456',option_list);
			console.log('that.current_options ==>>', that.current_options);
			
			//获取自定义页面导航图标
			if(option_list && option_list.welcome_page_bottom_icon_list){
				console.log('122223456',option_list.welcome_page_bottom_icon_style);
				//设置底部导航的颜色风格
				
				if(option_list.welcome_page_bottom_icon_style && (option_list.welcome_page_bottom_icon_style == 1)){
				  //底色变成文字的颜色，文字变成底色
					that.welcome_page_bottom_bg_color = option_list.wxa_shop_nav_font_color;
					that.welcome_page_bottom_font_color = option_list.wxa_shop_nav_bg_color;
				}
				else{
					that.welcome_page_bottom_bg_color = option_list.wxa_shop_nav_bg_color;
					that.welcome_page_bottom_font_color = option_list.wxa_shop_nav_font_color;
				}
					
				that.welcome_page_bottom_icon_list = option_list.welcome_page_bottom_icon_list;
				that.welcome_page_btn_count = option_list.welcome_page_bottom_icon_list.length;
				
				if(that.current_options.hidden_bottom_icon_list){
					that.welcome_page_btn_count = 0;
				}
				
				
				if(option_list.welcome_page_bottom_icon_list.length == 1){
					that.welcome_page_bottom_font_size = '60';
					that.welcome_page_bottom_icon_size = '70';
				}
				else if(option_list.welcome_page_bottom_icon_list.length == 2){
					that.welcome_page_bottom_font_size = '45';
					that.welcome_page_bottom_icon_size = '52';
				}
				if(option_list.welcome_page_bottom_icon_list.length == 3){
					that.welcome_page_bottom_font_size = '35';
					that.welcome_page_bottom_icon_size = '40';
				}
				
			}
			
			if (option_list.wxa_share_img) {
				//分享转发图片
			  
			    that.wxa_share_img = option_list.wxa_share_img;
			}
			
			console.log('usercenter_contact_show_in_welcome_page 000===>>> ' + option_list.usercenter_contact_show_in_welcome_page);
			
			if(option_list.usercenter_contact_show_in_welcome_page){
				that.usercenter_contact_status = option_list.usercenter_contact_show_in_welcome_page;
				
				console.log('usercenter_contact_show_in_welcome_page 111===>>> ' + that.usercenter_contact_status);
				
				if(option_list.usercenter_contact_btn_type){
					that.usercenter_contact_btn_type = option_list.usercenter_contact_btn_type;
				}
				if(option_list.usercenter_contact_btn_text){
					that.usercenter_contact_btn_text = option_list.usercenter_contact_btn_text;
				}
				if(option_list.usercenter_contact_btn_img){
					that.usercenter_contact_btn_img = option_list.usercenter_contact_btn_img;
				}
				if(option_list.usercenter_contact_wxa_extend){
					that.usercenter_contact_wxa_extend = option_list.usercenter_contact_wxa_extend;
					
					if(option_list.usercenter_contact_wxa_title){
						that.usercenter_contact_wxa_title = option_list.usercenter_contact_wxa_title;
					}
					if(option_list.usercenter_contact_wxa_path){
						that.usercenter_contact_wxa_path = option_list.usercenter_contact_wxa_path;
					}
					if(option_list.usercenter_contact_wxa_img){
						that.usercenter_contact_wxa_img = option_list.usercenter_contact_wxa_img;
					}
					
					
				}
				
			}
			
			
			if(option_list.wxa_default_imgid_in_welcome_page){
				that.wxa_default_imgid_in_welcome_page = option_list.wxa_default_imgid_in_welcome_page;
			}
			
		    if(!option_list || !option_list.wxa_show_latest_product_in_welcome_page){
		      return;
		    }
		
		    //获取最新的商品信息
		    var wxa_show_latest_product_in_welcome_page = option_list.wxa_show_latest_product_in_welcome_page;
		
		    that.wxa_show_latest_product_in_welcome_page = wxa_show_latest_product_in_welcome_page;
		
			wxa_show_latest_product_in_welcome_page = 0;
		
		    if(wxa_show_latest_product_in_welcome_page == 1){
		      console.log('66666666666 显示最新的商品信息')
			  
		      this.abotapi.abotRequest({
		        url: this.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopAppWxa&a=product_list',
		        method: 'post',
		        data: {
		          sellerid: this.abotapi.get_sellerid(),
		          //keyword: that.data.searchValue ? that.data.searchValue : '',
		          sort: 1,
		          page: 1,
		          //cataid: that.data.cataid ? that.data.cataid : ''
		        },
		        header: {
		          'Content-Type': 'application/x-www-form-urlencoded'
		        },
		        success: function (res) {
		          var data = res.data.product_list;
		          if (data == '') {
		            uni.showToast({
		              title: '没有更多数据！',
		              duration: 2000
		            });
		            that.is_more = false;
		            return false;
		          }
				  that.shopList = data;
				  that.page = 1;
				  that.is_more = true;
				  
		          
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
		  
		  __handle_http_response_data:function(http_data){
			  
			var that = this;
			
			//如果有视频文件，则渲染视频
			if (http_data.video_url) {
			  that.video_url = http_data.video_url;
			  that.video_cover_url = http_data.video_cover_url;
			  
				
			  if (http_data.video_autoplay) {
				that.video_autoplay = true;
			  }
			}
			
			
			//如果类型为图片，则简单渲染即可
			if(that.content_type == 'pic'){
				that.content_pic_image = res.data.data.image;
				that.content_pic_url = res.data.data.url;
				
				return;
			}
			  
			//如果类型为文章（自定义数据类型也必须符合文章的数据格式），则需要具体渲染  
			uni.setNavigationBarTitle({
				title: http_data.title
			})
			  
			that.current_title = http_data.title;
			
			//当前文章对应的图片
			if(http_data.pic){
				that.current_pic = http_data.pic;
			}
			  		          
			that.index_rich_html_content = http_data.info;
			
			//WxParse.wxParse('content', 'html', http_data.info, that, 15);
			
// #ifdef MP-ALIPAY		
					console.log('that.index_rich_html_content====>>>>', that.index_rich_html_content);
					
					const filter = that.$options.filters["formatRichText"];
					that.index_rich_html_content = filter(that.index_rich_html_content);
					
					console.log('that.index_rich_html_content====>>>>', that.index_rich_html_content);
					
					let data001 = that.index_rich_html_content;
					let newArr = [];
					let arr = parseHtml(data001);
					arr.forEach((item, index)=>{
						newArr.push(item);
					});
					
					//console.log('arr arr arr====>>>>', arr);
					//console.log('newArr newArr newArr====>>>>', newArr);
					
					that.index_rich_html_content = newArr;
// #endif				
						
			
			
	
			
			  
			  
		  },
		
		  __get_img_from_weiduke: function (imgid, that){
			  
			var that = this;
		    
			if(!this.abotapi.get_current_weiduke_token()){
				this.abotapi.set_current_weiduke_token('abcdefghijklmn');
			}
			
		
		    var post_url = this.abotapi.globalData.weiduke_server_url + '/openapi/ArticleImgApi/article_detail.shtml';
		    var post_data = {
		      token: this.abotapi.get_current_weiduke_token(),
		      id: imgid,
		      openid: this.abotapi.get_current_openid()
		    };


			console.log('准备查找网址的缓存 ===>>> ' + post_url);
			console.log('网址的参数为 aaaa ===>>> ' + JSON.stringify(post_data));
			
			
			that.http_data_cache_id = md5(post_url + JSON.stringify(post_data));
			
			console.log('md5 ===>>> ' + that.http_data_cache_id);
			
			var http_data = uni.getStorageSync('welcome_page_data_cache_' + that.http_data_cache_id);
			if(http_data){
				that.__handle_http_response_data(http_data);
				
				return;
			}

			
			uni.showLoading({
			  title: '数据加载中……',
			});
		
		    var cbSuccess = function (res) {
		      uni.hideLoading();
		
		      if (res.data.code == 1) {
		        //var wz_keyword = res.data.data.keyword;
		        
				that.__handle_http_response_data(res.data.data);
				
				
				uni.setStorage({
					key: 'welcome_page_data_cache_' + that.http_data_cache_id,
					data: res.data.data
				})
				

		      }
		    };
		    var cbError = function (res) {
		      uni.hideLoading();
		
		    };
		    this.abotapi.httpPost(post_url, post_data, cbSuccess, cbError);
		      //========End====================
		  },
		
		  __get_pic_from_yanyubao:function(imgid, that){
		    
		
		    var url = this.abotapi.globalData.yanyubao_server_url + '/index.php/openapi/SupplierData/get_swiper_pic_url';
		    var data = {
		      sellerid: this.abotapi.get_sellerid(),
		      swiperid:imgid
		    };
			
			
			
		
		    var userInfo = this.abotapi.get_user_info();
		    if(userInfo){
		      data.userid = userInfo.userid;
		      data.checkstr = userInfo.checkstr;
		    }
			
			//读取缓存
			that.http_data_cache_id = md5(url + JSON.stringify(data));
			
			console.log('md5 ===>>> ', that.http_data_cache_id);
			
			var http_data = uni.getStorageSync('welcome_page_data_cache_' + that.http_data_cache_id);
			if(http_data){
				that.__handle_http_response_data(http_data);
				
				return;
			}
			
			
			uni.showLoading({
			  title: '数据加载中……',
			});
		
		    var cbSuccess = function (res) {
		      uni.hideLoading();
		
		      if (res.data.code == 1) {
				  
				  that.__handle_http_response_data(res.data.data);
				  
				  
				  uni.setStorage({
				  	key: 'welcome_page_data_cache_' + that.http_data_cache_id,
				  	data: res.data.data
				  })
				
		
		      }
		    };
		    var cbError = function (res) {
		      uni.hideLoading();
		
		    };
		    this.abotapi.httpPost(url, data, cbSuccess, cbError);
		
		
		
		
		
		  },
		  __get_img_from_data_url: function (data_url, that){
		
		    var data = {
		      openid: this.abotapi.get_current_openid()
		    };
		
			//读取缓存
			that.http_data_cache_id = md5(data_url + JSON.stringify(data));
			
			console.log('md5 ===>>> ', that.http_data_cache_id);
			
			var http_data = uni.getStorageSync('welcome_page_data_cache_' + that.http_data_cache_id);
			if(http_data){
				that.__handle_http_response_data(http_data);
				
				return;
			}
		
		
			uni.showLoading({
			  title: '数据加载中……',
			});
			
		    var cbSuccess = function (res) {
		      uni.hideLoading();
		
		      if (res.data.code == 1) {
		        //var wz_keyword = res.data.data.keyword;
				
				
				that.__handle_http_response_data(res.data.data);
				
				
				uni.setStorage({
					key: 'welcome_page_data_cache_' + that.http_data_cache_id,
					data: res.data.data
				})
				
		      }
		    };
		    var cbError = function (res) {
		      uni.hideLoading();
		
		    };
		    this.abotapi.httpPost(data_url, data, cbSuccess, cbError);
		      //========End====================
		  },
		
		  //点击图片的跳转事件
		  content_pic_click:function(e){
		    var url = e.currentTarget.dataset.url;
		
		    console.log('welcome page 准备跳转至：'+url);
		
		    var var_list = Object();
		
		    this.abotapi.call_h5browser_or_other_goto_url(url, var_list, 'pages_index');
		
		
		
		  },
		
		
		
		  
		
		
		//详情页跳转
		lookdetail: function (e) {
		    console.log(e)
		    var lookid = e.currentTarget.dataset.procuctid;
		    console.log(lookid);
		    uni.navigateTo({
		      url: "../index/detail?id=" + lookid.id
		    })
		},
		  
		imageLoad: function (e) {//获取图片真实宽度  
				
		    var imgwidth = e.detail.width,
		      imgheight = e.detail.height,
		      //宽高比  
		      ratio = imgwidth / imgheight;
		    console.log(imgwidth, imgheight)
		    //计算的高度值  
		    var viewHeight = this.windowHeight / ratio;
		    var imgheight = viewHeight;
		    var imgheights = this.imgheights;
		    //把每一张图片的对应的高度记录到数组里  
		    imgheights[e.target.dataset.id] = uni.upx2px(imgheight);
	
		    console.log(imgheights);
		
	
		     this.imgheights = imgheights
		   
		  },
		 //自定义页面底部导航跳转
		  btn_to_page:function(e){
		    console.log(e);
		    var url = e.currentTarget.dataset.url;
		    this.abotapi.call_h5browser_or_other_goto_url(url);
		},
		
		//播放点击视频并停止播放其他视频
		start_and_stop_other_videos: function (e) {
			console.log('start_and_stop_other_videos=====>>>>', e);
			var video_id = e.currentTarget.dataset.id;
		},
		
		videometa:function(e){
		    console.log('videometa======>>>>>', e);
		
		    var imgwidth = e.detail.width;
		    var imgheight = e.detail.height;
		
		
		    //宽高比  
		    var ratio = imgwidth / imgheight;
		
		    console.log(imgwidth, imgheight)
		
		    var current_view_width = 750;
		
		    current_view_width = current_view_width ;
		
		    //计算的高度值  
		    var current_view_height = current_view_width / ratio;
		
		
		    //赋值给前端
		    var videometa_width_height = [current_view_width, current_view_height];
		
		    console.log('videometa_width_height====>>>>', videometa_width_height);
		
		    this.setData({
		      videometa_width_height: videometa_width_height
		    });
		
		},
		
		//富媒体 图片被点击
		index_rich_html_preview_image:function(img_src, e){
		},
		
		//富媒体 链接点击事件
		index_rich_html_click_link:function(new_url, e){
			
			console.log('index_rich_html_click_link====>>>>>', new_url);
			
			this.abotapi.call_h5browser_or_other_goto_url(new_url);
			
			
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
		
			//console.log('html====>>>>', html);
		
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
			
			newContent = newContent.replace(/<p[^>]*>/gi, '<p style="margin:40upx;">');
			
			newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10upx auto;vertical-align: middle;"');
			
			newContent = newContent.replace(/<h1[^>]*>/gi, '<h1 class="wxParse-h1">');
			newContent = newContent.replace(/<h2[^>]*>/gi, '<h2 class="wxParse-h2">');
			
			return newContent;
		}	
	}
};
</script>

<style>
	@import url("@/components/gaoyia-parse/parse.css");
	
	/* 底部导航 */
	.zdy_btn_box{
	  position: fixed;
	  left:0;
	  bottom:0;
	  width:100%;
	  background:#ffffff;
	  z-index:10;
	  height:120rpx;
	  display:flex;
	  font-size:30rpx;
	}
	
	.btn_left_and_right{
	  display: flex;
	  height: 120rpx;
	  justify-content: center;
	  align-items: center;
	  width: 100%;
	  font-size:30rpx;
	}
	
	.btn_left_and_right image{
	  margin-right:15rpx;
	}
	
	.btn_up_and_dow{
	  display: flex;
	  height: 120rpx;
	  width: 100%;
	  flex-direction:column;
	  justify-content: center;
	  align-items: center;
	}
		
	
</style>
