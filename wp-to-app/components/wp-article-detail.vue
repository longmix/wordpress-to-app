<template>
	<view class="content-article-detail">   <!-- :style="{display:display}" -->
		<view class="entry-title"><text selectable="true" user-select="true">{{article_title}}</text></view>
		<view class="entry-date" v-if="attr_list != ''">		
			<image src="../static/wp-article-img/calendar.png" style="height:24rpx;width:24rpx;"></image>
			<text class="entry-date-text">{{attr_list.date_to_show}}</text>
			<block ><!-- v-if="detail.category_name != null" -->
				<image src="../static/wp-article-img/category.png" style="height:24rpx;width:24rpx;margin-left: 20rpx;"></image>
				<text class="entry-icon-text">{{attr_list.category_name}}</text>
			</block>
			<image src="../static/wp-article-img/comments.png" style="height:24rpx;width:24rpx;margin-left: 20rpx;"></image>
			<text class="entry-icon-text">{{attr_list.total_comments}}</text>
			<image src="../static/wp-article-img/pageviews.png" style="height:24rpx;width:24rpx;margin-left: 20rpx;"></image>
			<text class="entry-icon-text">{{attr_list.pageviews}}</text>
			<image src="../static/wp-article-img/home-like.png" style="height:24rpx;width:24rpx;margin-left: 20rpx;"></image>
			<text class="entry-icon-text">{{attr_list.like_count}}</text>
		</view>
			
		<view class="entry-summary">
		<!-- #ifdef MP-ALIPAY -->
					<rich-text :nodes="content_array_html"></rich-text>
		<!-- #endif -->
		
		<!-- #ifdef H5 -->
					<view v-html="content_v_html" ></view>
		<!-- #endif -->
		
		<!-- #ifndef MP-ALIPAY | H5 -->
					<!-- 富媒体组件 2021.1.18. -->
					<!-- rich-text  和 v-html 都有各自的优缺点 -->
					<u-parse v-if="content_html" 
						:content="content_html" 
						@preview="index_rich_html_preview_image" 
						@navigate="index_rich_html_click_link" />
		<!-- #endif -->
				</view>		
				
				
	</view>
	
</template>

<script>
	
	//import uParse from '../../components/gaoyia-parse/parse.vue';

	
	import uParse from '@/components/gaoyia-parse/parse.vue'
		
	
	
	export default {
		name: "wp-article-detail",
		components: {
			uParse
		},		
		props: {
			
			article_title:'',	//文章标题
			content_html:'',	//文章的html内容
			
			content_v_html:'',	//文章的html内容（经过Filter过滤的，在H5中使用
			content_array_html:'',//文章的html内容（经过分析，转成array的。
			attr_list:'',		//文章的一些属性，如发布日期/点赞等
			
		},
		methods:{
			//2021.2.17. 富媒体 链接点击事件
			//富媒体 图片被点击
			index_rich_html_preview_image:function(img_src, e){
				console.log('index_rich_html_preview_image====>>>>>', img_src);
				console.log('index_rich_html_preview_image====>>>>>', e);
			},
			
			//富媒体 链接点击事件
			index_rich_html_click_link:function(new_url, e){
				
				console.log('index_rich_html_click_link====>>>>>', new_url);
				console.log('index_rich_html_click_link====>>>>>', e);
				
				// #ifdef MP-BAIDU
					console.log('index_rich_html_click_link====>>>>>百度小程序不做任何处理');
					return;
				// #endif
				
				this.abotapi.call_h5browser_or_other_goto_url(new_url);
				
				
			},
			
		}
	}
</script>

<style>
	
	@import url("@/components/gaoyia-parse/parse.css");
	
	.content-article-detail {
	  border-bottom: 5rpx solid #eee;
	  margin-bottom: 50rpx;
	}
	.entry-title {
	  font-size: 36rpx;
	  line-height: 60rpx;
	  font-weight: bold;
	  outline: none;
	  color: #3a4040;
	  margin-bottom: 24rpx;
	  padding:25rpx;
	}
	.entry-date {
	  font-size: 24rpx;
	  line-height: 1.6;
	  color: #959595;
	  font-weight: normal;
	  outline: none;
	  margin-bottom: 30rpx;
	  border-bottom:5rpx solid #eee;
	}
	.entry-date-text {
	  margin-left: 10rpx;
	}
	.entry-icon-text {
	  margin-left: 10rpx;
	}
	.entry-summary {
	  font-size: 32rpx;
	  line-height: 64rpx;
	  letter-spacing: 2rpx;
	}
	
	
	
	
	
	
	.entry-summary >>> .article-content-p-css {
		margin-bottom:60rpx;
		word-wrap: break-word;
		white-space: normal;
		word-break: break-all;
	}
	
	.entry-summary >>> .wp-block-image {
		text-align: center;
	}
	
	.entry-summary >>> .article_blockquote_css {
		margin:20rpx 0 20rpx 0;
		border-left: 6rpx solid #999;
		padding-left: 10rpx;
		font-size:25rpx;
	}
	
	.entry-summary >>> .article_pre_css {
		white-space:pre;
	}
	
	
	
	
	/* 需要使用CSS穿透，在H5中才会生效。 */
	.entry-summary >>> .content-article-detail_h2 {
		margin: 30rpx 0;
		font-size:32rpx;
		border-left:10rpx solid #3369e8;
		padding:0rpx 15rpx;
	}
	
	
</style>
