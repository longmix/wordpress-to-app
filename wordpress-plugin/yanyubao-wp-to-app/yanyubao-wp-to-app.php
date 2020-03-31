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


define('WP_APP_PLUGIN_YANYUBAO_DIR', plugin_dir_path(__FILE__));

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

include(WP_APP_PLUGIN_YANYUBAO_DIR . 'yanyubao-wp-config.php');


//======以下是增加新 REST 接口======

//评论和点赞
include(WP_APP_PLUGIN_YANYUBAO_DIR . 'yanyubao-wp-comment.php');    // 微信提交评论
//返回APP和小程序是否开启评论，评论开关在  yanyubao-wp-config.php 中设置
include(WP_APP_PLUGIN_YANYUBAO_DIR . 'yanyubao-wp-enablecomment.php');    
include(WP_APP_PLUGIN_YANYUBAO_DIR . 'yanyubao-wp-post-like.php');    // 点赞






