<template>
	<view class="usercenter-container">
		<!-- 电子会员卡 -->
		<view class="ecard_box">
			<view  class="cardNo" :style="[{'background-image':'url('+ vip_detail.card_bg_img +')' }]">
				<view class="cardtop" @tap="toUserInfo">
					<image class="cardNoIMG" :src="data2 && data2.fenxiao_info.headimgurl?data2.fenxiao_info.headimgurl:vip_detail.card_logo"></image>
					<!--<input type="text" :style="{color:vip_detail.card_name_color}" class="input4" disabled="disabled" :value="vip_detail.card_name" />
					<input type="text" :style="{color:vip_detail.card_desc_color}" class="input3" disabled="disabled" :value="vip_detail.card_desc" />
					-->
					<text class="input4" :style="{color:vip_detail.card_name_color}">{{vip_detail.card_name}}</text>
					<text class="input3" :style="{color:vip_detail.card_desc_color}">{{vip_detail.card_desc}}</text>
				</view>
				<view class="cardbottom">
					<text class="card_num" :style="{color:vip_detail.card_no_color}">{{vip_member_no}}</text>
				</view>
			</view>
			
			
		</view>
		
		<!-- 赠款、余额、积分 -->
	<!-- 	<view class="daohang_box" :style="{display:show_daohang_box}">
			<view class="biaoti_box">
				<view class="num" v-if="data2 && data2.fenxiao_info && data2.fenxiao_info.balance_yuan">{{data2.fenxiao_info.balance_yuan}}</view>
				<view class="num" v-else>88.88</view>
				<view class="text2">余额</view>
			</view>
			
			<view class="biaoti_box">
				<view class="num" v-if="data2 && data2.fenxiao_info && data2.fenxiao_info.balance_zengsong_yuan">{{data2.fenxiao_info.balance_zengsong_yuan}}</view>
				<view class="num" v-else>88.88</view>
				<view class="text2">赠款</view>
			</view>
			<view class="biaoti_box">
				<view class="num" v-if="data2 && data2.fenxiao_info && data2.fenxiao_info.score">{{data2.fenxiao_info.score}}</view>
				<view class="num" v-else>888</view>
				<view class="text2">积分</view>
			</view>
		</view> -->

		<!-- 余额显示 积分显示-->
		
		<view class="jifeng_box" :style="{display:show_daohang_box}">
			
				<view class="money_box">
					余额
					<view @tap="toPage('/pages/user/log')" class="num" style="align-items: center;">{{balance_total}}</view>
				</view>
				
				<view @tap="toPage('/pages/user/log?type=zengkuan')" class="money_box" style="border-left: 1px solid #c3c3c3;">
					赠款
					<view class="num">{{balance_zengkuan_total}}</view>
				</view>
				
				<view @tap="toPage('/pages/user/logscore')" class="money_box" style="border-left: 1px solid #c3c3c3;">
					积分
					<view class="num">{{balance_score_total}}</view>
				</view>
			
		</view>
		
		<!-- 平铺图片 -->
		<view style="width: 100%;margin: 0;" v-if="wxa_usercenter_ad_list">
			<image style="width: 100%;" @tap="toUrl(item.url)" v-for="(item,index) in wxa_usercenter_ad_list" :key="index" :src="item.image"
			 mode="widthFix"></image>
		</view>
		
		<!-- 工具栏 -->
		<view class="toolbar">
			<view class="title">我的工具栏</view>
			<view class="list">
				<view class="box" v-for="(row,index) in tool_icon_list" :key="index" @tap="toPage(row.url)">
					<view class="img">
						<image :src="row.src"></image>
					</view>
					<view class="text">{{row.name}}</view>
				</view>
				
				<view class="box" 
					v-if="usercenter_show_scan_qrcode == 1"
					@tap="toMyQR">
					<view class="img">
						<image src="https://yanyubao.tseo.cn/Tpl/static/images/scan_qrcode.png"></image>
					</view>
					<view class="text">扫一扫</view>
				</view>
				
			</view>
		</view>
		
		<!-- 隐私协议 -->
		<view style="display: flex;justify-content: center;margin: 30rpx;align-items: center;">
			
			<view style="color: #0055FF;float: left;font-size: 30rpx;margin-right: 10rpx;" 
				@tap="toUrl(yinsixieyi_url)">服务协议</view>
			|
			<view style="color: #0055FF;float: left;font-size: 30rpx;margin-left: 10rpx;"
				@tap="toUrl(yinsixieyi_url)">隐私政策</view>
		</view>
		<!-- end -->
		
		<!-- 网站版权 -->
		<view class="copyright" v-if="copyright_text">{{copyright_text}}</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				tool_icon_list:'',
				user_info:'',
				wxa_shop_new_name:'',
				wxa_shop_operation_logo_url:'',
				copyright_text:'',
				vip_detail:'',
				user_function_icon_type:0,
				data2:'',
				vip_member_no:'0123456789',
				show_daohang_box:'block',
				
				balance_total:'888.88',
				balance_zengkuan_total:'888.88',
				balance_score_total:'88888',
				
				
				wxa_usercenter_ad_list: [], //平铺图片
				
				usercenter_show_scan_qrcode:0, // 扫一扫图标
				
				//隐私协议网址
				yinsixieyi_url:'',
				
			}
		},
		onLoad: function (options) {  
		   var that = this;
			
			/*this.abotapi.set_option_list_str(this, function(that, cb_params){
				//====1、更新界面的颜色
				that.abotapi.getColor();
			});
			*/
		   this.abotapi.set_option_list_str(this, this.callback_function);
			
			this.yinsixieyi_url = this.abotapi.globalData.yinsixieyi_url;
		},
		onShow:function() {
			
			
			this.getPage();
			
			this.getVIP();
		},
		//下拉刷新
		onPullDownRefresh: function () {
			var that = this;
			
			this.getPage();
			
			this.getVIP();
			
			this.abotapi.set_option_list_str(this, this.callback_function);
			
			
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1500);
		},

		methods: {
			//获取网站基础信息配置项
			callback_function:function(that, cb_params){
				
				console.log('cb_params====', cb_params);
				
				if(!cb_params){
					return;
				}
				
				
				//显示 余额  积分 和 赠款
				if (cb_params.hidden_balance_zengkuan_score &&
					(cb_params.hidden_balance_zengkuan_score == 1)) {
					this.show_daohang_box = 'none';
				}
				else{
					this.show_daohang_box = 'block';
				}
				
				
				
				//网站版权
				if (cb_params.copyright_text) {	
					this.copyright_text = cb_params.copyright_text
				}
				
				//网站名称
				if (cb_params.wxa_shop_new_name) {
				    this.wxa_shop_new_name = cb_params.wxa_shop_new_name
				}
				
				//网站头像
				if (cb_params.wxa_shop_operation_logo_url) {
				    this.wxa_shop_operation_logo_url = cb_params.wxa_shop_operation_logo_url
				}
				
				
				// 设置网站名称
				uni.setNavigationBarTitle({
					title:this.wxa_shop_new_name
				})
				
				
				//广告图片
				if (cb_params.wxa_usercenter_ad_list) {
					this.wxa_usercenter_ad_list = cb_params.wxa_usercenter_ad_list;
				}
				
				
								
				//九宫格图标：如果是-1，代表使用自定义配置
				if(cb_params.user_function_icon_type == -1){
					this.tool_icon_list = cb_params.user_function_icon_list;
				}
				else{
					this.user_function_icon_type = cb_params.user_function_icon_type
					this.getToolIcon();
				}
				
				//显示 扫一扫功能图标
				// #ifndef H5
					if (cb_params.usercenter_show_scan_qrcode) {
						this.usercenter_show_scan_qrcode = cb_params.usercenter_show_scan_qrcode;
					}
				// #endif
				
				
			},
			
			//获取用户信息
			getPage: function () {
				var userInfo = this.abotapi.get_user_info();
				
				if(!userInfo){
					return;
				}
				
				
				var that = this;
				
				if(userInfo && userInfo.userid){
					this.abotapi.abotRequest({
						url: this.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopAppWxa&a=get_user_info',
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
								var last_url = '/pages/index/usercenter';
								this.abotapi.goto_user_login(last_url, 'switchTab');
							} else {
								var data = res.data;
								if(data &&(data.code == 1)){
									that.data2 = data.data;
									console.log('data2==>>',that.data2);
									
									if(data.data && data.data.fenxiao_info && data.data.fenxiao_info.member_no){
										that.vip_member_no = data.data.fenxiao_info.member_no;
									}
									
									that.balance_total = that.data2.fenxiao_info.balance_yuan;
									that.balance_zengkuan_total = that.data2.fenxiao_info.balance_zengsong_yuan;
									that.balance_score_total = that.data2.fenxiao_info.score;
								}
								
								
								
							}
					    }
					})		
				}	
			},
			
			
			//跳转至用户信息详情页
			toUserInfo:function(){
				var userInfo = this.abotapi.get_user_info();
				if(!userInfo || userInfo == null){
					
					var last_url = '/pages/index/usercenter';
					this.abotapi.goto_user_login(last_url,'switchTab');
					return;
				}
				uni.navigateTo({
					url:'/pages/user/userinfo'
				})
			},
			
			//跳转至积分，或是余额详情页
			tolog:function(){
				uni.navigateTo({
				    url: '/pages/user/log'
				});
			},
			
			tologscore:function(){
				uni.navigateTo({
				    url: '/pages/user/logscore'
				});
			},
			
			//工具栏图标跳转
			toPage:function(url){
				var userInfo = this.abotapi.get_user_info();
				if(!userInfo || userInfo == null){
					
					var last_url = '/pages/index/usercenter';
					this.abotapi.goto_user_login(last_url,'switchTab');
					return;
				}
				
				var var_list = Object();
				console.log('toAdDetails- to url ====>>>>>>', url);
				this.abotapi.call_h5browser_or_other_goto_url(url, var_list, '');
			},
			
			//获取工具栏功能图标
			getToolIcon:function(){
				var that = this;
				this.abotapi.abotRequest({
				    url: this.abotapi.globalData.yanyubao_server_url + '/?g=Yanyubao&m=ShopAppWxa&a=get_shop_icon_list',
				    method: 'post',
				    data: {
						icon_type:that.user_function_icon_type,
						sellerid: this.abotapi.globalData.default_sellerid,
					},
				    
				    success: function (res) {
						console.log('kaafff===', res);

						that.tool_icon_list = res.data.data;
						
						console.log('akafff===', that.tool_icon_list);
						
				    },
					
				    fail: function (e) {
						uni.showToast({
							title: '网络异常！',
							duration: 2000
						});
				    },
				});
			},
			
			
			// 后台获取电子会员卡信息
			getVIP:function(){
				var that002 = this;
				
				this.abotapi.set_shop_option_data(this, function(that002, data){
					
					console.log("会员卡的设置信息为=====>>>", data.card_data);
					
					that002.vip_detail = data.card_data;
					
					
				});
				
				
			},
			
			toUrl: function(url) {
				this.abotapi.call_h5browser_or_other_goto_url(url);
			},
			//使用二维码扫码工具
			toMyQR() {
				// uni.navigateTo({
				// 	url:'/pages/user/myQR/myQR'
				// })
				var that = this;
			
				uni.scanCode({
					success: function(res) {
						console.log('res===', res);
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
			
						var result = res.result;
						if ((result.indexOf('http://') == 0) ||
							(result.indexOf('https://') == 0) ||
							(result.indexOf('/') == 0)) {
							var var_list = Object();
			
							//这个地方不能调用 decodeURIComponent， 
							//因为此时的网址中还包含 %oneclicklogin%（扫码登录的场景），遇到  % 都有转为 %25 才可以。
							//result = decodeURIComponent(result);							
							//console.log('条码内容==>>decodeURIComponent==>>：' + result);
			
							that.abotapi.call_h5browser_or_other_goto_url(result, var_list);
						} else {
							uni.showModal({
								title: '提示',
								content: result,
								showCancel: false,
								success: function(res) {
			
								}
							});
						}
			
					}
				});
			
			
			},
			
			
			
			
		}
	}
