<script>
	import abot_data from 'abot_data.js';
	
	export default {
		onLaunch: function() {
			console.log('App Launch - wordpress vue')
			
			console.log('aa===>>>', abot_data);
			
			this.abotapi.globalData = abot_data.globalData;
			
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
<style>
	
	* {
		font-size: 30rpx;
	}

	page {
		background: #FFFFFF;
		font-family: '微软雅黑';
	}

	.copyright_info {
		text-align: center;
		font-size: 25rpx;
		color: #666;
		padding-bottom: 80rpx;
	}

</style>