<template>
	<view style="width: 100%;text-align: center;" v-if="SHOW">
		       
		<view style="width: 100%;display: flex;background: #FFFFFF;padding: 120rpx 0rpx;position: fixed;bottom: 0;z-index: 1000;">
			<view style="width: 25%;text-align: center;" @click="click_wxa_share">
				<image style="width: 100rpx;height: 100rpx;" src="https://yanyubao.tseo.cn/Tpl/static/images/app_icon/wxhyfx.png"></image>
				<view style="font-size: 28rpx;color: #333333;">好友</view>
			</view>
				
			<view style="width: 25%;text-align: center;" @click="click_wxa_circle_share">
				<image style="width: 100rpx;height: 100rpx;" src="https://yanyubao.tseo.cn/Tpl/static/images/app_icon/wxpyqfx.png"></image>
				<view style="font-size: 28rpx;color: #333333;">朋友圈</view>
			</view>
			
			<view style="width: 25%;text-align: center;" @click="click_wxa_applet_share">
				<image style="width: 100rpx;height: 100rpx;" src="https://yanyubao.tseo.cn/Tpl/static/images/app_icon/wxa.png"></image>
				<view style="font-size: 28rpx;color: #333333;">小程序</view>
			</view>
			
			<view style="width: 25%;text-align: center;" 
				@click="click_wxa_command_copy"
				v-if="flag_hidden_btn_command_copy != 1">
				<image style="width: 100rpx;height: 100rpx;" src="https://yanyubao.tseo.cn/Tpl/static/images/app_icon/kouling.png"></image>
				<view style="font-size: 28rpx;color: #333333;">分享口令</view>
			</view>
			
			<view style="width: 25%;text-align: center;" @click="click_wxa_system_share">
				<image style="width: 100rpx;height: 100rpx;" src="https://yanyubao.tseo.cn/Tpl/static/images/app_icon/share_more.png"></image>
				<view style="font-size: 28rpx;color: #333333;">更多...</view>
			</view>
			
		</view>
		<view style="font-size: 28rpx;color:#ccc;width: 100%;position: fixed;bottom: 0;padding-bottom: 50rpx;z-index: 1000;" @click="is_show_no">取消</view>
	</view>
	
</template>

<script>
	export default {
		name: 'abot_share_api',
		props: {
			flag_hidden_btn_command_copy:0,
		},
		data() {
			return {
				SHOW: false,
			};
		},
		created(){
			var _this = this;
		},
		onLoad(){
			
		},
		methods:{
			is_show_no:function(){
				this.SHOW = false;
			},
			is_show:function(){
				this.SHOW = true;
			},
			click_wxa_share:function(){
				this.$emit('click_wxa_share');
			},
			click_wxa_circle_share:function(){
				this.$emit('click_wxa_circle_share');
			},
			click_wxa_applet_share:function(){
				this.$emit('click_wxa_applet_share');
			},
			click_wxa_command_copy:function(){
				this.$emit('click_wxa_command_copy');
			},
			click_wxa_system_share:function(){
				this.$emit('click_wxa_system_share');
			}
		}
	}
</script>

