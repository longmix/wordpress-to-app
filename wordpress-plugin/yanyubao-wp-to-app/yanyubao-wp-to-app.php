<?php
/*
Plugin Name: WP转APP和小程序
Plugin URI: http://www.abot.cn
Description: Wordpress to App and Mini Program from Yanyubao SaaS Cloud Platform. 基于延誉宝SaaS云平台为Wordpress网站提供一键转APP和小程序服务。<a href="options-general.php?page=wp_to_app_slug">点击这里进入设置项</a>。
Version: 1.2
Author: 延誉宝
Author URI: http://www.tseo.cn
License: GPL v3
*/

//Disable error reporting
//error_reporting(0);

//Report runtime errors
error_reporting(E_ERROR | E_PARSE);

//Report all errors
//error_reporting(E_ALL);

define('WP_APP_PLUGIN_YANYUBAO_DIR', plugin_dir_path(__FILE__));



if(!function_exists('abot_wp_log')){
	require_once 'abot_wp_function.php';
}

// 公用函数
include(WP_APP_PLUGIN_YANYUBAO_DIR . 'yanyubao-wp-api.php');    



//=====后台界面=====
//微信小程序配置
//开启匿名评论

//======扩展REST API接口返回的对象的属性==
// 自定义评论输出的字段
// 自定义文章输出的字段

// 设置分类的微信小程序封面，同时给REST API返回的分类对象增加属性 category_thumbnail_image

//禁止在rest api里显示用户列表

//1、后台的设置选项  
//2、重新参数（例如：重写获取posts列表的参数）以及返回内容（例如：重新返回的post内容）的钩子函数
include(WP_APP_PLUGIN_YANYUBAO_DIR . 'yanyubao-wp-config.php');


//======以下是增加新 REST 接口======

//评论和点赞
include(WP_APP_PLUGIN_YANYUBAO_DIR . 'yanyubao-wp-comment.php');    // 微信提交评论
//返回APP和小程序是否开启评论，评论开关在  yanyubao-wp-config.php 中设置
include(WP_APP_PLUGIN_YANYUBAO_DIR . 'yanyubao-wp-enablecomment.php');    
include(WP_APP_PLUGIN_YANYUBAO_DIR . 'yanyubao-wp-post-like.php');    // 点赞



//====以下是补充的一些插件函数

//同步删除微读客的缓存，在Gutenberg编辑器中已经被deprecated。
function my_save_post_to_clean_cache_of_weiduke($post_id, $post=null, $is_update=false) {
	if(!$post){
		return;
	}
	
	if(!$is_update){
		return;
	}
	
	$yanyubao_sellersn = get_option('yanyubao_sellersn');
	
	if(($post_id > 0) && (strlen(yanyubao_sellersn) > 5) ){
		$url = 'http://yanyubao.tseo.cn/index.php/openapi/Wordpress/restapi_cache_delete?sellerid='.$yanyubao_sellersn.'&postid='.$post_id;
		
		abot_wp2app_get_content_post($url);
	}
	
}
add_action( 'save_post', 'my_save_post_to_clean_cache_of_weiduke' );



//2023.4.19. 通过rest api 触发保存事件 （ fire, for save_post hook was deprecated with Gutenberg）
// Fires after a single post is completely created or updated via the REST API
add_action( 'rest_insert_post', 'my_rest_insert_post', 10, 3 );

function my_rest_insert_post( $post, $request, $creating ) {
	// Do something with $post
	
	$post_id = $post->ID;
	
	$yanyubao_sellersn = get_option('yanyubao_sellersn');
	
	if(($post_id > 0) && (strlen(yanyubao_sellersn) > 5) ){
		$url = 'http://yanyubao.tseo.cn/index.php/openapi/Wordpress/restapi_cache_delete?sellerid='.$yanyubao_sellersn.'&postid='.$post_id;
	
		abot_wp2app_get_content_post($url);
	}
	
}

// Fires after a single post is completely inserted via the REST API
add_action( 'rest_after_insert_post', 'my_rest_after_insert_post', 10, 3 );

function my_rest_after_insert_post( $post, $request, $creating ) {
	// Do something with $post
	
	$post_id = $post->ID;
	
	$yanyubao_sellersn = get_option('yanyubao_sellersn');
	
	if(($post_id > 0) && (strlen(yanyubao_sellersn) > 5) ){
		$url = 'http://yanyubao.tseo.cn/index.php/openapi/Wordpress/restapi_cache_delete?sellerid='.$yanyubao_sellersn.'&postid='.$post_id;
	
		abot_wp2app_get_content_post($url);
	}
	
	
}

