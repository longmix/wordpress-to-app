<template>
	<view>
		<!-- 修改头像 -->
		<view class='tx_box' :style="{backgroundColor:wxa_shop_nav_bg_color}">
			<view style='height:30upx;'></view>
			<view class='btn1'>
				<image :src="user_info.fenxiao_info.headimgurl" @tap="upLoad()"></image>
			</view>
		</view>
		
		<!-- 修改昵称 -->
		<view class="user_list">
			<navigator :url="'/pages/usersetting/usersetting?nickname=1'">
				<view class="weui_cell">
					<view class="weui_cell_bd">
						<view class="weui_cell_bd_p"> 昵称 </view>
					</view>
					<view class="badge">{{user_info.fenxiao_info.nickname}}</view>
				</view>
			</navigator>
		</view>
		
		<!-- 修改手机号 -->
		<view class="user_list">
			<navigator :url="'/pages/usersetting/usersetting?mobile=1'">          
				<view class="weui_cell">      
					<view class="weui_cell_bd">
						<view class="weui_cell_bd_p"> 手机 </view>
					</view>
					<view class="badge">{{user_info.mobile}}</view>
				</view>
			</navigator>
		</view>
		
		
		<!-- 设置账号及密码 -->
		<view class="user_list">
			<navigator :url="'/pages/usersetting/usersetting?account=1'">
				<view class="weui_cell">      
					<view class="weui_cell_bd">
						<view class="weui_cell_bd_p">设置登录账号及密码</view>
					</view>
					<view class="badge"></view>
				</view>
			</navigator>
		</view>

		<button class='btn' @tap="logout" type="primary"> 退出登录 </button>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: '',
				user_info:'',
				userListInfo:[
					{ text:  '昵称' },
					{ text:  '账号' },
					{ text:  '手机' },
					{ text: '生日'}, 
				],
				userListInfo2: [
					{ text: '性别' },
					{ text: '地区' },
					{ text: '个性签名' },
				],
				headimgurl: "", // 头像图片路径  
				wxa_shop_new_name:'',
				wxa_shop_nav_bg_color:'',
				wxa_shop_nav_font_color:''
			}
		},
		
		//下拉刷新
		onPullDownRefresh: function () {
			var that = this;

			uni.removeStorageSync('user_info');
			
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1500);
		},
		
		onShow: function () {
			this.getPage();
		},
		onLoad: function(){
			this.abotapi.set_option_list_str(this, this.callback_function);		  
			var that = this
			var userInfo = this.abotapi.get_user_info();
			if ((!userInfo) || (!userInfo.userid)) {
				uni.redirectTo({
					url: '/pages/login/login',
				})
				return;
			}
			console.log(this.abotapi.globalData.yanyubao_server_url+'0100000')
		},
		
		methods: {
			//获取网站基础信息配置项
			callback_function:function(that, cb_params){
				
				if(!cb_params){
					return;
				}
				
				console.log('cb_params====', cb_params);
				//====1、更新界面的颜色
				this.abotapi.set_option_list_str(this,
					function(that001, option_list){
						that.abotapi.getColor();
						
							that.wxa_shop_nav_bg_color  = option_list.wxa_shop_nav_bg_color;
							
							that.wxa_shop_nav_font_color = option_list.wxa_shop_nav_font_color
					
					}
				);
				
				//网站名称
				if (cb_params.wxa_shop_new_name) {
				  
				    this.wxa_shop_new_name = cb_params.wxa_shop_new_name
				  
				}
				
				/*uni.setNavigationBarTitle({
					title:this.wxa_shop_new_name+'资料页'
				})*/
				this.getPage();
			},
			
			
			//清除登录状态
			logout: function () {
				this.abotapi.del_user_info();
			  
				var sellerid = this.abotapi.get_sellerid();
				if(typeof(sellerid) != 'undefined'){
					if(sellerid.length > 15){
						uni.clearStorageSync();
						console.log('清空完成，sellerid：'+this.abotapi.get_sellerid());
					}
				}
				
				uni.clearStorageSync();
				uni.switchTab({
					url: '/pages/index/index'
				});
			 
			},
			
				
			//获取用户信息
			getPage: function () {
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
							
							if (res.data.code == "-1") {
								var last_url = '/pages/usercenter/usercenter';
								this.abotapi.goto_user_login(last_url, 'switchTab');
							} else {
								var data = res.data;
								that.user_info = data.data;
								uni.setStorage({
									key:'user_info',
									data:that.user_info,
									success:function(){}
								})
								
								console.log('data2==>>',that.user_info);
							}
					    }
					})
						
				}
					
			},

			//上传并修改头像
			upLoad:function(){
				var that=this;
				var userInfo = this.abotapi.get_user_info();
				uni.chooseImage({
					success: function(chooseImageRes) {
						count:1;
						sizeType: ['compressed'];
						console.log("chooseImageRes",chooseImageRes);
						var headimgurl = chooseImageRes.tempFilePaths[0];
						//上传头像文件
						uni.uploadFile({
							url: that.abotapi.globalData.yanyubao_server_url + '?g=Yanyubao&m=ShopAppWxa&a=upload_image_file',
							filePath: headimgurl,
							name: 'file',
							formData: {
								sellerid: that.abotapi.globalData.default_sellerid,
								checkstr: userInfo.checkstr,
								userid: userInfo.userid,
							},
							success: function (res) {
								console.log('obj-res',res);
								// var obj = res.data;
								var obj = JSON.parse(res.data);
								console.log('obj',obj);
								if(obj.code == 1){
									//更新头像文件
									this.abotapi.abotRequest({
										url: that.abotapi.globalData.yanyubao_server_url + '?g=Yanyubao&m=ShopAppWxa&a=set_image_headimgurl', 
										data: {
											sellerid: that.abotapi.globalData.default_sellerid,
											checkstr: userInfo.checkstr,
											userid: userInfo.userid,
											img_url: obj.img_url
										},
										
										method: "POST",
										success: function (res) {
											uni.showToast({
												title: res.data.msg,
												icon: 'success',
												duration: 2000
											});
											that.user_info.headimgurl = obj.img_url;
										}
									});
								}
							}
						});
					}
				});
			},
		}
	    
	}    
