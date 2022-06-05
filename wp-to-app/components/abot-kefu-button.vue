<template>
	<view>
		<view class="u-tap-btn" v-if="wap_h5_show_kefu_button==1">
			<block v-if="wap_h5_kefu_bg_no_color_flag == 0">
				<button plain="true" class="u-go-home2" @tap="onNavRedirect(wap_h5_kefu_form_url)"
					:style="{backgroundColor:wap_h5_kefu_bg_color}">
					<image :src="wap_h5_kefu_button_icon" mode="widthFix"></image>
				</button>
			</block>
			<block v-else>
				<button plain="true" class="u-go-home2" @tap="onNavRedirect(wap_h5_kefu_form_url)">
					<image :src="wap_h5_kefu_button_icon" mode="widthFix"></image>
				</button>
			</block>
			
		</view>
		
	</view>
</template>

<script>
/**
 * 右下角客服按钮组件
 * 
 * 参数：
 * 3、wap_h5_show_kefu_button  是否显示客服按钮 0 不显示  1 显示
 * 4、wap_h5_kefu_bg_no_color_flag  是否铺满背景色  0  铺满背景颜色  1 不设置背景颜色
 * 5、wap_h5_kefu_bg_color  背景颜色的RGB值
 * 
 * 6、wap_h5_kefu_button_icon 客服图标（图片）的URL
 * 7、wap_h5_kefu_form_url 客服图标点击后跳转的路径，如果是电话号码，格式为“tel:13112341234”
 * 
 */	
	export default {
		name: 'abot-kefu-button',	
		props: {			
			wap_h5_show_kefu_button: { type: Number, default: 0 },
			wap_h5_kefu_bg_no_color_flag:  { type: Number, default: 1 },
			wap_h5_kefu_bg_color: { type: String, default: '#000000' },
			
			wap_h5_kefu_button_icon: { type: String, default: '' },
			wap_h5_kefu_form_url: { type: String, default: '' },
		},
		data(){
			return {
				imgheights:[],
				current:0,
				box_shadow_value: '0rpx 8rpx 25rpx rgba(0, 0, 0, 0.2)',
				
				
			}
		},
		onLoad() {
			var that = this;
	
		},
		methods:{
			onNavRedirect:function(new_url){
				if(!new_url){
					return;
				}
				
				this.$emit('onNavRedirect', new_url);
			},
			
			
			
		}
		
	}
</script>

<style>
	
	.u-tap-btn {
	  position:fixed;
	  right:20rpx;
	  bottom:150rpx;
	  border:0rpx;
	}
	
	.u-go-home2 {
	  display:flex;
	  flex-direction:row;
	  justify-content:center;
	  border-radius:80rpx;
	  width:110rpx;
	  height:110rpx;
	  border:0px solid #eee;
	  font-size:20rpx;
	  box-shadow:0px 4rpx 8rpx rgba(0,0,0,0.35);
	  z-index:2;
	  opacity:1;
	  margin-bottom:20rpx;
	  background:#44b549;
	  align-items:center;
	
	}
	
	.u-go-home2 image{
	  height: 80rpx;
	  width: 80rpx;
	  position: absolute;
	  left: 16rpx;
	}
	
	.button-hover {
	  color:rgba(0, 0, 0, 0.6);
	}
	
	.u-go-home2 .iconfont {
	  font-size:1.5rem;
	  color:#FFF;
	  align-self:center;
	  border:0px solid #eee;
	}
	
	
	.u-tap-btn{
		z-index:100;
	}
	.u-go-home2{
		border: none !important;
	}
	
	

</style>
