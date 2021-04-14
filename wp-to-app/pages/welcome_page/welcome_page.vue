<template>
	<view>
		<block v-if="video_url">
			<video @tap='start_and_stop_other_videos()' :src="video_url"  :poster='video_cover_url' :controls="true" :autoplay="video_autoplay" :bindloadedmetadata="videometa" :style="{width:videometa_width_height[0]+'upx', height:videometa_width_height[1] + 'rpx'}">
			</video>
		</block>
		
		
		<block v-if="content_type == 'cms'">
		<view class='wenzhang_detail'>
		    <rich-text v-if="describe" :nodes="describe|formatRichText"></rich-text>
		</view>
		</block>
		
		<block v-if="content_type == 'pic'">
		<view>
			<image :src="content_pic_image" :data-url="content_pic_url" mode="widthFix" style="width:100%" @tap="content_pic_click"></image>
		</view>
		</block>
		
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
		 
		<rich-text v-if="describe" :nodes="describe|formatRichText"></rich-text>
		
	</view>
</template>

<script>

var ttt = 0;
//高德SDK 
// import bmap from '../../common/SDK/bmap-uni.js';
// import io from '../../common/weapp.socket.io.js'; 
// import locationapi from '../../common/locationapi.js'; 

//import abotapi001 from '../../common/abotapi.js';

