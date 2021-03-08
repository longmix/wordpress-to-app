<template>
	<view>
		<!-- 修改用户昵称 -->
		<view v-if="is_nickname">
			<view class="section">
				<input placeholder="请输入昵称" :value="nicknames"  @input="nameInput" auto-focus/>
			</view>
	
			<button class="btn" type="primary" @tap="keep_button"> 保存 </button>
		</view>
		
		<!-- 修改手机号码 -->
		<view v-if="is_mobile">
			<view class="section3">
				<input type="number" placeholder="请输入手机号" :value="mobile" name="mobile" @input="phoneInput" auto-focus/>
			</view>
			<view class="section3">
			    
				<image @tap="click_check" :src="img_checkcode_url"></image>
			    <input type="number" placeholder="请输入图片验证码"  @input="imgInput" auto-focus/>
			  
			</view>
			<view class="section3">
			    <button type="primary" :disabled="disabled"  @tap="send_btn" class="send_btn">{{second}}</button>
				<input type="number" placeholder="请输入手机验证码"  @input="telInput" auto-focus/>
			</view>
			
			<button type="primary" @tap="check_button" class="btn" >设置手机号码</button>
		</view>
		
		<!-- 设置或修改用户账号及密码 -->
		<view class="container" style='padding:0;' v-if="is_account">

			<form @submit="formSubmit">
				<view class="weui-cell">
					<view class="weui-label">账号</view>
					<input name="new_account" placeholder="请输入新账号" :value='account'></input>
				</view>
				<view class="weui-cell">
					<view class="weui-label">新密码</view>
					<input type="password" name="new_password" placeholder="请输入新密码"></input>
				</view>
				<view class="weui-cell">
					<view class="weui-label">确认密码</view>
					<input type="password" name="new_password2" placeholder="请再次输入新密码"></input>
				</view>
				<button class="btn bg-green" formType="submit">确认修改</button>
			</form>
			
		</view>
	</view>
</template>

