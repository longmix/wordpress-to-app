<script>
	import abot_data from 'abot_data.js';
	
	export default {
		onLaunch: function() {
			console.log('App Launch - wordpress vue')
			
			console.log('aa===>>>', abot_data);
			
			this.abotapi.globalData = abot_data.globalData;
			
			//如果不是强制使用sellerid，则存储临时的sellerid
			if(!this.abotapi.force_sellerid){
				
				console.log('没有强制设置sellerid，存储原始的：'+this.abotapi.globalData.default_sellerid);
				
				uni.setStorage({
					key:'org_sellerid',
					data:this.abotapi.globalData.default_sellerid
				})
			}
			
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
	/* 2021.10.25.
	@import "./common/dt-ui-uni.css";
	@import "./common/main.css";*/
	@import "./components/gaoyia-parse/parse.css";
	/*覆盖文本编辑器里面的图片的大小*/
	uni-rich-text img{ max-width: 100% !important;}
</style>
<style>
	
	* {
		/*font-size: 30rpx;*/
	}

	page {
		background: #FFFFFF;
		/*font-family: '微软雅黑';*/
	}

	.copyright_info {
		text-align: center;
		font-size: 25rpx;
		color: #666;
		padding-bottom: 80rpx;
	}

</style>