export default {
	data() {
		return {
			get_default_imgid:false,
			content_type:'cms',
			video_autoplay:false,
			current_title : '',
			content_pic_image:'',
			content_pic_url:'',
			video_cover_url:'',
			video_url:'',
			wxa_show_latest_product_in_welcome_page:'',
			is_more:'',
			describe:'',
			shopList:[],
			page:1,
		};
	},
	onPageScroll: function (e) {
		
	},
	//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
	onPullDownRefresh: function () {
		
	},
	
	//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	onReachBottom: function () {
		
	},
	onLoad: function (options) {
		
		console.log('welcome welcome welcome ====>>123', options);
		if (options.scene != null) {
			
			//1、指定渠道
			var url_value = decodeURIComponent(options.scene);

			console.log(url_value);

			var url_data = url_value.split('@');
			console.log(url_data);

			if (url_data.length < 3) {
				//跳转到首页
				uni.switchTab({
					url: '../index/index'
				})
				return;
			}

			var imgid = url_data[0];
			var parentid = url_data[1];
			var platform = url_data[2];

			this.abotapi.set_current_parentid(parentid);

			if(platform == 'cms'){
				this.__get_img_from_weiduke(imgid, this);
			}
			else if(platform == 'pic'){
				this.__get_pic_from_yanyubao(imgid, this);
				this.setData({content_type:'pic'});
			}
		}
		else if(options.data_url){
		  //2、 指定网址
		  var parentid = options.parentid;
		  if(parentid){
			this.abotapi.set_current_parentid(parentid);
		  }
	
		  this.__get_img_from_data_url(decodeURIComponent(options.data_url), this);
	
		}
		else{
			
		  //3、其他方式：直接传参
		  var imgid = options.imgid;
		  var parentid = options.parentid;
		  var platform = options.platform;
			
		  if(parentid){
			this.abotapi.set_current_parentid(parentid);
		  }
			
		  if(!platform){
			platform = 'cms';
		  }
			
		  if(platform == 'cms'){
			if(imgid){
			  imgid = 0;
			  
			  this.__get_img_from_weiduke(imgid, this);
			}
			else{
			  this.get_default_imgid = true;
			}
		  }
		  else if(platform == 'pic'){
			this.__get_pic_from_yanyubao(imgid, this);
			this.content_type = 'pic';
		  }
		}
		this.abotapi.set_option_list_str(this, this.__handle_option_list());
		
	},
	onShow:function(){
		
	},
	
	
	
	methods: {
		__handle_option_list:function(that, option_list){
		    this.abotapi.getColor();
		
		    if(this.get_default_imgid && option_list && option_list.wxa_default_imgid_in_welcome_page){
		      this.__get_img_from_weiduke(option_list.wxa_default_imgid_in_welcome_page, this);
		    }
		
		
		    if(!option_list || !option_list.wxa_show_latest_product_in_welcome_page){
		      return;
		    }
		
		    //获取最新的商品信息
		    var wxa_show_latest_product_in_welcome_page = option_list.wxa_show_latest_product_in_welcome_page;
		
		    that.wxa_show_latest_product_in_welcome_page = wxa_show_latest_product_in_welcome_page;
		
		    if(wxa_show_latest_product_in_welcome_page == 1){
		      console.log('66666666666', that.data.cataid)
		      uni.request({
		        url: this.abotapi.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
		        method: 'post',
		        data: {
		          sellerid: this.abotapi.get_sellerid(),
		          keyword: that.data.searchValue ? that.data.searchValue : '',
		          sort: 1,
		          page: that.data.page,
		          cataid: that.data.cataid ? that.data.cataid : ''
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
		
		  __get_img_from_weiduke: function (imgid, that){
		
		    uni.showLoading({
		      title: '数据加载中……',
		    });
		
		    var url = this.abotapi.globalData.weiduke_server_url + '/openapi/ArticleImgApi/article_detail.shtml';
		    var data = {
		      token: this.abotapi.get_current_weiduke_token(),
		      id: imgid,
		      openid: this.abotapi.get_current_openid()
		    };
		
		
		    var cbSuccess = function (res) {
		      uni.hideLoading();
		
		      if (res.data.code == 1) {
		        //var wz_keyword = res.data.data.keyword;
		        
		
		        uni.setNavigationBarTitle({
		          title: res.data.data.title
		        })
		        that.current_title = res.data.data.title;
		          
				that.describe = res.data.data.info;
		        
		        //WxParse.wxParse('content', 'html', res.data.data.info, that, 15);
		
		        if (res.data.data.video_url) {
		          that.video_url = res.data.data.video_url;
				  that.video_cover_url = res.data.data.video_cover_url;
				  
		
		          if (res.video_autoplay) {
		            that.video_autoplay = true;
		          }
		        }
		      }
		    };
		    var cbError = function (res) {
		      uni.hideLoading();
		
		    };
		    this.abotapi.httpPost(url, data, cbSuccess, cbError);
		      //========End====================
		  },
		
		  __get_pic_from_yanyubao:function(imgid, that){
		    uni.showLoading({
		      title: '数据加载中……',
		    });
		
		    var url = this.abotapi.globalData.http_server + 'index.php/openapi/SupplierData/get_swiper_pic_url';
		    var data = {
		      sellerid: this.abotapi.get_sellerid(),
		      swiperid:imgid
		    };
		
		    var userInfo = this.abotapi.get_user_info();
		    if(userInfo){
		      data.userid = userInfo.userid;
		      data.checkstr = userInfo.checkstr;
		    }
		
		    var cbSuccess = function (res) {
		      uni.hideLoading();
		
		      if (res.data.code == 1) {
		        
				that.content_pic_image = res.data.data.image;
				that.content_pic_url = res.data.data.url;
				
		        if (res.data.data.video_url) {
				  that.video_url = res.data.data.video_url;
				  that.video_cover_url = res.data.data.video_cover_url;
		          
		
		          if (res.video_autoplay) {
					  that.video_autoplay = true;
		            
		          }
		        }
		
		      }
		    };
		    var cbError = function (res) {
		      uni.hideLoading();
		
		    };
		    this.abotapi.httpPost(url, data, cbSuccess, cbError);
		
		
		
		
		
		  },
		  __get_img_from_data_url: function (data_url, that){
		
		    uni.showLoading({
		      title: '数据加载中……',
		    });
		
		    var data = {
		      openid: this.abotapi.get_current_openid()
		    };
		
		
		
		    var cbSuccess = function (res) {
		      uni.hideLoading();
		
		      if (res.data.code == 1) {
		        //var wz_keyword = res.data.data.keyword;
		       
		
		        uni.setNavigationBarTitle({
		          title: res.data.data.title
		        })
		        that.current_title = res.data.data.title;
		
				that.describe = res.data.data.info;
		
		        if(res.data.data.video_url){
					that.video_url = res.data.data.video_url;
					that.video_cover_url = res.data.data.video_cover_url;
					
		          if(res.video_autoplay){
					  that.video_autoplay = true;
		          }
		        }
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
		      url: "../wordpress/detail?id=" + lookid.id
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
			
			newContent = newContent.replace(/<p[^>]*>/gi, '<p style="margin:40upx;">');
			
			newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10upx auto;vertical-align: middle;"');
			
			return newContent;
		}	
	}
};
</script>

<style>
</style>
