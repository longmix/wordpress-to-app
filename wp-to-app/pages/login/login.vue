<template>
	<view class="loginBg">
		<!--  -->
        <!-- <view class="logo"> -->
			<!-- <view class="img">
				<image mode="widthFix" src="data:image/png;base64,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"></image>
			</view> -->
			<view class="flex-center ">
				<view @tap="goHome()" class="flex-center">
					<image :src="wxa_share_img"  style="width: 150upx;margin: 10% auto; border-radius: 10upx;"  mode="widthFix"  class="wh-60"></image>
				</view>
			</view>
		<!-- </view> -->
		<!-- 账号密码输入框 -->
		<!-- <view class="form"> -->
			<!-- <view class="username">
				<input placeholder="请输入手机号" v-model="phoneNumber" placeholder-style="color: rgba(255,255,255,0.8);"/>
			</view>
			<view class="password">
				<input placeholder="请输入密码" v-model="passwd" password=true placeholder-style="color: rgba(255,255,255,0.8);"/>
			</view> -->
		<form class="loginBox"  id="login-form"  :report-submit="true">
			
			<view class="flexIcon">
				<view class="flexIcon-icon iconfont icon-phone_light flexIcon-icon-current"></view>
				<input type="number" class="flexIcon-text" placeholder-class="cl-white" name="telephone" @input="phoneInput" placeholder-style="color: rgba(255,255,255,0.8);" placeholder="请输入手机号" />
			</view>
				  
			<view class="flexIcon">
			  <view class="flexIcon-icon iconfont icon-moban flexIcon-icon-current"></view>
				<image @click="click_check" :src="img_checkcode_url" mode="widthFix" class="img_checkcode"></image>
				<input type="number" class="flexIcon-text" placeholder-class="cl-white" name="telephone" @input="imgInput" placeholder-style="color: rgba(255,255,255,0.8);" placeholder="请输入答案" />
			</view>
			<view class="flexIcon">
				<view class="flexIcon-icon iconfont icon-password flexIcon-icon-current"></view>
				<button type="primary"  @click="send_btn" :disabled="disabled" 
					class="send_btn" style="background-color: #fff;color: #007aff;">{{second}}</button>
				<input type="number" class="flexIcon-text"  name="password"  placeholder-class="cl-white" @input="telInput" placeholder-style="color: rgba(255,255,255,0.8);"  placeholder="收到的验证码" />
			</view>
			<div></div>
			
			<!-- #ifdef APP-PLUS || H5 || APP-PLUS-NVUE -->
			<button type="primary" 
				open-type="getUserInfo" class="btn-row-submit" 
				style="width: 92%;background: #2E85D8;" 
				@click="btn_user_login"	
				>立即登录</button>			
			<!-- #endif -->	
			
			<!-- #ifdef MP-WEIXIN -->
			<button type="primary" 
				open-type="getUserInfo" class="btn-row-submit" 
				style="width: 92%;background: #2E85D8;" 
				@click="btn_user_login"				
				@getuserinfo="btn_wxa_get_userinfo"				
				>立即登录</button>			
			<!-- #endif -->	
			
			<!-- #ifdef MP-BAIDU -->
			<button type="primary" 
				open-type="getUserInfo" class="btn-row-submit" 
				style="width: 92%;background: #2E85D8;" 
				@click="btn_user_login"	
				>立即登录</button>			
			<!-- #endif -->
			
			<!-- #ifdef MP-ALIPAY -->
			<button type="primary" 
				open-type="getUserInfo" class="btn-row-submit" 
				style="width: 92%;background: #2E85D8;" 
				@click="btn_user_login"	
				>立即登录</button>			
			<!-- #endif -->
			
			<!-- #ifdef MP-TOUTIAO -->
			<button type="primary" 
				open-type="getUserInfo" class="btn-row-submit" 
				style="width: 92%;background: #2E85D8;" 
				@click="btn_user_login"	
				>立即登录</button>			
			<!-- #endif -->
			
			<!-- #ifdef MP-QQ -->
			<button type="primary" 
				open-type="getUserInfo" class="btn-row-submit" 
				style="width: 92%;background: #2E85D8;" 
				@click="btn_user_login"	
				>立即登录</button>			
			<!-- #endif -->
				
				
			<div class="flex mgb-20">
				<navigator class="cl-black pointer flex-1" 
				style="margin-top: 30upx;text-align: right;font-size: 30upx; color:#666;" 
				open-type="redirect"
					url="/pages/login/login_by_password">账号密码登录</navigator>
			</div>
			
			
			<!-- #ifdef MP-WEIXIN -->
			<div class="otherBox mgb-20">
				<div class="otherBox-line"></div>
				<div class="otherBox-text">一键登录</div>
			</div>
			<div class="flex flex-center">
				<!-- <button open-type="getUserInfo" @getuserinfo="wxLogin" class="btn-round bg-success icon-weixin"></button> -->
				<button open-type="getPhoneNumber" plain="true"  class="btn-round bg-success icon-weixin" @getphonenumber="btn_wxa_one_click_login"></button>
			</div>
			<!-- #endif -->
			
		</form>
	</view>