</script>

<style>

	.weui_cell{
	    position: relative;
	    display: flex;
	    padding: 30upx;
	    -webkit-box-align: center;
	    -ms-flex-align: center;
	    align-items: center;
	    border-bottom: 2upx solid #dadada;
	}
	.weui_cell_hd{
	  display: inline-block;
	  width: 40upx;
	  margin-right: 10upx;
	}
	.weui_cell_hd image{
	  width: 100%;
	  height: 40upx;
	  vertical-align: -4upx;
	}
	.weui_cell_bd{
	  display: inline-block;
	}
	.weui_cell_bd_p{
	  font-size: 28upx;
	  color: #939393;
	}
	.badge{
	  position: absolute;
	  top: 36upx;
	  right: 80upx;
	  width: 440upx;
	  height: 40upx;
	  line-height: 40upx;
	  color: #333333;
	  
	  overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
	  text-align: right;
	  font-size: 24upx;
	}

	.btn{
	  width:80%;
	  line-height:60upx;
	  margin-top: 100upx;
	  margin-left: 10%;
	  padding: 19.2upx 48upx;
	  display: block;
		
	}
	.tx_box{
	  background-color:aliceblue;
	  height: 200upx;
	  display:flex;
	  justify-content:center;
	  align-items:center;
	}
	.btn1{
	   width: 140upx;
	   height: 140upx;
	   border-radius: 50%;
	   background-color: white;
	}
	
	.btn1 image{
	   width: 140upx;
	   height: 140upx;
	   border-radius: 50%;
	}
</style>
