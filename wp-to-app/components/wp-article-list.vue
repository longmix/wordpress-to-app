<template>
	<view v-if="articleList">
		<view class="common-list">
			<block v-for="(item,index) in articleList" :key="index">
				<view class="list-item has-img" :index="index" :id="item.id" @click="redictDetail(item)">
					<view class="content-title" v-if="item && item.title">
						<text>{{item.title.rendered}}</text>
					</view>
					<view class="content-date">
						<image src="../static/wp-article-img/calendar.png"></image>
						<text>{{item.date_to_show}}</text>
						<image src="../static/wp-article-img/comments.png"></image>
						<text class="">{{item.total_comments}}</text>
						<image src="../static/wp-article-img/pageviews.png"></image>
						<text class="">{{item.pageviews}}</text>
						<image src="../static/wp-article-img/home-like.png"></image>
						<text class="">{{item.like_count}}</text>
					</view>
					<image :src="item.post_thumbnail_image" mode="aspectFill" class="cover"></image>
				</view>
			</block>
		</view>
		<view class="loadingmore" v-if="articleList.length == 0">
			<view class="no-more">----------无更多文章...---------</view>
		</view>
		
	</view>
	
</template>

<script>
/** 
 * 文章列表组件
 * 
 * 需要在 static目录下放 wp-article-img 这个资源目录中的图片
 * 
 */	
	
	export default {
		name: "wp-article-list",
		props: {
			articleList: '',
			
		},
		methods:{
			redictDetail:function(item){
				
				this.$emit('redictDetail',item);
			}
		}
	}
	
</script>

<style>
	

	/*common list  for  index  list page */
	
	.common-list {
	  margin-bottom: 24upx;
	}
	
	.common-list .list-item {
	  position: relative;
	  border-bottom: 1px solid #eee;
	  padding: 24upx;
	  min-height: 150upx;
	  overflow: hidden;
	}
	
	.common-list .list-item.has-img image.cover {
	  position: absolute;
	  left: 0upx;
	  top: 24upx;
	  width: 150upx;
	  height: 150upx;
	}
	
	.common-list .list-item.has-img .content-title {
	  margin-left: 160upx;
	  height: 80upx;
	  margin-bottom: 20upx;
	}
	
	.common-list .list-item.has-img .content-title text {
	  text-overflow: -o-ellipsis-lastline;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 2;
	  -webkit-box-orient: vertical;
	  font-size: 30upx;
	  line-height: 1.4;
	  font-weight: 400;
	  color: #3a4040;
	}
	
	.common-list .list-item.has-img .content-date {
	  margin-left: 160upx;
	}
	
	.common-list .list-item.has-img .content-date image {
	  width: 24upx;
	  height: 24upx;
	  margin-right: 6upx;
	  vertical-align: middle;
	}
	
	.common-list .list-item .content-date text {
	  color: #959595;
	  margin-right: 32upx;
	  font-size: 20upx;
	  line-height: 1.2;
	  font-weight: normal;
	}
	
	/*common list end */
	
	
	
</style>
