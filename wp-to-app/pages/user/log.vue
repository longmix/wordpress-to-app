<template>
	<view style="background-color: #e2e2e2;">

		<view class="headcolor">
			<view class="jifeng_box">
				<view style="margin-left: 20rpx;float: left;">余额</view>
				<view class="edit">	￥{{balance_total}}</view>
				<button type="text" v-if="current_balance_type == 'balance'" class="tixian" @click="tixian(e)"  :style="{backgroundColor:btn_color}"
				>提现</button>
					
				
			</view>

			<view class="select">
				<button :class="activeClass == index ? 'hover':'hover_li'"
				 @click="alloflist(index)">全部</button>
				<button :class="activeClass == index ? 'hover':'hover_li'" type="text" v-for="(item,index) in tag_list" :key="index"
				 @click="getItem(index,item)">{{item}}</button>
			</view>

			<view>
				<view class="balance_lists" v-for="(item,index) in log_list" :key="index">
					<view class="dabox_li">
						<view class="jifeng">￥{{item.balance}}</view>
						<view class="headboss">￥{{item.balance_total}}</view>
						
					</view>
					<view class="dabox" style="margin-top: 10rpx;">
						<view class="tag">{{item.tag}}</view>
						<view class="type">{{item.balance_msg}}</view>
						<view class="time">{{item.createtime}}</view>
					</view>
					
					
					<!-- <view style="width: 100%;height: 2rpx; background-color: #d3d3d3;margin-top:15rpx"></view> -->
				</view>
				<view class="bottom_tip" v-if="bottom_tip==1">我是有底线的！</view>
			</view>
			






		</view>

	</view>
</template>

<script>
	var _self,
		page = 1,
		timer = null;
	export default {
		data() {
			return {
				bottom_tip:'0',
				current_balance_type:'balance',
				page_size: 1,
				balance: '',
				balance_list: [],
				tag_list: '',
				log_list: [],
				tag:"",
				btn_color:'#ffff00',
				index:-1,
				balance_total:'0',
				activeClass: -1,
				loadingType: 0,
				contentText: {
					contentdown: "显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
			}

		},

		onLoad(option) {
			if(option.type && (option.type == 'zengkuan')){
				this.current_balance_type = 'balance_zengsong';
				
				uni.setNavigationBarTitle({
					title:'赠款明细'
				})
			}
			
			this.abotapi.set_option_list_str(this, function(that, option_list){
				that.abotapi.getColor();
				that.btn_color = that.abotapi.getColor();
				console.log('getColor===sss==', that.btn_color)
				
			});
			
			this.account_balance();
			this.tag_lists();
			
			_self = this;
		},
		onPullDownRefresh: function() {
			this.account_balance();
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1500);
		},
		onReachBottom: function() {
			this.page_size = this.page_size + 1;
			console.log('aaassssssssssssabbbb', this.page_size)
			this.account_balance();

		},
		methods: {
			account_balance: function() {
				var that = this;
				var balance = this.current_balance_type;
				var userInfo = this.abotapi.get_user_info();
				this.abotapi.abotRequest({
					url: this.abotapi.globalData.yanyubao_server_url + '/index.php/openapi/UserData/user_balance_list',
					method: 'post',
					data: {
						sellerid: that.abotapi.globalData.default_sellerid,
						checkstr: userInfo.checkstr,
						userid: userInfo.userid,
						balance_type_ext: balance,
						page_size: that.page_size,
						tag:that.tag,
					},
					success(res) {
						console.log('aaaabbbb', res);
						
						if(res.data.code != 1){
							that.bottom_tip = 1;
							console.log('aaaa6666bbbb', that.bottom_tip);
							return;
						}
						
						var data = res.data.data;
						that.balance_total = data.balance_total;
						that.tixian_url = data.tixian_url;
						console.log('8648151', that.tixian_url);
						// var balance_total = that.balance_total;
						console.log('aaaaaaaaasssssabbbb', that.balance_total);
						var log_list = data.log_list;
						console.log('log_list', log_list);
						var loglist = that.log_list;
						console.log('aaaaaaass', loglist);
						for (var i = 0; i < log_list.length; i++) {
							loglist.push(log_list[i]);
							console.log('aaaaa===ssss>>>', log_list[i])
						}
						that.log_list = loglist;
						console.log('aaaaa===>>>', that.log_list);
						
					},
					fail(error) {
						console.log('ccccccccccc', error)
					}
				})



			},

			tag_lists: function() {
				var that = this;
				var balance = this.current_balance_type;
				var userInfo = this.abotapi.get_user_info();
				this.abotapi.abotRequest({
					url: this.abotapi.globalData.yanyubao_server_url + '/index.php/openapi/UserData/user_balance_tag_list',
					method: 'post',
					data: {
						sellerid: that.abotapi.globalData.default_sellerid,
						checkstr: userInfo.checkstr,
						userid: userInfo.userid,
						balance_type_ext: balance,
						page_size: that.page_size,
					},
					success(res) {
						console.log('aaaabbbb', res)
						
						if(res.data.code != 1){
							that.bottom_tip = 1;
							console.log('aaaa6666bbbb', that.bottom_tip);
							return;
						}
						
						var data = res.data.data;
						that.tag_list = data;
						console.log('aaaabbsssssbb', that.tag_list)

					},
					fail(error) {

					}
				})
			},

			getItem: function(index,item) {
				this.activeClass = index; // 把当前点击元素的index，赋值给activeClass
				this.tag = item;
				console.log('aaaabbsssssbb====', this.tag)
				this.log_list = [];
				this.page_size =1;
				this.account_balance();
				
				
			},
			
			alloflist: function(index) {
				this.activeClass = index; // 把当前点击元素的index，赋值给activeClass
				this.log_list = [];
				this.tag = '';
				this.page_size = 1;
				this.account_balance();
				
				
				
			},
			tixian:function(index){
					this.activeClass = index; // 把当前点击元素的index，赋值给activeClass
					var url = this.tixian_url;
					
					var var_list = Object();
					console.log('redictToTopic to url ====>>>>>>', url);
					this.abotapi.call_h5browser_or_other_goto_url(url, var_list, '');
			},
			
			

		}

	}
</script>

<style>
	@import url("../user/user_log");
</style>