<script>
	function countdown(that) {
		var timer001 = that.timer001;
		if (timer001 == 0) {
			//倒计时结束,恢复按钮可点击状态,同时内容设置为为 发送短信
			that.second = '发送短信';
			that.timer001 = 60;
			that.disabled = false
			return;
		}
		var time = setTimeout(function () {
			that.second = '重新发送('+timer001+')';
			that.timer001 = timer001 -1;
	
			countdown(that);
		}
		, 1000)
	}
	export default {
		data() {
			return {
				is_nickname:false,
				is_mobile:false,
				is_account:false,
				user_info:'',
				nicknames:'',
				name:'',
				second: '发送短信',
				mobile:"",
				disabled:false,
				timer001:60,
				img_checkcode_url:'',
				account:''
			}
		},
		
		
		
		
		onLoad:function(options){
			
			// 页面初始化 options为页面跳转所带来的参数
			var that = this
			if(options.nickname){
				that.is_nickname = true;
				
				uni.setNavigationBarTitle({
					title:'修改昵称'
				})
			}
			
			if(options.mobile){
				that.is_mobile = true;
				
				uni.setNavigationBarTitle({
					title:'更换手机号'
				})
			}
			
			if(options.account){
				that.is_account = true
				
				uni.setNavigationBarTitle({
					title:'修改账号和登录密码'
				})
			}
			
			uni.getStorage({
				key: 'user_info',
				success: function (res) {
					console.log('8976455460000000000000',res.data);
					
					that.user_info = res.data;
					that.nicknames = that.user_info.nickname;
					that.mobile = that.user_info.mobile;
					that.account = that.user_info.account;
				}
			})
			
			this.abotapi.abotRequest({
				url: this.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=Xiaochengxu&a=get_tokenstr',
			    
				method: "POST",
				success: function (res) {
			        //console.log(res.data);
					that.abotapi.globalData.tokenstr = res.data.tokenstr;
			
					that.img_checkcode_url = that.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=Xiaochengxu&a=getverifycodeimg' + '&tokenstr=' + res.data.tokenstr
			
			      }
			})
			
			
			this.abotapi.set_option_list_str(this, this.callback_function);
			
			/*if(!userInfo){
				userInfo = this.abotapi.get_user_info();
			}*/
	
			this.abotapi.check_user_login();
	    
		},
		
		onReady:function(){
			// 页面渲染完成
		},
		onShow: function () {
			
		},
		onHide:function(){
			// 页面隐藏
		},
		onUnload:function(){
			// 页面关闭
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
				
				
				
			},

			//获取输入的nickname
			nameInput: function(e) {
				console.log("e",e);
				// console.log('that.data' + that.data);
				var that = this;
			    if (e.detail.value == that.nicknames){
					that.name = e.detail.value;
				}else{
					that.nicknames = e.detail.value;
				}
			},
			//修改用户名字
			keep_button:function(){
				var that = this;
			    console.log('that.nicknames', that.nicknames);
			    console.log('that.name', that.name);
			    if(that.name == that.nicknames){
					uni.showToast({
						title: '保存成功',
						icon: 'success',
						duration: 2000
					});
					return;
			    }
				var userInfo = this.abotapi.get_user_info();
				console.log(1111555555);
				this.abotapi.abotRequest({
					url: this.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopAppWxa&a=user_info_save', 
					method: "POST",  
					data: {
						nickname:that.nicknames,
						checkstr:userInfo.checkstr,
						userid:userInfo.userid,
						sellerid: that.abotapi.globalData.default_sellerid,
					},    
					success:function(res){
						console.log('success',res);
						if(res.data.code == 1){
							uni.showToast({
								title: res.data.msg,
								icon: 'success',
								duration: 2000
							})
							return;
						}
						else if(res.data.code == 0){
							uni.showToast({
								title: '修改失败',
								icon: 'none',
								duration: 2000
							})
						}
					},
					fail:function(res){
						console.log('failfail',res)
					}
			    });
			
			},
			
			click_check: function (e) {
			
			    var that = this
			
				this.abotapi.abotRequest({
					url: this.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=Xiaochengxu&a=get_tokenstr',
			      
					method: "POST",
					success: function (res) {
						// console.log(res.data);
						that.abotapi.globalData.tokenstr = res.data.tokenstr;
			
						that.img_checkcode_url = that.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=Xiaochengxu&a=getverifycodeimg' + '&tokenstr=' + res.data.tokenstr
			
					}
			    });
			
			},
			
			phoneInput: function (e) {
				
			    this.mobile = e.detail.value;
			},
			
			imgInput: function (e) {
				
			    this.img = e.detail.value;
			},
			
			telInput: function (e) {
				
			    this.tel = e.detail.value;
			},

			//保存手机号码
			check_button: function () {
			    var that = this
				var userInfo = this.abotapi.get_user_info();
			    //console.log('手机号为:',this.data.mobile);
			    //发起网络请求update_mobile
			    //console.log(app.globalData.http_server);
				this.abotapi.abotRequest({
					url: this.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopAppWxa&a=set_user_mobile',
			     
					method: "POST",
					data: {
						new_mobile: this.mobile,
						verifycode_sms: this.tel,
						checkstr: userInfo.checkstr,
						sellerid: this.abotapi.get_sellerid(),
						userid: userInfo.userid
					},
					success: function (request_res) {
						//console.log('更新缓存的用户信息');
						if (request_res.data.code == 1) {              
							uni.showModal({
								title: '提示',
								content:request_res.data.msg,
								showCancel:false,
								success: function(res) {
									if (res.confirm) {
										return;
									}
								}
							})
			          
						} else {

							uni.showToast({
								title: request_res.data.msg,
								icon: 'fail',
								duration: 2000
							})
						}
					}
			    });
			},
			
			//获取图片验证码
			send_btn: function (e) {
			    var that = this
				var userInfo = this.abotapi.get_user_info();
			    console.log(1111);
			    //检查手机号码是否正确
			    if(!this.mobile){
					uni.showToast({
						title: '请输入手机号码！',
			            icon: 'fail',
			            duration: 2000
					})
					return;
			    }
			
			    if(!this.img){
					uni.showToast({
			            title: '请输入图片验证码！',
			            icon: 'fail',
			            duration: 2000
					})
					return;
			    }
			
			    this.abotapi.abotRequest({
			        url: this.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopAppWxa&a=sendsms_change_mobile',
					data: {
						mobile: this.mobile,
						verifycode: this.img,
						sellerid: this.abotapi.get_sellerid(),
						checkstr: userInfo.checkstr,
						userid: userInfo.userid,
						tokenstr: this.abotapi.globalData.tokenstr
					},
			      
					method: "POST",
					success: function (request_data) {
						console.log(request_data.data)
						if (request_data.data.code == 1) {

							countdown(that);
							that.disabled = true
							//=====end======
			          
			
							uni.showToast({
								title: request_data.data.msg,
								icon: 'none',
								duration: 5000
							})
			          
						} else {
							uni.showToast({
								title: request_data.data.msg,
								icon: 'fail',
								duration: 5000
							});
			
							that.abotapi.globalData.tokenstr = request_data.data.tokenstr;
							that.img_checkcode_url = that.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=Xiaochengxu&a=getverifycodeimg' + '&tokenstr=' + request_data.data.tokenstr
						}
					}
			    })
			},
			
			formSubmit: function (e) {
			    var new_account = e.detail.value.new_account;
			    var new_password = e.detail.value.new_password;
			    var new_password2 = e.detail.value.new_password2;
				
				var userInfo = this.abotapi.get_user_info();
			    if (!new_account) {
					uni.showToast({
						title: '账号不能为空',
						duration: 2000
					});
					return;
			    }
			
			
			    if(new_password.length<6){
					uni.showToast({
						title: '密码至少为6位',
						duration: 2000
					});
					return;
			    }
			
			    if (new_password != new_password2) {
					uni.showToast({
						title: '两次输入密码不一致',
						duration: 2000
					});
					return;
			    }
			    
			    this.abotapi.abotRequest({
					url: this.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopApp&a=set_user_password',
					data: {
						checkstr: userInfo.checkstr,
						userid: userInfo.userid,
						sellerid: this.abotapi.get_sellerid(),
						new_account: new_account,
						new_password: new_password,
					},
					method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
					success: function (res) {
						// success
						var code = res.data.code;
						if (code == "1") {
							uni.showToast({
								title: '修改成功！',
								duration: 2000
							});
							uni.navigateBack({
								delta: 1
							})
						} else {
							uni.showToast({
								title: '修改失败！',
								duration: 2000
							});
							return;
						}
						
					},
					fail: function () {
						uni.showToast({
							title: '网络异常！',
							duration: 2000
						});
					}
			    })
			},
		}
	}