</template>

<script>
	// var abotapi = require("../../common/abotapi.js");
	// var app = getApp();
	// var userInfo = abotapi.get_user_info();
	// var userAcountInfo = abotapi.get_user_account_info();
	
	
	function countdown(that) {
		var timer001 = that.timer001;
		if (timer001 == 0) {
			//倒计时结束,恢复按钮可点击状态,同时内容设置为为 发送短信
		
			that.second = '发送短信';
			that.timer001 = 60;
			that.disabled = false
			that.js_code = '';
			that.shop_icon = '';
		
			return;
		}
	
		var time = setTimeout(function () {
			that.second = '重新发送(' + timer001 + ')';
			that.timer001 =  timer001 - 1;
			countdown(that);
		} , 1000)
	} 
	 
	export default {
		data:function(){
			return {
				pageLoad:false, 
				pageData:{},
				notephone:"请输入手机号码",
				notepwd:"请输入密码",
				isWeixin:false,
				img_checkcode_url:'',
				second: '发送短信',
				mobile: "",
				disabled: false,
				timer001: 60,
				js_code: '',
				tokenstr :'',
				wxa_share_img:'',
				user_info:'',
				wxa_shop_new_name:''
			}
		},
		onLoad:function(){
			// this.isWeixin=this.abotapi.isWeixin();		
			this.abotapi.set_option_list_str(this, this.callback_function);
			this.click_check();
			
			var self = this;
			
			uni.setNavigationBarTitle({
				title:self.abotapi.globalData.wxa_website_name
			})
		},
		
		
		
		/*onUnload:function(){
			//this.abotapi.goHome();
		},*/
		onShow:function(){
			// #ifdef MP-BAIDU
			this.abotapi.set_option_list_str(this, function(that, cb_params){
				
				swan.setPageInfo({
					title: cb_params.wxa_share_title,  
					keywords: cb_params.wxa_share_keywords,  
					description: cb_params.wxa_share_description,  
					image: [  
						cb_params.wxa_share_img  
					]  
				});
			});
			
			// #endif
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
				
				//网站logo返回值
				if (cb_params.wxa_share_img) {
				  
				    this.wxa_share_img = cb_params.wxa_share_img
				  
				}
				
				//网站名称
				if (cb_params.wxa_shop_new_name) {
				  
				    this.wxa_shop_new_name = cb_params.wxa_shop_new_name
				  
				}
				
				
				uni.setNavigationBarTitle({
					title: '登录' + this.wxa_shop_new_name
				})
			
			},
			
			
			
			phoneInput:function(e){
				//console.log('Phone=',e)
				this.mobile = e.detail.value;
			},		
			imgInput: function (e) {
				//console.log('img=' + e.detail.value)
				this.img = e.detail.value;
			},

			telInput: function (e) {
				//console.log('tel=' + e.detail.value)
				this.tel = e.detail.value;
			},
			
			click_check: function (e) {
			
			    var that = this
			    uni.request({
					url: this.abotapi.globalData.yanyubao_server_url + '?g=Yanyubao&m=ShopAppWxa&a=get_tokenstr',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: "POST",
					success: function (res) {
						// console.log(res.data);
						that.tokenstr = res.data.tokenstr;		
						//console.log(res.data.tokenstr);			
						that.img_checkcode_url = that.abotapi.globalData.yanyubao_server_url + '?g=Yanyubao&m=ShopAppWxa&a=getverifycodeimg' + '&tokenstr=' + that.tokenstr
					}
				});
			},
			
			
			send_btn:function(){
				var that = this				  
				console.log(1111);
				  
				uni.request({
					url: this.abotapi.globalData.yanyubao_server_url + '?g=Yanyubao&m=ShopAppWxa&a=sendsms',
					data: {
						mobile: that.mobile,
						verifycode: that.img,
						sellerid: this.abotapi.globalData.default_sellerid,
						//verifycode_sms: that.second,
						tokenstr: that.tokenstr
					},
				    header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: "POST",
					success: function (request_data) {
						console.log(request_data.data)
						if (request_data.data.code == 1) {
							//将按钮设置为不可点击状态,同时显示倒计时
							countdown(that);
				  
							that.disabled = true
							//=====end======
					  
							uni.showModal({
								title: '提示',
								content: request_data.data.msg,
								showCancel: false,
							})
					
						}else {
				            uni.showModal({
								title: '提示',
								content: request_data.data.msg,
								showCancel: false,
				            })
				  
				            that.tokenstr = request_data.data.tokenstr;
							
							that.img_checkcode_url =  that.abotapi.globalData.yanyubao_server_url + '?g=Yanyubao&m=Xiaochengxu&a=getverifycodeimg' + '&tokenstr=' + that.tokenstr
			
						}
					}
				})
			},
			
			//获取用户信息（在微信、支付宝、百度小程序中有效，H5中无效）
			btn_wxa_get_userinfo:function(e){
				console.log('111111111111====>>>btn_wxa_get_userinfo====>>', e);
				
				this.btnWxaGetUserinfo(e);
			},
			
			//手机验证码登录
			btn_user_login: function () {
			    console.log('getUserInfo button click, and get following msg');
			    // console.log(userinfo);
				var that = this;
			    if (!this.mobile) {
					uni.showToast({
						title: '请输入手机号码！',
						icon: 'fail',
						duration: 2000
					})
					return;
			    }
			    if (!this.img) {
					uni.showToast({
						title: '请输入图片验证码！',
						icon: 'fail',
						duration: 2000
					})
					return; 
			    }
			    if (!this.tel) {
					uni.showToast({
						title: '请输入手机验证码！',
						icon: 'fail',
						duration: 2000
					})
					return;
			    }
				
				this.abotapi.abotRequest({
				    url: this.abotapi.globalData.yanyubao_server_url + '?g=Yanyubao&m=ShopAppWxa&a=login',
				    method: "POST",
				    data: { 
						mobile: that.mobile,
						verifycode_sms: that.tel,
						sellerid: this.abotapi.globalData.default_sellerid,
				    },
				    success: function (request_res) {
						console.log(4444444444444444444);
						console.log(request_res);
						var data = request_res.data;
						//var res = JSON.parse(data);
						//console.log(res);
						console.log(request_res.data);
						if (request_res.data && (request_res.data.code == 1)){
							console.log("update_mobile : check_button : ");
							console.log('登录成功返回userid:' + request_res.data.userid);
				        
				       
							that.abotapi.globalData.userInfo.user_openid = request_res.data.openid;
							that.abotapi.globalData.userInfo.userid = request_res.data.userid;          
							that.abotapi.globalData.userInfo.checkstr = request_res.data.checkstr;
							  
							//保存openid
							that.abotapi.set_current_openid(request_res.data.openid);
							console.log('更新缓存的用户信息:');
							console.log(that.abotapi.globalData.userInfo);
							  
							that.abotapi.set_user_info(that.abotapi.globalData.userInfo);
							  
				 
							that.getUserInfo();
							
							uni.showModal({
								title: '提示',
								content: request_res.data.msg,
								showCancel: false,
								success: function (res) {
									//console.log("回调结果"+res.code);
									if (res.confirm) {		 
									//=======检查登录成功之后的跳转=======
										var last_url = uni.getStorageSync('last_url');
				 
										
				 
										var page_type = uni.getStorageSync('page_type');
										
										console.log('last_url-----page_type ', last_url, page_type)
										
										
										if (last_url) {
											uni.removeStorageSync('last_url');
											uni.removeStorageSync('page_type');
											
											uni.reLaunch({
												url:last_url
											})
											return;
															 
															 
											if (page_type && (page_type == 'switchTab')) {
				 
												uni.switchTab({
													url: last_url,
												})
											} else {
												uni.redirectTo({
													url: last_url,
												})
											}
				 
											
											return;
										}
									//===========End================
				              
										uni.reLaunch({
											url: '/pages/tabBar/index/index'
										})
									}
								}
							});
						} else {
							console.log(request_res);
							uni.showToast({
								title: '登录失败',
								icon: 'fail',
								duration: 2000
							});
						}
				      
						console.log("延誉宝服务器解析jscode并返回以下内容：");
						console.log(request_res);
						// app.globalData.user_openid = request_res.data.openid;
						that.abotapi.globalData.tokenstr = request_res.data.tokenstr;
				    }
				});
				
			},
			 
				
			btn_wxa_one_click_login:function(e){
				var that = this;
				console.log(e.detail.errMsg)
				console.log(e.detail.iv)
				console.log(e.detail.encryptedData)
		  
				console.log('uni.login <<<==== btn_wxa_one_click_login');
		  
				uni.login({
					success: function (res) {
						console.log("btn_wxa_one_click_login 获取到的jscode是:" + res.code);
		  
						//如果拒绝授权， e.detail.errMsg
						//console.log(e.detail.errMsg);return;
		  
						that.abotapi.abotRequest({
							url: that.abotapi.globalData.yanyubao_server_url + '?g=Yanyubao&m=ShopAppWxa&a=wxa_one_click_login',
							method: "POST",
							dataType: 'json',
							data: {
								js_code: res.code,
								xiaochengxu_appid: that.abotapi.globalData.xiaochengxu_appid,
								iv: e.detail.iv,
								encryptedData: e.detail.encryptedData,
								sellerid: that.abotapi.globalData.default_sellerid,
								parentid: 0,
							},
							success: function (res) {
								console.log(res);
			  
								if (res.data && (res.data.code == 1)) {
									//更新checkstr和uwid，
									that.abotapi.globalData.userInfo.userid = res.data.userid;
									//this.abotapi.globalData.userInfo.checkstr = res.data.checkstr;
				  
									console.log('一键登录成功，userid:' + res.data.userid);
									console.log('一键登录成功，userid:' + res.data.openid);
				  
									that.abotapi.globalData.userInfo.user_openid = res.data.openid;
									that.abotapi.globalData.userInfo.userid = res.data.userid;
									that.abotapi.globalData.userInfo.checkstr = res.data.checkstr;
									that.abotapi.globalData.userInfo.is_get_userinfo = res.data.is_get_userinfo;
				  
									//保存openid
									that.abotapi.set_current_openid(res.data.openid);
					  
									console.log(that.abotapi.globalData.userInfo);
					  
									that.abotapi.set_user_info(that.abotapi.globalData.userInfo);
									
									that.getUserInfo();
									
									uni.showToast({
										title: res.data.msg,
										icon: 'success',
										duration: 2000
									})
				  
									//=======检查登录成功之后的跳转=======
									var last_url = uni.getStorageSync('last_url');
				 
									console.log('last_url-----', last_url)
				 
									var page_type = uni.getStorageSync('page_type');
									if (last_url) {
										if (page_type && (page_type == 'switchTab')) {
				 
											uni.switchTab({
												url: last_url,
											})
										} else {
											uni.redirectTo({
												url: last_url,
											})
										}
				 
										uni.removeStorageSync('last_url');
										uni.removeStorageSync('page_type');
				 
										return;
									}
									//===========End================

									uni.redirectTo({
										url: '/pages/tabBar/index/index'
									})
			
								}else {
									//一键登录返回错误代码
									uni.showModal({
										title: '提示',
										content: res.data.msg,
										showCancel:false,
										success(res) {
											if (res.confirm) {
												console.log('用户点击确定')
											}
										}
									})		  
								}
							}
						});
		  
					},
					fail: function (login_res) {
						console.log('login.js  uni.login失败。');
					}
				});
			},
			
			btnWxaGetUserinfo:function(e){
				var that = this;
				console.log(e.detail.errMsg)
				console.log(e.detail.iv)
				console.log(e.detail.encryptedData)
					  
				console.log('uni.login <<<==== btnWxaGetUserinfo');
					  
				uni.login({
					success: function (res) {
						console.log("btnWxaGetUserinfo 获取到的jscode是:" + res.code);
					  
						//如果拒绝授权， e.detail.errMsg
						//console.log(e.detail.errMsg);return;
					  
						that.abotapi.abotRequest({
							url: that.abotapi.globalData.yanyubao_server_url + '?g=Yanyubao&m=ShopAppWxa&a=wxa_get_userinfo',
							method: "POST",
							dataType: 'json',
							data: {
								js_code: res.code,
								xiaochengxu_appid: that.abotapi.globalData.xiaochengxu_appid,
								iv: e.detail.iv,
								encryptedData: e.detail.encryptedData,
								sellerid: that.abotapi.globalData.default_sellerid,
							},
							success: function (res) {
								console.log(res);
			  
								if (res.data && (res.data.code == 1)) {
									
									console.log('一键登录成功，userid:' + res.data.openid);
									
									//保存openid
									that.abotapi.set_current_openid(res.data.openid);
									
									
									that.abotapi.globalData.userInfo = that.abotapi.get_user_info();

									that.abotapi.globalData.userInfo.is_get_userinfo = 1;	//标志已经获取了头像和昵称
				  
									
					  
									console.log(that.abotapi.globalData.userInfo);
					  
									that.abotapi.set_user_info(that.abotapi.globalData.userInfo);
						  
									uni.showToast({
										title: res.data.msg,
										icon: 'success',
										duration: 2000
									})
				  
			
								}
							}
						});
					  
					},
					fail: function (login_res) {
						console.log('login.js  uni.login失败。');
					}
				});
			},
			
			tel:function(){
				if(this.notephone=='请输入手机号码'){
					this.notephone="";
				}else if(this.notephone==''){
					this.notephone='请输入手机号码'
				}
			},
			pass:function(){
				console.log(this.notepwd);
				if(this.notepwd=='请输入密码'){
					this.notepwd="";
				}else if(this.notepwd==''){
					this.notepwd='请输入密码'
				}
			},
			
			
			formSubmit:function(e){
				console.log('aaaaaaaaaaaaaaaaa====>>>>>formSubmit', e);
				
				var that=this;
				
				that.btn_user_login();
				 
			},
			
			
			//获取用户信息
			getUserInfo: function () {
				var userInfo = this.abotapi.get_user_info();
				var that = this;
				if(userInfo && userInfo.userid){
					this.abotapi.abotRequest({
						url: this.abotapi.globalData.yanyubao_server_url + '?g=Yanyubao&m=ShopAppWxa&a=get_user_info',
						data: {
							sellerid: this.abotapi.globalData.default_sellerid,
							checkstr: userInfo.checkstr,
							userid: userInfo.userid,
							appid: this.abotapi.globalData.xiaochengxu_appid,
						},
						
						method: "POST",
						success: function (res) {
							console.log('get_user_info====', res);
							uni.setStorageSync('userDelite',res.data.data)
					    }
					})
						
				}
					
			},
		}
	}
