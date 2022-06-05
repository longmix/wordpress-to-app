<template>
	<view>
		 <view class="mid-img" v-for="(item,index) in module_icon_list" :key="index">
		 <view class="head1" :style="{'border-left-color':item.left_color}">{{item.name}}</view>
			<view class="icn-con" v-for="item2 in item.subs" :key="item2.index" 
				:data-plugin_flag="item2.plugin_flag"
				:data-plugin_name="item2.plugin_name"
				:data-plugin_desc_basic="item2.plugin_desc_basic" 
				@tap="block_tanchuang">
				<image v-if="item2.plugin_flag" class="tips" src="https://yanyubao.tseo.cn/Tpl/static/images/bbq.png"></image>
				
				<image class="img-h" :src="item2.icon" :style="{'background-color':item2.background_color}"></image>
				
				<view class="txt-h">{{item2.name}}</view>
			</view>
			
			<!-- <view class="icn-con">
				<image class="img-h" src="../../static/wp-article-img/calendar.png"></image>
				<view class="txt-h">h5商城</view>
			</view>
			
			<view class="icn-con">
				<image class="img-h" src="../../static/wp-article-img/calendar.png"></image>
				<view class="txt-h">h5商城</view>
			</view> -->
							
		</view>
	</view>
	
</template>

<script>
	export default{
		data(){
			return{
				module_icon_list:'',
			}
		},
		onLoad(option){
			uni.setNavigationBarTitle({
				title:'常用功能列表'
			})
			
			this.abotapi.set_option_list_str(this, this.callback_set_option_list_str);
			
			
			this.get_yanyubao_module_list_for_tseo_cn();
		},
		//下拉刷新
		onPullDownRefresh: function () {
			var that = this;
			
			uni.showLoading({
				title: '数据加载中...',
			})
			
			uni.removeStorage({
				key: 'module_icon_list_cache',
				success:function(res008){
					console.log('success ===>>> ', res008);
					
					that.get_yanyubao_module_list_for_tseo_cn();
				}
			});
		
			setTimeout(function () {
				uni.stopPullDownRefresh();  //停止下拉刷新动画
				
				uni.hideLoading();
				
			}, 1500);
		},
		
		methods:{
			callback_set_option_list_str:function(that, option_list){
				that.abotapi.getColor();
			},
			
			//调用接口
			get_yanyubao_module_list_for_tseo_cn:function(){
				// console.log('jun')
				
				// if(this.abotapi.globalData.show_yanyubao_module_list != 1){
				// 	return;
				// }
				
				var that = this;
				
				var module_icon_list = uni.getStorageSync('module_icon_list_cache');
				
				console.log('module_icon_list===',module_icon_list)
				
				if(module_icon_list){
					//console.log('module_icon_list===',module_icon_list)
					
					that.module_icon_list = module_icon_list;
					return;
				}
				
				
				
				this.abotapi.abotRequest({
				    url:that.abotapi.globalData.yanyubao_server_url+'/Supplier/Login/show_yanyubao_module_list_for_tseo_cn',
				    method: 'get',
				    data:{
				
				    },
					
				    success(res) {
				    	console.log("show_yanyubao_module_list_for_tseo_cn ===>>> ",res)
						
						if(res.data.code == 1){
							var module_icon_list = res.data.data;
							
							
							// #ifdef MP-BAIDU
							
							//====== 过滤掉没有描述的模块 Begin ======
							for(let i=0; i<module_icon_list.length; i++){
								
								console.log('aaaa===>>>>', module_icon_list[i]['subs']);
								
								for(let j=0; j<module_icon_list[i]['subs'].length; j++){
									
									//console.log('bbbb===>>>>', module_icon_list[i]['subs'][j]);
									//console.log('cccc===>>>>', module_icon_list[i]['subs'][j]['plugin_flag']);
								
									if(module_icon_list[i]['subs'][j] && !module_icon_list[i]['subs'][j]['plugin_flag']){
										
										console.log('ddddd===>>>>', module_icon_list[i]['subs'][j]['plugin_flag']);
										
										module_icon_list[i]['subs'].splice(j, 1);	// 将使后面的元素依次前移，数组长度减1
										
										j = j-1;   //！！！！！！如果不减，将漏掉一个元素
									}
								}
								
								console.log('aaaa2222===>>>>', module_icon_list[i]['subs']);
								
							}
							//================ End ============
							
							// #endif
							
							
							
							//缓存数据
							uni.setStorage({
								key: 'module_icon_list_cache',
								data: module_icon_list,
								success:function(res008){
									console.log('success ===>>> ', res008);
								}
							})
							
							that.module_icon_list = module_icon_list
						}
				
				    },
				    fail: function (e) {
						uni.showToast({
							title: '网络异常！',
							duration: 2000
						});
				    },
				});
			},
			
			//模态弹窗事件
			block_tanchuang:function(e){
				
				console.log('block_tanchuang=======>>>>>', e);
				
				var plugin_flag = e.currentTarget.dataset.plugin_flag;
				
				if(plugin_flag && (plugin_flag == 1) ){
					var plugin_name = e.currentTarget.dataset.plugin_name;
					var plugin_desc_basic = e.currentTarget.dataset.plugin_desc_basic;
					
					uni.showModal({
					    title: plugin_name,
					    content: plugin_desc_basic,
						showCancel: false,
					    success: function (res) {
					        
					    }
					});
				}
				
				
				
				
				  
			},
			
			
		}
	}
</script>

<style>
	.mid-img{
      width: 100%;
	  overflow: hidden;
	  background-color:white;
	  margin-bottom:20upx;
	}
	.head1{
		border-left:10upx solid;
		font-size:40upx;
		margin-top: 20upx;
		padding-left: 20upx;
	}
	.icn-con{
		float: left;
		text-align: center;
		width: 33%;
		margin-top: 40upx;
		position: relative;
		padding-bottom: 30upx;
	}
	.icn-con .tips{
		width: 40upx;
		height: 40upx;
		position: absolute;
		right: 66upx;
		top: -20upx;
		z-index: 2;
	}
	.img-h{
		width:100upx;
		height:100upx;
		border-radius:20upx;
		padding: 15upx;
	}
	.txt-h{
		font-size: 30upx;
		margin-top: 10upx;
	}
</style>