</script>

<style>
	/**app.wxss**/
	
	.usercenter-container {
	  width: 100%;
	  height: 100%;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: space-between;
	  box-sizing: border-box;
	}

	.toolbar{
		width: 100%;
		/* margin: 15rpx 4% 0 4%; */
		padding: 0 0 20rpx 0;
		background-color: #fff;
		box-shadow: 0rpx 0rpx 25rpx rgba(0,0,0,0.1);
		border-radius: 15rpx;
		margin-top: 15rpx;
	}
	
	
	.box{
		width: 25%;
		margin-bottom: 30rpx;
	}
	
	
	.img{
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: center;
	}
	
	.img image{
		width: 80rpx;
		height: 80rpx;
	}
	
	
	.text{
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 26rpx;
		color: #3d3d3d;
		margin-top:20rpx;
	}
	
	.list{
		display: flex;
		flex-wrap: wrap;
		padding:10rpx;
	}
	
	.title{
		padding-top: 10rpx;
		margin: 0 0 10rpx 3%;
		font-size: 30rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
	}
	
	.daohang_box{
		width: 100%;
		font-size: 24rpx;
		color: #333333;
		margin-top: 15rpx;
		border-radius: 15rpx;
		background: #ffffff;
		overflow: auto;	
	}
	
	.biaoti_box{
		width: 33%;
		text-align: center;
		padding: 10rpx;
		float: left;
		margin-top: 16rpx;
		font-size: 30rpx;
	}
	.text2{
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 31rpx;
		color: #3d3d3d;
	}
	
	.money_box{
		float: left;
		display: block;
		text-align: center;
		width: 33%;
		margin-top: 35rpx; 
		line-height: 45rpx;
		font-size:28rpx;
		
	}
	.num{
		font-size: 36rpx;
	}
	
	
	.cardNo {
		margin:0 10%;
		width: 80%;
		height: 100%;		
		border-radius: 20rpx;
		background-image: url('https://yanyubao.tseo.cn/Tpl/static/wordpress/vip.jpg');
		background-size: 100%;
		background-repeat: no-repeat;
	}
	
	.cardNoIMG{
		width: 140rpx;
		height: 140rpx;
		margin: 30rpx 20rpx 0 30rpx;
		border-radius: 50%;
		background-color: #FFFFFF;
		display:block;
		float:left;
		box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
	}
	
	.cardNoIMG2{
		width: 140rpx;
		height: 140rpx;
		margin: 30rpx 20rpx 0 30rpx;
		border-radius: 50%;
	}
	
	.cardtop{
		width: 100%;
		height: 50%;
		/* background-color: #9000FF; */
	}
	.cardbottom{
		width: 90%;
		height: 50rpx;
		line-height: 50rpx;
		/* background-color: #2bf666; */
		text-align: right;
		margin-right: 50rpx;
	}
	
	.card_top_text{
		font-size: 36rpx;
		position: relative;
		top: -80rpx;
		left: 207rpx;
		color: #2F80FF;
	}
	
	.card_detail{
		font-size: 32rpx;
		position: relative;
		top: -60rpx;
		left: 192rpx;
		color: #EA842F;
	}
	
	.card{
		font-size: 34rpx;
		color: #2F80FF;
		position: relative;
		top: 40rpx;
		left: 225rpx;

	}
	
	.card_num{
		font-size: 30rpx;
		color: #2F80FF;
		margin-left: 170rpx;
	}
	.input4{
		font-size: 30rpx;
		    float: left;
		    display: block;
		    margin-top: 50rpx;
			    width: 50%;

	}
	
	.input3{
		font-size: 20rpx;
		    float: left;
		    display: block;
		    margin-top: 8rpx;
	}
	
	.ecard_box {
		width:100%;height:350rpx;margin-top: 15rpx;margin-bottom: 15rpx;
	}
	
	.jifeng_box{
		width: 100%;
		height: 150rpx;
		background-color: #FFFFFF;
		border-radius: 15rpx;
	}
	
</style>