<style>
	/* actionmenu 操作表样式 */
	.aui-actionmenu{
		width: 100vw;
		height: 100vh;
		opacity: 0;
		-ms-animation: aui-fade-in .1s ease-out forwards;
		-webkit-animation: aui-fade-in .1s ease-out forwards;
		animation: aui-fade-in .1s ease-out forwards;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.aui-actionmenu.aui-actionmenu-style-1 .aui-actionmenu-main{
		width: -webkit-calc(100vw - 20px);
		width: calc(100vw - 20px);
		max-height: 60vh;
		overflow: hidden;
		border-radius: 10px;
		background: #FFF;	
		font-size: 0;
		position: absolute;	
		left: 10px;
		z-index: 999;
	}
	.aui-actionmenu.aui-actionmenu-style-2 .aui-actionmenu-main{
		width: 100%;	
		max-height: 60vh;
		overflow: hidden;
		font-size: 0;
		background: #FFF;
		border-radius: 10px 10px 0 0;
		position: absolute;	
		left: 0px;
		z-index: 999;
	}
	.aui-actionmenu .aui-actionmenu-title{
		width: 100%;
		min-height: 50px;
		line-height: 25px;
		padding: 12px 10px;
		text-align: center;
		color: #646464;
		box-sizing: border-box;
		font-size: 16px;
		font-weight: 500;
		background: #FFF;
		position: relative;
	}
	.aui-actionmenu .aui-actionmenu-title:before,.aui-actionmenu .aui-actionmenu-title:after{
		content: '';
		width: 40px;
		height: 1px;
		-moz-transform: scaleY(.3);
		-ms-transform: scaleY(.3);
		-webkit-transform: scaleY(.3);
		transform: scaleY(.3);
		background: rgba(100,100,100,.4);
		position: absolute;
		bottom: 50%;
		z-index: 1;
	}
	.aui-actionmenu .aui-actionmenu-title:before{
		left: 25%;
	}
	.aui-actionmenu .aui-actionmenu-title:after{
		right: 25%;
	}
	.aui-actionmenu.aui-actionmenu-style-1.aui-actionmenu-bottom .aui-actionmenu-main{
		bottom: -40vh;
	}	
	.aui-actionmenu.aui-actionmenu-style-1.aui-actionmenu-bottom.aui-actionmenu-in .aui-actionmenu-main{
		-ms-animation: aui-slide-up .2s ease-out forwards;
		-webkit-animation: aui-slide-up .2s ease-out forwards;
		animation: aui-slide-up .2s ease-out forwards;		
	}
	.aui-actionmenu.aui-actionmenu-style-1.aui-actionmenu-bottom.aui-actionmenu-out .aui-actionmenu-main{
		-ms-animation: aui-slide-down .2s ease-out forwards;
		-webkit-animation: aui-slide-down .2s ease-out forwards;
		animation: aui-slide-down .2s ease-out forwards;		
	}
	.aui-actionmenu.aui-actionmenu-middle .aui-actionmenu-main{
		width: 80%;
		background: #FFF;
		top: 50%;
		left: 50%;
		webkit-transform: translate(-50%, -50%) scale(1.16);
		transform: translate(-50%, -50%) scale(1.16);	
		opacity: 0;
	}
	.aui-actionmenu.aui-actionmenu-style-1.aui-actionmenu-middle .aui-actionmenu-main{
		width: -webkit-calc(100% - 30px);
		width: calc(100% - 30px);
	}
	.aui-actionmenu.aui-actionmenu-middle.aui-actionmenu-in .aui-actionmenu-main{
		-ms-animation: aui-scale-in-tosmall-dialog .2s ease-out forwards;
		-webkit-animation: aui-scale-in-tosmall-dialog .2s ease-out forwards;
		animation: aui-scale-in-tosmall-dialog .2s ease-out forwards;
	}
	.aui-actionmenu.aui-actionmenu-middle.aui-actionmenu-out .aui-actionmenu-main{
		-ms-animation: aui-scale-out-tosmall-dialog .2s ease-out forwards;
		-webkit-animation: aui-scale-out-tosmall-dialog .2s ease-out forwards;
		animation: aui-scale-out-tosmall-dialog .2s ease-out forwards;
	}
	.aui-actionmenu.aui-actionmenu-style-2.aui-actionmenu-middle .aui-actionmenu-main{
		width: 80%;
		border-radius: 10px;
		background: #FFF;		
	}
	.aui-actionmenu.aui-actionmenu-style-2.aui-actionmenu-bottom .aui-actionmenu-main{
		bottom: -30vh;
		background: #FFF;
		border-radius: 10px 10px 0 0;		
	}
	.aui-actionmenu.aui-actionmenu-style-2.aui-actionmenu-bottom.aui-actionmenu-in .aui-actionmenu-main{
		-ms-animation: aui-slide-up-screen .2s ease-out forwards;
		-webkit-animation: aui-slide-up-screen .2s ease-out forwards;
		animation: aui-slide-up-screen .2s ease-out forwards;
	}
	.aui-actionmenu.aui-actionmenu-style-2.aui-actionmenu-bottom.aui-actionmenu-out .aui-actionmenu-main{
		-ms-animation: aui-slide-down-screen .2s ease-out forwards;
		-webkit-animation: aui-slide-down-screen .2s ease-out forwards;
		animation: aui-slide-down-screen .2s ease-out forwards;
	}
	.aui-actionmenu.aui-actionmenu-style-1 .aui-actionmenu-items{
		width: 100%;
		padding: 0 10px 10px 10px;
		box-sizing: border-box;
	}
	.aui-actionmenu.aui-actionmenu-style-2 .aui-actionmenu-items{
		width: 100%;
		padding: 0 10px 10px 10px;
		box-sizing: border-box;
		font-size: 0;
	}
	.aui-actionmenu .aui-actionmenu-item{
		width: 25%;
		padding: 10px;
		box-sizing: border-box;
		color: #333;
		border-radius: 3px;
		background: #FFF;
		text-align: center;
		display: inline-block;
		vertical-align: top;
		position: relative;
	}
	.aui-actionmenu .aui-actionmenu-item img{
		width: 70%;
	}
	.aui-actionmenu .aui-actionmenu-item .iconfont{
		font-size: 50px;
		display: inline-block;
		margin-bottom: 5px;
	}
	.aui-actionmenu .aui-actionmenu-item .aui-actionmenu-item-text{
		width: 100%;
		line-height: 15px;
		font-size: 14px;
		color: #333;
		margin: 5px 0 0 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.aui-actionmenu .aui-actionmenu-item.no-icon{
		width: 100%;
		height: 50px;
		line-height: 50px;
		padding: 0 25px 0 15px;
		box-sizing: border-box;
		font-size: 15px;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: inherit;
		color: #333;
		position: relative;
	}
	.aui-actionmenu .aui-actionmenu-item.no-icon .aui-actionmenu-item-text{
		width: 100%;
		line-height: 50px;
		margin: 0;
	}
	.aui-actionmenu .aui-actionmenu-cancle{
		width: 100%;
		height: 50px;
		line-height: 50px;
		font-size: 16px;
		color: #646464;
		text-align: center;
		background: #FFF;
		position: relative;
	}
	.aui-actionmenu.aui-actionmenu-style-1.aui-actionmenu-bottom .aui-actionmenu-cancle{	
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	.aui-actionmenu .aui-actionmenu-cancle:after{
		content: '';
		width: 100%;
		height: 1px;
		-moz-transform: scaleY(.3);
		-ms-transform: scaleY(.3);
		-webkit-transform: scaleY(.3);
		transform: scaleY(.3);
		background: rgba(100,100,100,.3);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
	.aui-actionmenu.aui-actionmenu-middle .aui-actionmenu-cancle{
		width: 30px;
		height: 30px;
		font-size: 0;
		color: transparent;
		position: absolute;
		top: 10px;
		right: 5px;
	}
	.aui-actionmenu.aui-actionmenu-middle .aui-actionmenu-cancle::before{
		content: '';
		width: 15px;
		height: 1px;
		background: #909090;
		position: absolute;
		top: -webkit-calc((100% - 1px) / 2);
		top: calc((100% - 1px) / 2);
		left: 7.5px;
		-moz-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
	}
	.aui-actionmenu.aui-actionmenu-middle .aui-actionmenu-cancle:after{
		content: '';
		width: 15px;
		height: 1px;
		background: #909090;
		position: absolute;
		top: -webkit-calc((100% - 1px) / 2);
		top: calc((100% - 1px) / 2);
		left: 7.5px;
		-moz-transform: rotate(-45deg);
		-ms-transform: rotate(-45deg);
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
	}
</style>