</script>

<style>
	page{
	    background-color:#F0F0F0;  
	}
	
	
	/* 修稿用户昵称 */
	.section{
	    width:100%;
	    height:100upx;
	    background-color:#fff;
	    margin:20upx auto;
	}
	.section input{
	    width:100%;
	    height:100upx;
	    background-color:#fff;
	    margin:20upx auto;
	    padding-left:40upx;
	}

	/* 修改用户手机号码 */
	/* pages/update_mobile/update_mobile.wxss */

	.send_btn{
	    width: 25%;
	    height: 80%;
	    position: relative;
	    top: 10upx;
	    left: -5%;
	    font-size: 28upx;
	    float: right;

	}
	.section3{
	    width:90%;
	    height:96upx;
	    background-color:#fff;
	    margin:40upx auto 0;
	    position:relative;
	    border:2upx solid #17A8E2;
	    border-radius:42upx;
	}
	.section3 image{
	   width: 25%;
	   height: 80%;
	   position: relative;
	   top: 10upx;
	   left: -5%;
	   float: right;
	}
	
	.section3 input{
	   position: relative;
	   top: 20upx;
	   left: 6%;
	   width: 60%;
	}

	/*修改账号及密码*/
	/* pages/account_edit/account_edit.wxss */
	.weui-cell {
	    padding: 25upx 30upx;
	    display: flex;
	    -webkit-align-items: center;
	    font-size: 31upx;
	    border-bottom: 1upx solid #eee;

	}
	
	.weui-cell input{
		width: 100%;
		text-align: right;
		margin-right: 5%;

	}
	.weui-label {
		width: 30%;
	}

	.btn{
	  width:80%;
	  line-height:60upx;
	  margin-top: 100upx;
	  margin-left: 10%;
	  padding: 19.2upx 48upx;
	  display: block;
		
	}
	
</style>
