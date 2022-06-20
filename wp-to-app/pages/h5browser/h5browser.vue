<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	// var app = getApp();
	export default {
		data() {
			return {
				url: null,
				title: "",
				ret_page:'',
				share_title:'',
				share_image:'',
				share_path_extra_option:''
			}
		},
		
		onLoad: function (options) {
			
			
			this.abotapi.set_option_list_str(null, this.abotapi.getColor());
		
			if(options.ret_page){
				this.ret_page = options.ret_page
			}
		
			var self = this;
			
			uni.setNavigationBarTitle({
				title:self.abotapi.globalData.wxa_website_name
			})
		
			//console.log(decodeURIComponent(options.scene));
			console.log('options====1111',options);
		
			if (options.scene != null) {
				var url_value = decodeURIComponent(options.scene);
		
				console.log(url_value);
		
		        var url_data = url_value.split('@');
		        console.log(url_data);
		        console.log(url_data[1]);
		
		        if (url_data.length < 2) {
					//跳转到首页
					this.abotapi.call_h5browser_or_other_goto_url('/pages/index/index');
		        }
		
		        var url = 'https://www.abot.cn';
		        if (url_data[1] == 'weiduke_home') {
					url = 'https://cms.weiduke.com/index.php/Wap/Index/index/token/' + url_data[0] + '.shtml';
					//'/pages/user/https://yanyubao.tseo.cn/User/agent_income.html?oneclicklogin=%oneclicklogin%'
		
					
		
					if (url.indexOf('*') != -1) {
						url = url.replace("*", "?");
					}
						url = url
				}
		        else if (url_data[1] == 'shortu') {
					var short_code = url_data[0];
		
					uni.showLoading({
						title: '数据加载中……',
					});
		
					var url = this.abotapi.globalData.yanyubao_server_url + '/openapi/ShortUrl/get_url';
					var data = {
						sellerid: this.abotapi.get_sellerid(),
						code: short_code,
					};
					var cbSuccess = function (res) {
					uni.hideLoading();
		
		            if (res.data.code == 1) {
							url = res.data.longurl
		            }
		            else {
						uni.showModal({
							title: '错误',
							content: '网址不存在',
							success(res) {
								uni.navigateBack({
									delta: 2
								})
							}
						})
					}
				};
				var cbError = function (res) {
					uni.hideLoading();
				};
					this.abotapi.httpPost(url, data, cbSuccess, cbError);
		
					return;
		        }
		        
			}
			else if (options.url != null) {
		
				var extra_option_str = '';
				
				
		
		
		        //判断分享转发的特殊参数
		        Object.keys(options).forEach(function (key) {
		
					//console.log(key, obj[key]);
					if (key != 'url'){
						extra_option_str += key+'='+options[key]+'&';
					}
		        });
		
		        if(extra_option_str.length > 2){
					extra_option_str = extra_option_str.substr(0, extra_option_str.length - 1);
		
					this.share_path_extra_option = extra_option_str
		        }
		
		        if(options.share_title){
					
					this.share_title = options.share_title
				
		        }
		
		        if (options.share_image) {
				
					this.share_image = options.share_image
			
		        }
				
				console.log('111111111111111111111======>>>>'+options.url);
				
				this.url = decodeURIComponent(options.url)
		        
		      }
				else {	
					this.url = 'https://www.abot.cn'
				}
		
		    },
		methods: {
			
		}
	}
</script>

<style>

</style>
