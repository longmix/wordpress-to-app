<template>
	<view>
		<swiper @change="bindchange" indicator-dots="true" autoplay="true"
						interval="5000" duration="500" 
						class="swiper-box"
						:style="{height:imgheights[current] + 'rpx', 
							borderRadius:border_radius, 
							width:swiper_width_percent_value+'%',
							boxShadow:(show_bottom_shadow==0)?'0rpx':box_shadow_value}">
					<block v-for="(item, index) in imgUrls" :key="index">
					  <swiper-item>
						<image :src="item.image"  :data-id='index' mode="widthFix"  
							class="slide-image" 
							@load='imageLoad'  @click="goto_url" :data-url="item.url"/>
					  </swiper-item>
					</block>
		</swiper>
	
	</view>
</template>

<script>
/**
 * 滚动广告图片组件
 * 
 * 参数：
 * 1、imgUrls 图片和对应的链接列表，格式举例： 
 * 		[{"image":"https:\/\/saas.tseo.cn\/staticsvc\/uploads\/2019\/09\/26\/ba1ff94fa4b788912fc2d08e818c00e91443.png","url":"\/pages\/welcome_page\/welcome_page?imgid=7967&parentid=106&platform=cms"},{"image":"https:\/\/saas.tseo.cn\/staticsvc\/uploads\/2021\/09\/15\/ec323aaf91ece312dc3622918d1bdfe19608.jpg","url":"\/pages\/help_detail\/help_detail?id=682\t"}]
 * 
 * 2、border_radius  圆角的半径值，0为没有圆角
 * 3、swiper_width_percent_value  滚动组件的宽度，填写百分比，例如 90，代表宽度为90%。
 * 4、show_bottom_shadow  底部是否显示阴影  0  不显示  1 显示
 * 5、goto_url  点击图片后的跳转，传回的参数为跳转的路径
 * 
 */	
	export default {
		name: 'swiper-banner',	
		props: {
			// 轮播图片
			imgUrls:{ type: Array, required: true },
			
			border_radius: { type: Number, default: 0 },
			swiper_width_percent_value: { type: Number, default: 100 },
			show_bottom_shadow: { type: Number, default: 0 },
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
			goto_url:function(e){
				var url = e.currentTarget.dataset.url;
				
				if(!url){
					return;
				}
				
				this.$emit('goto_url', url);
			},
			
			imageLoad: function (e) {//获取图片真实宽度
			    var imgwidth = e.detail.width,
			      imgheight = e.detail.height,
			      //宽高比  
			      ratio = imgwidth / imgheight;
				
				  
			    console.log('滚动图片的宽度和高度：' + imgwidth + ', '+ imgheight);
				
			    //计算的高度值  
			    var viewHeight = 750 / ratio;
				
			    var imgheight = viewHeight;
				
				//如果宽度不是 100%，则同比例缩小高度
				imgheight = imgheight * this.swiper_width_percent_value / 100;
				
				
				if(!this.imgheights){
					this.imgheights = [];
				}
				
			    var imgheights = this.imgheights;
				
			    //把每一张图片的对应的高度记录到数组里  
			    imgheights[e.target.dataset.id] = imgheight;
			
			    console.log('当前滚动图片的高度列表：', imgheights);
				
				this.imgheights = imgheights;
			    this.current = e.target.dataset.id;
				
				//强制刷新界面，如果不强制刷新，只有一张图片的时候高度不会自适应
				this.$forceUpdate();
			},
			//轮播图指示器  
			bindchange: function (e) {
				// console.log(e.detail.current)
				this.current = e.detail.current;
			},
			
		}
		
	}
</script>

<style>
	.swiper-box {
		width: 100%;
		/* height: 30.7vw;*/
		overflow: hidden;
		border-radius: 15rpx;
		/*box-shadow: 0rpx 8rpx 25rpx rgba(0, 0, 0, 0.2);*/
		/*兼容ios，微信小程序*/
		position: relative;
		z-index: 1;		
		margin: 0 auto;
	}
	
	.swiper-box swiper {
		width: 100%;

		/* height: 30.7vw; */
		
	}
	
	.swiper-box image {
		width: 100%;
		height: auto;
	}
	
	.swiper-box .indicator {
		position: absolute;
		bottom: 20rpx;
		left: 20rpx;
		background-color: rgba(255, 255, 255, 0.4);
		width: 150rpx;
		height: 5rpx;
		border-radius: 3rpx;
		overflow: hidden;
		display: flex;
	}
	
	.swiper-box .indicator .dots {
		width: 0rpx;
		background-color: rgba(255, 255, 255, 1);
		transition: all 0.3s ease-out;
	}
	
	.swiper-box .indicator .on {
		width: (100%/3);
	}
	
	.slide-image {
	  width: 100%;
	  /*height: 150px;*/
	}
	

</style>
