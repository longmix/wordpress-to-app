<?php
 // 微信小程序设置菜单
add_action('admin_menu', 'wp_to_app_create_menu');
function wp_to_app_create_menu() {
    // 创建新的顶级菜单
    add_options_page('WP转APP设置', 'WP转APP设置', 'administrator', 'wp_to_app_slug', 'wp_to_app_settings_page', '');
    // 调用注册设置函数
    add_action( 'admin_init', 'register_wp_to_app_settings' );
}

function register_wp_to_app_settings() {
    // 注册设置
    register_setting( 'wp-to-app-group', 'yanyubao_sellersn' );
    register_setting( 'wp-to-app-group', 'yanyubao_category_default_cover' );
    register_setting( 'wp-to-app-group', 'wf_poster_imageurl' );
    register_setting( 'wp-to-app-group', 'yanyubao_to_app_shenhe_comment_option' );
    register_setting( 'wp-to-app-group', 'yanyubao_to_app_wxa_show_qrcode' );
    register_setting( 'wp-to-app-group', 'yanyubao_to_app_wxa_appid' );
    register_setting( 'wp-to-app-group', 'yanyubao_to_app_wxa_page_path' );
       
    
    
}

function wp_to_app_settings_page() {
	?>
<div class="wrap">
<h2>网站转APP和小程序设置</h2>
<form method="post" action="options.php">
    <?php settings_fields( 'wp-to-app-group' ); ?>
    <?php do_settings_sections( 'wp-to-app-group' ); ?>
    <table class="form-table">
        <tr valign="top">
        	<th scope="row">延誉宝商户编号</th>
	        <td><input type="text" name="yanyubao_sellersn" style="width:200px" value="<?php echo esc_attr( get_option('yanyubao_sellersn') ); ?>" />
	        	<br/>必须设置，评论、点赞以及用户中心和会员卡功能需要。<a href="https://yanyubao.tseo.cn/Supplier/Login/login.html" target="_blank"><span style="color: blue">点击登录或注册查看商户编号</span></a>
	        </td>
        </tr>
         
         <!-- 
        <tr valign="top">
        <th scope="row">匿名评论</th>
        <td>

            <?php

            $wp_enable_comment_without_openid_check = get_option('wp_enable_comment_without_openid_check');            
            $checkbox=empty($wp_enable_comment_without_openid_check)?'':'checked';
            echo '<input name="wp_enable_comment_without_openid_check"  type="checkbox"  value="1" '.$checkbox. ' />';

                       ?>允许
        </td>
        </tr> 
         -->    

        <tr valign="top">
        	<th scope="row">文章分类默认封面</th>
        	<td><input type="text" name="yanyubao_category_default_cover" style="width:600px" value="<?php echo esc_attr( get_option('yanyubao_category_default_cover') ); ?>" />
        		<br />请输完整的图片地址，例如：<span style="color: blue">http://www.tseo.cn/wp-content/uploads/2019/12/Tu_Pian_1.png</span>
        		<br />在“设置后台>>文章>>分类目录”中，编辑具体某个分类，“APP封面”字段中分别定义文章分类封面。</span>
        		<br />如果文章中没有图片，显示在文章列表中的图片也是这里设置的封面。</span>
        		<br />封面尺寸没有具体要求，只要宽高比例统一即可，建议400*400，或者500*300像素。</span>
        	</td>
        </tr>
        
        <!-- 
        <tr valign="top">
        <th scope="row">海报图片默认地址</th>
        <td><input type="text" name="wf_poster_imageurl" style="width:600px" value="<?php echo esc_attr( get_option('wf_poster_imageurl') ); ?>" />
        <br/>(请输完整的图片地址,例如:<span style="color: blue">https://www.watch-life.net/images/2017/06/winxinapp-wordpress-watch-life-new-700.jpg</span>)</td>
        </tr> -->
        
        
        <tr valign="top">
        	<th scope="row">审核评论</th>
	        <td>
	
	            <?php
	
	            $yanyubao_to_app_shenhe_comment_option = get_option('yanyubao_to_app_shenhe_comment_option');            
	            $checkbox = empty($yanyubao_to_app_shenhe_comment_option)?'':'checked';
	            echo '<input name="yanyubao_to_app_shenhe_comment_option"  type="checkbox"  value="1" '.$checkbox. ' />';
	            
	
	                       ?>审核APP和小程序中文章详情页的评论功能提交的内容
	        </td>
        </tr> 
        
        
        
        
        <tr valign="top">
        	<th scope="row">微信小程序SEO</th>
        	<td>微信小程序的SEO入口为sitemap.json，小程序源代码中已经集成了格式化完成的站点导航设置，不建议修改。
        	</td>
        </tr>
        
        <tr valign="top">
        	<th scope="row">百度小程序SEO</th>
        	<td>百度小程序的SEO，除了在站长平台做Web页面与小程序页面的映射关系之外，每个页面如果提交了setPageInfo信息，效果会更好。
        		<br />文章页面设置setPageInfo信息，需要做在文章编辑页面，设置“自定义栏目”，名称和值如下：
        		<br><br>
        		<div><b>mp_baidu_seo_articleTitle</b>：<i>文章【内容】标题（适用于当前页面是图文、视频类的展示形式，文章标题需要准确标识当前文章的主要信息点；至少 6 个字，不可以全英文。）。</i>
        			<br><b>mp_baidu_seo_releaseDate</b>：<i>原始发布时间（年-月-日 时:分:秒 带有前导零），如：2010-07-01 16:30:30。不填写默认为文章发布时间。</i>
        			<br><b>mp_baidu_seo_image</b>：<i>图片线上地址，用于信息流/搜索等流量场景分发、用户收藏后的页面封面显示，展现时有图片可提升用户点击率。最多设置 3 张，图片必须为页面内图片。单张图片最大 2M ；封面图尺寸：宽>=375px ，高>=250px ，图片宽高比例 3：2 为佳，不是这个尺寸百度APP会自动裁剪。多张图的网址用空格分开。</i>
        			<br><b>mp_baidu_seo_video</b>：<i>当前页面包含视频信息时 video 为必填字段。如果有视频，请这样填写<pre>[{
                url: 'https://www.baidu.com/mx/v12.mp4',
                duration: '100',
                image: 'https://ms-static.cdn.bcebos.com/miniappdocs/img/image-scaleToFill.png'
            }]。</pre>   url为视频网址，duration为视频时长（单位：秒），image为视频封面网址。</i>
        			<br>
        			<br>以上字段如果不填写，不影响正常的内容展示。
        		</div>
        	</td>
        </tr>
        <tr valign="top">
        	<th scope="row">文章列表中突出显示</th>
        	<td>如果要让某篇文章的首图在文章列表中独占一行，在文章的自定义字段中增加“show_style_in_list_of_app”，值为“bigimg”。
        		<br />同时增加自定义字段“show_style_bigimg_url”，值为要显示的图片网址；如果没有设置，则会使用自定义字段“post_thumbnail_image_624”中的图片网址。
        		<br />如果要实现三张连图、两张连图，或者显示作者头像和名称等效果，建议直接拼图或PS处理“show_style_bigimg_url”对应的图片。
        		<br />默认使用文章标题，如果自定义标题，请填写字段“show_style_bigimg_title”；图片下方如果不显示标题，将这个字段的值设置为“none”。
        	</td>
        </tr>
        
        <tr valign="top">
        	<th scope="row">微信小程序码</th>
	        <td>
	
	            <?php
	
	            $yanyubao_to_app_wxa_show_qrcode =get_option('yanyubao_to_app_wxa_show_qrcode');            
	            $checkbox = empty($yanyubao_to_app_wxa_show_qrcode)?'':'checked';
	            echo '<input name="yanyubao_to_app_wxa_show_qrcode"  type="checkbox"  value="1" '.$checkbox. ' />';
	            
	
	                       ?>显示在文章详情页底部
	                       <br/>并不是所有Wordpress模板都支持此选项。
	        </td>
        </tr> 
        
        <tr valign="top">
        	<th scope="row">微信小程序Appid</th>
	        <td><input type="text" name="yanyubao_to_app_wxa_appid" style="width:200px" value="<?php echo esc_attr( get_option('yanyubao_to_app_wxa_appid') ); ?>" />
	        	<br/>小程序必须授权给延誉宝CMS生成小程序码。
	        </td>
        </tr>
        <tr valign="top">
        	<th scope="row">微信小程序文章详情页路径</th>
	        <td><input type="text" name="yanyubao_to_app_wxa_page_path" style="width:200px" value="<?php echo esc_attr( get_option('yanyubao_to_app_wxa_page_path') ); ?>" />
	        	<br/>默认为 pages/wordpress/detail，如果不是使用Wordpress转小程序项目，或者在小程序源代码中自定义了，则按照实际情况填写。
	        </td>
        </tr>
        
        
               
    </table>
    
    <?php submit_button();?>
</form>
</div>
<?php }  






/**
 * 
 */

//正常情况下Wordpress不允许开启匿名评论，所以需要执行这个文件开启，这样才能控制  yanyubao-wp-enablecomment.php 里面的开关

//为了安全，WordPress 默认是不允许开启匿名评论。但可以通过如下代码去hack 下
//开启匿名评论后，请自行采取一些措施确保该接口不会被滥用
//启用匿名评论
// REAT API 允许匿名评论
function abot_wp2app_set_rest_allow_anonymous_comments() {
	return true;
}
add_filter('rest_allow_anonymous_comments','abot_wp2app_set_rest_allow_anonymous_comments');



/**
 * 
 */
//======扩展REST API接口返回的对象的属性==
// 自定义文章输出的字段

//获取文章的缩略图，评论数目，分类名称
add_filter('rest_prepare_post', 'abot_wp2app_custom_fields_rest_prepare_post', 10, 3 );

//在rest api 增加显示字段
// 2021.4.30.  https://www.abot.cn/wp-json/wp/v2/posts/2660   这篇文章中含有视频
function abot_wp2app_custom_fields_rest_prepare_post( $data, $post, $request) {

	global $wpdb;

	$_data = $data->data;
	//$post_id = ( null === $post_id ) ? get_the_ID() : $post_id;
	$post_id =$post->ID;

	//$content = get_the_content();
	$content = $_data['content']['rendered'];
	 
	$siteurl = get_option('siteurl');
	$upload_dir = wp_upload_dir();
	 
	//$content = str_replace( 'http:'.strstr($siteurl, '//'), 'https:'.strstr($siteurl, '//'), $content);
	//$content = str_replace( 'http:'.strstr($upload_dir['baseurl'], '//'), 'https:'.strstr($upload_dir['baseurl'], '//'), $content);

	//$_data['siteurl']=$content;
	
	
	
	//=== 2021.4.30. 如果内容中包含视频，则去掉视频==
	if(preg_match_all('/<video .*?>.*?<a .*?href="(.*?)".*?>.*?<\/a><\/video>/is', $content, $video_list)){ 
	/* if(preg_match_all('/<video[^<>]*src=[\"]([^\"]+)[\"][^<>]*>/im', $content, $video_list)){ */
	/* if(preg_match_all('/<a .*?href="(.*?)".*?>/is', $content, $video_list)){ */
		
		//$_data['video_list'] = $video_list;
		//将视频播放组件替换成链接
		$str_old = array();
		$str_new = array();
		foreach ($video_list[0] as $tt01){
			$str_old[] = $tt01;
		}
		foreach ($video_list[1] as $tt01){
			$str_new[] = '复制视频网址在浏览器中观看：<a href="'.$tt01.'">'.$tt01.'</a>';
		}
		
		//$content = str_replace($str_old, $str_new, $content);
		$_data['content']['rendered'] = str_replace($str_old, $str_new, $_data['content']['rendered']);
		
	}
	
	//$_data['video_list000'] = 'aaaaa';
	//$_data['content001'] = $content;
	//====  如果包含音频  ======
	if(preg_match_all('/<audio .*?>.*?<a .*?href="(.*?)".*?>.*?<\/a><\/audio>/is', $content, $video_list)){		
		$str_old = array();
		$str_new = array();
		foreach ($video_list[0] as $tt01){
			$str_old[] = $tt01;
		}
		foreach ($video_list[1] as $tt01){
			$str_new[] = '复制音频网址在浏览器中收听：<a href="'.$tt01.'">'.$tt01.'</a>';
		}
	
		//$content = str_replace($str_old, $str_new, $content);
		$_data['content']['rendered'] = str_replace($str_old, $str_new, $_data['content']['rendered']);
	
	}
	
	//============= End ===============
	
	
	

	$images = abot_wp2app_getPostImages($content, $post_id);
	
	$_data['post_thumbnail_image']=$images['post_thumbnail_image'];
	$_data['content_first_image']=$images['content_first_image'];
	//$_data['content_first_image11111']=$images['content_first_image'];
	$_data['post_medium_image_300']=$images['post_medium_image_300'];
	$_data['post_thumbnail_image_624']=$images['post_thumbnail_image_624'];
	$comments_count = wp_count_comments($post_id);

	$pageviews = (int) get_post_meta( $post_id, 'views',true);
	$_data['pageviews'] = $pageviews;

	$_data['total_comments']=$comments_count->total_comments;
	$category =get_the_category($post_id);
	$_data['category_name'] =$category[0]->cat_name;
	/*
	 $content  =get_the_content();
	 $_content['rendered'] =$content;
	 $_data['content']= $_content;
	 */
	
	
	//2021.4.1. 将文章内容转成纯文本
	$_data['content_text'] = strip_tags($content);
	$_data['content_text'] = str_replace(array('&nbsp;'), array(''), $_data['content_text']);
	
	//2021.4.1. 标签ID转成名称
	$_data['tags_name'] = array();
	foreach ($_data['tags'] as $ttt){
		$t2 = get_tag($ttt);
		if($t2){
			$_data['tags_name'][] = $t2->name;
		}
		
	}
	
	


	$like_count = $wpdb->get_var("SELECT COUNT(1) FROM ".$wpdb->postmeta." where meta_value='like' and post_id=".$post_id);
    $_data['like_count']= $like_count;
    
    $params = $request->get_params();
    
    if ( isset( $params['id'] ) ) {

    	$sql="SELECT meta_key , (SELECT display_name from ".$wpdb->users." WHERE user_login=substring(meta_key,2)) as avatarurl FROM ".$wpdb->postmeta." where meta_value='like' and post_id=".$post_id;
        
    	$likes = $wpdb->get_results($sql);
        
    	$avatarurls =array();
    	foreach ($likes as $like) {
    		$_avatarurl['avatarurl']  =$like->avatarurl;
    		$avatarurls[] = $_avatarurl;
    	}

    	$_data['avatarurls']= $avatarurls;

	}
	else
	{
    	unset($_data['content'] );
    	//unset($_data['author']);
    	//unset($_data['excerpt']);
    }

    //去除html标签
	$_data['excerpt']['rendered'] = preg_replace( "/<\/?[^>]+>/i", '', $_data['excerpt']['rendered']);

	$category_id = $category[0]->term_id;
	
	$next_post = get_next_post($category_id, '', 'category');
	
	$previous_post = get_previous_post($category_id, '', 'category');
	
	$_data['next_post_id'] = !empty($next_post->ID)?$next_post->ID:null;
	$_data['next_post_title'] = !empty($next_post->post_title)?$next_post->post_title:null;
	$_data['previous_post_id'] = !empty($previous_post->ID)?$previous_post->ID:null;
	$_data['previous_post_title'] = !empty($previous_post->post_title)?$previous_post->post_title:null;
	
	
	$_data['date_to_show'] = date('Y-m-d', strtotime($_data['date']));
	
	
	

	//==== 2021.2.20. 补充几个SEO相关的参数 ====
	$seo_keywords = get_post_meta($post_id, 'keywords', true);
	if(!$seo_keywords){
		$seo_keywords = $_data['title']['rendered'];
	}
	$seo_description = get_post_meta($post_id, 'description', true);
	if(!$seo_description){
		$seo_description = $_data['excerpt']['rendered'];
	}
	
	$_data['seo_keywords'] = $seo_keywords;
	$_data['seo_description'] = $seo_description;
	$_data['seo_datetime'] = date('Y-m-d H:i:s', strtotime($_data['date']));
	
	//百度小程序优化相关
	
	$_data['mp_baidu_seo_articleTitle'] = get_post_meta($post_id, 'mp_baidu_seo_articleTitle', true);
	if(!$_data['mp_baidu_seo_articleTitle']){
		$_data['mp_baidu_seo_articleTitle'] = $_data['title']['rendered'];
	}
	
	$_data['mp_baidu_seo_releaseDate'] = get_post_meta($post_id, 'mp_baidu_seo_releaseDate', true);
	if(!$_data['mp_baidu_seo_releaseDate']){
		$_data['mp_baidu_seo_releaseDate'] = $_data['seo_datetime'];
	}
	
	
	//============= End ==============
	
	


	//2021.11.20. 读取后台设置的文章列表的显示式样  show_style_in_list_of_app = normal/bigimg/
	$_data['show_style_in_list_of_app'] = get_post_meta($post_id, 'show_style_in_list_of_app', true);
	if(!$_data['show_style_in_list_of_app']){
		$_data['show_style_in_list_of_app'] = 'normal';
	}
	if ($_data['show_style_in_list_of_app'] == 'bigimg'){
		
		$_data['show_style_bigimg_url'] = get_post_meta($post_id, 'show_style_bigimg_url', true);
		
		if(!$_data['show_style_bigimg_url'] || (strlen($_data['show_style_bigimg_url']) == 0)){
			$_data['show_style_bigimg_url'] = $_data['post_thumbnail_image_624'];
		}
		
		
		
		$_data['show_style_bigimg_title'] = get_post_meta($post_id, 'show_style_bigimg_title', true);
		
		if(!$_data['show_style_bigimg_title'] || (strlen($_data['show_style_bigimg_title']) == 0)){
			$_data['show_style_bigimg_title'] = $_data['title']['rendered'];
		}
		else if($_data['show_style_bigimg_title'] == 'none'){
			$_data['show_style_bigimg_title'] = '';
		}
	}
	//================ End ==============
	
	
	
	/* 
	unset($_data['featured_media']);
	unset($_data['format']);
	unset($_data['ping_status']);
	unset($_data['template']);
	unset($_data['type']);
			//unset($_data['slug']);
	unset($_data['modified_gmt']);
	unset($_data['date_gmt']);
	
	unset($_data['meta']);
	unset($_data['guid']);
	unset($_data['curies']);
	unset($_data['modified']);
	unset($_data['status']);
	unset($_data['comment_status']);
	unset($_data['sticky']);
	unset($_data['author']);*/

	$data->data = $_data;

	return $data;
}


//======扩展REST API接口返回的对象的属性==
// 自定义评论输出的字段

add_filter('rest_prepare_comment', 'abot_wp2app_custom_fields_rest_prepare_comment', 10, 3 );
//在rest api 增加显示字段
function abot_wp2app_custom_fields_rest_prepare_comment( $data, $comment, $request) {

	global $wpdb;

	$_data = $data->data;
	$comment_id =$comment->comment_ID;
	//$sql  ="SELECT user_id FROM ".$wpdb->comments." where comment_ID=".$comment_id;
	//$userid = $wpdb->get_var($sql);
	 

	$sql  ="SELECT t2.comment_author as parent_name,t2.comment_date  as parent_date ,t1.user_id as user_id,(SELECT t3.meta_value  from ".$wpdb->commentmeta."  t3 where  t1.comment_ID = t3.comment_id  AND t3.meta_key = 'formId')  AS formId  from  ".$wpdb->comments." t1 LEFT JOIN ".$wpdb->comments." t2 on t1.comment_parent=t2.comment_ID  WHERE t1.comment_ID=".$comment_id;

	$comment = $wpdb->get_row($sql);
	$userid=$comment->user_id;
	$parent_name=$comment->parent_name;
	$parent_date=$comment->parent_date;
	$formId=$comment->formId;

	if(empty($formId))
	{
		$formId="";
	}

	if(empty($parent_name))
	{
		$parent_name="";
	}

	if(empty($parent_date))
	{
		$parent_date="";
	}

	$_data['parent_name']=$parent_name;
	$_data['parent_date']=$parent_date;
	$_data['userid']=$userid;
	$_data['formId']=$formId;

	$data->data = $_data;
	return $data;
}


/**
 * 
 */
// 设置分类的微信小程序封面，同时给REST API返回的分类对象增加属性 category_thumbnail_image

//获取分类的封面图片
add_filter('rest_prepare_category', 'abot_wp2app_custom_fields_rest_prepare_category', 10, 3 );

function abot_wp2app_custom_fields_rest_prepare_category( $data, $item, $request ) {
	
	$category_thumbnail_image = get_term_meta($item->term_id,'catcover',true);
	
	if (!$category_thumbnail_image){
		$category_thumbnail_image = get_term_meta($item->term_id,'thumbnail',true);
	}
	
	if (!$category_thumbnail_image){
		$category_thumbnail_image = get_option('yanyubao_category_default_cover');
		if (!$category_thumbnail_image){
			$category_thumbnail_image = 'http://www.tseo.cn/wp-content/uploads/2019/12/Tu_Pian_1.png';
		}
	}

	$data->data['category_thumbnail_image'] = $category_thumbnail_image;
	return $data;
}


/*********   给分类添加APP封面 *********/

add_action( 'category_add_form_fields', 'wp2app_new_term_catcover_field' );
function wp2app_new_term_catcover_field() {
    wp_nonce_field( basename( __FILE__ ), 'wp2app_app_term_catcover_nonce' ); ?>

    <div class="form-field wp2app-app-term-catcover-wrap">
        <label for="wp2app-app-term-catcover">APP封面</label>
        <input type="url" name="wp2app_app_term_catcover" id="wp2app-app-term-catcover"  class="type-image regular-text" data-default-catcover="" />
    </div>
<?php }
add_action( 'category_edit_form_fields', 'wp2app_edit_term_catcover_field' );
function wp2app_edit_term_catcover_field( $term ) {
    $default = '';
    $catcover   = get_term_meta( $term->term_id, 'catcover', true );

    if ( ! $catcover )
        $catcover = $default; ?>

    <tr class="form-field wp2app-app-term-catcover-wrap">
        <th scope="row"><label for="wp2app-app-term-catcover">APP封面</label></th>
        <td>
            <?php echo wp_nonce_field( basename( __FILE__ ), 'wp2app_app_term_catcover_nonce' ); ?>
            <input type="url" name="wp2app_app_term_catcover" id="wp2app-app-term-catcover" class="type-image regular-text" value="<?php echo esc_attr( $catcover ); ?>" data-default-catcover="<?php echo esc_attr( $default ); ?>" />
        </td>
    </tr>
<?php }

add_action( 'create_category', 'wp2app_app_save_term_catcover' );
add_action( 'edit_category',   'wp2app_app_save_term_catcover' );

function wp2app_app_save_term_catcover( $term_id ) {
    if ( ! isset( $_POST['wp2app_app_term_catcover_nonce'] ) || ! wp_verify_nonce( $_POST['wp2app_app_term_catcover_nonce'], basename( __FILE__ ) ) )
        return;

    $catcover = isset( $_POST['wp2app_app_term_catcover'] ) ? $_POST['wp2app_app_term_catcover'] : '';

    if ( '' === $catcover ) {
        delete_term_meta( $term_id, 'catcover' );
    } else {
        update_term_meta( $term_id, 'catcover', $catcover );
    }
}

/*********  *********/


/**
 * 
 */

//禁止在rest api里显示用户列表
/*
add_filter( 'rest_endpoints', function( $endpoints ){
	if ( isset( $endpoints['/wp/v2/users'] ) ) {
		unset( $endpoints['/wp/v2/users'] );
	}
	if ( isset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] ) ) {
		unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
	}
	return $endpoints;
});
*/







//================= 2021.10.1 重新获取posts的参数，增加只是filter以及 category_name ======
// http://www.tseo.cn/wp-json/wp/v2/posts?per_page=10&page=1&orderby=date&order=desc&category_name=tips
// https://cms.weiduke.com/openapi/Wordpress/restapi/wp-json/wp/v2/posts?per_page=10&page=1&orderby=date&order=desc&sellerid=pQNNmSkaq&category_name=ebiz
/**
 * Plugin Name: WP REST API filter parameter
 * Description: This plugin adds a "filter" query parameter to API post collections to filter returned results based on public WP_Query parameters, adding back the "filter" parameter that was removed from the API when it was merged into WordPress core.
 * Author: WP REST API Team
 * Author URI: http://v2.wp-api.org
 * Version: 0.1
 * License: GPL2+
 * 
 * https://github.com/WP-API/rest-filter
 * 
 **/

add_action( 'rest_api_init', 'rest_api_filter_add_filters' );

/**
 * Add the necessary filter to each post type
**/
function rest_api_filter_add_filters() {
	foreach ( get_post_types( array( 'show_in_rest' => true ), 'objects' ) as $post_type ) {
		add_filter( 'rest_' . $post_type->name . '_query', 'rest_api_filter_add_filter_param', 10, 2 );
	}
}

/**
 * Add the filter parameter
 *
 * @param  array           $args    The query arguments.
 * @param  WP_REST_Request $request Full details about the request.
 * @return array $args.
 **/
function rest_api_filter_add_filter_param( $args, $request ) {
	
	//print_r($request['category_name']); exit;
	//print_r($request['filter']);  print_r($request); exit;
	
	
	//$args['category_name'] = '产品展示';
	
	//2021.10.1. 这里的 category_name 是  categorySlug的值，是分类的别名，不是分类的名称
	if ($request['category_name']) {
		$args['category_name'] = $request['category_name'];
	}
	//
	
	
	
	// Bail out if no filter parameter is set.
	if ( !empty( $request['filter'] ) &&  is_array( $request['filter'] ) ) {
		$filter = $request['filter'];
	
		if ( isset( $filter['posts_per_page'] ) && ( (int) $filter['posts_per_page'] >= 1 && (int) $filter['posts_per_page'] <= 100 ) ) {
			$args['posts_per_page'] = $filter['posts_per_page'];
		}
	
		global $wp;
		$vars = apply_filters( 'rest_query_vars', $wp->public_query_vars );
	
		// Allow valid meta query vars.
		$vars = array_unique( array_merge( $vars, array( 'meta_query', 'meta_key', 'meta_value', 'meta_compare' ) ) );
	
		foreach ( $vars as $var ) {
			if ( isset( $filter[ $var ] ) ) {
				$args[ $var ] = $filter[ $var ];
			}
		}
	}

	
	return $args;
}
//================= 2021.10.1 重新获取posts的参数， End ======================




