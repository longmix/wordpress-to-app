<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			
			//判断是否是关闭状态，如果是，跳转到指定page，并显示关站提示。
			this.abotapi.set_option_list_str(null, function(that, res){
				console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', res);
				
				if(res.shutdown_website_status == 1){
					//跳转到网站关闭的提示页面
					console.log("???????????");   
					uni.reLaunch({
						url:'/pages/shutdown_website/shutdown_website'
					})
					return;
				}
				
			});
			
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./common/index.css";
	@import "./common/icon.css";
	@import "./common/iconfont.css";
	@import "./common/dt-ui-uni.css";
	@import "./common/main.css";
	@import "./components/gaoyia-parse/parse.css";
	/*覆盖文本编辑器里面的图片的大小*/
	uni-rich-text img{ max-width: 100% !important;}
</style>
