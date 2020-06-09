<template>
	<view class="usercenter-container">
		<!-- 电子会员卡 -->
		<view style="width:100%;height:350upx;margin-top: 15upx;">
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
		<view class="daohang_box" :style="{display:show_daohang_box}">
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
		</view>

		<!-- 工具栏 -->
		<view class="toolbar">
			<view class="title">我的工具栏</view>
			<view class="list">
				<view class="box" v-for="(row,index) in gooosList" :key="index" @tap="toPage(row.url)">
					<view class="img">
						<image :src="row.src"></image>
					</view>
					<view class="text">{{row.name}}</view>
				</view>
			</view>
		</view>
		
		<!-- 网站版权 -->
		<view class="copyright" v-if="copyright_text">{{copyright_text}}</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				gooosList:'',
				user_info:'',
				wxa_shop_new_name:'',
				wxa_shop_operation_logo_url:'',
				copyright_text:'',
				vip_detail:'',
				user_function_icon_type:0,
				data2:'',
				vip_member_no:'0123456789',
				show_daohang_box:'block',
			}
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
		
		onShow:function() {
			this.abotapi.set_option_list_str(this, this.callback_function);
			
			this.getPage();
			
			this.getVIP();
			
			
			

		},
		
		onLoad: function (options) {  
		    var that = this;
			
			this.abotapi.set_option_list_str(this, function(that, cb_params){
				//====1、更新界面的颜色
				that.abotapi.getColor();
			});
			
			
		},

		methods: {
			//获取网站基础信息配置项
			callback_function:function(that, cb_params){
				
				console.log('cb_params====', cb_params);
				
				if(!cb_params){
					return;
				}
				
				
				
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
								
				
				if(cb_params.user_function_icon_type == -1){
					this.gooosList = cb_params.user_function_icon_list;
				}
				else{
					this.user_function_icon_type = cb_params.user_function_icon_type
					this.getToolIcon();
				}
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
								if(data &&(data.code == 1)){
									that.data2 = data.data;
									console.log('data2==>>',that.data2);
									
									if(data.data && data.data.fenxiao_info && data.data.fenxiao_info.member_no){
										that.vip_member_no = data.data.fenxiao_info.member_no;
									}
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
					
					var last_url = '/pages/usercenter/usercenter';
					this.abotapi.goto_user_login(last_url,'switchTab');
					return;
				}
				uni.navigateTo({
					url:'/pages/userinfo/userinfo'
				})
			},
			
			
			//工具栏图标跳转
			toPage:function(url){
				var userInfo = this.abotapi.get_user_info();
				if(!userInfo || userInfo == null){
					
					var last_url = '/pages/usercenter/usercenter';
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
				    url: this.abotapi.globalData.yanyubao_server_url + '?g=Yanyubao&m=ShopAppWxa&a=get_shop_icon_list',
				    method: 'post',
				    data: {
						icon_type:that.user_function_icon_type,
						sellerid: this.abotapi.globalData.default_sellerid,
					},
				    
				    success: function (res) {
						console.log('kaafff===', res);
						var productlist = res.data.data;
						console.log('akafff===', productlist);
						that.gooosList = productlist
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
				
				this.abotapi.set_wordpress_data_list(this, function(that002, data){
					
					console.log("会员卡的设置信息为=====>>>", data.card_data);
					
					that002.vip_detail = data.card_data;
					
					
				});
				
				
			}
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
		/* margin: 15upx 4% 0 4%; */
		padding: 0 0 20upx 0;
		background-color: #fff;
		box-shadow: 0upx 0upx 25upx rgba(0,0,0,0.1);
		border-radius: 15upx;
		margin-top: 15upx;
	}
	
	
	.box{
		width: 25%;
		margin-bottom: 30upx;
	}
	
	
	.img{
		width: 100%;
		height: 80upx;
		display: flex;
		justify-content: center;
	}
	
	.img image{
		width: 80upx;
		height: 80upx;
	}
	
	
	.text{
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 26upx;
		color: #3d3d3d;
		margin-top:20upx;
	}
	
	.list{
		display: flex;
		flex-wrap: wrap;
		padding:10upx;
	}
	
	.title{
		padding-top: 10upx;
		margin: 0 0 10upx 3%;
		font-size: 30upx;
		height: 80upx;
		display: flex;
		align-items: center;
	}
	
	.daohang_box{
		width: 100%;
		font-size: 24upx;
		color: #333333;
		margin-top: 15upx;
		border-radius: 15upx;
		background: #ffffff;
		overflow: auto;	
	}
	
	.biaoti_box{
		width: 33%;
		text-align: center;
		padding: 10upx;
		float: left;
		margin-top: 16upx;
		font-size: 30upx;
	}
	.text2{
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 31upx;
		color: #3d3d3d;
	}
	.num{
		font-size: 32upx;
	}
	
	
	.cardNo {
		margin:0 10%;
		width: 80%;
		height: 100%;		
		border-radius: 20upx;
		background-image: url(../../static/img/usercenter/vip.jpg);
		background-size: 100%;
		background-repeat: no-repeat;
	}
	
	.cardNoIMG{
		width: 140upx;
		height: 140upx;
		margin: 30upx 20upx 0 30upx;
		border-radius: 50%;
		background-color: #FFFFFF;
		display:block;
		float:left;
		box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
	}
	
	.cardNoIMG2{
		width: 140upx;
		height: 140upx;
		margin: 30upx 20upx 0 30upx;
		border-radius: 50%;
	}
	
	.cardtop{
		width: 100%;
		height: 50%;
		/* background-color: #9000FF; */
	}
	.cardbottom{
		width: 100%;
		height: 20%;
		/* background-color: #2bf666; */
		text-align: right;
		padding-right: 30px;
	}
	
	.card_top_text{
		font-size: 36upx;
		position: relative;
		top: -80upx;
		left: 207upx;
		color: #2F80FF;
	}
	
	.card_detail{
		font-size: 32upx;
		position: relative;
		top: -60upx;
		left: 192upx;
		color: #EA842F;
	}
	
	.card{
		font-size: 34upx;
		color: #2F80FF;
		position: relative;
		top: 40upx;
		left: 225upx;

	}
	
	.card_num{
		font-size: 40upx;
		color: #2F80FF;
	}
	.input4{
		font-size: 30upx;
		    float: left;
		    display: block;
		    margin-top: 50upx;
			    width: 50%;

	}
	
	.input3{
		font-size: 20upx;
		    float: left;
		    display: block;
		    margin-top: 8upx;
	}
</style>