</script>

<style>

.send_btn{
	float: right;
	margin-top: -16upx;
	font-size: 30upx;
	padding: 0 40upx;
	margin-right: 8upx;
	background-color: #fff;
	color: #007aff;
	height:60upx;
	line-height: 60upx;
}

.flexIcon-icon-current{
	float:left;
}	
.img_checkcode{
	width: 25%;
	float: right;
	margin-top: -4upx;
	margin-right: 16upx;
	
}
	
	
	.otherBox {
	position: relative;
	height: 79.2upx;
}

.otherBox-line {
	width: 100%;
	height: 2.2upx;
	background-color: #d0d0d0;
	top: 39.6upx;
	position: absolute;
}

.otherBox-text {
	
	text-align: center;
	padding: 0upx 22upx;
	line-height: 79.2upx;
	position: absolute;
	width: 264upx;
	left: 50%;
	margin-left: -132upx;
	color: #444;
	font-size:34upx;
}

.flexIcon {
	flex-direction: row;
	background-color: #2e85d8;
	margin-bottom: 44upx;
	border-radius: 44upx;
	padding: 22upx 22upx;
	align-items: center;
	width: 90%;
	margin-left: 5%;
}

.flexIcon-icon {
	margin-right: 13.2upx;
	font-size: 39.6upx;
	color: #fff;
}

.flexIcon-text {
	color: #fff;
	border: 0;
	flex: 1;
	background:inherit;
	outline: 0;
	font-size: 35.2upx;
	display:block;
}
 
.loginBox {
	position: absolute;
	top: 50%;
	left: 22upx;
	right: 22upx;
	margin-top: -330upx;
	padding: 33upx 22upx;

	border-radius: 44upx;
}

.loginBg {
	background:  #EEEEEE/*linear-gradient( #29cee8,#619ad6)*/;
	background-color: ;
	position: absolute;
	top: 0upx;
	bottom: 0upx;
	left: 0upx;
	right: 0upx;
}
	
	


</style>
